import { describe, expect, it } from 'vitest';
import { authoritativeAmountByTarget, authoritativeDice, toAuthoritativeBattlePayload } from './authoritativeAdapter';
import { getBattleConfigById } from '../../data/battleConfigs';
import { formatResult, getFinalFace } from '../../components/DiceRollOverlay';

function resultWith(event: Record<string, unknown>) {
  return {
    battleId: 'battle-1',
    battleState: {
      battleId: 'battle-1', phase: 'WAITING_FOR_ACTION', round: 1, turnIndex: 0,
      characters: [
        { id: 'hero', name: '冒险者', team: 'player', alive: true, attributes: {}, combatStats: { hp: 20, maxHp: 20, armor: 0, maxArmor: 0, defense: 14, attackBonus: 0, initiativeBonus: 0 }, resources: {}, skillIds: ['s'], statuses: [], cooldowns: {} },
        { id: 'enemy', name: '裂隙爬兽', team: 'enemy', alive: true, attributes: {}, combatStats: { hp: 12, maxHp: 20, armor: 0, maxArmor: 0, defense: 10, attackBonus: 0, initiativeBonus: 0 }, resources: {}, skillIds: [], statuses: [], cooldowns: {} },
      ],
      skills: { s: { name: '测试技能' } }, initiative: [], actionLog: [], eventLog: [], diceLog: [], rngSeed: 1, rngCursor: 1,
    },
    updatedBattleState: {} as never, currentActor: null, legalActions: [], events: [event],
  } as any;
}

describe('authoritative battle dice mapping', () => {
  it('keeps 2d4 damage rolls and never uses total as a face', () => {
    const result = resultWith({ type: 'damage', actorId: 'hero', targetId: 'enemy', skillId: 's', dice: '2d4', diceResult: [2, 4], rawDamage: 8 });
    const dice = authoritativeDice(result, 'damage');

    expect(dice?.event).toMatchObject({ type: 'damage', diceSides: 4, rolls: [2, 4], modifier: 2, total: 8 });
    expect(formatResult(dice!, 'd20')).toMatchObject({ roll: '2', total: '8', dc: undefined, verdict: '结果：8' });
    expect(getFinalFace(4, dice!.event!.rolls)).toBe(2);
    expect(getFinalFace(4, [8])).toBeNull();
  });

  it('keeps attack AC semantics separate from damage', () => {
    const result = resultWith({ type: 'attack_roll', actorId: 'hero', targetId: 'enemy', skillId: 's', rawRoll: 7, modifier: 3, total: 10, targetDefense: 10, result: 'hit' });
    const dice = authoritativeDice(result, 'attack');

    expect(dice?.event).toMatchObject({ type: 'attack', rolls: [7], total: 10, ac: 10, success: true });
    expect(formatResult(dice!, 'd20')).toMatchObject({ roll: '7', dc: 'AC10', success: true });
  });

  it('群体伤害浮字按各目标的后端事件分别显示', () => {
    const result = resultWith({ type: 'damage', targetId: 'enemy', rawDamage: 7 });
    result.events.push({ type: 'damage', targetId: 'enemy-a', rawDamage: 5 });
    expect(authoritativeAmountByTarget(result)).toEqual({ enemy: 7, 'enemy-a': 5 });
  });

  it('拟声菌团孢粉爆发发送全体豁免而不是单体命中', () => {
    const config = getBattleConfigById('enemy_pack_blue_shoal')!;
    const payload = toAuthoritativeBattlePayload(config, config.units);
    const skill = Object.values(payload.skills).find((entry: any) => entry.name === '孢粉爆发') as any;
    expect(skill).toMatchObject({ targetType: 'all_enemies', requiresHitRoll: false, requiresSaveRoll: true });
  });

  it('黑石脉冲按“全队”语义发送全体豁免并逐人结算', () => {
    const config = getBattleConfigById('boss_blackstone_gatekeeper')!;
    const payload = toAuthoritativeBattlePayload(config, config.units);
    const skill = Object.values(payload.skills).find((entry: any) => entry.name === '黑石脉冲') as any;
    expect(skill).toMatchObject({ targetType: 'all_enemies', damageDice: '1d12', requiresHitRoll: false, requiresSaveRoll: true });
  });
});
