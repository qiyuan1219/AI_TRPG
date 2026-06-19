import { afterEach, describe, expect, it, vi } from 'vitest';
import { SelectionActionCheck } from './selectionAction';
import { setDiceFaceProviderForTests } from '../core/dice/createDiceEvent';

afterEach(() => {
  vi.restoreAllMocks();
  setDiceFaceProviderForTests();
});

describe('SelectionActionCheck', () => {
  it('只接管带 DC 标记的非战斗选择行动', () => {
    expect(SelectionActionCheck.fromAction('询问瑟琳最近的情况', { wis: 12 })).toBeNull();
    const check = SelectionActionCheck.fromAction('观察浅滩路线【感知DC13】', { wis: 14, inventory: '虚构骰子x3,万能骰子x3' });
    expect(check?.result.storyCheck?.dc).toBe(13);
    expect(check?.choice.canUseRerollItems).toBe(true);
  });

  it('确认后生成锁定结果提示，禁止 AI 再次投骰', () => {
    setDiceFaceProviderForTests(() => 15);
    const check = SelectionActionCheck.fromAction('调查封印【智力DC12】', { int: 12, inventory: '虚构骰子x3,万能骰子x3' })!;
    check.finalize();
    expect(check.lockedPrompt).toContain('禁止再次投骰');
    expect(check.lockedPrompt).toContain('最终成功');
  });

  it('可复用教学判定 UI 执行配置好的战前行动', () => {
    setDiceFaceProviderForTests(() => 14);
    const choice = {
      id: 'blue-shoal-test', label: '识破拟声【观察DC14】', type: 'battlePrep' as const,
      desc: '识破拟声', canUseRerollItems: true,
      check: { skill: 'observe', dc: 14, label: '观察 DC 14', attribute: 'wis' as const },
      successText: '识破成功', failText: '识破失败',
      successEffect: { battleEffects: { allyMentalResistBonus: 2 } },
      failEffect: {},
    };
    const check = SelectionActionCheck.fromChoice(choice.label, choice, { wis: 10 });
    expect(check.choice.id).toBe('blue-shoal-test');
    expect(check.result.storyCheck?.dc).toBe(14);
    expect(check.finalize().effect?.battleEffects?.allyMentalResistBonus).toBe(2);
  });
});
