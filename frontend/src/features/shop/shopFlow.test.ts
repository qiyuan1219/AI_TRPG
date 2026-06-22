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

  it('adds healing potions to inventory without applying healing at purchase time', () => {
    const healing = buildApothecaryPurchasePatch(
      { gold: 100, inventory: '长剑', current_hp: 18, max_hp: 20 },
      { itemId: 'healing_potion', name: '治疗药水', price: 20 },
    );
    expect(healing).toMatchObject({ gold: 80, inventory: '长剑,治疗药水' });
    expect(healing?.current_hp).toBeUndefined();

    const duplicate = buildApothecaryPurchasePatch(
      { gold: 100, yunling_str_potion_bought: true },
      { itemId: 'str_potion', name: '力量药水', price: 20, stat: 'str' },
    );
    expect(duplicate).toBeNull();
  });

  it('adds stat potions to inventory without applying the attribute bonus until backpack use', () => {
    const strength = buildApothecaryPurchasePatch(
      { gold: 200, inventory: '长剑', str: 12 },
      { itemId: 'strength_potion', name: '力量药水', price: 100, stat: 'str' },
    );

    expect(strength).toMatchObject({
      gold: 100,
      inventory: '长剑,力量药水',
      yunling_strength_potion_ready_to_use: true,
    });
    expect(strength?.str).toBeUndefined();
  });

  it('limits Yunling dice stock to three purchases and stacks inventory', () => {
    const first = buildApothecaryPurchasePatch(
      { gold: 500, inventory: '长剑' },
      { itemId: 'fiction_dice', name: '虚构骰子', price: 50, stock: 3 },
    );
    expect(first).toMatchObject({ gold: 450, inventory: '长剑,虚构骰子', yunling_fiction_dice_purchase_count: 1 });
    const thirdState = { ...first, gold: 400, inventory: '长剑,虚构骰子x3', yunling_fiction_dice_purchase_count: 3 } as any;
    expect(buildApothecaryPurchasePatch(thirdState, {
      itemId: 'fiction_dice', name: '虚构骰子', price: 50, stock: 3,
    })).toBeNull();
  });
});
