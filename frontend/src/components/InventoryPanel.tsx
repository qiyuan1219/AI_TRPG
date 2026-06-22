import { useMemo, useState } from 'react';
import { DiceRollOverlay, type DieType } from './DiceRollOverlay';
import { getIntelById, type IntelDocument } from '../data/intelDocuments';
import { getItemSummaryByName, resolveItemIconPath } from '../data/itemIconPaths';
import type { ArchiveDocument, GameState, InvestigationClue } from '../types/game';
import { getLegacyInventoryDefinition } from '../core/items/ItemCatalog';
import { rollDiceEvent } from '../core/dice/createDiceEvent';
import {
  buildHealingConsumablePatch,
  getHealingConsumable,
  getHealingTargets,
  type HealingConsumableDefinition,
  type HealingTargetId,
} from '../features/inventory/healingConsumables';
import type { DiceResult } from '../types/game';
import { getRerollItemQuantity } from '../utils/battlePrep';

type InventoryTab = 'all' | 'consumable' | 'equipment' | 'key_item' | 'archive' | 'clue';
type InventoryItemType = 'consumable' | 'equipment' | 'key_item' | 'document' | 'clue';
type StatPotionKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

const STAT_POTION_EFFECTS: Record<string, { stat: StatPotionKey; label: string }> = {
  strength_potion: { stat: 'str', label: '力量' },
  dexterity_potion: { stat: 'dex', label: '敏捷' },
  constitution_potion: { stat: 'con', label: '体质' },
  intelligence_potion: { stat: 'int', label: '智力' },
  wisdom_potion: { stat: 'wis', label: '感知' },
  charisma_potion: { stat: 'cha', label: '魅力' },
};

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

function getStatPotionEffect(item: InventoryEntry) {
  return STAT_POTION_EFFECTS[item.id] || null;
}

function isPurificationHeartItem(item: InventoryEntry) {
  return item.id === 'purification_heart' || item.name === '净化之心';
}

