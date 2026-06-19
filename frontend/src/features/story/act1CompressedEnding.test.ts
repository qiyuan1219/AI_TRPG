import { describe, expect, it } from 'vitest';
import { buildLainChoicePatch, buildSerinCrackPatch, resolveAct1EndingId } from './act1CompressedEnding';
import { buildSaveSnapshot, normalizePersistedGameState } from '../save/saveSnapshot';

describe('compressed act 1 ending route', () => {
  it.each([
    [true, 'stabilize', 'guardian-remains'],
    [true, 'destroy', 'wounded-through-gate'],
    [false, 'stabilize', 'cold-expedition'],
    [false, 'destroy', 'gate-split-open'],
  ] as const)('maps Lain=%s and core=%s to %s', (helped, choice, ending) => {
    expect(resolveAct1EndingId(helped, choice)).toBe(ending);
  });

  it('records every Lain choice explicitly', () => {
    expect(buildLainChoicePatch({ inventory: '' } as any, 'inspect')).toMatchObject({ lainHelped: true, lainIgnored: false });
    expect(buildLainChoicePatch({ inventory: '' } as any, 'take-clue')).toMatchObject({ lainHelped: false, lainIgnored: true });
  });

  it('only grants the staff charm on a trusted, non-coercive response', () => {
    expect(buildSerinCrackPatch({ inventory: '', se_trust: 65 } as any, 'careful').serinStaffCharmObtained).toBe(true);
    expect(buildSerinCrackPatch({ inventory: '', se_trust: 90 } as any, 'force-answer').serinStaffCharmObtained).toBeUndefined();
  });

  it('keeps compressed route state in ordinary and legacy-compatible saves', () => {
    const state = {
      player_name: '测试者', compressedAct1EndingStarted: true, lainHelped: true,
      serinStaffCrackSeen: true, bossCoreChoice: 'stabilize', act1EndingId: 'guardian-remains',
      undergroundOceanRevealed: true,
    } as any;
    const snapshot = buildSaveSnapshot({
      slotKey: 'slot-1', state, story: [], suggestions: [], activeIndex: 0, phase: 'action', saveArea: '黑暗之门',
    });
    expect(snapshot.state).toMatchObject(state);
    expect(normalizePersistedGameState(snapshot.state!, (value) => value)).toMatchObject(state);
    expect(normalizePersistedGameState({ player_name: '旧存档' } as any, (value) => value).compressedAct1EndingStarted).toBeUndefined();
  });
});
