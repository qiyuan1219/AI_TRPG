import type { CompatibleGameState } from '../state/gameState';

export interface ReplayResult {
  ok: boolean;
  finalState: CompatibleGameState;
  expectedStateHash?: string;
  actualStateHash: string;
  mismatch?: {
    index: number;
    actionId?: string;
    expected?: unknown;
    actual?: unknown;
    reason: string;
  };
  warnings?: string[];
}
