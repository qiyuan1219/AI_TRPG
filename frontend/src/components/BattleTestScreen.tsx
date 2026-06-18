import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dice3DView, DiceRollOverlay, type DieType } from "./DiceRollOverlay";
import type { DiceResult } from "../types/game";
import { fetchBattleNarration, type AuthoritativeBattleResult } from "../services/api";
import { authoritativeAmountByTarget, authoritativeDice, authoritativeEffect, authoritativeHp, authoritativeInitiative, toAuthoritativeBattlePayload } from "../core/battle/authoritativeAdapter";
import { dispatchGameAction } from "../core/actions/registry";
import "../core/actions/battleResolver";
import { rollDiceEvent } from "../core/dice/createDiceEvent";
import { BattleActionBar } from "../features/battle/BattleActionBar";
import { battleController } from "../features/battle/BattleController";
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

const QUICK_RULES: QuickRule[] = [
  { title: "流程", text: "每回合选择 1 个战斗技能，指定对象后立刻进入骰子判定。" },
  { title: "技能", text: "每个角色只展示 3 个战斗技能，暂不区分移动、附赠动作、反应和距离。" },
  { title: "命中", text: "攻击先投 D20，结果为骰面 + 属性/熟练/其他加值；达到目标 AC 才命中。" },
  { title: "伤害", text: "攻击命中后再投伤害骰，例如 1D8 或 2D4；未命中则行动结束。" },
];

const TUTORIAL_QUICK_RULES: QuickRule[] = [
  { title: "1 先攻", text: "战斗开始先投 1D20 + 敏捷调整值，数值越高越早行动。" },
  { title: "2 技能", text: "轮到我方时选择一个技能；本教学每名角色每回合只做一次主要行动。" },
  { title: "3 目标", text: "选好技能后指定发光目标。攻击技能打敌人，治疗技能点我方。" },
  { title: "4 结算", text: "攻击命中后才会进入伤害骰；未命中不会投伤害，也不会造成伤害。" },
];

const BACKGROUND_URL = "/assets/battle/b1-cablestreet-battle.png";

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

