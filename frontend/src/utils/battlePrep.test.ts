import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  getRerollItemQuantity,
  migrateRerollInventory,
  resolveBattlePrepChoice,
  useFictionDice,
  useOmniDice,
  BATTLE_PREP_ACTION_LIMIT,
  createBattlePrepFlowState,
  applyBattlePrepEffect,
  lockBattlePrepForNarration,
  shouldShowBattlePrepPanel,
  shouldSuppressBattlePrepSuggestions,
  type BattlePrepChoice,
} from './battlePrep';
import { ENCOUNTER_FLOW_CONFIGS, canShowPrepChoice } from '../data/encounterFlows';
import { dispatchGameAction } from '../core/actions/registry';
import '../core/actions/battlePrepResolver';
import { setDiceFaceProviderForTests } from '../core/dice/createDiceEvent';

const choice: BattlePrepChoice = {
  id: 'test-check', label: '观察', type: 'battlePrep', desc: '',
  check: { skill: 'perception', dc: 14, label: '感知 DC14', attribute: 'wis' },
  successText: '成功', failText: '失败', successEffect: { flags: { success: true } },
  failEffect: { flags: { failed: true } }, canUseRerollItems: true,
};
const state = { inventory: '长剑,虚构骰子x3,万能骰子x3', wis: 14 };

afterEach(() => {
  vi.restoreAllMocks();
  setDiceFaceProviderForTests();
});

describe('剧情检定重投', () => {
  it('战前行动只允许一次，确认后立即隐藏面板', () => {
    expect(BATTLE_PREP_ACTION_LIMIT).toBe(1);
    expect(shouldShowBattlePrepPanel(createBattlePrepFlowState())).toBe(true);
    const locked = lockBattlePrepForNarration();
    expect(locked).toMatchObject({ consumed: true, remainingActions: 0, phase: 'ai_narrating' });
    expect(shouldShowBattlePrepPanel(locked)).toBe(false);
    expect(shouldSuppressBattlePrepSuggestions(locked)).toBe(true);
    for (const config of ENCOUNTER_FLOW_CONFIGS) {
      expect(canShowPrepChoice({
        currentEncounterId: config.encounterId,
        flags: {},
        battlePrep: locked,
        ...(config.encounterId === 'blue-shoal' ? { selectedPrepActionId: 'blue-shoal-prep-ignore-voices' } : {}),
      }, config)).toBe(false);
    }
  });

  it('蓝伞浅滩不会被旧流程残留的假战前完成标记跳过', () => {
    const config = ENCOUNTER_FLOW_CONFIGS.find((item) => item.encounterId === 'blue-shoal')!;
    const staleSkippedState = {
      currentEncounterId: 'blue-shoal',
      flags: { blue_shoal_battle_prep_done: true },
      battlePrep: { active: true, consumed: true, remainingActions: 0, phase: 'transitioning_to_battle' },
    };

    expect(canShowPrepChoice(staleSkippedState, config)).toBe(true);
    expect(canShowPrepChoice({
      ...staleSkippedState,
      selectedPrepActionId: 'blue-shoal-prep-ignore-voices',
    }, config)).toBe(false);
  });

  it('确认动作通过 StatePatch 管线锁定战前状态', async () => {
    const result = await dispatchGameAction({ battlePrep: createBattlePrepFlowState() }, {
      id: 'prep-confirm-1', type: 'battle.prep.confirm', actorId: 'player', encounterId: 'blue-shoal', createdAt: 1,
    });
    expect(result.accepted).toBe(true);
    expect(result.patches).toContainEqual({ op: 'set', path: 'battlePrep', value: lockBattlePrepForNarration() });
    expect(result.updatedState?.battlePrep).toMatchObject({ consumed: true, remainingActions: 0, phase: 'ai_narrating' });
  });
  it('为旧存档补充两种骰子且不会重复补充', () => {
    const migrated = migrateRerollInventory({ inventory: '长剑' });
    expect(getRerollItemQuantity(migrated, 'fiction-dice')).toBe(3);
    expect(getRerollItemQuantity(migrateRerollInventory(migrated), 'omni-dice')).toBe(3);
  });

  it('虚构骰子取较高总值并只消耗一个', () => {
    const rolls = [7, 15];
    setDiceFaceProviderForTests(() => rolls.shift() ?? 1);
    const initial = resolveBattlePrepChoice(choice, state);
    const outcome = useFictionDice(choice, initial, state);
    expect(outcome.result.storyCheck?.finalRoll.d20).toBe(15);
    expect(outcome.result.storyCheck?.rerollUsed).toBe(true);
    expect(getRerollItemQuantity(outcome.state, 'fiction-dice')).toBe(2);
    expect(() => useOmniDice(choice, outcome.result, outcome.state, 20)).toThrow('已经使用过');
  });

  it('万能骰子直接采用指定点数并验证范围', () => {
    setDiceFaceProviderForTests(() => 20);
    const initial = resolveBattlePrepChoice(choice, state);
    const outcome = useOmniDice(choice, initial, state, 1);
    expect(outcome.result.storyCheck?.finalRoll.d20).toBe(1);
    expect(outcome.result.result).toBe('failed');
    expect(getRerollItemQuantity(outcome.state, 'omni-dice')).toBe(2);
    expect(() => useOmniDice(choice, initial, state, 21)).toThrow('1 到 20');
  });

  it('战前行动可通过同一效果管线更新剧情分数与伙伴信任', () => {
    const storyChoice: BattlePrepChoice = {
      ...choice,
      successEffect: {
        flags: { laine_call_gatekeeper_success: true },
        scoreDeltas: { guardian_mercy_score: 2 },
        trustDeltas: { serin: 3 },
      },
    };
    const updated = applyBattlePrepEffect(
      { se_trust: 50, guardian_mercy_score: 1, flags: {} },
      storyChoice,
      { result: 'success', text: '成功', effect: storyChoice.successEffect, finalized: true },
    );
    expect(updated.guardian_mercy_score).toBe(3);
    expect(updated.se_trust).toBe(53);
    expect(updated.flags.laine_call_gatekeeper_success).toBe(true);
  });
});
