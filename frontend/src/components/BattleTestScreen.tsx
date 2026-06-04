import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Dice3DView, DiceRollOverlay, type DieType } from "./DiceRollOverlay";
import type { DiceResult } from "../types/game";

interface BattleTestScreenProps {
  onBack: () => void;
}

type Faction = "ally" | "enemy";
type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";
type BattleResource = "移动" | "动作" | "附赠动作" | "自由互动" | "反应";
type BattlePhase = "initiative" | "battle";
type RollKind = "attack" | "ability" | "save" | "healing" | "damage" | "none";

interface SkillRollSpec {
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

interface BattleSkill {
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
  trigger?: string;
  locked?: boolean;
}

interface NonCombatSkill {
  name: string;
  check: string;
  effect: string;
}

interface BattleUnit {
  id: string;
  name: string;
  faction: Faction;
  role: string;
  portrait: string;
  model: "adventurer" | "grum" | "lisa" | "talia" | "templar" | "shade";
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

interface BattleEffect {
  id: number;
  actorName: string;
  targetName: string;
  skillName: string;
  title: string;
  formula: string;
  resultLine: string;
  detail: string;
  amount?: number;
  success?: boolean;
}

const ABILITY_LABELS: Array<[AbilityKey, string]> = [
  ["str", "力量"],
  ["dex", "敏捷"],
  ["con", "体质"],
  ["int", "智力"],
  ["wis", "感知"],
  ["cha", "魅力"],
];

const ACTION_RESOURCES: Array<{ name: BattleResource; count: string; example: string; rule: string }> = [
  { name: "移动", count: "1 次移动额度", example: "走路、攀爬、跳跃", rule: "可拆分在动作前后，倒地起身消耗一半速度。" },
  { name: "动作", count: "1 次", example: "攻击、施法、疾走", rule: "本回合主要行动；攻击/施法/闪避/协助等互斥。" },
  { name: "附赠动作", count: "视能力而定", example: "回气、双持、职业技能", rule: "只有技能或法术明确写明时才能使用。" },
  { name: "自由互动", count: "通常 1 次", example: "拔剑、开门、取物", rule: "2024 规则中拔/收武器可作为攻击动作一部分。" },
  { name: "反应", count: "每轮 1 次", example: "借机攻击、护盾术、护卫", rule: "在其他角色回合触发，自己的回合开始时刷新。" },
];

const BASIC_ACTIONS = [
  { name: "攻击", summary: "D20 + 属性调整值 + 熟练加值 >= 目标 AC。" },
  { name: "施法", summary: "按法术描述进行攻击、豁免或自动生效。" },
  { name: "疾走", summary: "本回合获得额外移动，等于速度值。" },
  { name: "撤离", summary: "本回合移动不会触发借机攻击。" },
  { name: "闪避", summary: "敌人攻击你有劣势，你的敏捷豁免有优势。" },
  { name: "协助", summary: "让盟友下一次攻击或技能检定获得优势。" },
  { name: "躲藏", summary: "DEX 潜行 vs 感知察觉，成功后获得隐形。" },
  { name: "准备", summary: "设定触发条件，之后用反应执行。" },
  { name: "搜索", summary: "感知察觉或智力调查寻找隐藏目标。" },
  { name: "使用物件", summary: "激活道具、机关或需要动作的物品。" },
];

const QUICK_RULES = [
  { title: "先攻", text: "1D20 + 敏捷调整值 + 其他加值；同分时我方优先，其次比较敏捷。" },
  { title: "命中", text: "D20 + 属性调整值 + 熟练加值 >= AC；20 自动命中，1 自动未命中。" },
  { title: "优势", text: "优势投 2 次取高，劣势投 2 次取低；同时存在时互相抵消。" },
  { title: "专注", text: "受伤后进行体质豁免，DC 为 10 或伤害一半取高。" },
];

const BACKGROUND_URL = "/assets/battle/b1-sanctum-placeholder.png";

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
        formula: "恢复 1d10 + 战士等级",
        effect: "立即恢复生命值，用于测试治疗骰和附赠动作占用。",
        cooldown: "每次短休 1 次",
        rule: "HP 与恢复",
        roll: { kind: "healing", dieType: "d10", diceCount: 1, bonus: 3, label: "回气恢复量" },
        tags: ["治疗", "D10", "短休"],
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
    hp: 56,
    maxHp: 56,
    ac: 18,
    speed: 30,
    proficiency: 2,
    abilities: { str: 18, dex: 11, con: 16, int: 10, wis: 12, cha: 14 },
    weaponMastery: "巨剑 Graze / 腐化光环",
    resourceProfile: ["动作高伤", "附赠黯蚀", "反应招架"],
    statuses: ["腐化", "重甲", "首领"],
    traits: ["HP56 / AC18", "STR +4", "重甲威压", "灰烬腐化抗性"],
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
    hp: 18,
    maxHp: 18,
    ac: 14,
    speed: 35,
    proficiency: 2,
    abilities: { str: 10, dex: 16, con: 12, int: 8, wis: 11, cha: 7 },
    resourceProfile: ["动作爪击", "附赠位移", "反应撤影"],
    statuses: ["轻盈", "灰烬之裔"],
    traits: ["HP18 / AC14", "DEX +3", "速度 35 尺", "受光耀/龙火克制"],
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
    hp: 18,
    maxHp: 18,
    ac: 14,
    speed: 35,
    proficiency: 2,
    abilities: { str: 10, dex: 16, con: 12, int: 8, wis: 11, cha: 7 },
    resourceProfile: ["动作爪击", "附赠位移", "反应撤影"],
    statuses: ["轻盈", "灰烬之裔"],
    traits: ["HP18 / AC14", "DEX +3", "速度 35 尺", "受光耀/龙火克制"],
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

function abilityModifier(score: number) {
  return Math.floor((score - 10) / 2);
}

function formatModifier(value: number) {
  return value >= 0 ? `+${value}` : String(value);
}

function rollDie(sides: number) {
  return Math.floor(Math.random() * sides) + 1;
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

function sortInitiative(entries: InitiativeEntry[], unitMap: Map<string, BattleUnit>) {
  return [...entries].sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    if (b.dexMod !== a.dexMod) return b.dexMod - a.dexMod;

    const unitA = unitMap.get(a.unitId);
    const unitB = unitMap.get(b.unitId);
    if (unitA?.faction !== unitB?.faction) return unitA?.faction === "ally" ? -1 : 1;
    return BATTLE_UNITS.findIndex((unit) => unit.id === a.unitId) - BATTLE_UNITS.findIndex((unit) => unit.id === b.unitId);
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
  if (skill.name === "回气" || skill.tags.includes("临时HP") || skill.name === "烟中恶鬼") return [unit];
  if (skill.roll.kind === "healing") return allies;
  if (skill.roll.kind === "none" && skill.tags.some((tag) => ["护卫", "抗性", "减伤"].includes(tag))) return allies;
  if (unit.faction === "ally") return enemies;
  return allies;
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

function buildBattleEffect(actor: BattleUnit, target: BattleUnit, skill: BattleSkill, dice: DiceResult | null): BattleEffect {
  const amountRoll = rollFormulaAmount(skill.formula);
  const amount = dice?.type === "dice_test" ? Number(dice.data["总计"] ?? dice.data["结果"] ?? 0) : amountRoll?.total;

  if (!dice) {
    return {
      id: Date.now(),
      actorName: actor.name,
      targetName: target.name,
      skillName: skill.name,
      title: "触发/预设生效",
      formula: skill.formula,
      resultLine: diceLine(null),
      detail: `${target.name} 已被指定为 ${skill.name} 的对象。${skill.effect}`,
    };
  }

  if (dice.type === "attack_roll") {
    const success = Boolean(dice.data["命中"]);
    return {
      id: Number(dice.data.id ?? Date.now()),
      actorName: actor.name,
      targetName: target.name,
      skillName: skill.name,
      title: success ? "攻击命中" : "攻击未命中",
      formula: skill.formula,
      resultLine: diceLine(dice),
      amount: success ? amount : undefined,
      success,
      detail: success
        ? `${target.name} 受到${amount ? `约 ${amount} 点` : ""}效果结算。${amountRoll ? `伤害骰：${amountRoll.detail}。` : ""}${skill.effect}`
        : `${target.name} 未被命中，本次主要效果不触发。若技能有 Graze、半伤或后续豁免，后续规则引擎会继续处理。`,
    };
  }

  if (dice.type === "skill_check" && skill.roll.kind === "save") {
    const targetSaved = Boolean(dice.data["成功"]);
    return {
      id: Number(dice.data.id ?? Date.now()),
      actorName: actor.name,
      targetName: target.name,
      skillName: skill.name,
      title: targetSaved ? "目标豁免成功" : "目标豁免失败",
      formula: skill.formula,
      resultLine: diceLine(dice),
      amount: amountRoll?.total,
      success: !targetSaved,
      detail: targetSaved
        ? `${target.name} 通过豁免，效果减弱或按规则改为半伤。${amountRoll ? `基础伤害骰：${amountRoll.detail}。` : ""}`
        : `${target.name} 豁免失败，技能完整生效。${amountRoll ? `基础伤害骰：${amountRoll.detail}，合计 ${amountRoll.total}。` : ""}${skill.effect}`,
    };
  }

  if (dice.type === "skill_check") {
    const success = Boolean(dice.data["成功"]);
    return {
      id: Number(dice.data.id ?? Date.now()),
      actorName: actor.name,
      targetName: target.name,
      skillName: skill.name,
      title: success ? "检定成功" : "检定失败",
      formula: skill.formula,
      resultLine: diceLine(dice),
      amount: success ? amount : undefined,
      success,
      detail: success
        ? `${skill.effect}${amountRoll ? ` 结算骰：${amountRoll.detail}，合计 ${amountRoll.total}。` : ""}`
        : "本次检定失败，技能主要效果不触发。",
    };
  }

  return {
    id: Number(dice.data.id ?? Date.now()),
    actorName: actor.name,
    targetName: target.name,
    skillName: skill.name,
    title: skill.roll.kind === "healing" ? "治疗结算" : "骰子结算",
    formula: skill.formula,
    resultLine: diceLine(dice),
    amount,
    success: true,
    detail: `${target.name} 获得 ${amount ?? 0} 点${skill.roll.kind === "healing" ? "治疗" : "效果值"}。${skill.effect}`,
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

function rollSkillDice(unit: BattleUnit, skill: BattleSkill, target?: BattleUnit): DiceResult | null {
  if (skill.roll.kind === "none") return null;

  const now = Date.now();

  if (skill.roll.kind === "attack") {
    const roll = rollD20();
    const abilityMod = abilityModifier(unit.abilities[skill.roll.ability ?? "str"]);
    const bonus = abilityMod + unit.proficiency + (skill.roll.bonus ?? 0);
    const total = roll + bonus;
    const targetAc = target?.ac ?? skill.roll.targetAc ?? 14;

    return {
      type: "attack_roll",
      data: {
        骰子: "D20",
        武器: `${unit.name}：${skill.name}`,
        攻击掷骰: `D20=${roll}`,
        加值: bonus,
        总计: total,
        目标AC: targetAc,
        命中: roll === 20 || (roll !== 1 && total >= targetAc),
        id: now,
      },
    };
  }

  if (skill.roll.kind === "ability") {
    const roll = rollD20();
    const abilityMod = abilityModifier(unit.abilities[skill.roll.ability ?? "str"]);
    const bonus = abilityMod + unit.proficiency + (skill.roll.bonus ?? 0);
    const total = roll + bonus;
    const dc = skill.roll.dc ?? 13;

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
        id: now,
      },
    };
  }

  if (skill.roll.kind === "save") {
    const roll = rollD20();
    const saveAbility = inferSaveAbility(skill);
    const bonus = target ? abilityModifier(target.abilities[saveAbility]) : skill.roll.targetSaveBonus ?? 2;
    const total = roll + bonus;
    const dc = skill.roll.dc ?? 13;

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
        id: now,
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
      加值: bonus,
      总计: total,
      描述: count > 1 ? `${count}${dieType} 合计 ${rolls.join(" + ")} = ${rawTotal}` : "结果已生成",
      id: now,
    },
  };
}

export function BattleTestScreen({ onBack }: BattleTestScreenProps) {
  const [initiative, setInitiative] = useState(() => buildInitiative(BATTLE_UNITS));
  const [phase, setPhase] = useState<BattlePhase>("initiative");
  const [rollRunId, setRollRunId] = useState(1);
  const [turnIndex, setTurnIndex] = useState(0);
  const [unitHp, setUnitHp] = useState(() => Object.fromEntries(BATTLE_UNITS.map((unit) => [unit.id, unit.hp])));
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [actionUnitId, setActionUnitId] = useState<string | null>(null);
  const [targetSelection, setTargetSelection] = useState<TargetSelection | null>(null);
  const [activeDice, setActiveDice] = useState<DiceResult | null>(null);
  const [lastEffect, setLastEffect] = useState<BattleEffect | null>(null);
  const enemyActingKeyRef = useRef<string | null>(null);
  const [usedResources, setUsedResources] = useState<Record<string, Partial<Record<BattleResource, boolean>>>>({});
  const [battleLog, setBattleLog] = useState<string[]>([
    "战斗测试按 DND 战斗规则详解与职业/队友技能 V2 初始化。",
  ]);

  const battleUnits = useMemo(
    () =>
      BATTLE_UNITS.map((unit) => ({
        ...unit,
        hp: Math.max(0, Math.min(unit.maxHp, unitHp[unit.id] ?? unit.hp)),
      })),
    [unitHp],
  );
  const unitMap = useMemo(() => new Map(battleUnits.map((unit) => [unit.id, unit])), [battleUnits]);
  const orderedInitiative = useMemo(() => sortInitiative(initiative, unitMap), [initiative, unitMap]);
  const activeEntry = orderedInitiative[turnIndex % orderedInitiative.length];
  const activeUnit = activeEntry ? unitMap.get(activeEntry.unitId) : undefined;
  const activeUnitId = activeUnit?.id;
  const activeFaction = activeUnit?.faction;
  const selectedUnit = selectedUnitId ? unitMap.get(selectedUnitId) : undefined;
  const actionUnit = actionUnitId ? unitMap.get(actionUnitId) : undefined;
  const allies = useMemo(() => battleUnits.filter((unit) => unit.faction === "ally"), [battleUnits]);
  const enemies = useMemo(() => battleUnits.filter((unit) => unit.faction === "enemy"), [battleUnits]);
  const pendingSkill = targetSelection
    ? unitMap.get(targetSelection.unitId)?.skills.find((skill) => skill.id === targetSelection.skillId)
    : undefined;
  const pendingActor = targetSelection ? unitMap.get(targetSelection.unitId) : undefined;
  const pendingTargets = pendingActor && pendingSkill ? getTargetCandidates(pendingActor, pendingSkill, allies, enemies) : [];
  const pendingTargetIds = useMemo(() => new Set(pendingTargets.map((unit) => unit.id)), [pendingTargets]);
  const enemyTurn = phase === "battle" && activeUnit?.faction === "enemy";

  const completeInitiative = useCallback(() => setPhase("battle"), []);

  function pushBattleLog(line: string) {
    setBattleLog((current) => [line, ...current].slice(0, 4));
  }

  function rerollInitiative() {
    setInitiative(buildInitiative(BATTLE_UNITS));
    setPhase("initiative");
    setRollRunId((id) => id + 1);
    setTurnIndex(0);
    setSelectedUnitId(null);
    setActionUnitId(null);
    setTargetSelection(null);
    setActiveDice(null);
    setLastEffect(null);
    enemyActingKeyRef.current = null;
    setUnitHp(Object.fromEntries(BATTLE_UNITS.map((unit) => [unit.id, unit.hp])));
    setUsedResources({});
    pushBattleLog("重新进行全员 1D20 先攻判定。");
  }

  function nextTurn() {
    setTurnIndex((index) => (index + 1) % orderedInitiative.length);
    setActionUnitId(null);
    setTargetSelection(null);
    setUsedResources({});
    setActiveDice(null);
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

  function resolveAction(unit: BattleUnit, skill: BattleSkill, target: BattleUnit) {
    if (skill.locked || resourceIsSpent(skill.resource, usedResources[unit.id] ?? {})) return;

    setUsedResources((current) => ({
      ...current,
      [unit.id]: {
        ...(current[unit.id] ?? {}),
        [skill.resource]: true,
      },
    }));

    const dice = rollSkillDice(unit, skill, target);
    const effect = buildBattleEffect(unit, target, skill, dice);
    applyHpEffect(target, skill, effect);
    setTargetSelection(null);
    setLastEffect(effect);
    pushBattleLog(`${unit.name} 对 ${target.name} 使用 ${skill.name}：${effect.title}`);
    if (dice) setActiveDice(dice);
  }

  function applyHpEffect(target: BattleUnit, skill: BattleSkill, effect: BattleEffect) {
    if (!effect.amount || effect.amount <= 0) return;

    if (skill.roll.kind === "healing") {
      setUnitHp((current) => ({
        ...current,
        [target.id]: Math.min(target.maxHp, (current[target.id] ?? target.hp) + effect.amount!),
      }));
      return;
    }

    if (effect.success) {
      setUnitHp((current) => ({
        ...current,
        [target.id]: Math.max(0, (current[target.id] ?? target.hp) - effect.amount!),
      }));
    }
  }

  function handleChooseSkill(unit: BattleUnit, skill: BattleSkill) {
    if (unit.faction !== "ally" || unit.id !== activeUnit?.id || skill.locked || resourceIsSpent(skill.resource, usedResources[unit.id] ?? {})) return;

    setTargetSelection({ unitId: unit.id, skillId: skill.id });
    pushBattleLog(`${unit.name} 准备 ${skill.name}，等待指定释放对象。`);
  }

  useEffect(() => {
    if (phase !== "battle" || !activeUnitId || activeFaction !== "enemy") return;

    const actingUnit = unitMap.get(activeUnitId);
    if (!actingUnit) return;

    const actionKey = `${turnIndex}-${activeUnitId}`;
    if (enemyActingKeyRef.current === actionKey) return;

    enemyActingKeyRef.current = actionKey;
    setActionUnitId(null);
    setTargetSelection(null);
    pushBattleLog(`${actingUnit.name} 的敌方回合开始，我方操作锁定。`);

    const currentAllies = [...unitMap.values()].filter((unit) => unit.faction === "ally");
    const currentEnemies = [...unitMap.values()].filter((unit) => unit.faction === "enemy");
    const skill = actingUnit.skills.find((item) => item.resource === "动作") ?? actingUnit.skills[0];
    const targetPool = getTargetCandidates(actingUnit, skill, currentAllies, currentEnemies);
    const target = targetPool.reduce((lowest, candidate) => (candidate.hp < lowest.hp ? candidate : lowest), targetPool[0]);

    const rollTimer = window.setTimeout(() => {
      const dice = rollSkillDice(actingUnit, skill, target);
      const effect = buildBattleEffect(actingUnit, target, skill, dice);
      applyHpEffect(target, skill, effect);
      setLastEffect(effect);
      pushBattleLog(`${actingUnit.name} 自动对 ${target.name} 使用 ${skill.name}：${effect.title}`);
      if (dice) setActiveDice(dice);
    }, 780);

    const endTimer = window.setTimeout(() => {
      setTurnIndex((index) => (index + 1) % orderedInitiative.length);
      setUsedResources({});
      setActiveDice(null);
      setTargetSelection(null);
      enemyActingKeyRef.current = null;
    }, 5600);

    return () => {
      window.clearTimeout(rollTimer);
      window.clearTimeout(endTimer);
    };
  }, [activeFaction, activeUnitId, orderedInitiative.length, phase, turnIndex]);

  return (
    <main className="battle-test-screen">
      <div className="battle-background" style={{ backgroundImage: `url(${BACKGROUND_URL})` }} />
      <div className="battle-overlay" />

      <header className="battle-hud-header">
        <div>
          <p className="eyebrow">B1 COMBAT RULE SANDBOX</p>
          <h1>B1 层战斗测试</h1>
          <small>加载《职业与队友技能体系 V2》与《DND战斗规则详解》：动作经济、先攻、攻击/豁免/治疗骰。</small>
        </div>
        <div className="battle-hud-actions">
          <button type="button" className="ghost-button" onClick={rerollInitiative}>
            重投先攻
          </button>
          <button type="button" className="ghost-button" onClick={nextTurn} disabled={phase !== "battle" || enemyTurn}>
            下一行动
          </button>
          <button type="button" className="ghost-button" onClick={onBack}>
            返回测试
          </button>
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
              className={`initiative-token ${isActive ? "is-active" : ""} ${unit.faction === "enemy" ? "is-enemy" : "is-ally"}`}
              onClick={() => setSelectedUnitId(unit.id)}
              aria-current={isActive ? "true" : undefined}
            >
              <span className={`battle-avatar-mark battle-avatar-${unit.model}`}>{unit.portrait}</span>
              <span className="initiative-token-copy">
                <b>{unit.name}</b>
                <small>
                  {entry.roll} {formatModifier(entry.dexMod)}
                  {entry.otherBonus ? ` ${formatModifier(entry.otherBonus)}` : ""} = {entry.total}
                </small>
              </span>
              <i>{index + 1}</i>
            </button>
          );
        })}
      </section>

