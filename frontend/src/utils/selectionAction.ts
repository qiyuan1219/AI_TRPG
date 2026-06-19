import type { GameState } from '../types/game';
import type { BattlePrepChoice, BattlePrepResolveResult, RerollItemId } from './battlePrep';
import { finalizeBattlePrepResult, resolveBattlePrepChoice, useFictionDice, useOmniDice } from './battlePrep';

const ATTRIBUTE_BY_LABEL: Record<string, 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha'> = {
  力量: 'str', 敏捷: 'dex', 体质: 'con', 耐受: 'con', 智力: 'int', 调查: 'int', 奥秘: 'int',
  感知: 'wis', 观察: 'wis', 洞察: 'wis', 生存: 'wis', 医疗: 'wis', 魅力: 'cha', 说服: 'cha', 威吓: 'cha', 欺瞒: 'cha',
};

/** 所有非战斗“选择行动”检定的统一领域对象。 */
export class SelectionActionCheck {
  readonly actionText: string;
  readonly choice: BattlePrepChoice;
  result: BattlePrepResolveResult;

  private constructor(actionText: string, choice: BattlePrepChoice, result: BattlePrepResolveResult) {
    this.actionText = actionText;
    this.choice = choice;
    this.result = result;
  }

  static fromAction(actionText: string, state: GameState): SelectionActionCheck | null {
    const match = actionText.match(/【\s*([^】]*?)\s*DC\s*(\d+)\s*】/i);
    if (!match) return null;
    const label = match[1].trim() || '观察';
    const attribute = Object.entries(ATTRIBUTE_BY_LABEL).find(([name]) => label.includes(name))?.[1] || 'wis';
    const choice: BattlePrepChoice = {
      id: `selection-${Date.now()}`,
      label: actionText.replace(/【[^】]+】/g, '').trim(),
      type: 'battlePrep',
      desc: actionText,
      canUseRerollItems: true,
      check: { skill: label, dc: Number(match[2]), label: `${label} DC ${match[2]}`, attribute },
      successText: '行动检定成功。', failText: '行动检定失败。', successEffect: {}, failEffect: {},
    };
    return new SelectionActionCheck(actionText, choice, resolveBattlePrepChoice(choice, state));
  }

  /** 复用教学战的判定 UI，但保留遭遇配置中的原始效果。 */
  static fromChoice(actionText: string, choice: BattlePrepChoice, state: GameState): SelectionActionCheck {
    return new SelectionActionCheck(actionText, choice, resolveBattlePrepChoice(choice, state));
  }

  reroll(itemId: RerollItemId, state: GameState, chosenD20?: number): GameState {
    const outcome = itemId === 'fiction-dice'
      ? useFictionDice(this.choice, this.result, state)
      : useOmniDice(this.choice, this.result, state, chosenD20 ?? 0);
    this.result = outcome.result;
    return outcome.state;
  }

  finalize(): BattlePrepResolveResult {
    this.result = finalizeBattlePrepResult(this.choice, this.result);
    return this.result;
  }

  get lockedPrompt(): string {
    const check = this.result.storyCheck;
    if (!check) return '';
    return `\n[已锁定的选择行动检定：初投${check.initialRoll.d20}，最终D20=${check.finalRoll.d20}，总计=${check.finalRoll.total}，DC=${check.dc}，最终${check.finalRoll.success ? '成功' : '失败'}。必须直接依据最终结果续写，禁止再次投骰或改变成败。]`;
  }
}
