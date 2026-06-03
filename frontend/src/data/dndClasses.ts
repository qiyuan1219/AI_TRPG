import type { CharacterPreset, CompanionPreset } from '../types/game';

export const DND_CLASSES: CharacterPreset[] = [
  {
    id: 'warrior',
    name: '战士',
    mark: 'W',
    desc: '前排坦克，高 AC 高 HP。擅长把战斗压力拉到自己身上，也能用蛮力打开危险路线。',
    stats: { str: 16, dex: 13, con: 15, int: 10, wis: 12, cha: 8 },
    pros: ['最高 AC 和 HP', '近战压制稳定', '能替同伴承担风险'],
    cons: ['远程乏力', '奥术与细致社交较弱'],
    skills: {
      combat: [
        {
          name: '压制斩',
          kind: 'combat',
          check: '攻击检定：力量+熟练 vs AC',
          effect: '命中后造成武器伤害；若敌人正威胁队友，追加一次击退或缴械叙事机会。',
        },
        {
          name: '盾墙嘲讽',
          kind: 'combat',
          check: '力量(运动) DC13 或 魅力(威吓) DC14',
          effect: '成功后一个敌人下轮优先攻击你，指定同伴下一次防御或逃脱检定+2。',
        },
      ],
      nonCombat: [
        {
          name: '破门开路',
          kind: 'noncombat',
          check: '力量(运动) DC12-18',
          effect: '撞门、移石、撑住坍塌机关；失败会制造声响或造成少量伤害。',
        },
        {
          name: '战场读势',
          kind: 'noncombat',
          check: '感知(洞悉) DC14',
          effect: '读出伏击方向、敌人胆怯点或 Boss 的下一步战术。',
        },
      ],
    },
  },
  {
    id: 'rogue',
    name: '游荡者',
    mark: 'R',
    desc: '灵活刺客，高爆发偷袭。最适合承担潜入、开锁、拆陷阱和危险侦查。',
    stats: { str: 10, dex: 16, con: 14, int: 12, wis: 13, cha: 8 },
    pros: ['潜行先手偷袭', '解陷阱开锁主力', '高单体爆发'],
    cons: ['脆皮不能扛', '需要队友配合'],
    skills: {
      combat: [
        {
          name: '偷袭',
          kind: 'combat',
          check: '攻击检定：敏捷+熟练 vs AC',
          effect: '若目标被队友牵制或你处于隐藏，命中追加1d6伤害并暴露弱点。',
        },
        {
          name: '烟雾脱离',
          kind: 'combat',
          check: '敏捷(杂技) DC13',
          effect: '从近战威胁中撤离，成功后可顺势潜行或护送一名队友后撤。',
        },
      ],
      nonCombat: [
        {
          name: '开锁拆陷',
          kind: 'noncombat',
          check: '敏捷(巧手/盗贼工具) DC12-18',
          effect: '处理门锁、宝箱、压力板和毒针；失败可能消耗工具或触发弱化版陷阱。',
        },
        {
          name: '暗处侦查',
          kind: 'noncombat',
          check: '敏捷(潜行) 对抗 感知(察觉)',
          effect: '提前发现巡逻、暗门、偷听情报；大成功可给全队下一次行动优势。',
        },
      ],
    },
  },
  {
    id: 'wizard',
    name: '法师',
    mark: 'M',
    desc: '远程炮台，法术轰炸。擅长奥术鉴定、符文谜题和用法术重写场景规则。',
    stats: { str: 8, dex: 13, con: 14, int: 16, wis: 12, cha: 10 },
    pros: ['AOE 清怪最强', '解谜调查主力', '法术花样多'],
    cons: ['AC 最低最脆', '法术位有限'],
    skills: {
      combat: [
        {
          name: '炽焰爆裂',
          kind: 'combat',
          check: '智力(奥秘) DC14 或 法术攻击 vs AC',
          effect: '塑形火焰打击多个灰烬之裔；成功避免误伤队友，失败会引发环境燃烧。',
        },
        {
          name: '护盾反应',
          kind: 'combat',
          check: '智力(奥秘) DC13',
          effect: '预判一次来袭攻击，成功后本轮 AC 临时+3或保护身旁队友。',
        },
      ],
      nonCombat: [
        {
          name: '奥术鉴定',
          kind: 'noncombat',
          check: '智力(奥秘) DC12-18',
          effect: '识别魔法物品、诅咒、传送阵和深渊符文，常能解锁额外剧情选项。',
        },
        {
          name: '仪式解谜',
          kind: 'noncombat',
          check: '智力(调查/历史) DC14-18',
          effect: '重排书架、破译王室密文、推演封印顺序；失败会推进危险计时。',
        },
      ],
    },
  },
  {
    id: 'cleric',
    name: '牧师',
    mark: 'C',
    desc: '治疗辅助，亡灵克星。擅长祝福、驱散、医治，以及辨认真伪神迹。',
    stats: { str: 13, dex: 10, con: 14, int: 12, wis: 16, cha: 8 },
    pros: ['唯一治疗职业', '亡灵特攻', '团队 buff'],
    cons: ['输出较低', '仇恨高易被集火'],
    skills: {
      combat: [
        {
          name: '圣光打击',
          kind: 'combat',
          check: '攻击检定：感知+熟练 vs AC',
          effect: '对亡灵和灰烬之裔造成光耀伤害；命中后可压制目标的暗影再生。',
        },
        {
          name: '战地治疗',
          kind: 'combat',
          check: '感知(医药) DC12',
          effect: '稳定濒死角色或恢复少量 HP；若消耗治疗药水，检定成功额外+2治疗。',
        },
      ],
      nonCombat: [
        {
          name: '辨认真伪神迹',
          kind: 'noncombat',
          check: '感知(洞悉/宗教) DC13-17',
          effect: '识破莫德雷德的治疗印记、祭坛伪装和被污染的祝福。',
        },
        {
          name: '驱散诅咒',
          kind: 'noncombat',
          check: '感知(宗教) DC15-20',
          effect: '解除临时属性惩罚、安抚亡魂或削弱 Boss 前的场地诅咒。',
        },
      ],
    },
  },
  {
    id: 'paladin',
    name: '圣骑士',
    mark: 'P',
    desc: '攻守兼备，魅力领袖。善于谈判、审判誓言，也能在 Boss 战里爆发圣光。',
    stats: { str: 15, dex: 10, con: 13, int: 8, wis: 12, cha: 14 },
    pros: ['攻守均衡', '魅力社交优势', 'Boss 战爆发'],
    cons: ['各方面不突出', '法术位少'],
    skills: {
      combat: [
        {
          name: '神圣一击',
          kind: 'combat',
          check: '攻击检定：力量+熟练 vs AC',
          effect: '命中后可追加光耀爆发；对恶魔、亡灵和誓敌特别有效。',
        },
        {
          name: '守护灵光',
          kind: 'combat',
          check: '魅力(说服/宗教) DC13',
          effect: '鼓舞队友抵抗恐惧或魅惑，全队下一次相关豁免+2。',
        },
      ],
      nonCombat: [
        {
          name: '威严谈判',
          kind: 'noncombat',
          check: '魅力(说服/威吓) DC12-18',
          effect: '压住争执、争取守卫配合、逼问俘虏；失败会让对方警觉或索要代价。',
        },
        {
          name: '誓言审判',
          kind: 'noncombat',
          check: '感知(洞悉) 或 魅力(宗教) DC14-18',
          effect: '判断亡魂、贵族或教士是否违背誓言，影响王室线和墓穴审判。',
        },
      ],
    },
  },
];

