export type ItemEffect =
  | { type: 'heal'; formula: string }
  | { type: 'reroll'; rerollType: 'fiction_dice' | 'omni_dice' }
  | { type: 'reveal_clue'; clueId: string }
  | { type: 'unlock_scene'; sceneId: string }
  | { type: 'add_buff'; buffId: string; duration?: number }
  | { type: 'open_document'; documentId: string };

export interface ItemDefinition {
  catalogId: string;
  name: string;
  aliases?: string[];
  type: 'consumable' | 'equipment' | 'quest' | 'document' | 'clue' | 'material' | 'currency';
  description: string;
  icon?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'story';
  stackable: boolean;
  maxStack?: number;
  effects?: ItemEffect[];
  metadata?: Record<string, unknown>;
}

export interface ItemInstance {
  instanceId: string;
  catalogId: string;
  quantity: number;
  metadata?: Record<string, unknown>;
  acquiredAt?: string;
}
