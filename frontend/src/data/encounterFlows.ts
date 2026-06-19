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
  canUseRerollItems: true,
  desc: '在敌人靠近前稳住阵型。',
  check: { skill: 'observe', dc: 12, label: '观察 DC 12', attribute: 'wis' },
  successText: '你的判断及时生效，队伍在混乱爆发前争取到了一点优势。',
  failText: '你的动作慢了一步，敌人的压迫感迅速逼近，局势变得更加危险。',
  successEffect: { battleEffects: { playerInitiativeBonus: 1 } },
  failEffect: { battleEffects: { enemyInitiativeBonus: 1 } },
};

export const TUTORIAL_BATTLE_PREP_ACTIONS: BattlePrepChoice[] = [
  {
    id: 'tutorial-face-crawler',
    label: '正面迎击裂隙爬兽【力量DC10】',
    type: 'battlePrep',
    canUseRerollItems: true,
    desc: '稳住前排，从正面打断裂隙爬兽的冲势。',
    check: { skill: 'strength', dc: 10, label: '力量 DC 10', attribute: 'str' },
    successText: '你的迎击打乱了爬兽的第一轮冲锋。', failText: '爬兽的冲势迫得你仓促后撤。',
    successEffect: {}, failEffect: {},
  },
  {
    id: 'tutorial-observe-weakness',
    label: '观察弱点寻找破绽【感知DC10】',
    type: 'battlePrep',
    canUseRerollItems: true,
    desc: '寻找爬兽甲壳与关节之间的空隙。',
    check: { skill: 'perception', dc: 10, label: '感知 DC 10', attribute: 'wis' },
    successText: '你找到了爬兽腹侧的软肋。', failText: '爬兽移动太快，你没能锁定破绽。',
    successEffect: {}, failEffect: {},
  },
  {
    id: 'tutorial-serin-support', label: '请求瑟琳施展辅助法术【魅力DC12】', type: 'battlePrep', canUseRerollItems: true,
    desc: '请瑟琳用银杖法术干扰爬兽。', check: { skill: 'charisma', dc: 12, label: '魅力 DC 12', attribute: 'cha' },
    successText: '瑟琳的法术成功扰乱了敌人。', failText: '爬兽的嘶吼打断了法术。', successEffect: {}, failEffect: {},
  },
  {
    id: 'tutorial-find-cover', label: '闪避并寻找掩护位置【敏捷DC10】', type: 'battlePrep', canUseRerollItems: true,
    desc: '借吊箱残骸避开爬兽的第一轮扑击。', check: { skill: 'dexterity', dc: 10, label: '敏捷 DC 10', attribute: 'dex' },
    successText: '你带着同伴找到了合适的掩体。', failText: '狭窄平台上无处可躲。', successEffect: {}, failEffect: {},
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
    afterSceneId: 'after-battle-blue-shoal-expanded-v2',
    prepDoneFlag: 'blue_shoal_battle_prep_done',
    battleDoneFlag: 'blue_shoal_battle_done',
  },
  {
    encounterId: 'bone-pillar-wetland',
    introSceneId: 'bone-beast-prebattle-v2',
    prepActions: [DEFAULT_BATTLE_PREP_ACTION],
    battleId: 'enemy_pack_bone_marsh',
    afterSceneId: 'after-battle-bone-beast-v2',
    prepDoneFlag: 'bone_pillar_wetland_battle_prep_done',
    battleDoneFlag: 'bone_marsh_battle_done',
  },
  {
    encounterId: 'boss-gatekeeper',
    introSceneId: 'guardian-prebattle-choice-v2',
    prepActions: [DEFAULT_BATTLE_PREP_ACTION],
    battleId: 'boss_blackstone_gatekeeper',
    afterSceneId: 'after-battle-blackstone-guardian-v2',
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
  const selectedActionId = String(
    state.selectedPrepActionId
    || state.lastBattlePrepChoice
    || state.battlePrepSelection?.selectedActionId
    || '',
  );
  const hasRealBlueShoalPrepChoice = config.encounterId === 'blue-shoal'
    ? selectedActionId.startsWith('blue-shoal-prep-')
    : true;
  const consumedForThisEncounter = state.currentEncounterId === config.encounterId
    && state.battlePrep?.consumed === true
    && hasRealBlueShoalPrepChoice;
  const prepDoneFlagSet = Boolean(state.flags?.[config.prepDoneFlag] || state[config.prepDoneFlag]);
  const prepAlreadyDone = config.encounterId === 'blue-shoal'
    ? prepDoneFlagSet && hasRealBlueShoalPrepChoice
    : prepDoneFlagSet;
  return !consumedForThisEncounter
    && !prepAlreadyDone
    && !state.flags?.[config.battleDoneFlag]
    && !state[config.battleDoneFlag];
}

export function isEncounterBattleDone(state: any, config: EncounterFlowConfig): boolean {
  return Boolean(state.flags?.[config.battleDoneFlag] || state[config.battleDoneFlag]);
}
