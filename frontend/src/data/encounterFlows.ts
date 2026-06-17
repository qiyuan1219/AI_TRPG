import type { BattlePrepChoice } from '../utils/battlePrep';

export type EncounterPhase =
  | 'story'
  | 'prepChoice'
  | 'prepResolving'
  | 'aiNarration'
  | 'battlePending'
  | 'battleRunning'
  | 'battleWon'
  | 'afterScene';

export interface EncounterFlowConfig {
  encounterId: string;
  introSceneId: string;
  prepActions: BattlePrepChoice[];
  battleId: string;
  afterSceneId: string;
  prepDoneFlag: string;
  battleDoneFlag: string;
}

export const DEFAULT_BATTLE_PREP_ACTION: BattlePrepChoice = {
  id: 'keep-formation',
  label: '保持队形，准备迎战',
  type: 'battlePrep',
  desc: '在敌人靠近前稳住阵型。',
  check: { skill: 'observe', dc: 12, label: '观察 DC 12', attribute: 'wis' },
  successText: '你的判断及时生效，队伍在混乱爆发前争取到了一点优势。',
  failText: '你的动作慢了一步，敌人的压迫感迅速逼近，局势变得更加危险。',
  successEffect: { battleEffects: { playerInitiativeBonus: 1 } },
  failEffect: { battleEffects: { enemyInitiativeBonus: 1 } },
};

export const TUTORIAL_BATTLE_PREP_ACTIONS: BattlePrepChoice[] = [
  {
    id: 'observe-soft-belly',
    label: '观察裂隙爬兽的软肋',
    type: 'battlePrep',
    desc: '根据瑟琳的提醒，寻找裂隙爬兽腹侧没有硬壳保护的位置。',
    check: { skill: 'observe', dc: 12, label: '观察 DC 12', attribute: 'wis' },
    successText: '你看准了裂隙爬兽跃起时暴露出的腹侧软肋。',
    failText: '你试图寻找弱点，但裂隙爬兽动作太快，你只来得及仓促应战。',
    successEffect: { battleEffects: { playerAttackBonusFirstRound: 2 } },
    failEffect: { battleEffects: { enemyAttackBonusFirstRound: 1 } },
  },
  {
    id: 'hold-position',
    label: '稳住脚步，不退向护栏',
    type: 'battlePrep',
    desc: '听从瑟琳提醒，避免在慌乱中退到危险边缘。',
    check: { skill: 'endurance', dc: 11, label: '耐受 DC 11', attribute: 'con' },
    successText: '你稳住呼吸和重心，没有被裂隙爬兽的冲势逼到护栏边。',
    failText: '你被扑来的怪物逼退半步，脚下的碎木和缆索让站位变得不稳。',
    successEffect: { battleEffects: { playerAcBonusFirstRound: 1 } },
    failEffect: { battleEffects: { playerInitiativePenalty: 1 } },
  },
];

export const ENCOUNTER_FLOW_CONFIGS: EncounterFlowConfig[] = [
  {
    encounterId: 'tutorial-crawler-ambush',
    introSceneId: 'tutorial-battle-trigger',
    prepActions: TUTORIAL_BATTLE_PREP_ACTIONS,
    battleId: 'tutorial-crawler-battle',
    afterSceneId: 'tutorial-battle-after',
    prepDoneFlag: 'tutorial_battle_prep_done',
    battleDoneFlag: 'tutorial_battle_done',
  },
  {
    encounterId: 'blue-shoal',
    introSceneId: 'enter-blue-shoal',
    prepActions: [DEFAULT_BATTLE_PREP_ACTION],
    battleId: 'enemy_pack_blue_shoal',
    afterSceneId: 'after-battle-blue-shoal',
    prepDoneFlag: 'blue_shoal_battle_prep_done',
    battleDoneFlag: 'blue_shoal_battle_done',
  },
  {
    encounterId: 'bone-pillar-wetland',
    introSceneId: 'enter-bone-pillar-wetland',
    prepActions: [DEFAULT_BATTLE_PREP_ACTION],
    battleId: 'enemy_pack_bone_marsh',
    afterSceneId: 'rhein-encounter',
    prepDoneFlag: 'bone_pillar_wetland_battle_prep_done',
    battleDoneFlag: 'bone_marsh_battle_done',
  },
  {
    encounterId: 'boss-gatekeeper',
    introSceneId: 'enter-boss-gatekeeper',
    prepActions: [DEFAULT_BATTLE_PREP_ACTION],
    battleId: 'boss_blackstone_gatekeeper',
    afterSceneId: 'blackstone-core-choice',
    prepDoneFlag: 'boss_gatekeeper_battle_prep_done',
    battleDoneFlag: 'boss_defeated',
  },
];

export function getEncounterConfigById(encounterId?: string | null) {
  return ENCOUNTER_FLOW_CONFIGS.find((config) => config.encounterId === encounterId) || null;
}

export function getEncounterConfigByIntroSceneId(sceneId?: string | null) {
  return ENCOUNTER_FLOW_CONFIGS.find((config) => config.introSceneId === sceneId) || null;
}

export function getEncounterConfigByBattleId(battleId?: string | null) {
  return ENCOUNTER_FLOW_CONFIGS.find((config) => config.battleId === battleId) || null;
}

export function canShowPrepChoice(state: any, config: EncounterFlowConfig): boolean {
  return !state.flags?.[config.prepDoneFlag] && !state.flags?.[config.battleDoneFlag] && !state[config.battleDoneFlag];
}

export function isEncounterBattleDone(state: any, config: EncounterFlowConfig): boolean {
  return Boolean(state.flags?.[config.battleDoneFlag] || state[config.battleDoneFlag]);
}

