import {
  getAuthoritativeBattle,
  startAuthoritativeBattle,
  submitAuthoritativeBattleAction,
  type AuthoritativeBattleAction,
  type AuthoritativeBattleResult,
} from '../../services/api';

export class BattleController {
  start(payload: Parameters<typeof startAuthoritativeBattle>[0]) {
    return startAuthoritativeBattle(payload);
  }

  resume(battleId: string) {
    return getAuthoritativeBattle(battleId);
  }

  act(battleId: string, action: AuthoritativeBattleAction): Promise<AuthoritativeBattleResult> {
    return submitAuthoritativeBattleAction(battleId, action);
  }
}

export const battleController = new BattleController();
