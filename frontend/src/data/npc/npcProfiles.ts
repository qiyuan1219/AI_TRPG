import { CHARACTER_PROFILES } from '../characterRegistry';
import type { NPCProfile } from '../../core/npc/NPCProfile';

const TRUST_KEY_BY_ID: Record<string, string> = {
  selin: 'serin',
  ailin: 'ailin',
  buluoke: 'brock',
  kaiya: 'kaiya',
};

const seenIds = new Set<string>();

export const NPC_PROFILES: NPCProfile[] = CHARACTER_PROFILES
  .filter((profile) => profile.kind !== 'player')
  .filter((profile) => {
    if (seenIds.has(profile.id)) return false;
    seenIds.add(profile.id);
    return true;
  })
  .map((profile) => ({
    id: profile.id,
    name: profile.name,
    aliases: profile.aliases,
    portrait: profile.portrait,
    role: profile.subtitle,
    speechStyle: profile.testLine,
    goals: [],
    trustKey: TRUST_KEY_BY_ID[profile.id],
    promptProfile: {
      personality: profile.subtitle,
      speakingRules: [profile.testLine],
    },
    metadata: { source: 'characterRegistry' },
  }));
