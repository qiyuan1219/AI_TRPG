/**
 * 战前行动工具模块
 *
 * 负责：
 * 1. condition 表达式求值（支持 || && ! flags.xxx）
 * 2. 战前行动选择判定（自动成功/大成功/骰子判定）
 * 3. 战前行动效果合并
 */

export type BattlePrepResultType = 'success' | 'failed' | 'greatSuccess';

/**
 * 战前选择行动规则：
 *
 * 每场战斗前只允许玩家进行一次战前选择行动。
 * 完成一次选择、骰子判定、可选重投和结果确认后，
 * 必须立即锁定 battlePrep，并进入 AI 续写。
 *
 * AI 续写期间不得再显示新的战前选择面板。
 * AI 续写结束后必须直接进入战斗。
 *
 * 禁止恢复旧版 3 次战前行动逻辑。
 */
import { buildTrustPatch, getCompanionTrust } from './trust';
export const BATTLE_PREP_ACTION_LIMIT = 1;

export type BattlePrepPhase =
  | 'idle'
  | 'selecting'
  | 'rolling'
  | 'reroll_pending'
  | 'confirmed'
  | 'ai_narrating'
  | 'transitioning_to_battle'
  | 'completed';

export interface BattlePrepFlowState {
  active: boolean;
  consumed: boolean;
  remainingActions: number;
  phase: BattlePrepPhase;
}

export function createBattlePrepFlowState(phase: BattlePrepPhase = 'selecting'): BattlePrepFlowState {
  return { active: true, consumed: false, remainingActions: BATTLE_PREP_ACTION_LIMIT, phase };
}

export function lockBattlePrepForNarration(): BattlePrepFlowState {
  return { active: true, consumed: true, remainingActions: 0, phase: 'ai_narrating' };
}

export function shouldShowBattlePrepPanel(flow?: Partial<BattlePrepFlowState> | null): boolean {
  return Boolean(
    flow?.active === true
    && flow.consumed !== true
    && (flow.phase === 'selecting' || flow.phase === 'rolling' || flow.phase === 'reroll_pending'),
  );
}

export function shouldSuppressBattlePrepSuggestions(flow?: Partial<BattlePrepFlowState> | null): boolean {
  return Boolean(flow?.consumed === true && (
    flow.phase === 'confirmed'
    || flow.phase === 'ai_narrating'
    || flow.phase === 'transitioning_to_battle'
    || flow.phase === 'completed'
  ));
}

export interface BattlePrepChoice {
  id: string;
  label: string;
  type: 'battlePrep';
  desc: string;
  autoSuccessWhen?: string;
  greatSuccessWhen?: string;
  alwaysSuccess?: boolean;
  check?: {
    skill: string;
    altSkill?: string;
    dc: number;
    label: string;
    attribute?: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
  };
  successText: string;
  greatSuccessText?: string;
  failText?: string;
  successEffect: BattlePrepEffect;
  greatSuccessEffect?: BattlePrepEffect;
  failEffect?: BattlePrepEffect;
  canUseRerollItems?: boolean;
}

export interface BattlePrepEffect {
  flags?: Record<string, boolean>;
  battleEffects?: Record<string, any>;
  statePatch?: Record<string, any>;
  scoreDeltas?: Record<string, number>;
  trustDeltas?: Partial<Record<'serin' | 'ailin' | 'brock' | 'kaiya', number>>;
}

export interface BattlePrepRoll {
  d20: number;
  modifier: number;
  total: number;
  dc: number;
  skill: string;
  altSkill?: string;
}

export interface BattlePrepResolveResult {
  result: BattlePrepResultType;
  text: string;
  effect: BattlePrepEffect | null;
  roll?: BattlePrepRoll;
  storyCheck?: StoryCheckResult;
  finalized?: boolean;
}

export type RerollItemId = 'fiction-dice' | 'omni-dice';

export interface StoryCheckResult {
  checkId: string;
  actionId: string;
  attribute: AbilityKey;
  skillName: string;
  dc: number;
  modifier: number;
  initialRoll: StoryRoll;
  initialRollId: string;
  reroll?: StoryRoll & { itemId: RerollItemId };
  rerollRollId?: string;
  finalRoll: StoryRoll & { source: 'initial' | RerollItemId };
  finalRollId: string;
  diceEvents: DiceEvent[];
  rerollUsed: boolean;
  finalized: boolean;
}

