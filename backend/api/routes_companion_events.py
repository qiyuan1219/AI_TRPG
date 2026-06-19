"""Companion side-event API."""
from __future__ import annotations

import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from engine.companion_events import (
    SIDE_EVENT_DEFINITIONS,
    create_side_event_session,
    get_event_public_data,
    resolve_side_event_choice,
    resolve_side_event_battle_result,
    snapshot_side_event,
)
from kp.dm_service import companion_side_event_chat, companion_side_event_feedback

router_companion_events = APIRouter(prefix="/api/dnd/side-events")

_side_event_sessions: dict[str, dict] = {}


class StartSideEventRequest(BaseModel):
    event_id: str = "ailin_wounded_names"
    initial_trust: int | None = Field(default=None, ge=0, le=100)


class SideEventChoiceRequest(BaseModel):
    choice_id: str
    include_feedback: bool = True


class SideEventChatRequest(BaseModel):
    message: str


class SideEventBattleResultRequest(BaseModel):
    result: str


@router_companion_events.get("")
async def list_side_events():
    return {
        "events": [
            get_event_public_data(event_id)
            for event_id in SIDE_EVENT_DEFINITIONS
        ]
    }


@router_companion_events.post("/start")
async def start_side_event(req: StartSideEventRequest):
    if req.event_id not in SIDE_EVENT_DEFINITIONS:
        raise HTTPException(404, "支线事件不存在")

    session_id = str(uuid.uuid4())[:8]
    state = create_side_event_session(req.event_id, req.initial_trust)
    _side_event_sessions[session_id] = {
        "event_id": req.event_id,
        "state": state,
        "chat_history": [],
        "last_outcome": None,
    }

    return {
        "session_id": session_id,
        "event": get_event_public_data(req.event_id),
        "state": snapshot_side_event(req.event_id, state),
    }


@router_companion_events.post("/{session_id}/choose")
async def choose_side_event(session_id: str, req: SideEventChoiceRequest):
    session = _get_session(session_id)
    event_id = session["event_id"]
    state = session["state"]

    if state.get("phase") == "dialogue":
        raise HTTPException(400, "支线危机已结算，请进入自由对话或重新开始")
    if state.get("phase") not in {"opening", "crisis"}:
        raise HTTPException(400, "当前支线阶段不能继续普通选择")

    try:
        outcome = resolve_side_event_choice(event_id, state, req.choice_id)
    except ValueError as error:
        raise HTTPException(400, str(error)) from error

    event = SIDE_EVENT_DEFINITIONS[event_id]
    session["last_outcome"] = outcome
    feedback = ""
    if req.include_feedback:
        feedback = await _build_side_event_feedback(event_id, state, outcome)

    return {
        "event": get_event_public_data(event_id),
        "state": snapshot_side_event(event_id, state),
        "outcome": outcome,
        "feedback": feedback,
    }


@router_companion_events.post("/{session_id}/feedback")
async def get_side_event_feedback(session_id: str):
    session = _get_session(session_id)
    event_id = session["event_id"]
    state = session["state"]
    outcome = session.get("last_outcome")
    if not outcome:
        raise HTTPException(400, "暂无可生成反馈的支线选择")

    return {
        "event": get_event_public_data(event_id),
        "state": snapshot_side_event(event_id, state),
        "outcome": outcome,
        "feedback": await _build_side_event_feedback(event_id, state, outcome),
    }


@router_companion_events.post("/{session_id}/battle-result")
async def complete_side_event_battle(session_id: str, req: SideEventBattleResultRequest):
    session = _get_session(session_id)
    event_id = session["event_id"]
    state = session["state"]

    try:
        battle_outcome = resolve_side_event_battle_result(event_id, state, req.result)
    except ValueError as error:
        raise HTTPException(400, str(error)) from error

    event = SIDE_EVENT_DEFINITIONS[event_id]
    feedback = await companion_side_event_feedback(
        event=event,
        state=snapshot_side_event(event_id, state),
        choice={
            "label": "支线战斗胜利" if battle_outcome["result"] == "win" else "支线战斗失利",
            "text": battle_outcome["phase_note"],
        },
        roll=None,
        phase_note=battle_outcome["phase_note"],
    )

    return {
        "event": get_event_public_data(event_id),
        "state": snapshot_side_event(event_id, state),
        "battle_result": battle_outcome,
        "feedback": feedback,
    }


@router_companion_events.post("/{session_id}/chat")
async def chat_side_event(session_id: str, req: SideEventChatRequest):
    session = _get_session(session_id)
    event_id = session["event_id"]
    state = session["state"]
    message = req.message.strip()
    if not message:
        raise HTTPException(400, "对话内容不能为空")
    if state.get("phase") != "dialogue":
        raise HTTPException(400, "自由对话需要在支线危机结算后开启")

    event = SIDE_EVENT_DEFINITIONS[event_id]
    reply = await companion_side_event_chat(
        event=event,
        state=snapshot_side_event(event_id, state),
        message=message,
        history=session["chat_history"],
    )
    session["chat_history"].append({"role": "player", "content": message})
    session["chat_history"].append({"role": "companion", "content": reply})
    session["chat_history"] = session["chat_history"][-12:]

    return {
        "reply": reply,
        "history": session["chat_history"],
        "state": snapshot_side_event(event_id, state),
    }


def _get_session(session_id: str) -> dict:
    session = _side_event_sessions.get(session_id)
    if not session:
        raise HTTPException(404, "支线测试会话不存在")
    return session


async def _build_side_event_feedback(event_id: str, state: dict, outcome: dict) -> str:
    event = SIDE_EVENT_DEFINITIONS[event_id]
    return await companion_side_event_feedback(
        event=event,
        state=snapshot_side_event(event_id, state),
        choice=outcome["choice"],
        roll=outcome["roll"],
        phase_note=outcome["phase_note"],
    )
