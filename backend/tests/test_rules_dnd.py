import sys
import unittest
from pathlib import Path
from unittest.mock import patch


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from engine.rules_dnd import (
    attack_roll,
    get_ac,
    get_max_hp,
    modifier,
    normalize_player_style_state,
    resolve_player_style,
    skill_check,
    validate_character,
)


class RulesDndTests(unittest.TestCase):
    def test_modifier_matches_dnd_curve(self):
        self.assertEqual(modifier(8), -1)
        self.assertEqual(modifier(10), 0)
        self.assertEqual(modifier(18), 4)

    def test_skill_check_uses_d20_plus_bonuses(self):
        with patch("engine.rules_dnd.roll_d20", return_value=12):
            result = skill_check(stat_mod=3, prof_bonus=2, dc=17)

        self.assertEqual(result.total, 17)
        self.assertTrue(result.success)

    def test_attack_roll_doubles_damage_on_critical_hit(self):
        with patch("engine.rules_dnd.roll_d20", return_value=20), patch("engine.rules_dnd.roll_dice", return_value=6):
            result = attack_roll("短剑", stat_mod=4, prof_bonus=2, target_ac=26, damage_dice="1d6", dmg_mod=4)

        self.assertTrue(result.hit)
        self.assertTrue(result.critical)
        self.assertEqual(result.damage, 20)

    def test_validate_character_rejects_out_of_range_stats(self):
        ok, message = validate_character({"str": 21, "dex": 10, "con": 10, "int": 10, "wis": 10, "cha": 10})

        self.assertFalse(ok)
        self.assertIn("str", message)

    def test_style_formula_matches_expected_balanced_values(self):
        style = resolve_player_style("balanced")

        self.assertEqual(get_max_hp(style["attributes"]), 39)
        self.assertEqual(get_ac(style["attributes"]), 14)

    def test_normalize_player_style_state_maps_legacy_class(self):
        state = {
            "char_class": "战士",
            "current_hp": 30,
        }

        normalize_player_style_state(state)

        self.assertEqual(state["selectedStyleId"], "iron-cable")
        self.assertEqual(state["char_class"], "铁缆流")
        self.assertEqual(state["player"]["styleName"], "铁缆流")
        self.assertEqual(state["max_hp"], 45)
        self.assertEqual(state["ac"], 13)

    def test_pending_style_state_stays_unselected(self):
        state = {
            "char_class": "待确认流派",
            "style_selection_pending": True,
            "str": 12,
            "dex": 12,
            "con": 13,
            "int": 12,
            "wis": 12,
            "cha": 12,
        }

        normalize_player_style_state(state)

        self.assertEqual(state["char_class"], "待确认流派")
        self.assertEqual(state["selectedStyleId"], "")
        self.assertEqual(state["player"]["styleId"], "")


if __name__ == "__main__":
    unittest.main()
