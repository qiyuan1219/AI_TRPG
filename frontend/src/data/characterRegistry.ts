export type CharacterKind = 'player' | 'companion' | 'npc';

export interface CharacterProfile {
  id: string;
  name: string;
  kind: CharacterKind;
  subtitle: string;
  portrait: string | null;
  aliases: string[];
  testLine: string;
}

const NPC_PLACEHOLDER = '/assets/characters/npc/default.svg';

export const CHARACTER_PROFILES: CharacterProfile[] = [
  {
    id: 'adventurer',
    name: '冒险者',
    kind: 'player',
    subtitle: '玩家角色',
    portrait: '/assets/characters/adventurer/adventurer_idle.png',
    aliases: ['地表冒险者'],
    testLine: '我是来自地表的冒险者，接受公会委托前来逆穹悬城。',
  },
  {
    id: 'selin',
    name: '瑟琳',
    kind: 'companion',
    subtitle: '“银杖”瑟琳 / 时间魔法师',
    portrait: '/assets/characters/selin/selin_idle.png',
    aliases: ['瑟琳·逆钟', '“银杖”瑟琳', '银杖瑟琳', '银杖', '逆钟'],
    testLine: '我是公会指派的协作者。负责奥术支援、治疗和时间异常判断。',
  },
  {
    id: 'buluoke',
    name: '布洛克',
    kind: 'companion',
    subtitle: '布洛克·铁锅 / 孢海向导',
    portrait: '/assets/characters/senluo/brock_tavern.webp',
    aliases: ['布洛克·铁锅', '森洛·铁锅', '森洛', '铁锅'],
    testLine: '孢海的气味我认得。跟紧我，别乱碰会发光的东西。',
  },
  {
    id: 'liya',
    name: '莉娅',
    kind: 'companion',
    subtitle: '“精灵”莉娅 / 游侠弓手',
    portrait: '/assets/characters/liyase/liyase_idle.png',
    aliases: ['莉亚瑟·青弦', '莉亚瑟', '青弦', '“精灵”莉娅', '精灵莉娅'],
    testLine: '前方三格外有动静。建议从右侧绕行，菌柱可以遮住我们。',
  },
  {
    id: 'ailin',
    name: '艾琳',
    kind: 'companion',
    subtitle: '艾琳·白枝 / 生命牧师',
    portrait: '/assets/characters/ailin/ailin_prayer.webp',
    aliases: ['艾琳·白枝', '白枝'],
    testLine: '如果有人受伤，请立刻告诉我。每一滴生命都弥足珍贵。',
  },
  {
    id: 'kaiya',
    name: '凯娅',
    kind: 'companion',
    subtitle: '“软爪”凯娅 / 盗贼猎手',
    portrait: '/assets/characters/kelaiya/kaiya_blackmarket.webp',
    aliases: ['克莱娅·软爪', '克莱娅', '“软爪”凯娅', '软爪'],
    testLine: '嘘，前面有机关踏板。给我三秒，我能把它拆成零件。',
  },
  {
    id: 'lelduo',
    name: '雷铎',
    kind: 'companion',
    subtitle: '雷铎·炉心 / 守卫者',
    portrait: '/assets/characters/leiduo/leiduo_idle.png',
    aliases: ['雷铎·炉心', '炉心'],
    testLine: '分析完成：地形狭窄，适合由我在最前方承伤。',
  },
  {
    id: 'guard',
    name: '守卫',
    kind: 'npc',
    subtitle: '逆穹城守卫',
    portrait: '/assets/characters/guard/guard_idle.png',
    aliases: ['城门守卫', '主缆街守卫', '城防守卫', '黑缆守卫', '黑缆守卫队'],
    testLine: '这是从孢海据点回收的空箱。按理说，它不该带回活物。',
  },
  {
    id: 'mina',
    name: '米娜',
    kind: 'npc',
    subtitle: '“公会任务官”米娜',
    portrait: '/assets/characters/mina/mina_idle.png',
    aliases: ['公会任务官米娜', '“公会任务官”米娜', '米蕾娜·白契', '米蕾娜', '白契', '公会接待', '接待官'],
    testLine: '地底堡垒失联十年了。你们的任务，是把真相和证据带回来。',
  },
  {
    id: 'herman',
    name: '赫尔曼',
    kind: 'npc',
    subtitle: '“断缆”赫尔曼',
    portrait: '/assets/characters/herman/herman_idle.png',
    aliases: ['断缆赫尔曼', '“断缆”赫尔曼', '赫尔曼·断缆', '断缆'],
    testLine: '不是激增，是入侵。深层魔物已经堵断了两条主要甬道。',
  },
  {
    id: 'winnie',
    name: '温妮',
    kind: 'npc',
    subtitle: '温妮·铜铃 / 缆梯总工程师',
    portrait: '/assets/characters/winnie/winnie_idle.png',
    aliases: ['温妮·铜铃', '温妮娅·铜铃', '温妮娅', '铜铃'],
    testLine: '缆梯的回响比记录快了半拍，机械不会撒谎。',
  },
  {
    id: 'lein',
    name: '莱因',
    kind: 'npc',
    subtitle: '“士兵”莱因',
    portrait: '/assets/characters/lein/lein_idle.png',
    aliases: ['士兵莱因', '“士兵”莱因', '莱因·铁脊', '铁脊'],
    testLine: '第三下不要回答。黑门外层的钟声不对。',
  },
  {
    id: 'salo',
    name: '萨洛',
    kind: 'npc',
    subtitle: '萨洛·杯底 / 回声酒馆老板',
    portrait: '/assets/characters/salo/salo_idle.png',
    aliases: ['酒馆老板萨洛', '“酒馆老板”萨洛·杯底', '萨洛·杯底', '杯底'],
    testLine: '骰杯在桌上，规矩也在桌上。敢不敢试一局？',
  },
  {
    id: 'aolan',
    name: '奥兰',
    kind: 'npc',
    subtitle: '奥兰·爵 / 黑市商人',
    portrait: '/assets/characters/aolan/aolan_idle.png',
    aliases: ['黑市商人奥兰', '“黑市商人”奥兰·爵', '奥兰·爵', '奥兰爵', '奥布兰·晨爵', '奥布兰', '晨爵'],
    testLine: '抗孢面罩、冷光灯、止血粉，都有。价格嘛，看你的本事。',
  },
  {
    id: 'yunling',
    name: '云苓',
    kind: 'npc',
    subtitle: '云苓 / 黑市药剂商',
    portrait: '/assets/characters/yunling/_2026-06-11T14-32-43.png',
    aliases: ['黑市药剂商云苓', '药剂商云苓', '云苓药师'],
    testLine: '真话比较贵，真药也是。下孢海之前，最好别把两者都省掉。',
  },
  {
    id: 'nibu',
    name: '尼布',
    kind: 'npc',
    subtitle: '蓝伞尼布 / 孢海据点守夜人',
    portrait: '/assets/characters/nibu/nibu_idle.png',
    aliases: ['蓝伞尼布'],
    testLine: '浅层地图可以给你，但别追那些异常荧光。',
  },
  {
    id: 'heilent',
    name: '海伦特',
    kind: 'npc',
    subtitle: '海伦特·灰杯 / 静默神殿祭司',
    portrait: '/assets/characters/heilent/heilent_idle.png',
    aliases: ['海伦特·灰杯', '灰杯'],
    testLine: '神殿能治疗伤口，但有些记录比伤口更难愈合。',
  },
  {
    id: 'yunling',
    name: '云苓',
    kind: 'npc',
    subtitle: '云苓 / 龙族流浪炼药师',
    portrait: '/assets/characters/yunling/yunling_idle.png',
    aliases: ['龙族药师云苓', '龙女药师', '小药师'],
    testLine: '这瓶药不喜欢你。不是你的问题，它就这脾气。',
  },
  {
    id: 'sein',
    name: '赛因',
    kind: 'npc',
    subtitle: '赛因·镜页 / 黑石观测台研究员',
    portrait: NPC_PLACEHOLDER,
    aliases: ['赛因·镜页', '镜页'],
    testLine: '黑石脉冲不是噪声，它像是在回应某个更深处的节律。',
  },
  {
    id: 'marga',
    name: '玛尔加',
    kind: 'npc',
    subtitle: '铁砧玛尔加 / 匠炉区武器店主',
    portrait: NPC_PLACEHOLDER,
    aliases: ['铁砧玛尔加'],
    testLine: '想活着回来，就别让护甲带着裂口下缆梯。',
  },
  {
    id: 'pavi',
    name: '帕维',
    kind: 'npc',
    subtitle: '烛账帕维 / 公会档案员',
    portrait: NPC_PLACEHOLDER,
    aliases: ['烛账帕维'],
    testLine: '失踪远征队的记录都在这里，只是有几页不该空白。',
  },
  {
    id: 'ella',
    name: '埃拉',
    kind: 'npc',
    subtitle: '静默修女埃拉',
    portrait: NPC_PLACEHOLDER,
    aliases: ['静默修女埃拉'],
    testLine: '请低声些。这里保存的不只是遗物，还有最后的话。',
  },
  {
    id: 'clerk',
    name: '书记员',
    kind: 'npc',
    subtitle: '公会书记员',
    portrait: NPC_PLACEHOLDER,
    aliases: ['公会书记员', '书记员马文', '马文', '接待员', '公会接待员'],
    testLine: '新来的？登记表在这里，悬赏令不等人，但规矩要先讲清楚。',
  },
];

