import { getItemSummaryByName, resolveItemIconPath } from '../../data/itemIconPaths';
import type { GameState } from '../../types/game';
import { inventoryCounts } from '../inventory/inventoryStatePatch';

export type RewardNoticeKind = 'item' | 'document' | 'clue';
export interface RewardNotice {
  id: number;
  kind: RewardNoticeKind;
  name: string;
  icon: string;
  image: string;
  quantity?: number;
  summary?: string;
}

function rewardEntryId(entry: unknown) {
  if (typeof entry === 'string') return entry.trim();
  if (!entry || typeof entry !== 'object') return '';
  return String((entry as { id?: unknown }).id || '').trim();
}

export function collectRewardNotices(
  previous: GameState,
  next: GameState,
  nextId: () => number,
): RewardNotice[] {
  const notices: RewardNotice[] = [];
  const prevInventory = inventoryCounts(String(previous.inventory || ''));
  const nextInventory = inventoryCounts(String(next.inventory || ''));

  nextInventory.forEach((quantity, name) => {
    const delta = quantity - (prevInventory.get(name) ?? 0);
    if (delta <= 0) return;
    notices.push({
      id: nextId(),
      kind: 'item',
      name,
      icon: 'item',
      image: resolveItemIconPath('item', name),
      quantity: delta,
      summary: getItemSummaryByName(name),
    });
  });

  const prevDocuments = new Set((Array.isArray(previous.documents) ? previous.documents : []).map(rewardEntryId).filter(Boolean));
  (Array.isArray(next.documents) ? next.documents : []).forEach((raw: any) => {
    const id = rewardEntryId(raw);
    if (!id || prevDocuments.has(id)) return;
    notices.push({
      id: nextId(),
      kind: 'document',
      name: String(raw?.name || id),
      icon: String(raw?.icon || 'document'),
      image: resolveItemIconPath(String(raw?.icon || 'document'), String(raw?.name || id)),
      summary: String(raw?.summary || raw?.source || ''),
    });
  });

  const prevClues = new Set((Array.isArray(previous.clues) ? previous.clues : []).map(rewardEntryId).filter(Boolean));
  (Array.isArray(next.clues) ? next.clues : []).forEach((raw: any) => {
    const id = rewardEntryId(raw);
    if (!id || prevClues.has(id)) return;
    const name = String(raw?.name || id);
    const icon = String(raw?.icon || 'clue');
    notices.push({
      id: nextId(),
      kind: 'clue',
      name,
      icon,
      image: resolveItemIconPath(icon, name),
      summary: String(raw?.description || raw?.source || ''),
    });
  });

  return notices.slice(0, 5);
}
