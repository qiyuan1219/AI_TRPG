import { ITEM_CATALOG } from '../../../core/items/ItemCatalog';
import { NPC_PROFILES } from '../../../data/npc/npcProfiles';
import type { ContentPack } from '../../core/contentPack';

export const BASE_CONTENT_PACK: ContentPack = {
  packId: 'base',
  version: '1.0.0',
  title: '地心之门 Base Content',
  scenes: [],
  encounters: [],
  items: [...ITEM_CATALOG.values()],
  npcs: NPC_PROFILES,
  quests: [],
};