interface StoryRoll {
  d20: number;
  total: number;
  success: boolean;
}

const REROLL_ITEM_NAMES: Record<RerollItemId, string> = {
  'fiction-dice': '虚构骰子',
  'omni-dice': '万能骰子',
};

function parseInventory(inventory: string): Map<string, number> {
  const result = new Map<string, number>();
  String(inventory || '').split(',').map((item) => item.trim()).filter(Boolean).forEach((raw) => {
    const match = raw.match(/^(.+?)(?:x|×)(\d+)$/i);
    const name = (match ? match[1] : raw).trim();
    const quantity = match ? Number(match[2]) : 1;
    result.set(name, (result.get(name) || 0) + quantity);
  });
  return result;
}

function formatInventory(items: Map<string, number>): string {
  return Array.from(items.entries()).filter(([, quantity]) => quantity > 0)
    .map(([name, quantity]) => quantity > 1 ? `${name}x${quantity}` : name).join(',');
}

export function migrateRerollInventory(state: any): any {
  const items = parseInventory(state?.inventory || '');
  let changed = false;
  Object.values(REROLL_ITEM_NAMES).forEach((name) => {
    if (!items.has(name)) { items.set(name, 3); changed = true; }
  });
  return changed ? { ...state, inventory: formatInventory(items) } : state;
}

export function getRerollItemQuantity(state: any, itemId: RerollItemId): number {
  return parseInventory(state?.inventory || '').get(REROLL_ITEM_NAMES[itemId]) || 0;
}

function consumeRerollItem(state: any, itemId: RerollItemId): any {
  const items = parseInventory(state?.inventory || '');
  const name = REROLL_ITEM_NAMES[itemId];
  const quantity = items.get(name) || 0;
  if (quantity <= 0) throw new Error(`${name}不足`);
  items.set(name, quantity - 1);
  return { ...state, inventory: formatInventory(items) };
}

// ============================================================
// Condition 表达式求值
// 支持：
//   'flags.clue_voice_mimic'
//   '!flags.clue_voice_mimic'
//   'flags.clue_voice_mimic || flags.wounded_guard_stabilized'
//   'flags.clue_voice_mimic && flags.wounded_guard_stabilized'
// ============================================================
export function evaluateCondition(
  condition: string | undefined,
  state: any,
): boolean {
  if (!condition || condition.trim() === '') {
    return true;
  }

  const flags = state.flags || {};

  const readToken = (token: string): boolean => {
    let raw = token.trim();
    if (!raw) return false;

    if (raw.startsWith('!')) {
      raw = raw.slice(1).trim();
      return !readToken(raw);
    }

    if (raw.startsWith('flags.')) {
      const key = raw.replace('flags.', '');
      return Boolean(flags[key]);
    }

    // 直接检查 state 顶层的字段
    let val: any = state;
    const parts = raw.split('.');
    for (const p of parts) {
      val = val?.[p];
    }
    return Boolean(val);
  };

  const orParts = condition.split('||').map((part) => part.trim());

  return orParts.some((orPart) => {
    const andParts = orPart.split('&&').map((part) => part.trim());
    return andParts.every(readToken);
  });
}

// ============================================================
// D20 骰子判定
// ============================================================
type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

const SKILL_TO_ABILITY: Record<string, AbilityKey> = {
  observe: 'wis',
  perception: 'wis',
  survival: 'wis',
  medicine: 'wis',
  insight: 'wis',
  arcana: 'int',
  investigation: 'int',
  analysis: 'int',
  history: 'int',
  stealth: 'dex',
  acrobatics: 'dex',
  sleight: 'dex',
  athletics: 'str',
  strength: 'str',
  endurance: 'con',
  constitution: 'con',
  persuasion: 'cha',
  intimidation: 'cha',
  deception: 'cha',
};

function getAbilityValue(state: any, ability: AbilityKey): number {
  const attrs = state.player?.attributes || state.attributes || {};
  const flatValue = state[ability] ?? state[`attr_${ability}`];
  const value = attrs[ability] ?? flatValue ?? 10;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 10;
}

