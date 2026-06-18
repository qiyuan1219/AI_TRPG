import { afterEach, describe, expect, it } from 'vitest';
import { forcedDiceEvent, rollDiceEvent, setDiceFaceProviderForTests } from './createDiceEvent';
import { normalizeDiceEvent } from './DiceEventMapper';

afterEach(() => setDiceFaceProviderForTests());

describe('DiceEvent', () => {
  it('keeps raw faces separate from modified total', () => {
    setDiceFaceProviderForTests(() => 7);
    const event = rollDiceEvent('damage', 'test', 8, 1, 3);
    expect(event).toMatchObject({ schemaVersion: 1, rolls: [7], total: 10, diceSides: 8 });
    expect(event.rollId).toBe(event.id);
  });

  it('records an omni die as a forced reroll', () => {
    const event = forcedDiceEvent(20, 3, { checkId: 'check-1', itemId: 'omni_dice' });
    expect(event).toMatchObject({ type: 'reroll', source: 'omni_dice', rolls: [20], total: 23 });
    expect(event.metadata?.forced).toBe(true);
  });

  it('normalizes legacy battle events without using total as a face', () => {
    const event = normalizeDiceEvent({ type: 'damage', dice: '1d8', diceResult: [6], rawDamage: 9 });
    expect(event.rolls).toEqual([6]);
    expect(event.total).toBe(9);
    expect(event.metadata?.legacy).toBe(true);
  });
});
