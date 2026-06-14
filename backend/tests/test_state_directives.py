import sys
import unittest
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from engine.state_directives import DirectiveStreamFilter, apply_directive, parse_state_chunk


class StateDirectiveTests(unittest.TestCase):
    def test_parse_legacy_state_chunk(self):
        directive = parse_state_chunk('[STATE:update_gold:{"amount":-25,"reason":"注册费"}]')

        self.assertIsNotNone(directive)
        self.assertEqual(directive.name, "update_gold")
        self.assertEqual(directive.data["amount"], -25)

    def test_apply_gold_directive_clamps_at_zero(self):
        state = {"gold": 10}
        change = apply_directive(state, {"name": "update_gold", "amount": -25, "reason": "注册费"})

        self.assertEqual(change["type"], "gold")
        self.assertEqual(change["new"], 0)
        self.assertEqual(state["gold"], 0)

    def test_stream_filter_hides_split_directive(self):
        stream_filter = DirectiveStreamFilter()

        visible, directives = stream_filter.feed('瑟琳点头。[CMD:gold:{"amount":')
        self.assertEqual(visible, "瑟琳点头。")
        self.assertEqual(directives, [])

        visible, directives = stream_filter.feed('-5,"reason":"线索费"}]继续前进。')
        self.assertEqual(visible, "继续前进。")
        self.assertEqual(len(directives), 1)
        self.assertEqual(directives[0].name, "gold")
        self.assertEqual(directives[0].data["amount"], -5)


if __name__ == "__main__":
    unittest.main()
