import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dice3DView, type DieType } from "./DiceRollOverlay";
import type { DiceResult } from "../types/game";
import { fetchBattleNarration, type AuthoritativeBattleResult } from "../services/api";
import { authoritativeAmountByTarget, authoritativeDice, authoritativeEffect, authoritativeHp, authoritativeInitiative, toAuthoritativeBattlePayload } from "../core/battle/authoritativeAdapter";
import { dispatchGameAction } from "../core/actions/registry";
import "../core/actions/battleResolver";
import { rollDiceEvent } from "../core/dice/createDiceEvent";
import { BattleActionBar } from "../features/battle/BattleActionBar";
import { battleController } from "../features/battle/BattleController";
import { BattleDiceBinding } from "../features/battle/BattleDiceBinding";
import { BACKGROUND_URL, getBattleConfig, SIMPLE_BATTLE_UNITS } from "../features/battle/battleDebugConfig";
import { BattleEffectPanel } from "../features/battle/BattleEffectPanel";
import { BattleField } from "../features/battle/BattleField";
import { BattleLogPanel } from "../features/battle/BattleLogPanel";
import { BattleResultPanel } from "../features/battle/BattleResultPanel";
import { BattleUnitDetailModal } from "../features/battle/BattleUnitDetailModal";
import { RosterPanel } from "../features/battle/RosterPanel";
import { BattleTutorialIntro as BattleTutorialIntroView } from "../features/battle/BattleTutorialIntro";
import { createBattleViewModel } from "../features/battle/BattleViewModel";

const BATTLE_BGM_TRACK = "/assets/bgm/bgm_05_battle_general.mp3";
const BGM_TRACK_EVENT = "dnd-bgm-track";

export interface BattleResult {
  outcome: "win" | "lose";
}

/* ===== 战斗头像映射（Q版截取，52×52） ===== */
const AVATAR_MAP: Record<string, string> = {
  adventurer: '/assets/chibi/adventurer/avatar.png',
  selin: '/assets/chibi/selin/avatar.png',
  senluo: '/assets/chibi/senluo/avatar.png',
  ailin: '/assets/chibi/ailin/avatar.png',
  kelaiya: '/assets/chibi/kelaiya/avatar.png',
  crawler: '/assets/chibi/crawler/avatar.png',
};

/* ===== Q版战斗精灵图映射 ===== */
const SPRITE_SHEET_MAP: Record<string, string> = {
  adventurer: '/assets/chibi/adventurer/adventurer_chibi_spritesheet.png',
  selin: '/assets/chibi/selin/selin_chibi_spritesheet.png',
  senluo: '/assets/chibi/senluo/senluo_chibi_spritesheet.png',
  ailin: '/assets/chibi/ailin/ailin_chibi_spritesheet.png',
  kelaiya: '/assets/chibi/kelaiya/kelaiya_chibi_spritesheet.png',
  crawler: '/assets/chibi/crawler/crawler_chibi_spritesheet.png',
};

interface BattleTestScreenProps {
  gameId?: string;
  encounterId?: string;
  onBack?: () => void;
  mode?: "test" | "tutorial" | "side-event";
  onComplete?: (result?: BattleResult) => void;
  onSkip?: () => void;
  openingEffects?: BattleOpeningEffect[];
  battleConfigOverride?: BattleConfig;
}

export type Faction = "ally" | "enemy";
export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";
export type BattleResource = "战斗技能" | "移动" | "动作" | "附赠动作" | "自由互动" | "反应";
type BattlePhase = "initiative" | "battle";
export type RollKind = "attack" | "ability" | "save" | "healing" | "damage" | "none";

export interface SkillRollSpec {
  kind: RollKind;
  ability?: AbilityKey;
  dieType?: DieType;
  diceCount?: number;
  bonus?: number;
  dc?: number;
  targetAc?: number;
  targetSaveBonus?: number;
  label?: string;
}

export interface BattleSkill {
  id: string;
  name: string;
  resource: BattleResource;
  source: "职业技能" | "队友技能" | "敌方技能" | "基础动作";
  formula: string;
  effect: string;
  cooldown: string;
  rule: string;
  roll: SkillRollSpec;
  tags: string[];
  primaryTargetBonus?: number;
  trigger?: string;
  locked?: boolean;
}

export interface NonCombatSkill {
  name: string;
  check: string;
  effect: string;
}

export type BattleModelKey = "adventurer" | "grum" | "lisa" | "talia" | "templar" | "shade" | "selin" | "crawler" | "senluo" | "ailin" | "kelaiya";
type BattleFxKind = "slash" | "bash" | "pierce" | "fire" | "ice" | "lightning" | "arcane" | "radiant" | "heal" | "fail" | "poison" | "shadow" | "wind" | "earth" | "water" | "shield" | "buff" | "debuff" | "critical";

export interface BattleUnit {
  id: string;
  name: string;
  faction: Faction;
  role: string;
  portrait: string;
  model: BattleModelKey;
  hp: number;
  maxHp: number;
  ac: number;
  speed: number;
  proficiency: number;
  abilities: Record<AbilityKey, number>;
  initiativeBonus?: number;
  weaponMastery?: string;
  resourceProfile: string[];
  statuses: string[];
  traits: string[];
  skills: BattleSkill[];
  nonCombatSkills: NonCombatSkill[];
}

interface InitiativeEntry {
  unitId: string;
  roll: number;
  dexMod: number;
  otherBonus: number;
  total: number;
}

interface TargetSelection {
  unitId: string;
  skillId: string;
}

interface BattleAnimationCue {
  id: number;
  actorId: string;
  targetId: string;
  targetIds: string[];
  skillId: string;
  effectKind: BattleFxKind;
  feedback?: {
    text: string;
    tone: "damage" | "heal" | "miss" | "effect";
  };
  feedbackByTargetId?: Record<string, { text: string; tone: "damage" | "heal" | "miss" | "effect" }>;
}

interface BattleEffect {
  id: number;
  actorName: string;
  targetName: string;
  skillName: string;
  title: string;
  formula: string;
  resultLine: string;
  detail: string;
  narration: string;
  amount?: number;
  success?: boolean;
}

interface PendingSettlement {
  unit: BattleUnit;
  target: BattleUnit;
  skill: BattleSkill;
  effect: BattleEffect;
  isEnemy?: boolean;
}

interface AiTactic {
  actorId: string;
  skillId: string;
  targetIds: string[];
  headline: string;
  reason: string;
  confidence: number;
  intent: "finish" | "pressure" | "protect" | "heal" | "control";
}

interface BattleTutorialCardProps {
  intro: NonNullable<BattleConfig["tutorialIntro"]>;
  step: number;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}

export interface BattleOpeningEffect {
  unitId: string;
  hpDelta?: number;
  acDelta?: number;
  statuses?: string[];
  traits?: string[];
  log: string;
}

export interface QuickRule {
  title: string;
  text: string;
}

export interface TutorialIntroStep {
  title: string;
  text: string;
}

export interface TutorialEnemySkillBrief {
  name: string;
  skills: string[];
}

export interface BattleConfig {
  units: BattleUnit[];
  quickRules: QuickRule[];
  eyebrow: string;
  title: string;
  backgroundUrl?: string;
  subtitle: string;
  backLabel: string;
  rerollLog: string;
  initialLog: string;
  initiativeNote: string;
  winTitle: string;
  loseTitle: string;
  winText: string;
  loseText: string;
  completeLabel?: string;
  tutorialIntro?: {
    title: string;
    subtitle: string;
    steps: TutorialIntroStep[];
    enemySkills: TutorialEnemySkillBrief[];
  };
}

const ABILITY_LABELS: Array<[AbilityKey, string]> = [
  ["str", "力量"],
  ["dex", "敏捷"],
  ["con", "体质"],
  ["int", "智力"],
  ["wis", "感知"],
  ["cha", "魅力"],
];

const BATTLE_TUNING = {
  allyHitBonus: 2,
  allySaveDcBonus: 1,
  allyDamageMultiplier: 1,
  enemyDamageMultiplier: 1,
  allyGrazeDamage: 0,
  enemyGrazeDamage: 0,
  enemyRollDelayMs: 520,
  enemyEndDelayMs: 3300,
};

function applyOpeningEffectsToUnits(units: BattleUnit[], effects: BattleOpeningEffect[] = []) {
  if (!effects.length) return units;

  return units.map((unit) => {
    const unitEffects = effects.filter((effect) => effect.unitId === unit.id);
    if (!unitEffects.length) return unit;

    const hpDelta = unitEffects.reduce((sum, effect) => sum + (effect.hpDelta ?? 0), 0);
    const acDelta = unitEffects.reduce((sum, effect) => sum + (effect.acDelta ?? 0), 0);
    const statuses = unitEffects.flatMap((effect) => effect.statuses ?? []);
    const traits = unitEffects.flatMap((effect) => effect.traits ?? []);
    const nextHp = Math.max(1, Math.min(unit.maxHp, unit.hp + hpDelta));
    const nextAc = Math.max(6, unit.ac + acDelta);

    // 开局先攻减值
    const initDebuff = unitEffects.reduce((sum, effect) => sum + ((effect as any).initDebuff ?? 0), 0);
    // 开局攻击/命中加值
    const atkBonus = unitEffects.reduce((sum, effect) => sum + ((effect as any).atkBonus ?? 0), 0);
    const hitBonus = unitEffects.reduce((sum, effect) => sum + ((effect as any).hitBonus ?? 0), 0);

    return {
      ...unit,
      hp: nextHp,
      ac: nextAc,
      statuses: [...unit.statuses, ...statuses],
      traits: [...unit.traits, ...traits],
      initiativeBonus: (unit.initiativeBonus ?? 0) + initDebuff,
      openingAtkBonus: atkBonus,
      openingHitBonus: hitBonus,
    };
  });
}

