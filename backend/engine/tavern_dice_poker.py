"""
酒馆三局骰子对局引擎
- 三局快艇骰子，通过瑟琳技能系统增加策略深度
- 瑟琳技能：偷窥对手骰子 / 说服老板加重投 / 惨败求情
- 根据赢得的局数给予不同情报和奖励
"""
from __future__ import annotations

import random
from dataclasses import dataclass, field
from typing import Optional

from engine.dice_poker import (
    DicePokerState,
    calculate_score,
    get_available_categories,
    roll_dice,
    roll_with_kept,
    describe_dice,
    CATEGORY_NAMES_CN,
)


@dataclass
class TavernDicePokerState:
    """酒馆三局骰子完整状态"""
    game_id: str = ""
    npc_name: str = "萨洛"
    current_round: int = 0          # 0=未开始, 1-3=进行中/已完成
    wins: int = 0
    round_history: list[dict] = field(default_factory=list)
    phase: str = "intro"            # intro|skill|playing|round_end|plead|game_over
    # 瑟琳技能状态
    peek_used: bool = False         # 本轮是否已使用偷窥
    persuade_used: bool = False     # 本轮是否已使用说服
    plead_available: bool = True    # 本轮是否可求情
    reroll_bonus: int = 0           # 说服获得额外重投次数
    peek_revealed_dice: list[int] = field(default_factory=list)  # 偷窥看到的对手骰子
    # 当前局的骰子游戏
    current_game: Optional[DicePokerState] = None
    # 奖励追踪
    rewards_granted: list[str] = field(default_factory=list)


# 瑟琳技能定义
SERLIN_SKILLS = {
    "peek": {
        "name": "瑟琳·时间之眼",
        "desc": "瑟琳指尖泛起银色微光，短暂窥视对方骰面的未来残影。",
        "dc": 12,
        "success_desc": {
            0: "瑟琳皱眉摇头：「未来残影太模糊了……」——未能看到对手骰子。",
            1: "瑟琳低语：「我看到一枚骰子——是【{v}】。」",
            2: "瑟琳轻声说道：「两枚……【{v1}】和【{v2}】。」",
            3: "瑟琳眼中银光一现：「三枚，【{v1}】【{v2}】【{v3}】。」",
        },
    },
    "persuade": {
        "name": "瑟琳·银杖说服",
        "desc": "瑟琳以银杖轻敲桌面，用时间法师的威望与萨洛讨价还价。",
        "dc": 14,
        "success_desc": {
            0: "萨洛摆摆手：「老规矩就是老规矩。」——未获得额外重投。",
            1: "萨洛叹了口气：「好吧，多给你一次重投机会。」——重投次数+1。",
            2: "萨洛挑眉：「法师的面子值两次。别浪费了。」——重投次数+2。",
        },
    },
    "plead": {
        "name": "瑟琳·低声求情",
        "desc": "瑟琳靠近你耳边，以时间观测者身份向萨洛请求再给一次机会。",
        "dc": 15,
        "success_desc": {
            0: "萨洛摇头：「骰子不说谎，认了吧。」——求情失败。",
            1: "萨洛沉默片刻：「……看在她的份上，再开一局。」——获得重赛机会！",
        },
    },
}

# 三局后根据胜场数给予的情报与奖励（模板供AI使用）
WIN_REWARDS = {
    0: {
        "title": "惨败",
        "info": "萨洛摇摇头：「看来今天骰运不佳。」但他还是推过一杯温酒，「免费。记住，抗孢面罩比武器重要。」",
        "items": ["温酒一杯（临时HP+2）"],
    },
    1: {
        "title": "小有斩获",
        "info": "萨洛收起骰子：「一局不错，够本了。」他递过一张皱巴巴的补给清单，「黑市找奥兰的时候用得上。」",
        "items": ["补给折扣券", "基础情报：缆梯安全通行时段"],
    },
    2: {
        "title": "大获全胜",
        "info": "萨洛由衷地拍了拍桌子：「了不起！来，这是真正有用的东西。」他从柜台下取出一份密封的远征地图残片。",
        "items": ["远征地图残片", "重要情报：骨柱湿地的安全路线", "萨洛信任+15"],
    },
    3: {
        "title": "完胜！",
        "info": "萨洛瞪大了眼，把骰子杯翻过来看了又看：「三局全赢？！我在酒馆十年，你是第三个做到的人。」他将一枚刻着酒馆徽记的古旧筹码推到你面前。",
        "items": ["酒馆徽记筹码（特殊道具）", "完整情报：莱因当年远征的真相", "萨洛信任+25", "瑟琳信任+5"],
    },
}


