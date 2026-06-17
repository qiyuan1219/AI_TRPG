import type { CharacterPreset, CompanionPreset, PlayerAttributes } from '../types/game';

export const CLASS_TO_STYLE_MAP: Record<string, string> = {
  warrior: 'iron-cable',
  rogue: 'shadow-step',
  mage: 'arcane-analysis',
  wizard: 'arcane-analysis',
  cleric: 'resonance',
  paladin: 'balanced',
  战士: 'iron-cable',
  游荡者: 'shadow-step',
  法师: 'arcane-analysis',
  牧师: 'resonance',
  圣骑士: 'balanced',
};

export const COMMON_COMBAT_SKILLS = [
  {
    name: '基础攻击',
    kind: 'combat' as const,
    check: '攻击检定：D20 + 熟练值 + 当前武器属性修正 vs AC',
    effect: '命中后造成基础武器伤害。',
  },
  {
    name: '防守架势',
    kind: 'combat' as const,
    check: '本回合 AC +2，或获得少量临时护盾',
    effect: '稳住站位，降低本轮被击穿的风险。',
  },
  {
    name: '战术援护',
    kind: 'combat' as const,
    check: '指定一名队友，使其下一次命中检定 +2',
    effect: '通过位置、提醒和压制为队友创造窗口。',
  },
  {
    name: '应急处理',
    kind: 'combat' as const,
    check: '消耗道具或行动点，恢复少量生命，或移除轻度异常状态',
    effect: '在短时间内稳定伤势或清理轻度负面效果。',
  },
];

export const COMMON_NON_COMBAT_SKILLS = [
  { name: '观察', kind: 'noncombat' as const, check: '感知 DC 12-18', effect: '观察周边异动、伏击和环境线索。' },
  { name: '潜行', kind: 'noncombat' as const, check: '敏捷 DC 12-18', effect: '压低声息，绕开危险区域或提前侦察。' },
  { name: '交涉', kind: 'noncombat' as const, check: '魅力 DC 12-18', effect: '安抚、说服、套话或压住场面。' },
  { name: '解析', kind: 'noncombat' as const, check: '智力 DC 12-18', effect: '拆解规则、机关、文本和异常现象。' },
  { name: '强行突破', kind: 'noncombat' as const, check: '力量 DC 12-18', effect: '撞开阻碍、搬运重物或强行推进。' },
  { name: '耐受', kind: 'noncombat' as const, check: '体质 DC 12-18', effect: '扛住污染、疲劳、缺氧和持续压迫。' },
];

