"""D&D API路由"""
import asyncio
import json
import uuid
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from kp.dm_service import dm_chat_stream, dm_narrate_stream
from kp.memory import save_memory, search_memory, get_recent_memories, save_game_state, load_game_state, init_db
from engine.rules_dnd import CLASS_PRESETS, validate_character
from engine.state_directives import DirectiveStreamFilter, apply_directive, parse_state_chunk
from logger import get_logger, new_session

router_dnd = APIRouter(prefix="/api/dnd")
OPENING_TIMEOUT = 30
init_db()

# 对话历史缓存（每局游戏保留最近20轮）
_chat_history: dict[str, list[dict]] = {}
# game_id → session_id 映射
_session_map: dict[str, str] = {}
MAX_HISTORY = 20


def _apply_state_change(chunk: str, state: dict) -> dict:
    """解析并应用旧版 [STATE:tool_name:{...}] 指令。"""
    directive = parse_state_chunk(chunk)
    if directive:
        return apply_directive(state, directive)
    return {"type": "unknown"}


# ============================================================
# 模型
# ============================================================
class CreateDNDRequest(BaseModel):
    player_name: str = "冒险者"
    char_class: str = "战士"
    attr_str: int = 16
    attr_dex: int = 13
    attr_con: int = 15
    attr_int: int = 10
    attr_wis: int = 12
    attr_cha: int = 8
    level: int = 3

class ChatRequest(BaseModel):
    game_id: str
    message: str


# ============================================================
# 开场白上下文
# ============================================================
def _opening_context(name: str, cls: str) -> str:
    return (
        f"你是{name}，一名{cls}。你响应了瓦尔德里王国的悬赏令，来到王冠城。"
        "国王阿尔德温三世神秘沉睡，地下裂开深渊，灰烬之裔涌出。大法师伊瑟拉悬赏一万金币深入地下城。"
        "冒险者公会里，矮人战士【格鲁姆】正在大口喝酒，半精灵游荡者【丽莎】靠在墙角擦刀刃。"
        "法师学徒【塔莉亚】兴奋地望着你——三人都在寻找队友。"
    )


FALLBACK_OPENING = (
    "王冠城的广场上挤满了来自各地的冒险者。王宫高塔投下修长的影子，空气中弥漫着焦躁与期待。\n\n"
    "大法师【伊瑟拉·星语】站在台阶之上，长袍在风中微微飘动。她抬起手，广场瞬间安静。\n"
    "听我说。国王阿尔德温被囚禁在梦境中。深渊就在这座城下。"
    "我需要勇士——赏金一万金币。还有一个承诺。\n\n"
    "她的目光扫过人群，停在你身上。\n\n"
    "你身后的矮人战士【格鲁姆】把酒杯重重砸在桌上：算我一个！\n"
    "半精灵【丽莎】冷笑一声靠在柱子上。法师学徒【塔莉亚】的眼睛在发光。\n\n"
    "[HINTS:接过伊瑟拉的招募令|去冒险者公会注册|和格鲁姆聊聊地城|查看丽莎的装备]"
)


# ============================================================
# API端点
# ============================================================
@router_dnd.post("/game/create")
async def create_dnd_game(req: CreateDNDRequest):
    gid = str(uuid.uuid4())[:8]
    preset = CLASS_PRESETS.get(req.char_class, CLASS_PRESETS["战士"])

    state = {
        "player_name": req.player_name,
        "char_class": req.char_class,
        "level": req.level,
        "current_area": "王冠城·中央广场",
        "cleared_levels": 0,
        "str": req.attr_str, "dex": req.attr_dex, "con": req.attr_con,
        "int": req.attr_int, "wis": req.attr_wis, "cha": req.attr_cha,
        "current_hp": preset["hp"], "max_hp": preset["hp"], "ac": preset["ac"],
        "atk_bonus": preset.get("atk_bonus", 5),
        "gold": 200,
        "inventory": "长剑,冒险者工具包,治疗药水x2",
        "gm_hp": 52, "gm_trust": 60, "gm_alive": True,
        "ls_hp": 38, "ls_trust": 45, "ls_alive": True,
        "tl_hp": 24, "tl_trust": 75, "tl_alive": True,
        "last_event": "游戏开始",
    }
    save_game_state(gid, state)
    save_memory(gid, f"游戏开始。{req.player_name}，{req.char_class}，响应悬赏来到王冠城。")

    prompt = _opening_context(req.player_name, req.char_class) + "\n\n请以DM身份描述王冠城的开场景象，介绍NPC同伴，引导玩家开始冒险。"

    try:
        opening = ""
        async for chunk in asyncio.wait_for(dm_narrate_stream(prompt, state), timeout=OPENING_TIMEOUT):
            opening += chunk
        if not opening.strip():
            opening = FALLBACK_OPENING
    except:
        opening = FALLBACK_OPENING

    # 初始化对话历史
    _chat_history[gid] = [
        {"role": "assistant", "content": opening}
    ]

    # 创建日志文件（时间戳命名）
    sid, log = new_session(
        req.player_name, req.char_class,
        {"attr_str": req.attr_str, "attr_dex": req.attr_dex, "attr_con": req.attr_con,
         "attr_int": req.attr_int, "attr_wis": req.attr_wis, "attr_cha": req.attr_cha},
        opening
    )
    _session_map[gid] = sid

    return {"game_id": gid, "session_id": sid, "opening": opening, "state": state}


