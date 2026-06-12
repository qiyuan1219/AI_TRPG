"""Deterministic dice utilities for combat rules."""
from __future__ import annotations

import random
import re
from dataclasses import dataclass, field


_DICE_RE = re.compile(r"^\s*(\d*)d(\d+)(?:\s*([+-])\s*(\d+))?\s*$", re.I)


@dataclass
class DiceService:
    seed: int | None = None
    fixed_rolls: list[int] = field(default_factory=list)

    def __post_init__(self):
        self._rng = random.Random(self.seed)
        self.events: list[dict] = []

    def roll_die(self, sides: int, label: str = "") -> int:
        if self.fixed_rolls:
            value = int(self.fixed_rolls.pop(0))
            value = max(1, min(sides, value))
        else:
            value = self._rng.randint(1, sides)
        self.events.append({"type": "die", "dice": f"1d{sides}", "result": value, "label": label})
        return value

    def roll_formula(self, formula: str, label: str = "") -> dict:
        match = _DICE_RE.match(formula)
        if not match:
            raise ValueError(f"invalid dice formula: {formula}")
        count = int(match.group(1) or 1)
        sides = int(match.group(2))
        sign = match.group(3) or "+"
        fixed = int(match.group(4) or 0)
        fixed = fixed if sign == "+" else -fixed
        rolls = [self.roll_die(sides, label) for _ in range(count)]
        total = sum(rolls) + fixed
        event = {
            "type": "formula",
            "dice": f"{count}d{sides}{fixed:+d}" if fixed else f"{count}d{sides}",
            "rolls": rolls,
            "fixed": fixed,
            "total": total,
            "label": label,
        }
        self.events.append(event)
        return event
