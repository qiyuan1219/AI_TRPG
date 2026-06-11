"""
酒馆三局骰子 API 路由
"""
from __future__ import annotations

import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from engine.tavern_dice_poker import (
    TavernDicePokerState,
    SERLIN_SKILLS,
    tavern_roll_serlin_skill,
    tavern_start_round,
    tavern_resolve_round,
    tavern_end_game,
    tavern_plead,
    WIN_REWARDS,
)
from engine.dice_poker import (
    roll_dice,
    roll_with_kept,
    get_available_categories,
    calculate_score,
    CATEGORY_NAMES_CN,
    describe_dice,
    get_ai_hint_text,
)

router_tavern_dice = APIRouter(prefix="/api/tavern-dice")

_active_games: dict[str, TavernDicePokerState] = {}


class StartRequest(BaseModel):
    npc_name: str = "萨洛"


class UseSkillRequest(BaseModel):
    skill_id: str          # "peek" | "persuade"
    bonus: int = 0         # 额外加值


class RollRequest(BaseModel):
    game_id: str


class KeepRequest(BaseModel):
    game_id: str
    keep_indices: list[int] = []


class ScoreRequest(BaseModel):
    game_id: str
    category: str


class PleadRequest(BaseModel):
    game_id: str
    bonus: int = 0


def _get(game_id: str) -> TavernDicePokerState:
    if game_id not in _active_games:
        raise HTTPException(404, "酒馆骰局不存在或已结束")
    return _active_games[game_id]


def _npc_dice_text(state: TavernDicePokerState) -> str:
    """生成对手骰子文字（已被偷窥过的可见）"""
    revealed = state.peek_revealed_dice
    total = 5
    if not revealed:
        return "对手骰子未知（可以使用瑟琳偷窥技能查看）"
    known = ", ".join(str(d) for d in revealed)
    hidden = total - len(revealed)
    return f"已窥见 {len(revealed)} 枚：{known}（{hidden} 枚未知）"


# ── 启动 ──

@router_tavern_dice.post("/start")
def start_game(req: StartRequest):
    gid = str(uuid.uuid4())[:6]
    state = TavernDicePokerState(game_id=gid, npc_name=req.npc_name)
    _active_games[gid] = state

    # 先开始第一局
    round_info = tavern_start_round(state)

    return {
        "game_id": gid,
        "npc_name": req.npc_name,
        "total_rounds": 3,
        **round_info,
        "skill_hint": "瑟琳可以帮你：偷窥对手骰面，或说服萨洛多加一次重投机会。",
    }


# ── 状态查询 ──

@router_tavern_dice.get("/{game_id}/state")
def get_state(game_id: str):
    state = _get(game_id)
    game = state.current_game
    return {
        "phase": state.phase,
        "current_round": state.current_round,
        "wins": state.wins,
        "peek_used": state.peek_used,
        "persuade_used": state.persuade_used,
        "plead_available": state.plead_available,
        "reroll_bonus": state.reroll_bonus,
        "peek_revealed_dice": state.peek_revealed_dice,
        "npc_text": _npc_dice_text(state),
        "dice": game.dice if game else [],
        "rerolls_left": game.rerolls_left if game else 0,
        "available_categories": get_available_categories(game) if game else {},
        "round_history": state.round_history,
    }


# ── 瑟琳技能 ──

@router_tavern_dice.post("/{game_id}/use-skill")
def use_skill(game_id: str, req: UseSkillRequest):
    state = _get(game_id)
    if state.phase != "skill":
        raise HTTPException(400, "当前阶段不可使用技能")
    if req.skill_id == "peek" and state.peek_used:
        raise HTTPException(400, "本轮已使用过偷窥")
    if req.skill_id == "persuade" and state.persuade_used:
        raise HTTPException(400, "本轮已使用过说服")

    skill_def = SERLIN_SKILLS[req.skill_id]
    result = tavern_roll_serlin_skill(req.skill_id, req.bonus)

    narrative = f"🎯 {skill_def['name']} 判定：D20={result['roll']}"

    if req.skill_id == "peek":
        state.peek_used = True
        revealed = result.get("revealed_count", 0)
        if revealed > 0:
            # 生成对手骰子
            opponent_dice = [random.randint(1, 6) for _ in range(revealed)]
            state.peek_revealed_dice = opponent_dice
            vals = [str(d) for d in opponent_dice]
            if revealed == 1:
                desc = skill_def["success_desc"][1].replace("{v}", vals[0])
            elif revealed == 2:
                desc = skill_def["success_desc"][2].replace("{v1}", vals[0]).replace("{v2}", vals[1])
            else:
                desc = skill_def["success_desc"][3].replace("{v1}", vals[0]).replace("{v2}", vals[1]).replace("{v3}", vals[2])
        else:
            desc = skill_def["success_desc"][0]
        narrative += f"\n{desc}"
        result["narrative"] = narrative

    elif req.skill_id == "persuade":
        state.persuade_used = True
        bonus = result.get("reroll_bonus", 0)
        if bonus > 0:
            state.reroll_bonus = bonus
            # 更新当前局的rerolls_left
            if state.current_game:
                state.current_game.rerolls_left += bonus
        desc = skill_def["success_desc"].get(bonus, skill_def["success_desc"][0])
        narrative += f"\n{desc}"
        result["narrative"] = narrative

    result["peek_used"] = state.peek_used
    result["persuade_used"] = state.persuade_used

    return result


