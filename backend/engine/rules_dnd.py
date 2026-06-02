"""D&D D20 规则引擎"""
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
# 职业预设
# ============================================================
CLASS_PRESETS = {
    "战士":  {"str":16, "dex":13, "con":15, "int":10, "wis":12, "cha":8,  "hp":30, "ac":18, "atk_bonus":5},
    "游荡者": {"str":10, "dex":16, "con":14, "int":12, "wis":13, "cha":8,  "hp":26, "ac":15, "atk_bonus":5},
    "法师":  {"str":8,  "dex":13, "con":14, "int":16, "wis":12, "cha":13, "hp":20, "ac":13, "atk_bonus":5},
    "牧师":  {"str":10, "dex":10, "con":14, "int":12, "wis":16, "cha":8,  "hp":26, "ac":16, "atk_bonus":5},
    "圣骑士": {"str":15, "dex":10, "con":13, "int":8,  "wis":12, "cha":14, "hp":28, "ac":18, "atk_bonus":5},
}

PROFICIENCY_BONUS = {3: 2, 4: 3, 5: 3, 6: 4, 7: 4}


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
            damage += roll_dice(damage_dice)  # 暴击翻倍骰子
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
