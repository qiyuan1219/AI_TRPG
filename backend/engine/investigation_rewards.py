"""Authoritative investigation reward rules.

AI may narrate an investigation, but this module owns reward application:
documents, clues, flags, quest updates, and once-only guards.
"""
from __future__ import annotations

import re
from copy import deepcopy
from datetime import datetime, timezone
from typing import Any


DOCUMENTS: dict[str, dict[str, Any]] = {
    "report_missing_expedition_01": {
        "id": "report_missing_expedition_01",
        "name": "远征队失联报告",
        "type": "document",
        "category": "archive",
        "icon": "report_scroll",
        "readable": True,
        "source": "公会大厅 - 报告单堆",
        "summary": "一份记录第三远征队最后行动轨迹的公会认证报告。",
        "content": {
            "title": "远征队失联报告",
            "sections": [
                {
                    "heading": "队伍信息",
                    "body": "第三远征队共七人，于三个月前从逆穹城前线堡垒出发，目标为地底堡垒旧址。",
                },
                {
                    "heading": "最后记录",
                    "body": "队伍在深层矿道发现大面积蓝绿色菌斑，并报告有疑似孢化地底兽的活动痕迹。",
                },
                {
                    "heading": "异常情况",
                    "body": "通讯中断前，队长曾提到矿道墙壁中传来类似敲击声的回音，随后所有信标同时熄灭。",
                },
                {
                    "heading": "备注",
                    "body": "报告末尾有被墨水划掉的部分，只能隐约看见“不要靠近发光铆钉尽头”几个字。",
                },
            ],
        },
        "tags": ["expedition", "underdark", "spore_beast", "missing_team", "main_quest"],
        "unlocks": [
            "dialogue_guild_clerk_ask_about_spore_beast",
            "route_warning_glowing_rivets",
        ],
    },
}


CLUES: dict[str, dict[str, Any]] = {
    "expedition_saw_spore_beasts": {
        "id": "expedition_saw_spore_beasts",
        "name": "远征队曾遭遇孢化地底兽",
        "description": "第三远征队在失联前报告过疑似孢化地底兽的活动痕迹。",
        "source": "report_missing_expedition_01",
        "tags": ["monster", "spore_beast", "expedition"],
    },
    "guild_files_were_removed": {
        "id": "guild_files_were_removed",
        "name": "公会档案被抽走过",
        "description": "报告单堆中有明显缺页，说明有人在你来之前移走了部分文件。",
        "source": "公会大厅 - 报告单堆",
        "tags": ["guild", "missing_files", "investigation"],
    },
}


GUILD_HALL_ACTIONS: list[dict[str, Any]] = [
    {
        "id": "inspect_reports",
        "label": "观察柜台旁的报告单",
        "type": "investigate",
        "target": "mission_report_stack",
        "match": re.compile(r"(观察|查看|调查|翻阅|检查).*(报告单|远征档案|失联报告|档案)|报告单", re.I),
        "check": {"attribute": "调查", "dc": 12, "dice": "1d20"},
        "rewards": {
            "criticalSuccess": [
                {"type": "document", "id": "report_missing_expedition_01"},
                {"type": "clue", "id": "expedition_saw_spore_beasts"},
            ],
            "success": [
                {"type": "document", "id": "report_missing_expedition_01"},
                {"type": "clue", "id": "expedition_saw_spore_beasts"},
            ],
            "partial": [
                {"type": "clue", "id": "expedition_saw_spore_beasts"},
            ],
            "fail": [
                {"type": "clue", "id": "guild_files_were_removed"},
            ],
            "criticalFail": [
                {"type": "flag", "id": "guild_clerk_alerted", "value": True},
            ],
        },
        "onceOnly": True,
        "questUpdate": {
            "id": "quest_missing_expedition_report",
            "title": "调查失联远征队",
            "objective": "带着远征队失联报告，向萨洛或公会人员追问孢化地底兽。",
        },
    },
]


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _list_ids(entries: Any) -> set[str]:
    if not isinstance(entries, list):
        return set()
    ids: set[str] = set()
    for entry in entries:
        if isinstance(entry, dict):
            entry_id = str(entry.get("id") or "").strip()
        else:
            entry_id = str(entry or "").strip()
        if entry_id:
            ids.add(entry_id)
    return ids


def ensure_investigation_state(state: dict) -> None:
    state.setdefault("documents", [])
    state.setdefault("clues", [])
    state.setdefault("flags", {})
    state.setdefault("questLog", {
        "mainQuest": "investigate_earthcore_gate",
        "currentObjective": "前往逆穹悬城",
        "completedObjectives": [],
        "updates": [],
    })
    state.setdefault("sceneState", {
        "currentScene": _scene_id_for_area(str(state.get("current_area") or "")),
        "visitedScenes": [],
    })
    scene_state = state.get("sceneState")
    if isinstance(scene_state, dict):
        current_scene = _scene_id_for_area(str(state.get("current_area") or ""))
        if current_scene:
            scene_state["currentScene"] = current_scene
            visited = scene_state.setdefault("visitedScenes", [])
            if isinstance(visited, list) and current_scene not in visited:
                visited.append(current_scene)


def _scene_id_for_area(area: str) -> str:
    if "公会" in area:
        return "guild_hall"
    if "酒馆" in area:
        return "echo_tavern"
    if "黑市" in area or "市场" in area:
        return "black_market"
    return "unknown"


def _is_guild_hall(state: dict) -> bool:
    area = str(state.get("current_area") or "")
    scene = state.get("sceneState", {}).get("currentScene") if isinstance(state.get("sceneState"), dict) else ""
    return "公会" in area or scene == "guild_hall"


