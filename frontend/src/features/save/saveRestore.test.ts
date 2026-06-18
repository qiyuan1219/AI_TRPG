import { describe, expect, it } from 'vitest';
import type { LoadGameResult } from '../../types/game';
import { prepareSaveRestore } from './saveRestore';

function loadResult(overrides: Partial<LoadGameResult> = {}): LoadGameResult {
  return {
    game_id: 'game-1',
    state: {},
    story: [],
    suggestions: [],
    active_index: 0,
    phase: 'narrating',
    save: {
      slot_key: 'slot-1', title: '测试', source_game_id: 'game-1', player_name: '冒险者',
      char_class: '', level: 1, current_area: '', last_event: '', saved_at: '',
    },
    ...overrides,
  };
}

describe('save restore preparation', () => {
  it('normalizes old story fields, strips protocol, clamps index, and inherits background', () => {
    const restored = prepareSaveRestore(loadResult({
      state: { player_name: '冒险者' },
      story: [
        { id: 0, role: 'kp', speaker: '主持人', text: '旧场景', bgImage: '/old.webp' },
        { id: 5, role: 'kp', speaker: '主持人', text: '继续[STATE:update_gold:{"amount":1}]' },
      ],
      active_index: 99,
    }), (state) => ({ ...state, restored_compatibility: true }));

    expect(restored.story.map((line) => [line.id, line.text])).toEqual([[1, '旧场景'], [5, '继续']]);
    expect(restored.activeIndex).toBe(1);
    expect(restored.nextLineId).toBe(6);
    expect(restored.inheritedBgImage).toBe('/old.webp');
    expect(restored.state.restored_compatibility).toBe(true);
    expect(restored.playerNameInput).toBe('');
    expect(restored.selectedStyleId).toBe('balanced');
  });

  it('falls back missing story data and non-narrating phases safely', () => {
    const result = loadResult({ story: undefined as never, phase: undefined as never, active_index: -4 });
    const restored = prepareSaveRestore(result, (state) => state);
    expect(restored.story).toEqual([]);
    expect(restored.activeIndex).toBe(0);
    expect(restored.nextLineId).toBe(1);
    expect(restored.phase).toBe('action');
    expect(restored.inheritedBgImage).toBeNull();
  });
});
