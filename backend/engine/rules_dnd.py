from __future__ import annotations

"""D&D D20 规则引擎 —— 基于 D&D 2024 战斗规则"""
from dataclasses import dataclass
from typing import Optional
from engine.dice_service import DiceService

_DICE = DiceService()

def roll_d20() -> int:
    return _DICE.roll_die(20, "rules_dnd d20", "story_check", "story_check")

def roll_dice(dice_str: str) -> int:
    if "d" not in dice_str:
        return int(dice_str)
    count, sides = dice_str.split("d")
    count = int(count) if count else 1
    event = _DICE.roll_formula(f"{count}d{int(sides)}", "rules_dnd formula", "story_check", "story_check")
    return event["total"]


# ============================================================
# 冒险者流派与旧职业兼容
# ============================================================
DEFAULT_STYLE_ID = "balanced"
PENDING_STYLE_NAME = "待确认流派"

PLAYER_STYLES = [
    {
        "id": "iron-cable",
        "name": "铁缆流",
        "attributes": {"str": 15, "dex": 10, "con": 16, "int": 10, "wis": 12, "cha": 10},
    },
    {
        "id": "shadow-step",
        "name": "影步流",
        "attributes": {"str": 10, "dex": 16, "con": 12, "int": 10, "wis": 15, "cha": 10},
    },
    {
        "id": "arcane-analysis",
        "name": "秘析流",
        "attributes": {"str": 8, "dex": 12, "con": 12, "int": 16, "wis": 15, "cha": 10},
    },
    {
        "id": "resonance",
        "name": "共鸣流",
        "attributes": {"str": 8, "dex": 12, "con": 12, "int": 12, "wis": 13, "cha": 16},
    },
    {
        "id": "balanced",
        "name": "均衡流",
        "attributes": {"str": 12, "dex": 12, "con": 13, "int": 12, "wis": 12, "cha": 12},
    },
]

PLAYER_STYLE_BY_ID = {style["id"]: style for style in PLAYER_STYLES}
PLAYER_STYLE_BY_NAME = {style["name"]: style for style in PLAYER_STYLES}
LEGACY_CLASS_TO_STYLE_ID = {
    "warrior": "iron-cable",
    "战士": "iron-cable",
    "rogue": "shadow-step",
    "游荡者": "shadow-step",
    "wizard": "arcane-analysis",
    "mage": "arcane-analysis",
    "法师": "arcane-analysis",
    "cleric": "resonance",
    "牧师": "resonance",
    "paladin": "balanced",
    "圣骑士": "balanced",
}

PROFICIENCY_BONUS = {3: 2, 4: 3, 5: 3, 6: 4, 7: 4}


def get_modifier(value: int) -> int:
    return (value - 10) // 2


def get_max_hp(attributes: dict[str, int]) -> int:
    return 36 + get_modifier(int(attributes.get("con", 10))) * 3


def get_ac(attributes: dict[str, int]) -> int:
    return 13 + get_modifier(int(attributes.get("dex", 10)))


def get_initiative_modifier(attributes: dict[str, int]) -> int:
    return get_modifier(int(attributes.get("dex", 10)))


def derive_player_combat_stats(attributes: dict[str, int]) -> dict[str, int]:
    return {
        "hp": get_max_hp(attributes),
        "ac": get_ac(attributes),
        "initiative_modifier": get_initiative_modifier(attributes),
        "atk_bonus": 5,
    }


def resolve_player_style(style_id: str | None = None, style_name: str | None = None, legacy_class: str | None = None) -> dict:
    for raw in (style_id, style_name, legacy_class):
        key = str(raw or "").strip()
        if not key:
            continue
        if key in PLAYER_STYLE_BY_ID:
            return PLAYER_STYLE_BY_ID[key]
        if key in PLAYER_STYLE_BY_NAME:
            return PLAYER_STYLE_BY_NAME[key]
        mapped = LEGACY_CLASS_TO_STYLE_ID.get(key)
        if mapped and mapped in PLAYER_STYLE_BY_ID:
            return PLAYER_STYLE_BY_ID[mapped]
    return PLAYER_STYLE_BY_ID[DEFAULT_STYLE_ID]


