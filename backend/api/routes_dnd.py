"""D&D API路由"""
import asyncio
import json
import re
import uuid
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from kp.dm_service import dm_chat_stream, dm_narrate_stream
from kp.memory import (
    get_game_memories,
    get_recent_memories,
    init_db,
    list_game_saves,
    load_game_save,
    load_game_state,
    replace_game_memories,
    save_game_slot,
    save_game_state,
    save_memory,
    search_memory,
)
from engine.rules_dnd import CLASS_PRESETS, PROFICIENCY_BONUS, modifier, skill_check, validate_character
from engine.state_directives import DirectiveStreamFilter, apply_directive, parse_state_chunk
from logger import get_logger, new_session

router_dnd = APIRouter(prefix="/api/dnd")
OPENING_TIMEOUT = 30
init_db()
SAVE_SLOT_KEYS = {"slot-1", "slot-2", "slot-3", "slot-4", "slot-5"}

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


class SaveGameRequest(BaseModel):
    slot_key: str
    title: str | None = None
    story: list[dict] = Field(default_factory=list)
    suggestions: list[dict] = Field(default_factory=list)
    active_index: int = 0
    phase: str = "action"


def _validate_slot_key(slot_key: str):
    if slot_key not in SAVE_SLOT_KEYS:
        raise HTTPException(400, "无效的存档位")


# ============================================================
# DC模式预骰
# ============================================================
_ATTR_MAP = {
    "智力": "int", "敏捷": "dex", "力量": "str",
    "感知": "wis", "洞悉": "wis", "魅力": "cha", "体质": "con",
}
_DC_RE = re.compile(r"【(\D+?)DC(\d+)】")


def _preroll_if_dc(message: str, state: dict) -> tuple[str | None, str]:
    """
    检测用户消息中是否包含DC检定标签【属性DC数字】。
    如果有则预骰，返回 (system_event_json, 附带检定结果的增强消息)。
    如果没有则返回 (None, message)。
    """
    match = _DC_RE.search(message)
    if not match:
        return None, message

    attr_name = match.group(1).strip()
    dc = int(match.group(2))
    stat_key = _ATTR_MAP.get(attr_name)
    if not stat_key:
        return None, message

    stat_value = state.get(stat_key, 10)
    stat_mod = modifier(stat_value)
    prof_bonus = state.get("proficiency_bonus", 2)
    result = skill_check(stat_mod, prof_bonus, dc)
    result_dict = result.to_dict()
    result_dict["属性"] = f"{attr_name}(检定)"
    system_event = f"[SYSTEM:skill_check:{json.dumps(result_dict, ensure_ascii=False)}]"

    label = "成功" if result.success else "失败"
    operator = "≥" if result.success else "<"
    enhanced = (
        f"{message}\n"
        f"[系统提示：检定已自动完成——D20={result.roll} 加值+{result.bonus} "
        f"总计={result.total} {operator}DC{dc}，{label}。请基于此检定结果叙事，"
        f"不要再调用skill_check工具。]"
    )
    return system_event, enhanced


