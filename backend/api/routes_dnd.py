"""D&D API routes."""
import asyncio
import json
import re
import uuid
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from kp.dm_service import dm_chat_stream, dm_narrate_stream, judge_black_market_bargain, dm_battle_narrate, dm_judge_advantage
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
from engine.trust_system import canonicalize_trust_state, record_trust_patch_changes, trust_payload
from logger import get_logger, new_session

router_dnd = APIRouter(prefix="/api/dnd")
OPENING_TIMEOUT = 30
init_db()
SAVE_SLOT_KEYS = {"auto", "slot-1", "slot-2", "slot-3", "slot-4", "slot-5"}

# 对话历史缓存（每局游戏保留最近 20 轮）
_chat_history: dict[str, list[dict]] = {}
# game_id 到 session_id 映射
_session_map: dict[str, str] = {}
MAX_HISTORY = 20


def _apply_state_change(chunk: str, state: dict) -> dict:
    """Parse and apply legacy [STATE:tool_name:{...}] directives."""
    directive = parse_state_chunk(chunk)
    if directive:
        return apply_directive(state, directive)
    return {"type": "unknown"}


# ============================================================
# 妯″瀷
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


class BargainJudgeRequest(BaseModel):
    item_name: str
    base_price: int
    current_price: int
    attempt: int
    max_attempts: int = 5
    roll: int
    bonus: int = 3
    total: int
    player_words: str
    history: list[dict] = Field(default_factory=list)


class SaveGameRequest(BaseModel):
    slot_key: str
    title: str | None = None
    story: list[dict] = Field(default_factory=list)
    suggestions: list[dict] = Field(default_factory=list)
    active_index: int = 0
    phase: str = "action"


class StatePatchRequest(BaseModel):
    patch: dict = Field(default_factory=dict)


def _validate_slot_key(slot_key: str):
    if slot_key not in SAVE_SLOT_KEYS:
        raise HTTPException(400, "鏃犳晥鐨勫瓨妗ｄ綅")


# ============================================================
# DC妯″紡棰勯
# ============================================================
_ATTR_MAP = {
    "智力": "int", "敏捷": "dex", "力量": "str",
    "感知": "wis", "洞悉": "wis", "魅力": "cha", "体质": "con",
    "调查": "int", "历史": "int", "奥秘": "int",
    "察觉": "wis", "生存": "wis", "医药": "wis", "宗教": "wis",
    "巧手": "dex", "盗贼工具": "dex", "盗贼": "dex", "潜行": "dex", "杂技": "dex", "闪避": "dex",
    "说服": "cha", "威吓": "cha", "欺瞒": "cha", "人脉": "cha", "谈判": "cha",
    "运动": "str", "破门": "str",
}
_DC_BRACKET_RE = re.compile(
    r"[\[【]\s*([^\]】\n]{1,40}?)\s*(?:DC|ＤＣ)\s*(\d{1,2})(?:\s*[-~—到至]\s*\d{1,2})?\s*[\]】]",
    re.IGNORECASE,
)
_DC_BEFORE_RE = re.compile(
    r"([\u4e00-\u9fffA-Za-z0-9（）()/+\-·\s]{1,40}?)\s*(?:DC|ＤＣ)\s*(\d{1,2})(?:\s*[-~—到至]\s*\d{1,2})?",
    re.IGNORECASE,
)
_DC_AFTER_RE = re.compile(
    r"(?:DC|ＤＣ)\s*(\d{1,2})\s*([^\s\[【\]】，。；;、.!?！？]{1,16})",
    re.IGNORECASE,
)


def _clean_check_label(label: str) -> str:
    return re.sub(r"^[\[【\s]+|[\]】\s]+$", "", label or "").strip()


