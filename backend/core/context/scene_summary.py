from __future__ import annotations

from datetime import datetime, timezone
from typing import Any


def _text_list(value: Any, limit: int = 12) -> list[str]:
    if not isinstance(value, list):
        return []
    result = []
    for item in value[-limit:]:
        text = str(item.get("text") or item.get("name") or item.get("id") if isinstance(item, dict) else item).strip()
        if text:
            result.append(text)
    return result


def build_scene_summary(state: dict[str, Any]) -> dict[str, Any]:
    story = state.get("story") if isinstance(state.get("story"), dict) else {}
    previous = story.get("sceneSummary") if isinstance(story.get("sceneSummary"), dict) else {}
    quest = state.get("questLog") if isinstance(state.get("questLog"), dict) else {}
    flags = state.get("flags") if isinstance(state.get("flags"), dict) else {}
    confirmed = [str(item) for item in previous.get("confirmedFacts", []) if str(item).strip()]
    for key, value in flags.items():
        if value is True:
            fact = f"flag:{key}"
            if fact not in confirmed:
                confirmed.append(fact)
    participants = [str(state.get("player_name") or "冒险者"), "瑟琳"]
    for key, name in (("al_recruited", "艾琳"), ("sl_recruited", "布洛克"), ("kl_recruited", "凯娅")):
        if state.get(key):
            participants.append(name)
    return {
        "sceneId": str(story.get("sceneId") or state.get("currentNodeId") or ""),
        "areaId": str(story.get("areaId") or state.get("current_area") or ""),
        "title": str(state.get("current_area") or story.get("areaId") or "当前场景"),
        "currentObjective": str(quest.get("currentObjective") or ""),
        "participants": participants,
        "confirmedFacts": confirmed[-24:],
        "unresolvedClues": _text_list(state.get("clues")),
        "recentRuleEvents": [str(item) for item in previous.get("recentRuleEvents", [])][-8:],
        "recentPlayerIntent": str(previous.get("recentPlayerIntent") or state.get("last_event") or ""),
        "lastUpdatedAt": datetime.now(timezone.utc).isoformat(),
        "version": 1,
    }


def update_scene_summary(state: dict[str, Any], player_intent: str = "", rule_event: str = "") -> dict[str, Any]:
    summary = build_scene_summary(state)
    if player_intent:
        summary["recentPlayerIntent"] = player_intent[:300]
    if rule_event:
        summary["recentRuleEvents"] = [*summary["recentRuleEvents"], rule_event[:300]][-8:]
    story = state.setdefault("story", {})
    story["sceneSummary"] = summary
    # Legacy human-readable projection.
    story["summary"] = f"{summary['title']}：{summary['currentObjective'] or summary['recentPlayerIntent']}"
    state["scene_summary"] = story["summary"]
    return summary
