from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any

from .scene_summary import build_scene_summary


@dataclass(frozen=True)
class ContextBudgetPolicy:
    max_tokens: int
    history_messages: int
    recent_memories: int
    max_chars: int


CONTEXT_POLICIES = {
    "main_chat": ContextBudgetPolicy(1400, 20, 8, 18000),
    "battle_prep": ContextBudgetPolicy(960, 8, 4, 9000),
    "battle_resolution": ContextBudgetPolicy(1024, 8, 4, 10000),
    "short_judge": ContextBudgetPolicy(420, 5, 2, 5000),
    "micro_copy": ContextBudgetPolicy(300, 3, 0, 2500),
    "continuation": ContextBudgetPolicy(520, 8, 2, 7000),
    "compact_judge": ContextBudgetPolicy(360, 5, 2, 4500),
    "answer_judge": ContextBudgetPolicy(460, 5, 2, 5500),
    "battle_commentary": ContextBudgetPolicy(320, 5, 2, 4500),
    "intro_judge": ContextBudgetPolicy(300, 3, 1, 3500),
}


def token_budget(policy: str) -> int:
    return CONTEXT_POLICIES[policy].max_tokens


def build_ai_context(state: dict[str, Any], history: list[dict] | None = None,
                     memories: list[str] | None = None, policy: str = "main_chat") -> dict[str, Any]:
    config = CONTEXT_POLICIES[policy]
    summary = build_scene_summary(state)
    selected_history = list(history or [])[-config.history_messages:]
    selected_memories = list(memories or [])[-config.recent_memories:]
    result = {"sceneSummary": summary, "history": selected_history, "memories": selected_memories}
    while len(json.dumps(result, ensure_ascii=False)) > config.max_chars and result["history"]:
        result["history"].pop(0)
    while len(json.dumps(result, ensure_ascii=False)) > config.max_chars and result["memories"]:
        result["memories"].pop(0)
    return result
