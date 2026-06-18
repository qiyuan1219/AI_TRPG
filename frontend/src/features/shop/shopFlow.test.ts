import { describe, expect, it } from 'vitest';
import { buildApothecaryPurchasePatch, buildBargainPurchasePatch } from './shopFlow';

describe('shop flow', () => {
  it('builds the established bargain purchase patch without duplicating the item', () => {
    const patch = buildBargainPurchasePatch(
      { gold: 100, inventory: '长剑,冷光灯' },
      { itemName: '冷光灯', finalPrice: 30 },
    );
    expect(patch.gold).toBe(70);
    expect(patch.inventory).toBe('长剑,冷光灯');
    expect(patch.blackmarket_done).toBe(true);
  });

  it('keeps apothecary healing and unique-purchase behavior', () => {
    const healing = buildApothecaryPurchasePatch(
      { gold: 100, inventory: '长剑', current_hp: 18, max_hp: 20 },
      { itemId: 'healing_potion', name: '治疗药水', price: 20 },
    );
    expect(healing).toMatchObject({ gold: 80, inventory: '长剑,治疗药水', current_hp: 20 });

    const duplicate = buildApothecaryPurchasePatch(
      { gold: 100, yunling_str_potion_bought: true },
      { itemId: 'str_potion', name: '力量药水', price: 20, stat: 'str' },
    );
    expect(duplicate).toBeNull();
  });
});
