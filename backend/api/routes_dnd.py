"""D&D API routes."""
import asyncio
import json
import re
import uuid
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from kp.dm_service import (
    dm_chat_stream,
    dm_mini_game_commentary,
    dm_narrate_stream,
    dm_shop_consult,
    judge_black_market_bargain,
    dm_battle_narrate,
    dm_judge_advantage,
    judge_ailin_recruit_answer,
    judge_serlin_self_introduction,
    dm_story_check_narrate,
    dm_health_check,
    get_ai_runtime_settings,
    update_ai_runtime_settings,
)
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
    save_battle_state,
    save_memory,
    search_memory,
)
from engine.rules_dnd import (
    PROFICIENCY_BONUS,
    derive_player_combat_stats,
    modifier,
    normalize_player_style_state,
    resolve_player_style,
    skill_check,
    validate_character,
)
from engine.investigation_rewards import (
    action_check_for_message,
    apply_investigation_rewards,
    ensure_investigation_state,
)
from engine.state_directives import DirectiveStreamFilter, apply_directive, parse_state_chunk
from core.events import make_event
from core.events import PatchOperationModel
from core.context import update_scene_summary
from engine.game_state import PatchOperation, apply_state_patch, legacy_patch_operations, migrate_game_state
from engine.trust_system import canonicalize_trust_state, record_trust_patch_changes, trust_payload
from logger import get_logger, new_session

router_dnd = APIRouter(prefix="/api/dnd")
OPENING_TIMEOUT = 30
init_db()
SAVE_SLOT_KEYS = {"auto", "slot-1", "slot-2", "slot-3", "slot-4", "slot-5", "slot-6", "slot-7", "slot-8", "slot-9", "slot-10"}

# 对话历史缓存（每局游戏保留最近 20 轮）
_chat_history: dict[str, list[dict]] = {}
# game_id 到 session_id 映射
_session_map: dict[str, str] = {}
MAX_HISTORY = 20


def _apply_state_change(chunk: str, state: dict) -> dict:
    """Parse and apply legacy [STATE:tool_name:{...}] directives."""
    directive = parse_state_chunk(chunk)
    if directive:
        return apply_directive(state, directive, source="ai")
    return {"type": "unknown"}


_PROTOCOL_START_RE = re.compile(
    r"(?:[ \t]*(?:\[[^\]\r\n]{1,12}\]\s*)?)?[\[【]\s*(HINTS|STATE|SYSTEM|CMD|DIRECTIVE|SCENE)\s*[:：]",
    re.IGNORECASE,
)
_PARTIAL_PROTOCOL_PREFIXES = tuple(
    prefix[:size]
    for prefix in (
        "[HINTS:", "[STATE:", "[SYSTEM:", "[CMD:", "[DIRECTIVE:", "[SCENE:",
        "【HINTS:", "【STATE:", "【SYSTEM:", "【CMD:", "【DIRECTIVE:", "【SCENE:",
    )
    for size in range(1, len(prefix))
)


def _protocol_suffix_to_keep(text: str) -> int:
    upper = text.upper()
    return max((len(prefix) for prefix in _PARTIAL_PROTOCOL_PREFIXES if upper.endswith(prefix.upper())), default=0)


def _parse_hint_items(raw: str) -> list[str]:
    body = raw.strip()
    if body.startswith(("［", "【", "[")):
        body = body[1:]
    if body.endswith(("］", "】", "]")):
        body = body[:-1]
    if ":" in body:
        body = body.split(":", 1)[1]
    elif "：" in body:
        body = body.split("：", 1)[1]
    return [
        item.strip().strip("[]【】")
        for item in body.split("|")
        if item.strip().strip("[]【】")
    ]


