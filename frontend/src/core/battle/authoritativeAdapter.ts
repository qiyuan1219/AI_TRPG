import type { BattleConfig, BattleSkill, BattleUnit } from '../../components/BattleTestScreen';
import type { AuthoritativeBattleCharacter, AuthoritativeBattleResult } from '../../services/api';
import type { DiceResult } from '../../types/game';
import type { DiceEvent, DiceEventType, DiceOutcome } from '../events/GameEvent';
import { createDiceEvent } from '../dice/createDiceEvent';

const ABILITY_NAMES: Record<string, string> = {
  str: 'strength', dex: 'dexterity', con: 'constitution', int: 'intelligence', wis: 'wisdom', cha: 'charisma',
};

const ABILITY_LABELS: Record<string, string> = {
  str: '力量', dex: '敏捷', con: '体质', int: '智力', wis: '感知', cha: '魅力',
};

function abilityModifier(score: number) {
  return Math.floor((score - 10) / 2);
}

function formulaDice(formula: string): string | undefined {
  const damagePart = formula.split(/；|;/)[1] ?? formula;
  const match = damagePart.match(/(\d*)d(\d+)(?:\s*[+＋-]\s*\d+)?/i);
  if (!match) return undefined;
  return match[0].replace(/＋/g, '+').replace(/\s+/g, '').replace(/^d/i, '1d').toLowerCase();
}

function targetType(skill: BattleSkill) {
  if (/防御/.test(skill.name) || skill.tags.some((tag) => ['防御'].includes(tag))) return 'self';
  const targetText = `${skill.name} ${skill.formula} ${skill.effect} ${skill.rule} ${skill.tags.join(' ')}`;
  const group = /范围|群体|全体|全队|所有敌人|所有队友|我方全体|敌方全体|锥形/.test(targetText)
    || Boolean(skill.primaryTargetBonus);
  const ally = skill.roll.kind === 'healing' || skill.tags.some((tag) => ['临时HP', '增益', '祝福', '护盾', '护卫', '抗性', '减伤'].includes(tag));
  if (group) return ally ? 'all_allies' : 'all_enemies';
  return ally ? 'single_ally' : 'single_enemy';
}

function isDefenseSkill(skill: BattleSkill) {
  return /防御/.test(skill.name) || skill.tags.some((tag) => tag === '防御');
}

function toSkill(unit: BattleUnit, skill: BattleSkill): Record<string, unknown> {
  const dice = formulaDice(skill.formula);
  const hitAbility = skill.roll.ability ? abilityModifier(unit.abilities[skill.roll.ability]) : 0;
  const openingHitBonus = Number((unit as BattleUnit & { openingHitBonus?: number }).openingHitBonus ?? 0);
  const hitBonus = hitAbility + unit.proficiency + openingHitBonus;
  const skillTargetType = targetType(skill);
  const targetsEnemy = skillTargetType === 'single_enemy' || skillTargetType === 'all_enemies';
  const hasDamageDice = ['attack', 'save', 'damage'].includes(skill.roll.kind) && Boolean(dice);
  const requiresSaveRoll = targetsEnemy && skill.roll.kind === 'save';
  const requiresHitRoll = targetsEnemy && hasDamageDice && !requiresSaveRoll;
  return {
    id: skill.id,
    name: skill.name,
    targetType: skillTargetType,
    requiresHitRoll,
    requiresSaveRoll,
    requiresAbilityCheck: skill.roll.kind === 'ability',
    hitBonus,
    hitAbilityKey: skill.roll.ability ?? null,
    hitAbilityLabel: skill.roll.ability ? ABILITY_LABELS[skill.roll.ability] : '',
    hitAbilityBonus: hitAbility,
    proficiencyBonus: unit.proficiency,
    openingHitBonus,
    checkBonus: hitBonus,
    checkDC: skill.roll.dc ?? 10,
    saveDC: skill.roll.dc ?? 10,
    saveBonusOverride: skill.roll.targetSaveBonus,
    damageDice: ['attack', 'save', 'damage', 'ability'].includes(skill.roll.kind) && dice ? dice : ['attack', 'save', 'damage'].includes(skill.roll.kind) ? '1d4' : undefined,
    healingDice: skill.roll.kind === 'healing' ? (dice ?? '1d4') : undefined,
    primaryTargetBonus: skill.primaryTargetBonus ?? 0,
    damageBonusAttribute: null,
    damageType: skill.tags[0] ?? 'untyped',
    armorPierce: 0,
    cost: {},
    cooldown: 0,
    effects: isDefenseSkill(skill)
      ? [{ type: 'damage_reduction_once', value: 0.5, duration: 99, name: '防御' }]
      : [],
  };
}

