import json
import unittest

from core.context import build_ai_context, update_scene_summary
from core.events import EventEnvelope, StatePatchEnvelope
from core.items import migrate_legacy_item
from engine.dice_service import DiceService
from engine.game_state import PatchOperation, apply_state_patch


class P1ContractTests(unittest.TestCase):
    def test_dice_event_is_versioned_and_traceable(self):
        dice = DiceService(seed=7, fixed_rolls=[8])
        event = dice.roll_formula("1d8+3", "damage", "damage")
        self.assertEqual(event["rolls"], [8])
        self.assertEqual(event["total"], 11)
        self.assertEqual(event["schemaVersion"], 1)
        self.assertTrue(event["rollId"])
        self.assertEqual(event["source"], "battle_engine")

    def test_event_and_patch_envelopes_validate(self):
        event = EventEnvelope(type="ai.delta", source="dm_service", payload={"text": "ok"})
        patch = StatePatchEnvelope(source="rules", patches=[{"op": "set", "path": "story.sceneId", "value": "x"}])
        self.assertEqual(event.schemaVersion, 1)
        self.assertEqual(patch.schemaVersion, 1)

    def test_ai_cannot_modify_inventory(self):
        state = {"inventory": "长剑"}
        next_state, validation = apply_state_patch(state, [PatchOperation("set", "inventory", "神秘药剂")], "ai")
        self.assertFalse(validation.valid)
        self.assertEqual(next_state, state)

    def test_ui_patch_and_json_roundtrip_preserve_nested_camp_night_logs(self):
        talk_logs = {
            "serin": ["瑟琳把银杖横在膝前。", "明天别离我太远。"],
            "brock": ["布洛克往火里添了一块干菌木。"],
        }
        next_state, validation = apply_state_patch(
            {"currentNodeId": "camp-night-companion-scene-v2"},
            [PatchOperation("set", "campNightTalkLogs", talk_logs)],
            "ui",
        )
        restored = json.loads(json.dumps(next_state, ensure_ascii=False))

        self.assertTrue(validation.valid)
        self.assertEqual(restored["campNightTalkLogs"], talk_logs)

    def test_unknown_legacy_item_is_explicit(self):
        item = migrate_legacy_item("未登记神秘药剂")
        self.assertEqual(item["catalogId"], "legacy_unknown")
        self.assertEqual(item["metadata"]["legacyName"], "未登记神秘药剂")

    def test_context_keeps_scene_facts_and_trims_history(self):
        state = {"current_area": "浅滩", "flags": {"reward_claimed": True}, "story": {}, "questLog": {}}
        summary = update_scene_summary(state, "观察入口", "检定成功")
        context = build_ai_context(state, [{"role": "user", "content": str(i)} for i in range(40)], [], "main_chat")
        self.assertIn("flag:reward_claimed", summary["confirmedFacts"])
        self.assertEqual(len(context["history"]), 20)


if __name__ == "__main__":
    unittest.main()
