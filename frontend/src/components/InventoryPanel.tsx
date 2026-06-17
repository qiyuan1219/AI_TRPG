import { useMemo, useState } from 'react';
import { getIntelById, type IntelDocument } from '../data/intelDocuments';
import { getItemSummaryByName, resolveItemIconPath } from '../data/itemIconPaths';
import type { ArchiveDocument, GameState, InvestigationClue } from '../types/game';

type InventoryTab = 'all' | 'consumable' | 'equipment' | 'key_item' | 'archive' | 'clue';
type InventoryItemType = 'consumable' | 'equipment' | 'key_item' | 'document' | 'clue';

interface InventoryPanelProps {
  state: GameState;
  onStatePatch?: (patch: Partial<GameState>, message?: string) => void;
}

interface InventoryEntry {
  id: string;
  name: string;
  type: InventoryItemType;
  category: Exclude<InventoryTab, 'all'>;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'key' | 'quest';
  quantity: number;
  summary: string;
  description?: string;
  source?: string;
  effectText?: string;
  stackable?: boolean;
  equipSlot?: 'weapon' | 'shield' | 'armor' | 'accessory';
  useCondition?: { sceneIncludes?: string[] };
  sections?: Array<{ heading: string; body: string }>;
  relatedDocuments?: string[];
}

const TABS: Array<{ id: InventoryTab; label: string }> = [
  { id: 'all', label: '全部' },
  { id: 'consumable', label: '消耗品' },
  { id: 'equipment', label: '装备' },
  { id: 'key_item', label: '关键物品' },
  { id: 'archive', label: '档案' },
  { id: 'clue', label: '线索' },
];

const ITEM_DEFINITIONS: Record<string, Partial<InventoryEntry>> = {
  治疗药水: {
    id: 'healing_potion',
    type: 'consumable',
    category: 'consumable',
    icon: 'potion-red',
    rarity: 'common',
    effectText: '恢复 1d8 + 2 点生命值。',
    summary: '普通冒险者常备的红色药剂。',
    stackable: true,
  },
  止血粉: {
    id: 'coagulation_powder',
    type: 'consumable',
    category: 'consumable',
    icon: 'powder',
    rarity: 'common',
    effectText: '用于处理流血、撕裂与浅层创口。',
    summary: '一小包带有草药气味的止血粉。',
    stackable: true,
  },
  解毒剂: {
    id: 'antitoxin',
    type: 'consumable',
    category: 'consumable',
    icon: 'vial-green',
    rarity: 'common',
    effectText: '缓解常见毒素与孢粉刺激。',
    summary: '黑市药铺和公会补给箱中常见的解毒药剂。',
    stackable: true,
  },
  净化之心: {
    id: 'purification_heart',
    type: 'consumable',
    category: 'consumable',
    icon: 'heart-vial',
    rarity: 'rare',
    effectText: '可用于压制深层污染，关键节点可能触发额外选择。',
    summary: '云苓调配的高阶净化药剂。',
    stackable: false,
  },
  长剑: {
    id: 'longsword',
    type: 'equipment',
    category: 'equipment',
    icon: 'sword',
    rarity: 'common',
    equipSlot: 'weapon',
    summary: '可靠的近战武器。',
  },
  冒险者工具包: {
    id: 'adventurer_kit',
    type: 'key_item',
    category: 'key_item',
    icon: 'kit',
    rarity: 'common',
    summary: '绳索、火绒、粉笔、铁钉和基础野外工具。',
  },
  抗孢面罩: {
    id: 'spore_mask',
    type: 'key_item',
    category: 'key_item',
    icon: 'mask',
    rarity: 'uncommon',
    summary: '深入孢海时用于过滤孢粉的制式面罩。',
  },
  冷光灯: {
    id: 'cold_lamp',
    type: 'key_item',
    category: 'key_item',
    icon: 'lamp',
    rarity: 'common',
    summary: '不会引燃孢粉的冷光照明工具。',
  },
  缆梯安全扣: {
    id: 'elevator_safety_hook',
    type: 'key_item',
    category: 'key_item',
    icon: 'hook',
    rarity: 'common',
    summary: '降渊缆梯通行时使用的安全扣具。',
    useCondition: { sceneIncludes: ['缆梯', '降渊'] },
  },
  公会补给箱: {
    id: 'guild_supply_crate',
    type: 'key_item',
    category: 'key_item',
    icon: 'crate',
    rarity: 'quest',
    summary: '公会签发的基础补给，包含远征所需的消耗品。',
  },
  钻石: {
    id: 'diamond',
    type: 'key_item',
    category: 'key_item',
    icon: 'gem',
    rarity: 'rare',
    summary: '可作为交易、施法或黑市议价筹码的贵重宝石。',
  },
  公会徽记: {
    id: 'guild_badge',
    type: 'key_item',
    category: 'key_item',
    icon: 'badge',
    rarity: 'quest',
    summary: '冒险者公会认证身份的徽记。',
    useCondition: { sceneIncludes: ['公会'] },
  },
};

