import { describe, expect, it } from 'vitest';
import { createBattleViewModel } from './BattleViewModel';

describe('BattleViewModel', () => {
  it('derives living teams and outcome from authoritative state', () => {
    const result: any = {
      currentActor: { id: 'player' },
      battleState: {
        phase: 'BATTLE_END',
        winner: 'player',
        characters: [
          { id: 'player', team: 'player', alive: true, combatStats: { hp: 5 } },
          { id: 'enemy', team: 'enemy', alive: false, combatStats: { hp: 0 } },
        ],
      },
    };
    expect(createBattleViewModel(result)).toMatchObject({
      actorId: 'player',
      livingAllyIds: ['player'],
      livingEnemyIds: [],
      won: true,
      lost: false,
    });
  });
});
