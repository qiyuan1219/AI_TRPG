import type { BattleSkill } from '../components/BattleTestScreen';

function defenseSkill(id: string, source: BattleSkill['source'] = '队友技能'): BattleSkill {
  return {
    id,
    name: '防御',
    resource: '战斗技能',
    source,
    formula: '下次受到伤害 -50%',
    effect: '进入防御姿态，下一次受到伤害降低50%，触发后失效。',
    cooldown: '每回合 1 次',
    rule: '防御动作',
    roll: { kind: 'none' },
    tags: ['防御', '护盾', '减伤'],
  };
}

const SHARED_PARTY_SKILLS: Record<string, BattleSkill[]> = {
  adventurer: [
    { id: 'TA1', name: '稳步斩击', resource: '战斗技能', source: '职业技能', formula: 'STR + 熟练 vs AC；1d8+3 挥砍', effect: '对单体敌人造成武器伤害。', cooldown: '每回合 1 次', rule: '攻击检定', roll: { kind: 'attack', ability: 'str', targetAc: 12, label: '稳步斩击命中判定' }, tags: ['攻击', 'AC'] },
    { id: 'TA2', name: '回气', resource: '战斗技能', source: '职业技能', formula: '恢复 1d8+3 HP', effect: '立即恢复自身生命值。', cooldown: '每战斗 1 次', rule: '治疗骰', roll: { kind: 'healing', dieType: 'd8', diceCount: 1, bonus: 3, label: '回气恢复量' }, tags: ['治疗', 'HP'] },
    defenseSkill('TA3', '职业技能'),
  ],
  selin: [
    { id: 'SE1', name: '银钟光束', resource: '战斗技能', source: '队友技能', formula: 'INT + 熟练 vs AC；1d8+3 光耀', effect: '对单体敌人造成远程法术伤害。', cooldown: '每回合 1 次', rule: '法术攻击', roll: { kind: 'attack', ability: 'int', targetAc: 12, label: '银钟光束命中判定' }, tags: ['法术攻击', '光耀'] },
    { id: 'SE2', name: '星轨震荡', resource: '战斗技能', source: '队友技能', formula: 'INT + 熟练 vs AC；2d4 奥术', effect: '对所有敌人造成2d4点伤害，主目标额外受到2点伤害。', cooldown: '每回合 1 次', rule: '范围法术攻击', roll: { kind: 'attack', ability: 'int', targetAc: 12, label: '星轨震荡命中判定' }, tags: ['法术攻击', '范围', '全体', '奥术'], primaryTargetBonus: 2 },
    defenseSkill('SE3'),
  ],
  senluo: [
    { id: 'SN1', name: '铁锅猛击', resource: '战斗技能', source: '队友技能', formula: 'STR+熟练 vs AC；1d8+3钝击', effect: '对单体敌人造成钝击伤害。', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'str', targetAc: 14, label: '铁锅猛击' }, tags: ['攻击'] },
    { id: 'SN2', name: '矮人炖汤', resource: '战斗技能', source: '队友技能', formula: '恢复1d12+3', effect: '为单体队友恢复1D12+3点生命值。', cooldown: '每战斗2次', rule: '治疗骰', roll: { kind: 'healing', dieType: 'd12', diceCount: 1, bonus: 3, label: '矮人炖汤' }, tags: ['治疗'] },
    defenseSkill('SN3'),
  ],
  ailin: [
    { id: 'AL1', name: '生命之光', resource: '战斗技能', source: '队友技能', formula: '恢复1d8+2', effect: '为单体队友恢复1D8+2点生命值。', cooldown: '每回合1次', rule: '治疗骰', roll: { kind: 'healing', dieType: 'd8', diceCount: 1, bonus: 2, label: '生命之光' }, tags: ['治疗'] },
    { id: 'AL2', name: '白枝杖击', resource: '战斗技能', source: '队友技能', formula: '恢复2d6+2', effect: '为我方全体恢复2D6+2点生命值。', cooldown: '每回合1次', rule: '治疗骰', roll: { kind: 'healing', dieType: 'd6', diceCount: 2, bonus: 2, label: '白枝杖击' }, tags: ['治疗', '群体', '全体'] },
    defenseSkill('AL3'),
  ],
  kelaiya: [
    { id: 'KL1', name: '猫爪突袭', resource: '战斗技能', source: '队友技能', formula: 'DEX+熟练 vs AC；1d6+4+2d6偷袭', effect: '对单体敌人造成偷袭伤害。', cooldown: '每回合1次', rule: '偷袭', roll: { kind: 'attack', ability: 'dex', targetAc: 14, label: '猫爪突袭' }, tags: ['攻击'] },
    { id: 'KL2', name: '弱点刺击', resource: '战斗技能', source: '队友技能', formula: 'DEX+熟练 vs AC；1d12穿刺', effect: '对单体敌人造成1D12点伤害。', cooldown: '每回合1次', rule: '攻击检定', roll: { kind: 'attack', ability: 'dex', targetAc: 14, label: '弱点刺击' }, tags: ['攻击'] },
    defenseSkill('KL3'),
  ],
};

export function getSharedPartySkills(model: string): BattleSkill[] | undefined {
  return SHARED_PARTY_SKILLS[model]?.map((skill) => ({
    ...skill,
    roll: { ...skill.roll },
    tags: [...skill.tags],
  }));
}