const BATTLE_UNITS: BattleUnit[] = [
  {
    id: "pc-adventurer",
    name: "冒险者",
    faction: "ally",
    role: "战士 Lv.3 / 重装先锋",
    portrait: "冒",
    model: "adventurer",
    hp: 30,
    maxHp: 30,
    ac: 18,
    speed: 30,
    proficiency: 2,
    abilities: { str: 16, dex: 13, con: 15, int: 10, wis: 12, cha: 8 },
    weaponMastery: "长剑 Sap / 战斧 Topple / 巨剑 Graze / 长矛 Slow / 战锤 Push",
    resourceProfile: ["动作压制", "附赠恢复/控制", "反应护卫"],
    statuses: ["戒备", "板甲", "前排"],
    traits: ["HP30 / AC18", "熟练加值 +2", "战士武器精通槽位 2", "短休技能：回气、破甲连斩"],
    skills: [
      {
        id: "F1",
        name: "断筋斩",
        resource: "动作",
        source: "职业技能",
        formula: "STR + 熟练 vs AC；命中后 1d8+3 挥砍",
        effect: "命中后目标 DEX 豁免 DC13，失败则速度减半 1 轮。",
        cooldown: "无",
        rule: "攻击检定 + Topple/推撞变体",
        roll: { kind: "attack", ability: "str", targetAc: 14, label: "断筋斩命中判定" },
        tags: ["攻击", "减速", "武器精通"],
      },
      {
        id: "F2",
        name: "盾牌猛击",
        resource: "附赠动作",
        source: "职业技能",
        formula: "STR 运动 DC13；伤害 1d4+3 钝击",
        effect: "目标 STR 豁免 DC13，失败则倒地。",
        cooldown: "每战斗 2 次",
        rule: "Shove 推撞机制",
        roll: { kind: "ability", ability: "str", dc: 13, label: "盾牌猛击运动检定" },
        tags: ["检定", "倒地", "附赠动作"],
      },
      {
        id: "F3",
        name: "回气",
        resource: "附赠动作",
        source: "职业技能",
        formula: "恢复 1d8 + 战士等级",
        effect: "立即恢复生命值，用于测试治疗骰和附赠动作占用。",
        cooldown: "每次短休 1 次",
        rule: "HP 与恢复",
        roll: { kind: "healing", dieType: "d8", diceCount: 1, bonus: 3, label: "回气恢复量" },
        tags: ["治疗", "D8", "短休"],
      },
      {
        id: "F4",
        name: "嘲讽咆哮",
        resource: "附赠动作",
        source: "职业技能",
        formula: "CHA 威吓 DC14；敌人 WIS 豁免 DC13",
        effect: "15 尺内敌人失败后对你以外目标攻击受限制，持续 1 轮。",
        cooldown: "每战斗 1 次",
        rule: "Help 动作反用 + 魅惑变体",
        roll: { kind: "ability", ability: "cha", dc: 14, label: "嘲讽咆哮威吓检定" },
        tags: ["控制", "劣势", "群体"],
      },
      {
        id: "F5",
        name: "护卫拦截",
        resource: "反应",
        source: "职业技能",
        formula: "无需掷骰；5 尺内队友被攻击时触发",
        effect: "你用反应替队友承受一半伤害，伤害类型不变。",
        cooldown: "每轮 1 次",
        rule: "反应 + 半身掩护变体",
        roll: { kind: "none" },
        tags: ["反应", "护卫", "减伤"],
        trigger: "5 尺内队友被攻击",
      },
      {
        id: "F6",
        name: "破甲连斩",
        resource: "动作",
        source: "职业技能",
        formula: "STR + 熟练 vs AC，连击 2 次",
        effect: "每次命中造成武器骰+STR，两次都命中额外 1d6 挥砍。",
        cooldown: "每次短休 1 次",
        rule: "多重攻击",
        roll: { kind: "attack", ability: "str", targetAc: 18, label: "破甲连斩首击" },
        tags: ["攻击", "连击", "破甲"],
      },
      {
        id: "F7",
        name: "战争践踏",
        resource: "动作",
        source: "职业技能",
        formula: "STR 运动 DC15；范围 DEX 豁免 DC13",
        effect: "10 尺锥形，失败者倒地并受束缚 1 轮。",
        cooldown: "每次长休 1 次",
        rule: "倒地 + 束缚状态",
        roll: { kind: "ability", ability: "str", dc: 15, label: "战争践踏运动检定" },
        tags: ["范围", "倒地", "束缚"],
      },
    ],
    nonCombatSkills: [
      { name: "破门开路", check: "STR 运动 DC12-18", effect: "撞开上锁的门、栅栏或石棺。" },
      { name: "战场读势", check: "WIS 洞悉 DC14", effect: "预判伏击时先攻有优势；识破弱点后首轮攻击 +2。" },
      { name: "军械鉴定", check: "INT 调查 DC12", effect: "识别武器品质、附魔或隐藏机关。" },
      { name: "负重拖拽", check: "STR 运动 DC13", effect: "拖拽倒地队友或重物，速度减半。" },
    ],
  },
  {
    id: "ally-grum",
    name: "格鲁姆",
    faction: "ally",
    role: "矮人战士 / 铁锤破阵",
    portrait: "格",
    model: "grum",
    hp: 52,
    maxHp: 52,
    ac: 18,
    speed: 25,
    proficiency: 2,
    abilities: { str: 18, dex: 12, con: 17, int: 9, wis: 13, cha: 10 },
    weaponMastery: "战锤 Push",
    resourceProfile: ["动作击倒", "附赠临时 HP", "反应代伤"],
    statuses: ["护卫", "矮人韧性", "前排"],
    traits: ["HP52 / AC18", "战锤 1d8+4 钝击", "Push 精通", "队友专属护卫反应"],
    skills: [
      {
        id: "GM1",
        name: "裂地猛击",
        resource: "动作",
        source: "队友技能",
        formula: "STR + 熟练 vs AC；1d8+4 钝击",
        effect: "命中后目标 STR 豁免 DC15，失败倒地；近战攻击对其有优势。",
        cooldown: "无",
        rule: "攻击检定 + 倒地状态",
        roll: { kind: "attack", ability: "str", targetAc: 14, label: "裂地猛击命中判定" },
        tags: ["攻击", "倒地", "优势"],
      },
      {
        id: "GM2",
        name: "铜墙铁壁",
        resource: "附赠动作",
        source: "队友技能",
        formula: "获得 2d8 临时 HP，无需 D20",
        effect: "临时 HP 优先扣除，且下回合获得闪避效果。",
        cooldown: "每战斗 1 次",
        rule: "临时生命值 + 闪避",
        roll: { kind: "damage", dieType: "d8", diceCount: 2, bonus: 0, label: "铜墙铁壁临时 HP" },
        tags: ["临时HP", "闪避", "附赠动作"],
      },
      {
        id: "GM3",
        name: "舍身护卫",
        resource: "反应",
        source: "队友技能",
        formula: "无需掷骰；5 尺内队友被攻击时触发",
        effect: "格鲁姆完全承受该次伤害，队友受到 0 伤害。",
        cooldown: "每战斗 1 次",
        rule: "反应 + 护卫",
        roll: { kind: "none" },
        tags: ["反应", "代伤", "护卫"],
        trigger: "5 尺内队友被攻击",
      },
      {
        id: "GM4",
        name: "酒桶冲锋",
        resource: "动作",
        source: "队友技能",
        formula: "STR 运动 DC15；路径敌人 DEX 豁免 DC15",
        effect: "直线 20 尺冲刺，失败者倒地；终点对最近敌人进行一次攻击。",
        cooldown: "每次短休 1 次",
        rule: "移动 + 冲撞可选规则",
        roll: { kind: "ability", ability: "str", dc: 15, label: "酒桶冲锋运动检定" },
        tags: ["移动", "冲撞", "倒地"],
      },
    ],
    nonCombatSkills: [
      { name: "矮人石工", check: "STR 运动 +4，DC12-16", effect: "鉴定石造机关、暗门或矿脉。" },
      { name: "酒馆人脉", check: "CHA 说服 +3，DC13", effect: "打听城市传闻、黑市中介和酒馆情报。" },
      { name: "酒量比拼", check: "CON 豁免 DC15", effect: "喝倒对方套取情报，失败则自己醉酒。" },
    ],
  },
  {
    id: "ally-lisa",
    name: "丽莎",
    faction: "ally",
    role: "半精灵游荡者 / 影刃",
    portrait: "丽",
    model: "lisa",
    hp: 38,
    maxHp: 38,
    ac: 16,
    speed: 30,
    proficiency: 2,
    abilities: { str: 10, dex: 18, con: 14, int: 12, wis: 13, cha: 8 },
    weaponMastery: "短剑 Vex / 匕首 Nick",
    resourceProfile: ["动作偷袭", "附赠隐形/束缚", "反应反击"],
    statuses: ["潜行", "双持", "后排突袭"],
    traits: ["HP38 / AC16", "DEX +4", "偷袭 2d6", "Vex 命中后下击优势"],
    skills: [
      {
        id: "LS1",
        name: "暗影突袭",
        resource: "动作",
        source: "队友技能",
        formula: "DEX + 熟练 vs AC；1d6+4 + 2d6 偷袭",
        effect: "需有优势或目标 5 尺内有盟友；Vex 使下次对同目标攻击有优势。",
        cooldown: "每回合 1 次偷袭",
        rule: "偷袭 + 优势系统",
        roll: { kind: "attack", ability: "dex", targetAc: 14, label: "暗影突袭命中判定" },
        tags: ["攻击", "偷袭", "优势"],
      },
      {
        id: "LS2",
        name: "烟中恶鬼",
        resource: "附赠动作",
        source: "队友技能",
        formula: "DEX 潜行 DC15",
        effect: "成功后隐形 1 轮；本回合已造成伤害则自动成功。",
        cooldown: "每战斗 1 次",
        rule: "隐形 + 重度遮蔽",
        roll: { kind: "ability", ability: "dex", dc: 15, label: "烟中恶鬼潜行检定" },
        tags: ["隐形", "优势", "附赠动作"],
      },
      {
        id: "LS3",
        name: "暗器投网",
        resource: "附赠动作",
        source: "队友技能",
        formula: "DEX + 熟练 vs AC，射程 20/40",
        effect: "命中后目标受束缚 1 轮：速度 0、攻击劣势、被攻击优势。",
        cooldown: "每战斗 1 次",
        rule: "受束缚状态",
        roll: { kind: "attack", ability: "dex", targetAc: 14, label: "暗器投网命中判定" },
        tags: ["束缚", "远程", "附赠动作"],
      },
      {
        id: "LS4",
        name: "毒蛇反击",
        resource: "反应",
        source: "队友技能",
        formula: "DEX + 熟练 vs AC；1d4+4 穿刺 + 1d6 毒素",
        effect: "被近战攻击时对攻击者进行一次匕首反击。",
        cooldown: "每轮 1 次",
        rule: "反应攻击 + 毒素伤害",
        roll: { kind: "attack", ability: "dex", targetAc: 14, label: "毒蛇反击命中判定" },
        tags: ["反应", "反击", "毒素"],
        trigger: "丽莎被近战攻击",
      },
    ],
    nonCombatSkills: [
      { name: "拆陷大师", check: "DEX 巧手 +6，DC12-18", effect: "解除陷阱或开锁，大成功可反转陷阱。" },
      { name: "阴影潜行", check: "DEX 潜行 +6", effect: "引导队伍潜行路线，降低全队被察觉概率。" },
      { name: "暗语解读", check: "INT 调查 +4，DC14", effect: "解读盗贼黑话、暗影教会暗号或地下标记。" },
    ],
  },
  {
    id: "ally-talia",
    name: "塔莉亚",
    faction: "ally",
    role: "龙血法师学徒",
    portrait: "塔",
    model: "talia",
    hp: 24,
    maxHp: 24,
    ac: 14,
    speed: 30,
    proficiency: 2,
    abilities: { str: 8, dex: 14, con: 14, int: 17, wis: 12, cha: 13 },
    weaponMastery: "无；法术位 1级×3 / 2级×1",
    resourceProfile: ["动作法术", "反应元素抗性", "短休爆发"],
    statuses: ["奥术专注", "龙血", "远程"],
    traits: ["HP24 / AC14", "INT +3", "法术豁免 DC14", "灰烬之裔易伤变体"],
    skills: [
      {
        id: "TL1",
        name: "炽焰射线",
        resource: "动作",
        source: "队友技能",
        formula: "INT + 熟练 vs AC；1d10 火焰",
        effect: "命中后目标 DEX 豁免 DC14，失败着火，下回合开始受 1d4 火焰。",
        cooldown: "无，戏法",
        rule: "法术攻击 + 持续伤害",
        roll: { kind: "attack", ability: "int", targetAc: 14, label: "炽焰射线命中判定" },
        tags: ["法术攻击", "火焰", "持续伤害"],
      },
      {
        id: "TL2",
        name: "龙火护罩",
        resource: "反应",
        source: "队友技能",
        formula: "无需掷骰；火焰/冷冻伤害触发",
        effect: "你或 10 尺内盟友获得该伤害类型抗性，仅对本次生效。",
        cooldown: "每战斗 2 次",
        rule: "抗性：伤害减半",
        roll: { kind: "none" },
        tags: ["反应", "抗性", "减伤"],
        trigger: "受到火焰或冷冻伤害",
      },
      {
        id: "TL3",
        name: "灼热金属",
        resource: "动作",
        source: "队友技能",
        formula: "自动生效；2d8 火焰；CON 豁免 DC14",
        effect: "穿金属护甲目标失败后卸除武器/护甲，下回合无法攻击。",
        cooldown: "消耗 1级法术位",
        rule: "自动命中 + 缴械可选规则",
        roll: { kind: "save", dc: 14, targetSaveBonus: 3, label: "目标 CON 豁免" },
        tags: ["火焰", "缴械", "豁免"],
      },
      {
        id: "TL4",
        name: "龙火星爆",
        resource: "动作",
        source: "队友技能",
        formula: "15 尺锥形；DEX 豁免 DC14；3d6 火焰",
        effect: "失败全伤、成功半伤；自己受 1d4 火焰反噬。灰烬之裔伤害翻倍。",
        cooldown: "每次短休 1 次",
        rule: "范围豁免 + 易伤",
        roll: { kind: "save", dc: 14, targetSaveBonus: 3, label: "目标 DEX 豁免" },
        tags: ["范围", "火焰", "易伤"],
      },
      {
        id: "TL5",
        name: "龙息觉醒",
        resource: "动作",
        source: "队友技能",
        formula: "30 尺锥形；DEX 豁免 DC15；4d6 火焰",
        effect: "信任 > 80 且完成龙血觉醒事件后解锁，无反噬。",
        cooldown: "每次长休 1 次",
        rule: "剧情解锁技能",
        roll: { kind: "save", dc: 15, targetSaveBonus: 3, label: "目标 DEX 豁免" },
        tags: ["锁定", "范围", "火焰"],
        locked: true,
      },
    ],
    nonCombatSkills: [
      { name: "奥术译读", check: "INT 奥秘 +6，DC12-18", effect: "解读古代文字、魔法卷轴或符文。" },
      { name: "法师塔礼仪", check: "INT 历史 +4 或 CHA 说服 +3", effect: "在法师塔或学术场合获取情报。" },
      { name: "血脉共鸣", check: "被动", effect: "30 尺内感知龙类、龙血生物或龙相关魔法物品。" },
    ],
  },
  {
    id: "enemy-templar",
    name: "被腐化的圣堂骑士",
    faction: "enemy",
    role: "精英敌人 / 灰烬重甲",
    portrait: "圣",
    model: "templar",
    hp: 42,
    maxHp: 42,
    ac: 17,
    speed: 30,
    proficiency: 2,
    abilities: { str: 18, dex: 11, con: 16, int: 10, wis: 12, cha: 14 },
    weaponMastery: "巨剑 Graze / 腐化光环",
    resourceProfile: ["动作高伤", "附赠黯蚀", "反应招架"],
    statuses: ["腐化", "重甲", "首领"],
    traits: ["HP42 / AC17", "STR +4", "重甲威压", "灰烬腐化抗性"],
    skills: [
      {
        id: "ET1",
        name: "黑誓巨剑",
        resource: "动作",
        source: "敌方技能",
        formula: "STR + 熟练 vs AC；2d6+4 挥砍",
        effect: "命中后可追加 1d6 黯蚀；未命中仍可用 Graze 造成 STR 调整值伤害。",
        cooldown: "无",
        rule: "攻击检定 + Graze",
        roll: { kind: "attack", ability: "str", targetAc: 18, label: "黑誓巨剑命中判定" },
        tags: ["攻击", "黯蚀", "精通"],
      },
      {
        id: "ET2",
        name: "灰烬裁决",
        resource: "动作",
        source: "敌方技能",
        formula: "CHA 威吓 vs WIS 豁免 DC14",
        effect: "失败者恐慌 1 轮，无法主动靠近圣堂骑士。",
        cooldown: "每战斗 1 次",
        rule: "恐慌状态",
        roll: { kind: "save", dc: 14, targetSaveBonus: 1, label: "我方 WIS 豁免" },
        tags: ["控制", "恐慌", "豁免"],
      },
      {
        id: "ET3",
        name: "余烬招架",
        resource: "反应",
        source: "敌方技能",
        formula: "无需掷骰；被近战命中时触发",
        effect: "本次受到的物理伤害 -1d8，并对攻击者造成 1d4 火焰。",
        cooldown: "每轮 1 次",
        rule: "反应 + 伤害减免",
        roll: { kind: "none" },
        tags: ["反应", "减伤", "火焰"],
        trigger: "被近战攻击命中",
      },
    ],
    nonCombatSkills: [],
  },
  {
    id: "enemy-ash-a",
    name: "灰烬之影小兵A",
    faction: "enemy",
    role: "影裔爪牙 / 快速骚扰",
    portrait: "影A",
    model: "shade",
    hp: 15,
    maxHp: 15,
    ac: 13,
    speed: 35,
    proficiency: 2,
    abilities: { str: 10, dex: 16, con: 12, int: 8, wis: 11, cha: 7 },
    resourceProfile: ["动作爪击", "附赠位移", "反应撤影"],
    statuses: ["轻盈", "灰烬之裔"],
    traits: ["HP15 / AC13", "DEX +3", "速度 35 尺", "受光耀/龙火克制"],
    skills: [
      {
        id: "EA1",
        name: "暗影爪击",
        resource: "动作",
        source: "敌方技能",
        formula: "DEX + 熟练 vs AC；1d6+3 挥砍",
        effect: "命中后可向 5 尺内另一个目标施加轻度遮蔽。",
        cooldown: "无",
        rule: "近战攻击",
        roll: { kind: "attack", ability: "dex", targetAc: 16, label: "暗影爪击命中判定" },
        tags: ["攻击", "近战", "遮蔽"],
      },
      {
        id: "EA2",
        name: "烟影位移",
        resource: "附赠动作",
        source: "敌方技能",
        formula: "移动 15 尺，无需掷骰",
        effect: "不触发借机攻击，优先贴近后排。",
        cooldown: "每轮 1 次",
        rule: "移动 + 借机攻击例外",
        roll: { kind: "none" },
        tags: ["移动", "撤离", "附赠动作"],
      },
    ],
    nonCombatSkills: [],
  },
  {
    id: "enemy-ash-b",
    name: "灰烬之影小兵B",
    faction: "enemy",
    role: "影裔爪牙 / 快速骚扰",
    portrait: "影B",
    model: "shade",
    hp: 15,
    maxHp: 15,
    ac: 13,
    speed: 35,
    proficiency: 2,
    abilities: { str: 10, dex: 16, con: 12, int: 8, wis: 11, cha: 7 },
    resourceProfile: ["动作爪击", "附赠位移", "反应撤影"],
    statuses: ["轻盈", "灰烬之裔"],
    traits: ["HP15 / AC13", "DEX +3", "速度 35 尺", "受光耀/龙火克制"],
    skills: [
      {
        id: "EB1",
        name: "暗影爪击",
        resource: "动作",
        source: "敌方技能",
        formula: "DEX + 熟练 vs AC；1d6+3 挥砍",
        effect: "命中后可向 5 尺内另一个目标施加轻度遮蔽。",
        cooldown: "无",
        rule: "近战攻击",
        roll: { kind: "attack", ability: "dex", targetAc: 16, label: "暗影爪击命中判定" },
        tags: ["攻击", "近战", "遮蔽"],
      },
      {
        id: "EB2",
        name: "烟影位移",
        resource: "附赠动作",
        source: "敌方技能",
        formula: "移动 15 尺，无需掷骰",
        effect: "不触发借机攻击，优先贴近后排。",
        cooldown: "每轮 1 次",
        rule: "移动 + 借机攻击例外",
        roll: { kind: "none" },
        tags: ["移动", "撤离", "附赠动作"],
      },
    ],
    nonCombatSkills: [],
  },
];

const SIMPLE_SKILL_IDS: Record<string, string[]> = {
  "pc-adventurer": ["F1", "F6", "F3"],
  "ally-grum": ["GM1", "GM2", "GM4"],
  "ally-lisa": ["LS1", "LS3", "LS2"],
  "ally-talia": ["TL1", "TL3", "TL4"],
  "enemy-templar": ["ET1", "ET2", "ET4"],
  "enemy-ash-a": ["EA1", "EA3", "EA2"],
  "enemy-ash-b": ["EB1", "EB3", "EB2"],
};

const EXTRA_SIMPLE_SKILLS: Record<string, BattleSkill[]> = {
  "enemy-templar": [
    {
      id: "ET4",
      name: "腐化重击",
      resource: "战斗技能",
      source: "敌方技能",
      formula: "STR + 熟练 vs AC；1d8+4 黯蚀",
      effect: "命中后黯蚀能量爆开，压低我方当前生命最低者的状态。",
      cooldown: "每回合 1 次",
      rule: "简化攻击检定",
      roll: { kind: "attack", ability: "str", targetAc: 16, label: "腐化重击命中判定" },
      tags: ["攻击", "黯蚀", "压制"],
    },
  ],
  "enemy-ash-a": [
    {
      id: "EA3",
      name: "灰烬爆裂",
      resource: "战斗技能",
      source: "敌方技能",
      formula: "DEX + 熟练 vs AC；1d8+3 火焰",
      effect: "灰烬在目标身侧爆开，造成火焰伤害并制造短暂混乱。",
      cooldown: "每回合 1 次",
      rule: "简化攻击检定",
      roll: { kind: "attack", ability: "dex", targetAc: 15, label: "灰烬爆裂命中判定" },
      tags: ["攻击", "火焰", "压制"],
    },
  ],
  "enemy-ash-b": [
    {
      id: "EB3",
      name: "灰烬爆裂",
      resource: "战斗技能",
      source: "敌方技能",
      formula: "DEX + 熟练 vs AC；1d8+3 火焰",
      effect: "灰烬在目标身侧爆开，造成火焰伤害并制造短暂混乱。",
      cooldown: "每回合 1 次",
      rule: "简化攻击检定",
      roll: { kind: "attack", ability: "dex", targetAc: 15, label: "灰烬爆裂命中判定" },
      tags: ["攻击", "火焰", "压制"],
    },
  ],
};