function abilityModifier(value: number): number {
  return Math.floor((value - 10) / 2);
}

function resolveSkillAbility(skill: string, explicitAbility?: AbilityKey): AbilityKey {
  if (explicitAbility) return explicitAbility;
  return SKILL_TO_ABILITY[skill] || 'wis';
}

function getSkillModifier(skill: string, state: any, explicitAbility?: AbilityKey): number {
  const ability = resolveSkillAbility(skill, explicitAbility);
  return abilityModifier(getAbilityValue(state, ability));
}

function rollBattlePrepCheck(
  check: NonNullable<BattlePrepChoice['check']>,
  state: any,
): BattlePrepRoll & { diceEvent: DiceEvent } {
  const mainModifier = getSkillModifier(check.skill, state, check.attribute);
  const altModifier = check.altSkill
    ? getSkillModifier(check.altSkill, state)
    : -999;
  const useAlt = altModifier > mainModifier;
  const usedSkill = useAlt ? check.altSkill! : check.skill;
  const modifier = useAlt ? altModifier : mainModifier;

  const diceEvent = rollDiceEvent('story_check', 'story_check', 20, 1, modifier);
  const d20 = diceEvent.rolls[0];
  const total = diceEvent.total;

  return { d20, modifier, total, dc: check.dc, skill: usedSkill, altSkill: check.altSkill, diceEvent };
}

// ============================================================
// 战前行动判定
// ============================================================
export function resolveBattlePrepChoice(
  choice: BattlePrepChoice,
  state: any,
): BattlePrepResolveResult {
  // 1) 大成功判断
  if (
    choice.greatSuccessWhen &&
    evaluateCondition(choice.greatSuccessWhen, state) &&
    choice.greatSuccessEffect
  ) {
    return {
      result: 'greatSuccess',
      text: choice.greatSuccessText || choice.successText,
      effect: choice.greatSuccessEffect,
    };
  }

  // 2) 自动成功判断
  const hasAutoSuccess =
    Boolean(choice.alwaysSuccess) ||
    (Boolean(choice.autoSuccessWhen) &&
      evaluateCondition(choice.autoSuccessWhen, state));

  if (hasAutoSuccess) {
    return {
      result: 'success',
      text: choice.successText,
      effect: choice.successEffect,
    };
  }

  // 3) 无检定项 → 直接成功
  if (!choice.check) {
    return {
      result: 'success',
      text: choice.successText,
      effect: choice.successEffect,
    };
  }

  // 4) 骰子判定
  const roll = rollBattlePrepCheck(choice.check, state);
  const success = roll.total >= choice.check.dc;
  const storyRoll = { d20: roll.d20, total: roll.total, success };
  const checkId = `${choice.id}-${Date.now()}`;
  const initialEvent = {
    ...roll.diceEvent,
    checkId,
    dc: roll.dc,
    success,
  };
  const storyCheck: StoryCheckResult = {
    checkId,
    actionId: choice.id,
    attribute: resolveSkillAbility(roll.skill, choice.check.attribute),
    skillName: roll.skill,
    dc: roll.dc,
    modifier: roll.modifier,
    initialRoll: storyRoll,
    initialRollId: initialEvent.rollId,
    finalRoll: { ...storyRoll, source: 'initial' },
    finalRollId: initialEvent.rollId,
    diceEvents: [initialEvent],
    rerollUsed: false,
    finalized: false,
  };

  if (success) {
    return {
      result: 'success',
      text: choice.successText,
      effect: choice.successEffect,
      roll,
      storyCheck,
    };
  }

  return {
    result: 'failed',
    text: choice.failText || choice.successText,
    effect: choice.failEffect || null,
    roll,
    storyCheck,
  };
}

function resultFromFinalRoll(choice: BattlePrepChoice, base: BattlePrepResolveResult, storyCheck: StoryCheckResult): BattlePrepResolveResult {
  const success = storyCheck.finalRoll.success;
  return {
    ...base,
    result: success ? 'success' : 'failed',
    text: success ? choice.successText : (choice.failText || choice.successText),
    effect: success ? choice.successEffect : (choice.failEffect || null),
    roll: {
      d20: storyCheck.finalRoll.d20,
      modifier: storyCheck.modifier,
      total: storyCheck.finalRoll.total,
      dc: storyCheck.dc,
      skill: storyCheck.skillName,
    },
    storyCheck,
  };
}

