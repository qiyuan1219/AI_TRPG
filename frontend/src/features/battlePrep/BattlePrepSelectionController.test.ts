import { describe, expect, it } from 'vitest';
import { completeBattlePrepSelectionPatch, createBattlePrepSelectionPatch, isBattlePrepReadyToEnter, isBattlePrepSelectionActive, lockBattlePrepSelectionPatch, matchBattlePrepSelectionChoice, readyBattlePrepSelectionPatch, resolveBattlePrepSelectionConfig } from './BattlePrepSelectionController';
import { getEncounterConfigById } from '../../data/encounterFlows';

describe('BattlePrepSelectionController', () => {
  it.each(['tutorial-crawler-ambush', 'blue-shoal', 'boss-gatekeeper'])('manages %s as battle_prep, not story choice', (id) => {
    const config = getEncounterConfigById(id)!;
    const patch = createBattlePrepSelectionPatch(config) as any;
    expect(patch.battlePrepSelection.kind).toBe('battle_prep');
    expect(patch.battlePrepSelection.consumed).toBe(false);
    expect(isBattlePrepSelectionActive(patch)).toBe(true);
  });

  it('resolves tutorial context without relying on ordinary action counters', () => {
    expect(resolveBattlePrepSelectionConfig({ tutorial_battle_pending: true, first_choice_resolved: false } as any)?.encounterId)
      .toBe('tutorial-crawler-ambush');
  });

  it('matches configured labels while ignoring the visible DC suffix', () => {
    const choices = getEncounterConfigById('blue-shoal')!.prepActions;
    expect(matchBattlePrepSelectionChoice(choices[0].label, choices)?.id).toBe(choices[0].id);
  });

  it('locks immediately after confirmation and cannot fall back into story choices', () => {
    const config = getEncounterConfigById('boss-gatekeeper')!;
    const locked = lockBattlePrepSelectionPatch(config, 'hold-formation') as any;
    expect(locked.battlePrepSelection.consumed).toBe(true);
    expect(locked.battlePrepSelection.phase).toBe('ai_narrating');
    expect(isBattlePrepSelectionActive(locked)).toBe(false);
  });

  it('does not resolve a completed battle prep as a new selectable action', () => {
    const config = getEncounterConfigById('blue-shoal')!;
    const completed = completeBattlePrepSelectionPatch(config) as any;
    expect(resolveBattlePrepSelectionConfig(completed)).toBeNull();
  });

  it('requires an explicit entry action after narration has completed', () => {
    const config = getEncounterConfigById('tutorial-crawler-ambush')!;
    const ready = readyBattlePrepSelectionPatch(config) as any;
    expect(ready.encounterPhase).toBe('battlePending');
    expect(ready.battlePrepSelection.phase).toBe('transitioning_to_battle');
    expect(isBattlePrepReadyToEnter(ready)).toBe(true);
  });
});
