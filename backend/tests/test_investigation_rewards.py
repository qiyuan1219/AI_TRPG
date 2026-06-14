import sys
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from engine.investigation_rewards import (
    action_check_for_message,
    apply_investigation_rewards,
    classify_check_result,
    ensure_investigation_state,
)


class InvestigationRewardTests(unittest.TestCase):
    def test_matching_guild_report_action_supplies_default_check(self):
        state = {"current_area": "逆穹悬城·冒险者公会"}

        check = action_check_for_message("观察柜台旁的报告单", state)

        self.assertEqual(check, ("调查", 12))

    def test_success_adds_document_clue_flag_and_quest_update(self):
        state = {
            "current_area": "逆穹悬城·冒险者公会",
            "inventory": "长剑",
        }
        ensure_investigation_state(state)
        payload = {"掷骰": "D20=14", "加值": 3, "总计": 17, "DC": 12, "成功": True}

        change = apply_investigation_rewards(state, "观察柜台旁的报告单", payload)

        self.assertIsNotNone(change)
        self.assertEqual(change["type"], "investigation_reward")
        self.assertEqual(change["resultLevel"], "criticalSuccess")
        self.assertIn("report_missing_expedition_01", {doc["id"] for doc in state["documents"]})
        self.assertIn("expedition_saw_spore_beasts", {clue["id"] for clue in state["clues"]})
        self.assertTrue(state["flags"]["inspect_reports_completed"])
        self.assertEqual(state["questLog"]["currentObjective"], "带着远征队失联报告，向萨洛或公会人员追问孢化地底兽。")

    def test_once_only_prevents_duplicate_rewards(self):
        state = {"current_area": "逆穹悬城·冒险者公会", "inventory": "长剑"}
        payload = {"掷骰": "D20=12", "总计": 14, "DC": 12, "成功": True}

        first = apply_investigation_rewards(state, "查看远征档案", payload)
        second = apply_investigation_rewards(state, "查看远征档案", payload)

        self.assertFalse(first["duplicate"])
        self.assertTrue(second["duplicate"])
        self.assertEqual(len(state["documents"]), 1)
        self.assertEqual(len(state["clues"]), 1)

    def test_check_result_supports_partial_success(self):
        self.assertEqual(classify_check_result(total=10, dc=12, natural_roll=8), "partial")


if __name__ == "__main__":
    unittest.main()
