from __future__ import annotations

from copy import deepcopy
from typing import Any, Literal

from pydantic import BaseModel, Field

from core.debug.state_diff import create_state_hash


class ReplayInput(BaseModel):
    schemaVersion: Literal[1] = 1
    initialGameState: dict[str, Any]
    actions: list[dict[str, Any]] = Field(default_factory=list)
    diceEvents: list[dict[str, Any]] = Field(default_factory=list)
    statePatches: list[dict[str, Any]] = Field(default_factory=list)
    eventLog: list[dict[str, Any]] = Field(default_factory=list)
    rngSeed: str | None = None
    expectedStateHash: str | None = None


class ReplayResult(BaseModel):
    ok: bool
    finalState: dict[str, Any]
    expectedStateHash: str | None = None
    actualStateHash: str
    mismatch: dict[str, Any] | None = None
    warnings: list[str] = Field(default_factory=list)


def _get_path(state: dict[str, Any], path: str) -> Any:
    cursor: Any = state
    for part in [part for part in path.split(".") if part]:
        if not isinstance(cursor, dict):
            return None
        cursor = cursor.get(part)
    return cursor


def _set_path(state: dict[str, Any], path: str, value: Any) -> None:
    parts = [part for part in path.split(".") if part]
    cursor = state
    for part in parts[:-1]:
        cursor = cursor.setdefault(part, {})
    cursor[parts[-1]] = value


def _apply_patch(state: dict[str, Any], patch: dict[str, Any]) -> None:
    op = patch.get("op")
    path = str(patch.get("path", ""))
    value = patch.get("value")
    if op == "set":
        _set_path(state, path, value)
    elif op == "increment":
        _set_path(state, path, (_get_path(state, path) or 0) + value)
    elif op == "merge":
        current = _get_path(state, path)
        _set_path(state, path, {**(current if isinstance(current, dict) else {}), **value})
    elif op == "append":
        current = _get_path(state, path)
        _set_path(state, path, [*(current if isinstance(current, list) else []), value])
    elif op == "remove":
        parts = [part for part in path.split(".") if part]
        parent = _get_path(state, ".".join(parts[:-1])) if len(parts) > 1 else state
        if isinstance(parent, dict) and parts:
            parent.pop(parts[-1], None)


def run_replay(input_data: ReplayInput) -> ReplayResult:
    state = deepcopy(input_data.initialGameState)
    warnings: list[str] = []
    if not input_data.diceEvents:
        warnings.append("Replay input has no dice events; deterministic dice verification was skipped.")
    for envelope in input_data.statePatches:
        for patch in envelope.get("patches", []):
            _apply_patch(state, patch)
    actual_hash = create_state_hash(state)
    ok = input_data.expectedStateHash is None or input_data.expectedStateHash == actual_hash
    return ReplayResult(
        ok=ok,
        finalState=state,
        expectedStateHash=input_data.expectedStateHash,
        actualStateHash=actual_hash,
        mismatch=None if ok else {"reason": "Final state hash does not match expectedStateHash."},
        warnings=warnings,
    )
