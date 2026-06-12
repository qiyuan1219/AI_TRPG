"""Authoritative turn-based combat rules.

Armor pierce is implemented as a fixed amount of damage that bypasses armor.
For example armorPierce=2 means the first 2 damage goes directly to HP and the
remaining damage is absorbed by armor before HP.
"""
from __future__ import annotations

import copy
import time
import uuid
from dataclasses import dataclass

from .dice_service import DiceService


BATTLE_START = "BATTLE_START"
ROLL_INITIATIVE = "ROLL_INITIATIVE"
TURN_START = "TURN_START"
WAITING_FOR_ACTION = "WAITING_FOR_ACTION"
VALIDATE_ACTION = "VALIDATE_ACTION"
RESOLVE_ACTION = "RESOLVE_ACTION"
TURN_END = "TURN_END"
BATTLE_END = "BATTLE_END"


SKILLS: dict[str, dict] = {
    "warrior_slash": {
        "id": "warrior_slash",
        "name": "稳步斩击",
        "targetType": "single_enemy",
        "requiresHitRoll": True,
        "hitBonus": 1,
        "damageDice": "1d8",
        "damageBonusAttribute": "strength",
        "damageType": "physical",
        "armorPierce": 0,
        "cost": {},
        "cooldown": 0,
        "effects": [],
    },
    "selin_bolt": {
        "id": "selin_bolt",
        "name": "银钟光束",
        "targetType": "single_enemy",
        "requiresHitRoll": True,
        "hitBonus": 1,
        "damageDice": "1d8",
        "damageBonusAttribute": "intelligence",
        "damageType": "radiant",
        "armorPierce": 1,
        "cost": {},
        "cooldown": 0,
        "effects": [],
    },
    "brock_pan": {
        "id": "brock_pan",
        "name": "铁锅猛击",
        "targetType": "single_enemy",
        "requiresHitRoll": True,
        "hitBonus": 0,
        "damageDice": "1d8",
        "damageBonusAttribute": "strength",
        "damageType": "bludgeoning",
        "armorPierce": 0,
        "cost": {},
        "cooldown": 0,
        "effects": [],
    },
    "ailin_light": {
        "id": "ailin_light",
        "name": "生命之光",
        "targetType": "single_ally",
        "requiresHitRoll": False,
        "healingDice": "2d8+4",
        "cost": {},
        "cooldown": 1,
        "effects": [],
    },
    "ailin_blessing": {
        "id": "ailin_blessing",
        "name": "神圣祝福",
        "targetType": "single_ally",
        "requiresHitRoll": False,
        "tempHpDice": "1d4+2",
        "defenseBonus": 1,
        "cost": {},
        "cooldown": 2,
        "effects": [{"type": "defense_bonus", "duration": 1, "value": 1}],
    },
    "ailin_white_branch": {
        "id": "ailin_white_branch",
        "name": "白枝护盾",
        "targetType": "single_ally",
        "requiresHitRoll": False,
        "tempHpDice": "2d6",
        "defenseBonus": 2,
        "cost": {},
        "cooldown": 2,
        "effects": [{"type": "defense_bonus", "duration": 1, "value": 2}],
    },
    "kaiya_claw": {
        "id": "kaiya_claw",
        "name": "猫爪突袭",
        "targetType": "single_enemy",
        "requiresHitRoll": True,
        "hitBonus": 1,
        "damageDice": "1d6+2",
        "damageBonusAttribute": "dexterity",
        "damageType": "piercing",
        "armorPierce": 1,
        "cost": {},
        "cooldown": 0,
        "effects": [],
    },
    "crawler_claw": {
        "id": "crawler_claw",
        "name": "畏光爪击",
        "targetType": "single_enemy",
        "requiresHitRoll": True,
        "hitBonus": 0,
        "damageDice": "1d4",
        "damageBonusAttribute": "dexterity",
        "damageType": "slashing",
        "armorPierce": 0,
        "cost": {},
        "cooldown": 0,
        "effects": [],
    },
}


