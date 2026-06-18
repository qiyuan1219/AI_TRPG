import { NPC_PROFILES } from './npcProfiles';

export const NPC_ALIAS_TO_ID = new Map<string, string>();

for (const profile of NPC_PROFILES) {
  [profile.id, profile.name, ...profile.aliases].forEach((alias) => {
    NPC_ALIAS_TO_ID.set(alias.trim().toLowerCase(), profile.id);
  });
}