function abilityModifier(score: number) {
  return Math.floor((score - 10) / 2);
}

function formatModifier(value: number) {
  return value >= 0 ? `+${value}` : String(value);
}

/** 将文本中 XdY 格式的骰子标记加粗 */
function boldifyDiceNotation(text: string): React.ReactNode[] {
  const parts = text.split(/(\d+d\d+)/gi);
  return parts.map((part, i) =>
    /^\d+d\d+$/i.test(part) ? <b key={i}>{part}</b> : part
  );
}
const DAMAGE_TYPE_WORDS_RE = /\s*(挥砍|钝击|穿刺|毒素|火焰|冷冻|寒冷|力场|立场|光耀|暗影|黯蚀|奥术|雷电|闪电|酸蚀|心灵|坏死|辐射)\s*/g;
const DAMAGE_TYPE_TAG_RE = /^(挥砍|钝击|穿刺|毒素|火焰|冷冻|寒冷|力场|立场|光耀|暗影|黯蚀|奥术|雷电|闪电|酸蚀|心灵|坏死|辐射)$/;

function stripDamageTypeWords(text: string) {
  return text
    .replace(DAMAGE_TYPE_WORDS_RE, " ")
    .replace(/\s*([；;，,。])\s*/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function formatDiceNotation(text: string) {
  return stripDamageTypeWords(text).replace(/(\d*)d(\d+)/gi, (_match, count, sides) => `${count || 1}D${sides}`);
}

function formatCombatTextForPlayer(text: string) {
  return formatDiceNotation(text)
    .replace(/受\s*\/\s*龙火克制/g, "弱点明显")
    .replace(/受龙火克制/g, "弱点明显")
    .replace(/敌伤降低|敌人伤害降低|敌方伤害降低/g, "教学保护")
    .replace(/Graze/g, "未命中不造成伤害")
    .replace(/未命中仍可用[^，。；;]*/g, "未命中不造成伤害");
}

function formatSkillFormulaForPlayer(skill: BattleSkill) {
  return formatDiceNotation(skill.formula);
}

function formatSkillEffectForPlayer(skill: BattleSkill) {
  return stripDamageTypeWords(skill.effect)
    .replace(/未命中也可能触发擦伤压制。?/g, "未命中则行动结束。")
    .replace(/未命中也可能造成\s*\d+\s*点擦伤压制。?/g, "未命中则行动结束。")
    .replace(/裂隙爬兽怕光，?/g, "");
}

function formatDamageFormulaForPlayer(formula: string) {
  const damagePart = formula.split(/；|;/)[1] ?? formula;
  const match = damagePart.match(/(\d*)d(\d+)(?:\s*[+＋]\s*(\d+))?/i);
  if (!match) return formatDiceNotation(damagePart);
  const count = match[1] || "1";
  const bonus = match[3] ? `+${match[3]}` : "";
  return `${count}D${match[2]}${bonus}`;
}

function visibleSkillTags(skill: BattleSkill) {
  return skill.tags.filter((tag) => !DAMAGE_TYPE_TAG_RE.test(tag));
}

function rollDie(sides: number) {
  return rollDiceEvent('test', 'test', sides, 1, 0, { metadata: { deprecatedFallback: true } }).rolls[0];
}

function rollD20() {
  return rollDie(20);
}

function sidesFromDieType(dieType: DieType) {
  return Number(dieType.replace("d", ""));
}

function buildInitiative(units: BattleUnit[]): InitiativeEntry[] {
  return units.map((unit) => {
    const dexMod = abilityModifier(unit.abilities.dex);
    const otherBonus = unit.initiativeBonus ?? 0;
    const roll = rollD20();

    return {
      unitId: unit.id,
      roll,
      dexMod,
      otherBonus,
      total: roll + dexMod + otherBonus,
    };
  });
}

function sortInitiative(entries: InitiativeEntry[], unitMap: Map<string, BattleUnit>, unitOrder: BattleUnit[] = SIMPLE_BATTLE_UNITS) {
  return [...entries].sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    if (b.dexMod !== a.dexMod) return b.dexMod - a.dexMod;

    const unitA = unitMap.get(a.unitId);
    const unitB = unitMap.get(b.unitId);
    if (unitA?.faction !== unitB?.faction) return unitA?.faction === "ally" ? -1 : 1;
    const indexA = unitOrder.findIndex((unit) => unit.id === a.unitId);
    const indexB = unitOrder.findIndex((unit) => unit.id === b.unitId);
    return (indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA) - (indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB);
  });
}

function getHpPercent(unit: BattleUnit) {
  return Math.max(0, Math.min(100, (unit.hp / Math.max(unit.maxHp, 1)) * 100));
}

function skillNeedsRoll(skill: BattleSkill) {
  return skill.roll.kind !== "none";
}

function resourceIsSpent(resource: BattleResource, usedResources: Partial<Record<BattleResource, boolean>>) {
  return Boolean(usedResources[resource]);
}

function skillTargetHint(skill: BattleSkill) {
  if (skill.roll.kind === "healing") return "选择恢复对象";
  if (skill.tags.some((tag) => ["临时HP", "隐形", "抗性"].includes(tag))) return "选择自身或受益者";
  if (skill.tags.some((tag) => ["范围", "群体"].includes(tag))) return "选择范围中心或主要目标";
  if (skill.roll.kind === "none" && skill.trigger) return "选择预设保护对象";
  return "选择释放目标";
}

function getTargetCandidates(unit: BattleUnit, skill: BattleSkill, allies: BattleUnit[], enemies: BattleUnit[]) {
  const livingAllies = allies.filter((target) => target.hp > 0);
  const livingEnemies = enemies.filter((target) => target.hp > 0);

  if (skill.name === "回气" || skill.name === "烟中恶鬼") return [unit];
  if (skill.tags.some((tag) => ["临时HP", "增益", "祝福", "护盾"].includes(tag))) return livingAllies.length ? livingAllies : allies;
  if (skill.roll.kind === "healing") return livingAllies.length ? livingAllies : allies;
  if (skill.roll.kind === "none" && skill.tags.some((tag) => ["护卫", "抗性", "减伤"].includes(tag))) return livingAllies.length ? livingAllies : allies;
  if (unit.faction === "ally") return livingEnemies;
  return livingAllies;
}

/** 从技能公式中解析伤害骰并实际掷出，返回各骰结果 */
function isHealingSkill(skill: BattleSkill) {
  return skill.roll.kind === "healing" || /治疗|恢复/.test(skill.name + skill.formula);
}

function isDamagingAction(actor: BattleUnit, target: BattleUnit, skill: BattleSkill) {
  return actor.faction !== target.faction && !isHealingSkill(skill) && !skill.tags.includes("临时HP");
}

function isGroupDamageSkill(skill: BattleSkill) {
  const text = `${skill.name} ${skill.formula} ${skill.effect} ${skill.rule} ${skill.tags.join(" ")}`;
  return /范围|群体|全体|锥形/.test(text);
}

function hpRatio(unit: BattleUnit) {
  return unit.hp / Math.max(unit.maxHp, 1);
}

function estimateSkillAmount(skill: BattleSkill) {
  const matches = [...skill.formula.matchAll(/(\d*)d(\d+)(?:\s*[+＋]\s*(\d+))?/gi)];
  if (matches.length) {
    return Math.round(matches.reduce((sum, match) => {
      const count = Number(match[1] || 1);
      const sides = Number(match[2]);
      const bonus = Number(match[3] || 0);
      return sum + count * ((sides + 1) / 2) + bonus;
    }, 0));
  }
  return 4;
}

function isProtectiveSkill(skill: BattleSkill) {
  const text = `${skill.name} ${skill.effect} ${skill.tags.join(" ")}`;
  return /护|盾|祝福|临时HP|增益|格挡|守护/.test(text);
}

function isControlSkill(skill: BattleSkill) {
  const text = `${skill.name} ${skill.effect} ${skill.tags.join(" ")}`;
  return /倒地|束缚|减速|压制|毒|眩晕|劣势|干扰|控制/.test(text);
}

function describeIntent(intent: AiTactic["intent"]) {
  if (intent === "finish") return "收割";
  if (intent === "heal") return "急救";
  if (intent === "protect") return "保护";
  if (intent === "control") return "控制";
  return "压制";
}

