import { lockBattlePrepForNarration } from '../../utils/battlePrep';
import { registerActionResolver } from './registry';

registerActionResolver('battle.prep.confirm', (state, action) => {
  const battlePrep = lockBattlePrepForNarration();
  return {
    schemaVersion: 1,
    accepted: true,
    actionId: action.id,
    events: [{ type: 'battle_prep_confirmed', encounterId: action.encounterId }],
    patches: [
      { op: 'set', path: 'battlePrep', value: battlePrep },
      { op: 'set', path: 'encounterPhase', value: 'aiNarration' },
    ],
    errors: [],
    needsNarration: true,
    updatedState: { ...state, battlePrep, encounterPhase: 'aiNarration' },
  };
});

export {};
