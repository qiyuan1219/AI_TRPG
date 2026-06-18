from __future__ import annotations

from typing import Any
from uuid import uuid4


ITEM_CATALOG: dict[str, dict[str, Any]] = {
    "fiction_dice": {"name": "虚构骰子", "aliases": ["fiction-dice"], "type": "consumable", "effect": {"type": "reroll", "rerollType": "fiction_dice"}},
    "omni_dice": {"name": "万能骰子", "aliases": ["omni-dice"], "type": "consumable", "effect": {"type": "reroll", "rerollType": "omni_dice"}},
    "healing_potion": {"name": "治疗药水", "aliases": ["小红瓶", "回血"], "type": "consumable", "effect": {"type": "heal", "formula": "1d8+2"}},
    "coagulation_powder": {"name": "止血粉", "aliases": [], "type": "consumable"},
    "antitoxin": {"name": "解毒剂", "aliases": ["弱效解毒剂"], "type": "consumable"},
    "purification_heart": {"name": "净化之心", "aliases": [], "type": "consumable"},
    "longsword": {"name": "长剑", "aliases": [], "type": "equipment"},
    "adventurer_kit": {"name": "冒险者工具包", "aliases": [], "type": "quest"},
    "spore_mask": {"name": "抗孢面罩", "aliases": [], "type": "quest"},
    "cold_lamp": {"name": "冷光灯", "aliases": ["冷光棒"], "type": "quest"},
    "elevator_safety_hook": {"name": "缆梯安全扣", "aliases": [], "type": "quest"},
    "guild_supply_crate": {"name": "公会补给箱", "aliases": [], "type": "quest"},
    "diamond": {"name": "钻石", "aliases": ["干净的钻石"], "type": "material"},
    "guild_badge": {"name": "公会徽记", "aliases": [], "type": "quest"},
    "gold": {"name": "金币", "aliases": ["G", "GP"], "type": "currency"},
    "kaiya_code_note": {"name": "凯娅的暗号", "aliases": ["黑市暗号纸条"], "type": "quest"},
    "yunling_charm": {"name": "云苓的护身符", "aliases": [], "type": "quest"},
    "third_expedition_report": {"name": "第三远征队失联报告", "aliases": [], "type": "document"},
    "missing_expedition_registry": {"name": "失踪远征队登记册", "aliases": [], "type": "document"},
    "third_patrol_record": {"name": "第三巡逻队记录", "aliases": [], "type": "document"},
    "wounded_purification_report": {"name": "伤员净化报告", "aliases": [], "type": "document"},
}

for item_id, name in (
    ("strength_potion", "力量药水"), ("intelligence_potion", "智力药水"),
    ("dexterity_potion", "敏捷药水"), ("constitution_potion", "体质药水"),
    ("wisdom_potion", "感知药水"), ("charisma_potion", "魅力药水"),
):
    ITEM_CATALOG[item_id] = {"name": name, "aliases": [], "type": "consumable"}

_ALIASES: dict[str, str] = {}
for catalog_id, definition in ITEM_CATALOG.items():
    for alias in (catalog_id, definition["name"], *definition.get("aliases", [])):
        _ALIASES[str(alias).strip().lower()] = catalog_id


def resolve_catalog_id(value: str) -> str:
    return _ALIASES.get(str(value or "").strip().lower(), "legacy_unknown")


def migrate_legacy_item(name: str, quantity: int = 1) -> dict[str, Any]:
    catalog_id = resolve_catalog_id(name)
    metadata = {} if catalog_id != "legacy_unknown" else {"legacyName": name}
    return {
        "instanceId": str(uuid4()),
        "catalogId": catalog_id,
        "name": ITEM_CATALOG.get(catalog_id, {}).get("name", name),
        "quantity": max(1, int(quantity)),
        "metadata": metadata,
    }