      <section className="battle-rules-dock" aria-label="规则速查">
        {QUICK_RULES.map((rule) => (
          <article key={rule.title}>
            <b>{rule.title}</b>
            <span>{rule.text}</span>
          </article>
        ))}
      </section>

      {enemyTurn && activeUnit && (
        <section className="battle-enemy-turn-lock" aria-label="敌方回合">
          <b>敌方回合</b>
          <span>{activeUnit.name} 正在自动行动，我方操作暂时锁定。</span>
        </section>
      )}

      <RosterPanel title="我方" units={allies} activeUnitId={activeUnit?.id} onSelect={setSelectedUnitId} />
      <RosterPanel title="敌方" units={enemies} activeUnitId={activeUnit?.id} onSelect={setSelectedUnitId} align="right" />

      <section className="battle-field" aria-label="战斗场景">
        <div className="battle-side battle-side-ally">
          {allies.map((unit) => (
            <BattleModel
              key={unit.id}
              unit={unit}
              active={unit.id === activeUnit?.id && phase === "battle"}
              targetable={pendingTargetIds.has(unit.id)}
              onClick={() => handleModelClick(unit)}
            />
          ))}
        </div>
        <div className="battle-side battle-side-enemy">
          {enemies.map((unit) => (
            <BattleModel
              key={unit.id}
              unit={unit}
              active={unit.id === activeUnit?.id && phase === "battle"}
              targetable={pendingTargetIds.has(unit.id)}
              onClick={() => handleModelClick(unit)}
            />
          ))}
        </div>
      </section>

