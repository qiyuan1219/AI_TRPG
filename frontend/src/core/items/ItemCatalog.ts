import { shopItems } from '../../data/shopItems';
import type { ItemDefinition } from './ItemTypes';

const CORE_ITEMS: ItemDefinition[] = [
  { catalogId: 'fiction_dice', name: '虚构骰子', aliases: ['fiction-dice'], type: 'consumable', description: '剧情判定后重投一次 D20，取较高总值。', icon: 'fiction-dice', rarity: 'rare', stackable: true, effects: [{ type: 'reroll', rerollType: 'fiction_dice' }] },
  { catalogId: 'omni_dice', name: '万能骰子', aliases: ['omni-dice'], type: 'consumable', description: '剧情判定后指定一个 D20 点数。', icon: 'omni-dice', rarity: 'rare', stackable: true, effects: [{ type: 'reroll', rerollType: 'omni_dice' }] },
  { catalogId: 'healing_potion', name: '治疗药水', aliases: ['小红瓶', '回血'], type: 'consumable', description: '普通冒险者常备的红色药剂。', icon: 'potion-red', rarity: 'common', stackable: true, effects: [{ type: 'heal', formula: '1d8+2' }] },
  { catalogId: 'coagulation_powder', name: '止血粉', type: 'consumable', description: '用于处理流血与浅层创口。', icon: 'powder', rarity: 'common', stackable: true },
  { catalogId: 'antitoxin', name: '解毒剂', aliases: ['弱效解毒剂'], type: 'consumable', description: '缓解常见毒素与孢粉刺激。', icon: 'vial-green', rarity: 'common', stackable: true },
  { catalogId: 'purification_heart', name: '净化之心', type: 'consumable', description: '用于压制深层污染的高阶药剂。', icon: 'heart-vial', rarity: 'rare', stackable: false },
  { catalogId: 'longsword', name: '长剑', type: 'equipment', description: '可靠的近战武器。', icon: 'sword', rarity: 'common', stackable: false, metadata: { equipSlot: 'weapon' } },
  { catalogId: 'adventurer_kit', name: '冒险者工具包', type: 'quest', description: '基础野外工具。', icon: 'backpack', rarity: 'common', stackable: false },
  { catalogId: 'spore_mask', name: '抗孢面罩', type: 'quest', description: '深入孢海时过滤孢粉的制式面罩。', icon: 'spore-mask', rarity: 'uncommon', stackable: false },
  { catalogId: 'cold_lamp', name: '冷光灯', aliases: ['冷光棒'], type: 'quest', description: '不会引燃孢粉的冷光照明工具。', icon: 'cold_light_stick', rarity: 'common', stackable: true },
  { catalogId: 'elevator_safety_hook', name: '缆梯安全扣', type: 'quest', description: '降渊缆梯通行安全扣具。', icon: 'cable-clip', rarity: 'common', stackable: false },
  { catalogId: 'guild_supply_crate', name: '公会补给箱', type: 'quest', description: '公会签发的远征基础补给。', icon: 'supply-crate', rarity: 'story', stackable: false },
  { catalogId: 'diamond', name: '钻石', aliases: ['干净的钻石'], type: 'material', description: '贵重宝石。', icon: 'diamond', rarity: 'rare', stackable: true },
  { catalogId: 'guild_badge', name: '公会徽记', type: 'quest', description: '冒险者公会认证身份徽记。', icon: 'badge', rarity: 'story', stackable: false },
  { catalogId: 'gold', name: '金币', aliases: ['G', 'GP'], type: 'currency', description: '逆穹城通用货币。', icon: 'coin', rarity: 'common', stackable: true },
  { catalogId: 'third_expedition_report', name: '第三远征队失联报告', type: 'document', description: '记录第三远征队失联情况。', icon: 'scroll-sealed', rarity: 'story', stackable: false },
  { catalogId: 'missing_expedition_registry', name: '失踪远征队登记册', type: 'document', description: '公会登记的失踪远征队名单。', icon: 'scroll-list', rarity: 'story', stackable: false },
  { catalogId: 'third_patrol_record', name: '第三巡逻队记录', type: 'document', description: '第三巡逻队的行动记录。', icon: 'scroll-log', rarity: 'story', stackable: false },
  { catalogId: 'wounded_purification_report', name: '伤员净化报告', type: 'document', description: '伤员污染与净化记录。', icon: 'scroll-medicine', rarity: 'story', stackable: false },
  { catalogId: 'kaiya_code_note', name: '凯娅的暗号', aliases: ['黑市暗号纸条'], type: 'quest', description: '写有“断缆不问来路”的暗号纸条。', icon: 'note-pin', rarity: 'story', stackable: false },
  { catalogId: 'yunling_charm', name: '云苓的护身符', type: 'quest', description: '封着蓝色菌叶和白枝烛芯的护身符。', icon: 'yunling-charm', rarity: 'story', stackable: false },
];

const SHOP_CATALOG: ItemDefinition[] = shopItems.map((item) => ({
  catalogId: item.id,
  name: item.name,
  aliases: item.aliases,
  type: 'consumable',
  description: item.desc,
  icon: item.icon,
  rarity: item.type === 'rare' ? 'rare' : 'common',
  stackable: item.repeatable,
}));

export const ITEM_CATALOG = new Map(
  [...SHOP_CATALOG, ...CORE_ITEMS].map((item) => [item.catalogId, item] as const),
);

const ALIASES = new Map<string, string>();
ITEM_CATALOG.forEach((item) => {
  [item.catalogId, item.name, ...(item.aliases || [])].forEach((alias) => ALIASES.set(alias.trim().toLowerCase(), item.catalogId));
});

export function resolveCatalogId(value: string): string {
  return ALIASES.get(String(value || '').trim().toLowerCase()) || 'legacy_unknown';
}

export function getItemDefinition(value: string): ItemDefinition | undefined {
  const id = ITEM_CATALOG.has(value) ? value : resolveCatalogId(value);
  return ITEM_CATALOG.get(id);
}

export function getLegacyInventoryDefinition(name: string) {
  const item = getItemDefinition(name);
  if (!item) return undefined;
  const category = item.type === 'consumable' ? 'consumable'
    : item.type === 'equipment' ? 'equipment'
      : item.type === 'document' ? 'archive'
        : item.type === 'clue' ? 'clue' : 'key_item';
  return {
    id: item.catalogId,
    type: item.type === 'quest' || item.type === 'material' || item.type === 'currency' ? 'key_item' : item.type,
    category,
    icon: item.icon,
    rarity: item.rarity === 'story' ? 'quest' : item.rarity,
    summary: item.description,
    effectText: item.effects?.map((effect) => effect.type === 'heal' ? `恢复 ${effect.formula} 点生命值。` : '可用于剧情判定重投。').join(''),
    stackable: item.stackable,
    equipSlot: item.metadata?.equipSlot,
  };
}
