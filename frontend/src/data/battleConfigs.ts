/**
 * 第一幕后半段战斗配置文件
 */
import type { BattleConfig } from '../components/BattleTestScreen';

// ============================================================
// 普通战斗一：蓝伞浅滩遭遇战
// ============================================================

export const BLUE_SHOAL_BATTLE_CONFIG: BattleConfig = {
  units: [
    {
      id: 'adv', name: '冒险者', faction: 'ally', role: '战士 Lv.3 / 前排护卫',
      portrait: '冒', model: 'adventurer',
      hp: 32, maxHp: 32, ac: 16, speed: 30, proficiency: 2,
      abilities: { str: 16, dex: 13, con: 15, int: 10, wis: 12, cha: 8 },
      resourceProfile: ['攻击', '护卫'],
      statuses: ['前排'],
      traits: ['HP32/AC16'],
      skills: [
        { id: 'adv-slash', name: '长剑挥砍', resource: '战斗技能', source: '职业技能', formula: 'STR+熟练 vs AC；1d8+400', effect: '正面劈砍', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'str', targetAc: 13, label: '长剑挥砍' }, tags: ['攻击'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'serin', name: '瑟琳', faction: 'ally', role: '银杖术士 / 法术支援',
      portrait: '瑟', model: 'selin',
      hp: 24, maxHp: 24, ac: 14, speed: 30, proficiency: 2,
      abilities: { str: 9, dex: 14, con: 12, int: 16, wis: 14, cha: 13 },
      resourceProfile: ['法术', '支援'],
      statuses: ['后排'],
      traits: ['HP24/AC14'],
      skills: [
        { id: 'serin-bolt', name: '银杖射击', resource: '战斗技能', source: '队友技能', formula: 'INT+熟练 vs AC；1d8+300光耀', effect: '远程法术射击', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'int', targetAc: 13, label: '银杖射击' }, tags: ['攻击'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'ailin', name: '艾琳', faction: 'ally', role: '白枝修女 / 治疗净化',
      portrait: '艾', model: 'ailin',
      hp: 26, maxHp: 26, ac: 15, speed: 30, proficiency: 2,
      abilities: { str: 10, dex: 12, con: 14, int: 13, wis: 16, cha: 14 },
      resourceProfile: ['治疗', '净化'],
      statuses: ['后排'],
      traits: ['HP26/AC15'],
      skills: [
        { id: 'ailin-heal', name: '白枝治疗', resource: '战斗技能', source: '队友技能', formula: '恢复1d8+3', effect: '包扎伤口', cooldown: '每回合1次', rule: '治疗骰', roll: { kind: 'healing', dieType: 'd8', diceCount: 1, bonus: 3, label: '白枝治疗' }, tags: ['治疗'] },
        { id: 'ailin-strike', name: '白枝杖击', resource: '战斗技能', source: '队友技能', formula: 'WIS+熟练 vs AC；1d6+200', effect: '近身防卫', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'wis', targetAc: 13, label: '白枝杖击' }, tags: ['攻击'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'brock', name: '布洛克', faction: 'ally', role: '矮人 / 孢海生存专家',
      portrait: '锅', model: 'senluo',
      hp: 34, maxHp: 34, ac: 16, speed: 25, proficiency: 2,
      abilities: { str: 16, dex: 12, con: 16, int: 10, wis: 15, cha: 8 },
      resourceProfile: ['攻击', '护卫'],
      statuses: ['前排'],
      traits: ['HP34/AC16'],
      skills: [
        { id: 'brock-smash', name: '铁锅重砸', resource: '战斗技能', source: '队友技能', formula: 'STR+熟练 vs AC；1d8+300钝击', effect: '正面砸击', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'str', targetAc: 13, label: '铁锅重砸' }, tags: ['攻击'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'kaiya', name: '凯娅', faction: 'ally', role: '黑市猎手 / 敏捷输出',
      portrait: '凯', model: 'kelaiya',
      hp: 22, maxHp: 22, ac: 15, speed: 35, proficiency: 2,
      abilities: { str: 11, dex: 17, con: 13, int: 12, wis: 14, cha: 10 },
      resourceProfile: ['攻击', '辅助'],
      statuses: ['后排'],
      traits: ['HP22/AC15'],
      skills: [
        { id: 'kaiya-stab', name: '匕首连刺', resource: '战斗技能', source: '队友技能', formula: 'DEX+熟练 vs AC；1d400+400穿刺', effect: '快速连续刺击', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'dex', targetAc: 13, label: '匕首连刺' }, tags: ['攻击'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'crawler-a', name: '孢化爬虫A', faction: 'enemy', role: '蓝伞浅滩污染生物',
      portrait: '爬', model: 'crawler',
      hp: 16, maxHp: 16, ac: 13, speed: 25, proficiency: 1,
      abilities: { str: 12, dex: 13, con: 11, int: 3, wis: 8, cha: 4 },
      resourceProfile: ['攻击'],
      statuses: [],
      traits: ['HP16/AC13'],
      skills: [
        { id: 'crawler-a-sting', name: '孢刺触手', resource: '战斗技能', source: '敌方技能', formula: 'DEX+熟练 vs AC；1d6+2穿刺', effect: '触手刺击', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'dex', targetAc: 16, label: '孢刺触手' }, tags: ['攻击'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'crawler-b', name: '孢化爬虫B', faction: 'enemy', role: '蓝伞浅滩污染生物',
      portrait: '爬', model: 'crawler',
      hp: 16, maxHp: 16, ac: 13, speed: 25, proficiency: 1,
      abilities: { str: 12, dex: 13, con: 11, int: 3, wis: 8, cha: 4 },
      resourceProfile: ['攻击'],
      statuses: [],
      traits: ['HP16/AC13'],
      skills: [
        { id: 'crawler-b-sting', name: '孢刺触手', resource: '战斗技能', source: '敌方技能', formula: 'DEX+熟练 vs AC；1d6+2穿刺', effect: '触手刺击', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'dex', targetAc: 16, label: '孢刺触手' }, tags: ['攻击'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'mimic', name: '拟声菌团', faction: 'enemy', role: '菌毯拟声诱捕体',
      portrait: '菌', model: 'crawler',
      hp: 28, maxHp: 28, ac: 14, speed: 20, proficiency: 2,
      abilities: { str: 10, dex: 12, con: 14, int: 6, wis: 12, cha: 8 },
      resourceProfile: ['拟声', '孢尘'],
      statuses: ['模仿呼救'],
      traits: ['HP28/AC14'],
      skills: [
        { id: 'mimic-lure', name: '拟声诱捕', resource: '战斗技能', source: '敌方技能', formula: 'WIS豁免DC12；1d8+3精神', effect: '精神攻击干扰', cooldown: '每回合1次', rule: '豁免技能', roll: { kind: 'save', dc: 12, targetSaveBonus: 1, label: '拟声诱捕' }, tags: ['豁免'] },
        { id: 'mimic-dust', name: '孢粉爆发', resource: '战斗技能', source: '敌方技能', formula: 'CON豁免DC12；1d6+2毒素', effect: '范围毒素', cooldown: '每回合1次', rule: '豁免技能', roll: { kind: 'save', dc: 12, targetSaveBonus: 2, label: '孢粉爆发' }, tags: ['豁免'] },
      ],
      nonCombatSkills: [],
    },
  ],
  quickRules: [
    { title: '蓝伞菌毯', text: '浅滩上的菌盖会随机亮起，站在不稳定菌毯上的角色攻击可能被光晕干扰。' },
    { title: '目标', text: '击败所有孢化爬虫和拟声菌团即可获胜。' },
  ],
  backgroundUrl: '/assets/battle/battle01.png',
  eyebrow: '普通战斗 · 第一场',
  title: '蓝伞浅滩遭遇战',
  subtitle: '菌毯下的埋伏',
  backLabel: '返回',
  rerollLog: '观察菌毯重新调整走位。',
  initialLog: '队伍刚踏入蓝伞浅滩深处，脚下的菌盖便开始泛起不安的蓝光。那些光不像是回应脚步——它们逆着队伍方向在移动。',
  initiativeNote: '凯娅最先察觉菌毯下的震动，而布洛克已经将铁锅挡在队伍最前方。',
  winTitle: '击退孢群',
  loseTitle: '被孢粉逼退',
  winText: '最后一只孢化爬虫被击退，蓝光渐渐稳定下来。布洛克用锅底翻开菌毯确认没有残留威胁。',
  loseText: '孢群的攻势比预料中更猛烈，队伍不得不后撤到安全距离。下次经过这里得准备更充分才行。',
  completeLabel: '继续前进',
};

// ============================================================
// 普通战斗二：骨柱湿地遭遇战
// ============================================================

export const BONE_MARSH_BATTLE_CONFIG: BattleConfig = {
  units: [
    {
      id: 'adv', name: '冒险者', faction: 'ally', role: '战士 Lv.3 / 前排护卫',
      portrait: '冒', model: 'adventurer',
      hp: 28, maxHp: 32, ac: 16, speed: 30, proficiency: 2,
      abilities: { str: 16, dex: 13, con: 15, int: 10, wis: 12, cha: 8 },
      resourceProfile: ['攻击', '护卫'],
      statuses: ['前排'],
      traits: ['HP28/AC16', '经历过蓝伞浅滩'],
      skills: [
        { id: 'adv-slash', name: '长剑挥砍', resource: '战斗技能', source: '职业技能', formula: 'STR+熟练 vs AC；1d8+4', effect: '正面劈砍', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'str', targetAc: 14, label: '长剑挥砍' }, tags: ['攻击'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'serin', name: '瑟琳', faction: 'ally', role: '银杖术士 / 法术支援',
      portrait: '瑟', model: 'selin',
      hp: 20, maxHp: 24, ac: 14, speed: 30, proficiency: 2,
      abilities: { str: 9, dex: 14, con: 12, int: 16, wis: 14, cha: 13 },
      resourceProfile: ['法术', '支援'],
      statuses: ['后排'],
      traits: ['HP20/AC14'],
      skills: [
        { id: 'serin-bolt', name: '银杖射击', resource: '战斗技能', source: '队友技能', formula: 'INT+熟练 vs AC；1d8+3光耀', effect: '远程法术射击', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'int', targetAc: 14, label: '银杖射击' }, tags: ['攻击'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'ailin', name: '艾琳', faction: 'ally', role: '白枝修女 / 治疗净化',
      portrait: '艾', model: 'ailin',
      hp: 22, maxHp: 26, ac: 15, speed: 30, proficiency: 2,
      abilities: { str: 10, dex: 12, con: 14, int: 13, wis: 16, cha: 14 },
      resourceProfile: ['治疗', '净化'],
      statuses: ['后排'],
      traits: ['HP22/AC15'],
      skills: [
        { id: 'ailin-heal', name: '白枝治疗', resource: '战斗技能', source: '队友技能', formula: '恢复1d8+3', effect: '包扎伤口', cooldown: '每回合1次', rule: '治疗骰', roll: { kind: 'healing', dieType: 'd8', diceCount: 1, bonus: 3, label: '白枝治疗' }, tags: ['治疗'] },
        { id: 'ailin-strike', name: '白枝杖击', resource: '战斗技能', source: '队友技能', formula: 'WIS+熟练 vs AC；1d6+2', effect: '近身防卫', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'wis', targetAc: 14, label: '白枝杖击' }, tags: ['攻击'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'brock', name: '布洛克', faction: 'ally', role: '矮人 / 孢海生存专家',
      portrait: '锅', model: 'senluo',
      hp: 30, maxHp: 34, ac: 16, speed: 25, proficiency: 2,
      abilities: { str: 16, dex: 12, con: 16, int: 10, wis: 15, cha: 8 },
      resourceProfile: ['攻击', '护卫'],
      statuses: ['前排'],
      traits: ['HP30/AC16'],
      skills: [
        { id: 'brock-smash', name: '铁锅重砸', resource: '战斗技能', source: '队友技能', formula: 'STR+熟练 vs AC；1d8+3钝击', effect: '正面砸击', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'str', targetAc: 14, label: '铁锅重砸' }, tags: ['攻击'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'kaiya', name: '凯娅', faction: 'ally', role: '黑市猎手 / 敏捷输出',
      portrait: '凯', model: 'kelaiya',
      hp: 18, maxHp: 22, ac: 15, speed: 35, proficiency: 2,
      abilities: { str: 11, dex: 17, con: 13, int: 12, wis: 14, cha: 10 },
      resourceProfile: ['攻击', '辅助'],
      statuses: ['后排'],
      traits: ['HP18/AC15'],
      skills: [
        { id: 'kaiya-stab', name: '匕首连刺', resource: '战斗技能', source: '队友技能', formula: 'DEX+熟练 vs AC；1d4+4穿刺', effect: '快速连续刺击', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'dex', targetAc: 14, label: '匕首连刺' }, tags: ['攻击'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'bone-beast', name: '骨柱孢兽', faction: 'enemy', role: '湿地大型污染生物',
      portrait: '兽', model: 'crawler',
      hp: 42, maxHp: 42, ac: 15, speed: 25, proficiency: 2,
      abilities: { str: 17, dex: 11, con: 16, int: 4, wis: 10, cha: 5 },
      resourceProfile: ['攻击', '毒素'],
      statuses: ['大型'],
      traits: ['HP42/AC15'],
      skills: [
        { id: 'bone-charge', name: '骨柱撞击', resource: '战斗技能', source: '敌方技能', formula: 'STR+熟练 vs AC；1d10+4钝击', effect: '重型撞击', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'str', targetAc: 16, label: '骨柱撞击' }, tags: ['攻击'] },
        { id: 'bone-dust', name: '孢尘喷吐', resource: '战斗技能', source: '敌方技能', formula: 'CON豁免DC13；1d8+3毒素', effect: '范围毒素喷吐', cooldown: '每回合1次', rule: '豁免技能', roll: { kind: 'save', dc: 13, targetSaveBonus: 2, label: '孢尘喷吐' }, tags: ['豁免'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'lurker-a', name: '泥沼潜伏者A', faction: 'enemy', role: '湿地伏击生物',
      portrait: '泥', model: 'crawler',
      hp: 20, maxHp: 20, ac: 14, speed: 20, proficiency: 1,
      abilities: { str: 13, dex: 14, con: 12, int: 3, wis: 9, cha: 4 },
      resourceProfile: ['伏击'],
      statuses: ['隐匿'],
      traits: ['HP20/AC14'],
      skills: [
        { id: 'lurker-a-grab', name: '泥浆缠绕', resource: '战斗技能', source: '敌方技能', formula: 'DEX+熟练 vs AC；1d6+3钝击', effect: '泥浆拖拽', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'dex', targetAc: 16, label: '泥浆缠绕' }, tags: ['攻击'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'lurker-b', name: '泥沼潜伏者B', faction: 'enemy', role: '湿地伏击生物',
      portrait: '泥', model: 'crawler',
      hp: 20, maxHp: 20, ac: 14, speed: 20, proficiency: 1,
      abilities: { str: 13, dex: 14, con: 12, int: 3, wis: 9, cha: 4 },
      resourceProfile: ['伏击'],
      statuses: ['隐匿'],
      traits: ['HP20/AC14'],
      skills: [
        { id: 'lurker-b-grab', name: '泥浆缠绕', resource: '战斗技能', source: '敌方技能', formula: 'DEX+熟练 vs AC；1d6+3钝击', effect: '泥浆拖拽', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'dex', targetAc: 16, label: '泥浆缠绕' }, tags: ['攻击'] },
      ],
      nonCombatSkills: [],
    },
  ],
  quickRules: [
    { title: '陷落菌毯', text: '部分地面会随机陷落，站位需要谨慎选择。' },
    { title: '孢子幻觉', text: '间歇性孢子脉冲会干扰视野，影响攻击命中。' },
    { title: '目标', text: '击败骨柱孢兽和两个泥沼潜伏者即可获胜。' },
  ],
  backgroundUrl: '/assets/battle/battle02.png',
  eyebrow: '普通战斗 · 第二场',
  title: '骨柱湿地遭遇战',
  subtitle: '泥沼深处的猎手',
  backLabel: '返回',
  rerollLog: '调整阵型，避开最松软的泥面。',
  initialLog: '骨柱湿地不像蓝伞浅滩那样明亮。这里的菌柱从泥中刺出，颜色像陈旧骨头。每走一步，泥面下都会泛起细小气泡。',
  initiativeNote: '凯娅最先察觉右前方泥面异常平整——那是刚刚合上的捕食坑。布洛克压低声音提醒所有人不要分散。',
  winTitle: '击退湿地猎手',
  loseTitle: '被湿地逼退',
  winText: '骨柱孢兽倒在泥沼中，菌丝缓缓沉入暗处。湿地重新沉入低沉的寂静。',
  loseText: '泥沼中的伏击比预想的更凶猛。队伍勉强后撤到坚实地面，下次必须先清出一条更安全的路。',
  completeLabel: '继续前进',
};

// ============================================================
// Boss 战：黑石门卫
// ============================================================

export const BLACKSTONE_GATEKEEPER_BOSS_CONFIG: BattleConfig = {
  units: [
    {
      id: 'adv', name: '冒险者', faction: 'ally', role: '战士 Lv.3 / 前排护卫',
      portrait: '冒', model: 'adventurer',
      hp: 26, maxHp: 32, ac: 16, speed: 30, proficiency: 2,
      abilities: { str: 16, dex: 13, con: 15, int: 10, wis: 12, cha: 8 },
      resourceProfile: ['攻击', '护卫'],
      statuses: ['前排'],
      traits: ['HP26/AC16', '经历两场战斗'],
      skills: [
        { id: 'adv-slash', name: '剑刃风暴', resource: '战斗技能', source: '职业技能', formula: 'STR+熟练 vs AC；1d8+4', effect: '全力斩击', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'str', targetAc: 17, label: '剑刃风暴' }, tags: ['攻击'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'serin', name: '瑟琳', faction: 'ally', role: '银杖术士 / 法术支援',
      portrait: '瑟', model: 'selin',
      hp: 18, maxHp: 24, ac: 14, speed: 30, proficiency: 2,
      abilities: { str: 9, dex: 14, con: 12, int: 16, wis: 14, cha: 13 },
      resourceProfile: ['法术', '支援'],
      statuses: ['后排', '银杖裂痕'],
      traits: ['HP18/AC14', '银杖在黑石脉冲中不稳'],
      skills: [
        { id: 'serin-bolt', name: '银杖射击', resource: '战斗技能', source: '队友技能', formula: 'INT+熟练 vs AC；1d8+3光耀', effect: '远程法术射击', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'int', targetAc: 17, label: '银杖射击' }, tags: ['攻击'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'ailin', name: '艾琳', faction: 'ally', role: '白枝修女 / 治疗净化',
      portrait: '艾', model: 'ailin',
      hp: 20, maxHp: 26, ac: 15, speed: 30, proficiency: 2,
      abilities: { str: 10, dex: 12, con: 14, int: 13, wis: 16, cha: 14 },
      resourceProfile: ['治疗', '净化'],
      statuses: ['后排'],
      traits: ['HP20/AC15'],
      skills: [
        { id: 'ailin-heal', name: '白枝治疗', resource: '战斗技能', source: '队友技能', formula: '恢复1d8+3', effect: '紧急包扎', cooldown: '每回合1次', rule: '治疗骰', roll: { kind: 'healing', dieType: 'd8', diceCount: 1, bonus: 3, label: '白枝治疗' }, tags: ['治疗'] },
        { id: 'ailin-strike', name: '白枝杖击', resource: '战斗技能', source: '队友技能', formula: 'WIS+熟练 vs AC；1d6+2', effect: '近身防卫', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'wis', targetAc: 17, label: '白枝杖击' }, tags: ['攻击'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'brock', name: '布洛克', faction: 'ally', role: '矮人 / 孢海生存专家',
      portrait: '锅', model: 'senluo',
      hp: 28, maxHp: 34, ac: 16, speed: 25, proficiency: 2,
      abilities: { str: 16, dex: 12, con: 16, int: 10, wis: 15, cha: 8 },
      resourceProfile: ['攻击', '护卫'],
      statuses: ['前排'],
      traits: ['HP28/AC16'],
      skills: [
        { id: 'brock-smash', name: '铁锅重砸', resource: '战斗技能', source: '队友技能', formula: 'STR+熟练 vs AC；1d8+3钝击', effect: '正面砸击', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'str', targetAc: 17, label: '铁锅重砸' }, tags: ['攻击'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'kaiya', name: '凯娅', faction: 'ally', role: '黑市猎手 / 敏捷输出',
      portrait: '凯', model: 'kelaiya',
      hp: 16, maxHp: 22, ac: 15, speed: 35, proficiency: 2,
      abilities: { str: 11, dex: 17, con: 13, int: 12, wis: 14, cha: 10 },
      resourceProfile: ['攻击', '辅助'],
      statuses: ['后排'],
      traits: ['HP16/AC15'],
      skills: [
        { id: 'kaiya-stab', name: '暗影突刺', resource: '战斗技能', source: '队友技能', formula: 'DEX+熟练 vs AC；1d4+4穿刺', effect: '快速连续刺击', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'dex', targetAc: 17, label: '暗影突刺' }, tags: ['攻击'] },
      ],
      nonCombatSkills: [],
    },
    {
      id: 'boss-gatekeeper', name: '黑石门卫', faction: 'enemy', role: '第一幕关底Boss',
      portrait: 'Boss', model: 'crawler',
      hp: 80, maxHp: 80, ac: 17, speed: 20, proficiency: 3,
      abilities: { str: 20, dex: 10, con: 18, int: 6, wis: 14, cha: 8 },
      resourceProfile: ['攻击', '脉冲', '污染'],
      statuses: ['大型', 'Boss'],
      traits: ['HP80/AC17', '三阶段：苏醒→封锁→核心暴露'],
      skills: [
        { id: 'boss-sweep', name: '根须横扫', resource: '战斗技能', source: '敌方技能', formula: 'STR+熟练 vs AC；2d6+5钝击', effect: '范围横扫攻击', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'str', targetAc: 16, label: '根须横扫' }, tags: ['攻击'] },
        { id: 'boss-pulse', name: '黑石脉冲', resource: '战斗技能', source: '敌方技能', formula: 'CON豁免DC14；1d10+4力场', effect: '全队脉冲伤害', cooldown: '每2回合1次', rule: '豁免技能', roll: { kind: 'save', dc: 14, targetSaveBonus: 2, label: '黑石脉冲' }, tags: ['豁免'] },
        { id: 'boss-dust', name: '孢粉污染', resource: '战斗技能', source: '敌方技能', formula: 'CON豁免DC13；1d8+3毒素', effect: '污染扩散', cooldown: '每回合1次', rule: '豁免技能', roll: { kind: 'save', dc: 13, targetSaveBonus: 2, label: '孢粉污染' }, tags: ['豁免'] },
      ],
      nonCombatSkills: [],
    },
  ],
  quickRules: [
    { title: '三阶段', text: 'HP>50%苏醒阶段；HP25-50%封锁展开；HP<25%核心暴露→进入关键选择。' },
    { title: '黑石脉冲', text: '每两回合全队脉冲，瑟琳银杖会受影响，法术不稳定。' },
    { title: '核心暴露', text: 'HP降至25%以下核心暴露，战斗暂停，需在破坏和稳定核心之间选择。' },
  ],
  backgroundUrl: '/assets/battle/battle03.png',
  eyebrow: 'Boss 战 · 第一幕关底',
  title: '黑石门卫',
  subtitle: '黑暗之门前庭的古老守卫',
  backLabel: '返回',
  rerollLog: '调整站位，避开不断蔓延的黑石根须。',
  initialLog: '黑石根区深处，一具巨大的门前守卫从菌根与碎石中抬起。它像一棵倒长的黑色巨树，胸口嵌着黑色方尖碑碎片。根须和金属骨架纠缠成手臂，发出断续的警戒音。',
  initiativeNote: '瑟琳的银杖在黑石脉冲中发出嗡鸣：「它不是普通魔物——小心胸口的核心。」',
  winTitle: '黑石门卫击破',
  loseTitle: '逆时归零',
  winText: '黑石门卫的根须缓缓垂落，方尖碑碎片在胸口暴露出来。瑟琳握紧银杖，等你做出最后的选择。',
  loseText: '黑石脉冲将队伍击倒在地。你感到时间在倒流——然后一切归于寂静。',
  completeLabel: '做出选择',
};

// ============================================================
// 战斗ID映射
// ============================================================

export const BATTLE_CONFIG_MAP: Record<string, BattleConfig> = {
  enemy_pack_blue_shoal: BLUE_SHOAL_BATTLE_CONFIG,
  enemy_pack_bone_marsh: BONE_MARSH_BATTLE_CONFIG,
  boss_blackstone_gatekeeper: BLACKSTONE_GATEKEEPER_BOSS_CONFIG,
};

export function getBattleConfigById(battleId: string): BattleConfig | undefined {
  return BATTLE_CONFIG_MAP[battleId];
}
