from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from typing import Any, Literal


@dataclass(frozen=True)
class StateDiffEntry:
    path: str
    before: Any
    after: Any
    op: Literal["add", "remove", "replace"]


def create_state_hash(value: Any) -> str:
    encoded = json.dumps(value, ensure_ascii=False, sort_keys=True, default=str).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()[:16]


def diff_state(before: Any, after: Any, base_path: str = "") -> list[StateDiffEntry]:
    if before == after:
        return []
    if not isinstance(before, dict) or not isinstance(after, dict):
        op: Literal["add", "remove", "replace"] = "replace"
        if before is None:
            op = "add"
        elif after is None:
            op = "remove"
        return [StateDiffEntry(base_path or "$", before, after, op)]

    result: list[StateDiffEntry] = []
    for key in sorted(set(before.keys()) | set(after.keys())):
      path = f"{base_path}.{key}" if base_path else str(key)
      result.extend(diff_state(before.get(key), after.get(key), path))
    return result