function normalizeInventoryItems(inventoryText: string): InventoryEntry[] {
  return parseInventoryText(inventoryText).map(({ name, quantity }) => {
    const definition = (getLegacyInventoryDefinition(name) || {}) as Partial<InventoryEntry>;
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
  if (item.name === '长剑') return true;
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
  const [healingItem, setHealingItem] = useState<HealingConsumableDefinition | null>(null);
  const [healingTargetId, setHealingTargetId] = useState<HealingTargetId>('player');
  const [healingDice, setHealingDice] = useState<DiceResult | null>(null);
  const [pendingHealingRoll, setPendingHealingRoll] = useState<number | null>(null);
  const [initialHealingRoll, setInitialHealingRoll] = useState<number | null>(null);
  const [healingReroll, setHealingReroll] = useState<number | null>(null);
  const [healingRerollItem, setHealingRerollItem] = useState<'虚构骰子' | '万能骰子' | null>(null);

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
  const healingTargets = useMemo(() => getHealingTargets(state), [state]);
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
    setHealingItem(null);
    setHealingDice(null);
    setPendingHealingRoll(null);
    setInitialHealingRoll(null);
    setHealingReroll(null);
    setHealingRerollItem(null);
  }

  function useConsumable(item: InventoryEntry) {
    if (!onStatePatch) return;
    const healing = getHealingConsumable(item.id, item.name);
    if (healing) {
      const firstInjured = healingTargets.find((target) => target.currentHp < target.maxHp);
      setHealingTargetId(firstInjured?.id || 'player');
      setHealingItem(healing);
      return;
    }
    const statPotion = getStatPotionEffect(item);
    if (statPotion) {
      const nextInventory = changeInventoryQuantity(String(state.inventory || ''), item.name, -1);
      const currentAttributes = {
        ...((state.player?.attributes || {}) as Record<StatPotionKey, number>),
      };
      const nextValue = Number(currentAttributes[statPotion.stat] ?? state[statPotion.stat] ?? 10) + 2;
      onStatePatch(
        {
          inventory: nextInventory,
          player: {
            ...(state.player || {}),
            attributes: {
              ...currentAttributes,
              [statPotion.stat]: nextValue,
            },
          } as NonNullable<GameState['player']>,
          // 兼容旧存档与仍读取顶层六维字段的逻辑；权威 UI 读取 player.attributes。
          [statPotion.stat]: nextValue,
          [`${item.id}_used`]: true,
          last_event: `${item.name}生效：${statPotion.label}+2`,
        },
        `${item.name}生效：${statPotion.label}+2`,
      );
      setSelectedId('');
      return;
    }
    if (isPurificationHeartItem(item)) return;
    const nextInventory = changeInventoryQuantity(String(state.inventory || ''), item.name, -1);
    const patch: Partial<GameState> = { inventory: nextInventory };
    onStatePatch(patch, `使用 ${item.name}`);
  }

  function rollHealing() {
    if (!healingItem || !onStatePatch) return;
    const target = healingTargets.find((entry) => entry.id === healingTargetId);
    if (!target || target.currentHp >= target.maxHp) return;
    const event = rollDiceEvent('healing', 'legacy', healingItem.dieSides, 1, 0, {
      actorId: 'inventory',
      actorName: state.player_name || '冒险者',
      targetId: target.id,
      targetName: target.name,
      itemId: healingItem.itemId,
      skillName: healingItem.itemName,
    });
    setPendingHealingRoll(event.total);
    setInitialHealingRoll(event.total);
    setHealingReroll(null);
    setHealingRerollItem(null);
    setHealingDice({ type: 'dice_test', data: { 骰子: `D${healingItem.dieSides}`, 结果: event.total, 总计: event.total, 属性: healingItem.itemName }, event });
  }

  function rerollHealing(kind: 'fiction-dice' | 'omni-dice', chosen?: number) {
    if (!healingItem || initialHealingRoll == null || healingRerollItem) return;
    if (getRerollItemQuantity(state, kind) <= 0) return;
    const itemName = kind === 'fiction-dice' ? '虚构骰子' : '万能骰子';
    const reroll = kind === 'fiction-dice'
      ? rollDiceEvent('reroll', 'fiction_dice', healingItem.dieSides, 1, 0, { itemId: healingItem.itemId }).total
      : Math.max(1, Math.min(healingItem.dieSides, Math.floor(chosen ?? healingItem.dieSides)));
    const selected = kind === 'fiction-dice' ? Math.max(initialHealingRoll, reroll) : reroll;
    const event = rollDiceEvent('healing', kind === 'fiction-dice' ? 'fiction_dice' : 'omni_dice', healingItem.dieSides, 1, selected - reroll, {
      actorId: 'inventory', targetId: healingTargetId, itemId: healingItem.itemId, metadata: { reroll },
    });
    event.rolls = [reroll];
    event.total = selected;
    setHealingReroll(reroll);
    setHealingRerollItem(itemName);
    setPendingHealingRoll(selected);
    setHealingDice({ type: 'dice_test', data: { 骰子: `D${healingItem.dieSides}`, 结果: selected, 总计: selected, 属性: healingItem.itemName }, event });
  }

  function finishHealing() {
    if (!healingItem || pendingHealingRoll == null || !onStatePatch) return;
    const outcome = buildHealingConsumablePatch(state, healingItem, healingTargetId, pendingHealingRoll);
    if (healingRerollItem) {
      outcome.patch.inventory = changeInventoryQuantity(String(outcome.patch.inventory || ''), healingRerollItem, -1);
      outcome.patch.last_event = `${outcome.patch.last_event}；消耗${healingRerollItem}`;
    }
    onStatePatch(outcome.patch, outcome.patch.last_event);
    setHealingDice(null);
    setPendingHealingRoll(null);
    setHealingItem(null);
    setSelectedId('');
    setInitialHealingRoll(null);
    setHealingReroll(null);
    setHealingRerollItem(null);
  }

  function toggleEquip(item: InventoryEntry) {
    if (!item.equipSlot || !onStatePatch) return;
    const equipment = { ...((state.equipment || state.player?.equipment || {}) as Record<string, string | null>) };
    const equipped = isEquipped(item, state);
    if (item.name === '长剑') return;
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

      {isOpen && healingItem && !healingDice && (
        <HealingTargetModal
          item={healingItem}
          targets={healingTargets}
          selectedId={healingTargetId}
          onSelect={setHealingTargetId}
          onCancel={() => setHealingItem(null)}
          onConfirm={rollHealing}
        />
      )}

      <DiceRollOverlay
        dice={healingDice}
        dieType={(healingItem?.dieSides === 6 ? 'd6' : 'd12') as DieType}
        diceKind="治疗掷骰"
        charSkill={healingItem?.itemName}
        onClose={finishHealing}
        rerollDecision={healingDice && healingItem ? {
          fictionQuantity: getRerollItemQuantity(state, 'fiction-dice'),
          omniQuantity: getRerollItemQuantity(state, 'omni-dice'),
          rerollUsed: Boolean(healingRerollItem),
          omniMax: healingItem.dieSides,
          onConfirm: finishHealing,
          onUseFiction: () => rerollHealing('fiction-dice'),
          onUseOmni: (value) => rerollHealing('omni-dice', value),
        } : undefined}
        comparisonRolls={initialHealingRoll != null && healingReroll != null ? {
          initial: initialHealingRoll,
          reroll: healingReroll,
          selected: pendingHealingRoll === initialHealingRoll ? 'initial' : 'reroll',
        } : undefined}
      />
    </div>
  );
}

function HealingTargetModal({
  item,
  targets,
  selectedId,
  onSelect,
  onCancel,
  onConfirm,
}: {
  item: HealingConsumableDefinition;
  targets: ReturnType<typeof getHealingTargets>;
  selectedId: HealingTargetId;
  onSelect: (id: HealingTargetId) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const selected = targets.find((target) => target.id === selectedId);
  return (
    <div className="healing-target-backdrop" role="presentation" onClick={onCancel}>
      <section className="healing-target-modal" role="dialog" aria-modal="true" aria-label="选择治疗目标" onClick={(event) => event.stopPropagation()}>
        <header>
          <div><span>选择治疗目标</span><small>{item.itemName} · D{item.dieSides} 恢复</small></div>
          <button type="button" aria-label="关闭" onClick={onCancel}>×</button>
        </header>
        <div className="healing-target-grid">
          {targets.map((target) => {
            const full = target.currentHp >= target.maxHp;
            return (
              <button
                key={target.id}
                type="button"
                className={selectedId === target.id ? 'is-selected' : ''}
                disabled={full}
                onClick={() => onSelect(target.id)}
              >
                <img src={target.avatar} alt="" />
                <span>{target.name}</span>
                <small>HP {target.currentHp}/{target.maxHp}{full ? ' · 已满' : ''}</small>
              </button>
            );
          })}
        </div>
        <footer>
          <button type="button" onClick={onCancel}>取消</button>
          <button type="button" onClick={onConfirm} disabled={!selected || selected.currentHp >= selected.maxHp}>使用并投 D{item.dieSides}</button>
        </footer>
      </section>
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
  const lockedEquippedWeapon = item.name === '长剑' && equipped;
  const consumableCanBeUsed = item.type === 'consumable' && !isPurificationHeartItem(item);
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
          {consumableCanBeUsed && (
            <>
              <button type="button" onClick={onUse} disabled={!canPatch}>使用</button>
              <button type="button" disabled>丢弃</button>
            </>
          )}
          {item.type === 'equipment' && (
            <>
              <button type="button" onClick={onToggleEquip} disabled={!canPatch || !item.equipSlot || lockedEquippedWeapon}>{lockedEquippedWeapon ? '已装备' : equipped ? '卸下' : '装备'}</button>
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
