"""Authoritative turn-based combat rules.

Armor pierce is implemented as a fixed amount of damage that bypasses armor.
For example armorPierce=2 means the first 2 damage goes directly to HP and the
remaining damage is absorbed by armor before HP.
"""
from __future__ import annotations

import copy
import random
import re
import time
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone

from .dice_service import DiceService


BATTLE_START = "BATTLE_START"
ROLL_INITIATIVE = "ROLL_INITIATIVE"
TURN_START = "TURN_START"
WAITING_FOR_ACTION = "WAITING_FOR_ACTION"
VALIDATE_ACTION = "VALIDATE_ACTION"
RESOLVE_ACTION = "RESOLVE_ACTION"
TURN_END = "TURN_END"
BATTLE_END = "BATTLE_END"


def _canonical_dice_event(event_type: str, formula: str, rolls: list[int], modifier: int, total: int,
                          actor: dict | None = None, target: dict | None = None, skill: dict | None = None,
                          dc: int | None = None, ac: int | None = None, success: bool | None = None,
                          outcome: str | None = None, metadata: dict | None = None) -> dict:
    """Stable transport contract consumed by the battle UI.

    Legacy BattleEvent fields remain in place while P0 screens migrate.
    """
    match = re.search(r"d(\d+)", str(formula), re.I)
    roll_id = str(uuid.uuid4())
    result = {
        "schemaVersion": 1,
        "rollId": roll_id,
        "id": roll_id,
        "type": event_type,
        "formula": formula,
        "diceSides": int(match.group(1)) if match else 20,
        "rolls": [int(value) for value in rolls],
        "modifier": int(modifier),
        "total": int(total),
        "source": "battle_engine",
        "createdAt": datetime.now(timezone.utc).isoformat(),
    }
    optional = {
        "actorId": actor.get("id") if actor else None,
        "actorName": actor.get("name") if actor else None,
        "targetId": target.get("id") if target else None,
        "targetName": target.get("name") if target else None,
        "skillId": skill.get("id") if skill else None,
        "skillName": skill.get("name") if skill else None,
        "dc": dc,
        "ac": ac,
        "success": success,
        "outcome": outcome,
        "metadata": metadata,
    }
    result.update({key: value for key, value in optional.items() if value is not None})
    return result


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
    "selin_starburst": {
        "id": "selin_starburst",
        "name": "星轨震荡",
        "targetType": "all_enemies",
        "requiresHitRoll": True,
        "hitBonus": 1,
        "damageDice": "2d4",
        "damageBonusAttribute": None,
        "damageType": "arcane",
        "primaryTargetBonus": 2,
        "armorPierce": 0,
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
    "brock_bomb": {
        "id": "brock_bomb",
        "name": "辣椒炸弹",
        "targetType": "all_enemies",
        "requiresHitRoll": False,
        "damageDice": "2d6",
        "damageBonusAttribute": None,
        "damageType": "fire",
        "armorPierce": 0,
        "cost": {},
        "cooldown": 1,
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
        "skillIds": ["selin_bolt", "selin_starburst"],
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
        "skillIds": ["brock_pan", "brock_bomb"],
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
    def create(cls, characters: list[dict] | None = None, seed: int | None = None, fixed_rolls: list[int] | None = None, skills: dict | None = None, game_id: str | None = None, encounter_id: str | None = None) -> tuple["BattleEngine", list[dict]]:
        seed = int(seed if seed is not None else random.SystemRandom().randint(1, 2_147_483_647))
        dice = DiceService(seed=seed, fixed_rolls=list(fixed_rolls or []))
        roster = copy.deepcopy(characters or DEFAULT_CHARACTERS)
        initiative = []
        for index, character in enumerate(roster):
            roll = dice.roll_die(20, f"{character['name']} initiative", "initiative",
                                 metadata={"actorId": character["id"]})
            dex = character["attributes"].get("dexterity", 0)
            bonus = character["combatStats"].get("initiativeBonus", dex)
            total = roll + bonus
            initiative.append({
                "characterId": character["id"],
                "roll": roll,
                "initiativeBonus": bonus,
                "dexterity": dex,
                "teamPriority": 1 if character["team"] == "player" else 0,
                "randomTie": dice.roll_die(20, f"{character['name']} initiative tie", "initiative",
                                           metadata={"actorId": character["id"], "tieBreak": True}),
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
            "skills": copy.deepcopy(skills or SKILLS),
            "initiative": initiative,
            "events": [{"type": "battle_start"}, {"type": "initiative_order", "order": initiative}],
            "diceEvents": dice.events,
            "rngSeed": seed,
            "rngCursor": 1,
            "gameId": game_id,
            "encounterId": encounter_id,
            "actionLog": [],
            "eventLog": [],
            "diceLog": copy.deepcopy(dice.events),
            "createdAt": time.time(),
        }
        engine = cls(state)
        engine._skip_dead()
        engine._record_events(state["events"], None)
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
        action_id = str(action.get("id") or uuid.uuid4())
        submitted_at = time.time()
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
            self.state.setdefault("actionLog", []).append({
                "id": action_id,
                "type": "battle.skill",
                "actorId": action.get("actorId"),
                "skillId": action.get("skillId"),
                "targetIds": list(action.get("targetIds") or []),
                "createdAt": submitted_at,
                "skipped": True,
            })
            self._record_events(events, action_id)
            return events
        skill = self.state["skills"].get(action.get("skillId"))
        if not skill or skill["id"] not in actor.get("skillIds", []):
            raise ValueError("invalid skill")
        if actor.get("cooldowns", {}).get(skill["id"], 0) > 0:
            raise ValueError("skill on cooldown")
        legal_targets = self._targets_for(actor, skill)
        legal_target_ids = {target["id"] for target in legal_targets}
        group_target = skill.get("targetType") in {"all_enemies", "all_allies"}
        if group_target:
            targets = legal_targets
            requested_primary_id = next(iter(action.get("targetIds", [])), None)
            if requested_primary_id in legal_target_ids:
                targets = sorted(targets, key=lambda candidate: candidate["id"] != requested_primary_id)
        else:
            targets = [self.get_character(target_id) for target_id in action.get("targetIds", [])]
            if not targets or any(target is None for target in targets):
                raise ValueError("invalid targets")
        if not targets:
            raise ValueError("invalid targets")
        if any(target["id"] not in legal_target_ids for target in targets if target):
            raise ValueError("illegal target")

        self.state["phase"] = RESOLVE_ACTION
        action_seed = int(seed if seed is not None else int(self.state.get("rngSeed", 1)) + int(self.state.get("rngCursor", 0)))
        self.state["rngCursor"] = int(self.state.get("rngCursor", 0)) + 1
        dice = DiceService(seed=action_seed, fixed_rolls=list(fixed_rolls or []))
        target = targets[0]
        if action.get("aiTactic"):
            events.append({"type": "ai_tactic", **action["aiTactic"]})
        events.append({"type": "action_declared", "actorId": actor["id"], "skillId": skill["id"], "targetIds": [target["id"] for target in targets]})
        if skill.get("requiresHitRoll"):
            roll = dice.roll_die(20, f"{actor['name']} {skill['name']} attack", "attack",
                                 metadata={"actorId": actor["id"], "targetId": target["id"], "skillId": skill["id"]})
            total = roll + actor["combatStats"].get("attackBonus", 0) + skill.get("hitBonus", 0)
            defense = self._defense(target)
            hit = roll == 20 or (roll != 1 and total >= defense)
            critical = roll == 20
            attack_modifier = actor["combatStats"].get("attackBonus", 0) + skill.get("hitBonus", 0)
            attack_outcome = "critical_success" if roll == 20 else "critical_fail" if roll == 1 else "success" if hit else "fail"
            events.append({"type": "attack_roll", "actorId": actor["id"], "targetId": target["id"], "skillId": skill["id"], "dice": "1d20", "rawRoll": roll, "modifier": attack_modifier, "total": total, "targetDefense": defense, "result": "critical" if critical else "hit" if hit else "miss", "diceEvent": _canonical_dice_event("attack", "1d20", [roll], attack_modifier, total, actor, target, skill, ac=defense, success=hit, outcome=attack_outcome)})
            if hit:
                shared_damage_roll = None
                if len(targets) > 1:
                    damage_formula = _double_dice(skill.get("damageDice", "1d4")) if critical else skill.get("damageDice", "1d4")
                    shared_damage_roll = dice.roll_formula(
                        damage_formula, f"{actor['name']} {skill['name']} damage", "damage",
                        metadata={"actorId": actor["id"], "skillId": skill["id"]},
                    )
                for resolved_target in targets:
                    primary_bonus = skill.get("primaryTargetBonus", 0) if resolved_target["id"] == target["id"] else 0
                    self._apply_damage(actor, resolved_target, skill, dice, critical, events, primary_bonus, shared_damage_roll)
        elif skill.get("requiresAbilityCheck"):
            check_roll = dice.roll_die(20, f"{actor['name']} {skill['name']} check", "story_check",
                                       metadata={"actorId": actor["id"], "targetId": target["id"], "skillId": skill["id"]})
            check_bonus = int(skill.get("checkBonus", 0))
            check_total = check_roll + check_bonus
            check_dc = int(skill.get("checkDC", 10))
            succeeded = check_roll == 20 or (check_roll != 1 and check_total >= check_dc)
            check_outcome = "critical_success" if check_roll == 20 else "critical_fail" if check_roll == 1 else "success" if succeeded else "fail"
            events.append({"type": "skill_check", "actorId": actor["id"], "targetId": target["id"], "skillId": skill["id"], "rawRoll": check_roll, "modifier": check_bonus, "total": check_total, "dc": check_dc, "result": "success" if succeeded else "failure", "diceEvent": _canonical_dice_event("story_check", "1d20", [check_roll], check_bonus, check_total, actor, target, skill, dc=check_dc, success=succeeded, outcome=check_outcome)})
            if succeeded and skill.get("damageDice"):
                self._apply_damage(actor, target, skill, dice, False, events)
            elif succeeded:
                events.append({"type": "effect", "actorId": actor["id"], "targetId": target["id"], "skillId": skill["id"]})
        elif skill.get("requiresSaveRoll"):
            shared_damage_roll = dice.roll_formula(
                skill.get("damageDice", "1d4"), f"{actor['name']} {skill['name']} damage", "damage",
                metadata={"actorId": actor["id"], "skillId": skill["id"]},
            ) if skill.get("damageDice") else None
            for resolved_target in targets:
                save_roll = dice.roll_die(20, f"{resolved_target['name']} {skill['name']} save", "saving_throw",
                                          metadata={"actorId": actor["id"], "targetId": resolved_target["id"], "skillId": skill["id"]})
                save_bonus = int(skill.get("saveBonusOverride")) if skill.get("saveBonusOverride") is not None else self._attr_bonus(resolved_target, skill.get("saveAbility"))
                save_total = save_roll + save_bonus
                save_dc = int(skill.get("saveDC", 10))
                succeeded = save_roll == 20 or (save_roll != 1 and save_total >= save_dc)
                save_outcome = "critical_success" if save_roll == 20 else "critical_fail" if save_roll == 1 else "success" if succeeded else "fail"
                events.append({"type": "saving_throw", "actorId": actor["id"], "targetId": resolved_target["id"], "skillId": skill["id"], "rawRoll": save_roll, "modifier": save_bonus, "total": save_total, "dc": save_dc, "result": "success" if succeeded else "failure", "diceEvent": _canonical_dice_event("saving_throw", "1d20", [save_roll], save_bonus, save_total, actor, resolved_target, skill, dc=save_dc, success=succeeded, outcome=save_outcome)})
                if shared_damage_roll:
                    self._apply_damage(actor, resolved_target, skill, dice, False, events, damage_roll=shared_damage_roll, damage_multiplier=0.5 if succeeded else 1.0)
        elif skill.get("damageDice"):
            for resolved_target in targets:
                self._apply_damage(actor, resolved_target, skill, dice, False, events)
        elif skill.get("healingDice"):
            for resolved_target in targets:
                self._apply_healing(actor, resolved_target, skill, dice, events)
        elif skill.get("tempHpDice"):
            for resolved_target in targets:
                self._apply_temp_hp(actor, resolved_target, skill, dice, events)
        else:
            events.append({"type": "effect", "actorId": actor["id"], "targetId": target["id"], "skillId": skill["id"]})

        actor.setdefault("cooldowns", {})[skill["id"]] = skill.get("cooldown", 0)
        self.state["diceEvents"].extend(dice.events)
        self.state.setdefault("diceLog", []).extend(copy.deepcopy(dice.events))
        self._end_turn(events)
        self.state.setdefault("actionLog", []).append({
            "id": action_id,
            "type": "battle.skill",
            "actorId": action.get("actorId"),
            "skillId": action.get("skillId"),
            "targetIds": list(action.get("targetIds") or []),
            "createdAt": submitted_at,
            "rngCursor": self.state.get("rngCursor"),
        })
        self._record_events(events, action_id)
        return events

    def _record_events(self, events: list[dict], action_id: str | None):
        event_log = self.state.setdefault("eventLog", [])
        for event in events:
            event.setdefault("eventId", str(uuid.uuid4()))
            event.setdefault("actionId", action_id)
            event.setdefault("createdAt", time.time())
            event_log.append(copy.deepcopy(event))

    def choose_basic_enemy_action(self) -> dict:
        actor = self.current_actor()
        if not actor or actor["team"] != "enemy":
            raise ValueError("current actor is not enemy")
        tactical = self.choose_tactical_action(actor)
        if tactical:
            return tactical
        legal = self.legal_actions_for(actor)
        if not legal:
            return {"actorId": actor["id"], "skillId": actor["skillIds"][0], "targetIds": []}
        action = legal[0]
        targets = [self.get_character(target_id) for target_id in action["allowedTargetIds"]]
        living = [target for target in targets if target and target.get("alive", True)]
        living.sort(key=lambda item: item["combatStats"]["hp"] / max(item["combatStats"]["maxHp"], 1))
        return {"actorId": actor["id"], "skillId": action["skillId"], "targetIds": [living[0]["id"]]}

    def choose_tactical_action(self, actor: dict | None = None) -> dict | None:
        actor = actor or self.current_actor()
        if not actor or not actor.get("alive", True):
            return None

        legal = self.legal_actions_for(actor)
        best: dict | None = None
        for action in legal:
            skill = self.state["skills"].get(action["skillId"])
            if not skill:
                continue
            targets = [self.get_character(target_id) for target_id in action["allowedTargetIds"]]
            for target in [item for item in targets if item and item.get("alive", True)]:
                score, intent, reason = self._score_tactical_target(actor, skill, target)
                if best is None or score > best["score"]:
                    best = {
                        "actorId": actor["id"],
                        "skillId": skill["id"],
                        "targetIds": [target["id"]],
                        "score": score,
                        "intent": intent,
                        "reason": reason,
                    }

        if not best:
            return None

        score = best.pop("score")
        best["aiTactic"] = {
            "actorId": actor["id"],
            "skillId": best["skillId"],
            "targetIds": best["targetIds"],
            "intent": best["intent"],
            "confidence": max(54, min(96, int(score))),
            "reason": best["reason"],
        }
        best.pop("intent", None)
        best.pop("reason", None)
        return best

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

    def _score_tactical_target(self, actor: dict, skill: dict, target: dict) -> tuple[float, str, str]:
        hp = target["combatStats"]["hp"]
        max_hp = max(target["combatStats"]["maxHp"], 1)
        hp_ratio = hp / max_hp

        if skill.get("healingDice"):
            score = (1 - hp_ratio) * 100
            reason = f"{target['name']} HP偏低，优先治疗保持行动力"
            if hp_ratio < 0.35:
                score += 30
            return score, "heal", reason

        if skill.get("tempHpDice") or any(effect.get("type") == "defense_bonus" for effect in skill.get("effects", []) if isinstance(effect, dict)):
            score = 52 + (1 - hp_ratio) * 28
            return score, "protect", f"{target['name']}承压较高，防护可提高下一轮容错"

        estimate = _estimate_skill_amount(skill)
        defense_pressure = max(0, 18 - self._defense(target))
        score = 34 + (1 - hp_ratio) * 35 + defense_pressure
        if hp <= estimate + 2:
            return score + 40, "finish", f"{target['name']}剩余HP{hp}，有机会直接击倒"
        if skill.get("targetType") in {"all_enemies", "all_allies"}:
            return score + 22, "pressure", f"{skill['name']}可覆盖多个目标，适合压低整条战线"
        return score, "pressure", f"{target['name']}当前血线适合集火压制"

    def _defense(self, target: dict) -> int:
        bonus = sum(status.get("value", 0) for status in target.get("statuses", []) if isinstance(status, dict) and status.get("type") == "defense_bonus")
        return target["combatStats"]["defense"] + bonus

    def _attr_bonus(self, actor: dict, key: str | None) -> int:
        if not key:
            return 0
        return int(actor.get("attributes", {}).get(key, 0))

    def _apply_damage(self, actor: dict, target: dict, skill: dict, dice: DiceService, critical: bool, events: list[dict], flat_bonus: int = 0, damage_roll: dict | None = None, damage_multiplier: float = 1.0):
        damage_formula = skill.get("damageDice", "1d4")
        if critical:
            damage_formula = _double_dice(damage_formula)
        roll = damage_roll or dice.roll_formula(
            damage_formula, f"{actor['name']} {skill['name']} damage", "damage",
            metadata={"actorId": actor["id"], "targetId": target["id"], "skillId": skill["id"]},
        )
        attr_bonus = self._attr_bonus(actor, skill.get("damageBonusAttribute"))
        raw_damage = max(0, int((roll["total"] + attr_bonus + flat_bonus) * damage_multiplier))
        pierce = min(raw_damage, int(skill.get("armorPierce", 0)))
        armor_damage = min(target["combatStats"].get("armor", 0), raw_damage - pierce)
        hp_damage = raw_damage - armor_damage
        target["combatStats"]["armor"] = max(0, target["combatStats"].get("armor", 0) - armor_damage)
        target["combatStats"]["hp"] = max(0, target["combatStats"]["hp"] - hp_damage)
        if target["combatStats"]["hp"] <= 0:
            target["alive"] = False
        display_modifier = raw_damage - sum(roll["rolls"])
        formula_base = re.sub(r"[+-]\d+$", "", roll["dice"].replace(" ", ""))
        display_formula = f"{formula_base}{display_modifier:+d}" if display_modifier else formula_base
        dice_event = _canonical_dice_event("damage", display_formula, roll["rolls"], display_modifier, raw_damage, actor, target, skill, metadata={"hpDamage": hp_damage, "armorDamage": armor_damage, "multiplier": damage_multiplier, "targetHp": target["combatStats"]["hp"]})
        events.append({"type": "damage", "actorId": actor["id"], "targetId": target["id"], "skillId": skill["id"], "dice": roll["dice"], "diceResult": roll["rolls"], "attributeBonus": attr_bonus, "flatBonus": flat_bonus, "multiplier": damage_multiplier, "rawDamage": raw_damage, "armorPierce": pierce, "armorDamage": armor_damage, "hpDamage": hp_damage, "targetArmor": target["combatStats"]["armor"], "targetHp": target["combatStats"]["hp"], "targetAlive": target["alive"], "critical": critical, "diceEvent": dice_event})

    def _apply_healing(self, actor: dict, target: dict, skill: dict, dice: DiceService, events: list[dict]):
        if not target.get("alive", True):
            raise ValueError("dead target cannot be healed")
        roll = dice.roll_formula(
            skill["healingDice"], f"{actor['name']} {skill['name']} healing", "healing",
            metadata={"actorId": actor["id"], "targetId": target["id"], "skillId": skill["id"]},
        )
        before = target["combatStats"]["hp"]
        target["combatStats"]["hp"] = min(target["combatStats"]["maxHp"], before + roll["total"])
        modifier = roll["total"] - sum(roll["rolls"])
        dice_event = _canonical_dice_event("healing", roll["dice"], roll["rolls"], modifier, roll["total"], actor, target, skill, metadata={"targetHp": target["combatStats"]["hp"]})
        events.append({"type": "healing", "actorId": actor["id"], "targetId": target["id"], "skillId": skill["id"], "dice": roll["dice"], "diceResult": roll["rolls"], "total": roll["total"], "targetHp": target["combatStats"]["hp"], "diceEvent": dice_event})

    def _apply_temp_hp(self, actor: dict, target: dict, skill: dict, dice: DiceService, events: list[dict]):
        roll = dice.roll_formula(
            skill["tempHpDice"], f"{actor['name']} {skill['name']} temp hp", "healing",
            metadata={"actorId": actor["id"], "targetId": target["id"], "skillId": skill["id"], "tempHp": True},
        )
        target["combatStats"]["armor"] = min(target["combatStats"]["maxArmor"] + roll["total"], target["combatStats"].get("armor", 0) + roll["total"])
        for effect in skill.get("effects", []):
            target.setdefault("statuses", []).append(copy.deepcopy(effect))
        events.append({"type": "buff", "actorId": actor["id"], "targetId": target["id"], "skillId": skill["id"], "dice": roll["dice"], "diceResult": roll["rolls"], "total": roll["total"], "tempHp": roll["total"], "defenseBonus": skill.get("defenseBonus", 0), "targetArmor": target["combatStats"]["armor"]})

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


def _estimate_skill_amount(skill: dict) -> int:
    import re
    formula = str(skill.get("damageDice") or skill.get("healingDice") or skill.get("tempHpDice") or "1d4")
    total = 0.0
    for count, sides, bonus in re.findall(r"(\d*)d(\d+)([+-]\d+)?", formula, re.I):
        dice_count = int(count or 1)
        die_sides = int(sides)
        flat_bonus = int(bonus or 0)
        total += dice_count * ((die_sides + 1) / 2) + flat_bonus
    return max(1, round(total or 4))