      <aside className="battle-log-panel" aria-label="战斗记录">
        <span>规则事件</span>
        {battleLog.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </aside>

      {lastEffect && <BattleEffectPanel effect={lastEffect} />}

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
          <UnitDetailModal
            key={selectedUnit.id}
            unit={selectedUnit}
            initiative={initiative.find((entry) => entry.unitId === selectedUnit.id)}
            onClose={() => setSelectedUnitId(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {actionUnit && !enemyTurn && actionUnit.id === activeUnit?.id && (
          <ActionPanel
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
          />
        )}
      </AnimatePresence>

      <DiceRollOverlay dice={activeDice} dieType="d20" onClose={() => setActiveDice(null)} />

      <AnimatePresence>
        {phase === "initiative" && (
          <InitiativeRollOverlay
            key={rollRunId}
            entries={initiative}
            unitMap={unitMap}
            onComplete={completeInitiative}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function InitiativeRollOverlay({
  entries,
  unitMap,
  onComplete,
}: {
  entries: InitiativeEntry[];
  unitMap: Map<string, BattleUnit>;
  onComplete: () => void;
}) {
  const [settled, setSettled] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const orderedResults = useMemo(() => sortInitiative(entries, unitMap), [entries, unitMap]);

  useEffect(() => {
    const settleTimer = window.setTimeout(() => setSettled(true), 1300);
    const revealTimer = window.setTimeout(() => setRevealed(true), 2200);
    const doneTimer = window.setTimeout(onComplete, 3900);

    return () => {
      window.clearTimeout(settleTimer);
      window.clearTimeout(revealTimer);
      window.clearTimeout(doneTimer);
    };
  }, [onComplete]);

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
          <h2>同时投掷先攻</h2>
          <small>7 位单位同时进行 1D20 判定：D20 + 敏捷调整值 + 其他加值。</small>
        </header>

        <div className="battle-init-roll-grid">
          {entries.map((entry) => {
            const unit = unitMap.get(entry.unitId);
            if (!unit) return null;
            const rank = orderedResults.findIndex((item) => item.unitId === unit.id) + 1;

            return (
              <article key={unit.id} className={`battle-init-card ${revealed ? "is-revealed" : ""}`}>
                <span className={`battle-avatar-mark battle-avatar-${unit.model}`}>{unit.portrait}</span>
                <div className="battle-init-card-copy">
                  <b>{unit.name}</b>
                  <small>{unit.faction === "ally" ? "我方" : "敌方"}</small>
                </div>
                <Dice3DView
                  dieType="d20"
                  roll={entry.roll}
                  rolling={!settled}
                  revealed={revealed}
                  size={112}
                  className="battle-init-dice-wrap"
                />
                <p>
                  {revealed
                    ? `${entry.roll} ${formatModifier(entry.dexMod)}${entry.otherBonus ? ` ${formatModifier(entry.otherBonus)}` : ""} = ${entry.total}`
                    : settled ? "确认结果" : "掷骰中"}
                </p>
                {revealed && <i>第 {rank} 位</i>}
              </article>
            );
          })}
        </div>
      </motion.div>
    </motion.section>
  );
}

function RosterPanel({
  title,
  units,
  activeUnitId,
  align = "left",
  onSelect,
}: {
  title: string;
  units: BattleUnit[];
  activeUnitId?: string;
  align?: "left" | "right";
  onSelect: (unitId: string) => void;
}) {
  return (
    <aside className={`battle-roster battle-roster-${align}`}>
      <span className="battle-roster-title">{title}</span>
      {units.map((unit) => (
        <button
          key={unit.id}
          type="button"
          className={`battle-roster-unit ${unit.id === activeUnitId ? "is-active" : ""}`}
          onClick={() => onSelect(unit.id)}
        >
          <span className={`battle-avatar-mark battle-avatar-${unit.model}`}>{unit.portrait}</span>
          <span className="battle-roster-copy">
            <b>{unit.name}</b>
            <small>
              HP {unit.hp}/{unit.maxHp} · AC {unit.ac}
            </small>
            <span className="battle-mini-hp">
              <i style={{ width: `${getHpPercent(unit)}%` }} />
            </span>
          </span>
        </button>
      ))}
    </aside>
  );
}

function BattleModel({
  unit,
  active,
  targetable,
  onClick,
}: {
  unit: BattleUnit;
  active: boolean;
  targetable: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`battle-combatant ${active ? "is-active" : ""} ${targetable ? "is-targetable" : ""} ${unit.faction === "enemy" ? "is-enemy" : "is-ally"}`}
      onClick={onClick}
      aria-label={unit.name}
    >
      <span className={`battle-sprite battle-sprite-${unit.model}`}>
        <span className="sprite-aura" />
        <span className="sprite-head" />
        <span className="sprite-body" />
        <span className="sprite-weapon" />
      </span>
      <span className="battle-combatant-name">{unit.name}</span>
      <span className="battle-combatant-hp">
        <i style={{ width: `${getHpPercent(unit)}%` }} />
      </span>
    </button>
  );
}

function BattleEffectPanel({ effect }: { effect: BattleEffect }) {
  return (
    <motion.aside
      key={effect.id}
      className={`battle-effect-panel ${effect.success === false ? "is-fail" : ""}`}
      aria-label="回合效果"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span>本回合结算</span>
      <h2>{effect.title}</h2>
      <p>
        <b>{effect.actorName}</b> 对 <b>{effect.targetName}</b> 使用 <b>{effect.skillName}</b>
      </p>
      <strong>{effect.resultLine}</strong>
      {typeof effect.amount === "number" && <em>{effect.amount}</em>}
      <small>{effect.formula}</small>
      <p>{effect.detail}</p>
    </motion.aside>
  );
}

function UnitDetailModal({
  unit,
  initiative,
  onClose,
}: {
  unit: BattleUnit;
  initiative?: InitiativeEntry;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="battle-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.section
        className="battle-unit-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${unit.name} 详情`}
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="battle-modal-header">
          <div className={`battle-avatar-mark battle-avatar-${unit.model}`}>{unit.portrait}</div>
          <div>
            <span>{unit.name}</span>
            <small>{unit.role}</small>
          </div>
          <button type="button" aria-label="关闭" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="battle-detail-grid">
          <section className="battle-detail-block">
            <h2>状态</h2>
            <div className="battle-stat-row">
              <span>HP</span>
              <b>
                {unit.hp}/{unit.maxHp}
              </b>
            </div>
            <div className="battle-wide-hp">
              <i style={{ width: `${getHpPercent(unit)}%` }} />
            </div>
            <div className="battle-stat-row">
              <span>AC</span>
              <b>{unit.ac}</b>
            </div>
            <div className="battle-stat-row">
              <span>速度</span>
              <b>{unit.speed} 尺</b>
            </div>
            <div className="battle-stat-row">
              <span>熟练</span>
              <b>{formatModifier(unit.proficiency)}</b>
            </div>
            {initiative && (
              <div className="battle-stat-row">
                <span>先攻</span>
                <b>{initiative.total}</b>
              </div>
            )}
            {unit.weaponMastery && (
              <div className="battle-stat-note">
                <b>精通/资源</b>
                <span>{unit.weaponMastery}</span>
              </div>
            )}
            <div className="battle-status-list">
              {unit.statuses.map((status) => (
                <span key={status}>{status}</span>
              ))}
            </div>
          </section>

          <section className="battle-detail-block battle-abilities">
            <h2>六维数值</h2>
            {ABILITY_LABELS.map(([key, label]) => {
              const value = unit.abilities[key];
              return (
                <div key={key} className="battle-ability-tile">
                  <span>{label}</span>
                  <b>{value}</b>
                  <small>{formatModifier(abilityModifier(value))}</small>
                </div>
              );
            })}
          </section>

          <section className="battle-detail-block battle-traits">
            <h2>规则画像</h2>
            {unit.traits.map((trait) => (
              <span key={trait}>{trait}</span>
            ))}
            {unit.resourceProfile.map((profile) => (
              <span key={profile}>{profile}</span>
            ))}
          </section>

          <section className="battle-detail-block battle-skills">
            <h2>战斗技能</h2>
            {unit.skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} compact={false} />
            ))}
          </section>

          {unit.nonCombatSkills.length > 0 && (
            <section className="battle-detail-block battle-noncombat-skills">
              <h2>非战斗技能</h2>
              {unit.nonCombatSkills.map((skill) => (
                <article key={skill.name}>
                  <b>{skill.name}</b>
                  <small>{skill.check}</small>
                  <p>{skill.effect}</p>
                </article>
              ))}
            </section>
          )}
        </div>
      </motion.section>
    </motion.div>
  );
}

function SkillCard({ skill, compact = true }: { skill: BattleSkill; compact?: boolean }) {
  return (
    <article className={`battle-skill-card ${skill.locked ? "is-locked" : ""} ${compact ? "is-compact" : ""}`}>
      <div className="battle-skill-card-head">
        <span>{skill.resource}</span>
        <b>{skill.name}</b>
        <em>{skill.cooldown}</em>
      </div>
      <small>{skill.formula}</small>
      {!compact && <p>{skill.effect}</p>}
      <div className="battle-skill-meta">
        <i>{skillNeedsRoll(skill) ? "需掷骰" : "无掷骰"}</i>
        <i>{skill.rule}</i>
        {skill.trigger && <i>{skill.trigger}</i>}
        {skill.tags.map((tag) => (
          <i key={tag}>{tag}</i>
        ))}
      </div>
    </article>
  );
}

function ActionPanel({
  unit,
  usedResources,
  pendingSkill,
  pendingTargets,
  onInspect,
  onClose,
  onEndTurn,
  onChooseSkill,
  onSelectTarget,
  onCancelTarget,
}: {
  unit: BattleUnit;
  usedResources: Partial<Record<BattleResource, boolean>>;
  pendingSkill?: BattleSkill;
  pendingTargets: BattleUnit[];
  onInspect: () => void;
  onClose: () => void;
  onEndTurn: () => void;
  onChooseSkill: (skill: BattleSkill) => void;
  onSelectTarget: (target: BattleUnit) => void;
  onCancelTarget: () => void;
}) {
  return (
    <motion.section
      className="battle-action-sheet"
      role="dialog"
      aria-label={`${unit.name} 行动`}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 28 }}
    >
      <header>
        <div>
          <span>{unit.name} 的回合</span>
          <small>先选技能，再指定释放对象，随后进入骰子判定与效果结算。</small>
        </div>
        <div className="battle-action-buttons">
          <button type="button" className="ghost-button" onClick={onInspect}>
            详情
          </button>
          <button type="button" className="ghost-button" onClick={onClose}>
            收起
          </button>
          <button type="button" className="start-button" onClick={onEndTurn}>
            结束回合
          </button>
        </div>
      </header>

