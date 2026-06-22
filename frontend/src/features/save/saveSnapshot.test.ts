import { describe, expect, it } from 'vitest';
import { buildSaveSnapshot, normalizePersistedGameState } from './saveSnapshot';

describe('save snapshot', () => {
  it('sanitizes protocol text and clamps the active story index', () => {
    const snapshot = buildSaveSnapshot({
      slotKey: 'auto',
      state: { player_name: '露娜' },
      story: [
        { id: 1, role: 'kp', speaker: '主持人', text: '继续前进[STATE:update_gold:{"amount":1}]' },
        { id: 2, role: 'kp', speaker: '主持人', text: '   ' },
      ],
      suggestions: [
        { id: 'a', label: '调查', text: '调查遗迹[STATE:update_gold:{"amount":1}]' },
      ],
      activeIndex: 8,
      phase: 'action',
      saveArea: '无光孢海',
    });

    expect(snapshot.title).toBe('自动 · 露娜 · 无光孢海');
    expect(snapshot.story.map((line) => line.text)).toEqual(['继续前进']);
    expect(snapshot.suggestions[0].text).toBe('调查遗迹');
    expect(snapshot.active_index).toBe(0);
  });

  it('keeps custom titles and applies the established state migration chain', () => {
    const state = normalizePersistedGameState(
      { player_name: '冒险者', inventory: '长剑' },
      (current) => ({ ...current, compatibility_checked: true }),
    );
    const snapshot = buildSaveSnapshot({
      slotKey: 'slot-1', customTitle: '遗迹入口', state,
      story: [], suggestions: [], activeIndex: -3, phase: 'narrating', saveArea: '忽略区域',
    });
    expect(state.compatibility_checked).toBe(true);
    expect(snapshot.title).toBe('遗迹入口');
    expect(snapshot.active_index).toBe(-3);
  });

  it('preserves nested camp-night talk logs through snapshot JSON and state migration', () => {
    const talkLogs = {
      serin: ['瑟琳把银杖横在膝前。', '「明天别离我太远。」'],
      brock: ['布洛克往火里添了一块干菌木。'],
    };
    const snapshot = buildSaveSnapshot({
      slotKey: 'slot-2',
      state: { player_name: '测试者01', campNightTalkLogs: talkLogs },
      story: [], suggestions: [], activeIndex: 0, phase: 'action', saveArea: '营地夜火',
    });
    const serializedState = JSON.parse(JSON.stringify(snapshot.state));
    const restoredState = normalizePersistedGameState(serializedState, (state) => state);

    expect(restoredState.campNightTalkLogs).toEqual(talkLogs);
  });
});
