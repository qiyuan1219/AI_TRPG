import { describe, expect, it } from 'vitest';
import { collectRewardNotices } from './storyRewardDiff';

describe('story reward diff', () => {
  it('keeps item, document, then clue notification order', () => {
    let id = 0;
    const notices = collectRewardNotices(
      { inventory: '长剑,治疗药水', documents: [], clues: [] },
      {
        inventory: '长剑,治疗药水x3',
        documents: [{ id: 'doc-1', name: '调查记录', summary: '记录' }],
        clues: [{ id: 'clue-1', name: '暗号', description: '线索' }],
      },
      () => ++id,
    );

    expect(notices.map((notice) => [notice.kind, notice.name, notice.quantity])).toEqual([
      ['item', '治疗药水', 2],
      ['document', '调查记录', undefined],
      ['clue', '暗号', undefined],
    ]);
  });

  it('does not create generic notices for gold-only changes or identical state', () => {
    expect(collectRewardNotices({ gold: 10 }, { gold: 20 }, () => 1)).toEqual([]);
    expect(collectRewardNotices({ inventory: '长剑' }, { inventory: '长剑' }, () => 1)).toEqual([]);
  });

  it('creates a compact notice for every companion trust change', () => {
    let id = 0;
    const notices = collectRewardNotices(
      { se_trust: 50, al_trust: 50, sl_trust: 50, kl_trust: 50 },
      { se_trust: 53, al_trust: 48, sl_trust: 50, kl_trust: 54 },
      () => ++id,
    );

    expect(notices.map(({ kind, name, delta, value }) => ({ kind, name, delta, value }))).toEqual([
      { kind: 'trust', name: '瑟琳', delta: 3, value: 53 },
      { kind: 'trust', name: '艾琳', delta: -2, value: 48 },
      { kind: 'trust', name: '凯娅', delta: 4, value: 54 },
    ]);
    expect(notices.map((notice) => notice.image)).toEqual([
      '/assets/chibi/selin/avatar.png',
      '/assets/chibi/ailin/avatar.png',
      '/assets/chibi/kelaiya/avatar.png',
    ]);
  });
});
