"""State directive system for AI-run tabletop sessions.

The KP can emit hidden command lines such as:
    [CMD:gold:{"amount":-20,"reason":"公会注册费"}]

These commands are intercepted by the backend, applied to the authoritative
game state, and never shown as narrative text.
"""
from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Callable, Iterable


@dataclass
class Directive:
    name: str
    data: dict
    raw: str


ChangeHandler = Callable[[dict, dict], dict]


NPC_TRUST_KEYS = {
    "格鲁姆": "gm_trust",
    "丽莎": "ls_trust",
    "塔莉亚": "tl_trust",
    "伊瑟拉": "ys_trust",
}

NPC_HP_KEYS = {
    "格鲁姆": "gm_hp",
    "丽莎": "ls_hp",
    "塔莉亚": "tl_hp",
}


def _amount(data: dict) -> int:
    return int(data.get("amount", data.get("change", 0)))


def _split_inventory(value: str) -> list[str]:
    return [item.strip() for item in value.split(",") if item.strip()]


def _gold(state: dict, data: dict) -> dict:
    amount = _amount(data)
    old = int(state.get("gold", 200))
    state["gold"] = max(0, old + amount)
    return {
        "type": "gold",
        "old": old,
        "new": state["gold"],
        "change": amount,
        "reason": data.get("reason", ""),
    }


def _inventory(state: dict, data: dict) -> dict:
    item = str(data.get("item", "")).strip()
    if not item:
        return {"type": "unknown", "reason": "inventory 指令缺少 item"}

    op = data.get("op") or data.get("operation") or data.get("action")
    if op not in ("add", "remove"):
        return {"type": "unknown", "reason": f"未知 inventory 操作: {op}"}

    inventory = _split_inventory(state.get("inventory", ""))
    if op == "add" and item not in inventory:
        inventory.append(item)
    elif op == "remove" and item in inventory:
        inventory.remove(item)

    state["inventory"] = ",".join(inventory)
    return {"type": "inventory", "op": op, "item": item, "inventory": state["inventory"]}


def _hp(state: dict, data: dict) -> dict:
    amount = _amount(data)
    old = int(state.get("current_hp", 30))
    max_hp = int(state.get("max_hp", 30))
    state["current_hp"] = max(0, min(max_hp, old + amount))
    return {
        "type": "hp",
        "old": old,
        "new": state["current_hp"],
        "max": max_hp,
        "change": amount,
        "reason": data.get("reason", ""),
    }


def _trust(state: dict, data: dict) -> dict:
    npc = str(data.get("npc", "")).strip()
    amount = _amount(data)
    key = NPC_TRUST_KEYS.get(npc, f"{npc}_trust")
    old = int(state.get(key, 50))
    state[key] = max(0, min(100, old + amount))
    return {
        "type": "trust",
        "npc": npc,
        "old": old,
        "new": state[key],
        "change": amount,
        "reason": data.get("reason", ""),
    }


def _area(state: dict, data: dict) -> dict:
    area = str(data.get("area", data.get("new", ""))).strip()
    if not area:
        return {"type": "unknown", "reason": "area 指令缺少 area"}

    old = state.get("current_area", "王冠城")
    state["current_area"] = area
    return {"type": "area", "old": old, "new": area, "reason": data.get("reason", "")}


def _level_up(state: dict, data: dict) -> dict:
    old_level = int(state.get("level", 3))
    new_level = int(data.get("level", old_level + 1))
    old_max = int(state.get("max_hp", 30))
    hp_gain = int(data.get("hp_gain", 5))
    state["level"] = new_level
    state["max_hp"] = int(data.get("max_hp", old_max + hp_gain))
    state["current_hp"] = state["max_hp"]
    return {
        "type": "level_up",
        "old": old_level,
        "new": new_level,
        "max_hp": state["max_hp"],
        "reason": data.get("reason", ""),
    }


def _npc_hp(state: dict, data: dict) -> dict:
    npc = str(data.get("npc", "")).strip()
    amount = _amount(data)
    key = NPC_HP_KEYS.get(npc, f"{npc}_hp")
    old = int(state.get(key, 30))
    state[key] = max(0, old + amount)
    return {
        "type": "npc_hp",
        "npc": npc,
        "old": old,
        "new": state[key],
        "change": amount,
        "reason": data.get("reason", ""),
    }


def _attribute(state: dict, data: dict) -> dict:
    attr = str(data.get("attr", "")).strip()
    if attr not in {"str", "dex", "con", "int", "wis", "cha"}:
        return {"type": "unknown", "reason": f"未知属性: {attr}"}

    amount = _amount(data)
    old = int(state.get(attr, 12))
    state[attr] = old + amount
    return {
        "type": "attribute",
        "attr": attr,
        "old": old,
        "new": state[attr],
        "change": amount,
        "reason": data.get("reason", ""),
    }


def _xp(state: dict, data: dict) -> dict:
    amount = _amount(data)
    old = int(state.get("xp", 0))
    state["xp"] = old + amount
    return {
        "type": "xp",
        "old": old,
        "new": state["xp"],
        "change": amount,
        "reason": data.get("reason", ""),
    }