function chooseAiTactic(
  actor: BattleUnit,
  allies: BattleUnit[],
  enemies: BattleUnit[],
  used: Partial<Record<BattleResource, boolean>> = {},
  lastEnemySkillByUnit: Record<string, string> = {},
): AiTactic | null {
  if (actor.hp <= 0) return null;

  const livingAllies = allies.filter((unit) => unit.hp > 0);
  const livingEnemies = enemies.filter((unit) => unit.hp > 0);
  const legalSkills = actor.skills.filter((skill) => !skill.locked && !resourceIsSpent(skill.resource, used));
  let best: (AiTactic & { score: number }) | null = null;

  for (const skill of legalSkills) {
    const targets = getTargetCandidates(actor, skill, allies, enemies).filter((unit) => unit.hp > 0);
    if (!targets.length) continue;

    for (const target of targets) {
      const ratio = hpRatio(target);
      const amount = estimateSkillAmount(skill);
      let score = 20;
      let intent: AiTactic["intent"] = "pressure";
      let reason = "";

      if (isHealingSkill(skill)) {
        if (target.faction !== actor.faction) continue;
        score = Math.round((1 - ratio) * 100);
        intent = "heal";
        reason = `${target.name} 生命低于 ${Math.round(ratio * 100)}%，优先把队伍从危险线拉回来。`;
        if (ratio < 0.35) score += 34;
        if (target.id === actor.id) score -= 8;
      } else if (isProtectiveSkill(skill) && target.faction === actor.faction) {
        score = 54 + Math.round((1 - ratio) * 28);
        intent = "protect";
        reason = `${target.name} 承压较高，防护能让下一轮容错更稳。`;
        if (/前排|护卫/.test(target.statuses.join(" "))) score += 8;
      } else if (actor.faction !== target.faction) {
        const killWindow = target.hp <= amount + 2;
        const hitEase = Math.max(0, 18 - target.ac);
        score = 35 + Math.round((1 - ratio) * 35) + hitEase;
        if (killWindow) {
          score += 40;
          intent = "finish";
          reason = `${target.name} 剩余 HP${target.hp}，${skill.name} 有机会直接清掉一个行动点。`;
        } else if (isGroupDamageSkill(skill) && (actor.faction === "ally" ? livingEnemies : livingAllies).length >= 2) {
          score += 18;
          intent = "pressure";
          reason = `${skill.name} 可以压到多个目标，适合削弱整条战线。`;
          // 连续使用同一技能扣分，鼓励穿插其他技能
          if (actor.faction === "enemy" && lastEnemySkillByUnit[actor.id] === skill.id) {
            score -= 25;
            reason += "（刚用过，换其他技能更好）";
          }
        } else if (isControlSkill(skill)) {
          score += 16;
          intent = "control";
          reason = `${target.name} 仍有威胁，先用控制/干扰降低下一轮压力。`;
        } else {
          reason = `${target.name} 当前血线和 AC 都适合作为集火目标。`;
        }
      } else {
        continue;
      }

      if (actor.faction === "enemy" && target.ac <= 15) score += 8;
      if (actor.faction === "ally" && target.hp === Math.min(...livingEnemies.map((unit) => unit.hp))) score += 6;

      const tactic = {
        actorId: actor.id,
        skillId: skill.id,
        targetIds: [target.id],
        headline: `${actor.name}：${describeIntent(intent)} / ${skill.name}`,
        reason,
        confidence: Math.max(54, Math.min(96, score)),
        intent,
        score,
      };
      if (!best || tactic.score > best.score) best = tactic;
    }
  }

  if (!best) return null;
  const { score: _score, ...tactic } = best;
  return tactic;
}

function skillNameToFxKind(name: string): string {
  const m: [RegExp, string][] = [
    // 治疗
    [/回气|治疗|愈合|恢复|修复|炖汤|heal|cure|restore/i, "heal"],
    // 火焰
    [/火|炎|燃|灼|辣椒|flare|burn|flame/i, "fire"],
    // 冰霜
    [/冰|霜|冻|cold|frost|freeze/i, "ice"],
    // 雷电
    [/雷|电|闪|lightning|shock|thunder/i, "lightning"],
    // 光耀
    [/光|圣|耀|银钟|radiant|holy/i, "radiant"],
    // 毒素
    [/毒|孢尘|poison|venom|toxic/i, "poison"],
    // 暗影
    [/暗|影|shadow|dark|necrotic/i, "shadow"],
    // 风
    [/风|箭雨|wind|gale|tempest/i, "wind"],
    // 钝击
    [/钝|锤|锅|压制|bash|bludgeon|mace|hammer/i, "bash"],
    // 穿刺
    [/刺|穿|射击|pierce|stab|rapier/i, "pierce"],
    // 挥砍
    [/挥|砍|斩|爪|剑|斧|slash|cleave|sword|axe/i, "slash"],
    // 护盾/防御
    [/盾|护|格挡|guard|block|ward|shield/i, "shield"],
    // 增益/祝福
    [/祝福|增益|强化|印记|buff|bless/i, "buff"],
    // 诅咒/减益
    [/诅咒|减益|debuff|curse/i, "debuff"],
    // 奥术/魔法
    [/奥|秘|魔|牵引|arcane|spell|magic/i, "arcane"],
  ];
  for (const [re, kind] of m) {
    if (re.test(name)) return kind;
  }
  return "slash";
}

function getBattleFxKind(unit: BattleUnit, skill: BattleSkill): BattleFxKind {
  if (skill.roll.kind === "healing") return "heal";

  const byId: Record<string, BattleFxKind> = {
    F1: "slash",
    F2: "shield",
    F3: "heal",
    F4: "debuff",
    F5: "shield",
    F6: "slash",
    F7: "earth",
    T1: "slash",
    T2: "shield",
    T3: "heal",
    GM1: "bash",
    GM2: "shield",
    GM3: "shield",
    GM4: "earth",
    LS1: "shadow",
    LS2: "shadow",
    LS3: "poison",
    LS4: "poison",
    TL1: "fire",
    TL2: "shield",
    TL3: "lightning",
    TL4: "arcane",
    TL5: "radiant",
    ET1: "slash",
    ET2: "fire",
    ET3: "debuff",
    ET4: "shadow",
    EA1: "shadow",
    EA2: "poison",
    EA3: "arcane",
    EB1: "arcane",
    EB2: "shadow",
    EB3: "poison",
    TA1: "slash",
    TA2: "shield",
    TA3: "heal",
    SE1: "radiant",
    SE2: "arcane",
    SE3: "heal",
    S1: "radiant",
    S2: "arcane",
    S3: "heal",
    SN1: "bash",
    SN2: "heal",
    SN3: "fire",
    AL1: "heal",
    AL2: "buff",
    AL3: "shield",
    KL1: "shadow",
    KL2: "debuff",
    KL3: "shadow",
    CA1: "slash",
    CA2: "poison",
    CA3: "fail",
    CB1: "poison",
    CB2: "slash",
    CB3: "fail",
    CC1: "slash",
    CC2: "poison",
    CC3: "fail",
    CR1A: "slash",
    CR2A: "poison",
    CR3A: "fail",
    CR1B: "slash",
    CR2B: "poison",
    CR3B: "fail",
    CR1C: "slash",
    CR2C: "poison",
    CR3C: "fail",
  };

  const idMatch = byId[skill.id];
  if (idMatch) return idMatch;

  if (skill.roll.kind === "none") {
    if (unit.model === "ailin") return "shield";
    return "buff";
  }

  switch (unit.model) {
    case "selin":
      return "arcane";
    case "senluo":
    case "grum":
      return "bash";
    case "ailin":
      return "radiant";
    case "kelaiya":
    case "lisa":
      return "shadow";
    case "crawler":
      return "poison";
    case "talia":
      return "fire";
    case "templar":
      return "slash";
    case "shade":
      return "shadow";
    default:
      return skillNameToFxKind(skill.name) as BattleFxKind;
  }
}

