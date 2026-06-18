import type { GameState } from '../../types/game';

export const DEFAULT_INVENTORY = '长剑,冒险者工具包';

export function inventoryCounts(inventoryText: string) {
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
  return counts;
}

export function formatInventoryCounts(counts: Map<string, number>) {
  return Array.from(counts.entries())
    .filter(([, quantity]) => quantity > 0)
    .map(([name, quantity]) => (quantity > 1 ? `${name}x${quantity}` : name))
    .join(',');
}

export function changeInventoryQuantity(inventoryText: string, itemName: string, delta: number) {
  const counts = inventoryCounts(inventoryText);
  const nextQuantity = Math.max(0, (counts.get(itemName) ?? 0) + delta);
  if (nextQuantity > 0) counts.set(itemName, nextQuantity);
  else counts.delete(itemName);
  return formatInventoryCounts(counts);
}

export function addInventoryQuantity(inventoryText: string, itemName: string, quantity: number) {
  return changeInventoryQuantity(inventoryText, itemName, Math.max(1, quantity));
}

export function appendInventoryItem(inventoryText: string, itemName: string) {
  return inventoryText ? `${inventoryText},${itemName}` : itemName;
}

export function appendUniqueInventoryItem(inventoryText: string, itemName: string) {
  return inventoryText.includes(itemName) ? inventoryText : appendInventoryItem(inventoryText, itemName);
}

export function buildInventoryStatePatch(
  patch: Partial<GameState>,
  message?: string,
): Partial<GameState> {
  return {
    ...patch,
    ...(message && !patch.last_event ? { last_event: message } : {}),
  };
}
