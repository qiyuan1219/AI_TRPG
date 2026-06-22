import type { GameAction, StatePatchEnvelope } from '../actions/types';
import type { DiceEvent } from '../dice/DiceEvent';
import type { EventEnvelope } from '../events/EventEnvelope';
import { DEBUG_TRACE_SCHEMA_VERSION, type DebugError, type DebugTrace } from './DebugTrace';
import { createStateHash, diffState } from './stateDiff';
import { randomUuid } from '../random/secureRandom';

export interface CreateDebugTraceInput {
  action?: GameAction;
  events?: Array<EventEnvelope<unknown> | Record<string, unknown>>;
  diceEvents?: DiceEvent[];
  patch?: StatePatchEnvelope & { accepted?: boolean; rejectionReason?: string };
  previousState?: unknown;
  nextState?: unknown;
  ai?: DebugTrace['ai'];
  errors?: DebugError[];
}

function readEventId(event: EventEnvelope<unknown> | Record<string, unknown>) {
  return String((event as Record<string, unknown>).eventId || (event as Record<string, unknown>).id || '');
}

export function createDebugTrace(input: CreateDebugTraceInput): DebugTrace {
  const previousState = input.previousState;
  const nextState = input.nextState;
  return {
    traceId: randomUuid(),
    schemaVersion: DEBUG_TRACE_SCHEMA_VERSION,
    createdAt: new Date().toISOString(),
    action: input.action,
    actionId: input.action?.id,
    eventIds: (input.events || []).map(readEventId).filter(Boolean),
    diceRollIds: (input.diceEvents || []).map((event) => event.rollId || event.id).filter(Boolean),
    ai: input.ai,
    patch: input.patch ? {
      patchId: input.patch.patchId,
      source: input.patch.source,
      accepted: input.patch.accepted ?? true,
      rejectionReason: input.patch.rejectionReason,
      operations: input.patch.patches,
    } : undefined,
    state: previousState !== undefined && nextState !== undefined ? {
      prevStateHash: createStateHash(previousState),
      nextStateHash: createStateHash(nextState),
      diff: diffState(previousState, nextState),
    } : undefined,
    errors: input.errors,
  };
}
