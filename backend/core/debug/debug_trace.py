from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Literal
from uuid import uuid4

from pydantic import BaseModel, Field

from .state_diff import create_state_hash, diff_state


class DebugError(BaseModel):
    message: str
    stack: str | None = None
    source: str | None = None


class DebugTrace(BaseModel):
    traceId: str = Field(default_factory=lambda: str(uuid4()))
    schemaVersion: Literal[1] = 1
    createdAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    action: dict[str, Any] | None = None
    actionId: str | None = None
    eventIds: list[str] = Field(default_factory=list)
    diceRollIds: list[str] = Field(default_factory=list)
    ai: dict[str, Any] | None = None
    patch: dict[str, Any] | None = None
    state: dict[str, Any] | None = None
    errors: list[DebugError] = Field(default_factory=list)


def create_debug_trace(
    *,
    action: dict[str, Any] | None = None,
    events: list[dict[str, Any]] | None = None,
    dice_events: list[dict[str, Any]] | None = None,
    patch: dict[str, Any] | None = None,
    previous_state: Any = None,
    next_state: Any = None,
) -> DebugTrace:
    state = None
    if previous_state is not None and next_state is not None:
        state = {
            "prevStateHash": create_state_hash(previous_state),
            "nextStateHash": create_state_hash(next_state),
            "diff": [entry.__dict__ for entry in diff_state(previous_state, next_state)],
        }
    return DebugTrace(
        action=action,
        actionId=action.get("id") if action else None,
        eventIds=[str(event.get("eventId") or event.get("id")) for event in events or [] if event.get("eventId") or event.get("id")],
        diceRollIds=[str(event.get("rollId") or event.get("id")) for event in dice_events or [] if event.get("rollId") or event.get("id")],
        patch=patch,
        state=state,
    )
