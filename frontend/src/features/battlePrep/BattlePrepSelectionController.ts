import { getEncounterConfigById, type EncounterFlowConfig } from '../../data/encounterFlows';
import type { GameState } from '../../types/game';
import { createBattlePrepFlowState, type BattlePrepChoice } from '../../utils/battlePrep';

export type BattlePrepSelectionPhase =
  | 'selecting'
  | 'rolling'
  | 'reroll_pending'
  | 'ai_narrating'
  | 'transitioning_to_battle'
  | 'completed';

export interface BattlePrepSelectionContext {
  kind: 'battle_prep';
  encounterId: string;
  battleId: string;
  phase: BattlePrepSelectionPhase;
  consumed: boolean;
  selectedActionId?: string;
}

const MANAGED_ENCOUNTERS = new Set([
  'tutorial-crawler-ambush',
  'blue-shoal',
  'boss-gatekeeper',
]);

export function isManagedBattlePrepEncounter(encounterId?: string | null) {
  return Boolean(encounterId && MANAGED_ENCOUNTERS.has(encounterId));
}

export function resolveBattlePrepSelectionConfig(state: GameState): EncounterFlowConfig | null {
  if (state.tutorial_battle_pending && !state.tutorial_battle_done && !state.first_choice_resolved) {
    return getEncounterConfigById('tutorial-crawler-ambush');
  }
  const context = state.battlePrepSelection as BattlePrepSelectionContext | undefined;
  if (context?.kind === 'battle_prep' && context.phase !== 'completed') {
    const contextConfig = getEncounterConfigById(context.encounterId);
    return contextConfig && isManagedBattlePrepEncounter(contextConfig.encounterId) ? contextConfig : null;
  }
  if (state.encounterPhase !== 'prepChoice' && state.encounterPhase !== 'aiNarration') return null;
  const config = getEncounterConfigById(state.currentEncounterId);
  return config && isManagedBattlePrepEncounter(config.encounterId) ? config : null;
}

export function isBattlePrepSelectionActive(state: GameState) {
  const context = state.battlePrepSelection as BattlePrepSelectionContext | undefined;
  if (context?.kind === 'battle_prep' && !context.consumed
      && (context.phase === 'selecting' || context.phase === 'rolling' || context.phase === 'reroll_pending')) return true;
  const config = resolveBattlePrepSelectionConfig(state);
  return Boolean(config && state.encounterPhase === 'prepChoice' && state.battlePrep?.consumed !== true);
}

export function createBattlePrepSelectionPatch(config: EncounterFlowConfig): Partial<GameState> {
  return {
    currentEncounterId: config.encounterId,
    currentBattleId: config.battleId,
    nextAfterBattleSceneId: config.afterSceneId,
    encounterPhase: 'prepChoice',
    battlePrep: createBattlePrepFlowState(),
    battlePrepSelection: {
      kind: 'battle_prep',
      encounterId: config.encounterId,
      battleId: config.battleId,
      phase: 'selecting',
      consumed: false,
    } satisfies BattlePrepSelectionContext,
  };
}

export function lockBattlePrepSelectionPatch(
  config: EncounterFlowConfig,
  selectedActionId: string,
): Partial<GameState> {
  return {
    encounterPhase: 'aiNarration',
    battlePrepSelection: {
      kind: 'battle_prep',
      encounterId: config.encounterId,
      battleId: config.battleId,
      phase: 'ai_narrating',
      consumed: true,
      selectedActionId,
    } satisfies BattlePrepSelectionContext,
  };
}

export function readyBattlePrepSelectionPatch(config: EncounterFlowConfig): Partial<GameState> {
  return {
    currentEncounterId: config.encounterId,
    currentBattleId: config.battleId,
    nextAfterBattleSceneId: config.afterSceneId,
    encounterPhase: 'battlePending',
    battlePrep: { active: true, consumed: true, remainingActions: 0, phase: 'transitioning_to_battle' },
    battlePrepSelection: {
      kind: 'battle_prep',
      encounterId: config.encounterId,
      battleId: config.battleId,
      phase: 'transitioning_to_battle',
      consumed: true,
    } satisfies BattlePrepSelectionContext,
  };
}

export function isBattlePrepReadyToEnter(state: GameState) {
  const context = state.battlePrepSelection as BattlePrepSelectionContext | undefined;
  return context?.kind === 'battle_prep'
    && context.phase === 'transitioning_to_battle'
    && context.consumed === true
    && state.encounterPhase === 'battlePending';
}

export function completeBattlePrepSelectionPatch(config: EncounterFlowConfig): Partial<GameState> {
  return {
    currentEncounterId: config.encounterId,
    currentBattleId: config.battleId,
    nextAfterBattleSceneId: config.afterSceneId,
    encounterPhase: 'battleRunning',
    battlePrep: { active: false, consumed: true, remainingActions: 0, phase: 'completed' },
    battlePrepSelection: {
      kind: 'battle_prep',
      encounterId: config.encounterId,
      battleId: config.battleId,
      phase: 'completed',
      consumed: true,
    } satisfies BattlePrepSelectionContext,
  };
}

function normalizeAction(value: string) {
  return value.replace(/[【\[].*?[】\]]/g, '').replace(/[，,。.!！?？；;：:\s]/g, '').trim();
}

export function matchBattlePrepSelectionChoice(action: string, choices: BattlePrepChoice[]) {
  const key = normalizeAction(action);
  return choices.find((choice) => normalizeAction(choice.label) === key) || null;
}
