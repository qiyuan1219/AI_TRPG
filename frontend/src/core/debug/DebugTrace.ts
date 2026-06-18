import type { GameAction, StatePatchOperation } from '../actions/types';
import type { StateDiffEntry } from './stateDiff';

export const DEBUG_TRACE_SCHEMA_VERSION = 1 as const;

export interface DebugError {
  message: string;
  stack?: string;
  source?: string;
}

export interface DebugTrace {
  traceId: string;
  schemaVersion: typeof DEBUG_TRACE_SCHEMA_VERSION;
  createdAt: string;
  action?: GameAction;
  actionId?: string;
  eventIds: string[];
  diceRollIds: string[];
  ai?: {
    requestId: string;
    rawOutput?: string;
    parsedOutput?: unknown;
    schemaValid: boolean;
    warnings?: string[];
  };
  patch?: {
    patchId: string;
    source: string;
    accepted: boolean;
    rejectionReason?: string;
    operations?: StatePatchOperation[] | unknown[];
  };
  state?: {
    prevStateHash: string;
    nextStateHash: string;
    diff?: StateDiffEntry[];
  };
  errors?: DebugError[];
}
