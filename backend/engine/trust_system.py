"""Validated companion trust state for the D&D runtime."""
from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

CompanionId = str

COMPANION_IDS: tuple[CompanionId, ...] = ("serin", "ailin", "brock", "kaiya")

COMPANION_NAMES: dict[CompanionId, str] = {
    "serin": "瑟琳",
    "ailin": "艾琳",
    "brock": "布洛克",
    "kaiya": "凯娅",
}

INITIAL_TRUST: dict[CompanionId, int] = {
    "serin": 84,
    "ailin": 55,
    "brock": 50,
    "kaiya": 45,
}

# 注意: trust_sl = trust瑟琳 (sl=瑟琳), sl_trust = 森洛trust (sl=森洛/布洛克)
# 两者顺序不同, 切勿混淆
TRUST_ALIASES: dict[CompanionId, tuple[str, ...]] = {
    "serin": ("se_trust", "trust_sl"),
    "ailin": ("trust_al", "al_trust"),
    "brock": ("trust_block", "sl_trust"),
    "kaiya": ("trust_kl", "kl_trust"),
}

DISPLAY_TRUST_KEYS: dict[CompanionId, str] = {
    "serin": "se_trust",
    "ailin": "al_trust",
    "brock": "trust_block",
    "kaiya": "kl_trust",
}

NPC_TO_COMPANION_ID: dict[str, CompanionId] = {
    "瑟琳": "serin",
    "银杖": "serin",
    "银杖瑟琳": "serin",
    "瑟琳·逆钟": "serin",
    "serin": "serin",
    "艾琳": "ailin",
    "艾琳·白枝": "ailin",
    "白枝": "ailin",
    "ailin": "ailin",
    "布洛克": "brock",
    "布洛克·铁锅": "brock",
    "森洛": "brock",
    "森洛·铁锅": "brock",
    "brock": "brock",
    "block": "brock",
    "凯娅": "kaiya",
    "软爪": "kaiya",
    "软爪凯娅": "kaiya",
    "克莱娅": "kaiya",
    "克莱娅·软爪": "kaiya",
    "kaiya": "kaiya",
}

DELTA_LIMITS: dict[str, tuple[int, int]] = {
    "free_action": (-5, 5),
    "preset_choice": (-12, 12),
    "sidequest_key_choice": (-20, 15),
    "battle_result": (-6, 6),
    "boss_preparation": (-20, 15),
    "check_result": (-5, 5),
}


def clamp_int(value: object, minimum: int, maximum: int, fallback: int = 0) -> int:
    try:
        number = int(value)
    except (TypeError, ValueError):
        number = fallback
    return max(minimum, min(maximum, number))


def get_trust_tier(value: int) -> str:
    value = clamp_int(value, 0, 100)
    if value <= 29:
        return "疏离"
    if value <= 49:
        return "谨慎"
    if value <= 69:
        return "合作"
    if value <= 84:
        return "信赖"
    return "深信"


def resolve_companion_id(value: object) -> CompanionId | None:
    raw = str(value or "").strip()
    if not raw:
        return None
    return NPC_TO_COMPANION_ID.get(raw) or (raw if raw in COMPANION_IDS else None)


def _read_trust_value(state: dict, companion_id: CompanionId) -> int:
    companion_trust = state.get("companionTrust")
    if isinstance(companion_trust, dict) and companion_id in companion_trust:
        return clamp_int(companion_trust.get(companion_id), 0, 100, INITIAL_TRUST[companion_id])
    for key in TRUST_ALIASES[companion_id]:
        if key in state:
            return clamp_int(state.get(key), 0, 100, INITIAL_TRUST[companion_id])
    return INITIAL_TRUST[companion_id]


def sync_trust_aliases(state: dict, companion_id: CompanionId, value: int) -> None:
    value = clamp_int(value, 0, 100, INITIAL_TRUST[companion_id])
    state.setdefault("companionTrust", {})
    if not isinstance(state["companionTrust"], dict):
        state["companionTrust"] = {}
    state["companionTrust"][companion_id] = value
    for key in TRUST_ALIASES[companion_id]:
        state[key] = value


