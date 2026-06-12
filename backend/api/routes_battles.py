"""Authoritative battle API.

The frontend may ask AI to choose or narrate, but these endpoints own combat
state transitions and numeric resolution.
"""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from engine.battle_engine import BattleEngine, BATTLE_END


router_battles = APIRouter(prefix="/api/battles", tags=["battles"])

_BATTLES: dict[str, dict[str, Any]] = {}


class BattleStartRequest(BaseModel):
    characters: list[dict[str, Any]] | None = None
    seed: int | None = None
    fixed_rolls: list[int] = Field(default_factory=list)


class BattleActionRequest(BaseModel):
    actorId: str | None = None
    skillId: str | None = None
    targetIds: list[str] = Field(default_factory=list)
    seed: int | None = None
    fixed_rolls: list[int] = Field(default_factory=list)
    auto_enemy: bool = True


def _load_engine(battle_id: str) -> BattleEngine:
    state = _BATTLES.get(battle_id)
    if not state:
        raise HTTPException(status_code=404, detail="battle not found")
    return BattleEngine(state)


def _serialize(engine: BattleEngine, events: list[dict[str, Any]] | None = None) -> dict[str, Any]:
    actor = engine.current_actor()
    legal_actions = engine.legal_actions_for(actor) if actor and engine.state.get("phase") != BATTLE_END else []
    return {
        "battleId": engine.state["battleId"],
        "battleState": engine.state,
        "currentActor": actor,
        "legalActions": legal_actions,
        "events": events or [],
    }


@router_battles.post("/start")
async def start_battle(req: BattleStartRequest):
    engine, events = BattleEngine.create(
        characters=req.characters,
        seed=req.seed,
        fixed_rolls=req.fixed_rolls,
    )
    _BATTLES[engine.state["battleId"]] = engine.state
    return _serialize(engine, events)


@router_battles.get("/{battle_id}")
async def get_battle(battle_id: str):
    engine = _load_engine(battle_id)
    return _serialize(engine)


@router_battles.post("/{battle_id}/actions")
async def submit_battle_action(battle_id: str, req: BattleActionRequest):
    engine = _load_engine(battle_id)
    actor = engine.current_actor()
    if not actor:
        raise HTTPException(status_code=409, detail="battle has no active actor")
    if engine.state.get("phase") == BATTLE_END:
        return _serialize(engine, [])

    if actor["team"] == "enemy" and req.auto_enemy and not req.actorId:
        action = engine.choose_basic_enemy_action()
    else:
        if not req.actorId or not req.skillId:
            raise HTTPException(status_code=400, detail="actorId and skillId are required")
        action = {"actorId": req.actorId, "skillId": req.skillId, "targetIds": req.targetIds}

    try:
        events = engine.submit_action(action, seed=req.seed, fixed_rolls=req.fixed_rolls)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    _BATTLES[battle_id] = engine.state
    return _serialize(engine, events)