export const DND_COMPANIONS: CompanionPreset[] = [
  {
    id: 'grum',
    name: '格鲁姆',
    title: '格鲁姆·铁锤',
    role: '矮人战士 / 护卫',
    hp: 52,
    ac: 17,
    trustKey: 'gm_trust',
    hpKey: 'gm_hp',
    skills: {
      combat: [
        {
          name: '嘲讽护卫',
          kind: 'combat',
          check: '力量(运动) DC13',
          effect: '吸引火力并替玩家或塔莉亚挡下一次近战威胁。',
        },
        {
          name: '破甲战锤',
          kind: 'combat',
          check: '攻击检定：+5 vs AC',
          effect: '命中重甲或石像敌人时，下次对该目标攻击+2。',
        },
      ],
      nonCombat: [
        {
          name: '矮人石工',
          kind: 'noncombat',
          check: '智力(历史/调查)+4，石造机关 DC12-16',
          effect: '识别暗门、承重墙、坍塌风险和古矮人铭刻。',
        },
        {
          name: '酒馆人脉',
          kind: 'noncombat',
          check: '魅力(威吓/说服)+3，城市情报 DC13',
          effect: '在旅店、黑市和雇佣兵之间打听债主、装备或地城传闻。',
        },
      ],
      story: [
        {
          name: '欠债的战锤',
          kind: 'story',
          check: '还债500GP 或 魅力(说服) DC15',
          effect: '完成后信任+30，并获得镀银战锤支援。',
        },
      ],
    },
  },
  {
    id: 'lisa',
    name: '丽莎',
    title: '影刃丽莎',
    role: '半精灵游荡者 / 斥候',
    hp: 38,
    ac: 15,
    trustKey: 'ls_trust',
    hpKey: 'ls_hp',
    skills: {
      combat: [
        {
          name: '暗影偷袭',
          kind: 'combat',
          check: '攻击检定：+6 vs AC；隐藏时优势',
          effect: '命中追加1d6伤害；若目标是暗影教会成员，揭露一条弱点。',
        },
        {
          name: '反制陷阱',
          kind: 'combat',
          check: '敏捷(巧手/盗贼工具)+6，DC13-18',
          effect: '战斗中解除地刺、毒雾喷口或警报符线。',
        },
      ],
      nonCombat: [
        {
          name: '暗语潜入',
          kind: 'noncombat',
          check: '敏捷(潜行)+6 或 魅力(欺瞒)+4',
          effect: '绕过巡逻、偷听密谈、伪装暗影教会口令。',
        },
        {
          name: '追踪印记嗅探',
          kind: 'noncombat',
          check: '感知(察觉)+4，DC14',
          effect: '发现自己或队伍是否被莫德雷德追踪。',
        },
      ],
      story: [
        {
          name: '复仇名单',
          kind: 'story',
          check: 'B3 宗教/调查 DC15 找到实验记录',
          effect: '完成后信任+30，开启暗影教会秘密通道。',
        },
      ],
    },
  },
  {
    id: 'talia',
    name: '塔莉亚',
    title: '塔莉亚',
    role: '人类法师学徒 / 奥术支援',
    hp: 24,
    ac: 13,
    trustKey: 'tl_trust',
    hpKey: 'tl_hp',
    skills: {
      combat: [
        {
          name: '炽焰射线',
          kind: 'combat',
          check: '法术攻击：+5 vs AC',
          effect: '对灰烬之裔造成额外压制；命中后可点燃易燃场景物。',
        },
        {
          name: '龙血火星',
          kind: 'combat',
          check: '体质豁免 DC14；信任>80后升级为龙息术',
          effect: '情绪激动时爆发小范围火焰，成功控制则不误伤队友。',
        },
      ],
      nonCombat: [
        {
          name: '奥术译读',
          kind: 'noncombat',
          check: '智力(奥秘)+6，DC12-18',
          effect: '翻译符文、法阵、血契文本和书库禁忌批注。',
        },
        {
          name: '法师塔礼仪',
          kind: 'noncombat',
          check: '智力(历史)+4 或 魅力(说服)+3',
          effect: '在伊瑟拉、学者和贵族面前争取专业话语权。',
        },
      ],
      story: [
        {
          name: '龙血觉醒',
          kind: 'story',
          check: 'B4 受到保护或鼓励后，魅力(说服) DC15',
          effect: '完成后信任+20，解锁龙息术并影响隐藏结局。',
        },
      ],
    },
  },
];

export function abilityModifier(value: number) {
  const mod = Math.floor((value - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function presetHp(constitution: number) {
  return constitution <= 10 ? constitution : constitution * 3;
}

export function presetAc(classId: string) {
  if (classId === 'warrior' || classId === 'paladin') return 18;
  if (classId === 'cleric') return 16;
  if (classId === 'rogue') return 15;
  return 13;
}
