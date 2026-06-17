import sys
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from engine.battle_engine import BattleEngine


class BattleEngineAiTests(unittest.TestCase):
    def test_enemy_auto_action_emits_tactical_reason(self):
        engine, _events = BattleEngine.create(seed=1)
        enemy_id = "crawler_a"
        for index, entry in enumerate(engine.state["initiative"]):
            if entry["characterId"] == enemy_id:
                engine.state["turnIndex"] = index
                break

        wounded = engine.get_character("player_warrior")
        assert wounded is not None
        wounded["combatStats"]["hp"] = 5

        action = engine.choose_basic_enemy_action()

        self.assertEqual(action["targetIds"], ["player_warrior"])
        self.assertIn("aiTactic", action)

        events = engine.submit_action(action, fixed_rolls=[10, 1])

        tactic_event = next((event for event in events if event.get("type") == "ai_tactic"), None)
        self.assertIsNotNone(tactic_event)
        self.assertEqual(tactic_event["targetIds"], ["player_warrior"])
        self.assertTrue(tactic_event["reason"])


if __name__ == "__main__":
    unittest.main()