def canonicalize_trust_state(state: dict) -> dict:
    for companion_id in COMPANION_IDS:
        sync_trust_aliases(state, companion_id, _read_trust_value(state, companion_id))
    state.setdefault("trustLogs", [])
    if not isinstance(state["trustLogs"], list):
        state["trustLogs"] = []
    state.setdefault("companionMemories", [])
    if not isinstance(state["companionMemories"], list):
        state["companionMemories"] = []
    return state


def _sanitize_reason(reason: object) -> str:
    text = " ".join(str(reason or "").split())
    return text[:120]


def _normalize_change(change: dict, event_type: str) -> dict | None:
    companion_id = resolve_companion_id(change.get("companionId") or change.get("npc") or change.get("id"))
    if not companion_id:
        return None
    low, high = DELTA_LIMITS.get(event_type, DELTA_LIMITS["free_action"])
    delta = clamp_int(change.get("delta", change.get("amount", change.get("change", 0))), low, high)
    return {
        "companionId": companion_id,
        "delta": delta,
        "reason": _sanitize_reason(change.get("reason")),
        "visibility": "hidden" if change.get("visibility") == "hidden" else "show",
        "source": str(change.get("source") or event_type or "free_action"),
    }


def validate_trust_changes(changes: list[dict], event_type: str = "free_action") -> list[dict]:
    valid: list[dict] = []
    positive_budget = 12
    negative_budget = -15
    for change in changes:
        normalized = _normalize_change(change, event_type)
        if not normalized or normalized["delta"] == 0:
            continue
        delta = int(normalized["delta"])
        if delta > 0:
            delta = min(delta, positive_budget)
            positive_budget -= delta
        else:
            delta = max(delta, negative_budget)
            negative_budget -= delta
        if delta == 0:
            continue
        normalized["delta"] = delta
        valid.append(normalized)
    return valid


def _already_changed_in_node(state: dict, node_id: str, companion_id: CompanionId, source: str) -> bool:
    if source != "free_action":
        return False
    for log in state.get("trustLogs", []) or []:
        if (
            isinstance(log, dict)
            and log.get("nodeId") == node_id
            and log.get("companionId") == companion_id
            and log.get("source") == "free_action"
        ):
            return True
    return False


def apply_trust_changes(state: dict, changes: list[dict], context: dict | None = None) -> dict:
    canonicalize_trust_state(state)
    context = context or {}
    event_type = str(context.get("eventType") or context.get("source") or "free_action")
    node_id = str(context.get("nodeId") or state.get("currentNodeId") or state.get("current_area") or "unknown")
    validated = validate_trust_changes(changes, event_type)

    applied: list[dict] = []
    ignored: list[dict] = []
    now = datetime.now(timezone.utc).isoformat()
    logs = state.setdefault("trustLogs", [])

    for change in validated:
        companion_id = change["companionId"]
        source = change.get("source") or event_type
        if _already_changed_in_node(state, node_id, companion_id, source):
            ignored.append({**change, "reason": "同一节点内自由输入信任变化已记录过"})
            continue
        old_value = _read_trust_value(state, companion_id)
        new_value = clamp_int(old_value + int(change["delta"]), 0, 100, old_value)
        if new_value == old_value:
            continue
        sync_trust_aliases(state, companion_id, new_value)
        log = {
            "id": str(uuid4())[:8],
            "nodeId": node_id,
            "companionId": companion_id,
            "companionName": COMPANION_NAMES[companion_id],
            "oldValue": old_value,
            "delta": new_value - old_value,
            "newValue": new_value,
            "reason": change.get("reason") or "玩家行动影响了同伴判断",
            "source": source,
            "visibility": change.get("visibility") or "show",
            "createdAt": now,
        }
        logs.append(log)
        applied.append(log)

    if len(logs) > 50:
        del logs[:-50]

    primary = applied[0] if applied else None
    return {
        "type": "trust",
        "applied": applied,
        "ignored": ignored,
        "companionTrust": state.get("companionTrust", {}),
        "trustLogs": logs[-8:],
        "npc": primary.get("companionName") if primary else "",
        "companionId": primary.get("companionId") if primary else "",
        "old": primary.get("oldValue") if primary else None,
        "new": primary.get("newValue") if primary else None,
        "change": primary.get("delta") if primary else 0,
        "reason": primary.get("reason") if primary else "",
        "visibility": primary.get("visibility") if primary else "hidden",
    }