      <div className="battle-action-content">
        <section className="battle-resource-grid" aria-label="回合资源">
          {ACTION_RESOURCES.map((resource) => {
            const spent = resourceIsSpent(resource.name, usedResources);

            return (
              <article key={resource.name} className={spent ? "is-spent" : ""}>
                <b>{resource.name}</b>
                <span>{resource.count}</span>
                <small>{resource.example}</small>
                <em>{spent ? "已用" : "可用"}</em>
              </article>
            );
          })}
        </section>

        <section className="battle-action-skill-list" aria-label="可用技能">
          {unit.skills.map((skill) => {
            const spent = resourceIsSpent(skill.resource, usedResources);
            const disabled = spent || skill.locked;

            return (
              <button
                key={skill.id}
                type="button"
                className={`${disabled ? "is-disabled" : ""} ${pendingSkill?.id === skill.id ? "is-selected" : ""}`}
                disabled={disabled}
                onClick={() => onChooseSkill(skill)}
              >
                <span>{skill.resource}</span>
                <b>{skill.name}</b>
                <small>{skill.formula}</small>
                <em>{skillTargetHint(skill)}</em>
              </button>
            );
          })}
        </section>

        {pendingSkill && (
          <section className="battle-target-picker" aria-label="指定释放对象">
            <header>
              <div>
                <b>指定释放对象</b>
                <span>
                  {pendingSkill.name} · {skillTargetHint(pendingSkill)}
                </span>
              </div>
              <button type="button" className="ghost-button" onClick={onCancelTarget}>
                取消
              </button>
            </header>
            <div>
              {pendingTargets.map((target) => (
                <button key={target.id} type="button" onClick={() => onSelectTarget(target)}>
                  <span className={`battle-avatar-mark battle-avatar-${target.model}`}>{target.portrait}</span>
                  <b>{target.name}</b>
                  <small>
                    HP {target.hp}/{target.maxHp} · AC {target.ac}
                  </small>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="battle-basic-actions" aria-label="基础动作">
          {BASIC_ACTIONS.map((action) => (
            <article key={action.name}>
              <b>{action.name}</b>
              <span>{action.summary}</span>
            </article>
          ))}
        </section>
      </div>
    </motion.section>
  );
}
