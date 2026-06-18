import { describe, expect, it } from 'vitest';
import { NPC_PROFILES } from '../../data/npc/npcProfiles';
import { getNpcProfile } from './getNpcProfile';
import { validateNpcProfiles } from './validateNpcProfiles';

describe('NPCProfile registry', () => {
  it('keeps canonical npc ids unique and resolves aliases', () => {
    const validation = validateNpcProfiles(NPC_PROFILES);
    expect(validation.duplicateIds).toEqual([]);
    expect(getNpcProfile(NPC_PROFILES[0].name)?.id).toBe(NPC_PROFILES[0].id);
  });
});
