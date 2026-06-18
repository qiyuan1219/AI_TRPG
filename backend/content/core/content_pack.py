from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field

from core.npc.npc_profile import NPCProfile


class ContentPack(BaseModel):
    packId: str
    version: str
    title: str
    description: str | None = None
    scenes: list[dict[str, Any]] = Field(default_factory=list)
    encounters: list[dict[str, Any]] = Field(default_factory=list)
    items: list[dict[str, Any]] = Field(default_factory=list)
    npcs: list[NPCProfile] = Field(default_factory=list)
    quests: list[dict[str, Any]] = Field(default_factory=list)
    migrations: list[dict[str, Any]] = Field(default_factory=list)
    assets: dict[str, Any] = Field(default_factory=dict)
