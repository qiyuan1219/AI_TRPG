from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class NPCProfile(BaseModel):
    id: str
    name: str
    aliases: list[str] = Field(default_factory=list)
    portrait: str | None = None
    avatar: str | None = None
    chibi: str | None = None
    role: str
    faction: str | None = None
    speechStyle: str = ""
    goals: list[str] = Field(default_factory=list)
    secrets: list[str] = Field(default_factory=list)
    trustKey: str | None = None
    questIds: list[str] = Field(default_factory=list)
    knownFacts: list[str] = Field(default_factory=list)
    unlockConditions: dict[str, Any] = Field(default_factory=dict)
    promptProfile: dict[str, Any] | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
