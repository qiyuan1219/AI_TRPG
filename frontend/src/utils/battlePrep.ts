/**
 * 战前行动工具模块
 *
 * 负责：
 * 1. condition 表达式求值（支持 || && ! flags.xxx）
 * 2. 战前行动选择判定（自动成功/大成功/骰子判定）
 * 3. 战前行动效果合并
 */

export type BattlePrepResultType = 'success' | 'failed' | 'greatSuccess';

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
}

export interface BattlePrepEffect {
  flags?: Record<string, boolean>;
  battleEffects?: Record<string, any>;
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
function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

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
): BattlePrepRoll {
  const mainModifier = getSkillModifier(check.skill, state, check.attribute);
  const altModifier = check.altSkill
    ? getSkillModifier(check.altSkill, state)
    : -999;
  const useAlt = altModifier > mainModifier;
  const usedSkill = useAlt ? check.altSkill! : check.skill;
  const modifier = useAlt ? altModifier : mainModifier;

  const d20 = rollD20();
  const total = d20 + modifier;

  return { d20, modifier, total, dc: check.dc, skill: usedSkill, altSkill: check.altSkill };
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

  if (roll.total >= choice.check.dc) {
    return {
      result: 'success',
      text: choice.successText,
      effect: choice.successEffect,
      roll,
    };
  }

  return {
    result: 'failed',
    text: choice.failText || choice.successText,
    effect: choice.failEffect || null,
    roll,
  };
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
