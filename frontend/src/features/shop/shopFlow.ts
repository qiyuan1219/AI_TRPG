import type { GameState } from '../../types/game';
import {
  DEFAULT_INVENTORY,
  addInventoryQuantity,
  appendUniqueInventoryItem,
} from '../inventory/inventoryStatePatch';

export interface BargainPurchaseInput {
  itemName: string;
  finalPrice: number;
}

export function buildBargainPurchasePatch(
  current: GameState,
  result: BargainPurchaseInput,
): GameState {
  const inventoryText = String(current.inventory || DEFAULT_INVENTORY);
  return {
    gold: Math.max(0, Number(current.gold ?? 200) - result.finalPrice),
    inventory: appendUniqueInventoryItem(inventoryText, result.itemName),
    blackmarket_done: true,
    blackmarket_purchase_item: result.itemName,
    blackmarket_purchase_price: result.finalPrice,
    last_event: `完成黑市采购：${result.itemName}，成交价${result.finalPrice}金`,
  };
}

export interface ApothecaryPurchaseInput {
  itemId: string;
  name: string;
  price: number;
  stat?: string;
  stock?: number;
}

export function buildApothecaryPurchasePatch(
  current: GameState,
  { itemId, name, price, stat, stock }: ApothecaryPurchaseInput,
): GameState | null {
  const purchaseCountKey = `yunling_${itemId}_purchase_count`;
  const purchaseCount = Math.max(0, Number(current[purchaseCountKey] || 0));
  const alreadyPurchased = Boolean(
    current[`yunling_${itemId}_bought`]
    || (itemId === 'purification_heart' && current.purification_heart_owned),
  );
  if ((stat || itemId === 'purification_heart') && alreadyPurchased) return null;
  if (stock !== undefined && purchaseCount >= stock) return null;
  if (Number(current.gold ?? 200) < price) return null;

  const inventoryText = String(current.inventory || DEFAULT_INVENTORY);
  const nextInventory = itemId === 'purification_heart' && inventoryText.includes(name)
    ? inventoryText
    : addInventoryQuantity(inventoryText, name, 1);
  const patch: GameState = {
    gold: Math.max(0, Number(current.gold ?? 200) - price),
    inventory: nextInventory,
    [`yunling_${itemId}_bought`]: true,
    [purchaseCountKey]: purchaseCount + 1,
    last_event: `在云苓处购买${name}`,
  };

  if (stat) {
    patch[`yunling_${itemId}_ready_to_use`] = true;
  } else if (itemId === 'purification_heart') {
    patch.purification_heart_owned = true;
  }
  return patch;
}

export function buildApothecaryFarewellInventory(inventoryText: string) {
  return addInventoryQuantity(inventoryText, '云苓的护身符', 1);
}