export function useFictionDice(choice: BattlePrepChoice, base: BattlePrepResolveResult, state: any) {
  const check = base.storyCheck;
  if (!check || check.finalized) throw new Error('当前判定不能重投');
  if (check.rerollUsed) throw new Error('本次判定已经使用过重投道具');
  const nextState = consumeRerollItem(state, 'fiction-dice');
  const diceEvent = rollDiceEvent('reroll', 'fiction_dice', 20, 1, check.modifier, {
    checkId: check.checkId,
    itemId: 'fiction_dice',
    metadata: { rerollRule: 'take_max', previousRollId: check.finalRollId },
  });
  const d20 = diceEvent.rolls[0];
  const total = diceEvent.total;
  const reroll = { itemId: 'fiction-dice' as const, d20, total, success: total >= check.dc };
  const useReroll = total >= check.initialRoll.total;
  const finalRoll = useReroll
    ? { d20, total, success: reroll.success, source: 'fiction-dice' as const }
    : { ...check.initialRoll, source: 'initial' as const };
  const finalRollId = useReroll ? diceEvent.rollId : check.initialRollId;
  const storyCheck = {
    ...check,
    reroll,
    rerollRollId: diceEvent.rollId,
    finalRoll,
    finalRollId,
    diceEvents: [...check.diceEvents, diceEvent],
    rerollUsed: true,
  };
  return { state: nextState, result: resultFromFinalRoll(choice, base, storyCheck) };
}

export function useOmniDice(choice: BattlePrepChoice, base: BattlePrepResolveResult, state: any, chosenD20: number) {
  const check = base.storyCheck;
  if (!check || check.finalized) throw new Error('当前判定不能重投');
  if (check.rerollUsed) throw new Error('本次判定已经使用过重投道具');
  if (!Number.isInteger(chosenD20) || chosenD20 < 1 || chosenD20 > 20) throw new Error('万能骰子的指定点数必须在 1 到 20 之间');
  const nextState = consumeRerollItem(state, 'omni-dice');
  const diceEvent = forcedDiceEvent(chosenD20, check.modifier, {
    checkId: check.checkId,
    itemId: 'omni_dice',
    metadata: { previousRollId: check.finalRollId },
  });
  const total = diceEvent.total;
  const reroll = { itemId: 'omni-dice' as const, d20: chosenD20, total, success: total >= check.dc };
  const storyCheck = {
    ...check,
    reroll,
    rerollRollId: diceEvent.rollId,
    finalRoll: { ...reroll, source: 'omni-dice' as const },
    finalRollId: diceEvent.rollId,
    diceEvents: [...check.diceEvents, diceEvent],
    rerollUsed: true,
  };
  return { state: nextState, result: resultFromFinalRoll(choice, base, storyCheck) };
}

export function finalizeBattlePrepResult(choice: BattlePrepChoice, base: BattlePrepResolveResult): BattlePrepResolveResult {
  if (!base.storyCheck) return { ...base, finalized: true };
  return { ...resultFromFinalRoll(choice, base, { ...base.storyCheck, finalized: true }), finalized: true };
}

// ============================================================
// 战斗效果合并
// ============================================================
export function mergeBattleEffects(
  current: Record<string, any>,
  incoming: Record<string, any>,
): Record<string, any> {
  const merged = { ...current };

  for (const key of Object.keys(incoming)) {
    const oldValue = merged[key];
    const newValue = incoming[key];

    if (Array.isArray(oldValue) && Array.isArray(newValue)) {
      merged[key] = [...oldValue, ...newValue];
    } else if (
      oldValue &&
      newValue &&
      typeof oldValue === 'object' &&
      typeof newValue === 'object' &&
      !Array.isArray(oldValue) &&
      !Array.isArray(newValue)
    ) {
      merged[key] = { ...oldValue, ...newValue };
    } else {
      merged[key] = newValue;
    }
  }

  return merged;
}

