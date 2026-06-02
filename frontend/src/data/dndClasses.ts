import type { CharacterPreset } from '../types/game';

export const DND_CLASSES: CharacterPreset[] = [
  {
    id: 'warrior',
    name: '战士',
    mark: 'W',
    desc: '前排坦克，高 AC 高 HP。近战输出主力，每场战斗冲在最前面。',
    stats: { str: 16, dex: 13, con: 15, int: 10, wis: 12, cha: 8 },
    pros: ['最高 AC 和 HP', '近战伤害最高', '能嘲讽保护同伴'],
    cons: ['远程乏力', '解谜和社交较弱'],
  },
  {
    id: 'rogue',
    name: '游荡者',
    mark: 'R',
    desc: '灵活刺客，高爆发偷袭。潜行、开锁、陷阱全精通。',
    stats: { str: 10, dex: 16, con: 14, int: 12, wis: 13, cha: 8 },
    pros: ['潜行先手偷袭', '解陷阱开锁主力', '高单体爆发'],
    cons: ['脆皮不能扛', '需要队友配合'],
  },
  {
    id: 'wizard',
    name: '法师',
    mark: 'M',
    desc: '远程炮台，法术轰炸。火球术清怪最快，解谜核心。',
    stats: { str: 8, dex: 13, con: 14, int: 16, wis: 12, cha: 10 },
    pros: ['AOE 清怪最强', '解谜调查主力', '法术花样多'],
    cons: ['AC 最低最脆', '法术位有限'],
  },
  {
    id: 'cleric',
    name: '牧师',
    mark: 'C',
    desc: '治疗辅助，亡灵克星。加血加 buff，团队生存保障。',
    stats: { str: 13, dex: 10, con: 14, int: 12, wis: 16, cha: 8 },
    pros: ['唯一治疗职业', '亡灵特攻', '团队 buff'],
    cons: ['输出较低', '仇恨高易被集火'],
  },
  {
    id: 'paladin',
    name: '圣骑士',
    mark: 'P',
    desc: '攻守兼备，魅力领袖。能打能奶，社交最强。',
    stats: { str: 15, dex: 10, con: 13, int: 8, wis: 12, cha: 14 },
    pros: ['攻守均衡', '魅力社交优势', 'Boss 战爆发'],
    cons: ['各方面不突出', '法术位少'],
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