function stableIdFromName(name: string) {
  return `item_${name.trim().replace(/\s+/g, '_')}`;
}

function parseInventoryText(inventoryText: string): Array<{ name: string; quantity: number }> {
  const counts = new Map<string, number>();
  inventoryText
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((raw) => {
      const match = raw.match(/^(.+?)(?:x|×)(\d+)$/i);
      const name = (match ? match[1] : raw).trim();
      const quantity = match ? Math.max(1, Number(match[2]) || 1) : 1;
      counts.set(name, (counts.get(name) ?? 0) + quantity);
    });
  return Array.from(counts, ([name, quantity]) => ({ name, quantity }));
}

function formatInventoryText(entries: Array<{ name: string; quantity: number }>) {
  return entries
    .filter((entry) => entry.quantity > 0)
    .map((entry) => (entry.quantity > 1 ? `${entry.name}x${entry.quantity}` : entry.name))
    .join(',');
}

function changeInventoryQuantity(inventoryText: string, targetName: string, delta: number) {
  const entries = parseInventoryText(inventoryText);
  const found = entries.find((entry) => entry.name === targetName);
  if (!found) return inventoryText;
  found.quantity = Math.max(0, found.quantity + delta);
  return formatInventoryText(entries);
}

function normalizeInventoryItems(inventoryText: string): InventoryEntry[] {
  return parseInventoryText(inventoryText).map(({ name, quantity }) => {
    const definition = ITEM_DEFINITIONS[name] || {};
    return {
      id: definition.id || stableIdFromName(name),
      name,
      type: definition.type || 'key_item',
      category: definition.category || 'key_item',
      icon: definition.icon || 'default',
      rarity: definition.rarity || 'common',
      quantity,
      summary: definition.summary || getItemSummaryByName(name),
      description: definition.description,
      effectText: definition.effectText,
      stackable: definition.stackable,
      equipSlot: definition.equipSlot,
      useCondition: definition.useCondition,
    };
  });
}

function documentToEntry(raw: ArchiveDocument | string): InventoryEntry | null {
  const id = typeof raw === 'string' ? raw : raw.id;
  if (!id) return null;
  const intel = getIntelById(id);
  if (intel) return intelToEntry(intel);
  if (typeof raw === 'string') {
    return {
      id,
      name: id,
      type: 'document',
      category: 'archive',
      icon: 'document',
      rarity: 'common',
      quantity: 1,
      summary: '',
    };
  }
  return {
    id: raw.id,
    name: raw.name,
    type: 'document',
    category: 'archive',
    icon: raw.icon || 'document',
    rarity: rarityFromDocument(raw),
    quantity: 1,
    summary: raw.summary || '',
    source: raw.source,
    sections: raw.content?.sections || [],
    relatedDocuments: raw.relatedDocuments,
  };
}

function intelToEntry(doc: IntelDocument): InventoryEntry {
  return {
    id: doc.id,
    name: doc.name,
    type: 'document',
    category: 'archive',
    icon: doc.icon,
    rarity: doc.rarity,
    quantity: 1,
    summary: doc.summary,
    source: doc.source,
    sections: doc.sections,
    relatedDocuments: doc.relatedDocuments,
  };
}