def _attributes_from_state(state: dict) -> dict[str, int]:
    player = state.get("player")
    if isinstance(player, dict):
        attrs = player.get("attributes")
        if isinstance(attrs, dict) and all(key in attrs for key in ("str", "dex", "con", "int", "wis", "cha")):
            return {key: int(attrs[key]) for key in ("str", "dex", "con", "int", "wis", "cha")}
    if all(key in state for key in ("str", "dex", "con", "int", "wis", "cha")):
        return {key: int(state.get(key, 10)) for key in ("str", "dex", "con", "int", "wis", "cha")}
    return {}


def normalize_player_style_state(state: dict) -> dict:
    selected_style_id = str(
        state.get("selectedStyleId")
        or state.get("selected_style_id")
        or ((state.get("player") or {}).get("styleId") if isinstance(state.get("player"), dict) else "")
        or ""
    ).strip()
    selected_style_name = str(
        state.get("style_name")
        or ((state.get("player") or {}).get("styleName") if isinstance(state.get("player"), dict) else "")
        or ""
    ).strip()
    legacy_class = str(state.get("selectedClassId") or state.get("char_class") or "").strip()
    pending_selection = bool(state.get("style_selection_pending")) and not selected_style_id and legacy_class == PENDING_STYLE_NAME

    if pending_selection:
        attributes = _attributes_from_state(state) or dict(PLAYER_STYLE_BY_ID[DEFAULT_STYLE_ID]["attributes"])
        derived = derive_player_combat_stats(attributes)
        current_hp = int(state.get("current_hp") or derived["hp"])
        player = state.get("player") if isinstance(state.get("player"), dict) else {}
        state["player"] = {
            **player,
            "styleId": "",
            "styleName": PENDING_STYLE_NAME,
            "attributes": attributes,
            "maxHp": derived["hp"],
            "hp": min(current_hp, derived["hp"]),
            "ac": derived["ac"],
        }
        state["style_name"] = PENDING_STYLE_NAME
        state["char_class"] = PENDING_STYLE_NAME
        state["selectedStyleId"] = ""
        state["selected_style_id"] = ""
        state["selectedClassId"] = None
        for key, value in attributes.items():
            state[key] = value
        state["max_hp"] = derived["hp"]
        state["current_hp"] = min(current_hp, derived["hp"])
        state["ac"] = derived["ac"]
        state["initiative_modifier"] = derived["initiative_modifier"]
        state["atk_bonus"] = derived["atk_bonus"]
        return state

    style = resolve_player_style(selected_style_id, selected_style_name, legacy_class)
    has_explicit_style = bool(selected_style_id or selected_style_name)
    attributes = _attributes_from_state(state) if has_explicit_style else {}
    if not attributes:
        attributes = dict(style["attributes"])

    derived = derive_player_combat_stats(attributes)
    current_hp = int(state.get("current_hp") or ((state.get("player") or {}).get("hp") if isinstance(state.get("player"), dict) else 0) or derived["hp"])
    player = state.get("player") if isinstance(state.get("player"), dict) else {}
    state["player"] = {
        **player,
        "styleId": style["id"],
        "styleName": style["name"],
        "attributes": attributes,
        "maxHp": derived["hp"],
        "hp": min(current_hp, derived["hp"]),
        "ac": derived["ac"],
    }
    state["selectedStyleId"] = style["id"]
    state["selected_style_id"] = style["id"]
    state["style_name"] = style["name"]
    state["char_class"] = style["name"]
    state["selectedClassId"] = None
    for key, value in attributes.items():
        state[key] = value
    state["max_hp"] = derived["hp"]
    state["current_hp"] = min(current_hp, derived["hp"])
    state["ac"] = derived["ac"]
    state["initiative_modifier"] = derived["initiative_modifier"]
    state["atk_bonus"] = int(state.get("atk_bonus") or derived["atk_bonus"])
    state["style_selection_pending"] = False
    return state


