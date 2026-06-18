import type { NPCProfile } from './NPCProfile';

export interface NpcProfileValidation {
  valid: boolean;
  duplicateIds: string[];
  duplicateAliases: string[];
}

export function validateNpcProfiles(profiles: NPCProfile[]): NpcProfileValidation {
  const ids = new Set<string>();
  const aliases = new Set<string>();
  const duplicateIds: string[] = [];
  const duplicateAliases: string[] = [];

  for (const profile of profiles) {
    if (ids.has(profile.id)) duplicateIds.push(profile.id);
    ids.add(profile.id);

    for (const alias of [profile.name, ...profile.aliases]) {
      const key = alias.trim().toLowerCase();
      if (aliases.has(key)) duplicateAliases.push(alias);
      aliases.add(key);
    }
  }

  return {
    valid: duplicateIds.length === 0 && duplicateAliases.length === 0,
    duplicateIds,
    duplicateAliases,
  };
}