DEFAULT_CHARACTERS: list[dict] = [
    {
        "id": "player_warrior",
        "name": "冒险者",
        "team": "player",
        "alive": True,
        "attributes": {"strength": 3, "dexterity": 1, "constitution": 2, "intelligence": 0, "wisdom": 1, "charisma": -1},
        "combatStats": {"hp": 30, "maxHp": 30, "armor": 5, "maxArmor": 5, "defense": 18, "attackBonus": 4, "initiativeBonus": 1},
        "resources": {},
        "skillIds": ["warrior_slash"],
        "statuses": [],
        "cooldowns": {},
    },
    {
        "id": "selin",
        "name": "瑟琳",
        "team": "player",
        "alive": True,
        "attributes": {"strength": -1, "dexterity": 2, "constitution": 1, "intelligence": 3, "wisdom": 2, "charisma": 0},
        "combatStats": {"hp": 24, "maxHp": 24, "armor": 1, "maxArmor": 1, "defense": 14, "attackBonus": 4, "initiativeBonus": 2},
        "resources": {},
        "skillIds": ["selin_bolt"],
        "statuses": [],
        "cooldowns": {},
    },
    {
        "id": "brock",
        "name": "布洛克",
        "team": "player",
        "alive": True,
        "attributes": {"strength": 3, "dexterity": 1, "constitution": 3, "intelligence": 0, "wisdom": 2, "charisma": -1},
        "combatStats": {"hp": 48, "maxHp": 48, "armor": 4, "maxArmor": 4, "defense": 16, "attackBonus": 4, "initiativeBonus": 1},
        "resources": {},
        "skillIds": ["brock_pan"],
        "statuses": [],
        "cooldowns": {},
    },
    {
        "id": "ailin",
        "name": "艾琳",
        "team": "player",
        "alive": True,
        "attributes": {"strength": -1, "dexterity": 2, "constitution": 1, "intelligence": 1, "wisdom": 4, "charisma": 2},
        "combatStats": {"hp": 28, "maxHp": 28, "armor": 1, "maxArmor": 1, "defense": 14, "attackBonus": 3, "initiativeBonus": 2},
        "resources": {},
        "skillIds": ["ailin_light", "ailin_blessing", "ailin_white_branch"],
        "statuses": [],
        "cooldowns": {},
    },
    {
        "id": "kaiya",
        "name": "凯娅",
        "team": "player",
        "alive": True,
        "attributes": {"strength": 0, "dexterity": 4, "constitution": 1, "intelligence": 1, "wisdom": 2, "charisma": 0},
        "combatStats": {"hp": 34, "maxHp": 34, "armor": 2, "maxArmor": 2, "defense": 15, "attackBonus": 5, "initiativeBonus": 4},
        "resources": {},
        "skillIds": ["kaiya_claw"],
        "statuses": [],
        "cooldowns": {},
    },
    {
        "id": "crawler_a",
        "name": "裂隙爬兽A",
        "team": "enemy",
        "alive": True,
        "attributes": {"strength": -1, "dexterity": 2, "constitution": 1, "intelligence": -3, "wisdom": 0, "charisma": -3},
        "combatStats": {"hp": 18, "maxHp": 18, "armor": 1, "maxArmor": 1, "defense": 12, "attackBonus": 3, "initiativeBonus": 2},
        "resources": {},
        "skillIds": ["crawler_claw"],
        "statuses": [],
        "cooldowns": {},
    },
    {
        "id": "crawler_b",
        "name": "裂隙爬兽B",
        "team": "enemy",
        "alive": True,
        "attributes": {"strength": -1, "dexterity": 2, "constitution": 1, "intelligence": -3, "wisdom": 0, "charisma": -3},
        "combatStats": {"hp": 18, "maxHp": 18, "armor": 1, "maxArmor": 1, "defense": 12, "attackBonus": 3, "initiativeBonus": 2},
        "resources": {},
        "skillIds": ["crawler_claw"],
        "statuses": [],
        "cooldowns": {},
    },
]