@router_dnd.get("/game/{game_id}/state")
async def get_state(game_id: str):
    state = load_game_state(game_id)
    if not state: raise HTTPException(404, "游戏不存在")
    return {"game_id": game_id, "state": state}


@router_dnd.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    state = load_game_state(req.game_id)
    if not state: raise HTTPException(404, "游戏不存在")

    recent = get_recent_memories(req.game_id)
    ctx = search_memory(req.game_id, req.message, n_results=3)

    async def gen():
        full = ""
        systems: list[str] = []
        directive_filter = DirectiveStreamFilter()

        # 获取日志器并立即写入玩家输入
        sid = _session_map.get(req.game_id, req.game_id)
        log = get_logger(sid)
        log.log_player(req.message)

        # 获取历史对话
        history = _chat_history.get(req.game_id, [])
        if len(history) > MAX_HISTORY:
            history = history[-MAX_HISTORY:]

        try:
            async for chunk in dm_chat_stream(req.message, state, history, ctx + recent):
                if chunk.startswith("[STATE:"):
                    change = _apply_state_change(chunk, state)
                    systems.append(chunk)
                    yield f"data: {json.dumps({'type':'state_update','content':change}, ensure_ascii=False)}\n\n"
                elif chunk.startswith("[SYSTEM:"):
                    systems.append(chunk)
                    yield f"data: {json.dumps({'type':'system','content':chunk}, ensure_ascii=False)}\n\n"
                else:
                    narrative, directives = directive_filter.feed(chunk)
                    for directive in directives:
                        change = apply_directive(state, directive)
                        systems.append(directive.raw)
                        yield f"data: {json.dumps({'type':'state_update','content':change}, ensure_ascii=False)}\n\n"
                    if narrative:
                        full += narrative
                        yield f"data: {json.dumps({'type':'narrative','content':narrative}, ensure_ascii=False)}\n\n"

            narrative, directives = directive_filter.flush()
            for directive in directives:
                change = apply_directive(state, directive)
                systems.append(directive.raw)
                yield f"data: {json.dumps({'type':'state_update','content':change}, ensure_ascii=False)}\n\n"
            if narrative:
                full += narrative
                yield f"data: {json.dumps({'type':'narrative','content':narrative}, ensure_ascii=False)}\n\n"

            # DM说完一段 → 写入日志（附带系统事件）
            log.log_dm(full, systems)

            # 保存对话历史
            history.append({"role": "user", "content": req.message})
            history.append({"role": "assistant", "content": full})
            if len(history) > MAX_HISTORY:
                history = history[-MAX_HISTORY:]
            _chat_history[req.game_id] = history
            # 保存记忆和状态
            save_memory(req.game_id, f"玩家: {req.message}")
            if full: save_memory(req.game_id, f"DM: {full[:200]}")
            state["last_event"] = req.message[:100]
            save_game_state(req.game_id, state)
            yield f"data: {json.dumps({'type':'state_snapshot','content':state}, ensure_ascii=False)}\n\n"
            yield f"data: {json.dumps({'type':'done'})}\n\n"
        except Exception as e:
            if full:
                log.log_dm(full + f"\n[中断: {e}]", systems)
            log.log_error(str(e))
            yield f"data: {json.dumps({'type':'error','content':str(e)}, ensure_ascii=False)}\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream",
        headers={"Cache-Control":"no-cache","Connection":"keep-alive"})


@router_dnd.get("/health")
async def health():
    return {"status": "ok", "game": "D&D 碎冠之影"}
