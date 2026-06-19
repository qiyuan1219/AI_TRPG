import type { GameState } from '../../types/game';
import { appendUniqueInventoryItem } from '../inventory/inventoryStatePatch';
import { buildTrustPatch, getCompanionTrust } from '../../utils/trust';

export const ENABLE_COMPRESSED_ACT1_ENDING = true;

export type Act1CoreChoice = 'destroy' | 'stabilize';
export type Act1EndingId =
  | 'guardian-remains'
  | 'wounded-through-gate'
  | 'cold-expedition'
  | 'gate-split-open'
  | 'time-reset';

export const ACT1_SCENE_IDS = {
  aftermath: 'act1-blue-shoal-aftermath-compressed',
  blackRootEntrance: 'act1-black-root-entrance',
  lain: 'act1-lain-survivor-event',
  serinCrack: 'act1-black-root-rest-serin-crack',
  coreChoice: 'act1-boss-core-choice',
  oceanReveal: 'act1-ending-ocean-reveal',
  complete: 'act1-game-complete',
  summary: 'act1-ending-summary',
  badEnding: 'act1-bad-ending-time-reset',
} as const;

export const ACT1_ITEM_NAMES = {
  fortressEmblem: '远征要塞徽记',
  lainDogtag: '莱因的身份牌',
  obeliskShard: '黑色方尖碑碎片',
  silverStaffCharm: '银杖护符',
} as const;

export function resolveAct1EndingId(lainHelped: boolean, bossCoreChoice: Act1CoreChoice): Act1EndingId {
  if (lainHelped && bossCoreChoice === 'stabilize') return 'guardian-remains';
  if (lainHelped && bossCoreChoice === 'destroy') return 'wounded-through-gate';
  if (!lainHelped && bossCoreChoice === 'stabilize') return 'cold-expedition';
  return 'gate-split-open';
}

export function buildCompressedAct1StartPatch(state: GameState): Partial<GameState> {
  return {
    compressedAct1EndingStarted: true,
    blueShoalAftermathSeen: true,
    currentNodeId: ACT1_SCENE_IDS.aftermath,
    inventory: appendUniqueInventoryItem(String(state.inventory || ''), ACT1_ITEM_NAMES.fortressEmblem),
  };
}

export type LainChoice = 'help' | 'question' | 'inspect' | 'ignore' | 'take-clue';

export function buildLainChoicePatch(state: GameState, choice: LainChoice): Partial<GameState> {
  const helped = choice === 'help' || choice === 'question' || choice === 'inspect';
  const trustDelta = choice === 'help'
    ? { serin: 2, ailin: 2 }
    : choice === 'question'
      ? { serin: 1 }
      : choice === 'ignore'
        ? { serin: -3, ailin: -4 }
        : choice === 'take-clue'
          ? { serin: -1, kaiya: 1 }
          : {};
  const trustValues = Object.fromEntries(Object.entries(trustDelta).map(([id, delta]) => [
    id,
    getCompanionTrust(state, id as 'serin' | 'ailin' | 'kaiya') + delta,
  ]));
  const obtainsDogtag = choice !== 'ignore';
  return {
    lainEncountered: true,
    lainHelped: helped,
    lainIgnored: !helped,
    helpedRhein: helped,
    rhein_rescued_noncombat: helped,
    inventory: obtainsDogtag
      ? appendUniqueInventoryItem(String(state.inventory || ''), ACT1_ITEM_NAMES.lainDogtag)
      : state.inventory,
    ...(choice === 'inspect' || choice === 'take-clue' ? { lainFragmentClueObtained: true } : {}),
    ...buildTrustPatch(state, trustValues),
    currentNodeId: ACT1_SCENE_IDS.serinCrack,
  };
}

export type SerinCrackChoice = 'comfort' | 'careful' | 'mission' | 'force-answer' | 'force-cast';

export function buildSerinCrackPatch(state: GameState, choice: SerinCrackChoice): Partial<GameState> {
  const delta = choice === 'comfort' ? 10 : choice === 'careful' ? 5 : choice === 'mission' ? 0 : choice === 'force-answer' ? -15 : -20;
  const resultingTrust = getCompanionTrust(state, 'serin') + delta;
  const obtainsCharm = resultingTrust >= 70 && choice !== 'force-answer' && choice !== 'force-cast';
  return {
    serinStaffCrackSeen: true,
    serin_cracked_silver_staff_done: true,
    completedSerinSideQuest3: true,
    ...buildTrustPatch(state, { serin: resultingTrust }),
    ...(obtainsCharm ? {
      serinStaffCharmObtained: true,
      inventory: appendUniqueInventoryItem(String(state.inventory || ''), ACT1_ITEM_NAMES.silverStaffCharm),
    } : {}),
    currentNodeId: 'act1-blackstone-gatekeeper-battle',
  };
}

export function buildAct1EndingPatch(choice: Act1CoreChoice, lainHelped: boolean): Partial<GameState> {
  const endingId = resolveAct1EndingId(lainHelped, choice);
  return {
    bossCoreChoice: choice,
    core_choice_pending: false,
    act1EndingId: endingId,
    act1_ending: endingId,
    endingId,
    currentNodeId: `act1-ending-${endingId}`,
  };
}
