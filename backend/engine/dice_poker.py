"""
快艇骰子（Dice Poker / Yahtzee）引擎 + AI策略顾问
用于酒馆场景的骰子赌博小游戏，AI主持人在游戏中：
1. 给出策略建议（保留哪些骰子收益最大）
2. 担任氛围组（用D&D风格叙述每次掷骰和得分）
3. NPC根据结果改变信任值
"""
import random
from typing import Optional
from dataclasses import dataclass, field
from collections import Counter


@dataclass
class DicePokerState:
    """快艇骰子一局的完整状态"""
    dice: list[int] = field(default_factory=lambda: [1, 1, 1, 1, 1])
    kept: set[int] = field(default_factory=set)        # 保留的骰子索引(0-4)
    rerolls_left: int = 2                                # 剩余重投次数
    round_number: int = 0                                # 当前轮次(1-3)
    scores: dict[str, Optional[int]] = field(default_factory=lambda: {
        "一对": None, "两对": None, "三条": None, "四条": None,
        "葫芦": None, "小顺": None, "大顺": None,
        "快艇": None, "机会": None,
    })
    used_categories: set[str] = field(default_factory=set)
    current_bet_info: str = ""                           # 当前赌注（情报内容）
    npc_name: str = ""
    npc_trust_key: str = ""
    game_over: bool = False


# ============================================================
# 核心骰子逻辑
# ============================================================

def roll_dice(n: int = 5) -> list[int]:
    """掷 n 个 D6"""
    return [random.randint(1, 6) for _ in range(n)]


def roll_with_kept(state: DicePokerState) -> list[int]:
    """根据保留状态重新掷骰"""
    result = state.dice[:]
    for i in range(5):
        if i not in state.kept:
            result[i] = random.randint(1, 6)
    return result


# ============================================================
# 计分规则（标准快艇骰子/Yahtzee）
# ============================================================

def _counts(dice: list[int]) -> Counter:
    return Counter(dice)


def score_ones(dice: list[int]) -> int:
    return sum(d for d in dice if d == 1)


def score_pair(dice: list[int], pair_size: int = 2) -> int:
    """一对/三条/四条：找最大的N个相同骰子"""
    c = _counts(dice)
    for val in range(6, 0, -1):
        if c[val] >= pair_size:
            return val * pair_size
    return 0


def score_two_pairs(dice: list[int]) -> int:
    """两对：两个不同的对子"""
    c = _counts(dice)
    pairs = [v for v in range(6, 0, -1) if c[v] >= 2]
    if len(pairs) >= 2:
        return pairs[0] * 2 + pairs[1] * 2
    return 0


def score_three_of_kind(dice: list[int]) -> int:
    return score_pair(dice, 3)


def score_four_of_kind(dice: list[int]) -> int:
    return score_pair(dice, 4)


def score_full_house(dice: list[int]) -> int:
    """葫芦：三条+一对"""
    c = _counts(dice)
    has_three = any(v >= 3 for v in c.values())
    has_pair = any(v >= 2 for v in c.values() if v < 3) or any(v == 5 for v in c.values())
    if has_three and has_pair:
        return 25
    return 0


def score_small_straight(dice: list[int]) -> int:
    """小顺：1-2-3-4-5"""
    if set(dice) >= {1, 2, 3, 4, 5}:
        return 30
    return 0


def score_large_straight(dice: list[int]) -> int:
    """大顺：2-3-4-5-6"""
    if set(dice) >= {2, 3, 4, 5, 6}:
        return 40
    return 0


def score_yahtzee(dice: list[int]) -> int:
    """快艇：五个相同"""
    if len(set(dice)) == 1:
        return 50
    return 0


def score_chance(dice: list[int]) -> int:
    """机会：点数总和"""
    return sum(dice)


