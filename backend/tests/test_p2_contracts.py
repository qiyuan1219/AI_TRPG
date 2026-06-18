import unittest

from content.core import clear_content_packs_for_test, get_content_pack, register_content_pack
from content.packs.base import BASE_CONTENT_PACK
from core.debug import create_debug_trace
from core.npc import NPC_REGISTRY, get_npc_profile, validate_npc_profiles
from core.replay import ReplayInput, run_replay
from core.debug.state_diff import create_state_hash


class P2ContractTests(unittest.TestCase):
    def test_debug_trace_records_diff_and_action(self):
        trace = create_debug_trace(
            action={"id": "a1", "type": "story.submit"},
            previous_state={"player": {"gold": 1}},
            next_state={"player": {"gold": 2}},
        )
        self.assertEqual(trace.schemaVersion, 1)
        self.assertEqual(trace.actionId, "a1")
        self.assertEqual(trace.state["diff"][0]["path"], "player.gold")

    def test_replay_applies_patches_without_random_or_ai(self):
        expected = {"player": {"gold": 12}}
        result = run_replay(ReplayInput(
            initialGameState={"player": {"gold": 10}},
            actions=[],
            diceEvents=[],
            eventLog=[],
            statePatches=[{"patches": [{"op": "increment", "path": "player.gold", "value": 2}]}],
            expectedStateHash=create_state_hash(expected),
        ))
        self.assertTrue(result.ok)
        self.assertEqual(result.finalState, expected)

    def test_npc_registry_is_unique_and_alias_resolves(self):
        validation = validate_npc_profiles(NPC_REGISTRY)
        self.assertTrue(validation["valid"])
        self.assertEqual(get_npc_profile("瑟琳").id, "selin")

    def test_content_pack_registry(self):
        clear_content_packs_for_test()
        register_content_pack(BASE_CONTENT_PACK)
        self.assertEqual(get_content_pack("base").version, "1.0.0")


if __name__ == "__main__":
    unittest.main()