export function toAuthoritativeBattlePayload(config: BattleConfig, units: BattleUnit[]) {
  const skills: Record<string, Record<string, unknown>> = {};
  const characters: AuthoritativeBattleCharacter[] = units.map((unit) => {
    const availableSkills = unit.skills.filter((skill) => !skill.locked);
    availableSkills.forEach((skill) => { skills[skill.id] = toSkill(unit, skill); });
    const attributes = Object.fromEntries(Object.entries(unit.abilities).map(([key, score]) => [ABILITY_NAMES[key], abilityModifier(score)]));
    return {
      id: unit.id,
      name: unit.name,
      team: unit.faction === 'ally' ? 'player' : 'enemy',
      alive: unit.hp > 0,
      attributes,
      combatStats: {
        hp: unit.hp,
        maxHp: unit.maxHp,
        armor: 0,
        maxArmor: 0,
        defense: unit.ac,
        attackBonus: 0,
        initiativeBonus: abilityModifier(unit.abilities.dex) + Number(unit.initiativeBonus ?? 0),
      },
      resources: {},
      skillIds: availableSkills.map((skill) => skill.id),
      statuses: [...unit.statuses],
      cooldowns: {},
    };
  });
  return { characters, skills, encounterId: config.title };
}

export function authoritativeInitiative(result: AuthoritativeBattleResult) {
  return result.battleState.initiative.map((entry) => ({
    unitId: entry.characterId,
    roll: entry.roll,
    dexMod: entry.dexterity,
    otherBonus: entry.initiativeBonus - entry.dexterity,
    total: entry.total,
  }));
}

export function authoritativeHp(result: AuthoritativeBattleResult) {
  return Object.fromEntries(result.battleState.characters.map((unit) => [unit.id, unit.combatStats.hp]));
}

/** 群体技能必须按各自 damage event 显示数值，不能复用主目标伤害。 */
export function authoritativeAmountByTarget(result: AuthoritativeBattleResult) {
  return Object.fromEntries(
    result.events
      .filter((event) => event.type === 'damage' || event.type === 'healing')
      .filter((event) => typeof event.targetId === 'string')
      .map((event) => [String(event.targetId), Number(event.hpDamage ?? event.rawDamage ?? event.total ?? 0)]),
  );
}

function eventName(result: AuthoritativeBattleResult, id: unknown) {
  return result.battleState.characters.find((unit) => unit.id === id)?.name;
}

function formulaSides(formula: unknown, fallback = 20) {
  const match = String(formula ?? '').match(/d(\d+)/i);
  return match ? Number(match[1]) : fallback;
}

function isoTime(value: unknown) {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return new Date(value * 1000).toISOString();
  return new Date().toISOString();
}

function outcome(rawRoll: number, success: boolean): DiceOutcome {
  if (rawRoll === 20) return 'critical_success';
  if (rawRoll === 1) return 'critical_fail';
  return success ? 'success' : 'fail';
}

function canonicalEvent(
  result: AuthoritativeBattleResult,
  raw: Record<string, any>,
  type: DiceEventType,
): DiceEvent {
  if (raw.diceEvent) return raw.diceEvent as DiceEvent;
  const rolls = Array.isArray(raw.diceResult)
    ? raw.diceResult.map(Number)
    : Number.isFinite(Number(raw.rawRoll)) ? [Number(raw.rawRoll)] : [];
  const rollSum = rolls.reduce((sum, value) => sum + value, 0);
  const total = Number(raw.rawDamage ?? raw.total ?? raw.tempHp ?? rollSum);
  const modifier = type === 'damage' || type === 'healing'
    ? total - rollSum
    : Number(raw.modifier ?? 0);
  const formulaBase = String(raw.dice ?? (type === 'attack' || type === 'saving_throw' || type === 'story_check' ? '1d20' : ''));
  const formula = modifier && !/[+-]\d+$/i.test(formulaBase.replace(/\s/g, ''))
    ? `${formulaBase}${modifier > 0 ? '+' : ''}${modifier}`
    : formulaBase;
  const success = raw.result === 'hit' || raw.result === 'critical' || raw.result === 'success';
  return createDiceEvent({
    rollId: String(raw.rollId ?? raw.eventId ?? `${raw.type}-${raw.actorId ?? 'system'}-${raw.targetId ?? 'none'}`),
    type,
    formula,
    diceSides: formulaSides(formulaBase),
    rolls,
    modifier,
    total,
    actorId: raw.actorId,
    actorName: raw.actorName ?? eventName(result, raw.actorId),
    targetId: raw.targetId,
    targetName: raw.targetName ?? eventName(result, raw.targetId),
    skillId: raw.skillId,
    skillName: raw.skillName ?? String(result.battleState.skills[raw.skillId]?.name ?? ''),
    dc: raw.dc,
    ac: raw.targetDefense,
    success: ['attack', 'saving_throw', 'story_check'].includes(type) ? success : undefined,
    outcome: ['attack', 'saving_throw', 'story_check'].includes(type) ? outcome(rolls[0] ?? 0, success) : undefined,
    source: 'battle_engine',
    createdAt: isoTime(raw.createdAt),
    metadata: { battleEventType: raw.type, hpDamage: raw.hpDamage, targetHp: raw.targetHp },
  });
}