SCORE_FUNCTIONS = {
    "一对": score_pair,
    "两对": score_two_pairs,
    "三条": score_three_of_kind,
    "四条": score_four_of_kind,
    "葫芦": score_full_house,
    "小顺": score_small_straight,
    "大顺": score_large_straight,
    "快艇": score_yahtzee,
    "机会": score_chance,
}

CATEGORY_NAMES_CN = {
    "一对": "一对（最大两个相同骰子之和）",
    "两对": "两对（两个不同的对子，20分）",
    "三条": "三条（三个相同，骰值×3）",
    "四条": "四条（四个相同，骰值×4）",
    "葫芦": "葫芦（三条+一对，25分）",
    "小顺": "小顺（1-2-3-4-5，30分）",
    "大顺": "大顺（2-3-4-5-6，40分）",
    "快艇": "快艇（五个相同，50分！）",
    "机会": "机会（五骰点数总和）",
}


def calculate_score(dice: list[int], category: str) -> int:
    func = SCORE_FUNCTIONS.get(category)
    if func:
        return func(dice)
    return 0


def get_available_categories(state: DicePokerState) -> dict[str, int]:
    """返回所有可用计分项及其当前得分"""
    result = {}
    for cat, func in SCORE_FUNCTIONS.items():
        if cat not in state.used_categories:
            result[cat] = func(state.dice)
    return result


def describe_dice(dice: list[int]) -> str:
    """D&D风格描述骰子结果"""
    emoji_map = {1: "⚀", 2: "⚁", 3: "⚂", 4: "⚃", 5: "⚄", 6: "⚅"}
    return " ".join(f"{emoji_map.get(d, str(d))}" for d in dice)


# ============================================================
# AI策略顾问 —— 核心AI融合点
# ============================================================

