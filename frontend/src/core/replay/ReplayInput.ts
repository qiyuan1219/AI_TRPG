import type { GameAction, StatePatchEnvelope } from '../actions/types';
import type { DiceEvent } from '../dice/DiceEvent';
import type { EventEnvelope } from '../events/EventEnvelope';
import type { CompatibleGameState } from '../state/gameState';

export interface ReplayInput {
  schemaVersion: 1;
  initialGameState: CompatibleGameState;
  actions: GameAction[];
  diceEvents: DiceEvent[];
  statePatches: StatePatchEnvelope[];
  eventLog: Array<EventEnvelope<unknown>>;
  rngSeed?: string;
  expectedStateHash?: string;
}