def apply_memory_updates(state: dict, memory_updates: list[dict], node_id: str | None = None) -> list[dict]:
    canonicalize_trust_state(state)
    node_id = node_id or str(state.get("currentNodeId") or state.get("current_area") or "unknown")
    memories = state.setdefault("companionMemories", [])
    existing = {
        (item.get("companionId"), item.get("memoryKey"))
        for item in memories
        if isinstance(item, dict)
    }
    added: list[dict] = []
    now = datetime.now(timezone.utc).isoformat()
    for item in memory_updates:
        companion_id = resolve_companion_id(item.get("companionId") or item.get("npc"))
        memory_key = str(item.get("memoryKey") or "").strip()[:64]
        summary = _sanitize_reason(item.get("summary"))
        if not companion_id or not memory_key or not summary:
            continue
        marker = (companion_id, memory_key)
        if marker in existing:
            continue
        memory = {
            "companionId": companion_id,
            "companionName": COMPANION_NAMES[companion_id],
            "memoryKey": memory_key,
            "summary": summary,
            "nodeId": node_id,
            "createdAt": now,
        }
        memories.append(memory)
        existing.add(marker)
        added.append(memory)
    if len(memories) > 80:
        del memories[:-80]
    return added


def record_trust_patch_changes(
    state: dict,
    old_trust: dict[CompanionId, int],
    source: str = "preset_choice",
    reason: str = "",
) -> list[dict]:
    canonicalize_trust_state(state)
    node_id = str(state.get("currentNodeId") or state.get("current_area") or "unknown")
    logs = state.setdefault("trustLogs", [])
    now = datetime.now(timezone.utc).isoformat()
    added: list[dict] = []
    for companion_id in COMPANION_IDS:
        old_value = clamp_int(old_trust.get(companion_id), 0, 100, INITIAL_TRUST[companion_id])
        new_value = _read_trust_value(state, companion_id)
        if old_value == new_value:
            continue
        log = {
            "id": str(uuid4())[:8],
            "nodeId": node_id,
            "companionId": companion_id,
            "companionName": COMPANION_NAMES[companion_id],
            "oldValue": old_value,
            "delta": new_value - old_value,
            "newValue": new_value,
            "reason": reason or "剧情选择影响了同伴判断",
            "source": source,
            "visibility": "show",
            "createdAt": now,
        }
        logs.append(log)
        added.append(log)
    if len(logs) > 50:
        del logs[:-50]
    return added


def trust_state_for_prompt(state: dict) -> str:
    canonicalize_trust_state(state)
    lines = []
    for companion_id in COMPANION_IDS:
        value = _read_trust_value(state, companion_id)
        lines.append(f"{COMPANION_NAMES[companion_id]}:{value}({get_trust_tier(value)})")
    recent = []
    for log in (state.get("trustLogs") or [])[-4:]:
        if isinstance(log, dict):
            sign = "+" if int(log.get("delta", 0)) > 0 else ""
            recent.append(f"{log.get('companionName')} {sign}{log.get('delta')}: {log.get('reason')}")
    memories = []
    for memory in (state.get("companionMemories") or [])[-4:]:
        if isinstance(memory, dict):
            memories.append(f"{memory.get('companionName')}: {memory.get('summary')}")
    extra = ""
    if recent:
        extra += "\n最近信任变化: " + "；".join(recent)
    if memories:
        extra += "\n同伴记忆: " + "；".join(memories)
    return " | ".join(lines) + extra


def trust_payload(state: dict) -> dict:
    canonicalize_trust_state(state)
    return {
        "companionTrust": state.get("companionTrust", {}),
        "tiers": {
            companion_id: get_trust_tier(_read_trust_value(state, companion_id))
            for companion_id in COMPANION_IDS
        },
        "logs": (state.get("trustLogs") or [])[-20:],
        "memories": (state.get("companionMemories") or [])[-20:],
    }
