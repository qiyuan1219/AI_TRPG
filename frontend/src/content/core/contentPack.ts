import type { BattleConfig } from '../../components/BattleTestScreen';
import type { ItemDefinition } from '../../core/items/ItemTypes';
import type { NPCProfile } from '../../core/npc/NPCProfile';
import type { CompatibleGameState } from '../../core/state/gameState';

export interface SceneDefinition {
  id: string;
  title: string;
  metadata?: Record<string, unknown>;
}

export interface EncounterDefinition {
  id: string;
  title: string;
  battleConfig?: BattleConfig;
  metadata?: Record<string, unknown>;
}

export interface QuestDefinition {
  id: string;
  title: string;
  metadata?: Record<string, unknown>;
}

export interface ContentMigration {
  fromVersion: string;
  toVersion: string;
  migrateSave: (state: CompatibleGameState) => CompatibleGameState;
}

export interface ContentAssetManifest {
  images?: Record<string, string>;
  audio?: Record<string, string>;
}

export interface ContentPack {
  packId: string;
  version: string;
  title: string;
  description?: string;
  scenes: SceneDefinition[];
  encounters: EncounterDefinition[];
  items: ItemDefinition[];
  npcs: NPCProfile[];
  quests: QuestDefinition[];
  migrations?: ContentMigration[];
  assets?: ContentAssetManifest;
}
