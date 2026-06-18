import {
  DICE_EVENT_SCHEMA_VERSION,
  type DiceEvent,
  type DiceEventSource,
  type DiceEventType,
} from './DiceEvent';

export interface CreateDiceEventInput extends Omit<DiceEvent, 'schemaVersion' | 'rollId' | 'id' | 'createdAt'> {
  rollId?: string;
  createdAt?: string;
}

export function createDiceEvent(input: CreateDiceEventInput): DiceEvent {
  const rollId = input.rollId || crypto.randomUUID();
  return {
    ...input,
    schemaVersion: DICE_EVENT_SCHEMA_VERSION,
    rollId,
    id: rollId,
    createdAt: input.createdAt || new Date().toISOString(),
    rolls: input.rolls.map(Number),
    modifier: Number(input.modifier),
    total: Number(input.total),
  };
}

let seedIndex = 0;

function secureDie(sides: number): number {
  if (!Number.isInteger(sides) || sides < 2) throw new Error('骰子面数必须是大于 1 的整数');
  const max = 0x100000000;
  const limit = max - (max % sides);
  const values = new Uint32Array(1);
  do crypto.getRandomValues(values); while (values[0] >= limit);
  return (values[0] % sides) + 1;
}

let diceFaceProvider = secureDie;

/** Test-only seam; production code must not replace the secure provider. */
export function setDiceFaceProviderForTests(provider?: (sides: number) => number) {
  diceFaceProvider = provider || secureDie;
}

/**
 * 前端统一 DiceClient。业务代码不得再自行调用 Math.random。
 * 后端权威战斗仍由 BattleEngine/DiceService 生成结果。
 */
export function rollDiceEvent(
  type: DiceEventType,
  source: DiceEventSource,
  diceSides: number,
  count = 1,
  modifier = 0,
  extra: Partial<CreateDiceEventInput> = {},
): DiceEvent {
  const rolls = Array.from({ length: count }, () => diceFaceProvider(diceSides));
  const currentIndex = seedIndex++;
  return createDiceEvent({
    type,
    source,
    formula: `${count}d${diceSides}${modifier ? `${modifier > 0 ? '+' : ''}${modifier}` : ''}`,
    diceSides,
    rolls,
    modifier,
    total: rolls.reduce((sum, value) => sum + value, 0) + modifier,
    seedIndex: currentIndex,
    ...extra,
  });
}

export function forcedDiceEvent(
  face: number,
  modifier: number,
  extra: Partial<CreateDiceEventInput> = {},
): DiceEvent {
  return createDiceEvent({
    type: 'reroll',
    source: 'omni_dice',
    formula: `1d20${modifier ? `${modifier > 0 ? '+' : ''}${modifier}` : ''}`,
    diceSides: 20,
    rolls: [face],
    modifier,
    total: face + modifier,
    ...extra,
    metadata: { ...(extra.metadata || {}), forced: true, chosenFace: face },
  });
}