class PlayerProtocolFilter:
    """Keeps machine protocol available to code while removing it from player text."""

    def __init__(self) -> None:
        self._buffer = ""

    def feed(self, chunk: str) -> tuple[str, list[str]]:
        self._buffer += chunk
        return self._drain(complete=False)

    def flush(self) -> tuple[str, list[str]]:
        return self._drain(complete=True)

    def _drain(self, complete: bool) -> tuple[str, list[str]]:
        visible_parts: list[str] = []
        hints: list[str] = []

        while self._buffer:
            match = _PROTOCOL_START_RE.search(self._buffer)
            if not match:
                if complete:
                    visible_parts.append(self._buffer)
                    self._buffer = ""
                    break
                keep = _protocol_suffix_to_keep(self._buffer)
                if keep:
                    visible_parts.append(self._buffer[:-keep])
                    self._buffer = self._buffer[-keep:]
                else:
                    visible_parts.append(self._buffer)
                    self._buffer = ""
                break

            if match.start() > 0:
                visible_parts.append(self._buffer[:match.start()])
                self._buffer = self._buffer[match.start():]
                continue

            closer = "】" if self._buffer.startswith("【") else "]"
            end = self._buffer.find(closer)
            if end < 0:
                if complete:
                    self._buffer = ""
                break

            raw = self._buffer[:end + 1]
            if match.group(1).upper() == "HINTS":
                hints.extend(_parse_hint_items(raw))
            self._buffer = self._buffer[end + 1:]

        return "".join(visible_parts), hints


def _strip_player_protocol_text(text: str) -> str:
    protocol_filter = PlayerProtocolFilter()
    visible, _ = protocol_filter.feed(text or "")
    tail, _ = protocol_filter.flush()
    return _strip_phase_limit_notice(visible + tail).strip()


_PHASE_LIMIT_NOTICE_RE = re.compile(
    r"(?:\r?\n)?[\[【]\s*系统提示\s*[:：]\s*这是本阶段第\s*\d+\s*/\s*\d+\s*次选择行动。?"
    r"请在完成本次叙事后直接推进到下一段剧情，不要继续停留在当前选择阶段。?\s*[\]】]",
    re.MULTILINE,
)


def _strip_phase_limit_notice(text: str) -> str:
    return _PHASE_LIMIT_NOTICE_RE.sub("", str(text or "")).strip()


def _sanitize_persisted_text(text: str) -> str:
    return _strip_player_protocol_text(_strip_phase_limit_notice(text))


def _sanitize_for_persistence(value):
    if isinstance(value, str):
        return _sanitize_persisted_text(value)
    if isinstance(value, list):
        return [_sanitize_for_persistence(item) for item in value]
    if isinstance(value, dict):
        return {key: _sanitize_for_persistence(item) for key, item in value.items()}
    return value


def _sanitize_state_in_place(state: dict) -> dict:
    sanitized = _sanitize_for_persistence(state)
    state.clear()
    state.update(sanitized)
    return state


# ============================================================
# 妯″瀷
# ============================================================
class CreateDNDRequest(BaseModel):
    player_name: str = "冒险者"
    char_class: str = "待确认流派"
    attr_str: int = 12
    attr_dex: int = 12
    attr_con: int = 13
    attr_int: int = 12
    attr_wis: int = 12
    attr_cha: int = 12
    level: int = 3
    skip_opening: bool = False
    selected_style_id: str | None = None
    style_selection_pending: bool = False

class ChatRequest(BaseModel):
    game_id: str
    message: str
    visible_message: str | None = None


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


class AilinRecruitAnswerRequest(BaseModel):
    game_id: str | None = None
    player_name: str = "冒险者"
    player_answer: str
    current_trust: int = 55


class SerlinIntroRequest(BaseModel):
    player_answer: str


class StoryCheckNarrateRequest(BaseModel):
    encounter_id: str = ""
    action_id: str
    action_label: str
    action_desc: str = ""
    skill_name: str = ""
    dc: int = 0
    modifier: int = 0
    initial_roll: dict = Field(default_factory=dict)
    reroll: dict | None = None
    final_roll: dict = Field(default_factory=dict)
    final_success: bool
    reroll_used: bool = False
    reroll_item_id: str | None = None
    current_area: str = ""


class MiniGameCommentaryRequest(BaseModel):
    character: str
    event: str
    context: dict = Field(default_factory=dict)


class ShopConsultRequest(BaseModel):
    item_id: str
    name: str
    desc: str
    price: int = 0
    type: str = ""
    stat: str | None = None


class AiSettingsRequest(BaseModel):
    model: str
    health_max_tokens: int | None = None


