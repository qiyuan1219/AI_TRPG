import type { GameState } from '../../types/game';
import {
  DEFAULT_INVENTORY,
  addInventoryQuantity,
  appendInventoryItem,
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
}

export function buildApothecaryPurchasePatch(
  current: GameState,
  { itemId, name, price, stat }: ApothecaryPurchaseInput,
): GameState | null {
  const alreadyPurchased = Boolean(
    current[`yunling_${itemId}_bought`]
    || (itemId === 'purification_heart' && current.purification_heart_owned),
  );
  if ((stat || itemId === 'purification_heart') && alreadyPurchased) return null;

  const inventoryText = String(current.inventory || DEFAULT_INVENTORY);
  const nextInventory = itemId === 'purification_heart' && inventoryText.includes(name)
    ? inventoryText
    : appendInventoryItem(inventoryText, name);
  const patch: GameState = {
    gold: Math.max(0, Number(current.gold ?? 200) - price),
    inventory: nextInventory,
    [`yunling_${itemId}_bought`]: true,
    last_event: `在云苓处购买${name}`,
  };

  if (stat) {
    patch[stat] = Number(current[stat] ?? 10) + 2;
  } else if (itemId === 'healing_potion') {
    const maxHp = Number(current.max_hp ?? current.current_hp ?? 20);
    patch.current_hp = Math.min(maxHp, Number(current.current_hp ?? 20) + 5);
  } else if (itemId === 'purification_heart') {
    patch.purification_heart_owned = true;
  }
  return patch;
}

export function buildApothecaryFarewellInventory(inventoryText: string) {
  return addInventoryQuantity(inventoryText, '云苓的护身符', 1);
}