function rarityFromDocument(document: ArchiveDocument): InventoryEntry['rarity'] {
  const rarity = String((document as any).rarity || '').trim();
  if (rarity === 'key' || rarity === 'rare' || rarity === 'uncommon' || rarity === 'quest') return rarity;
  return 'common';
}

function clueToEntry(raw: InvestigationClue | string): InventoryEntry | null {
  if (typeof raw === 'string') {
    return {
      id: raw,
      name: raw,
      type: 'clue',
      category: 'clue',
      icon: 'clue',
      rarity: 'uncommon',
      quantity: 1,
      summary: '',
    };
  }
  if (!raw?.id || !raw?.name) return null;
  return {
    id: raw.id,
    name: raw.name,
    type: 'clue',
    category: 'clue',
    icon: (raw as any).icon || 'clue',
    rarity: 'uncommon',
    quantity: 1,
    summary: raw.description || '',
    source: raw.source,
    description: raw.description,
    relatedDocuments: raw.relatedDocuments || (raw.source && getIntelById(raw.source) ? [raw.source] : []),
  };
}

function isUsableInCurrentScene(item: InventoryEntry, state: GameState) {
  if (!item.useCondition?.sceneIncludes?.length) return false;
  const area = String(state.current_area || state.sceneState?.currentScene || '');
  return item.useCondition.sceneIncludes.some((keyword) => area.includes(keyword));
}

function isEquipped(item: InventoryEntry, state: GameState) {
  const equipment = (state.equipment || state.player?.equipment || {}) as Record<string, string | null>;
  return Object.values(equipment).includes(item.id) || Object.values(equipment).includes(item.name);
}

function categoryLabel(item: InventoryEntry) {
  if (item.type === 'document') return '档案';
  if (item.type === 'clue') return '线索';
  if (item.type === 'consumable') return '消耗品';
  if (item.type === 'equipment') return '装备';
  return '关键物品';
}

function rarityLabel(rarity: InventoryEntry['rarity']) {
  return {
    common: '普通',
    uncommon: '少见',
    rare: '稀有',
    key: '关键',
    quest: '任务',
  }[rarity];
}