def _style_preset(style: dict) -> dict[str, int]:
    attributes = dict(style["attributes"])
    derived = derive_player_combat_stats(attributes)
    return {**attributes, "hp": derived["hp"], "ac": derived["ac"], "atk_bonus": derived["atk_bonus"]}


CLASS_PRESETS = {style["name"]: _style_preset(style) for style in PLAYER_STYLES}
for legacy_name, mapped_style_id in LEGACY_CLASS_TO_STYLE_ID.items():
    CLASS_PRESETS[legacy_name] = dict(CLASS_PRESETS[PLAYER_STYLE_BY_ID[mapped_style_id]["name"]])
CLASS_PRESETS[PENDING_STYLE_NAME] = dict(CLASS_PRESETS[PLAYER_STYLE_BY_ID[DEFAULT_STYLE_ID]["name"]])


# ============================================================
# 武器精通特性（2024新规）
# ============================================================
WEAPON_MASTERY = {
    "Cleave": "命中后，可对5尺内另一目标造成属性调整值伤害（无攻击检定）",
    "Graze":  "未命中时仍造成属性调整值伤害（最少1点）",
    "Nick":   "副手攻击不消耗附赠动作（双持专属）",
    "Push":   "命中后将目标沿直线推开10尺（目标体型不超过大一级）",
    "Sap":    "命中后目标下次攻击检定有劣势",
    "Slow":   "命中后目标移动速度-10尺，持续到你的下回合开始",
    "Topple": "命中后目标需通过体质豁免（DC 8+STR+熟练），失败则倒地",
    "Vex":    "命中后，你下次对同一目标的攻击检定有优势",
}

# 武器 → 可附带的精通特性
WEAPON_MASTERY_OPTIONS = {
    "长剑":   ["Sap", "Push", "Graze"],
    "短剑":   ["Vex", "Nick"],
    "巨剑":   ["Graze", "Cleave", "Topple"],
    "战斧":   ["Topple", "Cleave", "Push"],
    "巨斧":   ["Cleave", "Graze", "Topple"],
    "战锤":   ["Push", "Topple", "Sap"],
    "匕首":   ["Nick", "Vex"],
    "长矛":   ["Slow", "Push", "Topple"],
    "手斧":   ["Vex", "Nick"],
    "长弓":   ["Slow", "Vex"],
    "短弓":   ["Vex", "Slow"],
    "刺剑":   ["Vex", "Sap"],
    "钉头锤": ["Sap", "Slow"],
    "长鞭":   ["Slow", "Sap"],
}

# 职业可用的精通槽位数量
CLASS_MASTERY_SLOTS = {
    "战士":   2,  # 4级+1
    "游荡者":  2,
    "圣骑士":  2,
    "法师":   0,  # 纯施法者无武器精通
    "牧师":   0,
}

# ============================================================
# 伤害类型映射
# ============================================================
DAMAGE_TYPES = {
    "物理": ["挥砍", "穿刺", "钝击"],
    "元素": ["火焰", "冷冻", "闪电", "强酸", "雷鸣"],
    "能量": ["光耀", "黯蚀", "力场", "心灵"],
    "状态": ["毒素"],
}

# 抗性/易伤/免疫 计算
def calc_damage_after_resistance(damage: int, dmg_type: str,
                                  resistances: list[str] = None,
                                  vulnerabilities: list[str] = None,
                                  immunities: list[str] = None) -> tuple[int, str]:
    """按规则顺序：免疫 → 易伤 → 抗性"""
    resistances = resistances or []
    vulnerabilities = vulnerabilities or []
    immunities = immunities or []
    if dmg_type in immunities:
        return 0, "免疫"
    if dmg_type in vulnerabilities:
        damage *= 2
    if dmg_type in resistances:
        damage //= 2
    return damage, ""


# ============================================================
# 状态DC计算
# ============================================================
def save_dc(ability_mod: int, prof_bonus: int) -> int:
    """法术/技能豁免DC = 8 + 属性调整值 + 熟练加值"""
    return 8 + ability_mod + prof_bonus

