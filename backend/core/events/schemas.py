from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Literal
from uuid import uuid4

from pydantic import BaseModel, ConfigDict, Field


class EventEnvelope(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    eventId: str = Field(default_factory=lambda: str(uuid4()))
    schemaVersion: Literal[1] = 1
    sequence: int = 0
    correlationId: str | None = None
    type: str
    source: str
    createdAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    payload: Any


class PatchOperationModel(BaseModel):
    op: Literal["set", "increment", "append", "remove", "merge"]
    path: str
    value: Any = None


class StatePatchEnvelope(BaseModel):
    schemaVersion: Literal[1] = 1
    patchId: str = Field(default_factory=lambda: str(uuid4()))
    source: Literal["system", "rules", "ai_candidate", "migration", "ui"]
    correlationId: str | None = None
    patches: list[PatchOperationModel]
    createdAt: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


def make_event(event_type: str, source: str, payload: Any, sequence: int = 0,
               correlation_id: str | None = None) -> dict[str, Any]:
    return EventEnvelope(
        type=event_type,
        source=source,
        payload=payload,
        sequence=sequence,
        correlationId=correlation_id,
    ).model_dump()