def _find_dc_check(message: str) -> tuple[str, int] | None:
    match = _DC_BRACKET_RE.search(message)
    if match:
        return _clean_check_label(match.group(1)), int(match.group(2))

    for match in _DC_BEFORE_RE.finditer(message):
        label = _clean_check_label(match.group(1))
        if not label or label.upper() in {"D", "DC", "ＤＣ"}:
            continue
        if _contains_any(label, tuple(_ATTR_MAP.keys())) or _contains_any(label, ("瑟琳", "银杖", "逆钟", "布洛克", "森洛", "铁锤", "艾琳", "白枝", "凯娅", "克莱娅", "软爪")):
            return label, int(match.group(2))

    match = _DC_AFTER_RE.search(message)
    if match:
        return _clean_check_label(match.group(2)), int(match.group(1))

    return None


def _contains_any(text: str, words: tuple[str, ...]) -> bool:
    return any(word in text for word in words)


def _infer_player_stat(label: str, message: str) -> tuple[str, str]:
    text = f"{label} {message}"
    for key, stat in _ATTR_MAP.items():
        if key in text:
            return stat, key
    return "int", label or "调查"


def _resolve_check(label: str, message: str, state: dict) -> tuple[str, int, int]:
    text = f"{label} {message}"
    assist = _contains_any(text, ("帮忙", "协助", "辅助", "配合"))

    if _contains_any(text, ("凯娅", "克莱娅", "软爪")):
        if _contains_any(text, ("陷阱", "拆除", "开锁", "巧手", "盗贼")):
            return "凯娅-敏捷(盗贼工具)", 6, 0
        if _contains_any(text, ("潜行", "潜入", "侦查")):
            return "凯娅-敏捷(潜行)", 6, 0
        if _contains_any(text, ("察觉", "感知", "危险")):
            return "凯娅-感知(察觉)", 4, 0

    if _contains_any(text, ("布洛克", "森洛", "铁锤")):
        if _contains_any(text, ("真菌", "孢海", "生态", "辨识", "自然", "植物")):
            return "布洛克-真菌辨识", 5, 0
        if _contains_any(text, ("生存", "导航", "路线", "找路", "方向")):
            return "布洛克-生存导航", 5, 0
        if _contains_any(text, ("料理", "食材", "做饭", "烹饪")):
            return "布洛克-孢海料理", 4, 0

    if _contains_any(text, ("艾琳", "白枝")):
        if _contains_any(text, ("治疗", "医药", "包扎", "医术", "稳定")):
            return "艾琳-医者之手", 6, 0
        if _contains_any(text, ("宗教", "圣典", "仪式", "祝福", "腐化", "污染")):
            return "艾琳-圣典学识", 5, 0
        if _contains_any(text, ("说服", "安抚", "劝慰")):
            return "艾琳-安抚低语", 4, 0

    if _contains_any(text, ("瑟琳", "银杖", "逆钟")):
        if _contains_any(text, ("奥秘", "魔法", "鉴定", "符文")):
            return "瑟琳-奥秘鉴定", 5, 0
        if _contains_any(text, ("时间", "异常", "感知")):
            return "瑟琳-时间感", 4, 0
        if assist:
            stat_key, skill_name = _infer_player_stat(label, message)
            return f"{skill_name}(瑟琳协助)", modifier(state.get(stat_key, 10)), state.get("proficiency_bonus", 2) + 2

    stat_key, skill_name = _infer_player_stat(label, message)
    return skill_name, modifier(state.get(stat_key, 10)), state.get("proficiency_bonus", 2)


def _preroll_if_dc(message: str, state: dict) -> tuple[str | None, str]:
    """Pre-roll a D20 when the player action contains a DC tag."""
    dc_check = _find_dc_check(message)
    if not dc_check:
        return None, message

    attr_name, dc = dc_check
    check_label, stat_mod, prof_bonus = _resolve_check(attr_name, message, state)
    result = skill_check(stat_mod, prof_bonus, dc)
    result_dict = result.to_dict()
    result_dict["属性"] = f"{check_label}(检定)"
    system_event = f"[SYSTEM:skill_check:{json.dumps(result_dict, ensure_ascii=False)}]"

    label = "成功" if result.success else "失败"
    operator = "≥" if result.success else "<"
    enhanced = (
        f"{message}\n"
        f"[系统提示：检定已自动完成。D20={result.roll} 加值+{result.bonus}，"
        f"总计={result.total} {operator} DC{dc}，{label}。请基于此结果叙事，"
        f"不要再调用skill_check工具。]"
    )
    return system_event, enhanced


