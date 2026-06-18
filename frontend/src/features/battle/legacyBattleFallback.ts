import type { DiceResult } from '../../types/game';
import { rollDiceEvent } from '../../core/dice/createDiceEvent';
import type { AbilityKey, BattleSkill, BattleUnit } from '../../components/BattleTestScreen';
import type { DieType } from '../../components/DiceRollOverlay';

/**
 * @deprecated 仅用于旧存档 / 测试 / 权威战斗不可用时的兼容 fallback。
 * 正式主流程不得主动调用这里的规则。
 */

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

type BattleFxKind = "slash" | "bash" | "pierce" | "fire" | "ice" | "lightning" | "arcane" | "radiant" | "heal" | "fail" | "poison" | "shadow" | "wind" | "earth" | "water" | "shield" | "buff" | "debuff" | "critical";

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

function abilityModifier(score: number) {
  return Math.floor((score - 10) / 2);
}

export function rollDie(sides: number) {
  return rollDiceEvent('test', 'test', sides, 1, 0, { metadata: { deprecatedFallback: true } }).rolls[0];
}

export function rollD20() {
  return rollDie(20);
}

function sidesFromDieType(dieType: DieType) {
  return Number(dieType.replace("d", ""));
}

const DAMAGE_TYPE_WORDS_RE = /\s*(挥砍|钝击|穿刺|毒素|火焰|冷冻|寒冷|力场|立场|光耀|暗影|黯蚀|奥术|雷电|闪电|酸蚀|心灵|坏死|辐射)\s*/g;

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

function skillNameToFxKind(name: string): string {
  const m: [RegExp, string][] = [
    [/回气|治疗|愈合|恢复|修复|炖汤|heal|cure|restore/i, "heal"],
    [/火|炎|燃|灼|辣椒|flare|burn|flame/i, "fire"],
    [/冰|霜|冻|cold|frost|freeze/i, "ice"],
    [/雷|电|闪|lightning|shock|thunder/i, "lightning"],
    [/光|圣|耀|银钟|radiant|holy/i, "radiant"],
    [/毒|孢尘|poison|venom|toxic/i, "poison"],
    [/暗|影|shadow|dark|necrotic/i, "shadow"],
    [/风|箭雨|wind|gale|tempest/i, "wind"],
    [/钝|锤|锅|压制|bash|bludgeon|mace|hammer/i, "bash"],
    [/刺|穿|射击|pierce|stab|rapier/i, "pierce"],
    [/挥|砍|斩|爪|剑|斧|slash|cleave|sword|axe/i, "slash"],
    [/盾|护|格挡|guard|block|ward|shield/i, "shield"],
    [/祝福|增益|强化|印记|buff|bless/i, "buff"],
    [/诅咒|减益|debuff|curse/i, "debuff"],
    [/奥|秘|魔|牵引|arcane|spell|magic/i, "arcane"],
  ];
  for (const [re, kind] of m) {
    if (re.test(name)) return kind;
  }
  return "slash";
}

function getBattleFxKind(_unit: BattleUnit, skill: BattleSkill): BattleFxKind {
  if (skill.roll.kind === "healing") return "heal";
  return skillNameToFxKind(skill.name) as BattleFxKind;
}

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
export function rollDamageOnly(skill: BattleSkill, unitName: string): DiceResult | null {
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

export function buildBattleEffect(actor: BattleUnit, target: BattleUnit, skill: BattleSkill, dice: DiceResult | null): BattleEffect {
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

export function rollSkillDice(unit: BattleUnit, skill: BattleSkill, target?: BattleUnit, advType?: "advantage" | "disadvantage" | null): DiceResult | null {
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
