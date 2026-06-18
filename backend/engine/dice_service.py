"""Deterministic dice utilities for combat rules."""
from __future__ import annotations

import random
import re
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone


_DICE_RE = re.compile(r"^\s*(\d*)d(\d+)(?:\s*([+-])\s*(\d+))?\s*$", re.I)


@dataclass
class DiceService:
    seed: int | None = None
    fixed_rolls: list[int] = field(default_factory=list)

    def __post_init__(self):
        self._rng = random.Random(self.seed)
        self.events: list[dict] = []
        self._seed_index = 0

    def _event(self, event_type: str, formula: str, rolls: list[int], modifier: int,
               source: str, label: str, metadata: dict | None = None) -> dict:
        roll_id = str(uuid.uuid4())
        event = {
            "schemaVersion": 1,
            "rollId": roll_id,
            "id": roll_id,
            "type": event_type,
            "source": source,
            "formula": formula,
            "diceSides": int(re.search(r"d(\d+)", formula, re.I).group(1)),
            "rolls": [int(value) for value in rolls],
            "modifier": int(modifier),
            "total": int(sum(rolls) + modifier),
            "seed": str(self.seed) if self.seed is not None else None,
            "seedIndex": self._seed_index,
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "metadata": {"label": label, **(metadata or {})},
        }
        self._seed_index += 1
        self.events.append(event)
        return event

    def roll_die(self, sides: int, label: str = "", event_type: str = "test",
                 source: str = "battle_engine", metadata: dict | None = None) -> int:
        if self.fixed_rolls:
            value = int(self.fixed_rolls.pop(0))
            value = max(1, min(sides, value))
        else:
            value = self._rng.randint(1, sides)
        self._event(event_type, f"1d{sides}", [value], 0, source, label, metadata)
        return value

    def roll_formula(self, formula: str, label: str = "", event_type: str = "damage",
                     source: str = "battle_engine", metadata: dict | None = None) -> dict:
        match = _DICE_RE.match(formula)
        if not match:
            raise ValueError(f"invalid dice formula: {formula}")
        count = int(match.group(1) or 1)
        sides = int(match.group(2))
        sign = match.group(3) or "+"
        fixed = int(match.group(4) or 0)
        fixed = fixed if sign == "+" else -fixed
        rolls = []
        for _ in range(count):
            if self.fixed_rolls:
                value = max(1, min(sides, int(self.fixed_rolls.pop(0))))
            else:
                value = self._rng.randint(1, sides)
            rolls.append(value)
        total = sum(rolls) + fixed
        dice = f"{count}d{sides}{fixed:+d}" if fixed else f"{count}d{sides}"
        event = self._event(event_type, dice, rolls, fixed, source, label, metadata)
        return {**event, "dice": dice, "fixed": fixed}
