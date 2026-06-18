import { submitAuthoritativeBattleAction, type AuthoritativeBattleResult } from '../../services/api';
import { registerActionResolver } from './registry';

registerActionResolver('battle.skill', async (state, action) => {
  const battleId = state.battle?.battleId;
  if (!battleId) {
    return { schemaVersion: 1, accepted: false, actionId: action.id, events: [], patches: [], errors: ['当前没有权威战斗状态'], needsNarration: false };
  }
  try {
    const result: AuthoritativeBattleResult = await submitAuthoritativeBattleAction(battleId, {
      actorId: action.actorId,
      skillId: action.skillId,
      targetIds: action.targetIds,
    });
    return {
      schemaVersion: 1,
      accepted: true,
      actionId: action.id,
      events: result.events,
      patches: [{ op: 'set', path: 'battle', value: result.updatedBattleState }],
      errors: [],
      needsNarration: true,
      updatedState: { ...state, battle: result.updatedBattleState },
      metadata: { authoritativeBattle: result },
    };
  } catch (error) {
    return {
      schemaVersion: 1,
      accepted: false,
      actionId: action.id,
      events: [],
      patches: [],
      errors: [error instanceof Error ? error.message : '战斗行动提交失败'],
      needsNarration: false,
    };
  }
});

export {};
