"""Canonical game state migration and validated patch application.

Schema v2 deliberately keeps legacy top-level keys during the transition.  The
canonical subtrees are the new source of truth for new code; legacy projections
remain readable so existing scripted scenes do not break in one release.
"""
from __future__ import annotations

import copy
import re
import time
from dataclasses import dataclass, field
from typing import Any, Literal
from uuid import uuid4
from core.items import migrate_legacy_item
from core.context.scene_summary import build_scene_summary


GAME_STATE_SCHEMA_VERSION = 2
PROTECTED_AI_ROOTS = {"player", "party", "battle", "inventory", "inventoryState"}
PROTECTED_AI_LEGACY_KEYS = {
    "gold", "current_hp", "max_hp", "inventory", "equipment",
    "companionTrust", "se_trust", "al_trust", "sl_trust", "kl_trust",
    "trust_sl", "trust_block", "trust_al", "trust_kl",
}


@dataclass(frozen=True)
class PatchOperation:
    op: Literal["set", "increment", "append", "remove", "merge"]
    path: str
    value: Any = None


@dataclass
class PatchValidation:
    valid: bool
    operations: list[PatchOperation] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)


@dataclass(frozen=True)
class StatePatchEnvelope:
    schema_version: int
    patch_id: str
    source: str
    operations: list[PatchOperation]
    correlation_id: str | None = None


def create_patch_envelope(operations: list[PatchOperation], source: str,
                          correlation_id: str | None = None) -> StatePatchEnvelope:
    return StatePatchEnvelope(1, str(uuid4()), source, operations, correlation_id)


def _inventory_items(value: Any) -> list[dict[str, Any]]:
    if isinstance(value, dict) and isinstance(value.get("items"), list):
        return copy.deepcopy(value["items"])
    if isinstance(value, list):
        return copy.deepcopy(value)
    names = [part.strip() for part in str(value or "").split(",") if part.strip()]
    items = []
    for raw in names:
        match = re.match(r"^(.+?)(?:x|×)(\d+)$", raw, re.I)
        name = (match.group(1) if match else raw).strip()
        quantity = int(match.group(2)) if match else 1
        items.append(migrate_legacy_item(name, quantity))
    return items


def migrate_game_state(raw_state: dict[str, Any] | None, session_id: str = "") -> dict[str, Any]:
    """Upgrade a legacy state without removing fields consumed by old scenes."""
    state = copy.deepcopy(raw_state or {})
    canonical_session = state.get("session") if isinstance(state.get("session"), dict) else {}
    canonical_story = state.get("story") if isinstance(state.get("story"), dict) else {}
    canonical_player = state.get("player") if isinstance(state.get("player"), dict) else {}
    canonical_party = state.get("party") if isinstance(state.get("party"), dict) else {}
    canonical_inventory = state.get("inventoryState") if isinstance(state.get("inventoryState"), dict) else {}
    canonical_quests = state.get("quests") if isinstance(state.get("quests"), dict) else {}
    canonical_flags = state.get("flags") if isinstance(state.get("flags"), dict) else {}
    canonical_logs = state.get("logs") if isinstance(state.get("logs"), dict) else {}
    scene_state = state.get("sceneState") if isinstance(state.get("sceneState"), dict) else {}

    state["schemaVersion"] = GAME_STATE_SCHEMA_VERSION
    state["session"] = {
        "id": str(canonical_session.get("id") or session_id or state.get("session_id") or state.get("game_id") or ""),
        "phase": str(canonical_session.get("phase") or state.get("phase") or "story"),
        "turn": max(0, int(canonical_session.get("turn") or state.get("turn") or 0)),
        "updatedAt": float(canonical_session.get("updatedAt") or time.time()),
    }
    state["story"] = {
        "chapter": str(canonical_story.get("chapter") or state.get("chapter") or ""),
        "sceneId": str(canonical_story.get("sceneId") or scene_state.get("currentScene") or state.get("currentNodeId") or ""),
        "areaId": str(canonical_story.get("areaId") or state.get("current_area") or ""),
        "summary": str(canonical_story.get("summary") or state.get("scene_summary") or ""),
        "visitedSceneIds": list(canonical_story.get("visitedSceneIds") or scene_state.get("visitedScenes") or []),
        "sceneSummary": copy.deepcopy(canonical_story.get("sceneSummary") or {}),
    }
    if not state["story"]["sceneSummary"]:
        state["story"]["sceneSummary"] = build_scene_summary(state)
    state["player"] = {
        **canonical_player,
        "id": str(canonical_player.get("id") or "player"),
        "name": str(canonical_player.get("name") or state.get("player_name") or "冒险者"),
        "level": int(canonical_player.get("level") or state.get("level") or 1),
        "gold": int(canonical_player.get("gold") if canonical_player.get("gold") is not None else state.get("gold", 0)),
        "hp": int(canonical_player.get("hp") if canonical_player.get("hp") is not None else state.get("current_hp", state.get("max_hp", 1))),
        "maxHp": int(canonical_player.get("maxHp") if canonical_player.get("maxHp") is not None else state.get("max_hp", 1)),
    }
    state["party"] = {
        "members": list(canonical_party.get("members") or []),
        "trust": copy.deepcopy(canonical_party.get("trust") or state.get("companionTrust") or {}),
    }
    state["battle"] = copy.deepcopy(state.get("battle")) if isinstance(state.get("battle"), dict) else None
    state["inventoryState"] = {
        "items": _inventory_items(canonical_inventory or state.get("inventory")),
        "equipment": copy.deepcopy(canonical_inventory.get("equipment") or state.get("equipment") or {}),
    }
    state["quests"] = {
        "active": copy.deepcopy(canonical_quests.get("active") or state.get("questLog") or {}),
        "completed": list(canonical_quests.get("completed") or []),
    }
    state["flags"] = canonical_flags
    state["logs"] = {
        "game": list(canonical_logs.get("game") or []),
        "actions": list(canonical_logs.get("actions") or []),
        "events": list(canonical_logs.get("events") or []),
        "dice": list(canonical_logs.get("dice") or []),
    }
    return state


