import { describe, expect, it } from 'vitest';
import { dndRuntime } from './dndRuntime';

describe('dnd runtime state snapshots', () => {
  it('merges backend snapshots without deleting frontend story progress', () => {
    const state = {
      player_name: '测试员',
      current_hp: 30,
      currentNodeId: 'bone-wetland-route-choice-v2',
      postBlueShoalExpandedStarted: true,
      boneMarshActions: 2,
      choice_stage_test_used_choices: '行动一|行动二',
      flags: { local_story_flag: true },
    };

    const next = dndRuntime.applyStateChange(state, {
      type: 'snapshot',
      state: {
        player_name: '测试员',
        current_hp: 28,
        currentNodeId: 'stale-backend-node',
        postBlueShoalExpandedStarted: false,
        boneMarshActions: 1,
        choice_stage_test_used_choices: '行动一',
        flags: { backend_flag: true, local_story_flag: false },
      },
    });

    expect(next).toMatchObject({
      current_hp: 28,
      currentNodeId: 'bone-wetland-route-choice-v2',
      postBlueShoalExpandedStarted: true,
      boneMarshActions: 2,
      choice_stage_test_used_choices: '行动一|行动二',
      flags: {
        local_story_flag: true,
        backend_flag: true,
      },
    });
  });
});