export function BattleTestScreen({
  gameId,
  encounterId,
  onBack,
  mode = "test",
  onComplete,
  onSkip,
  openingEffects = [],
  battleConfigOverride,
}: BattleTestScreenProps) {
  const config = useMemo(() => battleConfigOverride ?? getBattleConfig(mode), [battleConfigOverride, mode]);
  const battleBaseUnits = useMemo(() => applyOpeningEffectsToUnits(config.units, openingEffects), [config.units, openingEffects]);
  const openingLogLines = useMemo(() => openingEffects.map((effect) => effect.log), [openingEffects]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(BGM_TRACK_EVENT, { detail: BATTLE_BGM_TRACK }));
    return () => {
      window.dispatchEvent(new CustomEvent(BGM_TRACK_EVENT, { detail: '' }));
    };
  }, []);

  const [initiative, setInitiative] = useState<InitiativeEntry[]>([]);
  const [phase, setPhase] = useState<BattlePhase>("initiative");
  const [rollRunId] = useState(1);
  const [turnIndex, setTurnIndex] = useState(0);
  const [unitHp, setUnitHp] = useState(() => Object.fromEntries(battleBaseUnits.map((unit) => [unit.id, unit.hp])));
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [actionUnitId, setActionUnitId] = useState<string | null>(null);
  const [targetSelection, setTargetSelection] = useState<TargetSelection | null>(null);
  const [activeDice, setActiveDice] = useState<DiceResult | null>(null);
  const [attackPhase, setAttackPhase] = useState<"d20" | "save" | "damage" | null>(null);
  const pendingAttackRef = useRef<{ unit: BattleUnit; target: BattleUnit; skill: BattleSkill; hit: boolean; isEnemy?: boolean } | null>(null);
  const [advantage, setAdvantage] = useState<{ type: "advantage" | "disadvantage"; reason: string } | null>(null);
  const [lastEffect, setLastEffect] = useState<BattleEffect | null>(null);
  const [kpReportPending, setKpReportPending] = useState(false);
  const kpReportEffectIdRef = useRef<number | null>(null);
  const [pendingSettlement, setPendingSettlement] = useState<PendingSettlement | null>(null);
  const [battleAnimation, setBattleAnimation] = useState<BattleAnimationCue | null>(null);
  const enemyActingKeyRef = useRef<string | null>(null);
  const lastEnemySkillRef = useRef<Record<string, string>>({}); // 防敌人技能连发
  const [enemyTurnDone, setEnemyTurnDone] = useState(false);
  const [tacticalAdvice, setTacticalAdvice] = useState<AiTactic | null>(null);
  const battleAnimationTimerRef = useRef<number | null>(null);
  const [usedResources, setUsedResources] = useState<Record<string, Partial<Record<BattleResource, boolean>>>>({});
  const [battleLog, setBattleLog] = useState<string[]>([...openingLogLines, config.initialLog].slice(0, 4));
  const [showTutorialIntro, setShowTutorialIntro] = useState(() => Boolean(config.tutorialIntro));
  const [tutorialIntroStep, setTutorialIntroStep] = useState(0);
  const [initiativeAutoStartToken, setInitiativeAutoStartToken] = useState(0);
  const [showQuickRules, setShowQuickRules] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(-2);
  const [tutorialHint, setTutorialHint] = useState<string | null>(null);
  const [authoritativeBattle, setAuthoritativeBattle] = useState<AuthoritativeBattleResult | null>(null);
  const [authorityError, setAuthorityError] = useState<string | null>(null);
  const authorityPendingRef = useRef<AuthoritativeBattleResult | null>(null);
  const authorityDamageDiceRef = useRef<DiceResult | null>(null);
  const authorityEffectRef = useRef<BattleEffect | null>(null);
  const authorityBusyRef = useRef(false);
  const tutorialHintTimerRef = useRef<number | null>(null);

  const showTutorialHint = useCallback((text: string, durationMs = 5000) => {
    if (tutorialHintTimerRef.current) window.clearTimeout(tutorialHintTimerRef.current);
    setTutorialHint(text);
    tutorialHintTimerRef.current = window.setTimeout(() => setTutorialHint(null), durationMs);
  }, []);

  // 教学步骤推进
  const advanceTutorialStep = useCallback((step: number) => {
    if (mode !== "tutorial") return;
    setTutorialStep((current) => (step > current ? step : current));
  }, [mode]);

  const battleUnits = useMemo(
    () =>
      battleBaseUnits.map((unit) => ({
        ...unit,
        hp: Math.max(0, Math.min(unit.maxHp, unitHp[unit.id] ?? unit.hp)),
      })),
    [battleBaseUnits, unitHp],
  );
  const unitMap = useMemo(() => new Map(battleUnits.map((unit) => [unit.id, unit])), [battleUnits]);
  const orderedInitiative = initiative;
  const activeEntry = orderedInitiative[turnIndex % orderedInitiative.length];
  const activeUnit = activeEntry ? unitMap.get(activeEntry.unitId) : undefined;
  const activeUnitId = activeUnit?.id;
  const activeFaction = activeUnit?.faction;
  const selectedUnit = selectedUnitId ? unitMap.get(selectedUnitId) : undefined;
  const actionUnit = actionUnitId ? unitMap.get(actionUnitId) : undefined;
  const allies = useMemo(() => battleUnits.filter((unit) => unit.faction === "ally"), [battleUnits]);
  const enemies = useMemo(() => battleUnits.filter((unit) => unit.faction === "enemy"), [battleUnits]);
  const livingAllies = useMemo(() => allies.filter((unit) => unit.hp > 0), [allies]);
  const livingEnemies = useMemo(() => enemies.filter((unit) => unit.hp > 0), [enemies]);
  const authorityViewModel = useMemo(() => createBattleViewModel(authoritativeBattle), [authoritativeBattle]);
  const battleWon = authorityViewModel.won;
  const battleLost = authorityViewModel.lost;
  const pendingSkill = targetSelection
    ? unitMap.get(targetSelection.unitId)?.skills.find((skill) => skill.id === targetSelection.skillId)
    : undefined;
  const pendingActor = targetSelection ? unitMap.get(targetSelection.unitId) : undefined;
  const pendingTargets = pendingActor && pendingSkill ? getTargetCandidates(pendingActor, pendingSkill, allies, enemies) : [];
  const pendingTargetIds = useMemo(() => new Set(pendingTargets.map((unit) => unit.id)), [pendingTargets]);
  const enemyTurn = phase === "battle" && activeUnit?.faction === "enemy";

  const syncAuthoritativeTurn = useCallback((result: AuthoritativeBattleResult, includeHp = true) => {
    setAuthoritativeBattle(result);
    setInitiative(authoritativeInitiative(result));
    if (includeHp) setUnitHp(authoritativeHp(result));
    const currentId = result.currentActor?.id;
    const nextIndex = result.battleState.initiative.findIndex((entry) => entry.characterId === currentId);
    if (nextIndex >= 0) setTurnIndex(nextIndex);
  }, []);

  const beginAuthoritativeBattle = useCallback(async () => {
    const payload = toAuthoritativeBattlePayload(config, battleBaseUnits);
    try {
      const result = await battleController.start({
        gameId,
        encounterId: encounterId ?? payload.encounterId,
        characters: payload.characters,
        skills: payload.skills,
      });
      syncAuthoritativeTurn(result);
      if (result.battleState.actionLog.length > 0) setPhase("battle");
      setAuthorityError(null);
    } catch (error) {
      setAuthorityError(error instanceof Error ? error.message : "权威战斗引擎连接失败");
    }
  }, [battleBaseUnits, config, encounterId, gameId, syncAuthoritativeTurn]);

  useEffect(() => {
    void beginAuthoritativeBattle();
  }, [beginAuthoritativeBattle]);

  useEffect(() => {
    if (phase !== "battle" || battleWon || battleLost || activeUnit?.faction !== "ally" || !activeUnitId || activeUnit.hp <= 0) return;
    setActionUnitId(activeUnitId);
    setTargetSelection(null);
  }, [activeUnitId, activeUnit?.faction, activeUnit?.hp, battleLost, battleWon, phase]);

  const completeInitiative = useCallback(() => {
    setPhase("battle");
    advanceTutorialStep(0);
    showTutorialHint("战斗为回合制：每回合为角色选择技能→系统结算双方行动→AI主持人描述结果。击败所有敌人即获胜。\n\n📊 看左侧行动条，高亮的是当前行动角色。轮到你时点击下方技能面板选择技能", 10000);
  }, [advanceTutorialStep, showTutorialHint]);

  const startTutorialInitiative = useCallback(() => {
    setShowTutorialIntro(false);
    setInitiativeAutoStartToken((token) => token + 1);
    advanceTutorialStep(-1);
    showTutorialHint('正在投掷行动顺序。结果出现后点击「进入第一回合」。', 4500);
  }, [advanceTutorialStep, showTutorialHint]);

  function pushBattleLog(line: string) {
    setBattleLog((current) => [line, ...current].slice(0, 4));
  }

  function clearBattleAnimation() {
    if (battleAnimationTimerRef.current) {
      window.clearTimeout(battleAnimationTimerRef.current);
      battleAnimationTimerRef.current = null;
    }
    setBattleAnimation(null);
  }

  function buildBattleFeedback(actor: BattleUnit, target: BattleUnit, skill: BattleSkill, effect: BattleEffect): BattleAnimationCue["feedback"] {
    if (effect.success === false || /未命中|失败/.test(effect.title)) {
      return { text: "MISS", tone: "miss" };
    }
    if (typeof effect.amount !== "number") return undefined;
    if (skill.roll.kind === "healing" || actor.faction === target.faction) {
      return { text: `+${effect.amount}`, tone: "heal" };
    }
    if (isDamagingAction(actor, target, skill)) {
      return { text: `-${effect.amount}`, tone: "damage" };
    }
    return { text: String(effect.amount), tone: "effect" };
  }

  function triggerBattleAnimation(unit: BattleUnit, skill: BattleSkill, target: BattleUnit, effect: BattleEffect, impactedTargets: BattleUnit[]) {
    if (battleAnimationTimerRef.current) {
      window.clearTimeout(battleAnimationTimerRef.current);
    }

    const id = Date.now();
    const feedback = buildBattleFeedback(unit, target, skill, effect);
    const effectKind = feedback?.tone === "miss" ? "fail" : getBattleFxKind(unit, skill);
    const targetIds = impactedTargets.length ? impactedTargets.map((item) => item.id) : [target.id];
    const amounts = authorityPendingRef.current ? authoritativeAmountByTarget(authorityPendingRef.current) : {};
    const feedbackByTargetId = Object.fromEntries(impactedTargets.flatMap((item) => {
      const amount = amounts[item.id];
      if (!Number.isFinite(amount)) return [];
      const healing = skill.roll.kind === "healing" || unit.faction === item.faction;
      return [[item.id, { text: `${healing ? "+" : "-"}${amount}`, tone: healing ? "heal" as const : "damage" as const }]];
    }));
    setBattleAnimation({ id, actorId: unit.id, targetId: target.id, targetIds, skillId: skill.id, effectKind, feedback,
      feedbackByTargetId: Object.keys(feedbackByTargetId).length ? feedbackByTargetId : undefined });
    battleAnimationTimerRef.current = window.setTimeout(() => {
      setBattleAnimation((current) => (current?.id === id ? null : current));
      battleAnimationTimerRef.current = null;
    }, effectKind === "heal" || effectKind === "shield" || effectKind === "arcane" || feedback ? 1150 : 860);
  }

  function advanceTurn() {
    const result = authorityPendingRef.current ?? authoritativeBattle;
    if (result) syncAuthoritativeTurn(result);
  }

  function nextTurn() {
    if (kpReportPending) return;
    if (authorityPendingRef.current) {
      syncAuthoritativeTurn(authorityPendingRef.current);
      authorityPendingRef.current = null;
    }
    setActionUnitId(null);
    setTargetSelection(null);
    setUsedResources({});
    setActiveDice(null);
    setPendingSettlement(null);
    setEnemyTurnDone(false);
    setTacticalAdvice(null);
    setLastEffect(null);
    if (settlementTimerRef.current) { window.clearTimeout(settlementTimerRef.current); settlementTimerRef.current = null; }
    clearBattleAnimation();
    enemyActingKeyRef.current = null;
  }

  function handleModelClick(unit: BattleUnit) {
    if (pendingActor && pendingSkill && pendingTargets.some((target) => target.id === unit.id)) {
      resolveAction(pendingActor, pendingSkill, unit);
      return;
    }
    if (unit.id === activeUnit?.id && unit.faction === "ally" && phase === "battle") {
      setActionUnitId(unit.id);
      return;
    }
    setSelectedUnitId(unit.id);
  }

  // 骰子关闭后的结算处理：延迟800ms执行伤害/治疗/特效/播报
  const settlementTimerRef = useRef<number | null>(null);

  function inferOutcome(title: string): string {
    if (title.includes("未命中")) return "miss";
    if (title.includes("命中")) return "hit";
    if (title.includes("擦伤")) return "graze";
    if (title.includes("半效")) return "save-half";
    if (title.includes("豁免失败")) return "save-full";
    if (title.includes("豁免成功")) return "save-half";
    if (title.includes("治疗")) return "heal";
    if (title.includes("检定成功")) return "check";
    if (title.includes("检定失败")) return "miss";
    if (title.includes("触发")) return "trigger";
    if (title.includes("击杀")) return "defeat";
    return "hit";
  }

  function parseResultLine(resultLine: string): { d20Roll: number; d20Total: number; acDc: number } {
    // "D20 14 + 5 = 19 / AC 16" or "D20 8 + 3 = 11 / DC 13"
    const d20 = resultLine.match(/D20\s+(\d+)/);
    const total = resultLine.match(/=\s*(\d+)/);
    const acdc = resultLine.match(/[A-Z]+\s*(\d+)/);
    return {
      d20Roll: d20 ? Number(d20[1]) : 0,
      d20Total: total ? Number(total[1]) : 0,
      acDc: acdc ? Number(acdc[1]) : 0,
    };
  }

  function sanitizeBattleNarration(text: string, fallback: string) {
    let cleaned = String(text || "").replace(/\s+/g, " ").trim();
    if (!cleaned) return fallback;
    if (/炉心守卫者/.test(cleaned)) return fallback;
    cleaned = cleaned.replace(/^KP[:：]\s*/i, "").trim();
    const sentenceEnd = Math.max(
      cleaned.lastIndexOf("。"),
      cleaned.lastIndexOf("！"),
      cleaned.lastIndexOf("？"),
      cleaned.lastIndexOf("."),
      cleaned.lastIndexOf("!"),
      cleaned.lastIndexOf("?"),
    );
    if (sentenceEnd >= 10 && sentenceEnd < cleaned.length - 1) {
      cleaned = cleaned.slice(0, sentenceEnd + 1).trim();
    }
    if (!/[。！？.!?」"]$/.test(cleaned)) return fallback;
    if (/[，、；：:—-]$/.test(cleaned)) return fallback;
    return `KP：${cleaned}`;
  }

  function getResolvedDamageTargets(actor: BattleUnit, target: BattleUnit, skill: BattleSkill) {
    if (!isGroupDamageSkill(skill) || !isDamagingAction(actor, target, skill)) return [target];
    const candidates = actor.faction === "ally" ? livingEnemies : livingAllies;
    return candidates.filter((unit) => unit.hp > 0);
  }

  function isAnimationTarget(unit: BattleUnit) {
    if (!battleAnimation) return false;
    return battleAnimation.targetIds?.includes(unit.id) || battleAnimation.targetId === unit.id;
  }

  function executeSettlement(settlement: PendingSettlement) {
    const { unit, target, skill, effect } = settlement;
    const attackMissed = effect.success === false;
    const impactedTargets = attackMissed ? [target] : getResolvedDamageTargets(unit, target, skill);
    const targetLabel = impactedTargets.length > 1 ? impactedTargets.map((item) => item.name).join("、") : target.name;
    if (authorityPendingRef.current) {
      setUnitHp(authoritativeHp(authorityPendingRef.current));
      setAuthoritativeBattle(authorityPendingRef.current);
    }
    // 群体伤害：本地兜底描述我方全体或敌方全体
    const aoeLabel = impactedTargets.length > 1
      ? (unit.faction === "enemy" ? "我方全体" : "敌方全体")
      : target.name;
    const localNarration = attackMissed
      ? effect.narration
      : impactedTargets.length > 1
      ? skill.primaryTargetBonus
        ? `${unit.name}释放${skill.name}，${aoeLabel}受到 ${(effect.amount ?? 0) - skill.primaryTargetBonus} 点伤害，主目标${target.name}额外受到 ${skill.primaryTargetBonus} 点伤害。`
        : `${unit.name}释放${skill.name}，${aoeLabel}受到 ${effect.amount} 点伤害。`
      : effect.narration;
    const placeholderEffect = { ...effect, narration: "KP记录中…" };
    kpReportEffectIdRef.current = placeholderEffect.id;
    setKpReportPending(true);
    setLastEffect(placeholderEffect);
    triggerBattleAnimation(unit, skill, target, effect, impactedTargets);
    pushBattleLog(`${unit.name} 对 ${targetLabel} 使用 ${skill.name}：${effect.title}`);
    pushBattleLog("KP记录中…");

    // 异步请求 LLM 播报
    const outcome = inferOutcome(effect.title);
    const diceInfo = parseResultLine(effect.resultLine);
    const isAoe = impactedTargets.length > 1;
    fetchBattleNarration({
      actor_name: unit.name,
      target_name: targetLabel,
      skill_name: skill.name,
      outcome,
      amount: effect.amount ?? 0,
      d20_roll: diceInfo.d20Roll,
      d20_total: diceInfo.d20Total,
      damage_label: "",
      tags: visibleSkillTags(skill),
      ac_dc: diceInfo.acDc,
      is_aoe: isAoe,
    }).then(llmNarration => {
      const finalNarration = sanitizeBattleNarration(llmNarration, localNarration);
      if (kpReportEffectIdRef.current !== placeholderEffect.id) return;
      setLastEffect(prev => prev?.id === placeholderEffect.id ? { ...prev, narration: finalNarration } : prev);
      pushBattleLog(finalNarration);
      setKpReportPending(false);
      kpReportEffectIdRef.current = null;
    }).catch(() => {
      if (kpReportEffectIdRef.current !== placeholderEffect.id) return;
      setLastEffect(prev => prev?.id === placeholderEffect.id ? { ...prev, narration: localNarration } : prev);
      pushBattleLog(localNarration);
      setKpReportPending(false);
      kpReportEffectIdRef.current = null;
    });

    if (!settlement.isEnemy) {
      advanceTutorialStep(3);
      if (skill.roll.kind === "healing") {
        showTutorialHint("💚 治疗生效！HP已恢复，查看恢复量", 4000);
      } else if (effect.success) {
        showTutorialHint("⚔️ 命中！仔细观察KP的战斗描写和伤害数值", 4000);
      } else {
        showTutorialHint("💨 未命中！攻击行动结束，不会投掷伤害骰", 4000);
      }
    }
  }

  useEffect(() => {
    if (!pendingSettlement || activeDice) return;
    // 骰子已关闭，延迟800ms结算
    settlementTimerRef.current = window.setTimeout(() => {
      executeSettlement(pendingSettlement);
      if (pendingSettlement.isEnemy) {
        // 敌方结算后不自动推进，等待玩家点击"下一行动"
        setEnemyTurnDone(true);
        enemyActingKeyRef.current = null;
      }
      setPendingSettlement(null);
    }, 800);
    return () => {
      if (settlementTimerRef.current) window.clearTimeout(settlementTimerRef.current);
    };
  }, [pendingSettlement, activeDice]); // eslint-disable-line

  useEffect(() => {
    return () => {
      if (settlementTimerRef.current) window.clearTimeout(settlementTimerRef.current);
    };
  }, []);

  async function resolveAction(unit: BattleUnit, skill: BattleSkill, target: BattleUnit, isEnemy = false) {
    if (authorityBusyRef.current || battleWon || battleLost || unit.hp <= 0 || target.hp <= 0 || skill.locked || resourceIsSpent(skill.resource, usedResources[unit.id] ?? {})) return;

    if (!authoritativeBattle) {
      showTutorialHint(authorityError || "权威战斗引擎正在连接，请稍候。", 4000);
      return;
    }

    setUsedResources((current) => ({
      ...current,
      [unit.id]: {
        ...(current[unit.id] ?? {}),
        [skill.resource]: true,
      },
    }));

    setTargetSelection(null);
    setAdvantage(null); // 消耗优势/劣势
    authorityBusyRef.current = true;

    try {
      const actionResult = await dispatchGameAction({ battle: authoritativeBattle.battleState }, {
        id: `battle-${Date.now()}-${unit.id}`,
        type: 'battle.skill',
        actorId: unit.id,
        skillId: skill.id,
        targetIds: [target.id],
        createdAt: Date.now(),
      });
      if (!actionResult.accepted) throw new Error(actionResult.errors[0] || '行动未通过规则验证');
      const result = actionResult.metadata?.authoritativeBattle as AuthoritativeBattleResult;
      if (!result) throw new Error('权威战斗结果缺失');
      authorityPendingRef.current = result;
      authorityDamageDiceRef.current = authoritativeDice(result, "damage");
      authorityEffectRef.current = authoritativeEffect(result, unit, target, skill) as BattleEffect;
      const attackDice = authoritativeDice(result, "attack");
      const checkDice = authoritativeDice(result, "check");
      const hit = Boolean(attackDice?.data["命中"]);

      // 攻击技能仍分两段展示，但两次骰值均来自后端同一次 ActionResult。
      if (attackDice) {
        setAttackPhase("d20");
        pendingAttackRef.current = { unit, target, skill, hit, isEnemy };
        setActiveDice(attackDice);
        advanceTutorialStep(3);
        showTutorialHint("⚔️ 先投 D20 命中骰：总计达到目标 AC，才会继续投伤害骰", 5000);
        return;
      }

      if (checkDice) {
        setAttackPhase("save");
        pendingAttackRef.current = { unit, target, skill, hit: true, isEnemy };
        setActiveDice(checkDice);
        advanceTutorialStep(3);
        return;
      }

      const dice = authoritativeDice(result, "damage");
      const effect = authorityEffectRef.current;
      setActiveDice(dice);
      if (effect) setPendingSettlement({ unit, target, skill, effect, isEnemy });

      advanceTutorialStep(3);
      if (skill.roll.kind === "healing") {
        showTutorialHint("💚 治疗骰已投出！观察骰子恢复量 → 点击任意处关闭 → 关闭后HP才会恢复", 5000);
      } else {
        showTutorialHint("⚔️ 骰子已投出！观察结果 → 点击任意处关闭 → 关闭后结算", 5000);
      }
    } catch (error) {
      pushBattleLog(error instanceof Error ? error.message : "行动提交失败");
      setUsedResources((current) => ({ ...current, [unit.id]: { ...(current[unit.id] ?? {}), [skill.resource]: false } }));
    } finally {
      authorityBusyRef.current = false;
    }
  }

  function handleChooseSkill(unit: BattleUnit, skill: BattleSkill) {
    if (battleWon || battleLost || unit.hp <= 0 || unit.faction !== "ally" || unit.id !== activeUnit?.id || skill.locked || resourceIsSpent(skill.resource, usedResources[unit.id] ?? {})) return;

    setTargetSelection({ unitId: unit.id, skillId: skill.id });
    pushBattleLog(`${unit.name} 准备 ${skill.name}，等待指定释放对象。`);
    advanceTutorialStep(2);
    if (skill.roll.kind === "healing") {
      showTutorialHint("💚 选择了治疗技能！点击我方角色头像指定恢复对象", 4000);
    } else {
      showTutorialHint("🎯 技能已选择！现在点击发光的敌方目标确认攻击", 4000);
    }
  }

  useEffect(() => {
    return () => {
      if (battleAnimationTimerRef.current) {
        window.clearTimeout(battleAnimationTimerRef.current);
      }
      if (tutorialHintTimerRef.current) {
        window.clearTimeout(tutorialHintTimerRef.current);
      }
    };
  }, []);

  // 教学：检测玩家回合开始（只在 step < 1 时触发）
  useEffect(() => {
    if (phase !== "battle" || tutorialStep >= 1 || !activeUnitId || activeFaction !== "ally") return;
    const unit = unitMap.get(activeUnitId);
    if (!unit) return;
    advanceTutorialStep(1);
    showTutorialHint(`🎮 轮到${unit.name}了！点击下方技能面板选择一个技能：攻击（稳步斩击）、检定（盾牌压制）、治疗（回气）`, 6000);
  }, [activeUnitId, activeFaction, phase, tutorialStep]); // eslint-disable-line

  // 优势/劣势只能来自规则状态；未登记规则效果时保持普通检定。
  useEffect(() => {
    setAdvantage(null);
  }, [activeUnitId, activeFaction, phase]);

  useEffect(() => {
    if (phase !== "battle" || battleWon || battleLost || !activeUnit || activeUnit.hp <= 0) {
      setTacticalAdvice(null);
      return;
    }
    const tactic = chooseAiTactic(activeUnit, allies, enemies, usedResources[activeUnit.id] ?? {}, lastEnemySkillRef.current);
    setTacticalAdvice(tactic);
  }, [activeUnitId, activeFaction, phase, battleWon, battleLost, allies, enemies, usedResources]); // eslint-disable-line

  // 教学：检测友方受伤 — 提示治疗
  const prevAllyHpRef = useRef<Record<string, number>>({});
  useEffect(() => {
    if (mode !== "tutorial" || tutorialStep < 3) { return; }
    for (const ally of allies) {
      const prev = prevAllyHpRef.current[ally.id] ?? ally.maxHp;
      if (ally.hp < prev && ally.hp > 0 && ally.hp < ally.maxHp * 0.8) {
        advanceTutorialStep(5);
        showTutorialHint("💊 注意血量！当HP下降时考虑使用「回气」或「逆钟愈合」恢复。受伤后再用治疗最划算", 6000);
      }
      prevAllyHpRef.current[ally.id] = ally.hp;
    }
  }, [allies, tutorialStep, mode]); // eslint-disable-line

  // 教学：战斗胜利提示
  useEffect(() => {
    if (mode !== "tutorial" || !battleWon) return;
    advanceTutorialStep(7);
    showTutorialHint("🎉 恭喜完成教学战斗！你已掌握：先攻 → 选择技能 → 指定目标 → 观察骰子 → 防御思路 → 治疗时机。继续主线剧情吧！", 9000);
  }, [battleWon, mode]); // eslint-disable-line

  useEffect(() => {
    if (phase !== "battle" || battleWon || battleLost || !activeUnitId || activeFaction !== "enemy") return;

    // 敌方已完成动作，等待玩家点击"下一行动"推进
    if (enemyTurnDone) return;

    const actingUnit = unitMap.get(activeUnitId);
    if (!actingUnit) return;
    if (actingUnit.hp <= 0) {
      advanceTurn();
      return;
    }

    const actionKey = `${turnIndex}-${activeUnitId}`;
    if (enemyActingKeyRef.current === actionKey) return;

    enemyActingKeyRef.current = actionKey;
    setActionUnitId(null);
    setTargetSelection(null);
    pushBattleLog(`${actingUnit.name} 的敌方回合开始，我方操作锁定。`);
    advanceTutorialStep(4);
    showTutorialHint("🛡️ 敌方回合！注意看冒险者 AC18 很难被命中，瑟琳 AC14 较脆。高护甲 = 更难被打中", 5000);

    const currentAllies = [...unitMap.values()].filter((unit) => unit.faction === "ally" && unit.hp > 0);
    const currentEnemies = [...unitMap.values()].filter((unit) => unit.faction === "enemy" && unit.hp > 0);
    const tactic = chooseAiTactic(actingUnit, currentAllies, currentEnemies, usedResources[actingUnit.id] ?? {}, lastEnemySkillRef.current);
    const legalActions = authoritativeBattle?.legalActions.filter((action) => action.actorId === actingUnit.id) ?? [];
    const legalSkillIds = new Set(legalActions.map((action) => action.skillId));
    const skill = (tactic && legalSkillIds.has(tactic.skillId) ? actingUnit.skills.find((item) => item.id === tactic.skillId) : undefined)
      ?? actingUnit.skills.find((item) => legalSkillIds.has(item.id))
      ?? actingUnit.skills[0];
    const legalAction = legalActions.find((action) => action.skillId === skill.id);
    const targetPool = getTargetCandidates(actingUnit, skill, currentAllies, currentEnemies)
      .filter((candidate) => !legalAction || legalAction.allowedTargetIds.includes(candidate.id));
    if (!targetPool.length) {
      advanceTurn();
      return;
    }
    const target = tactic
      ? targetPool.find((item) => item.id === tactic.targetIds[0]) ?? targetPool[0]
      : targetPool[0];
    if (tactic) {
      setTacticalAdvice(tactic);
      pushBattleLog(`AI战术：${tactic.reason}`);
    }
    // 记录敌人使用的技能，下一轮同技能扣分以鼓励穿插
    lastEnemySkillRef.current[actingUnit.id] = skill.id;

    const rollTimer = window.setTimeout(() => {
      void resolveAction(actingUnit, skill, target, true);
    }, BATTLE_TUNING.enemyRollDelayMs);

    return () => {
      window.clearTimeout(rollTimer);
    };
  }, [activeFaction, activeUnitId, battleLost, battleWon, orderedInitiative.length, phase, turnIndex]);

  useEffect(() => {
    if (phase !== "battle" || battleWon || battleLost || !activeUnit || activeUnit.hp > 0) return;
    const timer = window.setTimeout(() => {
      advanceTurn();
      setActionUnitId(null);
      setTargetSelection(null);
    }, 420);
    return () => window.clearTimeout(timer);
  }, [activeUnit, battleLost, battleWon, phase]);

  const pendingDiceAttack = pendingAttackRef.current
    ? {
        unitName: pendingAttackRef.current.unit.name,
        targetName: pendingAttackRef.current.target.name,
        targetAc: pendingAttackRef.current.target.ac,
        skillName: pendingAttackRef.current.skill.name,
        hit: pendingAttackRef.current.hit,
      }
    : null;

  return (
    <main className="battle-test-screen">
      <div className="battle-background" style={{ backgroundImage: `url(${config.backgroundUrl || BACKGROUND_URL})` }} />
      <div className="battle-overlay" />

      <header className="battle-hud-header">
        <div>
          <p className="eyebrow">{config.eyebrow}</p>
          <h1>{config.title}</h1>
          <small>{config.subtitle}</small>
        </div>
        <div className="battle-hud-actions">
          {(mode === "tutorial" || mode === "test") && onSkip && (
            <button type="button" className="ghost-button" onClick={onSkip} style={{ borderColor: "rgba(211,99,99,0.4)", color: "#d36363" }}>
              ⏭ 跳过战斗（胜利）
            </button>
          )}
        </div>
      </header>

      <section className="initiative-track" aria-label="行动顺序">
        {orderedInitiative.map((entry, index) => {
          const unit = unitMap.get(entry.unitId);
          if (!unit) return null;
          const isActive = unit.id === activeUnit?.id && phase === "battle";

          return (
            <button
              key={unit.id}
              type="button"
              className={`initiative-token ${isActive ? "is-active" : ""} ${unit.hp <= 0 ? "is-defeated" : ""} ${unit.faction === "enemy" ? "is-enemy" : "is-ally"}`}
              onClick={() => setSelectedUnitId(unit.id)}
              aria-current={isActive ? "true" : undefined}
            >
              <span className={`battle-avatar-mark ${AVATAR_MAP[unit.model] ? 'battle-avatar-img' : `battle-avatar-${unit.model}`}`} style={AVATAR_MAP[unit.model] ? { backgroundImage: `url(${AVATAR_MAP[unit.model]})` } : undefined} />
              <span className="initiative-rank-badge">{index + 1}</span>
            </button>
          );
        })}
      </section>

      {/* 右上角规则速查按钮 + 可折叠面板 */}
      <button
        type="button"
        className="battle-rules-toggle"
        onClick={() => setShowQuickRules((v) => !v)}
        aria-expanded={showQuickRules}
        aria-label="规则速查"
      >
        📖 规则
      </button>
      <AnimatePresence>
        {showQuickRules && (
          <motion.section
            className={`battle-rules-dock ${mode === "tutorial" ? "is-tutorial" : ""}`}
            aria-label="规则速查"
            initial={{ opacity: 0, scale: 0.92, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {config.quickRules.map((rule) => (
              <article key={rule.title}>
                <b>{rule.title}</b>
                <span>{rule.text}</span>
              </article>
            ))}
          </motion.section>
        )}
      </AnimatePresence>

      {enemyTurn && activeUnit && (
        <section className={`battle-enemy-turn-lock ${enemyTurnDone ? "is-done" : ""}`} aria-label="敌方回合">
          <b>{enemyTurnDone ? "敌方回合结束" : "敌方回合"}</b>
          <span>
            {enemyTurnDone
              ? `${activeUnit.name} 行动完毕，点击「下一行动」继续`
              : `${activeUnit.name} 正在自动行动，我方操作暂时锁定。`}
          </span>
        </section>
      )}

      {/* 战术建议已集成到战斗行动面板中 */}

      {(battleWon || battleLost) && (
        <BattleResultPanel
          outcome={battleWon ? "win" : "lose"}
          winTitle={config.winTitle}
          loseTitle={config.loseTitle}
          winText={config.winText}
          loseText={config.loseText}
          completeLabel={config.completeLabel}
          onContinue={onComplete}
        />
      )}

      <RosterPanel
        title="我方"
        units={allies}
        activeUnitId={activeUnit?.id}
        onSelect={setSelectedUnitId}
        getHpPercent={getHpPercent}
        getAvatarClassName={(model) => `battle-avatar-mark ${AVATAR_MAP[model] ? 'battle-avatar-img' : `battle-avatar-${model}`}`}
        getAvatarStyle={(model) => AVATAR_MAP[model] ? { backgroundImage: `url(${AVATAR_MAP[model]})` } : undefined}
      />
      <RosterPanel
        title="敌方"
        units={enemies}
        activeUnitId={activeUnit?.id}
        onSelect={setSelectedUnitId}
        align="right"
        getHpPercent={getHpPercent}
        getAvatarClassName={(model) => `battle-avatar-mark ${AVATAR_MAP[model] ? 'battle-avatar-img' : `battle-avatar-${model}`}`}
        getAvatarStyle={(model) => AVATAR_MAP[model] ? { backgroundImage: `url(${AVATAR_MAP[model]})` } : undefined}
      />

      <BattleField
        allies={allies}
        enemies={enemies}
        getActorState={(unit) => {
          const impacted = isAnimationTarget(unit);
          return {
            active: unit.id === activeUnit?.id && phase === "battle",
            targetable: pendingTargetIds.has(unit.id),
            casting: battleAnimation?.actorId === unit.id,
            impacted,
            animationKey: battleAnimation?.id,
            effectKind: impacted ? battleAnimation?.effectKind : undefined,
            feedback: impacted ? battleAnimation?.feedbackByTargetId?.[unit.id] ?? battleAnimation?.feedback : undefined,
          };
        }}
        onSelectUnit={(unitId) => {
          const unit = unitMap.get(unitId);
          if (unit) handleModelClick(unit);
        }}
        getHpPercent={getHpPercent}
        getSpriteSheetUrl={(model) => SPRITE_SHEET_MAP[model]}
      />

      {/* 左侧：战斗记录 — 我方角色下方 */}
      <BattleLogPanel logs={battleLog} />

      {/* 底部：AI KP 回合结算 — 视觉小说对话框风格 */}
      <AnimatePresence>
        {lastEffect && (
          <BattleEffectPanel
            key={lastEffect.id}
            effect={lastEffect}
            nextTurnLabel={
              kpReportPending ? "KP战场报告生成中…"
              : enemyTurn && !enemyTurnDone ? "等待敌方行动结束"
              : enemyTurn && enemyTurnDone ? "敌方行动完毕，下一行动 →"
              : "下一行动 →"
            }
            nextTurnDisabled={kpReportPending || phase !== "battle" || (enemyTurn && !enemyTurnDone) || battleWon || battleLost || Boolean(activeDice)}
            onNextTurn={nextTurn}
          />
        )}
      </AnimatePresence>

      <div className="battle-turn-plate">
        <span>{phase === "battle" ? "当前行动" : "等待先攻揭示"}</span>
        <b>{activeUnit?.name ?? "等待先攻"}</b>
        {activeEntry && (
          <small>
            先攻 {activeEntry.total}，D20 {activeEntry.roll} + 敏捷 {formatModifier(activeEntry.dexMod)}
            {activeEntry.otherBonus ? ` + 其他 ${activeEntry.otherBonus}` : ""}
          </small>
        )}
      </div>

      <AnimatePresence>
        {selectedUnit && (
          <BattleUnitDetailModal
            key={selectedUnit.id}
            unit={selectedUnit}
            initiative={initiative.find((entry) => entry.unitId === selectedUnit.id)}
            abilityLabels={ABILITY_LABELS.map(([key, label]) => ({ key, label }))}
            onClose={() => setSelectedUnitId(null)}
            getHpPercent={getHpPercent}
            getAvatarClassName={(model) => `battle-avatar-mark ${AVATAR_MAP[model] ? 'battle-avatar-img' : `battle-avatar-${model}`}`}
            getAvatarStyle={(model) => AVATAR_MAP[model] ? { backgroundImage: `url(${AVATAR_MAP[model]})` } : undefined}
            formatModifier={formatModifier}
            abilityModifier={abilityModifier}
            formatCombatText={formatCombatTextForPlayer}
            renderSkillFormula={(skill) => boldifyDiceNotation(formatSkillFormulaForPlayer(skill))}
            renderSkillEffect={(skill) => boldifyDiceNotation(formatSkillEffectForPlayer(skill))}
            skillNeedsRoll={skillNeedsRoll}
            visibleSkillTags={visibleSkillTags}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {actionUnit && !enemyTurn && actionUnit.id === activeUnit?.id && (
          <BattleActionBar
            key={actionUnit.id}
            unit={actionUnit}
            usedResources={usedResources[actionUnit.id] ?? {}}
            pendingSkill={pendingSkill}
            pendingTargets={pendingTargets}
            onInspect={() => setSelectedUnitId(actionUnit.id)}
            onClose={() => setActionUnitId(null)}
            onEndTurn={nextTurn}
            onChooseSkill={(skill) => handleChooseSkill(actionUnit, skill)}
            onSelectTarget={(target) => {
              if (pendingSkill) resolveAction(actionUnit, pendingSkill, target);
            }}
            onCancelTarget={() => setTargetSelection(null)}
            advantage={advantage}
            tacticalAdvice={tacticalAdvice}
            isResourceSpent={(resource, resourceState) => resourceIsSpent(resource as BattleResource, resourceState as Partial<Record<BattleResource, boolean>>)}
            formatSkillFormula={(skill) => boldifyDiceNotation(formatSkillFormulaForPlayer(skill))}
            getSkillTargetHint={(skill) => skillTargetHint(skill)}
            getAvatarClassName={(model) => `battle-avatar-mark ${AVATAR_MAP[model] ? 'battle-avatar-img' : `battle-avatar-${model}`}`}
            getAvatarStyle={(model) => AVATAR_MAP[model] ? { backgroundImage: `url(${AVATAR_MAP[model]})` } : undefined}
          />
        )}
      </AnimatePresence>

      <BattleDiceBinding
        activeDice={activeDice}
        attackPhase={attackPhase}
        pendingAttack={pendingDiceAttack}
        onClose={() => {
          // 攻击技能两阶段流程
          if ((attackPhase === "d20" || attackPhase === "save") && pendingAttackRef.current) {
            const { unit, target, skill, hit, isEnemy } = pendingAttackRef.current;
            if (hit || attackPhase === "save") {
              // 命中 → 进入伤害骰阶段
              const dmgDice = authorityDamageDiceRef.current;
              if (!dmgDice) {
                const effect = authorityEffectRef.current;
                setAttackPhase(null);
                setActiveDice(null);
                pendingAttackRef.current = null;
                if (effect) executeSettlement({ unit, target, skill, effect, isEnemy });
                if (isEnemy) {
                  setEnemyTurnDone(true);
                  enemyActingKeyRef.current = null;
                }
                return;
              }
              setAttackPhase("damage");
              setActiveDice(dmgDice);
              pushBattleLog(`${unit.name} 对 ${target.name} 使用 ${skill.name}：D20命中 → 投掷伤害骰`);
            } else {
              // 未命中 → 直接结算
              const effect = authorityEffectRef.current;
              setAttackPhase(null);
              setActiveDice(null);
              pendingAttackRef.current = null;
              if (effect) executeSettlement({ unit, target, skill, effect, isEnemy });
              if (isEnemy) {
                setEnemyTurnDone(true);
                enemyActingKeyRef.current = null;
              }
            }
          } else if (attackPhase === "damage" && pendingAttackRef.current) {
            // 伤害骰关闭 → 完整结算
            const { unit, target, skill, isEnemy } = pendingAttackRef.current;
            const effect = authorityEffectRef.current;
            setAttackPhase(null);
            setActiveDice(null);
            pendingAttackRef.current = null;
            if (effect) executeSettlement({ unit, target, skill, effect, isEnemy });
            if (isEnemy) {
              setEnemyTurnDone(true);
              enemyActingKeyRef.current = null;
            }
          } else {
            // 非攻击技能
            setAttackPhase(null);
            setActiveDice(null);
            pendingAttackRef.current = null;
          }
        }}
      />

      {/* 教学步骤提示浮层 */}
      <AnimatePresence>
        {tutorialHint && mode === "tutorial" && (
          <motion.div
            className="tutorial-step-hint"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <span>战斗提示</span>
            <p>{tutorialHint}</p>
            <button type="button" aria-label="关闭战斗提示" onClick={() => setTutorialHint(null)}>
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTutorialIntro && config.tutorialIntro && (
          <BattleTutorialIntroView
            intro={config.tutorialIntro}
            step={tutorialIntroStep}
            onPrevious={() => setTutorialIntroStep((step) => Math.max(0, step - 1))}
            onNext={() => {
              if (!config.tutorialIntro) return;
              if (tutorialIntroStep < config.tutorialIntro.steps.length - 1) {
                setTutorialIntroStep((step) => Math.min(config.tutorialIntro!.steps.length - 1, step + 1));
                return;
              }
              startTutorialInitiative();
            }}
            onClose={startTutorialInitiative}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === "initiative" && !showTutorialIntro && (
          <InitiativeRollOverlay
            key={`${rollRunId}-${initiativeAutoStartToken}`}
            entries={initiative}
            unitMap={unitMap}
            unitOrder={battleBaseUnits}
            note={config.initiativeNote}
            autoStart={initiativeAutoStartToken > 0}
            onComplete={completeInitiative}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function BattleTutorialIntro({
  intro,
  step,
  onPrevious,
  onNext,
  onClose,
}: BattleTutorialCardProps) {
  const item = intro.steps[step] ?? intro.steps[0];
  const total = intro.steps.length;
  const isFirst = step <= 0;
  const isLast = step >= total - 1;

  return (
    <motion.section
      className="battle-tutorial-intro-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={intro.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="battle-tutorial-intro"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <div className="battle-tutorial-progress">
          <i style={{ width: `${((step + 1) / total) * 100}%` }} />
        </div>
        <header>
          <span>COMBAT</span>
          <button type="button" aria-label="关闭战斗教学" onClick={onClose}>
            ×
          </button>
        </header>

        <small>{intro.subtitle}</small>
        <h2>{item.title.replace(/^[①②③④⑤⑥⑦⑧]\s*/, "")}</h2>
        <p>{item.text}</p>

        <footer>
          <button type="button" className="battle-tutorial-prev" disabled={isFirst} onClick={onPrevious}>
            上一步
          </button>
          <em>
            {step + 1} / {total}
          </em>
          <button type="button" className="battle-tutorial-next" onClick={onNext}>
            {isLast ? "开始先攻" : "下一步"}
          </button>
        </footer>
      </motion.div>
    </motion.section>
  );
}

function InitiativeRollOverlay({
  entries,
  unitMap,
  unitOrder,
  note,
  autoStart = false,
  onComplete,
}: {
  entries: InitiativeEntry[];
  unitMap: Map<string, BattleUnit>;
  unitOrder: BattleUnit[];
  note: string;
  autoStart?: boolean;
  onComplete: () => void;
}) {
  const [settled, setSettled] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [started, setStarted] = useState(autoStart);
  const orderedResults = useMemo(() => sortInitiative(entries, unitMap, unitOrder), [entries, unitMap, unitOrder]);

  useEffect(() => {
    if (autoStart) setStarted(true);
  }, [autoStart]);

  useEffect(() => {
    if (!started) return;
    const settleTimer = window.setTimeout(() => setSettled(true), autoStart ? 180 : 650);
    const revealTimer = window.setTimeout(() => setRevealed(true), autoStart ? 360 : 950);

    return () => {
      window.clearTimeout(settleTimer);
      window.clearTimeout(revealTimer);
    };
  }, [autoStart, started]);

  return (
    <motion.section
      className="battle-init-roll-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="先攻判定"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="battle-init-roll-panel"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
      >
        <header>
          <p className="eyebrow">INITIATIVE ROLL</p>
          <h2>{started ? "行动顺序掷骰中" : "准备投掷行动顺序"}</h2>
          <small>{note}</small>
        </header>

        <div className="battle-init-roll-grid">
          {entries.map((entry) => {
            const unit = unitMap.get(entry.unitId);
            if (!unit) return null;
            const rank = orderedResults.findIndex((item) => item.unitId === unit.id) + 1;

            return (
              <article key={unit.id} className={`battle-init-card ${revealed ? "is-revealed" : ""}`}>
                <span className={`battle-avatar-mark ${AVATAR_MAP[unit.model] ? 'battle-avatar-img' : `battle-avatar-${unit.model}`}`} style={AVATAR_MAP[unit.model] ? { backgroundImage: `url(${AVATAR_MAP[unit.model]})` } : undefined} />
                <div className="battle-init-card-copy">
                  <b>{unit.name}</b>
                  <small>{unit.faction === "ally" ? "我方" : "敌方"}</small>
                </div>
                <Dice3DView
                  dieType="d20"
                  roll={entry.roll}
                  rolling={started && !settled}
                  revealed={revealed}
                  size={148}
                  className="battle-init-dice-wrap"
                />
                <p>
                  {revealed
                    ? `${entry.roll} ${formatModifier(entry.dexMod)}${entry.otherBonus ? ` ${formatModifier(entry.otherBonus)}` : ""} = ${entry.total}`
                    : started ? (settled ? "确认结果" : "掷骰中") : "等待投掷"}
                </p>
                {revealed && <i>第 {rank} 位</i>}
              </article>
            );
          })}
        </div>

        <footer className="battle-init-actions">
          {!started ? (
            <button type="button" className="start-button" onClick={() => setStarted(true)}>
              投掷行动顺序
            </button>
          ) : revealed ? (
            <button type="button" className="start-button" onClick={onComplete}>
              进入第一回合
            </button>
          ) : (
            <span>骰子正在决定行动顺序...</span>
          )}
        </footer>
      </motion.div>
    </motion.section>
  );
}
