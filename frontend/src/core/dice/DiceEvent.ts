export const DICE_EVENT_SCHEMA_VERSION = 1 as const;

export type DiceEventType =
  | 'attack'
  | 'damage'
  | 'initiative'
  | 'saving_throw'
  | 'story_check'
  | 'reroll'
  | 'healing'
  | 'shop_lottery'
  | 'drinking_game'
  | 'dice_poker'
  | 'test';

export type DiceEventSource =
  | 'battle_engine'
  | 'story_check'
  | 'fiction_dice'
  | 'omni_dice'
  | 'shop'
  | 'minigame'
  | 'test'
  | 'legacy';

export type DiceOutcome = 'critical_success' | 'success' | 'fail' | 'critical_fail';

export interface DiceEvent {
  schemaVersion: typeof DICE_EVENT_SCHEMA_VERSION;
  rollId: string;
  /** @deprecated Use rollId. Kept while older battle UI migrates. */
  id: string;
  type: DiceEventType;
  source: DiceEventSource;
  formula: string;
  diceSides: number;
  rolls: number[];
  modifier: number;
  total: number;
  seed?: string;
  seedIndex?: number;
  createdAt: string;
  actorId?: string;
  actorName?: string;
  targetId?: string;
  targetName?: string;
  skillId?: string;
  skillName?: string;
  checkId?: string;
  itemId?: string;
  dc?: number;
  ac?: number;
  success?: boolean;
  outcome?: DiceOutcome;
  metadata?: Record<string, unknown>;
}
