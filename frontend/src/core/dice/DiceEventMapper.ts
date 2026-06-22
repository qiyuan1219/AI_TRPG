import { createDiceEvent } from './createDiceEvent';
import { DICE_EVENT_SCHEMA_VERSION, type DiceEvent, type DiceEventSource, type DiceEventType } from './DiceEvent';
import { randomUuid } from '../random/secureRandom';

const TYPES = new Set<DiceEventType>([
  'attack', 'damage', 'initiative', 'saving_throw', 'story_check', 'reroll',
  'healing', 'shop_lottery', 'drinking_game', 'dice_poker', 'test',
]);

export function normalizeDiceEvent(raw: unknown): DiceEvent {
  const value = raw && typeof raw === 'object' ? raw as Record<string, any> : {};
  const rolls = Array.isArray(value.rolls)
    ? value.rolls.map(Number)
    : Array.isArray(value.diceResult)
      ? value.diceResult.map(Number)
      : Number.isFinite(Number(value.rawRoll ?? value.d20))
        ? [Number(value.rawRoll ?? value.d20)]
        : [];
  const type = TYPES.has(value.type) ? value.type as DiceEventType : 'test';
  const source = String(value.source || 'legacy') as DiceEventSource;
  const formula = String(value.formula || value.dice || `1d${value.diceSides || 20}`);
  const diceSides = Number(value.diceSides || formula.match(/d(\d+)/i)?.[1] || 20);
  const modifier = Number(value.modifier ?? value.fixed ?? 0);
  const total = Number(value.total ?? value.rawDamage ?? rolls.reduce((sum, item) => sum + item, 0) + modifier);
  const rollId = String(value.rollId || value.id || randomUuid());

  return createDiceEvent({
    ...value,
    rollId,
    type,
    source,
    formula,
    diceSides,
    rolls,
    modifier,
    total,
    createdAt: value.createdAt,
    metadata: {
      ...(value.metadata || {}),
      ...(value.schemaVersion === DICE_EVENT_SCHEMA_VERSION ? {} : { legacy: true, legacyRaw: value }),
    },
  });
}