def _fallback_chat_narrative(message: str, state: dict) -> str:
    player = state.get("player_name") or "冒险者"
    area = state.get("current_area") or "当前区域"
    prompt = (message or "").strip()
    action_line = f"你刚才选择了：{prompt}" if prompt else "你停下脚步，重新整理眼前的局势。"
    return (
        f"{player}在{area}稳住呼吸，远处的荧光在黑暗中明灭，空气中弥漫着潮湿的孢尘。\n"
        f"{action_line}\n"
        "局势暂时没有发生新的剧烈变化。你可以保存进度、检查角色状态，或从眼前线索中选择下一步行动。\n\n"
        "[HINTS:观察周围环境【感知DC12】|回顾任务线索【智力DC12】|和瑟琳确认计划【魅力DC12】]"
    )


# ============================================================
# 开场白上下文
# ============================================================
def _opening_context(name: str, cls: str) -> str:
    return f"{name}是一名身经百战的{cls}。你接到逆穹悬城公会的指名委托，前往幽暗地域调查地底堡垒失联与地心狱门封印异常。"


FALLBACK_OPENING = (
    "地心狱门被封印在幽暗地域深处，地底堡垒已失联十年，地下魔物正沿矿道涌向地表。"
    "逆穹悬城公会向你发出指名委托：深入幽暗地域，查明失联原因，确认封印状态。"
    "固定开场剧情由前端脚本播放；后端保留这段摘要用于日志与旧客户端兼容。"
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
        "current_area": "逆穹悬城·入城平台",
        "actions_in_area": 0,
        "cleared_levels": 0,
        "str": req.attr_str, "dex": req.attr_dex, "con": req.attr_con,
        "int": req.attr_int, "wis": req.attr_wis, "cha": req.attr_cha,
        "current_hp": preset["hp"], "max_hp": preset["hp"], "ac": preset["ac"],
        "atk_bonus": preset.get("atk_bonus", 5),
        "proficiency_bonus": PROFICIENCY_BONUS.get(req.level, 2),
        "gold": 400,
        "inventory": "长剑,冒险者工具包,治疗药水x2",
        "guild_registered": False,
        "city_map_unlocked": False,
        "blackmarket_unlocked": False,
        "al_recruited": False,
        "sl_recruited": False,
        "kl_recruited": False,
        "recruited_companions": "瑟琳",
        "se_hp": 34, "se_trust": 84, "se_alive": True,   # 瑟琳
        "sl_hp": 46, "sl_trust": 50, "trust_block": 50, "sl_alive": True,  # 布洛克(森洛) — sl_trust/trust_block 同义
        "al_hp": 32, "al_trust": 55, "al_alive": True,   # 艾琳
        "kl_hp": 36, "kl_trust": 45, "kl_alive": True,   # 凯娅
        "triggered_events": "",
        "last_event": "抵达逆穹悬城入城平台，第一次遭遇裂隙爬兽。",
    }
    canonicalize_trust_state(state)
    save_game_state(gid, state)
    save_memory(gid, f"游戏开始。{req.player_name}，{req.char_class}，接受委托来到逆穹悬城。")

    opening_text = FALLBACK_OPENING.replace("{name}", req.player_name)
    _chat_history[gid] = [{"role": "assistant", "content": opening_text}]

    sid, log = new_session(
        req.player_name,
        req.char_class,
        {"attr_str": req.attr_str, "attr_dex": req.attr_dex, "attr_con": req.attr_con,
         "attr_int": req.attr_int, "attr_wis": req.attr_wis, "attr_cha": req.attr_cha},
        opening_text,
    )
    _session_map[gid] = sid

    return {
        "game_id": gid,
        "session_id": sid,
        "opening": opening_text,
        "state": state,
    }