class SaveGameRequest(BaseModel):
    slot_key: str
    title: str | None = None
    state: dict | None = None
    story: list[dict] = Field(default_factory=list)
    suggestions: list[dict] = Field(default_factory=list)
    active_index: int = 0
    phase: str = "action"


class StatePatchRequest(BaseModel):
    patch: dict = Field(default_factory=dict)
    schemaVersion: int = 1
    patchId: str | None = None
    source: str = "ui"
    correlationId: str | None = None
    patches: list[PatchOperationModel] = Field(default_factory=list)


def _validate_slot_key(slot_key: str):
    if slot_key not in SAVE_SLOT_KEYS:
        raise HTTPException(400, "鏃犳晥鐨勫瓨妗ｄ綅")


def _save_title_area(state: dict) -> str:
    scene_state = state.get("sceneState") if isinstance(state.get("sceneState"), dict) else {}
    scene_id = str(scene_state.get("currentScene") or "")
    if scene_id == "elevator-descent" or state.get("elevator_descent_started"):
        return "缆梯垂降途中"
    if scene_id == "elevator-hub" or state.get("elevator_hub_visited"):
        return "降渊缆梯中枢"
    if scene_id == "guild-final-registration" or state.get("expedition_registered"):
        return "最终公会登记"
    return str(state.get("current_area") or "未知区域")


def _build_save_title(slot_key: str, state: dict, requested_title: str | None = None) -> str:
    if slot_key == "auto":
        return f"自动 · {state.get('player_name', '冒险者')} · {_save_title_area(state)}"
    title = (requested_title or "").strip()
    if title:
        return title
    return f"{state.get('player_name', '冒险者')} · {_save_title_area(state)}"


# ============================================================
# DC妯″紡棰勯
# ============================================================
_ATTR_MAP = {
    "智力": "int", "敏捷": "dex", "力量": "str",
    "感知": "wis", "洞悉": "wis", "魅力": "cha", "体质": "con",
    "调查": "int", "历史": "int", "奥秘": "int",
    "察觉": "wis", "生存": "wis", "医药": "wis", "宗教": "wis", "自然": "wis",
    "巧手": "dex", "盗贼工具": "dex", "盗贼": "dex", "潜行": "dex", "杂技": "dex", "闪避": "dex",
    "说服": "cha", "威吓": "cha", "欺瞒": "cha", "人脉": "cha", "谈判": "cha",
    "运动": "str", "破门": "str",
}