@dataclass
class BattleEngine:
    state: dict

    @classmethod
    def create(cls, characters: list[dict] | None = None, seed: int | None = None, fixed_rolls: list[int] | None = None) -> tuple["BattleEngine", list[dict]]:
        dice = DiceService(seed=seed, fixed_rolls=list(fixed_rolls or []))
        roster = copy.deepcopy(characters or DEFAULT_CHARACTERS)
        initiative = []
        for index, character in enumerate(roster):
            roll = dice.roll_die(20, f"{character['name']} initiative")
            dex = character["attributes"].get("dexterity", 0)
            bonus = character["combatStats"].get("initiativeBonus", dex)
            total = roll + bonus
            initiative.append({
                "characterId": character["id"],
                "roll": roll,
                "initiativeBonus": bonus,
                "dexterity": dex,
                "teamPriority": 1 if character["team"] == "player" else 0,
                "randomTie": dice.roll_die(20, f"{character['name']} initiative tie"),
                "total": total,
                "initialIndex": index,
            })
        initiative.sort(key=lambda item: (item["total"], item["dexterity"], item["teamPriority"], item["randomTie"]), reverse=True)
        state = {
            "battleId": str(uuid.uuid4()),
            "phase": WAITING_FOR_ACTION,
            "round": 1,
            "turnIndex": 0,
            "characters": roster,
            "skills": copy.deepcopy(SKILLS),
            "initiative": initiative,
            "events": [{"type": "battle_start"}, {"type": "initiative_order", "order": initiative}],
            "diceEvents": dice.events,
            "rngSeed": seed,
            "createdAt": time.time(),
        }
        engine = cls(state)
        engine._skip_dead()
        return engine, state["events"]

    def current_actor(self) -> dict | None:
        order = self.state["initiative"]
        if not order:
            return None
        current_id = order[self.state["turnIndex"] % len(order)]["characterId"]
        return self.get_character(current_id)

    def get_character(self, character_id: str) -> dict | None:
        return next((item for item in self.state["characters"] if item["id"] == character_id), None)

    def legal_actions_for(self, actor: dict) -> list[dict]:
        actions = []
        for skill_id in actor.get("skillIds", []):
            skill = self.state["skills"].get(skill_id)
            if not skill or actor.get("cooldowns", {}).get(skill_id, 0) > 0:
                continue
            targets = [target["id"] for target in self._targets_for(actor, skill)]
            if targets:
                actions.append({"actorId": actor["id"], "skillId": skill_id, "allowedTargetIds": targets})
        return actions

    def submit_action(self, action: dict, seed: int | None = None, fixed_rolls: list[int] | None = None) -> list[dict]:
        events: list[dict] = []
        self.state["phase"] = VALIDATE_ACTION
        actor = self.current_actor()
        if not actor:
            raise ValueError("battle has no active actor")
        if action.get("actorId") != actor["id"]:
            raise ValueError("not current actor")
        if not actor.get("alive", True):
            raise ValueError("actor is dead")
        if "stunned" in actor.get("statuses", []):
            events.append({"type": "turn_skipped", "actorId": actor["id"], "reason": "stunned"})
            self._end_turn(events)
            return events
        skill = self.state["skills"].get(action.get("skillId"))
        if not skill or skill["id"] not in actor.get("skillIds", []):
            raise ValueError("invalid skill")
        if actor.get("cooldowns", {}).get(skill["id"], 0) > 0:
            raise ValueError("skill on cooldown")
        targets = [self.get_character(target_id) for target_id in action.get("targetIds", [])]
        if not targets or any(target is None for target in targets):
            raise ValueError("invalid targets")
        legal_target_ids = {target["id"] for target in self._targets_for(actor, skill)}
        if any(target["id"] not in legal_target_ids for target in targets if target):
            raise ValueError("illegal target")

        self.state["phase"] = RESOLVE_ACTION
        dice = DiceService(seed=seed, fixed_rolls=list(fixed_rolls or []))
        target = targets[0]
        events.append({"type": "action_declared", "actorId": actor["id"], "skillId": skill["id"], "targetIds": [target["id"]]})
        if skill.get("requiresHitRoll"):
            roll = dice.roll_die(20, f"{actor['name']} {skill['name']} attack")
            total = roll + actor["combatStats"].get("attackBonus", 0) + skill.get("hitBonus", 0)
            defense = self._defense(target)
            hit = roll == 20 or (roll != 1 and total >= defense)
            critical = roll == 20
            events.append({"type": "attack_roll", "actorId": actor["id"], "targetId": target["id"], "dice": "1d20", "rawRoll": roll, "modifier": actor["combatStats"].get("attackBonus", 0) + skill.get("hitBonus", 0), "total": total, "targetDefense": defense, "result": "critical" if critical else "hit" if hit else "miss"})
            if hit:
                self._apply_damage(actor, target, skill, dice, critical, events)
        elif skill.get("healingDice"):
            self._apply_healing(actor, target, skill, dice, events)
        elif skill.get("tempHpDice"):
            self._apply_temp_hp(actor, target, skill, dice, events)
        else:
            events.append({"type": "effect", "actorId": actor["id"], "targetId": target["id"], "skillId": skill["id"]})

        actor.setdefault("cooldowns", {})[skill["id"]] = skill.get("cooldown", 0)
        self.state["diceEvents"].extend(dice.events)
        self._end_turn(events)
        return events

    def choose_basic_enemy_action(self) -> dict:
        actor = self.current_actor()
        if not actor or actor["team"] != "enemy":
            raise ValueError("current actor is not enemy")
        legal = self.legal_actions_for(actor)
        if not legal:
            return {"actorId": actor["id"], "skillId": actor["skillIds"][0], "targetIds": []}
        action = legal[0]
        targets = [self.get_character(target_id) for target_id in action["allowedTargetIds"]]
        living = [target for target in targets if target and target.get("alive", True)]
        living.sort(key=lambda item: item["combatStats"]["hp"] / max(item["combatStats"]["maxHp"], 1))
        return {"actorId": actor["id"], "skillId": action["skillId"], "targetIds": [living[0]["id"]]}

    def _targets_for(self, actor: dict, skill: dict) -> list[dict]:
        target_type = skill.get("targetType", "single_enemy")
        living = [item for item in self.state["characters"] if item.get("alive", True)]
        if target_type == "self":
            return [actor]
        if target_type in {"single_ally", "all_allies"}:
            return [item for item in living if item["team"] == actor["team"]]
        if target_type in {"single_enemy", "all_enemies"}:
            return [item for item in living if item["team"] != actor["team"]]
        return []

    def _defense(self, target: dict) -> int:
        bonus = sum(status.get("value", 0) for status in target.get("statuses", []) if isinstance(status, dict) and status.get("type") == "defense_bonus")
        return target["combatStats"]["defense"] + bonus

    def _attr_bonus(self, actor: dict, key: str | None) -> int:
        if not key:
            return 0
        return int(actor.get("attributes", {}).get(key, 0))

    def _apply_damage(self, actor: dict, target: dict, skill: dict, dice: DiceService, critical: bool, events: list[dict]):
        damage_formula = skill.get("damageDice", "1d4")
        if critical:
            damage_formula = _double_dice(damage_formula)
        roll = dice.roll_formula(damage_formula, f"{actor['name']} {skill['name']} damage")
        attr_bonus = self._attr_bonus(actor, skill.get("damageBonusAttribute"))
        raw_damage = max(0, roll["total"] + attr_bonus)
        pierce = min(raw_damage, int(skill.get("armorPierce", 0)))
        armor_damage = min(target["combatStats"].get("armor", 0), raw_damage - pierce)
        hp_damage = raw_damage - armor_damage
        target["combatStats"]["armor"] = max(0, target["combatStats"].get("armor", 0) - armor_damage)
        target["combatStats"]["hp"] = max(0, target["combatStats"]["hp"] - hp_damage)
        if target["combatStats"]["hp"] <= 0:
            target["alive"] = False
        events.append({"type": "damage", "actorId": actor["id"], "targetId": target["id"], "skillId": skill["id"], "dice": roll["dice"], "diceResult": roll["rolls"], "attributeBonus": attr_bonus, "rawDamage": raw_damage, "armorPierce": pierce, "armorDamage": armor_damage, "hpDamage": hp_damage, "targetArmor": target["combatStats"]["armor"], "targetHp": target["combatStats"]["hp"], "targetAlive": target["alive"], "critical": critical})

    def _apply_healing(self, actor: dict, target: dict, skill: dict, dice: DiceService, events: list[dict]):
        if not target.get("alive", True):
            raise ValueError("dead target cannot be healed")
        roll = dice.roll_formula(skill["healingDice"], f"{actor['name']} {skill['name']} healing")
        before = target["combatStats"]["hp"]
        target["combatStats"]["hp"] = min(target["combatStats"]["maxHp"], before + roll["total"])
        events.append({"type": "healing", "actorId": actor["id"], "targetId": target["id"], "skillId": skill["id"], "dice": roll["dice"], "diceResult": roll["rolls"], "total": roll["total"], "targetHp": target["combatStats"]["hp"]})

    def _apply_temp_hp(self, actor: dict, target: dict, skill: dict, dice: DiceService, events: list[dict]):
        roll = dice.roll_formula(skill["tempHpDice"], f"{actor['name']} {skill['name']} temp hp")
        target["combatStats"]["armor"] = min(target["combatStats"]["maxArmor"] + roll["total"], target["combatStats"].get("armor", 0) + roll["total"])
        for effect in skill.get("effects", []):
            target.setdefault("statuses", []).append(copy.deepcopy(effect))
        events.append({"type": "buff", "actorId": actor["id"], "targetId": target["id"], "skillId": skill["id"], "tempHp": roll["total"], "defenseBonus": skill.get("defenseBonus", 0), "targetArmor": target["combatStats"]["armor"]})

    def _end_turn(self, events: list[dict]):
        actor = self.current_actor()
        if actor:
            remaining_statuses = []
            for status in actor.get("statuses", []):
                if not isinstance(status, dict):
                    remaining_statuses.append(status)
                    continue
                next_status = copy.deepcopy(status)
                next_status["duration"] = next_status.get("duration", 1) - 1
                if next_status["duration"] > 0:
                    remaining_statuses.append(next_status)
            actor["statuses"] = remaining_statuses
        self._check_battle_end(events)
        if self.state["phase"] != BATTLE_END:
            self.state["phase"] = TURN_END
            self.state["turnIndex"] = (self.state["turnIndex"] + 1) % len(self.state["initiative"])
            if self.state["turnIndex"] == 0:
                self.state["round"] += 1
                self._tick_cooldowns()
            self._skip_dead()
            self.state["phase"] = WAITING_FOR_ACTION
        self.state["events"].extend(events)

    def _tick_cooldowns(self):
        for character in self.state["characters"]:
            for skill_id, turns in list(character.get("cooldowns", {}).items()):
                character["cooldowns"][skill_id] = max(0, turns - 1)

    def _skip_dead(self):
        for _ in range(len(self.state["initiative"])):
            actor = self.current_actor()
            if actor and actor.get("alive", True):
                return
            self.state["turnIndex"] = (self.state["turnIndex"] + 1) % len(self.state["initiative"])

    def _check_battle_end(self, events: list[dict]):
        teams = {item["team"] for item in self.state["characters"]}
        living_teams = {item["team"] for item in self.state["characters"] if item.get("alive", True)}
        if len(living_teams) < len(teams):
            self.state["phase"] = BATTLE_END
            winner = next(iter(living_teams), None)
            self.state["winner"] = winner
            events.append({"type": "battle_end", "winner": winner})


def _double_dice(formula: str) -> str:
    import re
    match = re.match(r"^(\d*)d(\d+)(.*)$", formula, re.I)
    if not match:
        return formula
    count = int(match.group(1) or 1) * 2
    return f"{count}d{match.group(2)}{match.group(3)}"
