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
        self.assertIn("helman_personal_note", {doc["id"] for doc in state["documents"]})
        self.assertIn("expedition_saw_spore_beasts", {clue["id"] for clue in state["clues"]})
        self.assertTrue(state["flags"]["inspect_reports_completed"])
        self.assertEqual(state["questLog"]["currentObjective"], "带着第三远征队失联报告，向萨洛或公会人员追问孢化地底兽。")

    def test_once_only_prevents_duplicate_rewards(self):
        state = {"current_area": "逆穹悬城·冒险者公会", "inventory": "长剑"}
        payload = {"掷骰": "D20=12", "总计": 14, "DC": 12, "成功": True}

        first = apply_investigation_rewards(state, "查看远征档案", payload)
        second = apply_investigation_rewards(state, "查看远征档案", payload)

        self.assertFalse(first["duplicate"])
        self.assertTrue(second["duplicate"])
        self.assertEqual(len(state["documents"]), 1)
        self.assertEqual(len(state["clues"]), 2)

    def test_check_result_supports_partial_success(self):
        self.assertEqual(classify_check_result(total=10, dc=12, natural_roll=8), "partial")

    def test_reward_can_change_gold(self):
        state = {"current_area": "逆穹悬城·回声酒馆", "gold": 20}
        payload = {"掷骰": "D20=12", "总计": 12, "DC": 10}

        change = apply_investigation_rewards(state, "查看酒馆布告栏", payload)

        self.assertEqual(state["gold"], 25)
        self.assertEqual(change["gold"], 25)
        self.assertIn({"type": "gold", "old": 20, "new": 25, "change": 5, "reason": "抄到一条小额悬赏线索"}, change["appliedRewards"])

    def test_reward_can_change_hp(self):
        state = {"current_area": "逆穹悬城·静默神殿", "current_hp": 5, "max_hp": 10}
        payload = {"掷骰": "D20=13", "总计": 13, "DC": 12}

        change = apply_investigation_rewards(state, "请求艾琳翻阅牺牲者遗录", payload)

        self.assertEqual(state["current_hp"], 7)
        self.assertEqual(change["current_hp"], 7)

    def test_reward_can_change_attribute(self):
        state = {"current_area": "孢海第一层·前线废弃据点", "intelligence": 0}
        payload = {"掷骰": "D20=20", "总计": 20, "DC": 14}

        change = apply_investigation_rewards(state, "识别补给箱中的黑石污染", payload)

        self.assertEqual(state["intelligence"], 1)
        self.assertEqual(change["attributes"]["intelligence"], 1)

    def test_main_story_registration_syncs_quest_and_scene(self):
        state = {
            "current_area": "逆穹悬城·冒险者公会任务室",
            "expedition_registered": True,
            "questLog": {"currentObjective": "前往逆穹悬城", "updates": []},
            "sceneState": {"currentScene": "guild_hall", "visitedScenes": ["unknown", "guild_hall"]},
        }

        ensure_investigation_state(state)

        self.assertEqual(state["sceneState"]["currentScene"], "guild-final-registration")
        self.assertEqual(state["questLog"]["currentObjective"], "前往降渊缆梯中枢，完成下潜前安全核验。")
        self.assertIn("register_expedition_party", state["questLog"]["completedObjectives"])
        self.assertIn("guild-final-registration", {item["id"] for item in state["questLog"]["updates"]})

    def test_main_story_elevator_descent_flag_wins_over_stale_scene(self):
        state = {
            "current_area": "降渊缆梯·垂降途中",
            "expedition_registered": True,
            "elevator_hub_visited": True,
            "elevator_descent_started": True,
            "questLog": {"currentObjective": "前往逆穹悬城", "updates": []},
            "sceneState": {"currentScene": "guild-final-registration", "visitedScenes": ["guild-final-registration"]},
        }

        ensure_investigation_state(state)

        self.assertEqual(state["sceneState"]["currentScene"], "elevator-descent")
        self.assertEqual(state["questLog"]["currentObjective"], "固定安全扣，适应垂降并观察下方异常孢光带。")
        self.assertIn("reach_elevator_hub", state["questLog"]["completedObjectives"])
        self.assertIn("start_elevator_descent", state["questLog"]["completedObjectives"])
        self.assertIn("elevator-descent", {item["id"] for item in state["questLog"]["updates"]})


if __name__ == "__main__":
    unittest.main()