# ── 开局（跳过技能阶段直接开始本局掷骰） ──

@router_tavern_dice.post("/{game_id}/start-round")
def start_round_endpoint(game_id: str):
    """确认使用技能（或跳过）后，正式进入本局骰子游戏"""
    state = _get(game_id)
    if state.phase not in ("skill", "plead"):
        raise HTTPException(400, "当前阶段不可进入游戏")

    # 如果是从 plead 阶段来的（重赛），需要重新开这局
    if state.phase == "plead":
        state.current_round += 1
        state.peek_used = False
        state.persuade_used = False
        state.plead_available = True
        state.reroll_bonus = 0
        state.peek_revealed_dice = []

    state.phase = "playing"

    # 如果还没有 current_game，创建新的
    if not state.current_game or state.current_game.game_over:
        total_rerolls = 2 + state.reroll_bonus
        state.current_game = __import__("engine.dice_poker", fromlist=["DicePokerState"]).DicePokerState(
            dice=roll_dice(5),
            rerolls_left=total_rerolls,
            round_number=1,
            npc_name=state.npc_name,
        )

    game = state.current_game
    hint = get_ai_hint_text(game.dice, game.rerolls_left, get_available_categories(game))

    return {
        "phase": state.phase,
        "round": state.current_round,
        "dice": game.dice,
        "rerolls_left": game.rerolls_left,
        "npc_text": _npc_dice_text(state),
        "available_categories": get_available_categories(game),
        "hint": hint,
    }


# ── 骰子操作（复用现有逻辑） ──

@router_tavern_dice.post("/roll")
def roll_endpoint(req: RollRequest):
    state = _get(req.game_id)
    if state.phase != "playing":
        raise HTTPException(400, "当前阶段不可掷骰")
    game = state.current_game
    if not game:
        raise HTTPException(400, "当前局不存在")

    if game.rerolls_left <= 0:
        raise HTTPException(400, "没有剩余重投次数，请选择计分项")

    game.dice = roll_with_kept(game)
    game.kept = set()
    game.rerolls_left -= 1
    game.round_number += 1

    available = get_available_categories(game)
    hint = get_ai_hint_text(game.dice, game.rerolls_left, available)

    return {
        "dice": game.dice,
        "rerolls_left": game.rerolls_left,
        "available_categories": available,
        "hint": hint,
        "narrative": f"🎲 重投！骰面：{describe_dice(game.dice)}（剩余 {game.rerolls_left} 次重投）",
    }


@router_tavern_dice.post("/keep")
def keep_endpoint(req: KeepRequest):
    state = _get(req.game_id)
    if state.phase != "playing":
        raise HTTPException(400, "当前阶段不可操作")
    game = state.current_game
    if not game:
        raise HTTPException(400, "当前局不存在")
    if game.rerolls_left <= 0:
        raise HTTPException(400, "没有剩余重投次数")

    game.kept = set(i for i in req.keep_indices if 0 <= i <= 4)
    game.dice = roll_with_kept(game)
    game.rerolls_left -= 1
    game.round_number += 1

    available = get_available_categories(game)
    hint = get_ai_hint_text(game.dice, game.rerolls_left, available)

    return {
        "dice": game.dice,
        "rerolls_left": game.rerolls_left,
        "available_categories": available,
        "hint": hint,
        "narrative": f"🎲 保留后重投！骰面：{describe_dice(game.dice)}（剩余 {game.rerolls_left} 次重投）",
    }


@router_tavern_dice.post("/score")
def score_endpoint(req: ScoreRequest):
    state = _get(req.game_id)
    if state.phase != "playing":
        raise HTTPException(400, "当前阶段不可计分")
    game = state.current_game
    if not game:
        raise HTTPException(400, "当前局不存在")
    if req.category in game.used_categories:
        raise HTTPException(400, f"计分项「{req.category}」已使用")
    if req.category not in CATEGORY_NAMES_CN:
        raise HTTPException(400, f"未知计分项「{req.category}」")

    result = tavern_resolve_round(state, req.category)
    return {**result, "game_over": False}


# ── 求情 ──

@router_tavern_dice.post("/{game_id}/plead")
def plead_endpoint(game_id: str, req: PleadRequest):
    state = _get(game_id)
    if state.phase != "plead":
        raise HTTPException(400, "当前阶段不可求情")
    if not state.plead_available:
        raise HTTPException(400, "本轮已使用过求情")

    result = tavern_roll_serlin_skill("plead", req.bonus)
    plead_result = tavern_plead(state, result)

    narrative = f"🎯 瑟琳求情判定：D20={result['roll']}+{result['bonus']}={result['total']}（DC{result['dc']}）\n{plead_result['message']}"

    return {**plead_result, "narrative": narrative, "roll_detail": result}


# ── 进入下一局 ──

@router_tavern_dice.post("/{game_id}/next-round")
def next_round_endpoint(game_id: str):
    state = _get(game_id)
    if state.phase not in ("round_end", "plead"):
        raise HTTPException(400, "当前阶段不可进入下一局")
    if state.current_round >= 3:
        # 三局全部结束
        final = tavern_end_game(state)
        return {"game_over": True, **final}

    round_info = tavern_start_round(state)
    return {"game_over": False, **round_info}


# ── 最终结果 ──

@router_tavern_dice.get("/{game_id}/result")
def get_result(game_id: str):
    state = _get(game_id)
    result = tavern_end_game(state)
    return result


# ── 辅助：random模块导入 ──
import random
