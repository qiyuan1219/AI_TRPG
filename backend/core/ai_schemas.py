from __future__ import annotations

from typing import Any, Literal
from uuid import uuid4

from pydantic import BaseModel, Field


class AiNarrationOutput(BaseModel):
    schemaVersion: Literal[1] = 1
    requestId: str = Field(default_factory=lambda: str(uuid4()))
    type: Literal["narration"] = "narration"
    narration: str
    candidatePatch: list[dict[str, Any]] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)


class AiCandidatePatch(BaseModel):
    schemaVersion: Literal[1] = 1
    requestId: str = Field(default_factory=lambda: str(uuid4()))
    type: Literal["candidate_patch"] = "candidate_patch"
    patches: list[dict[str, Any]] = Field(default_factory=list)
    rawText: str | None = None
    warnings: list[str] = Field(default_factory=list)


class AilinRecruitOutput(BaseModel):
    score: int = Field(ge=0, le=100)
    trust_delta: int = Field(ge=-10, le=10)
    reason: str = Field(min_length=1, max_length=120)
    reply: str = Field(min_length=1, max_length=500)


class BargainOutput(BaseModel):
    agreed: bool
    discount: int = Field(ge=0)
    new_price: int = Field(ge=0)
    mood: str = ""
    reason: str = ""
    boss_reply: str = Field(min_length=1, max_length=500)


class SerlinIntroOutput(BaseModel):
    trustDelta: int = Field(ge=0, le=10)
    maturityScore: int = Field(ge=0, le=10)
    evaluation: str = Field(min_length=1, max_length=240)
    serlinReply: str = Field(min_length=1, max_length=500)
