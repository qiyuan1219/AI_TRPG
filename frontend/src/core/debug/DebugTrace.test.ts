import { describe, expect, it } from 'vitest';
import { createDebugTrace } from './createDebugTrace';

describe('DebugTrace', () => {
  it('records state hashes, diff and action id', () => {
    const trace = createDebugTrace({
      action: { id: 'a1', type: 'story.submit', actorId: 'player', text: 'go', createdAt: 1 },
      previousState: { player: { gold: 1 } },
      nextState: { player: { gold: 2 } },
    });

    expect(trace.schemaVersion).toBe(1);
    expect(trace.actionId).toBe('a1');
    expect(trace.state?.diff?.[0].path).toBe('player.gold');
  });
});
