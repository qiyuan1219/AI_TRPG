import { describe, expect, it } from 'vitest';
import { buildAiContext } from './buildAiContext';

describe('buildAiContext', () => {
  it('preserves scene facts while trimming old history', () => {
    const summary: any = {
      sceneId: 'scene', areaId: 'area', title: '测试',
      participants: ['你', '瑟琳'], confirmedFacts: ['奖励已领取'],
      unresolvedClues: ['门'], recentRuleEvents: [], lastUpdatedAt: '', version: 1,
    };
    const history = Array.from({ length: 40 }, (_, index) => ({ role: 'user', content: `旧消息${index}` }));
    const context = buildAiContext(summary, history, [], 'main_chat');
    expect(context.sceneSummary.confirmedFacts).toContain('奖励已领取');
    expect(context.history).toHaveLength(20);
  });
});