@router_dnd.get("/game/{game_id}/state")
async def get_state(game_id: str):
    state = load_game_state(game_id)
    if not state:
        raise HTTPException(404, "游戏不存在")
    canonicalize_trust_state(state)
    save_game_state(game_id, state)
    return {"game_id": game_id, "state": state}


@router_dnd.get("/game/{game_id}/trust")
async def get_trust(game_id: str):
    state = load_game_state(game_id)
    if not state:
        raise HTTPException(404, "游戏不存在")
    canonicalize_trust_state(state)
    save_game_state(game_id, state)
    return {"game_id": game_id, **trust_payload(state)}


@router_dnd.post("/game/{game_id}/state/patch")
async def patch_state(game_id: str, req: StatePatchRequest):
    state = load_game_state(game_id)
    if not state:
        raise HTTPException(404, "游戏不存在")
    canonicalize_trust_state(state)
    old_trust = dict(state.get("companionTrust", {}))

    patch = dict(req.patch or {})
    patch.pop("game_id", None)
    patch.pop("id", None)
    if not patch:
        return {"game_id": game_id, "state": state}

    old_area = state.get("current_area")
    state.update(patch)
    if patch.get("current_area") and patch.get("current_area") != old_area:
        state["actions_in_area"] = int(patch.get("actions_in_area", 0))

    recruited = [item.strip() for item in str(state.get("recruited_companions", "")).split(",") if item.strip()]
    for flag, name in (("al_recruited", "艾琳"), ("sl_recruited", "布洛克"), ("kl_recruited", "凯娅")):
        if state.get(flag) and name not in recruited:
            recruited.append(name)
    if recruited:
        state["recruited_companions"] = ",".join(recruited)

    canonicalize_trust_state(state)
    record_trust_patch_changes(
        state,
        old_trust,
        "sidequest_key_choice" if any(str(key).endswith("_done") for key in patch) else "preset_choice",
        str(patch.get("last_event") or "剧情选择影响了同伴判断"),
    )
    save_game_state(game_id, state)
    if patch.get("last_event"):
        save_memory(game_id, str(patch["last_event"]), "state")

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
    canonicalize_trust_state(state)

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
    state = dict(save["state"])
    canonicalize_trust_state(state)
    save["state"] = state
    save_game_state(game_id, state)
    replace_game_memories(game_id, save["memories"])
    _chat_history[game_id] = save["chat_history"][-MAX_HISTORY:]

    return {
        "game_id": game_id,
        "state": state,
        "story": save["story"],
        "suggestions": save["suggestions"],
        "active_index": save["active_index"],
        "phase": save["phase"],
        "save": save["summary"],
    }


@router_dnd.post("/bargain/judge")
async def judge_bargain(req: BargainJudgeRequest):
    item_name = req.item_name.strip() or "榛戝競璐х墿"
    player_words = req.player_words.strip()
    if not player_words:
        raise HTTPException(400, "璁蹭环璇濊涓嶈兘涓虹┖")

    base_price = max(1, req.base_price)
    current_price = max(1, req.current_price)
    max_attempts = max(1, min(req.max_attempts, 5))
    attempt = max(1, min(req.attempt, max_attempts))
    roll = max(1, min(req.roll, 20))
    bonus = max(-5, min(req.bonus, 12))
    total = max(roll + bonus, min(req.total, 40))

    result = await judge_black_market_bargain(
        item_name=item_name,
        base_price=base_price,
        current_price=current_price,
        attempt=attempt,
        max_attempts=max_attempts,
        roll=roll,
        bonus=bonus,
        total=total,
        player_words=player_words,
        history=req.history[-5:],
    )
    return result


