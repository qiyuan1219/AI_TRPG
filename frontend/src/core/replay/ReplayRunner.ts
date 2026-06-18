import type { StatePatchOperation } from '../actions/types';
import type { CompatibleGameState } from '../state/gameState';
import { createStateHash } from '../debug/stateDiff';
import type { ReplayInput } from './ReplayInput';
import type { ReplayResult } from './ReplayResult';

function cloneState(state: CompatibleGameState): CompatibleGameState {
  return JSON.parse(JSON.stringify(state || {}));
}

function setPath(target: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split('.').filter(Boolean);
  let cursor: Record<string, unknown> = target;
  for (const part of parts.slice(0, -1)) {
    if (typeof cursor[part] !== 'object' || cursor[part] === null) cursor[part] = {};
    cursor = cursor[part] as Record<string, unknown>;
  }
  cursor[parts[parts.length - 1]] = value;
}

function getPath(target: Record<string, unknown>, path: string) {
  return path.split('.').filter(Boolean).reduce<unknown>((cursor, part) => (
    typeof cursor === 'object' && cursor !== null ? (cursor as Record<string, unknown>)[part] : undefined
  ), target);
}

function removePath(target: Record<string, unknown>, path: string) {
  const parts = path.split('.').filter(Boolean);
  const key = parts.pop();
  const parent = parts.reduce<unknown>((cursor, part) => (
    typeof cursor === 'object' && cursor !== null ? (cursor as Record<string, unknown>)[part] : undefined
  ), target);
  if (key && typeof parent === 'object' && parent !== null) delete (parent as Record<string, unknown>)[key];
}

function applyPatchOperation(state: CompatibleGameState, patch: StatePatchOperation) {
  if (patch.op === 'set') setPath(state, patch.path, patch.value);
  if (patch.op === 'increment') {
    const current = Number(getPath(state, patch.path) || 0);
    setPath(state, patch.path, current + patch.value);
  }
  if (patch.op === 'merge') {
    const current = getPath(state, patch.path);
    setPath(state, patch.path, { ...(typeof current === 'object' && current ? current : {}), ...patch.value });
  }
  if (patch.op === 'append') {
    const current = getPath(state, patch.path);
    setPath(state, patch.path, [...(Array.isArray(current) ? current : []), patch.value]);
  }
  if (patch.op === 'remove') removePath(state, patch.path);
}

export function runReplay(input: ReplayInput): ReplayResult {
  const finalState = cloneState(input.initialGameState);
  const warnings: string[] = [];

  if (input.diceEvents.length === 0) {
    warnings.push('Replay input has no dice events; deterministic dice verification was skipped.');
  }

  input.statePatches.forEach((envelope) => {
    envelope.patches.forEach((patch) => applyPatchOperation(finalState, patch));
  });

  const actualStateHash = createStateHash(finalState);
  const expectedStateHash = input.expectedStateHash;
  const ok = !expectedStateHash || expectedStateHash === actualStateHash;

  return {
    ok,
    finalState,
    expectedStateHash,
    actualStateHash,
    warnings,
    mismatch: ok ? undefined : {
      index: input.statePatches.length - 1,
      actionId: input.actions[input.actions.length - 1]?.id,
      expected: expectedStateHash,
      actual: actualStateHash,
      reason: 'Final state hash does not match expectedStateHash.',
    },
  };
}
