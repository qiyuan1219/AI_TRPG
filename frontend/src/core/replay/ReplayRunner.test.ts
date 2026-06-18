import { describe, expect, it } from 'vitest';
import { createStateHash } from '../debug/stateDiff';
import type { CompatibleGameState } from '../state/gameState';
import { runReplay } from './ReplayRunner';

describe('ReplayRunner', () => {
  it('replays recorded state patches without rolling dice or calling AI', () => {
    const expected = { player: { gold: 12 }, inventory: { items: ['potion'] } } as unknown as CompatibleGameState;
    const result = runReplay({
      schemaVersion: 1,
      initialGameState: { player: { gold: 10 }, inventory: { items: [] } } as unknown as CompatibleGameState,
      actions: [{ id: 'a1', type: 'item.use', actorId: 'player', itemId: 'gold', targetIds: [], createdAt: 1 }],
      diceEvents: [],
      statePatches: [{
        schemaVersion: 1,
        patchId: 'p1',
        source: 'rules',
        createdAt: new Date(0).toISOString(),
        patches: [
          { op: 'increment', path: 'player.gold', value: 2 },
          { op: 'append', path: 'inventory.items', value: 'potion' },
        ],
      }],
      eventLog: [],
      expectedStateHash: createStateHash(expected),
    });

    expect(result.ok).toBe(true);
    expect(result.finalState).toEqual(expected);
  });
});
