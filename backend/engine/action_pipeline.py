"""Typed action dispatch entry point for deterministic game mutations."""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Callable

from .game_state import PatchOperation, apply_state_patch


@dataclass(frozen=True)
class GameAction:
    id: str
    type: str
    actor_id: str
    schema_version: int = 1
    payload: dict[str, Any] = field(default_factory=dict)
    target_ids: list[str] = field(default_factory=list)
    created_at: float = 0


@dataclass
class ActionResult:
    accepted: bool
    action_id: str
    schema_version: int = 1
    events: list[dict[str, Any]] = field(default_factory=list)
    patches: list[PatchOperation] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)
    needs_narration: bool = False


Resolver = Callable[[dict[str, Any], GameAction], ActionResult]
_RESOLVERS: dict[str, Resolver] = {}


def register_resolver(action_type: str):
    def decorator(resolver: Resolver):
        _RESOLVERS[action_type] = resolver
        return resolver
    return decorator


def resolve_action(state: dict[str, Any], action: GameAction, source: str = "system") -> tuple[dict[str, Any], ActionResult]:
    resolver = _RESOLVERS.get(action.type)
    if not resolver:
        return state, ActionResult(False, action.id, errors=[f"unknown action type: {action.type}"])
    result = resolver(state, action)
    if not result.accepted or not result.patches:
        return state, result
    next_state, validation = apply_state_patch(state, result.patches, source)
    if not validation.valid:
        result.accepted = False
        result.errors.extend(validation.errors)
        return state, result
    return next_state, result


def registered_action_types() -> tuple[str, ...]:
    return tuple(sorted(_RESOLVERS))