def grapple_dc(str_mod: int, prof_bonus: int) -> int:
    """擒抱/推撞DC = 8 + 力量调整值 + 熟练加值"""
    return 8 + str_mod + prof_bonus


# ============================================================
# 优势投掷
# ============================================================
def roll_d20_advantage() -> tuple[int, int, int]:
    """返回 (高值, 低值, 说明)"""
    a, b = roll_d20(), roll_d20()
    return max(a, b), min(a, b), "优势(取高)"

def roll_d20_disadvantage() -> tuple[int, int, int]:
    """返回 (低值, 高值, 说明)"""
    a, b = roll_d20(), roll_d20()
    return min(a, b), max(a, b), "劣势(取低)"


# ============================================================
# 专注检定
# ============================================================
def concentration_check(con_mod: int, damage: int, prof_bonus: int = 0) -> CheckResult:
    """专注受伤检定，DC = max(10, 伤害值/2)"""
    dc = max(10, damage // 2)
    return skill_check(con_mod, prof_bonus, dc)


# ============================================================
# 调整值
# ============================================================
def modifier(stat: int) -> int:
    return (stat - 10) // 2


# ============================================================
# 检定结果
# ============================================================
@dataclass
class CheckResult:
    roll: int
    bonus: int
    total: int
    dc: int
    success: bool
    critical: bool  # 20
    fumble: bool    # 1

    def to_dict(self) -> dict:
        return {
            "掷骰": f"D20={self.roll}", "加值": self.bonus,
            "总计": self.total, "DC": self.dc,
            "成功": self.success, "大成功": self.critical, "大失败": self.fumble,
        }


@dataclass
class AttackResult:
    roll: int
    bonus: int
    total: int
    target_ac: int
    hit: bool
    critical: bool
    fumble: bool
    damage: int = 0
    weapon: str = ""

    def to_dict(self) -> dict:
        return {
            "武器": self.weapon, "攻击掷骰": f"D20={self.roll}+{self.bonus}={self.total}",
            "目标AC": self.target_ac, "命中": self.hit,
            "伤害": self.damage, "大成功": self.critical, "大失败": self.fumble,
        }


# ============================================================
# 技能检定
# ============================================================
def skill_check(stat_mod: int, prof_bonus: int = 0, dc: int = 13) -> CheckResult:
    roll = roll_d20()
    bonus = stat_mod + prof_bonus
    total = roll + bonus
    success = total >= dc
    return CheckResult(roll=roll, bonus=bonus, total=total, dc=dc,
                       success=success, critical=(roll==20), fumble=(roll==1))


# ============================================================
# 攻击检定
# ============================================================
def attack_roll(weapon: str, stat_mod: int, prof_bonus: int,
                target_ac: int, damage_dice: str = "1d8", dmg_mod: int = 0) -> AttackResult:
    roll = roll_d20()
    bonus = stat_mod + prof_bonus
    total = roll + bonus
    hit = total >= target_ac
    damage = 0
    if hit:
        damage = roll_dice(damage_dice) + dmg_mod
        if roll == 20:
            damage += roll_dice(damage_dice) + dmg_mod  # 暴击: 伤害骰和修正值都翻倍
    return AttackResult(roll=roll, bonus=bonus, total=total, target_ac=target_ac,
                        hit=hit, critical=(roll==20), fumble=(roll==1),
                        damage=damage, weapon=weapon)


# ============================================================
# 死亡豁免
# ============================================================
def death_save() -> CheckResult:
    roll = roll_d20()
    return CheckResult(roll=roll, bonus=0, total=roll, dc=10,
                       success=(roll>=10), critical=(roll==20), fumble=(roll==1))


# ============================================================
# 验证角色
# ============================================================
def validate_character(stats: dict) -> tuple[bool, str]:
    required = ["str", "dex", "con", "int", "wis", "cha"]
    for attr in required:
        if attr not in stats:
            return False, f"缺少属性: {attr}"
        if not (3 <= stats[attr] <= 18):
            return False, f"{attr} 超出范围 (3-18)"
    return True, "合法"
