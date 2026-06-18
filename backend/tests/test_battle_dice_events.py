import sys
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from engine.battle_engine import BattleEngine


class BattleDiceEventTests(unittest.TestCase):
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


if __name__ == '__main__':
    unittest.main()