export const PLAYER_STYLES: CharacterPreset[] = [
  {
    id: 'iron-cable',
    name: '铁缆流',
    hotkey: 'W',
    tagline: '稳健抗压，适合正面承受风险。',
    summary: '体质与力量较高，血量最高，适合在危险环境中稳定推进。',
    attributes: { str: 15, dex: 10, con: 16, int: 10, wis: 12, cha: 10 },
    derived: { hp: 45, ac: 13, initiativeModifier: 0 },
    advantages: ['血量最高', '力量与体质检定稳定', '适合承受危险'],
    limitations: ['先攻较低', '潜行与交涉普通', '解谜与奥术分析不突出'],
    skills: { combat: COMMON_COMBAT_SKILLS, nonCombat: COMMON_NON_COMBAT_SKILLS },
  },
  {
    id: 'shadow-step',
    name: '影步流',
    hotkey: 'R',
    tagline: '敏捷侦察，适合先手行动。',
    summary: '敏捷与感知较高，擅长潜行、侦察、发现陷阱和规避伏击。',
    attributes: { str: 10, dex: 16, con: 12, int: 10, wis: 15, cha: 10 },
    derived: { hp: 39, ac: 16, initiativeModifier: 3 },
    advantages: ['先攻最高', '潜行与侦察能力强', '容易发现陷阱和伏击'],
    limitations: ['血量一般', '力量检定普通', '交涉与奥术分析不突出'],
    skills: { combat: COMMON_COMBAT_SKILLS, nonCombat: COMMON_NON_COMBAT_SKILLS },
  },
  {
    id: 'arcane-analysis',
    name: '秘析流',
    hotkey: 'M',
    tagline: '理性分析，适合解谜和识破异常。',
    summary: '智力与感知较高，擅长奥术、历史、机关、异常规则和线索分析。',
    attributes: { str: 8, dex: 12, con: 12, int: 16, wis: 15, cha: 10 },
    derived: { hp: 39, ac: 14, initiativeModifier: 1 },
    advantages: ['智力最高', '解谜与奥术检定强', '容易识破异常规则'],
    limitations: ['力量最低', '近身压制和搬运较弱', '交涉能力普通'],
    skills: { combat: COMMON_COMBAT_SKILLS, nonCombat: COMMON_NON_COMBAT_SKILLS },
  },
  {
    id: 'resonance',
    name: '共鸣流',
    hotkey: 'C',
    tagline: '善于共情，适合交涉和建立信任。',
    summary: '魅力最高，兼具一定感知，擅长交涉、安抚、套话和提升 NPC 信任。',
    attributes: { str: 8, dex: 12, con: 12, int: 12, wis: 13, cha: 16 },
    derived: { hp: 39, ac: 14, initiativeModifier: 1 },
    advantages: ['魅力最高', '交涉和安抚能力强', '更容易提升 NPC 信任'],
    limitations: ['力量较弱', '硬碰硬能力不突出', '高难度奥术分析不如秘析流'],
    skills: { combat: COMMON_COMBAT_SKILLS, nonCombat: COMMON_NON_COMBAT_SKILLS },
  },
  {
    id: 'balanced',
    name: '均衡流',
    hotkey: 'P',
    tagline: '六维均衡，适合第一次游玩。',
    summary: '没有明显短板，所有检定都有基础表现，适合想体验完整内容的新手。',
    attributes: { str: 12, dex: 12, con: 13, int: 12, wis: 12, cha: 12 },
    derived: { hp: 39, ac: 14, initiativeModifier: 1 },
    advantages: ['没有明显短板', '所有检定都有基础加值', '适合体验完整内容'],
    limitations: ['没有极端强项', '高 DC 检定不如专精流派', '战斗和剧情都偏稳但不爆发'],
    skills: { combat: COMMON_COMBAT_SKILLS, nonCombat: COMMON_NON_COMBAT_SKILLS },
  },
];

