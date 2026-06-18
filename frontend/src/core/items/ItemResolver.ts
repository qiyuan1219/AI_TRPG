import type { ItemDefinition, ItemEffect } from './ItemTypes';
import { getItemDefinition } from './ItemCatalog';

export function validateItemEffect(catalogId: string, effect: ItemEffect): boolean {
  const definition = getItemDefinition(catalogId);
  return Boolean(definition?.effects?.some((candidate) => candidate.type === effect.type));
}

export function resolveItemForUse(catalogId: string): ItemDefinition {
  const definition = getItemDefinition(catalogId);
  if (!definition) throw new Error(`未登记物品：${catalogId}`);
  return definition;
}
