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

  it('removes legacy phase limit notices from visible text', () => {
    const notice = '[系统提示：这是本阶段第3/3次选择行动。请在完成本次叙事后直接推进到下一段剧情，不要继续停留在当前选择阶段。]';

    expect(stripAllMachineProtocolText(`追问书记员报告中的孢化地底兽\n${notice}`)).toBe('追问书记员报告中的孢化地底兽');
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

  it('keeps nested DC brackets inside action hints intact', () => {
    const parsed = extractHints(
      '温妮把扳手扣回腰间。【HINTS:前往降渊缆梯中枢找温妮检查装备|先去黑市补给药剂和工具【感知DC12】打听消息|向赫尔曼追问缆梯事故详情【洞悉DC14】】',
    );

    expect(parsed.text).toBe('温妮把扳手扣回腰间。');
    expect(parsed.suggestions.map((item) => item.text)).toEqual([
      '前往降渊缆梯中枢找温妮检查装备',
      '先去黑市补给药剂和工具【感知DC12】打听消息',
      '向赫尔曼追问缆梯事故详情【洞悉DC14】',
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

  it('keeps multiline dialogue attached to the explicit speaker', () => {
    const parsed = parseNarrativeSegments(
      '凯娅\n'
      + '"云苓？黑市的药剂商我大多认识。但没听说过叫云苓的。"\n\n'
      + '她转向奥兰，后者正把盲盒摊上的骰子收回麂皮袋里。\n\n'
      + '奥兰耸耸肩：「我在黑市做了八年生意，药剂摊来来去去就那么几家。\n\n'
      + '云苓这名字——要么是新来的还没挂招牌，要么根本不在这片混。\n\n'
      + '你们是不是听错名字了？\n\n'
      + '」',
    );

    expect(parsed.segments).toContainEqual({
      speaker: '凯娅',
      text: '"云苓？黑市的药剂商我大多认识。但没听说过叫云苓的。"',
    });
    expect(parsed.segments).toContainEqual({
      speaker: '主持人',
      text: '她转向奥兰，后者正把盲盒摊上的骰子收回麂皮袋里。',
    });
    expect(parsed.segments).toContainEqual({
      speaker: '主持人',
      text: '奥兰耸耸肩',
    });
    expect(parsed.segments).toContainEqual({
      speaker: '奥兰',
      text: '"我在黑市做了八年生意，药剂摊来来去去就那么几家。云苓这名字——要么是新来的还没挂招牌，要么根本不在这片混。你们是不是听错名字了？"',
    });
    expect(parsed.segments.some((segment) => segment.text.trim() === '」')).toBe(false);
  });
});
