import { describe, expect, it } from 'vitest';
import {
  createNarrativeStreamParser,
  extractHints,
  parseNarrativeSegments,
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
    expect(splitNarrative('守卫点头。瑟琳：「别靠太近。」')).toEqual([
      '守卫点头。',
      '瑟琳：「别靠太近。」',
    ]);
  });

  it('only treats explicit script dialogue as character speech', () => {
    const parsed = parseNarrativeSegments(
      '他啪地合上日志，镜片后投来歉意的目光。\n'
      + '帕维：「萨洛·杯底当时也在远征队出发前的践行酒桌上。他记性比我好，而且——」\n'
      + '他压低声音，"——他手里藏着第三远征队队长私下托付的东西。去回声酒馆找他吧。"',
    );

    expect(parsed.segments).toContainEqual({
      speaker: '帕维',
      text: '"萨洛·杯底当时也在远征队出发前的践行酒桌上。他记性比我好，而且——"',
    });
    expect(parsed.segments.some((segment) => (
      segment.speaker === '萨洛'
      && segment.text.includes('第三远征队队长私下托付的东西')
    ))).toBe(false);
    expect(parsed.segments.some((segment) => (
      segment.speaker === '主持人'
      && segment.text.includes('"——他手里藏着第三远征队队长私下托付的东西。')
    ))).toBe(true);
  });

  it('drops standalone closing quotes instead of showing them as story beats', () => {
    expect(splitNarrative('」')).toEqual([]);

    const parsed = parseNarrativeSegments('」');
    expect(parsed.segments).toEqual([]);
  });

  it('does not emit a standalone closing quote while streaming dialogue', () => {
    const parser = createNarrativeStreamParser();

    expect(parser.push('瑟琳：「走。')).toEqual({ lines: [], suggestions: [] });
    expect(parser.push('」')).toEqual({
      lines: ['瑟琳：「走。」'],
      suggestions: [],
    });
    expect(parser.flush().lines).toEqual([]);
  });
});
