export const GAME_STATE_SCHEMA_VERSION = 2 as const;
export type CanonicalCompanionId = 'serin' | 'ailin' | 'brock' | 'kaiya';

export type GamePhase = 'story' | 'pre_battle' | 'battle' | 'resolution' | 'shop' | 'dialogue';

export interface CanonicalSessionState {
  id: string;
  phase: GamePhase;
  turn: number;
  updatedAt: number;
}

export interface CanonicalStoryState {
  chapter: string;
  sceneId: string;
  areaId: string;
  summary: string;
  sceneSummary?: import('../context/SceneSummary').SceneSummary;
  visitedSceneIds: string[];
}

export interface CanonicalPlayerState {
  id: string;
  name: string;
  level: number;
  gold: number;
  hp: number;
  maxHp: number;
  styleId?: string;
  styleName?: string;
  ac?: number;
  attributes?: Record<string, number> | { str: number; dex: number; con: number; int: number; wis: number; cha: number };
  equipment?: Partial<Record<'weapon' | 'shield' | 'armor' | 'accessory', string | null>>;
}

export interface CanonicalPartyState {
  members: Array<Record<string, unknown>>;
  trust: Partial<Record<CanonicalCompanionId, number>>;
}

export interface InventoryItemState {
  instanceId: string;
  catalogId: string;
  name: string;
  quantity: number;
  metadata?: Record<string, unknown>;
}

export interface CanonicalInventoryState {
  items: InventoryItemState[];
  equipment: Partial<Record<'weapon' | 'shield' | 'armor' | 'accessory', string | null>>;
}

export interface CanonicalLogState {
  game: Array<Record<string, unknown>>;
  actions: Array<Record<string, unknown>>;
  events: Array<Record<string, unknown>>;
  dice: Array<Record<string, unknown>>;
}

export interface PersistedBattleState {
  battleId: string;
  encounterId?: string | null;
  phase: string;
  round: number;
  turnIndex: number;
  characters: unknown[];
  initiative: unknown[];
  actionLog: Array<Record<string, unknown>>;
  eventLog: Array<Record<string, unknown>>;
  diceLog: Array<Record<string, unknown>>;
  rngSeed: number;
  rngCursor: number;
}

export interface CanonicalGameState {
  schemaVersion: typeof GAME_STATE_SCHEMA_VERSION;
  session: CanonicalSessionState;
  story: CanonicalStoryState;
  player: CanonicalPlayerState;
  party: CanonicalPartyState;
  battle: PersistedBattleState | null;
  inventoryState: CanonicalInventoryState;
  quests: { active: Record<string, unknown>; completed: string[] };
  flags: Record<string, unknown>;
  logs: CanonicalLogState;
}

/** Temporary compatibility surface. New code must read the canonical fields. */
export interface LegacyGameState {
  [key: string]: any;
}

export type CompatibleGameState = LegacyGameState & Partial<CanonicalGameState>;