function normalizeSpeakerKey(value: string) {
  return value
    .trim()
    .replace(/[「」『』“”"']/g, '')
    .replace(/\s+/g, '');
}

export const SPEAKER_ALIASES: Record<string, string> = {};
const DETECTABLE_SPEAKER_ALIASES: Record<string, string> = {};
const SPEAKER_ALIAS_BY_KEY: Record<string, string> = {};
const PROFILE_BY_NAME: Record<string, CharacterProfile> = {};

for (const profile of CHARACTER_PROFILES) {
  PROFILE_BY_NAME[profile.name] = profile;
  for (const alias of [profile.name, ...profile.aliases]) {
    SPEAKER_ALIASES[alias] = profile.name;
    SPEAKER_ALIAS_BY_KEY[normalizeSpeakerKey(alias)] = profile.name;
    if (profile.kind !== 'player') {
      DETECTABLE_SPEAKER_ALIASES[alias] = profile.name;
    }
  }
}

export const SPEAKER_ALIASES_SORTED = Object.keys(DETECTABLE_SPEAKER_ALIASES).sort((a, b) => b.length - a.length);

export function resolveSpeakerName(speaker: string) {
  const trimmed = speaker.trim();
  if (!trimmed) return '';
  if (trimmed === 'KP' || trimmed === '主持人') return '主持人';
  if (trimmed === '系统') return trimmed;
  return SPEAKER_ALIASES[trimmed] || SPEAKER_ALIAS_BY_KEY[normalizeSpeakerKey(trimmed)] || trimmed;
}

export function resolvePortraitPath(speaker: string) {
  const name = resolveSpeakerName(speaker);
  return PROFILE_BY_NAME[name]?.portrait ?? null;
}

export function findRegisteredSpeaker(text: string, reverse = false) {
  const normalized = text.replace(/[【】]/g, '');
  let bestIndex = reverse ? -1 : Number.POSITIVE_INFINITY;
  let bestLength = 0;
  let bestSpeaker = '';

  for (const alias of SPEAKER_ALIASES_SORTED) {
    const index = reverse ? normalized.lastIndexOf(alias) : normalized.indexOf(alias);
    if (index < 0) continue;

    const better = reverse
      ? index > bestIndex || (index === bestIndex && alias.length > bestLength)
      : index < bestIndex || (index === bestIndex && alias.length > bestLength);

    if (better) {
      bestIndex = index;
      bestLength = alias.length;
      bestSpeaker = DETECTABLE_SPEAKER_ALIASES[alias];
    }
  }

  return bestSpeaker;
}

export const PORTRAIT_TEST_CHARACTERS = CHARACTER_PROFILES
  .filter((profile): profile is CharacterProfile & { portrait: string } => Boolean(profile.portrait))
  .map((profile) => ({
    name: profile.name,
    subtitle: profile.subtitle,
    portrait: profile.portrait,
    dialogue: profile.testLine,
    role: profile.kind === 'player' ? 'player' as const : 'system' as const,
  }));
