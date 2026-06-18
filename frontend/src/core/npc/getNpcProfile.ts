import { NPC_ALIAS_TO_ID } from '../../data/npc/npcAliases';
import { NPC_PROFILES } from '../../data/npc/npcProfiles';

const NPC_BY_ID = new Map(NPC_PROFILES.map((profile) => [profile.id, profile] as const));

export function getNpcProfile(idOrAlias: string) {
  const key = String(idOrAlias || '').trim().toLowerCase();
  const id = NPC_BY_ID.has(key) ? key : NPC_ALIAS_TO_ID.get(key);
  return id ? NPC_BY_ID.get(id) : undefined;
}
