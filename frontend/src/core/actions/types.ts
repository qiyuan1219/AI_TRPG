import type { CompatibleGameState } from '../state/gameState';

type VersionedAction = { schemaVersion?: 1 };

export type GameAction = VersionedAction & (
  | { id: string; type: 'story.submit'; actorId: string; text: string; createdAt: number }
  | { id: string; type: 'story.check'; actorId: string; checkId: string; createdAt: number }
  | { id: string; type: 'item.use'; actorId: string; itemId: string; targetIds: string[]; createdAt: number }
  | { id: string; type: 'shop.buy'; actorId: string; itemId: string; quantity: number; createdAt: number }
  | { id: string; type: 'shop.sell'; actorId: string; itemId: string; quantity: number; createdAt: number }
  | { id: string; type: 'battle.start'; actorId: string; encounterId: string; createdAt: number }
  | { id: string; type: 'battle.prep.confirm'; actorId: string; encounterId: string; createdAt: number }
  | { id: string; type: 'battle.skill'; actorId: string; skillId: string; targetIds: string[]; createdAt: number }
);

export type StatePatchOperation =
  | { op: 'set'; path: string; value: unknown }
  | { op: 'increment'; path: string; value: number }
  | { op: 'merge'; path: string; value: Record<string, unknown> }
  | { op: 'append'; path: string; value: unknown }
  | { op: 'remove'; path: string };

export interface ActionResult {
  schemaVersion: 1;
  accepted: boolean;
  actionId: string;
  events: Array<Record<string, unknown>>;
  patches: StatePatchOperation[];
  errors: string[];
  needsNarration: boolean;
  updatedState?: CompatibleGameState;
  metadata?: Record<string, unknown>;
}

export interface StatePatchEnvelope {
  schemaVersion: 1;
  patchId: string;
  source: 'system' | 'rules' | 'ai_candidate' | 'migration' | 'ui';
  correlationId?: string;
  patches: StatePatchOperation[];
  createdAt: string;
}

export type ActionResolver<T extends GameAction = GameAction> = (
  state: CompatibleGameState,
  action: T,
) => Promise<ActionResult> | ActionResult;
