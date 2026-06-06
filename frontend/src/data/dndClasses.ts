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
          effect: '塑形火焰打击多个炼狱污染生物；成功避免误伤队友，失败引发环境燃烧。',
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
          effect: '识别魔法物品、黑色方尖碑、封印符文和炼狱符纹，常能解锁额外剧情。',
        },
        {
          name: '仪式解谜',
          kind: 'noncombat',
          check: '智力(调查/历史) DC14-18',
          effect: '解读古代封印、推演时间锚点顺序；失败会推进危险计时。',
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
    pros: ['唯一治疗职业', '炼狱污染特攻', '团队 buff'],
    cons: ['输出较低', '仇恨高易被集火'],
    skills: {
      combat: [
        {
          name: '圣光打击',
          kind: 'combat',
          check: '攻击检定：感知+熟练 vs AC',
          effect: '对炼狱污染生物造成光耀伤害；命中后可压制目标的暗影再生。',
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
          effect: '识破阿弗纳斯符纹、孢子幻觉伪装和被污染的圣物。',
        },
        {
          name: '驱散诅咒',
          kind: 'noncombat',
          check: '感知(宗教) DC15-20',
          effect: '解除临时属性惩罚、净化孢子污染或削弱黑石诅咒。',
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
          effect: '命中后可追加光耀爆发；对恶魔、炼狱污染生物和誓敌特别有效。',
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
          effect: '判断莱因的记忆、黑石的污染是否源自邪恶力量。',
        },
      ],
    },
  },
];

