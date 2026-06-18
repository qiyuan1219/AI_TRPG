import type { ContentPack } from './contentPack';

export interface ContentPackValidation {
  valid: boolean;
  errors: string[];
}

function hasDuplicate(values: string[]) {
  return new Set(values).size !== values.length;
}

export function validateContentPack(pack: ContentPack): ContentPackValidation {
  const errors: string[] = [];
  if (!pack.packId) errors.push('packId is required');
  if (!pack.version) errors.push('version is required');
  if (hasDuplicate(pack.scenes.map((item) => item.id))) errors.push('duplicate scene id');
  if (hasDuplicate(pack.encounters.map((item) => item.id))) errors.push('duplicate encounter id');
  if (hasDuplicate(pack.items.map((item) => item.catalogId))) errors.push('duplicate item id');
  if (hasDuplicate(pack.npcs.map((item) => item.id))) errors.push('duplicate npc id');
  if (hasDuplicate(pack.quests.map((item) => item.id))) errors.push('duplicate quest id');
  return { valid: errors.length === 0, errors };
}
