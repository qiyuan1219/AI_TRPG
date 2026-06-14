import { describe, expect, it } from 'vitest';
import {
  createNarrativeStreamParser,
  extractHints,
  splitNarrative,
  stripAllMachineProtocolText,
} from './narrative';

describe('narrative protocol handling', () => {
  it('removes machine protocol while preserving visible narration', () => {
    const text = '瑟琳举起银杖。[STATE:update_gold:{"amount":-10}]她低声说：“走。”';

    expect(stripAllMachineProtocolText(text)).toBe('瑟琳举起银杖。她低声说：“走。”');
  });

  it('extracts action hints without leaking them into narration', () => {
    const parsed = extractHints('门后传来回声。【HINTS:调查门缝【调查DC12】|直接推门|询问瑟琳】');

    expect(parsed.text).toBe('门后传来回声。');
    expect(parsed.suggestions.map((item) => item.text)).toEqual([
      '调查门缝【调查DC12】',
      '直接推门',
      '询问瑟琳',
    ]);
  });

  it('buffers incomplete streamed sentences and flushes the tail', () => {
    const parser = createNarrativeStreamParser();

    expect(parser.push('主缆街的风')).toEqual({ lines: [], suggestions: [] });
    expect(parser.push('从脚下掠过。')).toEqual({ lines: ['主缆街的风从脚下掠过。'], suggestions: [] });
    expect(parser.push('【HINTS:前往公会|查看封条】').suggestions.map((item) => item.text)).toEqual([
      '前往公会',
      '查看封条',
    ]);
    expect(parser.flush().lines).toEqual([]);
  });

  it('splits plain narration into playable dialogue beats', () => {
    expect(splitNarrative('守卫点头。瑟琳说：“别靠太近。”')).toEqual([
      '守卫点头。',
      '瑟琳说："别靠太近。"',
    ]);
  });
});
