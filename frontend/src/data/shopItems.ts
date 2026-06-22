export interface ShopItem {
  id: string;
  name: string;
  price: number;
  type: 'potion' | 'rare';
  icon: string;
  desc: string;
  repeatable: boolean;
  stat?: string;
  aliases?: string[];
  stock?: number;
}

export const shopItems: ShopItem[] = [
  {
    id: 'purification_heart',
    name: '净化之心',
    price: 250,
    type: 'rare',
    icon: '/assets/icons/items/yuling_shop/purifyingheart.png',
    desc: '特殊道具。可用于对抗黑石侵蚀，也许能救回还未完全异化的人。',
    repeatable: false,
    aliases: ['净化心', 'purifyingheart', 'purifying_heart'],
  },
  {
    id: 'strength_potion',
    name: '力量药水',
    price: 100,
    type: 'potion',
    icon: '/assets/icons/items/yuling_shop/power_potion.png',
    desc: '临时提升力量相关检定，适合破门、攀爬和近战爆发。',
    repeatable: false,
    stat: 'str',
    aliases: ['力量', 'power_potion', 'str_potion'],
  },
  {
    id: 'intelligence_potion',
    name: '智力药水',
    price: 100,
    type: 'potion',
    icon: '/assets/icons/items/yuling_shop/wisdom_potion.png',
    desc: '临时提升智力相关检定，适合调查符文、机关和古代文本。',
    repeatable: false,
    stat: 'int',
    aliases: ['智力', 'int_potion', 'wisdom_potion'],
  },
  {
    id: 'dexterity_potion',
    name: '敏捷药水',
    price: 100,
    type: 'potion',
    icon: '/assets/icons/items/yuling_shop/agile_potion.png',
    desc: '临时提升敏捷相关检定，适合闪避、潜行和拆陷阱。',
    repeatable: false,
    stat: 'dex',
    aliases: ['敏捷', 'agile_potion', 'dex_potion'],
  },
  {
    id: 'constitution_potion',
    name: '体质药水',
    price: 100,
    type: 'potion',
    icon: '/assets/icons/items/yuling_shop/constitution_potion.png',
    desc: '增强身体耐受力，适合体质豁免、抗毒和长时间探索。',
    repeatable: false,
    stat: 'con',
    aliases: ['体质', 'con_potion'],
  },
  {
    id: 'wisdom_potion',
    name: '感知药水',
    price: 100,
    type: 'potion',
    icon: '/assets/icons/items/yuling_shop/perception_potion.png',
    desc: '提高警觉与直觉，适合察觉埋伏、幻觉和异常气息。',
    repeatable: false,
    stat: 'wis',
    aliases: ['感知', 'perception_potion', 'wis_potion'],
  },
  {
    id: 'charisma_potion',
    name: '魅力药水',
    price: 100,
    type: 'potion',
    icon: '/assets/icons/items/yuling_shop/charm_potion.png',
    desc: '增强谈判气势，适合说服、威吓、欺瞒和交涉。',
    repeatable: false,
    stat: 'cha',
    aliases: ['魅力', 'charm_potion', 'cha_potion'],
  },
  {
    id: 'healing_potion',
    name: '治疗药水',
    price: 75,
    type: 'potion',
    icon: '/assets/icons/items/yuling_shop/healing_potion.png',
    desc: '恢复少量生命值，是深层探索中最可靠的应急补给。',
    repeatable: true,
    aliases: ['治疗', '回血', '小红瓶'],
  },
  {
    id: 'fiction_dice',
    name: '虚构骰子',
    price: 50,
    type: 'rare',
    icon: '/assets/icons/items/xugou.png',
    desc: '一次判定后重新投掷，并保留较高结果。也可用于萨洛与布洛克的骰子游戏。',
    repeatable: true,
    stock: 3,
    aliases: ['fiction-dice'],
  },
  {
    id: 'omni_dice',
    name: '万能骰子',
    price: 100,
    type: 'rare',
    icon: '/assets/icons/items/wanneng.png',
    desc: '一次判定后指定骰面结果。也可用于萨洛与布洛克的骰子游戏。',
    repeatable: true,
    stock: 3,
    aliases: ['omni-dice'],
  },
];
