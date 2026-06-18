import { describe, expect, it } from 'vitest';
import {
  addInventoryQuantity,
  buildInventoryStatePatch,
  changeInventoryQuantity,
  inventoryCounts,
} from './inventoryStatePatch';

describe('inventory state patch', () => {
  it('merges quantities without changing unrelated items', () => {
    const next = addInventoryQuantity('长剑,治疗药水x2,剧情钥匙', '治疗药水', 2);
    expect(next).toBe('长剑,治疗药水x4,剧情钥匙');
    expect(inventoryCounts(next).get('治疗药水')).toBe(4);
  });

  it('consumes only the requested item and clamps at zero', () => {
    expect(changeInventoryQuantity('金币袋,万能骰子x2,凯娅的暗号', '万能骰子', -1))
      .toBe('金币袋,万能骰子,凯娅的暗号');
    expect(changeInventoryQuantity('金币袋,万能骰子,凯娅的暗号', '万能骰子', -9))
      .toBe('金币袋,凯娅的暗号');
  });

  it('adds a panel message only when last_event is absent', () => {
    expect(buildInventoryStatePatch({ inventory: '长剑' }, '整理背包')).toEqual({
      inventory: '长剑',
      last_event: '整理背包',
    });
    expect(buildInventoryStatePatch({ inventory: '长剑', last_event: '原事件' }, '整理背包').last_event)
      .toBe('原事件');
  });
});