export const DND_COMPANIONS: CompanionPreset[] = [
  {
    id: 'selin',
    name: '瑟琳',
    title: '“银杖”瑟琳',
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
    name: '布洛克',
    title: '布洛克·铁锅',
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
    name: '莉娅',
    title: '“精灵”莉娅',
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
    id: 'ailin',
    name: '艾琳',
    title: '艾琳·白枝',
    role: '精灵修女 / 生命牧师',
    hp: 32,
    ac: 14,
    trustKey: 'al_trust',
    hpKey: 'al_hp',
    skills: {
      combat: [
        {
          name: '治愈祷言',
          kind: 'combat',
          check: '动作·1级法术位：触碰目标',
          effect: '恢复1d8+4HP；对濒死目标额外+1d4。',
        },
        {
          name: '祝福术',
          kind: 'combat',
          check: '动作·1级法术位：需专注DC10',
          effect: '3个盟友攻击和豁免+1d4，持续1分钟。',
        },
        {
          name: '信仰庇护',
          kind: 'combat',
          check: '反应：30尺内盟友被攻击',
          effect: '攻击检定劣势（祈祷拦截）。每战斗1次。',
        },
      ],
      nonCombat: [
        {
          name: '医者之手',
          kind: 'noncombat',
          check: '感知(医药)+6 DC10-15',
          effect: '稳定濒死、包扎、草药；休整时额外恢复1d6。',
        },
        {
          name: '圣典学识',
          kind: 'noncombat',
          check: '智力(宗教)+5 DC12-18',
          effect: '辨认古迹符文、异端仪式、灵魂腐化痕迹。',
        },
      ],
      story: [
        {
          name: '圣徽之冷',
          kind: 'story',
          check: '接近黑暗之门→圣徽温度剧降',
          effect: '解锁修道院三代追踪灵魂腐化的隐藏线索。',
        },
      ],
    },
  },
  {
    id: 'kelaiya',
    name: '凯娅',
    title: '“软爪”凯娅',
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

export function abilityModifierValue(value: number) {
  return Math.floor((value - 10) / 2);
}

export function getMaxHp(attributes: PlayerAttributes) {
  return 36 + abilityModifierValue(attributes.con) * 3;
}

export function getAc(attributes: PlayerAttributes) {
  return 13 + abilityModifierValue(attributes.dex);
}

export function getInitiativeModifier(attributes: PlayerAttributes) {
  return abilityModifierValue(attributes.dex);
}

export function getPlayerStyleById(styleId: string) {
  return PLAYER_STYLES.find((item) => item.id === styleId) || PLAYER_STYLES.find((item) => item.id === 'balanced')!;
}

export function getPlayerStyleByName(name: string) {
  return PLAYER_STYLES.find((item) => item.name === name) || null;
}

function readAttributes(source: any): PlayerAttributes | null {
  if (!source || typeof source !== 'object') return null;
  const keys: Array<keyof PlayerAttributes> = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  if (!keys.every((key) => Number.isFinite(Number(source[key])))) return null;
  return {
    str: Number(source.str),
    dex: Number(source.dex),
    con: Number(source.con),
    int: Number(source.int),
    wis: Number(source.wis),
    cha: Number(source.cha),
  };
}

export function migrateClassToStyleState<T extends Record<string, any>>(state: T): T {
  if (!state || typeof state !== 'object') return state;
  const player = state.player && typeof state.player === 'object' ? state.player : {};
  const pendingSelection = Boolean(state.style_selection_pending) && !state.selectedStyleId && !player.styleId;
  const explicitStyleId = String(state.selectedStyleId || state.selected_style_id || player.styleId || '').trim();
  const explicitStyleName = String(state.style_name || player.styleName || '').trim();
  const legacyClass = String(state.selectedClassId || state.char_class || '').trim();

  if (pendingSelection && legacyClass === '待确认流派') {
    const pendingAttrs = readAttributes(player.attributes) || readAttributes(state) || getPlayerStyleById('balanced').attributes;
    const pendingHp = getMaxHp(pendingAttrs);
    return {
      ...state,
      char_class: '待确认流派',
      style_name: '待确认流派',
      selectedStyleId: '',
      selected_style_id: '',
      selectedClassId: undefined,
      player: {
        ...player,
        styleId: '',
        styleName: '待确认流派',
        attributes: pendingAttrs,
        maxHp: pendingHp,
        hp: Math.min(Number(state.current_hp ?? player.hp ?? pendingHp), pendingHp),
        ac: getAc(pendingAttrs),
      },
      ...pendingAttrs,
      current_hp: Math.min(Number(state.current_hp ?? player.hp ?? pendingHp), pendingHp),
      max_hp: pendingHp,
      ac: getAc(pendingAttrs),
      initiative_modifier: getInitiativeModifier(pendingAttrs),
    };
  }

  let style = explicitStyleId ? getPlayerStyleById(explicitStyleId) : null;
  if (!style && explicitStyleName) style = getPlayerStyleByName(explicitStyleName);
  if (!style) {
    const mappedStyleId = CLASS_TO_STYLE_MAP[legacyClass] || 'balanced';
    style = getPlayerStyleById(mappedStyleId);
  }
  const hasExplicitStyle = Boolean(explicitStyleId || explicitStyleName);
  const attributes = (hasExplicitStyle ? (readAttributes(player.attributes) || readAttributes(state)) : null) || style.attributes;
  const maxHp = getMaxHp(attributes);
  const currentHp = Math.min(Number(state.current_hp ?? player.hp ?? maxHp), maxHp);

  return {
    ...state,
    char_class: style.name,
    style_name: style.name,
    selectedStyleId: style.id,
    selected_style_id: style.id,
    selectedClassId: undefined,
    style_selection_pending: false,
    player: {
      ...player,
      styleId: style.id,
      styleName: style.name,
      attributes,
      maxHp,
      hp: currentHp,
      ac: getAc(attributes),
    },
    ...attributes,
    current_hp: currentHp,
    max_hp: maxHp,
    ac: getAc(attributes),
    initiative_modifier: getInitiativeModifier(attributes),
  };
}