def find_investigation_action(message: str, state: dict) -> dict[str, Any] | None:
    if not _is_guild_hall(state):
        return None
    text = str(message or "")
    for action in GUILD_HALL_ACTIONS:
        if action["match"].search(text):
            return action
    return None


def action_check_for_message(message: str, state: dict) -> tuple[str, int] | None:
    action = find_investigation_action(message, state)
    if not action:
        return None
    check = action.get("check") or {}
    return str(check.get("attribute") or "调查"), int(check.get("dc") or 12)


def classify_check_result(total: int, dc: int, natural_roll: int) -> str:
    if natural_roll == 20:
        return "criticalSuccess"
    if natural_roll == 1:
        return "criticalFail"
    if total >= dc + 5:
        return "criticalSuccess"
    if total >= dc:
        return "success"
    if total >= dc - 3:
        return "partial"
    return "fail"


def _roll_from_payload(payload: dict[str, Any]) -> int:
    raw = str(payload.get("掷骰") or payload.get("roll") or "")
    match = re.search(r"(\d+)", raw)
    if match:
        return int(match.group(1))
    return int(payload.get("naturalRoll") or payload.get("d20") or 0)


def _reward_bucket(action: dict[str, Any], level: str) -> list[dict[str, Any]]:
    rewards = action.get("rewards") or {}
    if level in rewards:
        return list(rewards[level])
    if level == "criticalSuccess":
        return list(rewards.get("success") or [])
    if level == "criticalFail":
        return list(rewards.get("fail") or [])
    return []


def apply_investigation_rewards(
    state: dict,
    message: str,
    check_payload: dict[str, Any] | None,
) -> dict[str, Any] | None:
    action = find_investigation_action(message, state)
    if not action or not check_payload:
        return None

    ensure_investigation_state(state)
    flags = state.setdefault("flags", {})
    action_flag = f"{action['id']}_completed"
    if action.get("onceOnly") and flags.get(action_flag):
        return {
            "type": "investigation_reward",
            "actionId": action["id"],
            "duplicate": True,
            "message": "该调查行动已经结算过，没有重复奖励。",
            "inventory": state.get("inventory", ""),
            "documents": state.get("documents", []),
            "clues": state.get("clues", []),
            "flags": flags,
            "questLog": state.get("questLog", {}),
            "sceneState": state.get("sceneState", {}),
            "addedDocuments": [],
            "addedClues": [],
            "appliedRewards": [],
        }

    roll = _roll_from_payload(check_payload)
    total = int(check_payload.get("总计") or check_payload.get("total") or 0)
    dc = int(check_payload.get("DC") or action.get("check", {}).get("dc") or 12)
    result_level = classify_check_result(total, dc, roll)
    reward_defs = _reward_bucket(action, result_level)

    existing_documents = _list_ids(state.get("documents"))
    existing_clues = _list_ids(state.get("clues"))
    added_documents: list[dict[str, Any]] = []
    added_clues: list[dict[str, Any]] = []
    applied_rewards: list[dict[str, Any]] = []

    for reward in reward_defs:
        reward_type = reward.get("type")
        reward_id = str(reward.get("id") or "").strip()
        if reward_type == "document" and reward_id in DOCUMENTS:
            if reward_id not in existing_documents:
                document = deepcopy(DOCUMENTS[reward_id])
                document["unlockedAt"] = _now()
                state["documents"].append(document)
                added_documents.append(document)
                existing_documents.add(reward_id)
            applied_rewards.append({"type": "document", "id": reward_id})
        elif reward_type == "clue" and reward_id in CLUES:
            if reward_id not in existing_clues:
                clue = deepcopy(CLUES[reward_id])
                clue["unlockedAt"] = _now()
                state["clues"].append(clue)
                added_clues.append(clue)
                existing_clues.add(reward_id)
            applied_rewards.append({"type": "clue", "id": reward_id})
        elif reward_type == "flag" and reward_id:
            flags[reward_id] = reward.get("value", True)
            applied_rewards.append({"type": "flag", "id": reward_id, "value": flags[reward_id]})
        elif reward_type == "item" and reward_id:
            inventory = [item.strip() for item in str(state.get("inventory", "")).split(",") if item.strip()]
            item_name = str(reward.get("name") or reward_id)
            if item_name not in inventory:
                inventory.append(item_name)
            state["inventory"] = ",".join(inventory)
            applied_rewards.append({"type": "item", "id": reward_id, "name": item_name})

    flags[action_flag] = True
    flags["guild_report_checked"] = True

    quest = state.setdefault("questLog", {})
    update = deepcopy(action.get("questUpdate") or {})
    if update:
        quest["mainQuest"] = quest.get("mainQuest") or "investigate_earthcore_gate"
        quest["currentObjective"] = update.get("objective") or quest.get("currentObjective")
        updates = quest.setdefault("updates", [])
        if isinstance(updates, list) and not any(item.get("id") == update.get("id") for item in updates if isinstance(item, dict)):
            update["createdAt"] = _now()
            updates.append(update)
        applied_rewards.append({"type": "quest_update", "id": update.get("id"), "title": update.get("title")})

    return {
        "type": "investigation_reward",
        "actionId": action["id"],
        "actionLabel": action["label"],
        "duplicate": False,
        "resultLevel": result_level,
        "roll": roll,
        "total": total,
        "dc": dc,
        "inventory": state.get("inventory", ""),
        "documents": state.get("documents", []),
        "clues": state.get("clues", []),
        "flags": flags,
        "questLog": state.get("questLog", {}),
        "sceneState": state.get("sceneState", {}),
        "addedDocuments": added_documents,
        "addedClues": added_clues,
        "appliedRewards": applied_rewards,
    }