function simplifyCombatText(text: string) {
  return text
    .replace(/，?射程\s*\d+\/\d+/g, "")
    .replace(/直线\s*\d+\s*尺/g, "冲击线")
    .replace(/\d+\s*尺锥形/g, "范围")
    .replace(/\d+\s*尺内/g, "附近")
    .replace(/\d+\s*尺/g, "近身")
    .replace(/速度\s*0/g, "行动受限")
    .replace(/速度(?:被)?减半/g, "行动受限")
    .replace(/移动\s*近身/g, "快速切入")
    .replace(/附赠动作|自由互动|反应|动作/g, "战斗技能")
    .replace(/借机攻击/g, "反制")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSimpleSkill(skill: BattleSkill): BattleSkill {
  return {
    ...skill,
    resource: "战斗技能",
    cooldown: "每回合 1 次",
    trigger: undefined,
    formula: simplifyCombatText(skill.formula),
    effect: simplifyCombatText(skill.effect),
    rule: simplifyCombatText(skill.rule),
    tags: skill.tags.filter((tag) => !["附赠动作", "自由互动", "反应", "移动", "近战"].includes(tag)).slice(0, 4),
  };
}

function buildSimpleBattleUnit(unit: BattleUnit): BattleUnit {
  const skillIds = SIMPLE_SKILL_IDS[unit.id] ?? unit.skills.slice(0, 3).map((skill) => skill.id);
  const skillPool = [...unit.skills, ...(EXTRA_SIMPLE_SKILLS[unit.id] ?? [])];
  const skills = skillIds
    .map((skillId) => skillPool.find((skill) => skill.id === skillId))
    .filter((skill): skill is BattleSkill => Boolean(skill))
    .slice(0, 3)
    .map(normalizeSimpleSkill);

  return {
    ...unit,
    weaponMastery: unit.weaponMastery ? simplifyCombatText(unit.weaponMastery) : undefined,
    resourceProfile: ["三技能简化战斗", "不计算距离", "不区分附赠/反应"],
    traits: unit.traits.filter((trait) => !/^速度/.test(trait)).map(simplifyCombatText),
    skills,
  };
}

const SIMPLE_BATTLE_UNITS = BATTLE_UNITS.map(buildSimpleBattleUnit);

const TUTORIAL_BATTLE_UNITS: BattleUnit[] = [
  {
    id: "tutorial-adventurer",
    name: "冒险者",
    faction: "ally",
    role: "战士 Lv.3 / 新手教学前排",
    portrait: "冒",
    model: "adventurer",
    hp: 30,
    maxHp: 30,
    ac: 18,
    speed: 30,
    proficiency: 2,
    abilities: { str: 16, dex: 13, con: 15, int: 10, wis: 12, cha: 8 },
    weaponMastery: "本场教学只保留核心概念：攻击检定、技能检定、治疗。",
    resourceProfile: ["攻击检定 vs AC", "力量检定 vs DC", "治疗恢复 HP"],
    statuses: ["前排", "教学保护"],
    traits: ["HP30 / AC18", "攻击加值会自动计算", "未命中不会造成伤害", "本场目标：把两只小怪打到 HP0"],
    skills: [
      {
        id: "TA1",
        name: "稳步斩击",
        resource: "战斗技能",
        source: "职业技能",
        formula: "STR + 熟练 vs AC；1d8+3 挥砍",
        effect: "教学重点：D20 + 力量调整值 + 熟练加值 >= 目标 AC 即命中。命中后再投伤害骰；未命中则行动结束。",
        cooldown: "每回合 1 次",
        rule: "攻击检定",
        roll: { kind: "attack", ability: "str", targetAc: 12, label: "稳步斩击命中判定" },
        tags: ["攻击", "AC", "推荐起手"],
      },
      {
        id: "TA2",
        name: "盾牌压制",
        resource: "战斗技能",
        source: "职业技能",
        formula: "STR 运动 DC12；1d4+3 钝击",
        effect: "教学重点：技能检定看 D20 + 对应属性/熟练加值 vs 固定 DC。成功会造成伤害并压低小怪攻势。",
        cooldown: "每回合 1 次",
        rule: "技能检定",
        roll: { kind: "ability", ability: "str", dc: 12, label: "盾牌压制运动检定" },
        tags: ["检定", "控制", "低风险"],
      },
      {
        id: "TA3",
        name: "回气",
        resource: "战斗技能",
        source: "职业技能",
        formula: "恢复 1d8+3 HP",
        effect: "教学重点：治疗不攻击敌人，而是选择我方目标并恢复生命值。冒险者受伤后再用最划算。",
        cooldown: "每战斗 1 次",
        rule: "治疗骰",
        roll: { kind: "healing", dieType: "d8", diceCount: 1, bonus: 3, label: "回气恢复量" },
        tags: ["治疗", "HP", "保命"],
      },
    ],
    nonCombatSkills: [],
  },
  {
    id: "ally-selin",
    name: "瑟琳",
    faction: "ally",
    role: "时间法师 / 教学支援",
    portrait: "瑟",
    model: "selin",
    hp: 24,
    maxHp: 24,
    ac: 14,
    speed: 30,
    proficiency: 2,
    initiativeBonus: 1,
    abilities: { str: 8, dex: 14, con: 12, int: 16, wis: 14, cha: 11 },
    weaponMastery: "固定同行；负责讲解法术攻击、豁免和治疗。",
    resourceProfile: ["法术攻击 vs AC", "迫使目标豁免", "队友治疗"],
    statuses: ["后排", "奥术支援", "时间感"],
    traits: ["HP24 / AC14", "INT +3", "法术 DC13", "光亮会压制裂隙爬兽"],
    skills: [
      {
        id: "SE1",
        name: "银钟光束",
        resource: "战斗技能",
        source: "队友技能",
        formula: "INT + 熟练 vs AC；1d8+3 光耀",
        effect: "教学重点：法术攻击也使用 D20 + 施法属性 + 熟练加值。裂隙爬兽怕光，命中后很容易进入残血。",
        cooldown: "每回合 1 次",
        rule: "法术攻击",
        roll: { kind: "attack", ability: "int", targetAc: 12, label: "银钟光束命中判定" },
        tags: ["法术攻击", "光耀", "补刀"],
      },
      {
        id: "SE2",
        name: "星轨震荡",
        resource: "战斗技能",
        source: "队友技能",
        formula: "INT + 熟练 vs AC；2d4 奥术",
        effect: "命中后对敌方全体造成 2d4 奥术伤害，主目标额外受到 2 点伤害。",
        cooldown: "每回合 1 次",
        rule: "范围法术攻击",
        roll: { kind: "attack", ability: "int", targetAc: 12, label: "星轨震荡命中判定" },
        tags: ["法术攻击", "范围", "全体", "奥术"],
        primaryTargetBonus: 2,
      },
      {
        id: "SE3",
        name: "逆钟愈合",
        resource: "战斗技能",
        source: "队友技能",
        formula: "恢复 1d8+3 HP",
        effect: "教学重点：治疗可以点冒险者或瑟琳。新手战斗里敌方伤害较低，治疗主要用于理解 HP 变化。",
        cooldown: "每战斗 2 次",
        rule: "治疗骰",
        roll: { kind: "healing", dieType: "d8", diceCount: 1, bonus: 3, label: "逆钟愈合恢复量" },
        tags: ["治疗", "支援", "安全网"],
      },
    ],
    nonCombatSkills: [],
  },
  {
    id: "tutorial-crawler-a",
    name: "裂隙爬兽A",
    faction: "enemy",
    role: "小怪 / 爪击教学",
    portrait: "爬A",
    model: "crawler",
    hp: 28,
    maxHp: 28,
    ac: 12,
    speed: 25,
    proficiency: 2,
    abilities: { str: 8, dex: 14, con: 12, int: 4, wis: 10, cha: 5 },
    resourceProfile: ["低伤害攻击", "怕光", "被击败即退出战斗"],
    statuses: ["惊慌", "怕光", "教学敌人"],
    traits: ["HP28 / AC12", "DEX +2", "伤害已降低", "随机选择攻击目标"],
    skills: [
      {
        id: "CR1A",
        name: "畏光爪击",
        resource: "战斗技能",
        source: "敌方技能",
        formula: "DEX + 熟练 vs AC；1d4+2 挥砍",
        effect: "小怪最基础的攻击：投 D20 加敏捷和熟练，对比目标 AC。命中也只造成少量伤害。",
        cooldown: "每回合 1 次",
        rule: "敌方攻击检定",
        roll: { kind: "attack", ability: "dex", targetAc: 16, label: "畏光爪击命中判定" },
        tags: ["攻击", "低伤害", "教学"],
      },
      {
        id: "CR2A",
        name: "孢尘喷吐",
        resource: "战斗技能",
        source: "敌方技能",
        formula: "无需命中；所有敌对目标 1d4 毒素",
        effect: "小怪吐出浅绿色孢尘，对所有敌对目标造成 1D4 毒素伤害，不进行命中或豁免。",
        cooldown: "每回合 1 次",
        rule: "自动群体伤害",
        roll: { kind: "damage", dieType: "d4", diceCount: 1, bonus: 0, label: "孢尘喷吐伤害" },
        tags: ["群体", "毒素", "自动命中"],
      },
      {
        id: "CR3A",
        name: "惊慌缩伏",
        resource: "战斗技能",
        source: "敌方技能",
        formula: "无需掷骰；小怪生命过低时缩成一团",
        effect: "用于教学怪物行为：弱小敌人不会死战到底，HP 归 0 前也会出现畏惧和退缩。",
        cooldown: "剧情表现",
        rule: "行为提示",
        roll: { kind: "none" },
        tags: ["行为", "怕光", "撤退"],
      },
    ],
    nonCombatSkills: [],
  },
  {
    id: "tutorial-crawler-b",
    name: "裂隙爬兽B",
    faction: "enemy",
    role: "小怪 / 群体伤害教学",
    portrait: "爬B",
    model: "crawler",
    hp: 28,
    maxHp: 28,
    ac: 12,
    speed: 25,
    proficiency: 2,
    abilities: { str: 8, dex: 14, con: 12, int: 4, wis: 10, cha: 5 },
    resourceProfile: ["自动群体伤害", "怕光", "被击败即退出战斗"],
    statuses: ["惊慌", "孢尘", "教学敌人"],
    traits: ["HP28 / AC12", "自动命中", "伤害已降低", "用孢尘展示群体伤害"],
    skills: [
      {
        id: "CR2B",
        name: "孢尘喷吐",
        resource: "战斗技能",
        source: "敌方技能",
        formula: "无需命中；所有敌对目标 1d4 毒素",
        effect: "教学重点：敌人也会使用自动群体伤害技能。所有我方角色都会受到 1D4 毒素伤害，无需命中或豁免。",
        cooldown: "每回合 1 次",
        rule: "自动群体伤害",
        roll: { kind: "damage", dieType: "d4", diceCount: 1, bonus: 0, label: "孢尘喷吐伤害" },
        tags: ["群体", "毒素", "自动命中"],
      },
      {
        id: "CR1B",
        name: "畏光爪击",
        resource: "战斗技能",
        source: "敌方技能",
        formula: "DEX + 熟练 vs AC；1d4+2 挥砍",
        effect: "基础爪击，主要用于展示 AC 的防护价值。冒险者 AC18 很难被命中，瑟琳 AC14 会更危险。",
        cooldown: "每回合 1 次",
        rule: "敌方攻击检定",
        roll: { kind: "attack", ability: "dex", targetAc: 16, label: "畏光爪击命中判定" },
        tags: ["攻击", "低伤害", "教学"],
      },
      {
        id: "CR3B",
        name: "惊慌缩伏",
        resource: "战斗技能",
        source: "敌方技能",
        formula: "无需掷骰；被光照或重击压制时退缩",
        effect: "用于教学战斗叙事：敌人行为会根据伤势和恐惧改变，KP 描写会体现骰点结果。",
        cooldown: "剧情表现",
        rule: "行为提示",
        roll: { kind: "none" },
        tags: ["行为", "怕光", "撤退"],
      },
    ],
    nonCombatSkills: [],
  },
  {
    id: "tutorial-crawler-c",
    name: "裂隙爬兽C",
    faction: "enemy",
    role: "小怪 / 轮转教学",
    portrait: "爬C",
    model: "crawler",
    hp: 28,
    maxHp: 28,
    ac: 12,
    speed: 25,
    proficiency: 2,
    abilities: { str: 8, dex: 14, con: 12, int: 4, wis: 10, cha: 5 },
    resourceProfile: ["混合方式", "怕光", "展示多目标轮转"],
    statuses: ["惊慌", "畏光", "教学敌人"],
    traits: ["HP28 / AC12", "DEX +2", "伤害已降低", "展示三对多回合轮转"],
    skills: [
      {
        id: "CR1C",
        name: "畏光爪击",
        resource: "战斗技能",
        source: "敌方技能",
        formula: "DEX + 熟练 vs AC；1d4+2 挥砍",
        effect: "连续小怪攻击展示多回合压力：看看瑟琳是否需要治疗",
        cooldown: "每回合 1 次",
        rule: "敌方攻击检定",
        roll: { kind: "attack", ability: "dex", targetAc: 16, label: "畏光爪击命中判定" },
        tags: ["攻击", "低伤害", "教学"],
      },
      {
        id: "CR2C",
        name: "孢尘喷吐",
        resource: "战斗技能",
        source: "敌方技能",
        formula: "无需命中；所有敌对目标 1d4 毒素",
        effect: "配合其他小怪攻击，让我方全体承受 1D4 毒素伤害，以展示治疗的重要性。",
        cooldown: "每回合 1 次",
        rule: "自动群体伤害",
        roll: { kind: "damage", dieType: "d4", diceCount: 1, bonus: 0, label: "孢尘喷吐伤害" },
        tags: ["群体", "毒素", "自动命中"],
      },
      {
        id: "CR3C",
        name: "惊慌缩伏",
        resource: "战斗技能",
        source: "敌方技能",
        formula: "无需掷骰；同伴被击败后更加畏缩",
        effect: "展示怪物在劣势下行为改变：同伴倒下的恐慌会蔓延。",
        cooldown: "剧情表现",
        rule: "行为提示",
        roll: { kind: "none" },
        tags: ["行为", "怕光", "撤退"],
      },
    ],
    nonCombatSkills: [],
  },
];

/* 测试战斗阵容：冒险者+瑟琳 vs 三只裂隙爬兽（与教学配置相同） */
const TEST_BATTLE_UNITS: BattleUnit[] = [
  {
    id: "test-adventurer", name: "冒险者", faction: "ally", role: "战士 Lv.3", portrait: "冒", model: "adventurer",
    hp: 30, maxHp: 30, ac: 18, speed: 30, proficiency: 2,
    abilities: { str: 16, dex: 13, con: 15, int: 10, wis: 12, cha: 8 },
    resourceProfile: ["攻击", "检定", "治疗"], statuses: ["前排"], traits: ["HP30/AC18"],
    skills: [
      { id: "T1", name: "稳步斩击", resource: "战斗技能", source: "职业技能", formula: "STR+熟练 vs AC；1d8+3", effect: "基础攻击", cooldown: "每回合1次", rule: "攻击检定", roll: { kind: "attack", ability: "str", targetAc: 12, label: "稳步斩击" }, tags: ["攻击"] },
      { id: "T2", name: "盾牌压制", resource: "战斗技能", source: "职业技能", formula: "STR运动 DC12；1d4+3", effect: "技能检定", cooldown: "每回合1次", rule: "技能检定", roll: { kind: "ability", ability: "str", dc: 12, label: "盾牌压制" }, tags: ["检定"] },
      { id: "T3", name: "回气", resource: "战斗技能", source: "职业技能", formula: "恢复1d8+3", effect: "治疗自身", cooldown: "每战斗1次", rule: "治疗骰", roll: { kind: "healing", dieType: "d8", diceCount: 1, bonus: 3, label: "回气" }, tags: ["治疗"] },
    ], nonCombatSkills: [],
  },
  {
    id: "test-selin", name: "瑟琳", faction: "ally", role: "时间法师", portrait: "瑟", model: "selin",
    hp: 24, maxHp: 24, ac: 14, speed: 30, proficiency: 2, initiativeBonus: 1,
    abilities: { str: 8, dex: 14, con: 12, int: 16, wis: 14, cha: 11 },
    resourceProfile: ["法术攻击", "豁免", "治疗"], statuses: ["后排"], traits: ["HP24/AC14"],
    skills: [
      { id: "S1", name: "银钟光束", resource: "战斗技能", source: "队友技能", formula: "INT+熟练 vs AC；1d8+3光耀", effect: "法术攻击", cooldown: "每回合1次", rule: "法术攻击", roll: { kind: "attack", ability: "int", targetAc: 12, label: "银钟光束" }, tags: ["法术"] },
      { id: "S2", name: "星轨震荡", resource: "战斗技能", source: "队友技能", formula: "INT+熟练 vs AC；2d4奥术", effect: "命中后对敌方全体造成2d4奥术伤害，主目标额外受到2点伤害。", cooldown: "每回合1次", rule: "范围法术攻击", roll: { kind: "attack", ability: "int", targetAc: 12, label: "星轨震荡命中判定" }, tags: ["法术攻击", "范围", "全体", "奥术"], primaryTargetBonus: 2 },
      { id: "S3", name: "逆钟愈合", resource: "战斗技能", source: "队友技能", formula: "恢复1d8+3", effect: "治疗队友", cooldown: "每战斗2次", rule: "治疗骰", roll: { kind: "healing", dieType: "d8", diceCount: 1, bonus: 3, label: "逆钟愈合" }, tags: ["治疗"] },
    ], nonCombatSkills: [],
  },
  {
    id: "test-senluo", name: "布洛克", faction: "ally", role: "矮人·铁锅战士", portrait: "布", model: "senluo",
    hp: 48, maxHp: 48, ac: 16, speed: 25, proficiency: 2,
    abilities: { str: 16, dex: 12, con: 16, int: 10, wis: 14, cha: 8 },
    resourceProfile: ["攻击", "治疗", "范围"], statuses: ["前排"], traits: ["HP48/AC16", "矮人韧性"],
    skills: [
      { id: "SN1", name: "铁锅猛击", resource: "战斗技能", source: "队友技能", formula: "STR+熟练 vs AC；1d8+3钝击", effect: "命中可眩晕", cooldown: "每回合1次", rule: "攻击检定", roll: { kind: "attack", ability: "str", targetAc: 14, label: "铁锅猛击" }, tags: ["攻击"] },
      { id: "SN2", name: "矮人炖汤", resource: "战斗技能", source: "队友技能", formula: "恢复2d6+3", effect: "治疗队友", cooldown: "每战斗2次", rule: "治疗骰", roll: { kind: "healing", dieType: "d6", diceCount: 2, bonus: 3, label: "矮人炖汤" }, tags: ["治疗"] },
      { id: "SN3", name: "辣椒炸弹", resource: "战斗技能", source: "队友技能", formula: "范围DEX豁免DC14；2d6火焰", effect: "范围火焰+目盲", cooldown: "每战斗1次", rule: "范围豁免", roll: { kind: "save", dc: 14, targetSaveBonus: 2, label: "辣椒炸弹" }, tags: ["范围"] },
    ], nonCombatSkills: [],
  },
  {
    id: "test-ailin", name: "艾琳", faction: "ally", role: "精灵·生命牧师", portrait: "艾", model: "ailin",
    hp: 28, maxHp: 28, ac: 14, speed: 30, proficiency: 2,
    abilities: { str: 8, dex: 14, con: 13, int: 12, wis: 18, cha: 15 },
    resourceProfile: ["治疗", "祝福", "护盾"], statuses: ["后排"], traits: ["HP28/AC14", "治疗+2"],
    skills: [
      { id: "AL1", name: "生命之光", resource: "战斗技能", source: "队友技能", formula: "恢复2d8+4", effect: "治疗+解控", cooldown: "每回合1次", rule: "治疗骰", roll: { kind: "healing", dieType: "d8", diceCount: 2, bonus: 4, label: "生命之光" }, tags: ["治疗"] },
      { id: "AL2", name: "神圣祝福", resource: "战斗技能", source: "队友技能", formula: "友方AC+1，临时HP 1d4+2", effect: "祝福队友，提供临时防护", cooldown: "每战斗3次", rule: "友方增益", roll: { kind: "damage", dieType: "d4", diceCount: 1, bonus: 2, label: "神圣祝福临时HP" }, tags: ["增益", "祝福", "临时HP"] },
      { id: "AL3", name: "白枝护盾", resource: "战斗技能", source: "队友技能", formula: "友方AC+2，临时HP 2d6", effect: "白枝光盾护住队友", cooldown: "每战斗2次", rule: "友方护盾", roll: { kind: "damage", dieType: "d6", diceCount: 2, bonus: 0, label: "白枝护盾临时HP" }, tags: ["护盾", "增益", "临时HP"] },
    ], nonCombatSkills: [],
  },
  {
    id: "test-kelaiya", name: "凯娅", faction: "ally", role: "猫人·怪物猎人", portrait: "凯", model: "kelaiya",
    hp: 34, maxHp: 34, ac: 15, speed: 35, proficiency: 2,
    abilities: { str: 10, dex: 18, con: 12, int: 13, wis: 14, cha: 10 },
    resourceProfile: ["偷袭", "拆陷阱", "撤退"], statuses: ["潜行"], traits: ["HP34/AC15", "偷袭2d6"],
    skills: [
      { id: "KL1", name: "猫爪突袭", resource: "战斗技能", source: "队友技能", formula: "DEX+熟练 vs AC；1d6+4+2d6偷袭", effect: "潜行偷袭", cooldown: "每回合1次", rule: "偷袭", roll: { kind: "attack", ability: "dex", targetAc: 14, label: "猫爪突袭" }, tags: ["攻击"] },
      { id: "KL2", name: "陷阱拆除", resource: "战斗技能", source: "队友技能", formula: "DEX巧手DC14", effect: "拆除+反伤", cooldown: "每战斗2次", rule: "技能检定", roll: { kind: "ability", ability: "dex", dc: 14, label: "陷阱拆除" }, tags: ["反伤"] },
      { id: "KL3", name: "烟幕撤退", resource: "战斗技能", source: "队友技能", formula: "制造烟雾", effect: "遮蔽脱离", cooldown: "每战斗1次", rule: "遮蔽", roll: { kind: "none" }, tags: ["遮蔽"] },
    ], nonCombatSkills: [],
  },
  {
    id: "test-crawler-a", name: "裂隙爬兽A", faction: "enemy", role: "小怪", portrait: "爬A", model: "crawler",
    hp: 28, maxHp: 28, ac: 12, speed: 25, proficiency: 2,
    abilities: { str: 8, dex: 14, con: 12, int: 4, wis: 10, cha: 5 },
    resourceProfile: ["攻击", "群体伤害"], statuses: ["怕光"], traits: ["HP28/AC12"],
    skills: [
      { id: "CA1", name: "畏光爪击", resource: "战斗技能", source: "敌方技能", formula: "DEX+熟练 vs AC；1d4+2", effect: "近战攻击", cooldown: "每回合1次", rule: "攻击检定", roll: { kind: "attack", ability: "dex", targetAc: 16, label: "畏光爪击" }, tags: ["攻击"] },
      { id: "CA2", name: "孢尘喷吐", resource: "战斗技能", source: "敌方技能", formula: "无需命中；全体敌对目标 1d4毒素", effect: "自动群体伤害", cooldown: "每回合1次", rule: "自动伤害", roll: { kind: "damage", dieType: "d4", diceCount: 1, bonus: 0, label: "孢尘喷吐伤害" }, tags: ["群体", "毒素", "自动命中"] },
      { id: "CA3", name: "惊慌缩伏", resource: "战斗技能", source: "敌方技能", formula: "剧情表现", effect: "受伤后退缩", cooldown: "剧情", rule: "行为", roll: { kind: "none" }, tags: ["行为"] },
    ], nonCombatSkills: [],
  },
  {
    id: "test-crawler-b", name: "裂隙爬兽B", faction: "enemy", role: "小怪", portrait: "爬B", model: "crawler",
    hp: 28, maxHp: 28, ac: 12, speed: 25, proficiency: 2,
    abilities: { str: 8, dex: 14, con: 12, int: 4, wis: 10, cha: 5 },
    resourceProfile: ["群体伤害", "攻击"], statuses: ["孢尘"], traits: ["HP28/AC12"],
    skills: [
      { id: "CB1", name: "孢尘喷吐", resource: "战斗技能", source: "敌方技能", formula: "无需命中；全体敌对目标 1d4毒素", effect: "自动群体伤害", cooldown: "每回合1次", rule: "自动伤害", roll: { kind: "damage", dieType: "d4", diceCount: 1, bonus: 0, label: "孢尘喷吐伤害" }, tags: ["群体", "毒素", "自动命中"] },
      { id: "CB2", name: "畏光爪击", resource: "战斗技能", source: "敌方技能", formula: "DEX+熟练 vs AC；1d4+2", effect: "近战攻击", cooldown: "每回合1次", rule: "攻击检定", roll: { kind: "attack", ability: "dex", targetAc: 16, label: "畏光爪击" }, tags: ["攻击"] },
      { id: "CB3", name: "惊慌缩伏", resource: "战斗技能", source: "敌方技能", formula: "剧情表现", effect: "被压制后退缩", cooldown: "剧情", rule: "行为", roll: { kind: "none" }, tags: ["行为"] },
    ], nonCombatSkills: [],
  },
  {
    id: "test-crawler-c", name: "裂隙爬兽C", faction: "enemy", role: "小怪", portrait: "爬C", model: "crawler",
    hp: 28, maxHp: 28, ac: 12, speed: 25, proficiency: 2,
    abilities: { str: 8, dex: 14, con: 12, int: 4, wis: 10, cha: 5 },
    resourceProfile: ["混合"], statuses: ["畏光"], traits: ["HP28/AC12"],
    skills: [
      { id: "CC1", name: "畏光爪击", resource: "战斗技能", source: "敌方技能", formula: "DEX+熟练 vs AC；1d4+2", effect: "近战攻击", cooldown: "每回合1次", rule: "攻击检定", roll: { kind: "attack", ability: "dex", targetAc: 16, label: "畏光爪击" }, tags: ["攻击"] },
      { id: "CC2", name: "孢尘喷吐", resource: "战斗技能", source: "敌方技能", formula: "无需命中；全体敌对目标 1d4毒素", effect: "自动群体伤害", cooldown: "每回合1次", rule: "自动伤害", roll: { kind: "damage", dieType: "d4", diceCount: 1, bonus: 0, label: "孢尘喷吐伤害" }, tags: ["群体", "毒素", "自动命中"] },
      { id: "CC3", name: "惊慌缩伏", resource: "战斗技能", source: "敌方技能", formula: "剧情表现", effect: "同伴倒下后畏缩", cooldown: "剧情", rule: "行为", roll: { kind: "none" }, tags: ["行为"] },
    ], nonCombatSkills: [],
  },
];

const TEST_BATTLE_CONFIG: BattleConfig = {
  units: TEST_BATTLE_UNITS,
  quickRules: QUICK_RULES,
  eyebrow: "COMBAT SANDBOX",
  title: "战斗测试",
  subtitle: "冒险者+瑟琳+布洛克+艾琳+凯娅 vs 三只裂隙爬兽",
  backLabel: "返回测试",
  rerollLog: "重新进行全员 1D20 先攻判定。",
  initialLog: "战斗测试初始化：5名我方 + 3名敌方，选技能、指定对象、掷骰结算。",
  initiativeNote: "8位单位同时1D20判定：D20 + 敏捷调整值 + 其他加值。",
  winTitle: "战斗测试胜利",
  loseTitle: "战斗测试失败",
  winText: "三只裂隙爬兽已失去战斗能力，测试完成。",
  loseText: "我方全部失去战斗能力，可重投先攻重新测试。",
};

const TUTORIAL_BATTLE_CONFIG: BattleConfig = {
  units: TUTORIAL_BATTLE_UNITS,
  quickRules: TUTORIAL_QUICK_RULES,
  eyebrow: "FIRST COMBAT TUTORIAL",
  title: "补给平台教学战斗",
  subtitle: "冒险者与瑟琳对抗三只裂隙爬兽：先学先攻、攻击、豁免、治疗，再继续主线。",
  backLabel: "返回剧情",
  rerollLog: "教学战斗重置：重新投先攻，并恢复冒险者、瑟琳和三只裂隙爬兽的 HP。",
  initialLog: "新手教学开始：先看教学说明，再投先攻；本场重点是理解流程。",
  initiativeNote: "5 位单位同时进行 1D20 判定：D20 + 敏捷调整值 + 其他加值。数值最高者先行动。",
  winTitle: "教学战斗胜利",
  loseTitle: "教学战斗失败",
  winText: "三只裂隙爬兽已经失去战斗能力。你掌握了先攻、攻击、自动伤害、治疗和回合推进。",
  loseText: "本场是教学战斗，可以重投先攻重新练习；敌人伤害较低，优先让冒险者承伤。",
  completeLabel: "继续剧情",
  tutorialIntro: {
    title: "瑟琳的战斗教学",
    subtitle: "依次掌握先攻检定、技能施放、目标选择与防御站位。本场为保证教学流畅度预设为必胜，重心在于理解回合制战斗的每一层判据。",
    steps: [
      { title: "① 先攻", text: "开场所有单位投 1D20 + 敏捷调整值。行动条从左到右显示顺序，当前行动者高亮。" },
      { title: "② 选择技能", text: "轮到你时点下方技能，选攻击（稳步斩击）、检定（盾牌压制）或治疗（回气）。" },
      { title: "③ 指定目标", text: "选完技能后，敌对单位会发光。点击目标确认释放，攻击打敌人，治疗点我方。" },
      { title: "④ 观察骰子", text: "右侧弹出 3D 骰子展示 D20 结果和加值 vs 目标AC/DC，看清通过还是失败再点继续。" },
      { title: "⑤ 防御站位", text: "冒险者 AC 较高，适合顶在前排承受主要火力；瑟琳 AC 偏低，应保持在后方施法与治疗。高 AC 单位承伤是基础战术构成。" },
      { title: "⑥ 治疗时机", text: "回气和逆钟愈合恢复 HP。受伤后用治疗维持血量，不要等 HP 过低才动手。" },
    ],
    enemySkills: [
      { name: "裂隙爬兽A", skills: ["畏光爪击：D20 + 敏捷 vs AC，低伤害近战。", "孢尘喷吐：无需命中，所有敌对目标受到 1D4 毒素。", "惊慌缩伏：展示怪物受伤后的退缩行为。"] },
      { name: "裂隙爬兽B", skills: ["孢尘喷吐：优先展示自动群体伤害。", "畏光爪击：展示瑟琳 AC 较低、前排更适合承伤。", "惊慌缩伏：被光照或重击压制时会畏缩。"] },
      { name: "裂隙爬兽C", skills: ["畏光爪击：多只小怪轮番攻击，体会回合交替的压力。", "孢尘喷吐：毒素持续消耗我方全体血量，治疗的重要性。", "惊慌缩伏：同伴倒下后更加畏缩。"] },
    ],
  },
};

function getBattleConfig(mode: BattleTestScreenProps["mode"]): BattleConfig {
  return mode === "tutorial" ? TUTORIAL_BATTLE_CONFIG : TEST_BATTLE_CONFIG;
}

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
interface ParsedFormulaDice {
  dieType: DieType;
  count: number;
  bonus: number;
  rolls: number[];
  rawTotal: number;
  total: number;
  label: string; // e.g. "1d8+3"
}
function rollFormulaDice(formula: string): ParsedFormulaDice | null {
  // 只匹配伤害/治疗部分（命中后、恢复 等之后的内容）
  const damagePart = formula.split(/；|;/)[1] ?? formula;
  const match = damagePart.match(/(\d*)d(\d+)(?:\s*[+＋]\s*(\d+))?/i);
  if (!match) return null;
  
  const count = Number(match[1] || 1);
  const sides = Number(match[2]);
  const dieType = `d${sides}` as DieType;
  const bonus = Number(match[3] || 0);
  const rolls = Array.from({ length: count }, () => rollDie(sides));
  const rawTotal = rolls.reduce((sum, v) => sum + v, 0);
  return { dieType, count, bonus, rolls, rawTotal, total: rawTotal + bonus, label: match[0].replace(/[\s+＋]/g, "") };
}

function rollFormulaAmount(formula: string) {
  const matches = [...formula.matchAll(/(\d*)d(\d+)(?:\s*[+＋]\s*(\d+))?/gi)];
  if (matches.length === 0) return null;

  const parts: string[] = [];
  let total = 0;
  matches.forEach((match) => {
    const count = Number(match[1] || 1);
    const sides = Number(match[2]);
    const bonus = Number(match[3] || 0);
    const rolls = Array.from({ length: count }, () => rollDie(sides));
    const subtotal = rolls.reduce((sum, value) => sum + value, 0) + bonus;
    total += subtotal;
    parts.push(`${count}d${sides}${bonus ? `+${bonus}` : ""}: ${rolls.join("+")}${bonus ? `+${bonus}` : ""}`);
  });

  return { total, detail: parts.join("；") };
}

/** 仅掷伤害骰（用于攻击命中后的第二阶段） */
function rollDamageOnly(skill: BattleSkill, unitName: string): DiceResult | null {
  const fd = rollFormulaDice(skill.formula);
  if (!fd) return null;
  const diceLabel = `${fd.count}D${sidesFromDieType(fd.dieType)}`;
  return {
    type: "dice_test",
    data: {
      骰子: fd.dieType.toUpperCase(),
      属性: `${unitName}：${skill.name}（${formatDamageFormulaForPlayer(skill.formula)}）`,
      掷骰: `${fd.dieType.toUpperCase()}=${fd.rolls[0]}`,
      结果: fd.rolls[0],
      骰数: fd.count,
      骰面: fd.dieType,
      全部掷骰: fd.rolls,
      加值: fd.bonus,
      总计: fd.total,
      描述: fd.count > 1 ? `${diceLabel} 合计 ${fd.rolls.join(" + ")}` + (fd.bonus ? ` + ${fd.bonus} = ${fd.total}` : ` = ${fd.total}`) : `${diceLabel}${fd.bonus ? ` + ${fd.bonus}` : ""}`,
      id: Date.now(),
    },
  };
}

function diceLine(dice: DiceResult | null) {
  if (!dice) return "无掷骰，按触发条件直接生效。";
  if (dice.type === "attack_roll") {
    return `D20 ${dice.data["攻击掷骰"]?.replace("D20=", "") ?? "?"} + ${dice.data["加值"] ?? 0} = ${dice.data["总计"] ?? "?"} / AC ${dice.data["目标AC"] ?? "?"}`;
  }
  if (dice.type === "skill_check") {
    return `D20 ${dice.data["掷骰"]?.replace("D20=", "") ?? "?"} + ${dice.data["加值"] ?? 0} = ${dice.data["总计"] ?? "?"} / DC ${dice.data["DC"] ?? "?"}`;
  }
  return `${dice.data["骰子"] ?? "骰子"} ${dice.data["掷骰"] ?? ""}，总计 ${dice.data["总计"] ?? dice.data["结果"] ?? "?"}`;
}

function getDiceTotal(dice: DiceResult | null) {
  return Number(dice?.data["总计"] ?? dice?.data["结果"] ?? 0);
}

function getD20Roll(dice: DiceResult | null) {
  const raw = dice?.type === "attack_roll" ? dice.data["攻击掷骰"] : dice?.data["掷骰"];
  const match = String(raw ?? "").match(/D20=(\d+)/);
  return match ? Number(match[1]) : 0;
}

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

function tuneDamageAmount(actor: BattleUnit, rawAmount: number) {
  const multiplier = actor.faction === "ally" ? BATTLE_TUNING.allyDamageMultiplier : BATTLE_TUNING.enemyDamageMultiplier;
  return Math.max(1, Math.round(rawAmount * multiplier));
}

/** 循环计数器 —— 确保每类描述每次都不一样，用完一轮再从头开始 */
const _cycle: Record<string, number> = {};
function nextIndex(key: string, length: number): number {
  const idx = (_cycle[key] ?? 0) % length;
  _cycle[key] = idx + 1;
  return idx;
}

/** 为每种描述类型定义尽量多的变体（至少 5-6 条），保证一整场战斗不重样 */

const HIT_INTROS = [
  (a: string, s: string, r: string) => `${a}挥出${s}，${r}精准命中——`,
  (a: string, s: string, r: string) => `${a}的${s}以${r}穿过防线——`,
  (a: string, s: string, r: string) => `${s}带着${r}的力道迎面而至——`,
  (a: string, s: string, r: string) => `${a}抓住破绽，${s}的${r}毫不留情地招呼上去——`,
  (a: string, s: string, r: string) => `${a}咬紧牙关，${s}挟着${r}一往无前地劈落——`,
  (a: string, s: string, r: string) => `${a}算准了角度，${s}以${r}切入对手的防守盲区——`,
  (a: string, s: string, r: string) => `${s}的寒光一闪，${r}已如毒蛇般咬向目标的要害——`,
  (a: string, s: string, r: string) => `${a}一声低喝，${s}带着${r}破空而来——`,
];

const MID_CLAUSES = [
  (t: string) => `${t}闷哼一声，`,
  (t: string) => `${t}咬牙硬扛了这一下，`,
  (t: string) => `${t}来不及完全闪避，`,
  (t: string) => `${t}的防御在冲击下露出一丝裂痕，`,
  (t: string) => `${t}脚下一个踉跄，`,
  (t: string) => `${t}瞳孔骤然收缩，`,
  (t: string) => `${t}倒吸一口凉气，`,
  (t: string) => `${t}的面色白了一瞬，`,
];

const FIRE_IMPACTS = [
  "烈焰在盔甲缝隙间爆燃，灼热的冲击波掀翻了周围的碎石",
  "炽焰咆哮着吞噬了目标的防线，滚烫的气浪让空气都扭曲了起来",
  "火星飞溅中，燃烧的轨迹在黑暗中划出一道刺眼的伤口",
  "火光沿着命中的轨迹炸开，灼浪如鞭子般抽打在护甲的每一寸",
  "赤红的火焰从武器尖端喷涌而出，在目标胸前绽开一朵死亡之花",
  "高温瞬间熔化了铠甲边角，融化的金属液滴暗红地滴落在地",
];

const LIGHT_IMPACTS = [
  "璀璨的光柱洞穿了暗幕，耀眼的白光在目标身上刻下灼烧的印记",
  "圣光洪流倾泻而下，辉芒如刀刃般撕裂了阴影的庇护",
  "光芒炸裂，每一缕辉光都像细针般刺入目标的形体，邪祟在光下扭曲哀嚎",
  "一轮耀眼的白光从命中点向四周迸射，阴翳如潮水般被逼退了三尺",
  "光耀涟漪层层荡开，目标体表缭绕的暗影发出一声凄厉的尖啸",
  "神圣之力化作刺目的流星，在击中的地方留下一枚久久不散的亮白烙印",
];

const ICE_IMPACTS = [
  "冰晶沿着命中点迅速蔓延，刺骨的寒意渗入骨髓",
  "霜刃划过之处留下白痕，冻气凝结成狰狞的冰刺从内部撑开裂隙",
  "寒流如潮水般涌过，目标的动作在低温中明显迟缓了下来",
  "冰霜在创口处绽开，冷气顺着血液流淌，让对手的肢体僵硬了半拍",
  "寒气噼啪作响地爬上护甲表面，所过之处凝出一层薄而脆的冰壳",
  "刺骨的冻气灌入伤口，目标呼出的白雾里夹杂着一声低沉的痛呼",
];

const LIGHTNING_IMPACTS = [
  "电弧在击中瞬间炸裂，蓝白色的闪电分支噼啪作响地爬满目标全身",
  "雷霆劈落，电流沿着护甲的金属边缘跳跃，空气中弥漫着焦糊的气味",
  "电光闪过之后，目标的肌肉仍在不由自主地痉挛抽搐",
  "闪电如银蛇般窜入盔甲内部，噼里啪啦地沿着关节游走",
  "一道刺目的蓝光贯穿了目标的躯干，跳动的电弧在其身周织成一张光网",
  "雷击落下的瞬间空气被电离出刺鼻的臭氧味，目标的鬃毛根根倒竖",
];

const POISON_IMPACTS = [
  "暗绿色的毒雾从创口渗入，皮肤下隐约可见黑色的细线在血管中蔓延",
  "腐蚀性的能量发出令人不安的嘶嘶声，护甲表面肉眼可见地黯淡消融",
  "毒素如活物般钻入伤口，目标的面色瞬间苍白了几分",
  "紫黑色的雾瘴缠绕在伤口边缘，散发出甜腻而致命的气味",
  "毒液接触到血肉的刹那泛起一串恶心的气泡，附近的皮肤迅速转为暗灰",
  "暗蚀之力悄无声息地渗透防御，目标眼底闪过一丝不易察觉的异色",
];

const STEALTH_IMPACTS = [
  "利刃从难以置信的角度切入，护甲的搭扣处溅出细碎的火星",
  "身影一晃出现在目标背后，刀尖已经没入了甲片间的薄弱缝隙",
  "攻击来自最不可能的方向——敌人甚至没来得及举盾，锋刃便已划开了一道深痕",
  "阴影中无声地探出刀锋，等到察觉时尖端已刺破外层的皮革",
  "一击得手便立即抽身，快得连影子都跟不上",
  "刺客般的精准——刀尖恰好绕过肋骨，直抵最柔软的腹部一侧",
];

const KNOCKDOWN_IMPACTS = [
  "巨力将目标整个掀离地面，沉重的身躯砸在地上溅起一片尘土",
  "一击正中关节要害，目标感到下半身一阵酸麻，站立不稳地晃了两步",
  "冲击力如铁锤般砸在目标的膝盖弯，逼得他不得不蹲身卸力",
  "目标膝盖一软，重心被精准地瓦解，单膝重重砸在石板地面上",
  "横扫的力道绊翻了对手的支撑腿，整个人失去平衡轰然侧倒",
  "借力打力的一推，目标的下盘像被抽走了骨头般瞬间瓦解",
];

const BREAK_IMPACTS = [
  "沉重的攻击砸在护甲上，甲片发出不堪重负的呻吟，向内凹陷出一块裂纹",
  "这一击的力道贯穿了防具，护甲表层崩裂，碎片叮当作响地散落",
  "钝器般的撞击让对方的防御出现了一道明显的缺口",
  "护心镜在这一击下变了形，金属呻吟着向内塌陷",
  "攻击精准落在甲片衔接处，铆钉崩飞，整块护板歪斜脱位",
  "沉闷的撞击声之后，甲片中央赫然多了一个拳头大的凹坑",
];

const BIG_HIT_IMPACTS = [
  "沉重的斩击切开空气，命中时爆出沉闷的回响，冲击力让目标整个人往后滑了一步",
  "武器砸下的力量远超预期，护甲发出尖锐的金属扭曲声，裂纹如蛛网般扩散",
  "这一击势大力沉，碰撞的瞬间迸发出刺耳的巨响，目标的身体明显晃了一晃",
  "力道如山崩般倾泻而下，撞击处甲片翻卷，底下的衬垫被震得撕裂",
  "轰然一击，冲击波肉眼可见地荡开——目标双脚离地了半寸才重新站稳",
  "命中时一声炸雷般的闷响，周围的尘土都被气浪推成了一圈涟漪",
];

const SMALL_HIT_IMPACTS = [
  "攻击精准地穿过防御空档，在目标的侧腹留下一道浅浅的血痕",
  "利落的招式擦过护甲边缘，虽未正中要害，却也逼得对手倒吸一口凉气",
  "出手迅捷而刁钻，角度刚好越过盾牌的遮蔽，在肩甲上敲出一小片凹痕",
  "快如蜂蜇的一刺，只在目标臂甲上留下一道不足三寸的划痕",
  "轻巧的一击撩过目标腰间，没有见血，但护甲下传来一声闷哼",
  "角度极刁的一记点刺，撩过目标头盔侧沿，逼得对方仓促偏头",
];

const NORMAL_HIT_IMPACTS = [
  "攻击结结实实撕开了对手的防线，命中处传来一声沉闷的撞击",
  "兵刃交错的瞬间火花四溅，力道穿透了护具的防御层",
  "这一招干脆利落，沿着护甲的缝隙切入，逼迫对手不得不重新调整姿态",
  "武器在甲胄上拖出一道长长的白痕，金属摩擦的尖啸令人牙酸",
  "一式当头劈下被架住，但余力顺着对方的手臂震了下去",
  "双方身形交错，电光石火间已在对方身上留下了印记",
];

const HEAL_BIG = [
  (a: string, t: string, amt: number) => `温暖的白光从${a}掌心涌出，如潮水般漫过${t}全身——${amt}点生命力重新灌注进四肢，连最深的那道伤口也开始收口愈合。`,
  (a: string, t: string, amt: number) => `治愈之光轰然绽放，${t}感到一股暖流从头顶直灌脚底，${amt}点生命恢复让他的呼吸重新变得沉稳有力。`,
  (a: string, t: string, amt: number) => `圣洁的光晕将${t}整个包裹，${amt}点生机如春泉般注入——翻卷的皮肉在光芒中缓缓平复，血痂悄然剥落。`,
  (a: string, t: string, amt: number) => `${a}双手按在${t}的伤口上，随着一段古老咒文的吟诵，${amt}点生命之泉涌入体内，疼痛被温暖取代。`,
];

const HEAL_SMALL = [
  (a: string, t: string, amt: number) => `${a}指尖流转的光辉轻触${t}的伤处，${amt}点生命悄然回填，伤口边缘以肉眼可见的速度收敛合拢。`,
  (a: string, t: string, amt: number) => `一缕温润的魔力缠绕上${t}的创口，痛楚如水退潮般消散，恢复了${amt}点体力。`,
  (a: string, t: string, amt: number) => `${a}低声念出一段短促的祷文，淡金色的光斑落在${t}身上，${amt}点生命力温柔地填补了伤势。`,
  (a: string, t: string, amt: number) => `一颗发光的微尘飘入${t}的伤处，随即化作${amt}点暖意散开——伤口虽未全好，但流血已止。`,
  (a: string, t: string, amt: number) => `${a}轻拍${t}的肩膀，一道细小的生命之线沿着手臂汇入对方体内，恢复了${amt}点体力。`,
  (a: string, t: string, amt: number) => `空气中聚拢起淡绿的辉点，${amt}点治愈灵力如春雨般渗入${t}的伤口，带走了一部分疼痛。`,
];

const TRIGGERS = [
  (a: string, t: string, s: string) => `${a}将${s}的印记悄然刻在${t}身侧，眸子紧锁着战场上的每一次风吹草动——只等敌人踏入陷阱的那一刻。`,
  (a: string, t: string, s: string) => `${a}对${t}微微颔首，${s}已就位，魔力在无声中编织成一张守护之网。`,
  (a: string, t: string, s: string) => `${a}架起${s}的架势，视线如鹰隼般扫过战场，护在${t}前方的每一步都蓄势待发。`,
  (a: string, t: string, s: string) => `${a}五指一张，${s}的符文在${t}脚下亮起一圈微光——契约已成。`,
  (a: string, t: string, s: string) => `${a}将重心压低，${s}的防御姿态在${t}身前展开一道无形的屏障。`,
  (a: string, t: string, s: string) => `低沉的嗡鸣中，${a}的${s}在${t}周身浮现出一层半透明的能量波纹。`,
];

const DEFEATS = [
  (a: string, s: string, r: string, t: string) => `${a}的${s}带着${r}轰然落下——${t}的身形在冲击中碎裂，轮廓崩解成一缕灰烬，散入地底的暗风中。`,
  (a: string, s: string, r: string, t: string) => `${a}不给任何喘息之机，${s}以${r}彻底压垮了${t}。残躯摇晃了两下，最终无声地坍倒在地。`,
  (a: string, s: string, r: string, t: string) => `${s}的最后一击来得迅猛而致命。${t}没能扛住这${r}，躯壳如枯叶般碎裂飘散。`,
  (a: string, s: string, r: string, t: string) => `胜负已分——${a}的${s}带着${r}贯穿了${t}的防御，残破的身影跪倒在地，再也不动了。`,
  (a: string, s: string, r: string, t: string) => `${s}的${r}是压倒骆驼的最后一根稻草。${t}的眼中闪过一丝不甘，旋即整个人如积木般解体崩塌。`,
];

const SAVE_HALVES = [
  (t: string, s: string, a: string, amt: string) => `${t}在千钧一发之际侧身卸力，${s}的大部分威力被偏转滑开。但${a}的攻击并非全无收获——余波仍然刮过了目标的防线，留下${amt}伤害。`,
  (t: string, s: string, a: string, amt: string) => `${t}的反应堪称老练，脚下步伐连退三步，把${s}的致命角度化解了大半。不过震荡的余力还是穿透了双臂，造成了${amt}伤害。`,
  (t: string, s: string, a: string, amt: string) => `虽然${t}勉强扭身避开了正面，${s}的边锋仍擦过躯干，${a}逼出的这记半效攻击造成了${amt}伤害。`,
  (t: string, s: string, a: string, amt: string) => `${t}一个后仰铁板桥险险避过全力一击，但${s}带起的冲击波还是追上了他——${amt}伤害。`,
  (t: string, s: string, a: string, amt: string) => `${t}交叉双臂硬架，${s}的主力道被卸掉了大半，但震荡顺着骨骼传遍全身，扣去${amt}。`,
];

const GRAZES = [
  (a: string, s: string, t: string, amt: number) => `${a}的${s}擦着${t}的护甲滑过，没有正中目标。但迅猛的攻势仍逼得${t}踉跄后退，铠甲边缘在皮肤上勒出一道浅痕——受到${amt}点压制伤害。`,
  (a: string, s: string, t: string, amt: number) => `${s}并未彻底洞穿防御，${t}勉强架住了主要力道。可冲击的余波沿武器传导而上，震得他手腕发麻，扣去${amt}点体力。`,
  (a: string, s: string, t: string, amt: number) => `${a}这一击角度差了半分，${t}侧身堪堪让过要害。然而兵器带起的风压仍在甲片上刮出刺耳的啸声，${amt}点擦伤随之烙在护甲之下。`,
  (a: string, s: string, t: string, amt: number) => `${a}的${s}从${t}肩头不到一寸处掠过，攻势虽未洞穿，但强横的力道仍将${t}推得后退了两步，${amt}点压制。`,
  (a: string, s: string, t: string, amt: number) => `${s}落空，但${a}顺势用兵器柄端顶了过去——${t}猝不及防，吃下了${amt}点钝击擦伤。`,
];

const CHECKS_NORMAL = [
  (a: string, s: string, r: string, t: string) => `${a}施展${s}，${r}稳稳拿下了主动权。${t}被迫跟着对方的步调挪移，原本的防守节奏被打乱了半分。`,
  (a: string, s: string, r: string, t: string) => `${s}的${r}让${a}占据了上风。${t}不得不仓促调整站位，这一回合的布局已经偏向了我方。`,
  (a: string, s: string, r: string, t: string) => `${a}的${s}以${r}得手，${t}的站位被彻底打乱，原本严密的阵型露出了一道缺口。`,
  (a: string, s: string, r: string, t: string) => `${s}的${r}如预料般生效——${t}踉跄着调整重心，整个攻防节奏在本回合被攥入了${a}手中。`,
];

const CHECKS_KNOCKDOWN = [
  (a: string, s: string, r: string, t: string) => `${a}以${s}发起压制，${r}无可争议。${t}的身体被强行钉在原地，挣扎间膝盖重重砸进了尘土。`,
  (a: string, s: string, r: string, t: string) => `${s}的${r}彻底瓦解了${t}的下盘，重心猛然倾覆，重重摔倒在地——周围的空气都为之一震。`,
  (a: string, s: string, r: string, t: string) => `${a}的${s}以${r}扫倒了${t}，沉重的铠甲砸在地上发出沉闷的回响，扬起一圈灰尘。`,
  (a: string, s: string, r: string, t: string) => `${s}的${r}正中${t}的支撑腿，关节发出一声令人牙酸的脆响，整个人像被伐倒的树一样侧向倾倒。`,
];

const MISSES = [
  (a: string, s: string, r: string, t: string) => `${a}的${s}以${r || "判定"}袭去，${t}却以意想不到的角度拧身避开，兵刃从肩头上方呼啸而过。`,
  (a: string, s: string, r: string, t: string) => `${s}出手迅猛，但${t}早一步看穿了轨迹——侧身滑步，攻击只撕裂了一片空气。`,
  (a: string, s: string, r: string, t: string) => `${a}的${s}擦着${t}的衣角掠过，距离命中只差毫厘。${t}瞳孔微缩，显然也被这一击的凌厉吓了一跳。`,
  (a: string, s: string, r: string, t: string) => `${a}奋力一击，${s}却砸在了${t}脚边的石板地上，碎石四溅但人毫发无伤。`,
  (a: string, s: string, r: string, t: string) => `${s}划出一道弧线——${t}后撤一步刚好让过锋尖，冷风拂面却没有留下伤口。`,
  (a: string, s: string, r: string, t: string) => `${t}将盾牌向上一顶，${s}从盾面上滑出刺耳的声音，偏移了致命的角度。`,
];

/* ===== 核心选择函数 ===== */
function impactFlavor(skill: BattleSkill, amount?: number): string {
  const isBigHit = amount !== undefined && amount >= 8;
  const isSmallHit = amount !== undefined && amount <= 3;

  if (skill.tags.includes("火焰")) return FIRE_IMPACTS[nextIndex("fire", FIRE_IMPACTS.length)];
  if (skill.tags.includes("光耀") || skill.tags.includes("圣")) return LIGHT_IMPACTS[nextIndex("light", LIGHT_IMPACTS.length)];
  if (skill.tags.includes("冰") || skill.tags.includes("霜") || skill.tags.includes("冻")) return ICE_IMPACTS[nextIndex("ice", ICE_IMPACTS.length)];
  if (skill.tags.includes("雷") || skill.tags.includes("电")) return LIGHTNING_IMPACTS[nextIndex("lightning", LIGHTNING_IMPACTS.length)];
  if (skill.tags.includes("毒") || skill.tags.includes("黯蚀")) return POISON_IMPACTS[nextIndex("poison", POISON_IMPACTS.length)];
  if (skill.tags.includes("偷袭") || skill.tags.includes("隐形")) return STEALTH_IMPACTS[nextIndex("stealth", STEALTH_IMPACTS.length)];
  if (skill.tags.includes("倒地") || skill.tags.includes("束缚")) return KNOCKDOWN_IMPACTS[nextIndex("knockdown", KNOCKDOWN_IMPACTS.length)];
  if (skill.tags.includes("破甲") || skill.tags.includes("压制")) return BREAK_IMPACTS[nextIndex("break", BREAK_IMPACTS.length)];
  if (isBigHit) return BIG_HIT_IMPACTS[nextIndex("bigHit", BIG_HIT_IMPACTS.length)];
  if (isSmallHit) return SMALL_HIT_IMPACTS[nextIndex("smallHit", SMALL_HIT_IMPACTS.length)];
  return NORMAL_HIT_IMPACTS[nextIndex("normalHit", NORMAL_HIT_IMPACTS.length)];
}

function healFlavor(actorName: string, targetName: string, amount?: number): string {
  const amt = amount ?? 0;
  if (amt >= 10) {
    const fns = HEAL_BIG;
    return fns[nextIndex("healBig", fns.length)](actorName, targetName, amt);
  }
  const fns = HEAL_SMALL;
  return fns[nextIndex("healSmall", fns.length)](actorName, targetName, amt);
}

function triggerFlavor(actorName: string, targetName: string, skillName: string): string {
  return TRIGGERS[nextIndex("trigger", TRIGGERS.length)](actorName, targetName, skillName);
}

function defeatFlavor(actorName: string, targetName: string, skillName: string, resultText: string): string {
  return DEFEATS[nextIndex("defeat", DEFEATS.length)](actorName, skillName, resultText, targetName);
}

function hitFlavor(actorName: string, targetName: string, skillName: string, resultText: string, amount: number | undefined, skill: BattleSkill): string {
  const amtText = amount !== undefined ? ` ${amount} 点伤害` : "效果";
  const desc = impactFlavor(skill, amount);
  const intro = HIT_INTROS[nextIndex("hitIntro", HIT_INTROS.length)](actorName, skillName, resultText);
  const mid = MID_CLAUSES[nextIndex("midClause", MID_CLAUSES.length)](targetName);
  return `${intro}${desc}。${mid}受到${amtText}。`;
}

function saveHalfFlavor(actorName: string, targetName: string, skillName: string, amount: number | undefined): string {
  const amtText = amount !== undefined ? ` ${amount} 点（半效）` : "削弱后的冲击";
  return SAVE_HALVES[nextIndex("saveHalf", SAVE_HALVES.length)](targetName, skillName, actorName, amtText);
}

function grazeFlavor(actorName: string, targetName: string, skillName: string, amount: number): string {
  return GRAZES[nextIndex("graze", GRAZES.length)](actorName, skillName, targetName, amount);
}

function checkFlavor(actorName: string, targetName: string, skillName: string, resultText: string, skill: BattleSkill): string {
  if (skill.tags.includes("倒地") || skill.tags.includes("束缚")) {
    return CHECKS_KNOCKDOWN[nextIndex("checkKd", CHECKS_KNOCKDOWN.length)](actorName, skillName, resultText, targetName);
  }
  return CHECKS_NORMAL[nextIndex("checkNorm", CHECKS_NORMAL.length)](actorName, skillName, resultText, targetName);
}

function missFlavor(actorName: string, targetName: string, skillName: string, resultText: string): string {
  return MISSES[nextIndex("miss", MISSES.length)](actorName, skillName, resultText, targetName);
}

function buildKpNarration({
  actor,
  target,
  skill,
  dice,
  amount,
  outcome,
}: {
  actor: BattleUnit;
  target: BattleUnit;
  skill: BattleSkill;
  dice: DiceResult | null;
  amount?: number;
  outcome: "hit" | "miss" | "graze" | "save-full" | "save-half" | "heal" | "check" | "trigger";
}) {
  const total = getDiceTotal(dice);
  const resultText = total ? `${total} 点判定` : "这次行动";
  const isDefeated = amount !== undefined && isDamagingAction(actor, target, skill) && amount >= target.hp;

  if (outcome === "heal") {
    return `KP：${healFlavor(actor.name, target.name, amount)}`;
  }

  if (outcome === "trigger") {
    return `KP：${triggerFlavor(actor.name, target.name, skill.name)}`;
  }

  if (isDefeated) {
    return `KP：${defeatFlavor(actor.name, target.name, skill.name, resultText)}`;
  }

  if (outcome === "hit" || outcome === "save-full") {
    return `KP：${hitFlavor(actor.name, target.name, skill.name, resultText, amount, skill)}`;
  }

  if (outcome === "save-half") {
    return `KP：${saveHalfFlavor(actor.name, target.name, skill.name, amount)}`;
  }

  if (outcome === "graze") {
    return `KP：${grazeFlavor(actor.name, target.name, skill.name, amount ?? 0)}`;
  }

  if (outcome === "check") {
    return `KP：${checkFlavor(actor.name, target.name, skill.name, resultText, skill)}`;
  }

  return `KP：${missFlavor(actor.name, target.name, skill.name, resultText)}`;
}

function buildBattleEffect(actor: BattleUnit, target: BattleUnit, skill: BattleSkill, dice: DiceResult | null): BattleEffect {
  // 优先使用 DiceResult 中预掷的伤害骰结果，避免重复掷骰
  const preRolledDamage = dice?.data["伤害总计"];
  const amountRoll = (preRolledDamage !== undefined && preRolledDamage !== null)
    ? { total: Number(preRolledDamage), detail: "" }
    : rollFormulaAmount(skill.formula);
  const rolledAmount = dice?.type === "dice_test" ? Number(dice.data["总计"] ?? dice.data["结果"] ?? 0) : amountRoll?.total;
  const rawAmount = Number.isFinite(Number(rolledAmount)) ? Number(rolledAmount) : undefined;
  const damageAction = isDamagingAction(actor, target, skill);
  const openingDmgBonus = (actor as any).openingAtkBonus ?? 0;
  const tunedAmount = rawAmount !== undefined ? rawAmount + (damageAction ? openingDmgBonus : 0) : undefined;
  const displayFormula = formatSkillFormulaForPlayer(skill);
  const displayEffect = formatSkillEffectForPlayer(skill);

  if (!dice) {
    const narration = buildKpNarration({ actor, target, skill, dice, outcome: "trigger" });
    return {
      id: Date.now(),
      actorName: actor.name,
      targetName: target.name,
      skillName: skill.name,
      title: "触发/预设生效",
      formula: displayFormula,
      resultLine: diceLine(null),
      detail: `${target.name} 已被指定为 ${skill.name} 的对象。${displayEffect}`,
      narration,
    };
  }

  if (dice.type === "attack_roll") {
    const success = Boolean(dice.data["命中"]);
    const d20 = getD20Roll(dice);
    const finalAmount = success ? tunedAmount : undefined;
    const outcome = success ? "hit" : "miss";
    const narration = buildKpNarration({ actor, target, skill, dice, amount: finalAmount, outcome });
    return {
      id: Number(dice.data.id ?? Date.now()),
      actorName: actor.name,
      targetName: target.name,
      skillName: skill.name,
      title: success ? "攻击命中" : "攻击未命中",
      formula: displayFormula,
      resultLine: diceLine(dice),
      amount: finalAmount,
      success,
      detail: success
        ? `${target.name} 已被命中，接下来投掷伤害骰 ${formatDamageFormulaForPlayer(skill.formula)}。`
        : `D20 ${d20 || "?"} 未达到 AC ${dice.data["目标AC"] ?? "?"}，${target.name} 未被命中，本次攻击结束。`,
      narration,
    };
  }

  if (dice.type === "dice_test" && skill.roll.kind === "attack") {
    const primaryTargetBonus = skill.primaryTargetBonus ?? 0;
    const finalAmount = tunedAmount !== undefined ? tunedAmount + primaryTargetBonus : undefined;
    const damageFormula = formatDamageFormulaForPlayer(skill.formula);
    const narration = buildKpNarration({ actor, target, skill, dice, amount: finalAmount, outcome: "hit" });
    return {
      id: Number(dice.data.id ?? Date.now()),
      actorName: actor.name,
      targetName: target.name,
      skillName: skill.name,
      title: "攻击命中",
      formula: `伤害：${damageFormula}`,
      resultLine: diceLine(dice),
      amount: finalAmount,
      success: Boolean(finalAmount),
      detail: primaryTargetBonus > 0
        ? `命中后投掷伤害骰 ${damageFormula}，骰点合计 ${tunedAmount ?? 0}；敌方全体受到 ${tunedAmount ?? 0} 点伤害，主目标 ${target.name} 额外受到 ${primaryTargetBonus} 点伤害（共 ${finalAmount ?? 0} 点）。${displayEffect}`
        : `命中后投掷伤害骰 ${damageFormula}，造成 ${finalAmount ?? 0} 点伤害。${displayEffect}`,
      narration,
    };
  }

  if (dice.type === "dice_test" && skill.roll.kind === "damage") {
    const finalAmount = tunedAmount;
    const damageFormula = formatDamageFormulaForPlayer(skill.formula);
    const groupText = isGroupDamageSkill(skill) ? "所有敌对目标" : target.name;
    const narration = buildKpNarration({ actor, target, skill, dice, amount: finalAmount, outcome: "hit" });
    return {
      id: Number(dice.data.id ?? Date.now()),
      actorName: actor.name,
      targetName: target.name,
      skillName: skill.name,
      title: "自动伤害",
      formula: `伤害：${damageFormula}`,
      resultLine: diceLine(dice),
      amount: finalAmount,
      success: Boolean(finalAmount),
      detail: `${skill.name} 无需命中或豁免，${groupText} 受到 ${finalAmount ?? 0} 点伤害。${displayEffect}`,
      narration,
    };
  }

  if (dice.type === "skill_check" && skill.roll.kind === "save") {
    const targetSaved = Boolean(dice.data["成功"]);
    const finalAmount = tunedAmount ? Math.max(1, Math.round(tunedAmount * (targetSaved ? 0.5 : 1))) : undefined;
    const outcome = targetSaved ? "save-half" : "save-full";
    const narration = buildKpNarration({ actor, target, skill, dice, amount: finalAmount, outcome });
    return {
      id: Number(dice.data.id ?? Date.now()),
      actorName: actor.name,
      targetName: target.name,
      skillName: skill.name,
      title: targetSaved ? "目标豁免成功（半效）" : "目标豁免失败",
      formula: displayFormula,
      resultLine: diceLine(dice),
      amount: finalAmount,
      success: Boolean(finalAmount),
      detail: targetSaved
        ? `${target.name} 通过豁免，效果减弱为半效。${amountRoll ? `基础伤害骰：${amountRoll.detail}。` : ""}`
        : `${target.name} 豁免失败，技能完整生效。${amountRoll ? `基础伤害骰：${amountRoll.detail}。` : ""}${displayEffect}`,
      narration,
    };
  }

  if (dice.type === "skill_check") {
    const success = Boolean(dice.data["成功"]);
    const finalAmount = success ? tunedAmount : undefined;
    const narration = buildKpNarration({ actor, target, skill, dice, amount: finalAmount, outcome: success ? "check" : "miss" });
    return {
      id: Number(dice.data.id ?? Date.now()),
      actorName: actor.name,
      targetName: target.name,
      skillName: skill.name,
      title: success ? "检定成功" : "检定失败",
      formula: displayFormula,
      resultLine: diceLine(dice),
      amount: finalAmount,
      success,
      detail: success
        ? `${displayEffect}${amountRoll ? ` 结算骰：${amountRoll.detail}。` : ""}`
        : "本次检定失败，技能主要效果不触发。",
      narration,
    };
  }

  const narration = buildKpNarration({ actor, target, skill, dice, amount: tunedAmount, outcome: isHealingSkill(skill) ? "heal" : "check" });
  return {
    id: Number(dice.data.id ?? Date.now()),
    actorName: actor.name,
    targetName: target.name,
    skillName: skill.name,
    title: skill.roll.kind === "healing" ? "治疗结算" : "骰子结算",
    formula: displayFormula,
    resultLine: diceLine(dice),
    amount: tunedAmount,
    success: true,
    detail: `${target.name} 获得 ${tunedAmount ?? 0} 点${skill.roll.kind === "healing" ? "治疗" : "效果值"}。${displayEffect}`,
    narration,
  };
}

function inferSaveAbility(skill: BattleSkill): AbilityKey {
  const text = `${skill.roll.label ?? ""} ${skill.formula} ${skill.effect}`;
  if (/CON|体质/.test(text)) return "con";
  if (/WIS|感知/.test(text)) return "wis";
  if (/STR|力量/.test(text)) return "str";
  if (/CHA|魅力/.test(text)) return "cha";
  if (/INT|智力/.test(text)) return "int";
  return "dex";
}

function rollSkillDice(unit: BattleUnit, skill: BattleSkill, target?: BattleUnit, advType?: "advantage" | "disadvantage" | null): DiceResult | null {
  if (skill.roll.kind === "none") return null;

  const now = Date.now();
  const fxKind = getBattleFxKind(unit, skill);

  const formulaDice = skill.roll.kind === "attack" ? null : rollFormulaDice(skill.formula);

  if (skill.roll.kind === "attack") {
    const roll1 = rollD20();
    const roll2 = (advType && advType !== "advantage" && advType !== "disadvantage") ? 0 : (advType ? rollD20() : 0);
    const useAdv = advType && roll2 > 0;
    const finalRoll = useAdv
      ? (advType === "advantage" ? Math.max(roll1, roll2) : Math.min(roll1, roll2))
      : roll1;
    const abilityMod = abilityModifier(unit.abilities[skill.roll.ability ?? "str"]);
    const bonus = abilityMod + unit.proficiency + (skill.roll.bonus ?? 0) + (unit.faction === "ally" ? BATTLE_TUNING.allyHitBonus : 0) + ((unit as any).openingHitBonus ?? 0);
    const total = finalRoll + bonus;
    const targetAc = target?.ac ?? skill.roll.targetAc ?? 14;

    const hitResult = finalRoll === 20 || (finalRoll !== 1 && total >= targetAc);

    return {
      type: "attack_roll",
      data: {
        骰子: "D20",
        武器: `${unit.name}：${skill.name}`,
        攻击掷骰: `D20=${finalRoll}`,
        加值: bonus,
        属性加值: abilityMod,
        熟练加值: unit.proficiency,
        其他效果加成: (skill.roll.bonus ?? 0) + (unit.faction === "ally" ? BATTLE_TUNING.allyHitBonus : 0) + ((unit as any).openingHitBonus ?? 0),
        总计: total,
        目标AC: targetAc,
        命中: hitResult,
        特效类型: fxKind,
        fxKind,
        effectKind: fxKind,
        id: now,
        优势掷骰: useAdv ? advType : undefined,
        优势骰: useAdv ? [roll1, roll2] : undefined,
      },
    };
  }

  if (skill.roll.kind === "ability") {
    const roll = rollD20();
    const abilityMod = abilityModifier(unit.abilities[skill.roll.ability ?? "str"]);
    const bonus = abilityMod + unit.proficiency + (skill.roll.bonus ?? 0) + (unit.faction === "ally" ? BATTLE_TUNING.allyHitBonus : 0) + ((unit as any).openingHitBonus ?? 0);
    const total = roll + bonus;
    const dc = (skill.roll.dc ?? 13) + (unit.faction === "ally" ? BATTLE_TUNING.allySaveDcBonus : 0);

    return {
      type: "skill_check",
      data: {
        骰子: "D20",
        属性: `${unit.name}：${skill.roll.label ?? skill.name}`,
        掷骰: `D20=${roll}`,
        加值: bonus,
        总计: total,
        DC: dc,
        成功: roll === 20 || (roll !== 1 && total >= dc),
        特效类型: fxKind,
        fxKind,
        effectKind: fxKind,
        id: now,
        附带伤害骰: formulaDice ? true : false,
        伤害骰面: formulaDice?.dieType,
        伤害骰数: formulaDice?.count,
        全部伤害掷骰: formulaDice?.rolls,
        伤害加值: formulaDice?.bonus ?? 0,
        伤害总计: formulaDice?.total ?? 0,
      },
    };
  }

  if (skill.roll.kind === "save") {
    const roll = rollD20();
    const saveAbility = inferSaveAbility(skill);
    const bonus = target ? abilityModifier(target.abilities[saveAbility]) : skill.roll.targetSaveBonus ?? 2;
    const total = roll + bonus;
    const dc = (skill.roll.dc ?? 13) + (unit.faction === "ally" ? BATTLE_TUNING.allySaveDcBonus : 0);

    return {
      type: "skill_check",
      data: {
        骰子: "D20",
        属性: `${skill.roll.label ?? "目标豁免"}：${skill.name}`,
        掷骰: `D20=${roll}`,
        加值: bonus,
        总计: total,
        DC: dc,
        成功: roll === 20 || (roll !== 1 && total >= dc),
        特效类型: fxKind,
        fxKind,
        effectKind: fxKind,
        id: now,
        附带伤害骰: formulaDice ? true : false,
        伤害骰面: formulaDice?.dieType,
        伤害骰数: formulaDice?.count,
        全部伤害掷骰: formulaDice?.rolls,
        伤害加值: formulaDice?.bonus ?? 0,
        伤害总计: formulaDice?.total ?? 0,
      },
    };
  }

  const dieType = skill.roll.dieType ?? "d6";
  const count = skill.roll.diceCount ?? 1;
  const sides = sidesFromDieType(dieType);
  const rolls = Array.from({ length: count }, () => rollDie(sides));
  const rawTotal = rolls.reduce((sum, value) => sum + value, 0);
  const bonus = skill.roll.bonus ?? 0;
  const total = rawTotal + bonus;

  return {
    type: "dice_test",
    data: {
      骰子: dieType.toUpperCase(),
      属性: `${unit.name}：${skill.roll.label ?? skill.name}`,
      掷骰: `${dieType.toUpperCase()}=${rolls[0]}`,
      结果: rolls[0],
      骰数: count,
      骰面: dieType,
      全部掷骰: rolls,
      加值: bonus,
      总计: total,
      描述: count > 1 ? `${count}${dieType} 合计 ${rolls.join(" + ")} = ${rawTotal}` : "结果已生成",
      特效类型: fxKind,
      fxKind,
      effectKind: fxKind,
      id: now,
    },
  };
}

/* ===== 技能名→特效类型 ===== */
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

      <DiceRollOverlay
        dice={activeDice}
        dieType="d20"
        attackMode={attackPhase === "d20" || attackPhase === "save"}
        attackMissed={attackPhase === "d20" && pendingAttackRef.current?.hit === false}
        targetAc={pendingAttackRef.current?.target.ac ?? 0}
        diceKind={
          attackPhase === "d20" ? "命中判定" :
          attackPhase === "save" ? "豁免掷骰" :
          attackPhase === "damage" ? "伤害掷骰" :
          activeDice?.type === "skill_check" ?
            (activeDice.data["成功"] !== undefined && activeDice.data["DC"] ? "豁免掷骰" : "检定掷骰") :
          activeDice?.data["骰子"]?.includes("D") && Number(activeDice.data["总计"]) > 0 ?
            (activeDice.data["属性"]?.includes("治疗") || activeDice.data["属性"]?.includes("恢复") ? "治疗掷骰" :
              activeDice.data["属性"]?.includes("伤害") ? "伤害掷骰" : "投骰结果") :
          "投骰结果"
        }
        charSkill={
          pendingAttackRef.current
            ? `${pendingAttackRef.current.unit.name} · ${pendingAttackRef.current.skill.name}`
            : activeDice?.data["武器"] || activeDice?.data["属性"] || ""
        }
        showD20Calc={attackPhase === "d20" || attackPhase === "save"}
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
