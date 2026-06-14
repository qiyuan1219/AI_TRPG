import json
import sys
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from api.routes_dnd import _dice_summary_from_systems, _fallback_chat_narrative, _strip_player_protocol_text


class RoutesDndFallbackTests(unittest.TestCase):
    def test_dice_summary_uses_prerolled_skill_check(self):
        payload = {
            "掷骰": "D20=14",
            "加值": 5,
            "总计": 19,
            "DC": 12,
            "成功": True,
            "属性": "调查(检定)",
        }
        systems = [f"[SYSTEM:skill_check:{json.dumps(payload, ensure_ascii=False)}]"]

        summary = _dice_summary_from_systems(systems)

        self.assertIn("调查(检定)结果为 D20=14", summary)
        self.assertIn("判定成功", summary)

    def test_fallback_has_visible_narrative_when_ai_returns_no_text(self):
        systems = [
            '[SYSTEM:skill_check:{"掷骰":"D20=3","加值":2,"总计":5,"DC":10,"成功":false,"属性":"敏捷(检定)"}]',
        ]

        fallback = _fallback_chat_narrative(
            "闪避并寻找掩护位置【敏捷DC10】",
            {"player_name": "测试者", "current_area": "逆穹悬城·主缆街"},
            systems,
        )
        visible = _strip_player_protocol_text(fallback)

        self.assertIn("测试者在逆穹悬城·主缆街", visible)
        self.assertIn("判定失败", visible)
        self.assertNotIn("HINTS", visible)


if __name__ == "__main__":
    unittest.main()
