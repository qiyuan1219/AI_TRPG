from __future__ import annotations

"""D&D D20 规则引擎 —— 基于 D&D 2024 战斗规则"""
import random
from dataclasses import dataclass
from typing import Optional


def roll_d20() -> int:
    return random.randint(1, 20)

def roll_dice(dice_str: str) -> int:
    if "d" not in dice_str:
        return int(dice_str)
    count, sides = dice_str.split("d")
    count = int(count) if count else 1
    return sum(random.randint(1, int(sides)) for _ in range(count))


# ============================================================
# 职业预设（标准数组: 16,15,14,13,12,10 分配）
# ============================================================
CLASS_PRESETS = {
    "战士":   {"str":16, "dex":13, "con":15, "int":10, "wis":12, "cha":8,  "hp":30, "ac":18, "atk_bonus":5},
    "游荡者":  {"str":10, "dex":16, "con":14, "int":12, "wis":13, "cha":8,  "hp":26, "ac":15, "atk_bonus":5},
    "法师":   {"str":8,  "dex":13, "con":14, "int":16, "wis":12, "cha":13, "hp":20, "ac":13, "atk_bonus":5},
    "牧师":   {"str":13, "dex":10, "con":14, "int":12, "wis":16, "cha":8,  "hp":26, "ac":18, "atk_bonus":5},
    "圣骑士":  {"str":15, "dex":10, "con":13, "int":8,  "wis":12, "cha":14, "hp":28, "ac":20, "atk_bonus":5},
}

PROFICIENCY_BONUS = {3: 2, 4: 3, 5: 3, 6: 4, 7: 4}


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
