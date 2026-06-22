import sys
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from engine.battle_engine import BattleEngine
from engine.dice_service import DiceService


class BattleDiceEventTests(unittest.TestCase):
    def test_default_crawlers_start_with_twenty_hp(self):
        engine, _ = BattleEngine.create(seed=3)

        for crawler_id in ('crawler_a', 'crawler_b'):
            crawler = engine.get_character(crawler_id)
            self.assertEqual(crawler['combatStats']['hp'], 20)
            self.assertEqual(crawler['combatStats']['maxHp'], 20)

    def test_default_player_units_have_guard_skill(self):
        engine, _ = BattleEngine.create(seed=3)
        self.assertIn('guard', engine.state['skills'])
        guard = engine.state['skills']['guard']
        self.assertEqual(guard['targetType'], 'self')
        self.assertEqual(guard['effects'][0]['type'], 'damage_reduction_once')
        self.assertEqual(guard['effects'][0]['value'], 0.5)

        for unit in engine.state['characters']:
            if unit['team'] == 'player':
                self.assertIn('guard', unit['skillIds'])

    def test_starburst_primary_bonus_only_applies_to_selected_target(self):
        engine, _ = BattleEngine.create(seed=3)
        for index, entry in enumerate(engine.state['initiative']):
            if entry['characterId'] == 'selin':
                engine.state['turnIndex'] = index
                break
        actor = engine.current_actor()
        assert actor is not None
        enemies = [unit for unit in engine.state['characters'] if unit['team'] != actor['team']]
        for enemy in enemies:
            enemy['combatStats']['armor'] = 0
        before = {enemy['id']: enemy['combatStats']['hp'] for enemy in enemies}

        events = engine.submit_action({
            'actorId': actor['id'], 'skillId': 'selin_starburst', 'targetIds': ['crawler_b'],
        }, fixed_rolls=[15, 2, 3])
        damage = {event['targetId']: event for event in events if event['type'] == 'damage'}

        self.assertEqual(damage['crawler_a']['rawDamage'], 5)
        self.assertEqual(damage['crawler_b']['rawDamage'], 7)
        self.assertEqual(before['crawler_a'] - engine.get_character('crawler_a')['combatStats']['hp'], 5)
        self.assertEqual(before['crawler_b'] - engine.get_character('crawler_b')['combatStats']['hp'], 7)

    def test_damage_event_is_canonical_and_matches_hp_delta(self):
        engine, _ = BattleEngine.create(seed=7)
        actor = engine.current_actor()
        assert actor is not None
        skill_id = actor['skillIds'][0]
        skill = engine.state['skills'][skill_id]
        skill.update({'requiresHitRoll': True, 'damageDice': '2d4', 'hitBonus': 99, 'primaryTargetBonus': 2})
        target = next(unit for unit in engine.state['characters'] if unit['team'] != actor['team'])
        before_hp = target['combatStats']['hp']

        events = engine.submit_action({'actorId': actor['id'], 'skillId': skill_id, 'targetIds': [target['id']]}, fixed_rolls=[10, 2, 4])
        attack = next(event for event in events if event['type'] == 'attack_roll')['diceEvent']
        damage_event = next(event for event in events if event['type'] == 'damage')
        damage = damage_event['diceEvent']

        self.assertEqual(attack['type'], 'attack')
        self.assertEqual(attack['diceSides'], 20)
        self.assertEqual(damage['type'], 'damage')
        self.assertEqual(damage['diceSides'], 4)
        self.assertEqual(damage['rolls'], [2, 4])
        self.assertEqual(damage['total'], sum(damage['rolls']) + damage['modifier'])
        self.assertEqual(before_hp - target['combatStats']['hp'], damage_event['hpDamage'])
        self.assertEqual(damage_event['targetHp'], target['combatStats']['hp'])

    def test_natural_20_doubles_final_damage_total(self):
        engine, _ = BattleEngine.create(seed=17)
        for index, entry in enumerate(engine.state['initiative']):
            if entry['characterId'] == 'player_warrior':
                engine.state['turnIndex'] = index
                break
        actor = engine.current_actor()
        assert actor is not None
        skill_id = actor['skillIds'][0]
        skill = engine.state['skills'][skill_id]
        skill.update({'requiresHitRoll': True, 'damageDice': '1d8+3', 'damageBonusAttribute': None, 'hitBonus': 99, 'primaryTargetBonus': 0})
        target = next(unit for unit in engine.state['characters'] if unit['team'] != actor['team'])
        target['combatStats']['armor'] = 0

        events = engine.submit_action(
            {'actorId': actor['id'], 'skillId': skill_id, 'targetIds': [target['id']]},
            fixed_rolls=[20, 5],
        )
        damage_event = next(event for event in events if event['type'] == 'damage')
        damage = damage_event['diceEvent']

        self.assertTrue(damage_event['critical'])
        self.assertEqual(damage_event['criticalMultiplier'], 2)
        self.assertEqual(damage['rolls'], [5])
        self.assertEqual(damage['modifier'], 3)
        self.assertEqual(damage['total'], 16)
        self.assertEqual(damage['metadata']['criticalMultiplier'], 2)

    def test_natural_20_doubles_healing_total(self):
        engine, _ = BattleEngine.create(seed=17)
        actor = engine.current_actor()
        assert actor is not None
        target = actor
        target['combatStats']['hp'] = 10
        target['combatStats']['maxHp'] = 80
        events: list[dict] = []

        engine._apply_healing(
            actor,
            target,
            {'id': 'test_heal', 'name': '测试治疗', 'healingDice': '1d20+3'},
            DiceService(seed=1, fixed_rolls=[20]),
            events,
        )

        healing_event = events[0]
        healing = healing_event['diceEvent']
        self.assertTrue(healing_event['critical'])
        self.assertEqual(healing_event['baseTotal'], 23)
        self.assertEqual(healing_event['criticalMultiplier'], 2)
        self.assertEqual(healing_event['total'], 46)
        self.assertEqual(target['combatStats']['hp'], 56)
        self.assertEqual(healing['total'], 46)
        self.assertEqual(healing['metadata']['criticalMultiplier'], 2)

    def test_damage_reduction_once_status_halves_next_damage_and_expires(self):
        engine, _ = BattleEngine.create(seed=11)
        defender = engine.current_actor()
        assert defender is not None
        guard_skill = {
            'id': 'guard',
            'name': '防御',
            'targetType': 'self',
            'effects': [{'type': 'damage_reduction_once', 'value': 0.5, 'duration': 99, 'name': '防御'}],
            'cooldown': 0,
        }
        engine.state['skills']['guard'] = guard_skill
        defender['skillIds'].insert(0, 'guard')

        guard_events = engine.submit_action({
            'actorId': defender['id'], 'skillId': 'guard', 'targetIds': [defender['id']],
        })
        buff = next(event for event in guard_events if event['type'] == 'buff')
        self.assertEqual(buff['targetId'], defender['id'])
        self.assertTrue(any(isinstance(status, dict) and status.get('type') == 'damage_reduction_once' for status in defender['statuses']))

        attacker = next(unit for unit in engine.state['characters'] if unit['team'] != defender['team'])
        engine.state['skills']['miss_claw'] = {
            'id': 'miss_claw',
            'name': '试探爪击',
            'targetType': 'single_enemy',
            'requiresHitRoll': True,
            'damageDice': '1d8',
            'hitBonus': -99,
            'cooldown': 0,
        }
        attacker['skillIds'].insert(0, 'miss_claw')
        for index, entry in enumerate(engine.state['initiative']):
            if entry['characterId'] == attacker['id']:
                engine.state['turnIndex'] = index
                break
        miss_events = engine.submit_action({
            'actorId': attacker['id'], 'skillId': 'miss_claw', 'targetIds': [defender['id']],
        }, fixed_rolls=[1])
        self.assertFalse(any(event['type'] == 'damage' for event in miss_events))
        self.assertTrue(any(isinstance(status, dict) and status.get('type') == 'damage_reduction_once' for status in defender['statuses']))

        defender['combatStats']['armor'] = 0
        before_hp = defender['combatStats']['hp']
        damage_events: list[dict] = []
        engine._apply_damage(attacker, defender, {'id': 'claw', 'name': '爪击', 'damageDice': '1d8'}, DiceService(seed=1, fixed_rolls=[8]), False, damage_events)

        damage = damage_events[0]
        self.assertEqual(damage['rawDamage'], 4)
        self.assertEqual(damage['damageReductionMultiplier'], 0.5)
        self.assertEqual(before_hp - defender['combatStats']['hp'], 4)
        self.assertFalse(any(isinstance(status, dict) and status.get('type') == 'damage_reduction_once' for status in defender['statuses']))

    def test_serin_guard_halves_group_spore_damage_only_for_serin(self):
        engine, _ = BattleEngine.create(seed=23)
        attacker = engine.get_character('crawler_a')
        serin = engine.get_character('selin')
        adventurer = engine.get_character('player_warrior')
        assert attacker is not None and serin is not None and adventurer is not None
        serin['statuses'].append({'type': 'damage_reduction_once', 'value': 0.5, 'duration': 99, 'name': '防御'})
        serin['combatStats']['armor'] = 0
        adventurer['combatStats']['armor'] = 0
        serin_before = serin['combatStats']['hp']
        adventurer_before = adventurer['combatStats']['hp']
        skill = {'id': 'spore_breath', 'name': '孢尘喷吐', 'damageDice': '1d4'}

        serin_events: list[dict] = []
        ally_events: list[dict] = []
        engine._apply_damage(attacker, serin, skill, DiceService(seed=1, fixed_rolls=[4]), False, serin_events)
        engine._apply_damage(attacker, adventurer, skill, DiceService(seed=1, fixed_rolls=[4]), False, ally_events)

        self.assertEqual(serin_before - serin['combatStats']['hp'], 2)
        self.assertEqual(adventurer_before - adventurer['combatStats']['hp'], 4)
        self.assertEqual(serin_events[0]['damageReductionMultiplier'], 0.5)
        self.assertEqual(ally_events[0]['damageReductionMultiplier'], 1.0)
        self.assertTrue(serin_events[0]['consumedStatuses'])


if __name__ == '__main__':
    unittest.main()
