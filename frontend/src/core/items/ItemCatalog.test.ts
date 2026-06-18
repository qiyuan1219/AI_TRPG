import { describe, expect, it } from 'vitest';
import { getItemDefinition, resolveCatalogId } from './ItemCatalog';

describe('ItemCatalog', () => {
  it('migrates legacy names and aliases to stable catalog ids', () => {
    expect(resolveCatalogId('虚构骰子')).toBe('fiction_dice');
    expect(resolveCatalogId('小红瓶')).toBe('healing_potion');
    expect(resolveCatalogId('不存在的物品')).toBe('legacy_unknown');
  });

  it('defines rule effects for reroll and healing items', () => {
    expect(getItemDefinition('万能骰子')?.effects?.[0].type).toBe('reroll');
    expect(getItemDefinition('治疗药水')?.effects?.[0]).toMatchObject({ type: 'heal', formula: '1d8+2' });
  });
});