export function InventoryPanel({ state, onStatePatch }: InventoryPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<InventoryTab>('all');
  const [selectedId, setSelectedId] = useState('');
  const [readingId, setReadingId] = useState('');
  const [viewedIds, setViewedIds] = useState<Set<string>>(() => new Set());

  const items = useMemo(() => {
    const inventoryItems = normalizeInventoryItems(String(state.inventory || ''));
    const documentItems = Array.isArray(state.documents)
      ? state.documents.map(documentToEntry).filter((item): item is InventoryEntry => Boolean(item))
      : [];
    const clueItems = Array.isArray(state.clues)
      ? state.clues.map(clueToEntry).filter((item): item is InventoryEntry => Boolean(item))
      : [];
    const seen = new Set<string>();
    return [...inventoryItems, ...documentItems, ...clueItems].filter((item) => {
      const key = `${item.category}:${item.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [state.inventory, state.documents, state.clues]);

  const filteredItems = items.filter((item) => activeTab === 'all' || item.category === activeTab);
  const selectedItem = items.find((item) => item.id === selectedId) || null;
  const readingDocument = readingId ? getIntelById(readingId) || selectedItem : null;
  const newItemIds = new Set(
    items
      .filter((item) => item.type === 'document' || item.type === 'clue')
      .filter((item) => !viewedIds.has(item.id))
      .map((item) => item.id),
  );

  function openItem(item: InventoryEntry) {
    setSelectedId(item.id);
    setViewedIds((current) => new Set(current).add(item.id));
  }

  function closeAll() {
    setIsOpen(false);
    setSelectedId('');
    setReadingId('');
  }

  function useConsumable(item: InventoryEntry) {
    if (!onStatePatch) return;
    const nextInventory = changeInventoryQuantity(String(state.inventory || ''), item.name, -1);
    const patch: Partial<GameState> = { inventory: nextInventory };
    if (item.id === 'healing_potion') {
      const maxHp = Number(state.max_hp || 30);
      const currentHp = Number(state.current_hp || maxHp);
      patch.current_hp = Math.min(maxHp, currentHp + 7);
    }
    onStatePatch(patch, `使用 ${item.name}`);
  }

  function toggleEquip(item: InventoryEntry) {
    if (!item.equipSlot || !onStatePatch) return;
    const equipment = { ...((state.equipment || state.player?.equipment || {}) as Record<string, string | null>) };
    const equipped = isEquipped(item, state);
    equipment[item.equipSlot] = equipped ? null : item.id;
    onStatePatch({ equipment }, equipped ? `卸下 ${item.name}` : `装备 ${item.name}`);
  }

  function openRelatedDocument(item: InventoryEntry) {
    const relatedId = item.relatedDocuments?.find((id) => getIntelById(id)) || item.relatedDocuments?.[0];
    if (relatedId) setReadingId(relatedId);
  }

  return (
    <div className="inventory-panel-entry">
      <button type="button" className="inventory-open-button" onClick={() => setIsOpen(true)}>
        背包
      </button>

      {isOpen && (
        <div className="inventory-modal-backdrop" role="presentation" onClick={closeAll}>
          <section className="inventory-modal" role="dialog" aria-modal="true" aria-label="背包" onClick={(e) => e.stopPropagation()}>
            <header className="inventory-modal-header">
              <div>
                <span>背包</span>
                <small>{state.player_name || '冒险者'}</small>
              </div>
              <button type="button" aria-label="关闭背包" onClick={closeAll}>×</button>
            </header>

            <div className="inventory-tabs" role="tablist" aria-label="背包分类">
              {TABS.map((tab) => {
                const count = tab.id === 'all' ? items.length : items.filter((item) => item.category === tab.id).length;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={activeTab === tab.id ? 'is-active' : ''}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                    <small>{count}</small>
                  </button>
                );
              })}
            </div>

            <div className="inventory-grid">
              {filteredItems.map((item) => (
                <InventorySlot
                  key={`${item.category}-${item.id}`}
                  item={item}
                  isNew={newItemIds.has(item.id)}
                  onClick={() => openItem(item)}
                />
              ))}
              {!filteredItems.length && <p className="inventory-empty">暂无内容</p>}
            </div>
          </section>
        </div>
      )}

      {isOpen && selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          state={state}
          canPatch={Boolean(onStatePatch)}
          onClose={() => setSelectedId('')}
          onRead={() => setReadingId(selectedItem.id)}
          onUse={() => useConsumable(selectedItem)}
          onToggleEquip={() => toggleEquip(selectedItem)}
          onUseInScene={() => onStatePatch?.({ last_event: `使用${selectedItem.name}` }, `当前场景使用 ${selectedItem.name}`)}
          onOpenRelated={() => openRelatedDocument(selectedItem)}
        />
      )}

      {isOpen && readingDocument && (
        <DocumentReaderModal
          document={readingDocument}
          fallbackItem={selectedItem}
          onBack={() => setReadingId('')}
          onClose={() => {
            setReadingId('');
            setSelectedId('');
          }}
        />
      )}
    </div>
  );
}

function InventorySlot({ item, isNew, onClick }: { item: InventoryEntry; isNew: boolean; onClick: () => void }) {
  const iconPath = resolveItemIconPath(item.icon, item.name);
  return (
    <button type="button" className={`inventory-slot rarity-${item.rarity}`} onClick={onClick}>
      {isNew && <em>NEW</em>}
      <i aria-hidden="true">
        <img src={iconPath} alt="" onError={(event) => { event.currentTarget.src = resolveItemIconPath('default'); }} />
      </i>
      {item.quantity > 1 && <b>x{item.quantity}</b>}
      <span>{item.name}</span>
    </button>
  );
}

function ItemDetailModal({
  item,
  state,
  canPatch,
  onClose,
  onRead,
  onUse,
  onToggleEquip,
  onUseInScene,
  onOpenRelated,
}: {
  item: InventoryEntry;
  state: GameState;
  canPatch: boolean;
  onClose: () => void;
  onRead: () => void;
  onUse: () => void;
  onToggleEquip: () => void;
  onUseInScene: () => void;
  onOpenRelated: () => void;
}) {
  const usable = isUsableInCurrentScene(item, state);
  const equipped = isEquipped(item, state);
  const iconPath = resolveItemIconPath(item.icon, item.name);
  return (
    <div className="item-modal-backdrop" role="presentation" onClick={onClose}>
      <section className="item-modal" role="dialog" aria-modal="true" aria-label={item.name} onClick={(e) => e.stopPropagation()}>
        <header>
          <div>
            <span>{item.name}</span>
            <small>{categoryLabel(item)} · {rarityLabel(item.rarity)}</small>
          </div>
          <button type="button" aria-label="关闭物品详情" onClick={onClose}>×</button>
        </header>
        <div className={`item-modal-icon rarity-${item.rarity}`}>
          <i aria-hidden="true">
            <img src={iconPath} alt="" onError={(event) => { event.currentTarget.src = resolveItemIconPath('default'); }} />
          </i>
        </div>
        <dl>
          <div>
            <dt>类型</dt>
            <dd>{categoryLabel(item)}</dd>
          </div>
          {item.source && (
            <div>
              <dt>来源</dt>
              <dd>{item.source}</dd>
            </div>
          )}
          <div>
            <dt>稀有度</dt>
            <dd>{rarityLabel(item.rarity)}</dd>
          </div>
          {item.quantity > 1 && (
            <div>
              <dt>数量</dt>
              <dd>x{item.quantity}</dd>
            </div>
          )}
        </dl>
        <p>{item.description || item.summary}</p>
        {item.effectText && <strong>{item.effectText}</strong>}
        <footer>
          {item.type === 'consumable' && (
            <>
              <button type="button" onClick={onUse} disabled={!canPatch}>使用</button>
              <button type="button" disabled>丢弃</button>
            </>
          )}
          {item.type === 'equipment' && (
            <>
              <button type="button" onClick={onToggleEquip} disabled={!canPatch || !item.equipSlot}>{equipped ? '卸下' : '装备'}</button>
              <button type="button">查看</button>
            </>
          )}
          {item.type === 'key_item' && (
            <button type="button" onClick={onUseInScene} disabled={!canPatch || !usable}>
              {usable ? '当前场景使用' : '当前场景无法使用'}
            </button>
          )}
          {item.type === 'document' && <button type="button" onClick={onRead}>查看全文</button>}
          {item.type === 'clue' && (
            <button type="button" onClick={onOpenRelated} disabled={!item.relatedDocuments?.length}>查看关联档案</button>
          )}
          <button type="button" onClick={onClose}>关闭</button>
        </footer>
      </section>
    </div>
  );
}

function DocumentReaderModal({
  document,
  fallbackItem,
  onBack,
  onClose,
}: {
  document: IntelDocument | InventoryEntry;
  fallbackItem: InventoryEntry | null;
  onBack: () => void;
  onClose: () => void;
}) {
  const title = 'name' in document ? document.name : fallbackItem?.name || '档案';
  const sections = 'sections' in document && Array.isArray(document.sections)
    ? document.sections
    : fallbackItem?.sections || [];
  return (
    <div className="document-reader-backdrop" role="presentation" onClick={onClose}>
      <section className="document-reader-modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <header>
          <div>
            <span>{title}</span>
            {'source' in document && document.source && <small>{document.source}</small>}
          </div>
          <button type="button" aria-label="关闭档案阅读" onClick={onClose}>×</button>
        </header>
        <div className="document-reader-body">
          {sections.map((section) => (
            <section key={`${title}-${section.heading}`}>
              <h3>{section.heading}</h3>
              <p>{section.body}</p>
            </section>
          ))}
          {!sections.length && <p>这份档案暂时没有可阅读正文。</p>}
        </div>
        <footer>
          <button type="button" onClick={onBack}>返回</button>
          <button type="button" onClick={onClose}>关闭</button>
        </footer>
      </section>
    </div>
  );
}

export default InventoryPanel;
