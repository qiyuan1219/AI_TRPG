import type { AuthoritativeBattleResult } from '../../services/api';

export interface BattleViewModel {
  actorId?: string;
  allyIds: string[];
  enemyIds: string[];
  livingAllyIds: string[];
  livingEnemyIds: string[];
  won: boolean;
  lost: boolean;
}

export function createBattleViewModel(result: AuthoritativeBattleResult | null): BattleViewModel {
  const characters = result?.battleState.characters || [];
  const allies = characters.filter((unit) => unit.team === 'player');
  const enemies = characters.filter((unit) => unit.team === 'enemy');
  return {
    actorId: result?.currentActor?.id,
    allyIds: allies.map((unit) => unit.id),
    enemyIds: enemies.map((unit) => unit.id),
    livingAllyIds: allies.filter((unit) => unit.alive && unit.combatStats.hp > 0).map((unit) => unit.id),
    livingEnemyIds: enemies.filter((unit) => unit.alive && unit.combatStats.hp > 0).map((unit) => unit.id),
    won: result?.battleState.phase === 'BATTLE_END' && result.battleState.winner === 'player',
    lost: result?.battleState.phase === 'BATTLE_END' && result.battleState.winner === 'enemy',
  };
}