def validate_patch(state: dict[str, Any], operations: list[PatchOperation], source: str) -> PatchValidation:
    errors: list[str] = []
    if len(operations) > 64:
        errors.append("patch operation limit exceeded")
    for operation in operations:
        parts = [part for part in operation.path.split(".") if part]
        if not parts or any(part.startswith("_") or part in {"__proto__", "constructor", "prototype"} for part in parts):
            errors.append(f"invalid patch path: {operation.path}")
            continue
        if source == "ai" and (parts[0] in PROTECTED_AI_ROOTS or parts[0] in PROTECTED_AI_LEGACY_KEYS):
            errors.append(f"AI cannot modify protected state: {operation.path}")
        if source == "ai" and (parts[0].endswith("_hp") or parts[0].endswith("_trust") or parts[0].startswith("trust_")):
            errors.append(f"AI cannot modify protected state: {operation.path}")
        if operation.op == "increment" and not isinstance(operation.value, (int, float)):
            errors.append(f"increment requires a number: {operation.path}")
        leaf = parts[-1]
        if operation.op == "set" and leaf in {"gold", "hp", "maxHp", "current_hp", "max_hp"}:
            if not isinstance(operation.value, (int, float)) or operation.value < 0:
                errors.append(f"non-negative numeric value required: {operation.path}")
        if operation.op == "set" and (leaf == "trust" or leaf.endswith("_trust") or leaf.startswith("trust_")):
            if isinstance(operation.value, (int, float)) and not 0 <= operation.value <= 100:
                errors.append(f"trust must be within 0..100: {operation.path}")
        if operation.op == "append" and parts[0] not in {"logs", "story", "quests"}:
            errors.append(f"append is not allowed for: {operation.path}")
    return PatchValidation(valid=not errors, operations=operations if not errors else [], errors=errors)


def _parent_for_path(state: dict[str, Any], path: str) -> tuple[dict[str, Any], str]:
    parts = path.split(".")
    parent = state
    for part in parts[:-1]:
        current = parent.get(part)
        if not isinstance(current, dict):
            current = {}
            parent[part] = current
        parent = current
    return parent, parts[-1]


def apply_state_patch(state: dict[str, Any], operations: list[PatchOperation], source: str) -> tuple[dict[str, Any], PatchValidation]:
    validation = validate_patch(state, operations, source)
    if not validation.valid:
        return state, validation
    next_state = copy.deepcopy(state)
    for operation in validation.operations:
        parent, key = _parent_for_path(next_state, operation.path)
        if operation.op == "set":
            parent[key] = copy.deepcopy(operation.value)
        elif operation.op == "increment":
            parent[key] = parent.get(key, 0) + operation.value
        elif operation.op == "merge":
            if not isinstance(operation.value, dict):
                continue
            parent[key] = {**(parent.get(key) if isinstance(parent.get(key), dict) else {}), **copy.deepcopy(operation.value)}
        elif operation.op == "append":
            parent[key] = [*(parent.get(key) if isinstance(parent.get(key), list) else []), copy.deepcopy(operation.value)]
        elif operation.op == "remove":
            parent.pop(key, None)
    return migrate_game_state(next_state, str(next_state.get("session", {}).get("id", ""))), validation


def legacy_patch_operations(patch: dict[str, Any]) -> list[PatchOperation]:
    """Compatibility adapter used by existing scripted UI patches."""
    return [PatchOperation("set", str(key), value) for key, value in patch.items() if key not in {"game_id", "id"}]