# ============================================================
# 开场白上下文
# ============================================================
def _opening_context(name: str, cls: str) -> str:
    return f"""你是{name}，一名{cls}。你响应了瓦尔德里王国的悬赏令，来到王冠城。

【世界观背景——请在叙事中自然融入】
瓦尔德里（Valdris）是北方王国，首都王冠城依山而建。王国曾繁荣两百年，
但三周前新君阿尔德温三世在加冕典礼上陷入魔法沉睡，同一时刻王冠城地下裂开深渊，
涌出名为「灰烬之裔」的暗影生物——它们昼伏夜出，袭击居民，腐蚀土地。
王国大法师伊瑟拉·星语判定：国王灵魂被囚禁在地下城最深处「碎冠之心」中。
王室悬赏一万金币、贵族头衔、以及国王醒来后的一个承诺，各路冒险者因此涌入王冠城。

【叙事节奏——必须循序渐进，严禁仓促】
第一步·王国氛围（40-60字）：从王冠城的整体氛围写起——晨雾中的山城、
不安的市民、街头张贴的泛黄悬赏令、远方隐约的地裂痕迹。让玩家感受到这是一个陷入危机的王国。
第二步·大法师出场（40-60字）：自然过渡到王宫前厅——人群聚集，
大法师伊瑟拉从台阶上缓步走出。先用环境烘托伊瑟拉的出场（钟声、安静的人群、长袍上的魔法纹路），
再让伊瑟拉开口。伊瑟拉语气中应带有沉重与隐忧，暗示事情不止悬赏那么简单。
第三步·伊瑟拉发布委托（50-80字）：伊瑟拉宣布国王沉睡、深渊裂开、碎冠之心的真相，
悬赏一万金币。重点展现伊瑟拉「知情人却不能说太多」的矛盾感。
第四步·冒险者公会（40-60字）：场景过渡到公会大厅，介绍三位NPC同伴：
- 矮人战士【格鲁姆·铁锤】，大口喝酒，嗓门粗但性格可靠
- 半精灵游荡者【影刃丽莎】，靠墙角擦匕首，话少但眼神锐利
- 法师学徒【塔莉亚】，坐在角落法杖横膝，兴奋地望着你，渴望组队
第五步·引导：结尾给出至少两个带检定标签的选择：
调查公会登记簿【智力DC12】、观察伊瑟拉是否隐瞒【洞悉DC14】、
让格鲁姆打听酒馆传闻【人脉DC13】、请丽莎聊聊对地城的了解【魅力DC12】

【台词归属】
直接台词前必须写明角色名，例如「伊瑟拉说：」「格鲁姆喊道：」。不要用「她说」「他说」承接。

请以DM身份叙述开场白，严格按照上述五步顺序，节奏舒缓、沉浸感强。"""


FALLBACK_OPENING = """瓦尔德里——北方王国，曾经繁荣了整整两百年。
王冠城依山而建，灰色的城墙在晨雾中若隐若现，像是从山岩中生长出来一般。街头的石板路被晨露打得湿滑，墙壁上贴满了泛黄的悬赏令，墨迹被雨水洇开，但「一万金币」几个字依然清晰可辨。

三周前，新君阿尔德温三世在加冕典礼上突然陷入魔法沉睡——就在那一刻，王冠城地下裂开一道深渊，名为「灰烬之裔」的暗影生物从中涌出。它们昼伏夜出，袭击居民，腐蚀土地。曾经繁华的街市如今在黄昏后就早早关门，空气中弥漫着铁锈和不安的味道。

四面八方涌来的冒险者填满了城中的每一间旅店。一万金币、贵族头衔、还有一个国王醒来后的承诺——足够让任何人赌上性命。

你穿过城门，沿着石板路走向中央广场。王宫的高塔在雾中投下长长的影子。

一阵低沉的钟声响起。人群安静下来。

大法师【伊瑟拉·星语】从王宫前厅缓步走出。伊瑟拉是一位高等精灵，长袍如夜空织就，深紫色的奥术纹路在袍角微微流转。两百年来伊瑟拉守护着这个王国——也背负着关于这场灾祸的秘密。

伊瑟拉抬起手，广场彻底寂静。

伊瑟拉说：「国王阿尔德温三世——被囚禁在他的梦境之中。他的灵魂困在地下城最深处的【碎冠之心】里。深渊就在这座城下。」
伊瑟拉停顿片刻，目光如炬。
伊瑟拉说：「我需要勇士。赏金一万金币。贵族头衔。还有——国王醒来后的一个承诺。」

伊瑟拉的眼神扫过人群，在你身上停了短短一瞬。

……

冒险者公会的大厅里，壁炉烧得正旺。

矮人战士【格鲁姆·铁锤】把酒杯重重砸在桌上，啤酒沫溅了一桌。
格鲁姆喊道：「一万金币！够我还清那该死的债了！」
格鲁姆拍了拍胸口的板甲。
格鲁姆说：「我叫格鲁姆，挥锤子的。你呢？」

半精灵游荡者【影刃丽莎】靠在墙角，匕首在丽莎指间翻飞。丽莎什么也没说，嘴角挂着一丝冷笑，灰色的眼睛却在暗暗打量着大厅里每一个人——尤其是你。

法师学徒【塔莉亚】坐在角落的长椅上，法杖横在膝头。塔莉亚还太年轻，藏不住眼神里的兴奋。看到你时，塔莉亚甚至忘了掩饰，一双亮晶晶的眼睛直直望过来。

公会接待员推了推眼镜，把一本厚重的登记簿推到你面前。
公会接待员说：「填上名字和职业。然后——活着回来。」

[HINTS:调查公会登记簿【智力DC12】|观察伊瑟拉是否有所隐瞒【洞悉DC14】|让格鲁姆打听酒馆传闻【人脉DC13】|请丽莎聊聊她对地城的了解【魅力DC12】]"""


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
        "proficiency_bonus": PROFICIENCY_BONUS.get(req.level, 2),
        "gold": 200,
        "inventory": "长剑,冒险者工具包,治疗药水x2",
        "gm_hp": 52, "gm_trust": 60, "gm_alive": True,
        "ls_hp": 38, "ls_trust": 45, "ls_alive": True,
        "tl_hp": 24, "tl_trust": 75, "tl_alive": True,
        "triggered_events": "",
        "last_event": "游戏开始",
    }
    save_game_state(gid, state)
    save_memory(gid, f"游戏开始。{req.player_name}，{req.char_class}，响应悬赏来到王冠城。")

    prompt = _opening_context(req.player_name, req.char_class) + "\n\n请严格按上述步骤生成开场白。叙事要有画面感、节奏要舒缓，让玩家感受到世界的厚度。"

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