def analyze_dice_strategy(dice: list[int], rerolls_left: int, 
                          available_categories: dict[str, int]) -> list[dict]:
    """
    AI分析当前骰子，给出最优保留策略建议。
    这是大赛展示的核心AI功能：AI不仅是裁判，还是策略顾问。
    
    返回建议列表，按推荐度排序，每项包含：
    - keep: 建议保留的骰子索引列表
    - target: 瞄准的计分项
    - reason: 策略理由
    - priority: 优先级（"高"/"中"/"低"）
    """
    suggestions = []
    counts = _counts(dice)
    sorted_vals = sorted(counts.items(), key=lambda x: (-x[1], -x[0]))
    
    # 1. 检测快艇（五个相同）
    if len(set(dice)) == 1:
        suggestions.append({
            "keep": [0, 1, 2, 3, 4],
            "target": "快艇",
            "reason": "五个骰子完全相同！直接拿下快艇50分，不要重投任何骰子。",
            "priority": "高",
        })
        return suggestions
    
    # 2. 检测四条
    if counts and sorted_vals[0][1] >= 4:
        val = sorted_vals[0][0]
        keep_idx = [i for i, d in enumerate(dice) if d == val]
        suggestions.append({
            "keep": keep_idx,
            "target": "四条",
            "reason": f"已有四个{val}点，四条稳了。如果还剩重投机会，可以赌第五个变成{val}搏快艇。",
            "priority": "高",
        })
    
    # 3. 检测葫芦（三条+一对）
    if len(counts) == 2 and sorted_vals[0][1] == 3 and sorted_vals[1][1] == 2:
        suggestions.append({
            "keep": [0, 1, 2, 3, 4],
            "target": "葫芦",
            "reason": "完美的三条+一对，葫芦25分直接拿下。",
            "priority": "高",
        })
    
    # 4. 检测三条
    if counts and sorted_vals[0][1] >= 3:
        val = sorted_vals[0][0]
        keep_idx = [i for i, d in enumerate(dice) if d == val]
        suggestions.append({
            "keep": keep_idx,
            "target": "三条",
            "reason": f"已有三个{val}点，保留它们。重投剩余两个，赌四条或葫芦。",
            "priority": "高",
        })
    
    # 5. 检测大顺/小顺
    if set(dice) >= {2, 3, 4, 5, 6}:
        suggestions.append({
            "keep": [0, 1, 2, 3, 4],
            "target": "大顺",
            "reason": "2-3-4-5-6大顺40分！锁定全部骰子。",
            "priority": "高",
        })
    elif set(dice) >= {1, 2, 3, 4, 5}:
        suggestions.append({
            "keep": [0, 1, 2, 3, 4],
            "target": "小顺",
            "reason": "1-2-3-4-5小顺30分！如果还剩重投机会，可以放弃小顺去赌大顺。",
            "priority": "中",
        })
    
    # 6. 检测接近顺子（4个连续）
    near_straight = _find_near_straight(dice)
    if near_straight and rerolls_left > 0:
        keep_idx, missing_val = near_straight
        suggestions.append({
            "keep": keep_idx,
            "target": "小顺/大顺",
            "reason": f"已经连续4个数字，只差{missing_val}。保留连续部分，重投不相关的骰子去赌顺子。",
            "priority": "中",
        })
    
    # 7. 检测两对
    pairs = [(v, [i for i, d in enumerate(dice) if d == v]) 
             for v in range(6, 0, -1) if counts.get(v, 0) >= 2]
    if len(pairs) >= 2:
        keep_idx = pairs[0][1] + pairs[1][1]
        suggestions.append({
            "keep": keep_idx,
            "target": "两对→葫芦",
            "reason": f"已有两对，保留它们。重投剩余骰子赌葫芦（三条+一对，25分）。",
            "priority": "中",
        })
    
    # 8. 检测单个对子
    if pairs:
        keep_idx = pairs[0][1]
        pair_val = pairs[0][0]
        suggestions.append({
            "keep": keep_idx,
            "target": "一对→三条",
            "reason": f"保留一对{pair_val}点。重投剩余三个骰子，赌三条或更多。",
            "priority": "中",
        })
    
    # 9. 没有特殊组合时，保留最大的骰子
    if not suggestions:
        top_indices = sorted(range(5), key=lambda i: dice[i], reverse=True)[:2]
        suggestions.append({
            "keep": top_indices,
            "target": "机会",
            "reason": "暂时没有好的组合。保留最大的两个骰子，重投其他的去博更好结果。",
            "priority": "低",
        })
    
    return suggestions


def _find_near_straight(dice: list[int]) -> Optional[tuple[list[int], int]]:
    """检测是否接近顺子（4个连续数字），返回(应保留的索引列表, 缺失的数字)"""
    uniq = sorted(set(dice))
    best = None
    for start in range(1, 4):
        window = set(range(start, start + 5))
        overlap = uniq_set := set(uniq) & window
        if len(overlap) >= 4:
            missing = (window - uniq_set).pop() if (window - uniq_set) else None
            keep_idx = [i for i, d in enumerate(dice) 
                       if d in overlap and (not best or d not in {dice[j] for j in best[0]})]
            # 简化：保留所有在窗口内的骰子
            keep_idx = [i for i, d in enumerate(dice) if d in overlap]
            if missing:
                return keep_idx[:4], missing
    return None


def get_ai_hint_text(dice: list[int], rerolls_left: int, 
                     available: dict[str, int]) -> str:
    """生成AI策略提示文本（用于在游戏中显示）"""
    suggestions = analyze_dice_strategy(dice, rerolls_left, available)
    if not suggestions:
        return "AI正在分析你的骰面..."
    
    best = suggestions[0]
    keep_str = "、".join(f"第{i+1}个({dice[i]}点)" for i in best["keep"])
    
    return (
        f"🎲 AI策略建议：{best['reason']}\n"
        f"   → 建议保留：{keep_str}\n"
        f"   → 瞄准计分项：【{best['target']}】\n"
        f"   → 推荐度：{best['priority']}"
    )