def _complete_chapter(state: dict, data: dict) -> dict:
    old = int(state.get("cleared_levels", 0))
    state["cleared_levels"] = int(data.get("cleared_levels", old + 1))
    return {
        "type": "complete_chapter",
        "old": old,
        "new": state["cleared_levels"],
        "reason": data.get("reason", ""),
    }


DIRECTIVE_HANDLERS: dict[str, ChangeHandler] = {
    "gold": _gold,
    "update_gold": _gold,
    "inventory": _inventory,
    "item": _inventory,
    "update_inventory": _inventory,
    "hp": _hp,
    "update_hp": _hp,
    "trust": _trust,
    "update_trust": _trust,
    "area": _area,
    "update_area": _area,
    "level_up": _level_up,
    "npc_hp": _npc_hp,
    "update_npc_hp": _npc_hp,
    "attribute": _attribute,
    "update_attribute": _attribute,
    "xp": _xp,
    "add_xp": _xp,
    "complete_chapter": _complete_chapter,
}


def apply_directive(state: dict, directive: Directive | dict) -> dict:
    if isinstance(directive, Directive):
        name, data = directive.name, directive.data
    else:
        name = str(directive.get("name") or directive.get("type") or directive.get("action", ""))
        data = dict(directive)

    handler = DIRECTIVE_HANDLERS.get(name)
    if not handler:
        return {"type": "unknown", "reason": f"未知状态指令: {name}"}

    try:
        return handler(state, data)
    except Exception as exc:
        return {"type": "unknown", "reason": f"状态指令失败: {exc}"}


def parse_cmd(raw: str) -> Directive | None:
    """Parse [CMD:name:{json}] or [DIRECTIVE:name:{json}]."""
    raw = raw.strip()
    for prefix in ("[CMD:", "[DIRECTIVE:"):
        if raw.startswith(prefix) and raw.endswith("]"):
            body = raw[len(prefix):-1]
            try:
                name, data_str = body.split(":", 1)
                return Directive(name=name.strip(), data=json.loads(data_str), raw=raw)
            except Exception:
                return None
    return None


def parse_state_chunk(raw: str) -> Directive | None:
    """Parse the legacy [STATE:tool_name:{...}] chunk emitted by tool calls."""
    raw = raw.strip()
    if not raw.startswith("[STATE:") or not raw.endswith("]"):
        return None
    try:
        _, tool_name, data_str = raw.split(":", 2)
        data = json.loads(data_str[:-1])
        return Directive(name=tool_name.strip(), data=data, raw=raw)
    except Exception:
        return None


def encode_cmd(name: str, data: dict) -> str:
    return f"[CMD:{name}:{json.dumps(data, ensure_ascii=False)}]"


def _partial_command_suffix(text: str) -> int:
    prefixes = ("[CMD:", "[DIRECTIVE:")
    max_keep = 0
    for prefix in prefixes:
        limit = min(len(prefix) - 1, len(text))
        for size in range(1, limit + 1):
            if text.endswith(prefix[:size]):
                max_keep = max(max_keep, size)
    return max_keep


class DirectiveStreamFilter:
    """Incrementally removes hidden directives from streamed narrative text."""

    def __init__(self) -> None:
        self._buffer = ""

    def feed(self, chunk: str) -> tuple[str, list[Directive]]:
        self._buffer += chunk
        return self._drain(complete=False)

    def flush(self) -> tuple[str, list[Directive]]:
        narrative, directives = self._drain(complete=True)
        if self._buffer:
            narrative += self._buffer
            self._buffer = ""
        return narrative, directives

    def _drain(self, complete: bool) -> tuple[str, list[Directive]]:
        narrative_parts: list[str] = []
        directives: list[Directive] = []

        while self._buffer:
            cmd_positions = [
                pos for pos in (
                    self._buffer.find("[CMD:"),
                    self._buffer.find("[DIRECTIVE:"),
                )
                if pos >= 0
            ]

            if not cmd_positions:
                if complete:
                    narrative_parts.append(self._buffer)
                    self._buffer = ""
                else:
                    keep = _partial_command_suffix(self._buffer)
                    if keep:
                        narrative_parts.append(self._buffer[:-keep])
                        self._buffer = self._buffer[-keep:]
                    else:
                        narrative_parts.append(self._buffer)
                        self._buffer = ""
                break

            start = min(cmd_positions)
            if start > 0:
                narrative_parts.append(self._buffer[:start])
                self._buffer = self._buffer[start:]

            end = self._buffer.find("]")
            if end < 0:
                break

            raw = self._buffer[:end + 1]
            directive = parse_cmd(raw)
            if directive:
                directives.append(directive)
            self._buffer = self._buffer[end + 1:]

        return "".join(narrative_parts), directives


def apply_directives(state: dict, directives: Iterable[Directive]) -> list[dict]:
    return [apply_directive(state, directive) for directive in directives]