@router_dnd.get("/saves")
async def get_saves():
    return {"saves": list_game_saves()}


@router_dnd.post("/game/{game_id}/save")
async def save_current_game(game_id: str, req: SaveGameRequest):
    _validate_slot_key(req.slot_key)
    state = load_game_state(game_id)
    if not state:
        raise HTTPException(404, "游戏不存在")

    title = (req.title or "").strip()
    if not title:
        title = f"{state.get('player_name', '冒险者')} · {state.get('current_area', '未知区域')}"

    phase = req.phase if req.phase in {"narrating", "action"} else "action"
    story = req.story[-120:]
    story_offset = max(0, len(req.story) - len(story))
    active_index = min(max(0, req.active_index - story_offset), max(len(story) - 1, 0))
    save = save_game_slot(
        req.slot_key,
        title[:32],
        game_id,
        state,
        story,
        req.suggestions[:6],
        active_index,
        phase,
        _chat_history.get(game_id, [])[-MAX_HISTORY:],
        get_game_memories(game_id),
    )
    return {"save": save}


@router_dnd.post("/saves/{slot_key}/load")
async def load_saved_game(slot_key: str):
    _validate_slot_key(slot_key)
    save = load_game_save(slot_key)
    if not save:
        raise HTTPException(404, "存档不存在")

    game_id = save["game_id"]
    save_game_state(game_id, save["state"])
    replace_game_memories(game_id, save["memories"])
    _chat_history[game_id] = save["chat_history"][-MAX_HISTORY:]

    return {
        "game_id": game_id,
        "state": save["state"],
        "story": save["story"],
        "suggestions": save["suggestions"],
        "active_index": save["active_index"],
        "phase": save["phase"],
        "save": save["summary"],
    }


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

        # 预骰: 检测用户消息中的DC检定标签，自动掷骰
        preroll_event, enhanced_msg = _preroll_if_dc(req.message, state)
        if preroll_event:
            systems.append(preroll_event)
            yield f"data: {json.dumps({'type':'system','content':preroll_event}, ensure_ascii=False)}\n\n"
            user_message = enhanced_msg
        else:
            user_message = req.message

        try:
            async for chunk in dm_chat_stream(user_message, state, history, ctx + recent):
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
            # 异常时保存状态（防止本轮状态变更丢失）
            try:
                history.append({"role": "user", "content": req.message})
                history.append({"role": "assistant", "content": full or f"[异常中断: {e}]"})
                if len(history) > MAX_HISTORY:
                    history = history[-MAX_HISTORY:]
                _chat_history[req.game_id] = history
                state["last_event"] = req.message[:100]
                save_game_state(req.game_id, state)
            except: pass
            yield f"data: {json.dumps({'type':'error','content':str(e)}, ensure_ascii=False)}\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream",
        headers={"Cache-Control":"no-cache","Connection":"keep-alive"})


@router_dnd.get("/health")
async def health():
    return {"status": "ok", "game": "D&D 碎冠之影"}
