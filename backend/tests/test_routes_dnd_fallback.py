import json
import sys
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from api.routes_dnd import (
    _dice_summary_from_systems,
    _fallback_chat_narrative,
    _sanitize_for_persistence,
    _strip_player_protocol_text,
)


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

        self.assertIn("闪避并寻找掩护位置", visible)
        self.assertIn("判定失败", visible)
        self.assertNotIn("你刚才选择了", visible)
        self.assertNotIn("局势继续向前推进", visible)
        self.assertNotIn("HINTS", visible)

    def test_phase_limit_notice_is_removed_from_persisted_payloads(self):
        notice = "[系统提示：这是本阶段第3/3次选择行动。请在完成本次叙事后直接推进到下一段剧情，不要继续停留在当前选择阶段。]"
        payload = {
            "state": {"last_event": f"追问米娜报告中的孢化地底兽\n{notice}"},
            "story": [{"text": f"玩家: 调查报告\n{notice}"}],
            "chat_history": [{"role": "user", "content": f"行动\n{notice}"}],
        }

        sanitized = _sanitize_for_persistence(payload)

        self.assertNotIn("系统提示", json.dumps(sanitized, ensure_ascii=False))
        self.assertEqual(sanitized["state"]["last_event"], "追问米娜报告中的孢化地底兽")


if __name__ == "__main__":
    unittest.main()