export function authoritativeDice(result: AuthoritativeBattleResult, kind: 'attack' | 'check' | 'damage'): DiceResult | null {
  const attack = result.events.find((event) => event.type === 'attack_roll');
  const check = result.events.find((event) => event.type === 'saving_throw' || event.type === 'skill_check');
  const damage = result.events.find((event) => ['damage', 'healing', 'buff'].includes(event.type));
  if (kind === 'attack' && attack) {
    const event = canonicalEvent(result, attack, 'attack');
    const skillRecord = (result.battleState.skills[attack.skillId] || {}) as Record<string, any>;
    const abilityLabel = String(skillRecord.hitAbilityLabel || '');
    const abilityBonus = Number(skillRecord.hitAbilityBonus ?? 0);
    const proficiencyBonus = Number(skillRecord.proficiencyBonus ?? 0) + Number(skillRecord.openingHitBonus ?? 0);
    return {
      type: 'attack_roll',
      event,
      data: {
        骰子: 'D20', 掷骰: `D20=${event.rolls[0]}`, 攻击掷骰: `D20=${event.rolls[0]}`, 基础骰: event.rolls[0],
        加值: event.modifier, 属性加值: abilityBonus, 熟练加值: proficiencyBonus, 六维: abilityLabel,
        属性: abilityLabel ? `${abilityLabel}命中` : '命中判定',
        总计: event.total, AC: event.ac, 目标AC: event.ac, 命中: event.success,
      },
    };
  }
  if (kind === 'check' && check) {
    const event = canonicalEvent(result, check, check.type === 'saving_throw' ? 'saving_throw' : 'story_check');
    return {
      type: 'skill_check',
      event,
      data: {
        骰子: 'D20', 掷骰: `D20=${event.rolls[0]}`, 加值: event.modifier,
        总计: event.total, DC: event.dc, 成功: event.success,
      },
    };
  }
  if (kind === 'damage' && damage) {
    if (damage.type === 'buff' && !Array.isArray(damage.diceResult)) return null;
    const eventType: DiceEventType = damage.type === 'healing' ? 'healing' : 'damage';
    const event = canonicalEvent(result, damage, eventType);
    const criticalMultiplier = Number((damage as any).criticalMultiplier ?? event.metadata?.criticalMultiplier ?? 1);
    return {
      type: eventType,
      event,
      data: {
        骰子: `D${event.diceSides}`, 公式: event.formula, 掷骰: event.rolls.join(' + '), 骰组: event.rolls,
        全部掷骰: event.rolls, 骰数: event.rolls.length, 骰面: `d${event.diceSides}`,
        加值: event.modifier, 总计: event.total, 点数: event.rolls.reduce((sum, value) => sum + value, 0),
        属性: eventType === 'healing' ? '治疗结算' : '伤害结算',
        大成功效果翻倍: criticalMultiplier > 1,
        大成功倍率: criticalMultiplier,
      },
    };
  }
  return null;
}

export function authoritativeEffect(
  result: AuthoritativeBattleResult,
  actor: BattleUnit,
  target: BattleUnit,
  skill: BattleSkill,
) {
  const attack = result.events.find((event) => event.type === 'attack_roll');
  const damages = result.events.filter((event) => event.type === 'damage');
  const healing = result.events.find((event) => event.type === 'healing');
  const buff = result.events.find((event) => event.type === 'buff');
  const check = result.events.find((event) => event.type === 'saving_throw' || event.type === 'skill_check');
  const missed = attack?.result === 'miss' || check?.result === 'failure' && check?.type === 'skill_check';
  const primaryDamage = damages.find((event) => event.targetId === target.id) ?? damages[0];
  const amount = Number(primaryDamage?.rawDamage ?? healing?.total ?? buff?.tempHp ?? 0);
  const isDefense = isDefenseSkill(skill);
  const title = missed ? (attack ? '攻击未命中' : '检定失败') : healing ? '治疗生效' : isDefense ? '防御就绪' : buff ? '增益生效' : damages.length ? '攻击命中' : '技能生效';
  const resultLine = attack
    ? `D20 ${attack.rawRoll} + ${attack.modifier} = ${attack.total} / AC ${attack.targetDefense}`
    : primaryDamage
      ? `${primaryDamage.dice}：${(primaryDamage.diceResult ?? []).join(' + ')} = ${primaryDamage.rawDamage}`
      : healing
        ? `${healing.dice}：${(healing.diceResult ?? []).join(' + ')} = ${healing.total}`
        : isDefense
          ? '下一次受到伤害降低50%'
          : '规则引擎已结算';
  return {
    id: Date.now(),
    actorName: actor.name,
    targetName: target.name,
    skillName: skill.name,
    title,
    formula: skill.formula,
    resultLine,
    detail: missed ? '未命中，不造成伤害。' : isDefense ? '进入防御姿态，下一次受到伤害降低50%。' : `规则引擎最终结算：${amount}`,
    narration: missed ? `${actor.name}的${skill.name}没有命中${target.name}。` : isDefense ? `${actor.name}进入防御姿态，护盾会抵消下一次伤害的一半。` : `${actor.name}对${target.name}使用${skill.name}，结算 ${amount} 点效果。`,
    amount,
    success: !missed,
  };
}
