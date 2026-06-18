from __future__ import annotations

from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class BattleActionModel(BaseModel):
    actorId: str
    skillId: str
    allowedTargetIds: list[str] = Field(default_factory=list)


class BattleActionResponse(BaseModel):
    model_config = ConfigDict(extra="allow")

    schemaVersion: int = 1
    battleId: str
    battleState: dict[str, Any]
    updatedBattleState: dict[str, Any]
    currentActor: dict[str, Any] | None = None
    legalActions: list[dict[str, Any]] = Field(default_factory=list)
    events: list[dict[str, Any]] = Field(default_factory=list)