@router_dnd.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    state = load_game_state(req.game_id)
    if not state:
        raise HTTPException(404, "游戏不存在")
    canonicalize_trust_state(state)

    # 閫掑褰撳墠鍖哄煙琛屽姩娆℃暟
    state["actions_in_area"] = int(state.get("actions_in_area", 0)) + 1
    save_game_state(req.game_id, state)

    recent = get_recent_memories(req.game_id)
    ctx = search_memory(req.game_id, req.message, n_results=3)

    async def gen():
        full = ""
        systems: list[str] = []
        directive_filter = DirectiveStreamFilter()

        # 鑾峰彇鏃ュ織鍣ㄥ苟绔嬪嵆鍐欏叆鐜╁杈撳叆
        sid = _session_map.get(req.game_id, req.game_id)
        log = get_logger(sid)
        log.log_player(req.message)

        # 鑾峰彇鍘嗗彶瀵硅瘽
        history = _chat_history.get(req.game_id, [])
        if len(history) > MAX_HISTORY:
            history = history[-MAX_HISTORY:]

        # 棰勯: 妫€娴嬬敤鎴锋秷鎭腑鐨凞C妫€瀹氭爣绛撅紝鑷姩鎺烽
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

            # DM璇村畬涓€娈?鈫?鍐欏叆鏃ュ織锛堥檮甯︾郴缁熶簨浠讹級
            log.log_dm(full, systems)

            # 淇濆瓨瀵硅瘽鍘嗗彶
            history.append({"role": "user", "content": req.message})
            history.append({"role": "assistant", "content": full})
            if len(history) > MAX_HISTORY:
                history = history[-MAX_HISTORY:]
            _chat_history[req.game_id] = history
            # 淇濆瓨璁板繂鍜岀姸鎬?
            save_memory(req.game_id, f"鐜╁: {req.message}")
            if full: save_memory(req.game_id, f"DM: {full[:200]}")
            state["last_event"] = req.message[:100]
            save_game_state(req.game_id, state)
            yield f"data: {json.dumps({'type':'state_snapshot','content':state}, ensure_ascii=False)}\n\n"
            yield f"data: {json.dumps({'type':'done'})}\n\n"
        except Exception as e:
            if full:
                log.log_dm(full + f"\n[涓柇: {e}]", systems)
            log.log_error(str(e))
            fallback = full or _fallback_chat_narrative(req.message, state)
            if not full:
                full = fallback
                yield f"data: {json.dumps({'type':'narrative','content':fallback}, ensure_ascii=False)}\n\n"

            # 寮傚父鏃朵繚瀛樼姸鎬侊紙闃叉鏈疆鐘舵€佸彉鏇翠涪澶憋級
            try:
                history.append({"role": "user", "content": req.message})
                history.append({"role": "assistant", "content": full})
                if len(history) > MAX_HISTORY:
                    history = history[-MAX_HISTORY:]
                _chat_history[req.game_id] = history
                save_memory(req.game_id, f"鐜╁: {req.message}")
                if full:
                    save_memory(req.game_id, f"DM: {full[:200]}")
                state["last_event"] = req.message[:100]
                save_game_state(req.game_id, state)
            except: pass
            yield f"data: {json.dumps({'type':'state_snapshot','content':state}, ensure_ascii=False)}\n\n"
            yield f"data: {json.dumps({'type':'done'})}\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream",
        headers={"Cache-Control":"no-cache","Connection":"keep-alive"})


class BattleNarrateRequest(BaseModel):
    actor_name: str
    target_name: str
    skill_name: str
    outcome: str
    amount: float = 0
    d20_roll: int = 0
    d20_total: int = 0
    damage_label: str = ""
    tags: list[str] = []
    ac_dc: int = 0


@router_dnd.post("/battle/narrate")
async def battle_narrate(req: BattleNarrateRequest):
    text = await dm_battle_narrate(
        actor_name=req.actor_name,
        target_name=req.target_name,
        skill_name=req.skill_name,
        outcome=req.outcome,
        amount=req.amount,
        d20_roll=req.d20_roll,
        d20_total=req.d20_total,
        damage_label=req.damage_label,
        tags=req.tags,
        ac_dc=req.ac_dc,
    )
    return {"narration": text}


class AdvantageRequest(BaseModel):
    unit_name: str
    context: str


@router_dnd.post("/battle/advantage")
async def judge_advantage(req: AdvantageRequest):
    result = await dm_judge_advantage(req.unit_name, req.context)
    return result


@router_dnd.get("/health")
async def health():
    return {"status": "ok", "game": "D&D 鍦板績涔嬮棬"}