export const DND_COMPANIONS: CompanionPreset[] = [
  {
    id: 'selin',
    name: '瑟琳',
    title: '瑟琳·逆钟',
    role: '时间魔法师 / 固定同行',
    hp: 34,
    ac: 14,
    trustKey: 'se_trust',
    hpKey: 'se_hp',
    skills: {
      combat: [
        {
          name: '魔法飞弹',
          kind: 'combat',
          check: '法术攻击：自动命中, 3×1d4+1力场',
          effect: '可分散攻击多个目标，无视掩护。',
        },
        {
          name: '小回溯',
          kind: 'combat',
          check: '附赠动作，修复破损物品',
          effect: '非战斗时修复破碎物品；接近黑石后可触发更强时间效果。',
        },
      ],
      nonCombat: [
        {
          name: '时间感',
          kind: 'noncombat',
          check: '感知DC12 感知时间异常',
          effect: '对孢子幻觉敏锐，能提前提醒玩家时间错位。',
        },
        {
          name: '侦测魔法',
          kind: 'noncombat',
          check: '仪式10分钟，30尺内感知魔法灵光',
          effect: '探测魔法物品、封印符文和黑色方尖碑活动。',
        },
      ],
      story: [
        {
          name: '时间守望者',
          kind: 'story',
          check: '第一幕不可揭露来自未来',
          effect: '全程同行，在缆梯和黑暗之门表现异常，但不揭露秘密。',
        },
      ],
    },
  },
  {
    id: 'senluo',
    name: '森洛',
    title: '森洛·铁锅',
    role: '矮人战士 / 孢海向导',
    hp: 46,
    ac: 16,
    trustKey: 'sl_trust',
    hpKey: 'sl_hp',
    skills: {
      combat: [
        {
          name: '裂地斧',
          kind: 'combat',
          check: '攻击检定：+5 vs AC',
          effect: '命中1d12+3挥砍；目标STR豁免DC14失败倒地。',
        },
        {
          name: '孢海陷阱',
          kind: 'combat',
          check: '敏捷(生存)+5 DC14',
          effect: '放置生存陷阱，15尺内触发束缚。每短休2次。',
        },
      ],
      nonCombat: [
        {
          name: '真菌辨识',
          kind: 'noncombat',
          check: '智力(自然)+5，DC12-16',
          effect: '识别孢海生态、药用孢子、有毒菌类和安全路线。',
        },
        {
          name: '孢海料理',
          kind: 'noncombat',
          check: '休整时自动成功',
          effect: '用孢海食材制作临时增益料理（+1d4属性或+5临时HP）。',
        },
      ],
      story: [
        {
          name: '孢海的梦声',
          kind: 'story',
          check: '信任>75 触发',
          effect: '透露巨大真菌生命体的秘密，指出黑石根区的安全路线。',
        },
      ],
    },
  },
  {
    id: 'liyase',
    name: '莉亚瑟',
    title: '莉亚瑟·青弦',
    role: '精灵游侠 / 弓箭手',
    hp: 34,
    ac: 15,
    trustKey: 'ly_trust',
    hpKey: 'ly_hp',
    skills: {
      combat: [
        {
          name: '精准射击',
          kind: 'combat',
          check: '攻击检定：+6 vs AC，150尺',
          effect: '1d8+3穿刺远程。',
        },
        {
          name: '双箭连射',
          kind: 'combat',
          check: '攻击检定：+6 vs AC，双命中+1d4',
          effect: '两次攻击各1d8+3；双命中额外1d4。每短休1次。',
        },
      ],
      nonCombat: [
        {
          name: '精灵感知',
          kind: 'noncombat',
          check: '感知(察觉)+5 DC13',
          effect: '发现伏击、暗门、异常环境和飞行魔物轨迹。',
        },
        {
          name: '追踪',
          kind: 'noncombat',
          check: '感知(生存)+5 DC12-16',
          effect: '追踪失踪远征队和精灵侦查队留下的痕迹。',
        },
      ],
      story: [
        {
          name: '失踪的精灵侦查队',
          kind: 'story',
          check: '回声菌林发现精灵箭羽【调查DC14】',
          effect: '触发个人线，找到侦查队最后的去向线索。',
        },
      ],
    },
  },
  {
    id: 'kaxiya',
    name: '卡西亚',
    title: '卡西亚·断羽',
    role: '人类剑士 / 战斗大师',
    hp: 48,
    ac: 17,
    trustKey: 'kx_trust',
    hpKey: 'kx_hp',
    skills: {
      combat: [
        {
          name: '战术突刺',
          kind: 'combat',
          check: '攻击检定：+6 vs AC',
          effect: '1d8+4穿刺；命中→下次对该目标攻击优势。每战斗2次。',
        },
        {
          name: '舍身掩护',
          kind: 'combat',
          check: '反应：5尺内队友被攻击',
          effect: '替队友承受伤害（你的AC正常裁定）。每战斗1次。',
        },
      ],
      nonCombat: [
        {
          name: '战术评估',
          kind: 'noncombat',
          check: '感知(洞悉)+4 DC13',
          effect: '读敌方阵型、预判伏击、评估战场威胁等级。',
        },
        {
          name: '军规交涉',
          kind: 'noncombat',
          check: '魅力(威吓)+3 DC13-16',
          effect: '用军人身份与城防守卫交涉获取通行或情报。',
        },
      ],
      story: [
        {
          name: '矿道袭击真相',
          kind: 'story',
          check: '在孢海发现类同当年遭遇的痕迹',
          effect: '触发个人线，揭示当年袭击可能来自深层污染。',
        },
      ],
    },
  },
  {
    id: 'kelaiya',
    name: '克莱娅',
    title: '克莱娅·软爪',
    role: '兽族盗贼 / 怪物猎人',
    hp: 36,
    ac: 16,
    trustKey: 'kl_trust',
    hpKey: 'kl_hp',
    skills: {
      combat: [
        {
          name: '暗影偷袭',
          kind: 'combat',
          check: '攻击检定：+6 vs AC（需优势）',
          effect: '1d6+4穿刺+2d6偷袭伤害；每回合1次。',
        },
        {
          name: '弱点打击',
          kind: 'combat',
          check: '攻击检定：+6 vs AC',
          effect: '1d6+4穿刺；命中→目标AC临时-2持续1轮。每战斗1次。',
        },
      ],
      nonCombat: [
        {
          name: '开锁拆陷',
          kind: 'noncombat',
          check: '敏捷(巧手)+6 DC12-18',
          effect: '解除孢子陷阱、菌丝机关和黑暗之门封印机制。',
        },
        {
          name: '潜行侦查',
          kind: 'noncombat',
          check: '敏捷(潜行)+6 对抗 感知(察觉)',
          effect: '无声侦查孢海危险区域，提前发现隐藏敌人。',
        },
      ],
      story: [
        {
          name: '黑石碎片的梦境',
          kind: 'story',
          check: '信任>75 触发',
          effect: '透露黑石碎片在梦中「叫她回去」的线索，指向黑石根区。',
        },
      ],
    },
  },
  {
    id: 'leiduo',
    name: '雷铎',
    title: '雷铎·炉心',
    role: '机械人形 / 前排大盾',
    hp: 58,
    ac: 19,
    trustKey: 'ld_trust',
    hpKey: 'ld_hp',
    skills: {
      combat: [
        {
          name: '巨盾守护',
          kind: 'combat',
          check: '无需检定',
          effect: '自身与相邻队友AC+2，持续到下次行动。每战斗2次。',
        },
        {
          name: '守护屏障',
          kind: 'combat',
          check: '反应：15尺内队友被攻击',
          effect: '该次攻击劣势。每轮1次。',
        },
      ],
      nonCombat: [
        {
          name: '黑石共鸣',
          kind: 'noncombat',
          check: '被动自动触发',
          effect: '接近黑色方尖碑碎片时自动感知；可协助奥秘检定+4。',
        },
        {
          name: '重装破障',
          kind: 'noncombat',
          check: '力量(运动)+5 DC13-16',
          effect: '撞开封闭门、清理塌方岩块、推倒巨型菌柱。',
        },
      ],
      story: [
        {
          name: '记忆闪回',
          kind: 'story',
          check: '接近黑石根区自动触发',
          effect: '获得古代地下文明的零星记忆，与黑暗之门方向传来的指令残响。',
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