def tavern_roll_serlin_skill(skill_id: str, bonus: int = 0) -> dict:
    """使用瑟琳技能，掷D20判定
    返回: {roll, total, dc, success, margin, revealed_count, skill_id}
    """
    skill_def = SERLIN_SKILLS[skill_id]
    roll = random.randint(1, 20)
    total = roll + bonus
    dc = skill_def["dc"]
    success = total >= dc
    margin = max(0, total - dc)

    result = {
        "skill_id": skill_id,
        "roll": roll,
        "bonus": bonus,
        "total": total,
        "dc": dc,
        "success": success,
        "margin": margin,
    }

    if skill_id == "peek":
        # 0-2 margin → 1 die, 3-5 → 2 dice, 6+ → 3 dice
        if margin >= 6:
            result["revealed_count"] = 3
        elif margin >= 3:
            result["revealed_count"] = 2
        elif success:
            result["revealed_count"] = 1
        else:
            result["revealed_count"] = 0
    elif skill_id == "persuade":
        if margin >= 6:
            result["reroll_bonus"] = 2
        elif success:
            result["reroll_bonus"] = 1
        else:
            result["reroll_bonus"] = 0
    elif skill_id == "plead":
        result["plead_success"] = success

    return result


def tavern_start_round(state: TavernDicePokerState) -> dict:
    """开始新的一局骰子游戏"""
    state.current_round += 1
    state.phase = "skill"
    state.peek_used = False
    state.persuade_used = False
    state.plead_available = True
    state.reroll_bonus = 0
    state.peek_revealed_dice = []

    base_rerolls = 2
    total_rerolls = base_rerolls + state.reroll_bonus

    game = DicePokerState(
        dice=roll_dice(5),
        rerolls_left=total_rerolls,
        round_number=1,
        npc_name=state.npc_name,
    )
    state.current_game = game

    available = get_available_categories(game)
    return {
        "round": state.current_round,
        "dice": game.dice,
        "rerolls_left": game.rerolls_left,
        "total_rerolls": total_rerolls,
        "available_categories": available,
        "phase": state.phase,
        "peek_used": state.peek_used,
        "persuade_used": state.persuade_used,
    }


def tavern_resolve_round(state: TavernDicePokerState, category: str) -> dict:
    """结算当前局：计分、判定胜负"""
    game = state.current_game
    if not game:
        raise ValueError("当前局不存在")

    player_score = calculate_score(game.dice, category)
    game.scores[category] = player_score
    game.used_categories.add(category)

    # NPC 出分
    npc_dice = [random.randint(1, 6) for _ in range(5)]
    npc_score = max(
        calculate_score(npc_dice, cat)
        for cat in CATEGORY_NAMES_CN
        if cat not in game.used_categories
    )
    npc_score = min(npc_score, player_score + 12)
    npc_score = max(npc_score, player_score - 20)

    if player_score > npc_score:
        result = "win"
        state.wins += 1
    elif player_score == npc_score:
        result = "tie"
    else:
        result = "lose"

    game.game_over = True
    round_record = {
        "round": state.current_round,
        "player_score": player_score,
        "npc_score": npc_score,
        "result": result,
        "category": category,
        "player_dice": game.dice[:],
        "npc_dice": npc_dice,
        "npc_name": state.npc_name,
    }
    state.round_history.append(round_record)

    # 判定阶段
    if result == "win" or result == "tie":
        state.phase = "round_end"
    else:
        # 输了，进入求情阶段
        state.phase = "plead"

    return {
        **round_record,
        "phase": state.phase,
        "wins": state.wins,
        "round": state.current_round,
        "plead_available": state.plead_available,
    }


def tavern_end_game(state: TavernDicePokerState) -> dict:
    """结束三局，返回总结果与奖励"""
    if state.current_round < 3:
        # 还没打完，继续
        return {"game_over": False, "phase": state.phase}

    state.phase = "game_over"
    reward = WIN_REWARDS.get(state.wins, WIN_REWARDS[0])

    return {
        "game_over": True,
        "total_rounds": state.current_round,
        "wins": state.wins,
        "losses": state.current_round - state.wins,
        "title": reward["title"],
        "info": reward["info"],
        "items": reward["items"],
        "round_history": state.round_history,
        "phase": state.phase,
    }


def tavern_plead(state: TavernDicePokerState, skill_result: dict) -> dict:
    """执行求情：成功=重赛本局，失败=记录败局继续"""
    if not skill_result.get("plead_success"):
        state.plead_available = False
        state.phase = "round_end"
        return {
            "plead_success": False,
            "message": SERLIN_SKILLS["plead"]["success_desc"][0],
            "phase": state.phase,
        }

    # 重赛：回退一局
    state.plead_available = False
    state.wins = max(0, state.wins - (1 if state.round_history[-1]["result"] == "win" else 0))
    if state.round_history and state.round_history[-1]["result"] == "lose":
        state.round_history.pop()
    state.current_round -= 1

    return {
        "plead_success": True,
        "message": SERLIN_SKILLS["plead"]["success_desc"][1],
        "phase": "skill",
    }
