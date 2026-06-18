import type { CompatibleGameState } from '../state/gameState';
import type { ActionResolver, ActionResult, GameAction } from './types';

const resolvers = new Map<GameAction['type'], ActionResolver>();

export function registerActionResolver<T extends GameAction['type']>(
  type: T,
  resolver: ActionResolver<Extract<GameAction, { type: T }>>,
) {
  resolvers.set(type, resolver as ActionResolver);
}

export async function dispatchGameAction(state: CompatibleGameState, action: GameAction): Promise<ActionResult> {
  const resolver = resolvers.get(action.type);
  if (!resolver) {
    return { schemaVersion: 1, accepted: false, actionId: action.id, events: [], patches: [], errors: [`未注册动作解析器：${action.type}`], needsNarration: false };
  }
  return resolver(state, action);
}

export function registeredActionTypes() {
  return [...resolvers.keys()];
}