# 六维属性中文名映射（用于骰子结算展示）
_STAT_TO_DND_NAME = {
    "str": "力量", "dex": "敏捷", "con": "体质",
    "int": "智力", "wis": "感知", "cha": "魅力",
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
        dc_check = action_check_for_message(message, state)
        if not dc_check:
            return None, message

    attr_name, dc = dc_check
    check_label, stat_mod, prof_bonus = _resolve_check(attr_name, message, state)
    result = skill_check(stat_mod, prof_bonus, dc)
    result_dict = result.to_dict()

    # 确定六维属性中文名 + 拆解加值明细
    stat_key, _ = _infer_player_stat(attr_name, message)
    dnd_ability = _STAT_TO_DND_NAME.get(stat_key, "智力")
    result_dict["六维"] = dnd_ability
    result_dict["属性"] = check_label
    result_dict["属性加值"] = stat_mod
    result_dict["熟练加值"] = prof_bonus

    system_event = f"[SYSTEM:skill_check:{json.dumps(result_dict, ensure_ascii=False)}]"

    label = "成功" if result.success else "失败"
    operator = "≥" if result.success else "<"
    enhanced = (
        f"{message}\n"
        f"[系统提示：检定已自动完成。D20={result.roll} 加值+{result.bonus}，"
        f"总计={result.total} {operator} DC{dc}，{label}。请基于此结果叙事，"
        f"不要再调用skill_check工具。若系统状态更新已经发放调查奖励，只需在叙事中自然承接结果，不要再次发放奖励。]"
    )
    return system_event, enhanced


_SYSTEM_EVENT_RE = re.compile(r"^\[SYSTEM:([^:]+):(.+)\]\s*$", re.DOTALL)


def _parse_system_event_payload(raw: str) -> tuple[str, dict] | None:
    match = _SYSTEM_EVENT_RE.match((raw or "").strip())
    if not match:
        return None
    try:
        return match.group(1), json.loads(match.group(2))
    except (json.JSONDecodeError, TypeError):
        return None


def _dice_summary_from_systems(systems: list[str] | None) -> str:
    for raw in reversed(systems or []):
        parsed = _parse_system_event_payload(raw)
        if not parsed:
            continue
        event_type, payload = parsed
        if event_type == "skill_check":
            roll = str(payload.get("掷骰") or "").replace("D20=", "") or "?"
            total = payload.get("总计", "?")
            dc = payload.get("DC", "?")
            label = payload.get("属性") or "检定"
            outcome = "成功" if payload.get("成功") else "失败"
            return f"{label}结果为 D20={roll}，总计 {total} 对 DC{dc}，判定{outcome}。"
        if event_type == "attack_roll":
            roll_text = str(payload.get("攻击掷骰") or "")
            total = payload.get("总计", "?")
            target = payload.get("目标AC", "?")
            outcome = "命中" if payload.get("命中") else "未命中"
            damage = payload.get("伤害")
            damage_text = f"，造成 {damage} 点伤害" if damage else ""
            return f"攻击检定{roll_text or f'总计 {total}'} 对 AC{target}，结果{outcome}{damage_text}。"
    return ""


def _fallback_chat_narrative(message: str, state: dict, systems: list[str] | None = None) -> str:
    player = state.get("player_name") or "冒险者"
    area = state.get("current_area") or "当前区域"
    prompt = (message or "").strip()
    fixed_marker = "【扩展剧情固定结算】"
    if fixed_marker in prompt:
        # The frontend has already resolved dice, rewards, trust and state for these
        # authored nodes. If the LLM stream is empty/interrupted, replay those facts
        # instead of presenting the generic "局势继续向前推进" placeholder as AI text.
        fixed_tail = prompt.split(fixed_marker, 1)[1]
        fixed_lines = []
        for raw_line in fixed_tail.splitlines():
            line = raw_line.strip()
            if not line:
                continue
            if "骰子与状态已经由系统结算" in line or "请严格依据以下事实续写" in line:
                continue
            fixed_lines.append(line)
        if fixed_lines:
            return "\n".join(fixed_lines)

    clean_action = prompt.splitlines()[0].strip() if prompt else "整理眼前线索"
    clean_action = re.sub(r"【[^】]+】", "", clean_action).strip("。 ")
    dice_line = _dice_summary_from_systems(systems)
    if "让艾琳疗伤" in clean_action:
        outcome = "艾琳确认伤口已经稳定，示意你重新活动手臂。" if "成功" in dice_line else "艾琳先替你压住伤势，提醒你别在情况不明时继续逞强。"
        return f"艾琳打开药箱，白枝药香很快压过周围的孢尘味。\n{dice_line}{outcome}"
    if dice_line:
        return f"你着手{clean_action}。\n{dice_line}队伍依据这个结果重新确认了眼前的线索与站位。"
    return f"你着手{clean_action}。\n同伴们收拢到近处，仔细核对现场留下的痕迹，等待你决定下一步。"


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
    style = resolve_player_style(req.selected_style_id, req.char_class, req.char_class)
    attributes = {
        "str": req.attr_str,
        "dex": req.attr_dex,
        "con": req.attr_con,
        "int": req.attr_int,
        "wis": req.attr_wis,
        "cha": req.attr_cha,
    }
    derived = derive_player_combat_stats(attributes)
    style_selection_pending = bool(req.style_selection_pending)
    if style_selection_pending:
        style_name = "待确认流派"
        selected_style_id = ""
    else:
        style_name = style["name"]
        selected_style_id = style["id"]

    state = {
        "player_name": req.player_name,
        "char_class": style_name,
        "style_name": style_name,
        "selectedStyleId": selected_style_id,
        "selected_style_id": selected_style_id,
        "style_selection_pending": style_selection_pending,
        "level": req.level,
        "current_area": "逆穹悬城·入城平台",
        "actions_in_area": 0,
        "cleared_levels": 0,
        "str": attributes["str"], "dex": attributes["dex"], "con": attributes["con"],
        "int": attributes["int"], "wis": attributes["wis"], "cha": attributes["cha"],
        "current_hp": derived["hp"], "max_hp": derived["hp"], "ac": derived["ac"],
        "initiative_modifier": derived["initiative_modifier"],
        "atk_bonus": derived["atk_bonus"],
        "proficiency_bonus": PROFICIENCY_BONUS.get(req.level, 2),
        "gold": 400,
        "inventory": "长剑,冒险者工具包,治疗药水x2,虚构骰子x5,万能骰子x3",
        "player": {
            "styleId": selected_style_id,
            "styleName": style_name,
            "attributes": attributes,
            "maxHp": derived["hp"],
            "hp": derived["hp"],
            "ac": derived["ac"],
        },
        "guild_registered": False,
        "blackmarket_unlocked": False,
        "al_recruited": False,
        "sl_recruited": False,
        "kl_recruited": False,
        "recruited_companions": "瑟琳",
        "se_hp": 36, "se_hp_max": 36, "se_trust": 50, "se_alive": True,   # 瑟琳
        "sl_hp": 45, "sl_hp_max": 45, "sl_trust": 50, "trust_block": 50, "sl_alive": True,  # 布洛克
        "al_hp": 36, "al_hp_max": 36, "al_trust": 50, "al_alive": True,   # 艾琳
        "kl_hp": 30, "kl_hp_max": 30, "kl_trust": 50, "kl_alive": True,   # 凯娅
        "triggered_events": "",
        "documents": [],
        "clues": [],
        "flags": {},
        "questLog": {
            "mainQuest": "investigate_earthcore_gate",
            "currentObjective": "前往逆穹悬城",
            "completedObjectives": [],
            "updates": [],
        },
        "sceneState": {
            "currentScene": "unknown",
            "visitedScenes": ["unknown"],
        },
        "last_event": "抵达逆穹悬城入城平台，第一次遭遇裂隙爬兽。",
    }
    normalize_player_style_state(state)
    canonicalize_trust_state(state)
    ensure_investigation_state(state)
    state = migrate_game_state(state, gid)
    save_game_state(gid, state)
    save_memory(gid, f"游戏开始。{req.player_name}，{state.get('char_class') or req.char_class}，接受委托来到逆穹悬城。")

    opening_text = FALLBACK_OPENING.replace("{name}", req.player_name)
    _chat_history[gid] = [{"role": "assistant", "content": opening_text}]

    sid, log = new_session(
        req.player_name,
        str(state.get("char_class") or req.char_class),
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
    normalize_player_style_state(state)
    canonicalize_trust_state(state)
    ensure_investigation_state(state)
    save_game_state(game_id, state)
    return {"game_id": game_id, "state": state}


@router_dnd.get("/game/{game_id}/trust")
async def get_trust(game_id: str):
    state = load_game_state(game_id)
    if not state:
        raise HTTPException(404, "游戏不存在")
    normalize_player_style_state(state)
    canonicalize_trust_state(state)
    ensure_investigation_state(state)
    save_game_state(game_id, state)
    return {"game_id": game_id, **trust_payload(state)}


@router_dnd.post("/game/{game_id}/state/patch")
async def patch_state(game_id: str, req: StatePatchRequest):
    state = load_game_state(game_id)
    if not state:
        raise HTTPException(404, "游戏不存在")
    normalize_player_style_state(state)
    canonicalize_trust_state(state)
    ensure_investigation_state(state)
    old_trust = dict(state.get("companionTrust", {}))

    patch = dict(req.patch or {})
    patch.pop("game_id", None)
    patch.pop("id", None)
    operations = [
        PatchOperation(operation.op, operation.path, operation.value)
        for operation in req.patches
    ] or legacy_patch_operations(patch)
    if not operations:
        return {"game_id": game_id, "state": state}

    old_area = state.get("current_area")
    next_state, validation = apply_state_patch(state, operations, source="ui")
    if not validation.valid:
        raise HTTPException(400, {"message": "状态补丁不合法", "errors": validation.errors})
    state = next_state
    ensure_investigation_state(state)
    if patch.get("current_area") and patch.get("current_area") != old_area:
        state["actions_in_area"] = int(patch.get("actions_in_area", 0))

    recruited = [item.strip() for item in str(state.get("recruited_companions", "")).split(",") if item.strip()]
    for flag, name in (("al_recruited", "艾琳"), ("sl_recruited", "布洛克"), ("kl_recruited", "凯娅")):
        if state.get(flag) and name not in recruited:
            recruited.append(name)
    if recruited:
        state["recruited_companions"] = ",".join(recruited)

    normalize_player_style_state(state)
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
    if isinstance(req.state, dict) and req.state:
        client_state = dict(_sanitize_for_persistence(req.state))
        client_state.pop("game_id", None)
        client_state.pop("id", None)
        # BattleEngine is authoritative; a stale React snapshot may not overwrite it.
        client_state.pop("battle", None)
        state.update(client_state)
    normalize_player_style_state(state)
    canonicalize_trust_state(state)
    ensure_investigation_state(state)
    title = _build_save_title(req.slot_key, state, req.title)

    phase = req.phase if req.phase in {"narrating", "action"} else "action"
    state = _sanitize_for_persistence(state)
    save_game_state(game_id, state)
    if isinstance(state.get("battle"), dict) and state["battle"].get("battleId"):
        save_battle_state(state["battle"]["battleId"], game_id, state["battle"])
    story = _sanitize_for_persistence(req.story[-120:])
    suggestions = _sanitize_for_persistence(req.suggestions[:6])
    chat_history = _sanitize_for_persistence(_chat_history.get(game_id, [])[-MAX_HISTORY:])
    memories = _sanitize_for_persistence(get_game_memories(game_id))
    story_offset = max(0, len(req.story) - len(story))
    active_index = min(max(0, req.active_index - story_offset), max(len(story) - 1, 0))
    save = save_game_slot(
        req.slot_key,
        title[:32],
        game_id,
        state,
        story,
        suggestions,
        active_index,
        phase,
        chat_history,
        memories,
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
    state = migrate_game_state(state, game_id)
    normalize_player_style_state(state)
    canonicalize_trust_state(state)
    ensure_investigation_state(state)
    save["state"] = state
    save["summary"]["title"] = _build_save_title(slot_key, state, save["summary"].get("title"))
    save["summary"]["current_area"] = state.get("current_area", "未知区域")
    save["summary"]["last_event"] = state.get("last_event", save["summary"].get("last_event", ""))
    save_game_state(game_id, state)
    if isinstance(state.get("battle"), dict) and state["battle"].get("battleId"):
        save_battle_state(state["battle"]["battleId"], game_id, state["battle"])
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


@router_dnd.post("/ailin/recruit-answer")
async def judge_ailin_recruit(req: AilinRecruitAnswerRequest):
    player_answer = req.player_answer.strip()
    if not player_answer:
        raise HTTPException(400, "回答不能为空")

    player_name = req.player_name.strip() or "冒险者"
    current_trust = max(0, min(int(req.current_trust or 55), 100))
    if req.game_id:
        state = load_game_state(req.game_id)
        if state:
            player_name = str(state.get("player_name") or player_name)

    return await judge_ailin_recruit_answer(
        player_name=player_name,
        player_answer=player_answer,
        current_trust=current_trust,
    )


@router_dnd.post("/serlin/intro-judge")
async def judge_serlin_intro(req: SerlinIntroRequest):
    player_answer = req.player_answer.strip()
    if not player_answer:
        raise HTTPException(400, "介绍不能为空")
    return await judge_serlin_self_introduction(player_answer=player_answer)


@router_dnd.post("/story-check/narrate")
async def story_check_narrate(req: StoryCheckNarrateRequest):
    return {"narration": await dm_story_check_narrate(req.model_dump())}


@router_dnd.post("/mini-game/commentary")
async def mini_game_commentary(req: MiniGameCommentaryRequest):
    character = req.character.strip().lower()
    if character not in {"brock", "serin", "orlan"}:
        raise HTTPException(400, "unsupported mini-game commentator")
    event = req.event.strip()
    if not event:
        raise HTTPException(400, "event is required")
    line = await dm_mini_game_commentary(character, event, req.context)
    return {"line": line}


@router_dnd.post("/shop/consult")
async def shop_consult(req: ShopConsultRequest):
    item = {
        "item_id": req.item_id,
        "name": req.name.strip(),
        "desc": req.desc.strip(),
        "price": max(0, req.price),
        "type": req.type,
        "stat": req.stat,
    }
    if not item["name"] or not item["desc"]:
        raise HTTPException(400, "item name and desc are required")
    line = await dm_shop_consult(item)
    return {"line": line}


@router_dnd.post("/chat/stream")
async def chat_stream(req: ChatRequest):
    state = load_game_state(req.game_id)
    if not state:
        raise HTTPException(404, "游戏不存在")
    normalize_player_style_state(state)
    canonicalize_trust_state(state)
    ensure_investigation_state(state)
    recorded_message = _sanitize_persisted_text(req.visible_message or req.message)
    model_message = req.message

    # 閫掑褰撳墠鍖哄煙琛屽姩娆℃暟
    state["actions_in_area"] = int(state.get("actions_in_area", 0)) + 1
    save_game_state(req.game_id, state)

    recent = get_recent_memories(req.game_id)
    ctx = search_memory(req.game_id, recorded_message, n_results=3)

    async def gen():
        full = ""
        systems: list[str] = []
        sequence = 0
        directive_filter = DirectiveStreamFilter()
        player_protocol_filter = PlayerProtocolFilter()

        def emit(event_type: str, payload, source: str = "dm_service") -> str:
            nonlocal sequence
            sequence += 1
            envelope = make_event(event_type, source, payload, sequence, req.game_id)
            return f"data: {json.dumps(envelope, ensure_ascii=False)}\n\n"

        # 鑾峰彇鏃ュ織鍣ㄥ苟绔嬪嵆鍐欏叆鐜╁杈撳叆
        sid = _session_map.get(req.game_id, req.game_id)
        log = get_logger(sid)
        log.log_player(recorded_message)

        # 鑾峰彇鍘嗗彶瀵硅瘽
        history = _chat_history.get(req.game_id, [])
        if len(history) > MAX_HISTORY:
            history = history[-MAX_HISTORY:]

        # 棰勯: 妫€娴嬬敤鎴锋秷鎭腑鐨凞C妫€瀹氭爣绛撅紝鑷姩鎺烽
        preroll_event, enhanced_msg = _preroll_if_dc(model_message, state)
        if preroll_event:
            systems.append(preroll_event)
            yield emit("system", preroll_event, "rules")
            parsed_event = _parse_system_event_payload(preroll_event)
            if parsed_event:
                _, check_payload = parsed_event
                reward_change = apply_investigation_rewards(state, recorded_message, check_payload)
                if reward_change:
                    yield emit("state_update", reward_change, "rules")
            user_message = enhanced_msg
        else:
            user_message = model_message
            reward_change = apply_investigation_rewards(state, recorded_message, None)
            if reward_change:
                yield emit("state_update", reward_change, "rules")

        try:
            async for chunk in dm_chat_stream(user_message, state, history, ctx + recent):
                if chunk.startswith("[STATE:"):
                    change = _apply_state_change(chunk, state)
                    systems.append(chunk)
                    yield emit("state_update", change, "ai_candidate")
                elif chunk.startswith("[SYSTEM:"):
                    systems.append(chunk)
                    yield emit("system", chunk)
                else:
                    narrative, directives = directive_filter.feed(chunk)
                    for directive in directives:
                        change = apply_directive(state, directive, source="ai")
                        systems.append(directive.raw)
                        yield emit("state_update", change, "ai_candidate")
                    if narrative:
                        visible, hints = player_protocol_filter.feed(narrative)
                        if hints:
                            yield emit("suggestions", hints)
                        if visible:
                            full += visible
                            yield emit("narrative", visible)

            narrative, directives = directive_filter.flush()
            for directive in directives:
                change = apply_directive(state, directive, source="ai")
                systems.append(directive.raw)
                yield emit("state_update", change, "ai_candidate")
            if narrative:
                visible, hints = player_protocol_filter.feed(narrative)
                if hints:
                    yield emit("suggestions", hints)
                if visible:
                    full += visible
                    yield emit("narrative", visible)

            visible, hints = player_protocol_filter.flush()
            if hints:
                yield emit("suggestions", hints)
            if visible:
                full += visible
                yield emit("narrative", visible)

            if not _strip_player_protocol_text(full):
                fallback_filter = PlayerProtocolFilter()
                fallback = _fallback_chat_narrative(recorded_message, state, systems)
                visible, hints = fallback_filter.feed(fallback)
                tail, tail_hints = fallback_filter.flush()
                hints.extend(tail_hints)
                full = _strip_player_protocol_text(visible + tail)
                if hints:
                    yield emit("suggestions", hints)
                if full:
                    yield emit("narrative", full)

            # DM璇村畬涓€娈?鈫?鍐欏叆鏃ュ織锛堥檮甯︾郴缁熶簨浠讹級
            full = _strip_player_protocol_text(full)
            log.log_dm(full, systems)

            # 淇濆瓨瀵硅瘽鍘嗗彶
            history.append({"role": "user", "content": recorded_message})
            history.append({"role": "assistant", "content": full})
            if len(history) > MAX_HISTORY:
                history = history[-MAX_HISTORY:]
            _chat_history[req.game_id] = history
            # 淇濆瓨璁板繂鍜岀姸鎬?
            save_memory(req.game_id, f"鐜╁: {recorded_message}")
            if full: save_memory(req.game_id, f"DM: {full[:200]}")
            state["last_event"] = recorded_message[:100]
            update_scene_summary(state, recorded_message, systems[-1] if systems else "")
            _sanitize_state_in_place(state)
            save_game_state(req.game_id, state)
            yield emit("state_snapshot", state, "rules")
            yield emit("done", None)
        except asyncio.CancelledError:
            raise
        except Exception as e:
            if full:
                log.log_dm(_strip_player_protocol_text(full) + f"\n[涓柇: {e}]")
            log.log_error(str(e))
            fallback = full or _fallback_chat_narrative(recorded_message, state, systems)
            if not full:
                fallback_filter = PlayerProtocolFilter()
                visible, hints = fallback_filter.feed(fallback)
                tail, tail_hints = fallback_filter.flush()
                hints.extend(tail_hints)
                full = _strip_player_protocol_text(visible + tail)
                if hints:
                    yield emit("suggestions", hints)
                if full:
                    yield emit("narrative", full)

            # 寮傚父鏃朵繚瀛樼姸鎬侊紙闃叉鏈疆鐘舵€佸彉鏇翠涪澶憋級
            try:
                history.append({"role": "user", "content": recorded_message})
                history.append({"role": "assistant", "content": full})
                if len(history) > MAX_HISTORY:
                    history = history[-MAX_HISTORY:]
                _chat_history[req.game_id] = history
                save_memory(req.game_id, f"鐜╁: {recorded_message}")
                if full:
                    save_memory(req.game_id, f"DM: {full[:200]}")
                state["last_event"] = recorded_message[:100]
                update_scene_summary(state, recorded_message, systems[-1] if systems else "")
                _sanitize_state_in_place(state)
                save_game_state(req.game_id, state)
            except Exception as persist_error:
                log.log_error(f"fallback persist failed: {persist_error}")
            yield emit("state_snapshot", state, "rules")
            yield emit("done", None)

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
    return {"narration": text, "source": "ai" if text else "fallback"}


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


@router_dnd.get("/ai/health")
async def ai_health():
    result = await dm_health_check()
    if not result.get("ok"):
        return {
            "ok": False,
            "status": "unavailable",
            "message": "AI 大模型当前无法正常返回文本，请检查后端模型配置或网络状态。",
            "error": result.get("error", "LLMUnavailable"),
            "model": result.get("model"),
            "health_max_tokens": result.get("health_max_tokens"),
        }
    return {
        "ok": True,
        "status": "ok",
        "message": "AI 大模型连接正常，可以开始跑团。",
        "model": result.get("model"),
        "health_max_tokens": result.get("health_max_tokens"),
    }


@router_dnd.get("/ai/settings")
async def ai_settings():
    return get_ai_runtime_settings()


@router_dnd.post("/ai/settings")
async def update_ai_settings(req: AiSettingsRequest):
    try:
        return update_ai_runtime_settings(req.model, req.health_max_tokens)
    except ValueError as error:
        raise HTTPException(400, str(error)) from error
