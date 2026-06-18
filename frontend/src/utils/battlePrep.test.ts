import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getRerollItemQuantity,
  migrateRerollInventory,
  resolveBattlePrepChoice,
  useFictionDice,
  useOmniDice,
  type BattlePrepChoice,
} from './battlePrep';

const choice: BattlePrepChoice = {
  id: 'test-check', label: '观察', type: 'battlePrep', desc: '',
  check: { skill: 'perception', dc: 14, label: '感知 DC14', attribute: 'wis' },
  successText: '成功', failText: '失败', successEffect: { flags: { success: true } },
  failEffect: { flags: { failed: true } }, canUseRerollItems: true,
};
const state = { inventory: '长剑,虚构骰子x3,万能骰子x3', wis: 14 };

afterEach(() => vi.restoreAllMocks());

describe('剧情检定重投', () => {
  it('为旧存档补充两种骰子且不会重复补充', () => {
    const migrated = migrateRerollInventory({ inventory: '长剑' });
    expect(getRerollItemQuantity(migrated, 'fiction-dice')).toBe(3);
    expect(getRerollItemQuantity(migrateRerollInventory(migrated), 'omni-dice')).toBe(3);
  });

  it('虚构骰子取较高总值并只消耗一个', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0.3).mockReturnValueOnce(0.7); // 7 -> 15
    const initial = resolveBattlePrepChoice(choice, state);
    const outcome = useFictionDice(choice, initial, state);
    expect(outcome.result.storyCheck?.finalRoll.d20).toBe(15);
    expect(outcome.result.storyCheck?.rerollUsed).toBe(true);
    expect(getRerollItemQuantity(outcome.state, 'fiction-dice')).toBe(2);
    expect(() => useOmniDice(choice, outcome.result, outcome.state, 20)).toThrow('已经使用过');
  });

  it('万能骰子直接采用指定点数并验证范围', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.95);
    const initial = resolveBattlePrepChoice(choice, state);
    const outcome = useOmniDice(choice, initial, state, 1);
    expect(outcome.result.storyCheck?.finalRoll.d20).toBe(1);
    expect(outcome.result.result).toBe('failed');
    expect(getRerollItemQuantity(outcome.state, 'omni-dice')).toBe(2);
    expect(() => useOmniDice(choice, initial, state, 21)).toThrow('1 到 20');
  });
});