// ============================================================
// 战前行动效果应用到状态
// ============================================================
export function applyBattlePrepEffect(
  state: any,
  choice: BattlePrepChoice,
  result: BattlePrepResolveResult,
  options: {
    prepDoneFlag?: string;
    encounterId?: string;
    battleId?: string;
    afterSceneId?: string;
  } = {},
): any {
  const prepDoneFlag = options.prepDoneFlag || 'blue_shoal_battle_prep_done';
  const nextState = {
    ...state,
    ...(result.effect?.statePatch || {}),
    flags: {
      ...(state.flags || {}),
      ...(result.effect?.flags || {}),
      [prepDoneFlag]: true,
    },
    lastBattlePrepChoice: choice.id,
    selectedPrepActionId: choice.id,
    lastPrepResult: result,
    currentEncounterId: options.encounterId || state.currentEncounterId,
    currentBattleId: options.battleId || state.currentBattleId,
    nextAfterBattleSceneId: options.afterSceneId || state.nextAfterBattleSceneId,
    encounterPhase: 'aiNarration',
  };

  Object.entries(result.effect?.scoreDeltas || {}).forEach(([key, delta]) => {
    nextState[key] = Number(state[key] || 0) + Number(delta || 0);
  });

  const trustTargets: Record<string, number> = {};
  Object.entries(result.effect?.trustDeltas || {}).forEach(([companion, delta]) => {
    trustTargets[companion] = Math.max(0, Math.min(100, getCompanionTrust(nextState, companion as 'serin' | 'ailin' | 'brock' | 'kaiya') + Number(delta || 0)));
  });
  if (Object.keys(trustTargets).length) Object.assign(nextState, buildTrustPatch(nextState, trustTargets));

  const currentBattleEffects = state.battleEffects || {};
  const incomingBattleEffects = result.effect?.battleEffects || {};

  nextState.battleEffects = mergeBattleEffects(
    currentBattleEffects,
    incomingBattleEffects,
  );

  return nextState;
}

// ============================================================
// 战斗日志文本生成
// ============================================================
export function getBattlePrepLog(
  choiceId: string,
  result: BattlePrepResultType,
): string {
  const logs: Record<string, Record<string, string>> = {
    'blue-shoal-prep-ignore-voices': {
      success: '战前行动生效：队伍识破了拟声菌团的诱导，拟声菌团第一回合无法使用【拟声扰乱】。',
      greatSuccess:
        '战前行动大成功：巡逻记录与伤员证词完全对上了，队伍不仅识破拟声诱导，还锁定了菌团核心位置。拟声菌团第一回合无法使用【拟声扰乱】，且我方对其首次攻击命中提高。',
      failed:
        '战前行动失误：队伍短暂受到拟声干扰，后排角色第一回合先攻略有下降。',
    },
    'blue-shoal-prep-find-core': {
      success:
        '战前行动生效：拟声菌团核心暴露，我方第一回合攻击拟声菌团时命中提高，首次命中追加伤害。',
      greatSuccess: '战前行动大成功：拟声菌团核心完全暴露。',
      failed:
        '战前行动失误：拟声菌团反而模仿了队伍声音，获得了第一回合先攻优势。',
    },
    'blue-shoal-prep-avoid-bulges': {
      success:
        '战前行动生效：孢化兽破土突袭被提前避开，第一回合攻击受到惩罚，前排AC提升。',
      greatSuccess: '战前行动大成功：孢化兽完全失位。',
      failed:
        '战前行动失误：孢化兽从意料之外的位置冲出，第一回合攻击获得加值。',
    },
    'blue-shoal-prep-mask': {
      success:
        '战前行动生效：全队获得【稳息】，孢尘伤害减免，孢尘抗性提升，持续2回合。',
      greatSuccess: '战前行动生效：全队获得【稳息】。',
      failed: '战前行动生效：全队获得【稳息】。',
    },
  };

  return logs[choiceId]?.[result] || '';
}
import type { DiceEvent } from '../core/dice/DiceEvent';
import { forcedDiceEvent, rollDiceEvent } from '../core/dice/createDiceEvent';
