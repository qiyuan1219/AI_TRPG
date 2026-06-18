import { Component, lazy, Suspense, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ActionPanel } from './components/ActionPanel';
import BattlePrepPanel from './components/BattlePrepPanel';
import type { BargainCompleteResult } from './components/BargainTestScreen';
import type { CompanionEventCompleteResult } from './components/CompanionEventTestScreen';
import { DiceRollOverlay } from './components/DiceRollOverlay';
import type { EventFeedItem } from './components/EventFeed';
import InventoryPanel from './components/InventoryPanel';
import { LoadingScreen } from './components/LoadingScreen';
import { VisualNovelStage } from './components/VisualNovelStage';
import type { DrinkingDiceResult } from './components/DrinkingDiceGame';
import type { OrlanBoxResult } from './components/OrlanBoxGame';
import PlayerStyleSelector from './components/PlayerStyleSelector';
import { findRegisteredSpeaker, resolveSpeakerName } from './data/characterRegistry';
import { resolveDndScene } from './data/dndScenes';
import { getAc, getInitiativeModifier, getMaxHp, getPlayerStyleById, migrateClassToStyleState } from './data/dndClasses';
import { getScriptedScene, matchScriptedScene, type ScriptedScene } from './data/scriptedScenes';
import { getBattleConfigById } from './data/battleConfigs';
import {
  canShowPrepChoice,
  getEncounterConfigByBattleId,
  getEncounterConfigById,
  getEncounterConfigByIntroSceneId,
  isEncounterBattleDone,
  type EncounterFlowConfig,
} from './data/encounterFlows';
import { evaluateCondition, applyBattlePrepEffect, finalizeBattlePrepResult, getBattlePrepLog, getRerollItemQuantity, migrateRerollInventory, useFictionDice, useOmniDice, type BattlePrepChoice, type BattlePrepResolveResult, type RerollItemId } from './utils/battlePrep';
import { getEndingFeedback } from './data/companionSideQuests';
import { getItemSummaryByName, resolveItemIconPath } from './data/itemIconPaths';
import type { StoryTestCheckpoint } from './data/storyTestCheckpoints';
import { shopItems } from './data/shopItems';
import { fetchStoryCheckNarration, judgeAilinRecruitAnswer, judgeSerlinIntro, listSaves, loadGame, patchGameState, saveGame } from './services/api';
import { dndRuntime } from './services/dndRuntime';
import type {
  ActionSuggestion,
  CreateGamePayload,
  DiceResult,
  GameState,
  SaveSlotKey,
  SaveSlotSummary,
  StoryLine,
} from './types/game';
import { createNarrativeStreamParser, extractHints, makeSuggestions, parseNarrativeSegments, splitNarrative, stripAllMachineProtocolText, stripMachineProtocolText } from './utils/narrative';
import { buildTrustPatch, COMPANION_ID_BY_EVENT_ID, getCompanionTrust, getTrustTier } from './utils/trust';
import { SelectionActionCheck } from './utils/selectionAction';



const TitleMenu = lazy(() => import('./components/TitleMenu').then((module) => ({ default: module.TitleMenu })));
const LoadGameScreen = lazy(() => import('./components/LoadGameScreen').then((module) => ({ default: module.LoadGameScreen })));
const TestScreen = lazy(() => import('./components/TestScreen').then((module) => ({ default: module.TestScreen })));
const BattleTestScreen = lazy(() => import('./components/BattleTestScreen').then((module) => ({ default: module.BattleTestScreen })));
const CompanionEventTestScreen = lazy(() => import('./components/CompanionEventTestScreen').then((module) => ({ default: module.CompanionEventTestScreen })));
const BargainTestScreen = lazy(() => import('./components/BargainTestScreen').then((module) => ({ default: module.BargainTestScreen })));
const DrinkingDiceGame = lazy(() => import('./components/DrinkingDiceGame').then((module) => ({ default: module.DrinkingDiceGame })));
const OrlanBoxGame = lazy(() => import('./components/OrlanBoxGame'));
const ApothecaryShop = lazy(() => import('./components/ApothecaryShop'));
const CharacterPanel = lazy(() => import('./components/CharacterPanel'));
const DialogueLog = lazy(() => import('./components/DialogueLog').then((module) => ({ default: module.DialogueLog })));
const DicePokerGame = lazy(() => import('./components/DicePokerGame').then((module) => ({ default: module.DicePokerGame })));
const CityMap = lazy(() => import('./components/CityMap').then((module) => ({ default: module.CityMap })));
const TavernDicePoker = lazy(() => import('./components/TavernDicePoker').then((module) => ({ default: module.TavernDicePoker })));
const SaveLoadPanel = lazy(() => import('./components/SaveLoadPanel').then((module) => ({ default: module.SaveLoadPanel })));

function LazyBoundary({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}

type Screen = 'main-menu' | 'load-game' | 'test' | 'loading' | 'game' | 'tutorial-battle' | 'companion-event' | 'deep-battle';
type GamePhase = 'narrating' | 'action';

function storyCheckDiceResult(roll: { d20: number; modifier: number; total: number; dc: number; skill: string }): DiceResult {
  return { type: 'skill_check', data: {
    掷骰: `D20=${roll.d20}`, 总计: roll.total, DC: roll.dc, 成功: roll.total >= roll.dc,
    属性: roll.skill, 属性加值: roll.modifier,
  } };
}

const AUDIO_STORAGE_KEYS = {
  bgmVolume: 'dnd_bgm_volume',
  sfxVolume: 'dnd_sfx_volume',
};

const BGM_TRACK_EVENT = 'dnd-bgm-track';

const BGM_TRACKS = {
  title: '/assets/bgm/bgm_01_title_theme.mp3',
  inverseCity: '/assets/bgm/bgm_02_inverse_city.mp3',
  guildCompanions: '/assets/bgm/bgm_03_guild_tavern_companions.mp3',
  elevatorDescent: '/assets/bgm/bgm_04a_elevator_descent.mp3',
  fungalSea: '/assets/bgm/bgm_04b_fungal_sea_explore.mp3',
  battleGeneral: '/assets/bgm/bgm_05_battle_general.mp3',
  blackMarket: '/assets/bgm/bgm_06_black_market.mp3',
  bossBattle: '/assets/bgm/bgm_07_blackstone_guardian_boss.mp3',
};

function readStoredVolume(key: string, fallback: number) {
  if (typeof window === 'undefined') return fallback;
  const stored = Number(window.localStorage.getItem(key));
  if (!Number.isFinite(stored)) return fallback;
  return Math.min(1, Math.max(0, stored));
}

function resolveBgmTrack(screen: Screen, currentLine: StoryLine | undefined, state: GameState) {
  if (screen === 'main-menu') return BGM_TRACKS.title;
  if (screen === 'tutorial-battle') return BGM_TRACKS.battleGeneral;
  if (currentLine?.bgm) return currentLine.bgm;

  const text = currentLine?.text || '';
  const area = String(state.current_area || '');

  if (/boss|Boss|首领|黑石|守护者|黑暗之门/.test(`${area} ${text}`)) return BGM_TRACKS.bossBattle;
  if (text.includes('黑市藏在补给市场背面的斜巷里')) return BGM_TRACKS.blackMarket;
  if (text.includes('吊舱落在一座钉进岩壁的钢木平台上')) return BGM_TRACKS.fungalSea;
  if (text.includes('降渊缆梯中枢悬在城市最下缘')) return BGM_TRACKS.elevatorDescent;
  if (text.includes('双脚重新落地时，一座倒悬于洞穴穹顶之上的城市出现在你面前')) return BGM_TRACKS.inverseCity;
  if (text.includes('你跟随守卫离开入城平台，沿着主缆街向公会方向前进')) return BGM_TRACKS.guildCompanions;

  if (/黑市/.test(area)) return BGM_TRACKS.blackMarket;
  if (/孢海/.test(area)) return BGM_TRACKS.fungalSea;
  if (/降渊缆梯/.test(area)) return BGM_TRACKS.elevatorDescent;
  if (/冒险者公会|回声酒馆|静默神殿/.test(area)) return BGM_TRACKS.guildCompanions;
  if (/逆穹悬城/.test(area)) return BGM_TRACKS.inverseCity;

  return '';
}

const DEFAULT_OPENING = '双脚重新落地时，一座倒悬于洞穴穹顶之上的城市出现在你面前，蓝绿色荧光在远方深渊中明灭。你的冒险从这一刻开始。';
const RETREAT_ACTION_RE = /逃跑|撤退|脱战|逃离|后撤|拉开距离|跑路|避战|不战斗/;
const DC_CHECK_RE = /(?:DC|ＤＣ)\s*\d{1,2}/i;
const CITY_MAP_ENABLED = false;

interface TutorialBattleSetup {
  openingEffects: Array<{
    unitId: string;
    hpDelta?: number;
    acDelta?: number;
    statuses?: string[];
    traits?: string[];
    log: string;
    /** 先攻减值（仅对敌方） */
    initDebuff?: number;
    /** 攻击加值（对己方） */
    atkBonus?: number;
    /** 命中加值（对己方） */
    hitBonus?: number;
  }>;
  /** 进入战斗前在底部对话框显示的效果文本 */
  dialogueLines: string[];
}

/** 识别教学战斗第一轮的四选一选项 */
function getTutorialOption(action: string): 1 | 2 | 3 | 4 {
  if (/正面迎击|力量/.test(action)) return 1;
  if (/观察弱点|感知|破绽/.test(action)) return 2;
  if (/瑟琳|辅助|法术/.test(action)) return 3;
  return 4; // 闪避/敏捷
}

const YUNLING_SHOP_HINTS = [
  '购买药剂',
  '返回公会登记',
];

const NODE_CHOICE_LIMIT = 3;
const ACTION_OPTION_LIMIT = 4;
const GUILD_INTEL_NODE_HINTS = [
  '前往回声酒馆找萨洛打听三名队友',
  '观察柜台旁的报告单【智力DC12】',
  '说服米娜查看失踪远征队登记册【魅力DC11】',
  '检查委托火漆与公会认证【智力DC10】',
];

const AUTO_SAVE_SLOT: SaveSlotKey = 'auto';
const PHASE_LIMIT_DIRECTIVE = '阶段选择次数已用完。完成本次玩家行动的叙事后，必须立即承接到下一段主线推进，不要继续停留在当前选择阶段，也不要把这条规则写进叙事、任务目标、对话或存档。';

const SCRIPTED_PORTRAIT_OVERRIDES: Record<string, Record<string, string>> = {};

interface MainStoryNodeMeta {
  sceneId: string;
  titleArea: string;
  currentObjective: string;
  completedObjectives: string[];
  update: {
    id: string;
    title: string;
    objective: string;
  };
}

const MAIN_STORY_NODE_META: Record<string, MainStoryNodeMeta> = {
  'guild-final-registration': {
    sceneId: 'guild-final-registration',
    titleArea: '最终公会登记',
    currentObjective: '前往降渊缆梯中枢，完成下潜前安全核验。',
    completedObjectives: ['recruit_full_party', 'register_expedition_party'],
    update: {
      id: 'guild-final-registration',
      title: '第七远征小队登记完成',
      objective: '前往降渊缆梯中枢，完成下潜前安全核验。',
    },
  },
  'elevator-descent': {
    sceneId: 'elevator-descent',
    titleArea: '缆梯垂降途中',
    currentObjective: '固定安全扣，适应垂降并观察下方异常孢光带。',
    completedObjectives: ['recruit_full_party', 'register_expedition_party', 'reach_elevator_hub', 'start_elevator_descent'],
    update: {
      id: 'elevator-descent',
      title: '降渊缆梯启动',
      objective: '固定安全扣，适应垂降并观察下方异常孢光带。',
    },
  },
};

const OPENING_STYLE_SELECTION_LINE = '你在登记页上停下笔，开始确认自己的冒险者流派。';

function getDisplayedStyleName(state: GameState) {
  return String(state.style_name || state.player?.styleName || state.char_class || (state.style_selection_pending ? '待确认流派' : '均衡流'));
}

function getEncounterPrepActions(config: EncounterFlowConfig): BattlePrepChoice[] {
  const introScene = getScriptedScene(config.introSceneId);
  if (Array.isArray(introScene?.battlePrep) && introScene.battlePrep.length) {
    return introScene.battlePrep as BattlePrepChoice[];
  }
  return config.prepActions;
}

function getScriptedPortraitOverride(sceneId: string, speaker: string) {
  const resolvedSpeaker = resolveSpeakerName(speaker);
  return SCRIPTED_PORTRAIT_OVERRIDES[sceneId]?.[resolvedSpeaker];
}

function isOpeningTutorialBattleNode(state: GameState) {
  return Boolean(
    state.tutorial_battle_pending
    || state.currentNodeId === 'opening_tutorial_battle'
    || state.story_test_checkpoint === 'first-choice',
  );
}

function isFirstPlayerChoice(story: StoryLine[], state: GameState) {
  if (!isOpeningTutorialBattleNode(state)) return false;
  if (state.first_choice_resolved || state.tutorial_battle_done) return false;
  if (state.serlin_intro_pending) return false;
  return !story.some((line) => line.role === 'player');
}

function ensureFirstBattleCheck(action: string) {
  if (DC_CHECK_RE.test(action)) return action;
  if (/瑟琳|法术|辅助|光/.test(action)) return `${action}【瑟琳奥秘DC10】`;
  if (/观察|弱点|破绽|侧腹|寻找/.test(action)) return `${action}【感知DC10】`;
  if (/闪避|掩护|躲|绕/.test(action)) return `${action}【敏捷DC10】`;
  return `${action}【力量DC10】`;
}

function diceSucceeded(dice: DiceResult | null) {
  if (!dice) return false;
  if (dice.type === 'attack_roll') return Boolean(dice.data.命中);
  if (dice.type === 'skill_check') return Boolean(dice.data.成功);
  return Number(dice.data.总计 ?? dice.data.结果 ?? 0) >= 10;
}

function getDiceMargin(dice: DiceResult | null) {
  if (!dice) return 0;
  const total = Number(dice.data.总计 ?? dice.data.结果 ?? 0);
  const target = Number(dice.data.DC ?? dice.data.目标AC ?? 10);
  if (!Number.isFinite(total) || !Number.isFinite(target)) return 0;
  return total - target;
}

function hasStateFlag(state: GameState, ...keys: string[]) {
  return keys.some((key) => state[key] === true);
}

type RewardNoticeKind = 'item' | 'document' | 'clue';

interface RewardNotice {
  id: number;
  kind: RewardNoticeKind;
  name: string;
  icon: string;
  image: string;
  quantity?: number;
  summary?: string;
}

function rewardNoticeLabel(kind: RewardNoticeKind) {
  if (kind === 'document') return '获得档案';
  if (kind === 'clue') return '记录线索';
  return '获得物品';
}

function rewardEntryId(entry: any) {
  return String(typeof entry === 'string' ? entry : entry?.id || '').trim();
}

function inventoryCounts(inventoryText: string) {
  const counts = new Map<string, number>();
  inventoryText
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((raw) => {
      const match = raw.match(/^(.+?)(?:x|×)(\d+)$/i);
      const name = (match ? match[1] : raw).trim();
      const quantity = match ? Math.max(1, Number(match[2]) || 1) : 1;
      counts.set(name, (counts.get(name) ?? 0) + quantity);
    });
  return counts;
}

function formatInventoryCounts(counts: Map<string, number>) {
  return Array.from(counts.entries())
    .map(([name, quantity]) => (quantity > 1 ? `${name}x${quantity}` : name))
    .join(',');
}

function addInventoryQuantity(inventoryText: string, itemName: string, quantity: number) {
  const counts = inventoryCounts(inventoryText);
  counts.set(itemName, (counts.get(itemName) ?? 0) + Math.max(1, quantity));
  return formatInventoryCounts(counts);
}

function randomIntInclusive(min: number, max: number) {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

function collectRewardNotices(previous: GameState, next: GameState, nextId: () => number): RewardNotice[] {
  const notices: RewardNotice[] = [];
  const prevInventory = inventoryCounts(String(previous.inventory || ''));
  const nextInventory = inventoryCounts(String(next.inventory || ''));

  nextInventory.forEach((quantity, name) => {
    const delta = quantity - (prevInventory.get(name) ?? 0);
    if (delta > 0) {
      notices.push({
        id: nextId(),
        kind: 'item',
        name,
        icon: 'item',
        image: resolveItemIconPath('item', name),
        quantity: delta,
        summary: getItemSummaryByName(name),
      });
    }
  });

  const prevDocuments = new Set((Array.isArray(previous.documents) ? previous.documents : []).map(rewardEntryId).filter(Boolean));
  (Array.isArray(next.documents) ? next.documents : []).forEach((raw: any) => {
    const id = rewardEntryId(raw);
    if (!id || prevDocuments.has(id)) return;
    notices.push({
      id: nextId(),
      kind: 'document',
      name: String(raw?.name || id),
      icon: String(raw?.icon || 'document'),
      image: resolveItemIconPath(String(raw?.icon || 'document'), String(raw?.name || id)),
      summary: String(raw?.summary || raw?.source || ''),
    });
  });

  const prevClues = new Set((Array.isArray(previous.clues) ? previous.clues : []).map(rewardEntryId).filter(Boolean));
  (Array.isArray(next.clues) ? next.clues : []).forEach((raw: any) => {
    const id = rewardEntryId(raw);
    if (!id || prevClues.has(id)) return;
    const name = String(raw?.name || id);
    const icon = String(raw?.icon || 'clue');
    notices.push({
      id: nextId(),
      kind: 'clue',
      name,
      icon,
      image: resolveItemIconPath(icon, name),
      summary: String(raw?.description || raw?.source || ''),
    });
  });

  return notices.slice(0, 5);
}

function hasClue(state: GameState, clueId: string) {
  const clues = Array.isArray(state.clues) ? state.clues : [];
  return clues.some((clue) => (typeof clue === 'string' ? clue === clueId : clue?.id === clueId));
}

function hasKaiyaPassphrase(state: GameState) {
  const inventoryText = String(state.inventory || '');
  return (
    hasClue(state, 'clue_black_market_password')
    || hasClue(state, 'kaiya_passphrase')
    || inventoryText.includes('凯娅的暗号')
    || inventoryText.includes('黑市暗号纸条')
  );
}

function mergeClues(existing: GameState['clues'], additions: any[] = []) {
  const current = Array.isArray(existing) ? [...existing] : [];
  const seen = new Set(current.map(rewardEntryId).filter(Boolean));
  const unlockedAt = new Date().toISOString();

  additions.forEach((raw) => {
    const id = rewardEntryId(raw);
    if (!id || seen.has(id)) return;
    seen.add(id);
    current.push({
      ...raw,
      unlockedAt: raw?.unlockedAt || unlockedAt,
    });
  });

  return current;
}

function mergeUniqueStrings(existing: unknown, additions: string[]) {
  const result = Array.isArray(existing) ? existing.filter((item): item is string => typeof item === 'string') : [];
  additions.forEach((item) => {
    if (item && !result.includes(item)) result.push(item);
  });
  return result;
}

function mergeQuestUpdates(existing: unknown, update: MainStoryNodeMeta['update']) {
  const result = Array.isArray(existing) ? existing.filter((item) => item && typeof item === 'object') : [];
  if (!result.some((item: any) => item.id === update.id)) {
    result.push({ ...update, createdAt: new Date().toISOString() });
  }
  return result;
}

function getMainStoryMetaForState(state: GameState): MainStoryNodeMeta | null {
  if (state.elevator_descent_started) return MAIN_STORY_NODE_META['elevator-descent'];
  if (state.expedition_registered) return MAIN_STORY_NODE_META['guild-final-registration'];
  const sceneId = String(state.sceneState?.currentScene || '');
  if (sceneId && MAIN_STORY_NODE_META[sceneId]) return MAIN_STORY_NODE_META[sceneId];
  return null;
}

function synchronizeMainStoryState(state: GameState, sceneId?: string): GameState {
  const meta = (sceneId && MAIN_STORY_NODE_META[sceneId]) || getMainStoryMetaForState(state);
  if (!meta) return state;

  const questLog = state.questLog || {};
  const sceneState = state.sceneState || {};
  const visitedScenes = mergeUniqueStrings(sceneState.visitedScenes, [meta.sceneId]);

  return {
    ...state,
    questLog: {
      ...questLog,
      mainQuest: questLog.mainQuest || 'investigate_earthcore_gate',
      currentObjective: meta.currentObjective,
      completedObjectives: mergeUniqueStrings(questLog.completedObjectives, meta.completedObjectives),
      updates: mergeQuestUpdates(questLog.updates, meta.update),
    },
    sceneState: {
      ...sceneState,
      currentScene: meta.sceneId,
      visitedScenes,
    },
  };
}

function getSaveTitleArea(state: GameState) {
  return getMainStoryMetaForState(state)?.titleArea || String(state.current_area || '未知区域');
}

function clampNumber(value: unknown, min: number, max: number, fallback: number) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(min, Math.min(max, Math.round(numeric)));
}

function fallbackAilinRecruitAnswer(playerAnswer: string) {
  const text = playerAnswer.replace(/\s/g, '');
  const positiveWords = ['同伴', '伙伴', '修女', '尊重', '选择', '意愿', '名字', '牺牲', '伤者', '救', '不放弃', '带回', '真相', '恐惧', '心', '孢毒', '同行', '一起', '不是药箱', '不是工具'];
  const negativeWords = ['药箱', '工具', '听命', '闭嘴', '只要治疗', '只需要治疗', '别问', '负担', '拖后腿', '死人没用', '数字', '效率', '浪费时间', '少废话'];
  let score = 50;
  positiveWords.forEach((word) => {
    if (text.includes(word)) score += 7;
  });
  negativeWords.forEach((word) => {
    if (text.includes(word)) score -= 10;
  });
  if (text.length < 8) score -= 12;
  if (text.includes('药箱') && (text.includes('不是') || text.includes('不只是'))) score += 12;
  if (text.includes('名字') && (text.includes('带回') || text.includes('记住'))) score += 10;
  score = clampNumber(score, 0, 100, 50);
  const trustDelta = clampNumber((score - 50) / 5, -10, 10, 0);
  const reply = trustDelta >= 5
    ? '艾琳安静听完，眼神终于柔和了一点。「我听见了。愿你记住今天说过的话，尤其是在下面不得不做艰难决定的时候。」'
    : trustDelta >= 0
      ? '艾琳轻轻点头。「答案不必完美，但我会看你们之后如何对待伤者、死者和还在恐惧里的人。」'
      : '艾琳没有立刻反驳，只是把药箱往身侧收了半寸。「我会同行，因为下面还有人需要帮助。但请别把救治当作可以随意消耗的工具。」';
  return {
    score,
    trust_delta: trustDelta,
    reason: '根据回答对生命、伤者、死者与艾琳主体性的尊重程度结算。',
    reply,
  };
}

function hasDocument(state: GameState, documentId: string) {
  const documents = Array.isArray(state.documents) ? state.documents : [];
  return documents.some((document) => (typeof document === 'string' ? document === documentId : document?.id === documentId));
}

function getForcedCompanionEventId(state: GameState): string | null {
  // Ailin's outpost event is offered as a staging action so the player sees the
  // outpost setup before entering her companion event.
  if (hasStateFlag(state, 'blue_shoal_battle_done', 'completedBlueShoalBattle')
      && !hasStateFlag(state, 'block_echo_forest_done', 'completedBrockSideQuest')) {
    return 'block_echo_forest';
  }
  if (hasStateFlag(state, 'frontline_abandoned_outpost_reached', 'reachedAbandonedForwardPost')
      && !hasStateFlag(state, 'kaiya_broken_seals_done', 'completedKaiyaSideQuest')) {
    return 'kaiya_broken_seals';
  }
  if (state.pre_boss_rest_done && !hasStateFlag(state, 'serin_cracked_silver_staff_done', 'completedSerinSideQuest3')) {
    return 'serin_cracked_silver_staff';
  }
  return null;
}

function buildTutorialBattleSetup(dice: DiceResult | null, playerAction: string): TutorialBattleSetup {
  const option = getTutorialOption(playerAction);
  const success = diceSucceeded(dice);
  const isCrit = dice?.data?.大成功 === true;
  const isFumble = dice?.data?.大失败 === true;
  // 大成功数值翻倍，大失败/失败无增益
  const effective = (isCrit ? true : isFumble ? false : success);
  const mult = isCrit ? 2 : 1;
  const rollText = dice
    ? `D20判定总计 ${dice.data.总计 ?? dice.data.结果 ?? '?'}`
    : '未取得明确骰点';

  const ENEMIES = ['tutorial-crawler-a', 'tutorial-crawler-b', 'tutorial-crawler-c'];
  const ALLIES = ['tutorial-adventurer', 'ally-selin'];

  // ---- 选项1: 正面迎击 → 所有敌人 -6HP ----
  if (option === 1) {
    const hpLoss = effective ? 6 * mult : 0;
    const label = isCrit ? '开局大成功' : effective ? '开局成功' : '开局判定未通过';
    const suffix = effective ? `（${isCrit ? '大成功，伤害翻倍' : '成功'}，敌人HP-${hpLoss}）` : '（无增益）';
    return {
      dialogueLines: [`${label}：正面迎击！${rollText}。${effective ? `裂隙爬兽被你的冲锋撞翻，每只损失 ${hpLoss} 点生命值。` : '裂隙爬兽比你预想中更敏捷，擦身躲开了你的冲锋。'}${suffix}`],
      openingEffects: ENEMIES.map((uid) => ({
        unitId: uid,
        hpDelta: -hpLoss,
        statuses: effective ? ['受创'] : [],
        traits: [`开局迎击：HP${effective ? ` -${hpLoss}` : ' 不变'}`],
        log: `${label}：${rollText}。${effective ? `裂隙爬兽被冲锋撞翻，HP-${hpLoss}。` : '裂隙爬兽闪过冲锋，未受伤。'}`,
      })),
    };
  }

  // ---- 选项2: 观察弱点 → 敌人 -4HP + 先攻 -4 ----
  if (option === 2) {
    const hpLoss = effective ? 4 * mult : 0;
    const initDebuff = effective ? 4 * mult : 0;
    const label = isCrit ? '开局大成功' : effective ? '开局成功' : '开局判定未通过';
    const suffix = effective ? `（${isCrit ? '大成功，数值翻倍' : '成功'}，敌人HP-${hpLoss}，先攻-${initDebuff}）` : '（无增益）';
    return {
      dialogueLines: [`${label}：观察弱点！${rollText}。${effective ? `你精准捕捉到爬兽腹侧软甲的间隙——每只损失 ${hpLoss} 点生命值，先攻额外 -${initDebuff}。` : '你试图寻找破绽，但爬兽移动太快，没能锁定软肋位置。'}${suffix}`],
      openingEffects: ENEMIES.map((uid) => ({
        unitId: uid,
        hpDelta: -hpLoss,
        initDebuff: -initDebuff,
        statuses: effective ? ['软肋暴露'] : [],
        traits: [`弱点暴露：HP${hpLoss ? ` -${hpLoss}` : ' 不变'}，先攻${initDebuff ? ` -${initDebuff}` : ' 不变'}`],
        log: `${label}：${rollText}。${effective ? `软肋被锁定，裂隙爬兽HP-${hpLoss}，先攻-${initDebuff}。` : '未能锁定弱点，敌人未受影响。'}`,
      })),
    };
  }

  // ---- 选项3: 请求瑟琳 → 我方攻击+2 命中+2 ----
  if (option === 3) {
    const bonus = effective ? 2 * mult : 0;
    const label = isCrit ? '大成功' : effective ? '成功' : '判定未通过';
    const suffix = effective ? `（${isCrit ? '大成功，增益翻倍' : '成功'}，攻击点数+${bonus}，命中骰+${bonus}）` : '（无增益）';
    return {
      dialogueLines: [`瑟琳${label}！${rollText}。${effective ? `银杖泛起寒光，时间涟漪短暂凝固了所有人的动作——我方全体攻击点数 +${bonus}，命中骰结果 +${bonus}。` : '瑟琳抬起银杖，但裂隙爬兽的嘶吼打断了她的专注，法术未能成型。'}${suffix}`],
      openingEffects: ALLIES.map((uid) => ({
        unitId: uid,
        atkBonus: bonus,
        hitBonus: bonus,
        traits: effective ? [`瑟琳时间支援：攻击+${bonus}，命中+${bonus}`] : [],
        log: `${label}：${rollText}。${effective ? `瑟琳时间法术生效，攻击+${bonus}，命中+${bonus}。` : '瑟琳法术未生效。'}`,
      })),
    };
  }

  // ---- 选项4: 闪避 → 我方AC+2 ----
  const acBuff = effective ? 2 * mult : 0;
  const label = isCrit ? '大成功' : effective ? '成功' : '判定未通过';
  const suffix = effective ? `（${isCrit ? '大成功，增益翻倍' : '成功'}，AC+${acBuff}）` : '（无增益）';
  return {
    dialogueLines: [`闪避${label}！${rollText}。${effective ? `你压低身形滑入吊箱阴影，连带着瑟琳也找到了合适掩体——我方全体 AC +${acBuff}。` : '你试图寻找掩体，但补给平台太过狭窄，没能找到合适位置。'}${suffix}`],
    openingEffects: ALLIES.map((uid) => ({
      unitId: uid,
      acDelta: acBuff,
      traits: effective ? [`闪避掩体：AC+${acBuff}`] : [],
      log: `${label}：${rollText}。${effective ? `闪避成功，AC+${acBuff}。` : '闪避未成功，AC不变。'}`,
    })),
  };
}

function linearRecruitmentHints(state: GameState): string[] {
  if (state.kaiya_passphrase_pending) return [];

  // 远征队已登记完成：跳过所有招募阶段，直接进入后续流程
  if (state.expedition_registered) {
    // 统一由场景级 hints 接管（掉缆梯/孢海等）
    return [];
  }

  if (isOpeningTutorialBattleNode(state) && !state.tutorial_battle_done && !state.first_choice_resolved) {
    return [
      '正面迎击裂隙爬兽【力量DC10】',
      '观察弱点寻找破绽【感知DC10】',
      '请求瑟琳施展辅助法术【魅力DC12】',
      '闪避并寻找掩护位置【敏捷DC10】',
    ];
  }

  if (state.tutorial_battle_done && !state.guild_registered) {
    return [
      '前往冒险者公会登记',
      '查看吊箱封条【智力DC12】',
      '询问瑟琳这些魔物为什么怕光【智力DC13】',
    ];
  }

  if (state.guild_registered && !state.salo_intel_done) {
    const area = String(state.current_area || '');
    if (area.includes('酒馆')) {
      return state.tavern_dice_done
        ? ['听萨洛说明三名队友的位置', '领取萨洛的情报卡片', '查看酒馆布告栏【智力DC10】', '和瑟琳讨论远征路线']
        : ['和萨洛玩一局快艇骰子', '先在酒馆里转转再说', '查看酒馆布告栏【智力DC10】'];
    }
    return hasClue(state, 'expedition_saw_spore_beasts')
      ? [GUILD_INTEL_NODE_HINTS[0], '追问书记员报告中的孢化地底兽', ...GUILD_INTEL_NODE_HINTS.slice(1)].slice(0, 4)
      : GUILD_INTEL_NODE_HINTS;
  }

  if (state.salo_intel_done && !state.al_recruited) {
    return [
      '前往静默神殿寻找艾琳',
      '询问萨洛艾琳最近在照顾谁【感知DC12】',
      '和瑟琳确认招募顺序',
    ];
  }

  if (state.al_recruited && !state.brock_recruited) {
    const area = String(state.current_area || '');
    if (area.includes('神殿') || area.includes('教堂')) {
      return [
        '回到回声酒馆找布洛克',
        '请求艾琳翻阅牺牲者遗录【感知DC12】',
        '请艾琳展示白枝修会巡礼经文',
        '让艾琳疗伤【感知DC12】',
      ];
    }
    if (area.includes('酒馆') && state.brock_intro_seen) {
      return [
        '陪布洛克喝得尽兴',
        '询问布洛克需要采集哪种孢子样本【感知DC12】',
        '向萨洛确认布洛克的报酬行情【感知DC12】',
      ];
    }
    return [
      '回到回声酒馆找布洛克',
      '整理艾琳加入后的队伍分工',
      '向瑟琳确认布洛克的入队条件',
    ];
  }

  if (state.brock_recruited && !state.kaiya_recruited) {
    const area = String(state.current_area || '');
    if (area.includes('黑市') || area.includes('补给市场') || area.includes('市场')) {
      return [
        '购买奥兰的幸运盲盒',
        '趁奥兰开暗格查看盲盒账本【感知DC13】',
        '和凯娅确认她能处理的陷阱类型【敏捷DC13】',
      ];
    }
    return [
      '前往黑市寻找凯娅',
      '询问布洛克黑市附近的路况【感知DC12】',
      '和瑟琳确认米娜给出的暗号',
    ];
  }

  if (state.kaiya_recruited && state.tavern_yunling_unlocked && !state.yunling_shop_unlocked && !state.yunling_met) {
    return ['根据萨洛额外情报寻找云苓', '整理下孢海前的药剂需求', '询问凯娅黑市深处的药剂商【智力DC12】'];
  }

  // 云苓商店已开放，尚未完成购买 → 显示入口选项
  if (state.kaiya_recruited && state.yunling_shop_unlocked && state.yunling_met && !state.expedition_registered) {
    return ['购买药剂', '返回公会登记'];
  }

  if (state.kaiya_recruited && !state.expedition_registered) {
    return ['返回冒险者公会找赫尔曼正式登记小队', '整理五人队伍分工', '让瑟琳核对远征许可清单'];
  }

  const arrivedSporeOutpost = hasStateFlag(state, 'spore_outpost_reached', 'spore_outpost_arrived', 'arrivedSporeOutpost');
  const ailinSideDone = hasStateFlag(state, 'ailin_wounded_names_done', 'completedAilinSideQuest');
  const blueShoalDone = hasStateFlag(state, 'blue_shoal_battle_done', 'completedBlueShoalBattle');
  const brockSideDone = hasStateFlag(state, 'block_echo_forest_done', 'completedBrockSideQuest');
  const forwardPostReached = hasStateFlag(state, 'frontline_abandoned_outpost_reached', 'reachedAbandonedForwardPost');
  const kaiyaSideDone = hasStateFlag(state, 'kaiya_broken_seals_done', 'completedKaiyaSideQuest');
  const boneMarshDone = hasStateFlag(state, 'bone_marsh_battle_done', 'completedBoneMarshBattle');
  const serinSideDone = hasStateFlag(state, 'serin_cracked_silver_staff_done', 'completedSerinSideQuest3');
  const bossDone = hasStateFlag(state, 'boss_defeated', 'bossDefeated');

  if (state.expedition_registered && arrivedSporeOutpost && !ailinSideDone && !state.ailin_request_ignored) {
    return ['陪艾琳去伤员棚确认污染情况', '向尼布索要巡逻日志【魅力DC11】', '检查据点补给箱【智力DC12】', '整理阵亡者木牌与伤员名册【智力DC13】'];
  }
  if (state.expedition_registered && arrivedSporeOutpost && state.ailin_request_ignored && !blueShoalDone) {
    return ['前往蓝伞浅滩', '留意浅滩边缘的巡逻队遗物【感知DC14】', '确认蓝伞浅滩安全路线【感知DC13】'];
  }

  if (ailinSideDone && !blueShoalDone) {
    return ['前往蓝伞浅滩', '留意浅滩边缘的巡逻队遗物【感知DC14】', '确认蓝伞浅滩安全路线【感知DC13】', '让艾琳评估队伍污染状态'];
  }

  if (blueShoalDone && !brockSideDone) {
    return ['跟随布洛克调查回声菌林', '听布洛克解释呼救声规律【感知DC13】', '协助布洛克配置净化粉【感知DC14】', '让艾琳评估菌林污染风险'];
  }

  if (brockSideDone && !forwardPostReached) {
    return ['前往前线废弃据点', '调查旧远征标记【智力DC13】', '检查沿途旧路标【智力DC12】', '让布洛克追踪污染痕迹【感知DC13】'];
  }

  if (forwardPostReached && !kaiyaSideDone) {
    return ['让凯娅检查少了两个封扣', '识别补给箱中的黑石污染【智力DC14】', '检查补给箱封扣与锁痕【智力DC12】', '让凯娅判断暗道机关【敏捷DC13】'];
  }

  if (kaiyaSideDone && !boneMarshDone) {
    return ['前往骨柱湿地', '搜索废弃装备袋中的怪物图鉴【感知DC14】', '确认骨柱湿地的怪物活动【感知DC13】', '追踪拖拽痕迹前往骨柱湿地【感知DC13】'];
  }

  if (state.rhein_encounter_started && typeof state.helpedRhein !== 'boolean') {
    return ['帮助莱因', '记录莱因断片证言【医疗DC12】', '无视莱因，继续前进'];
  }

  if (state.pre_boss_rest_done && !serinSideDone) {
    return ['和瑟琳交谈', '检查瑟琳银杖裂痕', '让瑟琳分析黑石脉冲规律【智力DC14】'];
  }

  if (serinSideDone && !bossDone) {
    return ['进入黑石根区深处', '确认队伍Boss战前状态', '让瑟琳分析黑石脉冲规律【智力DC14】'];
  }

  if (state.core_choice_pending && !state.bossCoreChoice) {
    return ['破坏核心，强行开路', '稳定核心，保留封印'];
  }

  return [];
}

interface ActionNodeConfig {
  id: string;
  hints: string[];
  mainHint: string;
}

function getActiveActionNode(state: GameState): ActionNodeConfig | null {
  const area = String(state.current_area || '');
  if (state.guild_registered && !state.salo_intel_done && !area.includes('酒馆')) {
    return {
      id: 'guild_intel',
      hints: GUILD_INTEL_NODE_HINTS,
      mainHint: GUILD_INTEL_NODE_HINTS[0],
    };
  }
  return null;
}

function normalizeNodeAction(text: string) {
  return text
    .replace(/[【\[].*?[】\]]/g, '')
    .replace(/[，,。.!！?？；;：:\s]/g, '')
    .trim();
}

function nodeChoiceStateKey(nodeId: string) {
  return `node_${nodeId}_used_choices`;
}

function nodeChoiceCountKey(nodeId: string) {
  return `node_${nodeId}_choice_count`;
}

function choiceStageKey(stageId: string, suffix: 'used_choices' | 'choice_count') {
  return `choice_${normalizeNodeAction(stageId).slice(0, 80)}_${suffix}`;
}

function readNodeUsedChoices(state: GameState, nodeId: string) {
  const raw = state[nodeChoiceStateKey(nodeId)];
  if (Array.isArray(raw)) return raw.map((item) => String(item));
  if (typeof raw === 'string') return raw.split('|').map((item) => item.trim()).filter(Boolean);
  return [];
}

function readChoiceStageUsedChoices(state: GameState, stage: ActionNodeConfig) {
  const raw = state[stage.id === 'guild_intel' ? nodeChoiceStateKey(stage.id) : choiceStageKey(stage.id, 'used_choices')];
  if (Array.isArray(raw)) return raw.map((item) => String(item));
  if (typeof raw === 'string') return raw.split('|').map((item) => item.trim()).filter(Boolean);
  return [];
}

function choiceStageCountKey(stage: ActionNodeConfig) {
  return stage.id === 'guild_intel' ? nodeChoiceCountKey(stage.id) : choiceStageKey(stage.id, 'choice_count');
}

function choiceStageUsedKey(stage: ActionNodeConfig) {
  return stage.id === 'guild_intel' ? nodeChoiceStateKey(stage.id) : choiceStageKey(stage.id, 'used_choices');
}

function findNodeHint(action: string, node: ActionNodeConfig) {
  const actionKey = normalizeNodeAction(action);
  return node.hints.find((hint) => normalizeNodeAction(hint) === actionKey) || null;
}

function isNodeMainAction(action: string, node: ActionNodeConfig, matchedHint: string | null) {
  if (matchedHint && normalizeNodeAction(matchedHint) === normalizeNodeAction(node.mainHint)) return true;
  if (node.id === 'guild_intel') return /前往.*回声酒馆|去.*酒馆|回声酒馆找萨洛|找.*萨洛/.test(action);
  return normalizeNodeAction(action) === normalizeNodeAction(node.mainHint);
}

function actionChoiceRouteKey(state: GameState) {
  const area = String(state.current_area || state.currentNodeId || 'unknown');
  if (state.guild_registered && !state.salo_intel_done) return area.includes('酒馆') ? 'salo_intel_tavern' : 'guild_intel';
  if (state.salo_intel_done && !state.al_recruited) return 'recruit_ailin';
  if (state.al_recruited && !state.brock_recruited) return 'recruit_brock';
  if (state.brock_recruited && !state.kaiya_recruited) return 'recruit_kaiya';
  if (state.kaiya_recruited && !state.expedition_registered) return 'register_expedition';
  const atSporeOutpost = hasStateFlag(state, 'spore_outpost_reached', 'spore_outpost_arrived', 'arrivedSporeOutpost');
  if (state.expedition_registered && atSporeOutpost && !hasStateFlag(state, 'ailin_wounded_names_done', 'completedAilinSideQuest')) return 'spore_outpost_ailin';
  if (hasStateFlag(state, 'ailin_wounded_names_done', 'completedAilinSideQuest') && !hasStateFlag(state, 'blue_shoal_battle_done', 'completedBlueShoalBattle')) return 'blue_shoal_route';
  if (hasStateFlag(state, 'blue_shoal_battle_done', 'completedBlueShoalBattle') && !hasStateFlag(state, 'block_echo_forest_done', 'completedBrockSideQuest')) return 'echo_grove_brock';
  if (hasStateFlag(state, 'block_echo_forest_done', 'completedBrockSideQuest') && !hasStateFlag(state, 'frontline_abandoned_outpost_reached', 'reachedAbandonedForwardPost')) return 'frontline_outpost';
  if (hasStateFlag(state, 'frontline_abandoned_outpost_reached', 'reachedAbandonedForwardPost') && !hasStateFlag(state, 'kaiya_broken_seals_done', 'completedKaiyaSideQuest')) return 'kaiya_seals';
  if (hasStateFlag(state, 'kaiya_broken_seals_done', 'completedKaiyaSideQuest') && !hasStateFlag(state, 'bone_marsh_battle_done', 'completedBoneMarshBattle')) return 'bone_marsh_route';
  if (state.rhein_encounter_started && typeof state.helpedRhein !== 'boolean') return 'rhein_choice';
  if (state.pre_boss_rest_done && !hasStateFlag(state, 'serin_cracked_silver_staff_done', 'completedSerinSideQuest3')) return 'serin_rest';
  if (hasStateFlag(state, 'serin_cracked_silver_staff_done', 'completedSerinSideQuest3') && !hasStateFlag(state, 'boss_defeated', 'bossDefeated')) return 'blackstone_root';
  return area;
}

function uniqueHints(hints: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  hints.forEach((hint) => {
    const key = normalizeNodeAction(hint);
    if (!key || seen.has(key)) return;
    seen.add(key);
    result.push(hint);
  });
  return result;
}

function getActionChoiceStage(state: GameState, hints: string[]): ActionNodeConfig | null {
  if (state.ailin_answer_pending) return null;
  if (state.kaiya_passphrase_pending) return null;
  const node = getActiveActionNode(state);
  if (node) return node;
  if (state.core_choice_pending && !state.bossCoreChoice) return null;
  if (!hints.length) return null;
  const mainHint = hints[0];
  return {
    id: `stage_${actionChoiceRouteKey(state)}`,
    hints,
    mainHint,
  };
}

function isOpeningChoiceStage(stage: ActionNodeConfig | null) {
  if (!stage) return false;
  return stage.hints.some((hint) => /裂隙爬兽|观察弱点寻找破绽|请求瑟琳施展辅助法术|闪避并寻找掩护位置/.test(hint));
}

function choiceLimitForStage(state: GameState, stage: ActionNodeConfig | null) {
  if (isOpeningChoiceStage(stage) && isOpeningTutorialBattleNode(state) && !state.tutorial_battle_done && !state.first_choice_resolved) {
    return 1;
  }
  // 云苓商店阶段：只能选择一次（买药或回公会登记）
  if (stage && stage.hints.includes('购买药剂') && stage.hints.some((h) => /返回公会登记/.test(h))) {
    return 1;
  }
  // 蓝伞浅滩战斗前选择阶段：只有1次行动机会，选择后通过旁白进入战斗
  if (stage && stage.hints.some((h) => /前往蓝伞浅滩/.test(h)) && stage.hints.some((h) => /判断前方风向|确认旧巡逻路线/.test(h))) {
    return 1;
  }
  return NODE_CHOICE_LIMIT;
}

function forcedSceneForChoiceStage(stage: ActionNodeConfig | null) {
  if (stage?.id === 'guild_intel') return getScriptedScene('tavern-intro');
  // 蓝伞浅滩战斗前：选择次数用完后，自动播放旁白过渡剧情，然后进入战斗
  if (stage && stage.hints.some((h) => /前往蓝伞浅滩/.test(h)) && stage.hints.some((h) => /判断前方风向|确认旧巡逻路线/.test(h))) {
    return getScriptedScene('enter-blue-shoal');
  }
  return null;
}

function withStageLimitDirective(action: string, nextAction: string) {
  return `${action}\n[DIRECTIVE:stage_limit:{"rule":"${PHASE_LIMIT_DIRECTIVE}","nextAction":"${nextAction}"}]`;
}

function sanitizeStoryForSave(lines: StoryLine[]) {
  return lines
    .map((line) => ({ ...line, text: stripMachineProtocolText(line.text) }))
    .filter((line) => line.text.trim());
}

function sanitizeSuggestionsForSave(items: ActionSuggestion[]) {
  return items
    .map((item) => ({
      ...item,
      label: stripMachineProtocolText(item.label),
      text: stripMachineProtocolText(item.text),
    }))
    .filter((item) => item.label.trim() && item.text.trim());
}

function filterNodeSuggestions(state: GameState, hints: string[]) {
  const node = getActionChoiceStage(state, hints);
  if (!node) return hints;

  const used = new Set(readChoiceStageUsedChoices(state, node));
  const count = Number(state[choiceStageCountKey(node)] ?? used.size);
  const choiceLimit = choiceLimitForStage(state, node);
  const mainKey = normalizeNodeAction(node.mainHint);
  const sourceHints = uniqueHints(hints.length ? hints : node.hints);
  const filtered = sourceHints.filter((hint) => {
    const key = normalizeNodeAction(hint);
    if (count >= choiceLimit) return key === mainKey;
    return key === mainKey || !used.has(key);
  });

  if (!filtered.some((hint) => normalizeNodeAction(hint) === mainKey)) {
    filtered.unshift(node.mainHint);
  }
  if (filtered.length) return uniqueHints(filtered).slice(0, count >= choiceLimit ? 1 : ACTION_OPTION_LIMIT);
  return [node.mainHint];
}

function constrainActionSuggestions(state: GameState, incoming: ActionSuggestion[] = []) {
  if (state.ailin_answer_pending) return [];
  if (state.serlin_intro_pending) return [];
  if (state.kaiya_passphrase_pending) return [];
  const linearHints = linearRecruitmentHints(state);
  if (linearHints.length) return makeSuggestions(filterNodeSuggestions(state, linearHints));
  const hints = incoming.length ? incoming.map((item) => item.text || item.label) : fallbackSuggestions(state).map((item) => item.text);
  return makeSuggestions(filterNodeSuggestions(state, hints));
}

function actionChoiceStatusText(state: GameState, visibleSuggestions: ActionSuggestion[]) {
  if (state.ailin_answer_pending) {
    return '回答艾琳的问题：本次只能通过自由输入行动，回答后艾琳仍会入队，但会影响信任度';
  }

  if (state.kaiya_passphrase_pending) {
    if (state.kaiya_passphrase_failed) {
      return '暗号不对。请再次输入凯娅的暗号，输入正确才会推进剧情';
    }
    return '输入凯娅的暗号：本次只能通过自由输入行动';
  }

  const hints = visibleSuggestions.map((item) => item.text || item.label).filter(Boolean);
  const stage = getActionChoiceStage(state, hints);
  if (!stage) return '';
  const used = readChoiceStageUsedChoices(state, stage);
  const count = Number(state[choiceStageCountKey(stage)] ?? used.length);
  const choiceLimit = choiceLimitForStage(state, stage);
  if (count >= choiceLimit) {
    return `选择行动：已完成 ${choiceLimit}/${choiceLimit} 次，下一次将推进剧情`;
  }
  return `选择行动：第 ${count + 1}/${choiceLimit} 次，同一选项不可重复选择，自由输入也会计入次数`;
}

function getLinearRouteBlock(action: string, state: GameState): { message: string; hints: string[] } | null {
  if (!state.guild_registered || state.expedition_registered) return null;

  const wantsTemple = /前往静默神殿|去静默神殿|前往教堂|去教堂|寻找艾琳|找艾琳/.test(action);
  const wantsBrock = /回声酒馆.*布洛克|寻找布洛克|找布洛克|布洛克.*喝|喝酒|喝得尽兴/.test(action);
  const wantsMarket = /前往黑市|去黑市|寻找凯娅|找凯娅|幸运盲盒|盲盒|奥兰/.test(action);
  const wantsGuildRegistration = /正式登记|登记小队|找赫尔曼|返回冒险者公会|回公会|前往冒险者公会|去公会/.test(action);
  const wantsSalo = /回声酒馆|酒馆|萨洛|快艇骰子|骰局/.test(action);

  if (!state.salo_intel_done) {
    if (wantsTemple || wantsBrock || wantsMarket) {
      return {
        message: '瑟琳：「先去回声酒馆找萨洛。我们还不知道三名队友的具体位置和条件，现在乱跑只会把时间浪费在悬城的岔路里。」',
        hints: linearRecruitmentHints(state),
      };
    }
    return null;
  }

  if (!state.al_recruited) {
    if (wantsBrock || wantsMarket || wantsGuildRegistration) {
      return {
        message: '瑟琳：「顺序不能乱。先去静默神殿找艾琳，队伍需要稳定的治疗和净化准备，然后再谈布洛克和凯娅。」',
        hints: linearRecruitmentHints(state),
      };
    }
    return null;
  }

  if (!state.brock_recruited) {
    if (wantsMarket || wantsGuildRegistration || (wantsTemple && !String(state.current_area || '').includes('神殿'))) {
      return {
        message: '瑟琳：「艾琳已经加入了。下一站是回声酒馆找布洛克，不要提前去黑市，凯娅的条件要等布洛克入队后再处理。」',
        hints: linearRecruitmentHints(state),
      };
    }
    return null;
  }

  if (!state.kaiya_recruited) {
    if (wantsTemple || wantsBrock || wantsGuildRegistration || (wantsSalo && !String(state.current_area || '').includes('酒馆'))) {
      return {
        message: '瑟琳：「布洛克已经点头了。现在去黑市找凯娅，米娜给的暗号该派上用场了。」',
        hints: linearRecruitmentHints(state),
      };
    }
    return null;
  }

  if (!state.expedition_registered && (wantsTemple || wantsBrock || wantsMarket || wantsSalo)) {
    if (state.tavern_yunling_unlocked && !state.yunling_met && /云苓|药剂商|黑市深处/.test(action)) return null;
    return {
      message: '瑟琳：「人已经齐了。先回冒险者公会找赫尔曼正式登记小队，领完许可和物资再下缆梯。」',
      hints: linearRecruitmentHints(state),
    };
  }

  return null;
}

function fallbackSuggestions(state: GameState): ActionSuggestion[] {
  const linearHints = linearRecruitmentHints(state);
  if (linearHints.length) return makeSuggestions(linearHints);

  const area = String(state.current_area || '');
  if (area.includes('酒馆')) {
    if (state.brock_intro_seen && !state.brock_recruited) {
      return makeSuggestions(['陪布洛克喝得尽兴', '查看酒馆布告栏【智力DC10】', '询问布洛克需要采集哪种孢子样本【感知DC12】', '向萨洛确认布洛克的报酬行情【感知DC12】']);
    }
    if (state.tavern_dice_done && !state.salo_intel_done) {
      return makeSuggestions(['听萨洛说明三名队友的位置', '领取萨洛的情报卡片', '查看酒馆布告栏【智力DC10】', '和瑟琳讨论远征路线']);
    }
    return makeSuggestions(['接受游戏', '付100G购买萨洛的情报', '查看酒馆布告栏【智力DC10】']);
  }
  if (area.includes('公会')) {
    const guildHints = ['观察柜台旁的报告单【智力DC12】', '说服米娜查看失踪远征队登记册【魅力DC11】', '检查委托火漆与公会认证【智力DC10】'];
    if (hasClue(state, 'expedition_saw_spore_beasts')) {
      guildHints.unshift('追问书记员报告中的孢化地底兽');
    }
    if (!hasDocument(state, 'helman_personal_note')) {
      guildHints.push('趁赫尔曼离开时检查办公桌【敏捷DC14】');
    }
    return makeSuggestions(guildHints.slice(0, 4));
  }
  if (area.includes('神殿') || area.includes('教堂')) {
    return makeSuggestions(['请求艾琳翻阅牺牲者遗录【感知DC12】', '请艾琳展示白枝修会巡礼经文', '为战士祈祷']);
  }
  if (area.includes('黑市') || area.includes('市场')) {
    return makeSuggestions(['趁奥兰开暗格查看盲盒账本【感知DC13】', '向凯娅索要黑市暗道草图【智力DC14】', '向云苓询问远征队用药记录']);
  }
  if (area.includes('缆梯') || area.includes('降渊')) {
    return makeSuggestions(['观察缆梯检修记录【智力DC10】', '检查发光铆钉尽头【智力DC12】', '和瑟琳确认下降风险']);
  }
  if (area.includes('孢海') || area.includes('菌林') || area.includes('湿地')) {
    if (area.includes('据点')) {
      return makeSuggestions(['向尼布索要巡逻日志【魅力DC11】', '检查据点补给箱【智力DC12】', '查看孢子海浅层地图']);
    }
    if (area.includes('菌林')) {
      return makeSuggestions(['让布洛克展示孢海生态笔记【感知DC14】', '谨慎探查周围【感知DC14】', '让凯娅检查陷阱【敏捷DC15】']);
    }
    if (area.includes('湿地')) {
      return makeSuggestions(['搜索废弃装备袋中的怪物图鉴【感知DC14】', '记录莱因断片证言【医疗DC12】', '谨慎探查周围【感知DC14】']);
    }
    return makeSuggestions(['留意浅滩边缘的巡逻队遗物【感知DC14】', '谨慎探查周围【感知DC14】', '让布洛克辨识真菌生态【感知DC13】']);
  }
  if (area.includes('废弃据点')) {
    return makeSuggestions(['调查旧远征标记【智力DC13】', '识别墙体中的黑石污染【智力DC14】', '让凯娅判断暗道机关【敏捷DC13】']);
  }
  if (area.includes('黑石') || area.includes('黑暗之门')) {
    return makeSuggestions(['让瑟琳分析黑石脉冲规律【智力DC14】', '记录莱因断片证言【医疗DC12】', '确认队伍Boss战前状态']);
  }
  return makeSuggestions(['前往冒险者公会登记', '在逆穹悬城探索打听情报【感知DC12】', '与瑟琳讨论远征计划【魅力DC12】']);
}

function normalizeStoryLines(lines: StoryLine[]): StoryLine[] {
  let nextId = 1;
  let lastDialogueSpeaker = '';
  const normalized: StoryLine[] = [];

  (Array.isArray(lines) ? lines : [])
    .filter((line) => line && typeof line.text === 'string' && line.text.trim())
    .forEach((line) => {
      const rawId = Number(line.id);
      const id = Number.isFinite(rawId) && rawId > 0 ? rawId : nextId;
      nextId = Math.max(nextId, id + 1);
      const role = line.role === 'player' || line.role === 'system' ? line.role : 'kp';
      const text = stripAllMachineProtocolText(line.text);
      if (!text) return;
      const previousLine = normalized[normalized.length - 1];
      const previousText = previousLine?.text.trim() ?? '';
      const isDialogue = /^[""「]/.test(text.trim());
      let speaker = resolveSpeakerName(line.speaker || '主持人') || '主持人';

      if (role === 'kp' && isDialogue) {
        const previousNamedSpeaker = findRegisteredSpeaker(previousText, true);
        const pronounContinuesPrevious = Boolean(lastDialogueSpeaker && /^(他们|她们|它们|他|她|它)/.test(previousText));
        const contextSpeaker = previousNamedSpeaker || (pronounContinuesPrevious ? lastDialogueSpeaker : '');
        if (contextSpeaker && (speaker === '主持人')) {
          speaker = contextSpeaker;
        }
      }

      if (role === 'kp' && isDialogue && speaker !== '主持人') {
        lastDialogueSpeaker = speaker;
      }

      normalized.push({
        id,
        role,
        speaker,
        text,
        portrait: typeof line.portrait === 'string' ? line.portrait : undefined,
        bgImage: typeof line.bgImage === 'string' ? line.bgImage : undefined,
        bgm: typeof line.bgm === 'string' ? line.bgm : undefined,
        scriptedSceneId: typeof line.scriptedSceneId === 'string' ? line.scriptedSceneId : undefined,
      });
    });

  return normalized;
}

function findInheritedBgImage(story: StoryLine[], activeIndex: number) {
  const end = Math.min(Math.max(activeIndex, 0), Math.max(story.length - 1, 0));
  for (let index = end; index >= 0; index -= 1) {
    const bgImage = story[index]?.bgImage;
    if (typeof bgImage === 'string' && bgImage.trim()) return bgImage;
  }
  return null;
}

import { OpeningActionTutorial, OPENING_ACTION_TUTORIAL } from './components/OpeningActionTutorial';

const SERLIN_INTRO_TUTORIAL = [
  {
    title: 'AI 互动教程：自我介绍',
    body: '接下来，你将用文字向瑟琳介绍自己。\n\nAI 会根据你的描述判断瑟琳对你的第一印象，并给予 0~10 点信任值提升。\n\n你可以写自己的经历、性格、行事方式，或接下委托的理由。\n瑟琳更认可成熟稳重、有责任感、重视团队和风险意识的人。\n\n你的介绍没有标准答案，但会被记录进角色档案，并影响后续部分对话与剧情反馈。',
    badge: '瑟琳',
  },
];

interface AudioSettingsModalProps {
  open: boolean;
  bgmVolume: number;
  sfxVolume: number;
  onBgmVolumeChange: (value: number) => void;
  onSfxVolumeChange: (value: number) => void;
  onClose: () => void;
}

function AudioSettingsModal({
  open,
  bgmVolume,
  sfxVolume,
  onBgmVolumeChange,
  onSfxVolumeChange,
  onClose,
}: AudioSettingsModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="audio-settings-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.section
            className="audio-settings-modal"
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="audio-settings-header">
              <span>设置</span>
              <button type="button" onClick={onClose} aria-label="关闭设置">×</button>
            </header>

            <label className="audio-setting-row">
              <span>背景音乐</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={bgmVolume}
                onChange={(event) => onBgmVolumeChange(Number(event.currentTarget.value))}
              />
              <b>{Math.round(bgmVolume * 100)}%</b>
            </label>

            <label className="audio-setting-row">
              <span>音效</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={sfxVolume}
                onChange={(event) => onSfxVolumeChange(Number(event.currentTarget.value))}
              />
              <b>{Math.round(sfxVolume * 100)}%</b>
            </label>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

class ErrorBoundary extends Component<{ children: ReactNode; fallback?: string }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, color: "#f0a0a0", background: "#1a0a0a", minHeight: "100vh", fontFamily: "monospace" }}>
          <h2 style={{ color: "#d36363" }}>⚠ 渲染崩溃</h2>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 14, marginTop: 16 }}>{this.state.error.message}</pre>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 12, color: "#888", marginTop: 8 }}>{this.state.error.stack?.slice(0, 600)}</pre>
          <button onClick={() => this.setState({ error: null })} style={{ marginTop: 20, padding: "8px 20px" }}>重试</button>
        </div>
      );
    }
    return this.props.children;
  }
}

type ScriptedLineLike = { speaker: string; text: string; portrait?: string; bgImage?: string; bgm?: string };

function getPreDescentTrustLines(state: GameState): ScriptedLineLike[] {
  const trust = {
    serin: getCompanionTrust(state, 'serin'),
    ailin: getCompanionTrust(state, 'ailin'),
    brock: getCompanionTrust(state, 'brock'),
    kaiya: getCompanionTrust(state, 'kaiya'),
  };
  const average = Math.round((trust.serin + trust.ailin + trust.brock + trust.kaiya) / 4);
  const lines: ScriptedLineLike[] = [
    {
      speaker: '主持人',
      text: `缆梯铁门闭合前，队伍短暂安静下来。此刻的同伴信任：瑟琳${trust.serin}（${getTrustTier(trust.serin)}）、艾琳${trust.ailin}（${getTrustTier(trust.ailin)}）、布洛克${trust.brock}（${getTrustTier(trust.brock)}）、凯娅${trust.kaiya}（${getTrustTier(trust.kaiya)}）。`,
    },
  ];

  lines.push(
    trust.serin >= 85
      ? { speaker: '瑟琳', text: '「我相信你的判断。下去以后，我会先盯住异常时间波动，你专心带队。」' }
      : trust.serin >= 70
        ? { speaker: '瑟琳', text: '「路线由你决定。我会提醒风险，但最终节奏交给你。」' }
        : { speaker: '瑟琳', text: '「进入第一层后先按公会流程行动。现在我们需要更多稳定判断。」' },
  );
  lines.push(
    trust.ailin >= 70
      ? { speaker: '艾琳', text: '「我把应急药包分好了。若有人被孢尘污染，我会第一时间处理。」' }
      : trust.ailin >= 50
        ? { speaker: '艾琳', text: '「医疗物资在我这里。请不要把伤势拖到无法挽回。」' }
        : { speaker: '艾琳', text: '「我会履行医者职责，但希望接下来的决定更谨慎。」' },
  );
  lines.push(
    trust.brock >= 70
      ? { speaker: '布洛克', text: '「孢海不会亏待尊重它的人。跟着我的标记走，别踩太亮的菌毯。」' }
      : trust.brock >= 50
        ? { speaker: '布洛克', text: '「下面的真菌会说谎，也会救命。先听，别急着砍。」' }
        : { speaker: '布洛克', text: '「我会带路。但如果你们乱动孢海，我不会替鲁莽背锅。」' },
  );
  lines.push(
    trust.kaiya >= 70
      ? { speaker: '凯娅', text: '「吊舱外侧我看过了，没有新鲜割痕。有人盯梢的话，我会先发现。」' }
      : trust.kaiya >= 50
        ? { speaker: '凯娅', text: '「机关和暗线交给我。前提是别把我的警告当玩笑。」' }
        : { speaker: '凯娅', text: '「我会做该做的事。至于要不要多说，就看你们值不值得。」' },
  );

  if (average >= 70) {
    lines.push({ speaker: '主持人', text: '几句低声确认后，吊舱里的紧张感被压了下去。队伍在同一个节拍里等待缆梯启动。' });
  } else if (average <= 49) {
    lines.push({ speaker: '主持人', text: '没有人再多说话。安全扣逐一锁紧，金属声在吊舱里显得格外清楚。' });
  }
  return lines;
}

function RewardAcquisitionModal({
  notices,
  onDismiss,
}: {
  notices: RewardNotice[];
  onDismiss: (id: number) => void;
}) {
  const notice = notices[0];
  if (!notice) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={notice.id}
        className="reward-acquisition-backdrop"
        role="presentation"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.section
          className={`reward-acquisition-modal reward-acquisition-${notice.kind}`}
          role="dialog"
          aria-modal="true"
          aria-label={`${rewardNoticeLabel(notice.kind)}：${notice.name}`}
          initial={{ opacity: 0, scale: 0.9, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ duration: 0.2 }}
        >
          <span className="reward-acquisition-kicker">{rewardNoticeLabel(notice.kind)}</span>
          <div className="reward-acquisition-image">
            <img
              src={notice.image}
              alt={notice.name}
              onError={(event) => { event.currentTarget.src = resolveItemIconPath('default'); }}
            />
          </div>
          <h2>{notice.name}{notice.quantity && notice.quantity > 1 ? ` x${notice.quantity}` : ''}</h2>
          <p>{notice.summary || getItemSummaryByName(notice.name)}</p>
          {notices.length > 1 && <small>还有 {notices.length - 1} 项待确认</small>}
          <button type="button" onClick={() => onDismiss(notice.id)}>收下</button>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const runtime = dndRuntime;
  const [screen, setScreen] = useState<Screen>('main-menu');
  const [loadError, setLoadError] = useState('');
  const [gameId, setGameId] = useState('');
  const [gameState, setGameState] = useState<GameState>({});
  const [story, setStory] = useState<StoryLine[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<GamePhase>('narrating');
  const [streaming, setStreaming] = useState(false);
  const [suggestions, setSuggestions] = useState<ActionSuggestion[]>([]);
  const [events, setEvents] = useState<EventFeedItem[]>([]);
  const [diceRoll, setDiceRoll] = useState<DiceResult | null>(null);
  const [saves, setSaves] = useState<SaveSlotSummary[]>([]);
  const [saveBusySlot, setSaveBusySlot] = useState<SaveSlotKey | ''>('');
  const [showGameSaves, setShowGameSaves] = useState(false);
  const [showCharacterInfo, setShowCharacterInfo] = useState(false);
  const [showReturnTitleConfirm, setShowReturnTitleConfirm] = useState(false);
  const [showDicePoker, setShowDicePoker] = useState(false);
  const [dicePokerNpc, setDicePokerNpc] = useState('萨洛');
  const [showBargainGame, setShowBargainGame] = useState(false);
  const [showDrinkingDiceGame, setShowDrinkingDiceGame] = useState(false);
  const [showLuckyBoxGame, setShowLuckyBoxGame] = useState(false);
  const [showApothecaryShopUI, setShowApothecaryShopUI] = useState(false); // 云苓商店面板
  const [showPassphraseHint, setShowPassphraseHint] = useState(false); // 暗号提示框
  const [showStyleSelection, setShowStyleSelection] = useState(false);
  const [selectedOpeningStyleId, setSelectedOpeningStyleId] = useState('balanced');
  const [openingPlayerName, setOpeningPlayerName] = useState('');
  const [fullyVisibleLineId, setFullyVisibleLineId] = useState<StoryLine['id'] | null>(null);
  const [companionEventId, setCompanionEventId] = useState('block_echo_forest'); // 当前同伴支线 ID
  const [deepBattleId, setDeepBattleId] = useState(''); // 深层战斗ID（蓝伞/骨柱/Boss）
  const [helpedRhein, setHelpedRhein] = useState<boolean | null>(null); // 莱因选择
  const [bossCoreChoice, setBossCoreChoice] = useState<string | null>(null); // Boss核心选择
  const [showDialogueLog, setShowDialogueLog] = useState(false);
  const [showCityMap, setShowCityMap] = useState(false);
  const [showTavernDice, setShowTavernDice] = useState(false);
  const [showBattlePrepPanel, setShowBattlePrepPanel] = useState(false); // 战前行动面板
  const [battlePrepDice, setBattlePrepDice] = useState<DiceResult | null>(null); // 战前行动骰子
  const [battlePrepNarration, setBattlePrepNarration] = useState('');
  const [battlePrepNarrating, setBattlePrepNarrating] = useState(false);
  const [battlePrepNarrationDone, setBattlePrepNarrationDone] = useState(false);
  const [selectionActionCheck, setSelectionActionCheck] = useState<SelectionActionCheck | null>(null);
  const [, setSelectionActionCheckVersion] = useState(0);
  const [bpTrigger, setBpTrigger] = useState(0); // 战前行动触发计数器，用于强制 useMemo 重算
  const [saveMessage, setSaveMessage] = useState('');
  const [saveMessageTone, setSaveMessageTone] = useState<'neutral' | 'success' | 'error'>('neutral');
  const [pendingTutorialBattleSetup, setPendingTutorialBattleSetup] = useState<TutorialBattleSetup | null>(null);
  const [pendingTutorialBattleSummary, setPendingTutorialBattleSummary] = useState<string[]>([]);
  const [openingFastForward, setOpeningFastForward] = useState(false);
  const [fastForwardMode, setFastForwardMode] = useState(false);
  const [ctrlKeyHeld, setCtrlKeyHeld] = useState(false);
  const [scriptedBgOverride, setScriptedBgOverride] = useState<string | null>(null);
  const [visualResetKey, setVisualResetKey] = useState(0);
  const [showActionPanel, setShowActionPanel] = useState(false); // 行动面板延迟显示
  const [openingActionTutorialDismissed, setOpeningActionTutorialDismissed] = useState(false);
  const [openingActionTutorialStep, setOpeningActionTutorialStep] = useState(0);
  const [serlinIntroTutorialDismissed, setSerlinIntroTutorialDismissed] = useState(false);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(() => readStoredVolume(AUDIO_STORAGE_KEYS.bgmVolume, 0.65));
  const [sfxVolume, setSfxVolume] = useState(() => readStoredVolume(AUDIO_STORAGE_KEYS.sfxVolume, 0.8));
  const [externalBgmTrack, setExternalBgmTrack] = useState('');
  const [rewardNotices, setRewardNotices] = useState<RewardNotice[]>([]);

  const lineId = useRef(1);
  const eventId = useRef(1);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const bgmTrackRef = useRef('');
  const parserRef = useRef(createNarrativeStreamParser());
  const streamSuggestionsRef = useRef<ActionSuggestion[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const stateRef = useRef<GameState>({});
  const kpSpeakerRef = useRef('');
  const eventTimersRef = useRef<number[]>([]);
  const rewardNoticeIdRef = useRef(1);
  const passphraseHintShownRef = useRef(false);
  const pendingBattleRef = useRef<string>(''); // 前置剧情结束后触发战斗
  const pendingBattlePrepRef = useRef<BattlePrepChoice[] | null>(null); // 战前行动选项
  const battlePrepResultRef = useRef<BattlePrepResolveResult | null>(null); // 战前行动结果
  const battlePrepStateRef = useRef<any>(null); // 战前行动时的快照状态
  const currentEncounterConfigRef = useRef<EncounterFlowConfig | null>(null);
  const rewardBaselineRef = useRef<GameState | null>(null);
  const rewardNoticeDeferRef = useRef(false);
  const queuedRewardNoticesRef = useRef<RewardNotice[]>([]);
  const deferredSystemEventsRef = useRef<Array<{ message: string; tone: EventFeedItem['tone'] }>>([]);
  const diceFiredRef = useRef(false); // 防重复投骰
  const tutorialBattleIntentRef = useRef(false);
  const tutorialBattleDiceRef = useRef<DiceResult | null>(null);
  const tutorialBattleActionRef = useRef('');
  const dicePokerPendingRef = useRef<string>(''); // 已进骰子游戏但尚未请求后端叙事
  const dicePokerAutoTriggeredRef = useRef(false); // 防止自动触发骰子游戏多次
  const scriptedBgSceneRef = useRef<string>('');    // 记录 override 对应的场景 id
  const autoSaveBusyRef = useRef(false);
  const selectionActionResumeRef = useRef<{ action: string; lockedPrompt: string } | null>(null);

  const clearEventTimers = useCallback(() => {
    eventTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    eventTimersRef.current = [];
  }, []);

  const clearRewardNotices = useCallback(() => {
    rewardNoticeDeferRef.current = false;
    queuedRewardNoticesRef.current = [];
    deferredSystemEventsRef.current = [];
    setRewardNotices([]);
  }, []);

  const dismissRewardNotice = useCallback((id: number) => {
    setRewardNotices((prev) => prev.filter((notice) => notice.id !== id));
  }, []);

  const pushRewardNotices = useCallback((notices: RewardNotice[]) => {
    if (!notices.length) return;
    setRewardNotices((prev) => [...prev, ...notices].slice(-6));
  }, []);

  const flushDeferredRewardNotices = useCallback(() => {
    const pending = queuedRewardNoticesRef.current.splice(0);
    rewardNoticeDeferRef.current = false;
    pushRewardNotices(pending);
  }, [pushRewardNotices]);

  useEffect(() => {
    const previous = rewardBaselineRef.current;
    stateRef.current = gameState;
    if (previous && screen === 'game') {
      const notices = collectRewardNotices(previous, gameState, () => rewardNoticeIdRef.current++);
      if (rewardNoticeDeferRef.current && notices.length) {
        queuedRewardNoticesRef.current = [...queuedRewardNoticesRef.current, ...notices].slice(-6);
      } else {
        pushRewardNotices(notices);
      }
    }
    rewardBaselineRef.current = gameState;
  }, [gameState, pushRewardNotices, screen]);

  useEffect(() => {
    if (!rewardNoticeDeferRef.current) return;
    if (screen !== 'game' || streaming || diceRoll || phase !== 'action') return;

    if (!queuedRewardNoticesRef.current.length) {
      rewardNoticeDeferRef.current = false;
      return;
    }

    const timer = window.setTimeout(() => flushDeferredRewardNotices(), 250);
    return () => window.clearTimeout(timer);
  }, [diceRoll, flushDeferredRewardNotices, phase, screen, streaming]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      clearEventTimers();
      bgmRef.current?.pause();
    },
    [clearEventTimers],
  );

  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = bgmVolume;
    audio.src = BGM_TRACKS.title;
    bgmTrackRef.current = BGM_TRACKS.title;
    audio.load();
    bgmRef.current = audio;
    void audio.play().catch(() => undefined);

    const resumeAudio = () => {
      if (!bgmTrackRef.current) return;
      void audio.play().catch(() => undefined);
    };

    window.addEventListener('pointerdown', resumeAudio);
    window.addEventListener('keydown', resumeAudio);

    return () => {
      window.removeEventListener('pointerdown', resumeAudio);
      window.removeEventListener('keydown', resumeAudio);
      audio.pause();
      bgmRef.current = null;
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(AUDIO_STORAGE_KEYS.bgmVolume, String(bgmVolume));
    if (bgmRef.current) bgmRef.current.volume = bgmVolume;
  }, [bgmVolume]);

  useEffect(() => {
    window.localStorage.setItem(AUDIO_STORAGE_KEYS.sfxVolume, String(sfxVolume));
  }, [sfxVolume]);

  const playBgmTrack = useCallback(
    (track: string) => {
      const audio = bgmRef.current;
      if (!audio || !track) return;

      if (bgmTrackRef.current !== track) {
        bgmTrackRef.current = track;
        audio.src = track;
        audio.loop = true;
        audio.load();
      }

      audio.volume = bgmVolume;
      void audio.play().catch(() => undefined);
    },
    [bgmVolume],
  );

  const stopBgmTrack = useCallback(() => {
    const audio = bgmRef.current;
    if (!audio) return;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    bgmTrackRef.current = '';
  }, []);

  useEffect(() => {
    const handleBgmTrack = (event: Event) => {
      setExternalBgmTrack(typeof (event as CustomEvent<string>).detail === 'string' ? (event as CustomEvent<string>).detail : '');
    };

    window.addEventListener(BGM_TRACK_EVENT, handleBgmTrack);
    return () => window.removeEventListener(BGM_TRACK_EVENT, handleBgmTrack);
  }, []);

  const upsertSaveSummary = useCallback((save: SaveSlotSummary) => {
    setSaves((prev) => [...prev.filter((item) => item.slot_key !== save.slot_key), save]);
  }, []);

  const refreshSaves = useCallback(async () => {
    try {
      const result = await listSaves();
      setSaves(result.saves);
      setSaveMessage('');
      setSaveMessageTone('neutral');
      setShowDicePoker(false);
      setShowBargainGame(false);
      setShowDrinkingDiceGame(false);
      setShowLuckyBoxGame(false);
      setShowApothecaryShopUI(false);
    } catch (error: any) {
      setSaveMessage(error.message || '获取存档失败');
      setSaveMessageTone('error');
    }
  }, []);

  useEffect(() => {
    refreshSaves();
  }, [refreshSaves]);

  const appendStoryLines = useCallback(
    (texts: string[], role: StoryLine['role'], speaker: string, focus = false) => {
      const cleanTexts = texts.map((text) => stripMachineProtocolText(text).trim()).filter(Boolean);
      if (!cleanTexts.length) return;

      const nextLines: StoryLine[] = cleanTexts.flatMap((text): StoryLine[] => {
        if (role !== 'kp') {
          return [{ id: lineId.current++, role, speaker, text }];
        }

        const parsed = parseNarrativeSegments(text, speaker || '主持人', kpSpeakerRef.current);
        kpSpeakerRef.current = parsed.lastSpeaker;

        return parsed.segments.map((segment) => ({
          id: lineId.current++,
          role: 'kp' as const,
          speaker: segment.speaker,
          text: segment.text,
        }));
      });

      setStory((prev) => {
        if (focus || prev.length === 0) {
          setActiveIndex(prev.length);
        }
        return [...prev, ...nextLines];
      });
    },
    [],
  );

  const insertStoryLinesAfterActive = useCallback(
    (lines: Array<Omit<StoryLine, 'id'>>, advanceToFirstInserted = false) => {
      if (!lines.length) return;
      const nextLines = lines.map((line) => ({ ...line, id: lineId.current++ }));
      setStory((prev) => {
        const insertAt = Math.min(activeIndex + 1, prev.length);
        const next = [...prev.slice(0, insertAt), ...nextLines, ...prev.slice(insertAt)];
        if (advanceToFirstInserted) setActiveIndex(insertAt);
        return next;
      });
    },
    [activeIndex],
  );

  const addEvent = useCallback((text: string, tone: EventFeedItem['tone']) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const id = eventId.current++;
    setEvents((prev) => [...prev, { id, text: trimmed, tone }].slice(-8));

    const timer = window.setTimeout(() => {
      setEvents((prev) => prev.filter((item) => item.id !== id));
      eventTimersRef.current = eventTimersRef.current.filter((item) => item !== timer);
    }, 5000);
    eventTimersRef.current.push(timer);
  }, []);

  const flushDeferredSystemEvents = useCallback(() => {
    const pending = deferredSystemEventsRef.current.splice(0);
    if (!pending.length) return;

    appendStoryLines(pending.map((event) => event.message), 'system', '系统');
    pending.forEach((event) => addEvent(event.message, event.tone));
  }, [addEvent, appendStoryLines]);

  const applyRuntimeStateChange = useCallback(
    (change: Record<string, any>) => {
      const nextState = runtime.applyStateChange(stateRef.current, change);
      stateRef.current = nextState;
      setGameState(nextState);
      addEvent(runtime.formatStateChange(change), 'state');
    },
    [addEvent, runtime],
  );

  const patchStateFromPanel = useCallback(
    (patch: Partial<GameState>, message?: string) => {
      const statePatch: Partial<GameState> = {
        ...patch,
        ...(message && !patch.last_event ? { last_event: message } : {}),
      };
      const nextState = { ...stateRef.current, ...statePatch };
      stateRef.current = nextState;
      setGameState(nextState);
      if (gameId) {
        void patchGameState(gameId, statePatch).catch((error: any) => {
          addEvent(error.message || '背包状态同步失败', 'error');
        });
      }
      if (message) addEvent(message, 'state');
    },
    [addEvent, gameId],
  );

  const playScriptedScene = useCallback(
    (
      scene: ScriptedScene,
      options: { playerAction?: string; extraStatePatch?: Partial<GameState>; focus?: boolean; dynamicHints?: string[] } = {},
    ) => {
      const playerAction = options.playerAction?.trim();
      if (playerAction) {
        appendStoryLines([playerAction], 'player', gameState.player_name || '你', options.focus ?? true);
      }

      const shouldShowPreDescentTrust =
        scene.id === 'elevator-descent' && !stateRef.current.pre_descent_trust_feedback_done;
      const injectedLines = shouldShowPreDescentTrust ? getPreDescentTrustLines(stateRef.current) : [];
      const sceneClues = Array.isArray(scene.clues) ? scene.clues : [];
      const baseStatePatch: Partial<GameState> = {
        ...(scene.statePatch ?? {}),
        ...(options.extraStatePatch ?? {}),
        ...(sceneClues.length ? { clues: mergeClues(stateRef.current.clues, sceneClues) } : {}),
        ...(shouldShowPreDescentTrust ? { pre_descent_trust_feedback_done: true } : {}),
        ...(scene.setArea ? { current_area: scene.setArea, actions_in_area: 0 } : {}),
        last_event: options.extraStatePatch?.last_event || scene.lastEvent || playerAction || '固定剧情推进',
      };
      const nextStateForScene = synchronizeMainStoryState({ ...stateRef.current, ...baseStatePatch }, scene.id);
      const statePatch: Partial<GameState> = Object.fromEntries(
        Object.entries(nextStateForScene).filter(([key, value]) => stateRef.current[key] !== value),
      );

      if (Object.keys(statePatch).length) {
        if (sceneClues.length) {
          rewardNoticeDeferRef.current = true;
          queuedRewardNoticesRef.current = [];
        }
        const nextState = { ...stateRef.current, ...statePatch };
        stateRef.current = nextState;
        setGameState(nextState);
        if (gameId) {
          void patchGameState(gameId, statePatch).catch((error: any) => {
            addEvent(error.message || '固定剧情状态同步失败', 'error');
          });
        }
      }

      // 条件行过滤（支持 !flags.xxx 、 flags.a || flags.b 、 flags.a && flags.b 等表达式）
      const checkFlag = (flag: string) => evaluateCondition(flag, stateRef.current);
      const filteredLines = scene.lines.filter((l) => !l.condition || checkFlag(l.condition));

      setStory((prev) => {
        const newLines: StoryLine[] = [...injectedLines, ...filteredLines].map((line) => ({
          id: lineId.current++,
          role: 'kp' as const,
          speaker: line.speaker,
          text: line.text.replace(/\{name\}/g, gameState.player_name || '你'),
          portrait: line.portrait || getScriptedPortraitOverride(scene.id, line.speaker),
          bgImage: line.bgImage,
          bgm: line.bgm || scene.bgm,
          scriptedSceneId: scene.id,
        }));
        const next = [...prev, ...newLines];
        if (options.focus !== false) {
          setActiveIndex(prev.length);
        }
        return next;
      });

      scene.events?.forEach((eventText) => addEvent(eventText, 'state'));
      const nextState = { ...stateRef.current, ...statePatch };

      // 孢海据点调查门控（仅在艾琳支线未开始前生效，防止已进入支线后调查选项仍然弹出）
      let finalHints = options.dynamicHints ?? scene.hints;
      if (nextState.outpost_name_list_checked && nextState.patrol_log_checked && !nextState.ailin_wounded_pre_seen) {
        finalHints = ['确认据点调查结果'];
      } else if (!nextState.ailin_wounded_pre_seen && (scene.id === 'outpost-name-list' || scene.id === 'outpost-patrol-log' || scene.id === 'spore-outpost-arrival')) {
        const remaining: string[] = [];
        if (!nextState.outpost_name_list_checked) remaining.push('整理阵亡者名册');
        if (!nextState.patrol_log_checked) remaining.push('翻看旧巡逻记录');
        if (remaining.length) finalHints = remaining;
      }

      const encounterConfig = getEncounterConfigByIntroSceneId(scene.id);
      if (encounterConfig && !isEncounterBattleDone(nextState, encounterConfig)) {
        currentEncounterConfigRef.current = encounterConfig;
        if (canShowPrepChoice(nextState, encounterConfig)) {
          pendingBattlePrepRef.current = getEncounterPrepActions(encounterConfig);
          battlePrepStateRef.current = nextState;
          battlePrepResultRef.current = null;
          pendingBattleRef.current = '';
          setShowBattlePrepPanel(false);
          setSuggestions([]);
          setBpTrigger((n) => n + 1);
        } else {
          pendingBattlePrepRef.current = null;
          battlePrepStateRef.current = nextState;
          battlePrepResultRef.current = null;
          pendingBattleRef.current = encounterConfig.battleId;
          setSuggestions(makeSuggestions(['继续进入战斗']));
        }
      }

      if (!encounterConfig || isEncounterBattleDone(nextState, encounterConfig)) {
        setSuggestions(options.dynamicHints ? makeSuggestions(finalHints) : constrainActionSuggestions(nextState, makeSuggestions(finalHints)));
      }
      setScriptedBgOverride(scene.bgImage || null);
      scriptedBgSceneRef.current = scene.setArea || '';
      setPhase('narrating');
    },
    [addEvent, appendStoryLines, gameId, gameState.player_name],
  );

  const saveCurrentGame = useCallback(
    async (slotKey: SaveSlotKey, options: { silent?: boolean; phaseOverride?: GamePhase; customTitle?: string } = {}) => {
      const silent = options.silent ?? slotKey === AUTO_SAVE_SLOT;
      if (!gameId || streaming || (!silent && saveBusySlot)) return;
      if (silent && autoSaveBusyRef.current) return;

      if (silent) {
        autoSaveBusyRef.current = true;
      } else {
        setSaveBusySlot(slotKey);
        setSaveMessage('');
        setSaveMessageTone('neutral');
      }

      try {
        const latestState = migrateRerollInventory(synchronizeMainStoryState(migrateClassToStyleState(stateRef.current)));
        if (latestState !== stateRef.current) {
          stateRef.current = latestState;
          setGameState(latestState);
        }
        const saveTitlePrefix = slotKey === AUTO_SAVE_SLOT ? '自动' : '';
        const saveTitle = options.customTitle
          ? `${saveTitlePrefix}${saveTitlePrefix ? ' · ' : ''}${options.customTitle}`
          : `${saveTitlePrefix}${saveTitlePrefix ? ' · ' : ''}${latestState.player_name || '冒险者'} · ${getSaveTitleArea(latestState)}`;
        const sanitizedStory = sanitizeStoryForSave(story);
        const sanitizedSuggestions = sanitizeSuggestionsForSave(constrainActionSuggestions(latestState, suggestions));
        const result = await saveGame(gameId, {
          slot_key: slotKey,
          title: saveTitle,
          state: latestState,
          story: sanitizedStory,
          suggestions: sanitizedSuggestions,
          active_index: Math.min(activeIndex, Math.max(sanitizedStory.length - 1, 0)),
          phase: options.phaseOverride ?? phase,
        });

        upsertSaveSummary(result.save);
        if (!silent) {
          setSaveMessage(`已写入：${result.save.title}`);
          setSaveMessageTone('success');
          addEvent('存档已写入', 'state');
        }
      } catch (error: any) {
        if (silent) return;
        const message = error.message || '保存失败';
        setSaveMessage(message);
        setSaveMessageTone('error');
        addEvent(message, 'error');
      } finally {
        if (silent) {
          autoSaveBusyRef.current = false;
        } else {
          setSaveBusySlot('');
        }
      }
    },
    [
      activeIndex,
      addEvent,
      gameId,
      phase,
      saveBusySlot,
      story,
      streaming,
      suggestions,
      upsertSaveSummary,
    ],
  );

  const loadSavedGame = useCallback(
    async (slotKey: SaveSlotKey) => {
      if (streaming || saveBusySlot) return;

      setSaveBusySlot(slotKey);
      setSaveMessage('');
      setSaveMessageTone('neutral');

      try {
        abortRef.current?.abort();
        parserRef.current = createNarrativeStreamParser();
        const result = await loadGame(slotKey);
        const restoredState = migrateRerollInventory(synchronizeMainStoryState(migrateClassToStyleState(result.state)));
        const restoredStory = normalizeStoryLines(result.story);
        const maxLineId = restoredStory.reduce((max, line) => Math.max(max, line.id), 0);
        const restoredActiveIndex = restoredStory.length ? Math.min(Math.max(result.active_index, 0), restoredStory.length - 1) : 0;
        const restoredLine = restoredStory[restoredActiveIndex];
        const restoredBgImage = findInheritedBgImage(restoredStory, restoredActiveIndex);
        const restoredBgmTrack = resolveBgmTrack('game', restoredLine, restoredState);

        lineId.current = maxLineId + 1;
        eventId.current = 1;
        kpSpeakerRef.current = '';
        setGameId(result.game_id);
        stateRef.current = restoredState;
        rewardBaselineRef.current = restoredState;
        setGameState(restoredState);
        setRewardNotices([]);
        setStory(restoredStory);
        setActiveIndex(restoredActiveIndex);
        setPhase(result.phase === 'narrating' ? 'narrating' : 'action');
        setStreaming(false);
        setSuggestions(constrainActionSuggestions(restoredState, result.suggestions));
        setShowStyleSelection(false);
        setShowBattlePrepPanel(false);
        setBattlePrepDice(null);
        setSelectionActionCheck(null);
        setSelectedOpeningStyleId(String(restoredState.selectedStyleId || restoredState.selected_style_id || 'balanced'));
        setOpeningPlayerName(String(restoredState.player_name || '').replace(/^冒险者$/, ''));
        setFullyVisibleLineId(null);
        setPendingTutorialBattleSetup(null);
        setPendingTutorialBattleSummary([]);
        pendingBattlePrepRef.current = null;
        battlePrepResultRef.current = null;
        battlePrepStateRef.current = null;
        pendingBattleRef.current = '';
        currentEncounterConfigRef.current = getEncounterConfigById(restoredState.currentEncounterId);
        if (['prepConfirm', 'aiNarration', 'battlePending'].includes(restoredState.encounterPhase) && restoredState.lastPrepResult && currentEncounterConfigRef.current) {
          pendingBattlePrepRef.current = getEncounterPrepActions(currentEncounterConfigRef.current);
          battlePrepResultRef.current = restoredState.lastPrepResult;
          battlePrepStateRef.current = restoredState;
          const restoredNarration = String(restoredState.lastPrepNarration || restoredState.lastPrepResult.text || '判定结果已经确认，队伍完成了战前准备。');
          setBattlePrepNarration(restoredNarration);
          setBattlePrepNarrationDone(true);
          setBattlePrepNarrating(false);
          setShowBattlePrepPanel(true);
        }
        setOpeningFastForward(false);
        setFastForwardMode(false);
        setExternalBgmTrack('');
        setScriptedBgOverride(restoredBgImage);
        scriptedBgSceneRef.current = restoredBgImage ? String(restoredState.current_area || '') : '';
        setVisualResetKey((key) => key + 1);
        setOpeningActionTutorialDismissed(false);
        setOpeningActionTutorialStep(0);
        setSerlinIntroTutorialDismissed(false);
        setShowDicePoker(false);
        setShowBargainGame(false);
        setShowDrinkingDiceGame(false);
        setShowLuckyBoxGame(false);
        setShowApothecaryShopUI(false);
        setShowTavernDice(false);
        setShowCityMap(false);
        tutorialBattleIntentRef.current = false;
        tutorialBattleDiceRef.current = null;
        dicePokerAutoTriggeredRef.current = false;
        dicePokerPendingRef.current = '';
        clearEventTimers();
        clearRewardNotices();
        setEvents([]);
        setScreen('game');
        if (restoredBgmTrack) playBgmTrack(restoredBgmTrack);
        else stopBgmTrack();
        upsertSaveSummary(result.save);
        setSaveMessage(`已读取：${result.save.title}`);
        setSaveMessageTone('success');
        addEvent('读档完成', 'state');
      } catch (error: any) {
        const message = error.message || '读取存档失败';
        setSaveMessage(message);
        setSaveMessageTone('error');
        if (screen === 'game') addEvent(message, 'error');
      } finally {
        setSaveBusySlot('');
      }
    },
    [addEvent, clearEventTimers, clearRewardNotices, playBgmTrack, saveBusySlot, screen, stopBgmTrack, streaming, upsertSaveSummary],
  );

  const startGame = useCallback(
    async (payload: CreateGamePayload) => {
      setScreen('loading');
      setLoadError('');
      setStory([]);
      clearEventTimers();
      clearRewardNotices();
      setEvents([]);
      setRewardNotices([]);
      setSuggestions([]);
      setActiveIndex(0);
      setPhase('narrating');
      setSaveMessage('');
      setSaveMessageTone('neutral');
      setShowStyleSelection(false);
      setShowBattlePrepPanel(false);
      setBattlePrepDice(null);
      setSelectionActionCheck(null);
      setSelectedOpeningStyleId('balanced');
      setOpeningPlayerName('');
      setFullyVisibleLineId(null);
      setPendingTutorialBattleSetup(null);
      setPendingTutorialBattleSummary([]);
      pendingBattlePrepRef.current = null;
      battlePrepResultRef.current = null;
      setBattlePrepNarration('');
      setBattlePrepNarrating(false);
      setBattlePrepNarrationDone(false);
      battlePrepStateRef.current = null;
      pendingBattleRef.current = '';
      currentEncounterConfigRef.current = null;
      setOpeningFastForward(false);
      setScriptedBgOverride(null);
      setOpeningActionTutorialDismissed(false);
      setOpeningActionTutorialStep(0);
      setSerlinIntroTutorialDismissed(false);
      tutorialBattleIntentRef.current = false;
      tutorialBattleDiceRef.current = null;
      dicePokerAutoTriggeredRef.current = false;
      lineId.current = 1;
      eventId.current = 1;
      kpSpeakerRef.current = '';

      try {
        const result = await runtime.createGame(payload);

        const openingScene = getScriptedScene('opening');
        const openingStatePatch: GameState = openingScene
          ? {
              ...(openingScene.statePatch ?? {}),
              ...(openingScene.setArea ? { current_area: openingScene.setArea, actions_in_area: 0 } : {}),
              last_event: openingScene.lastEvent || result.state.last_event,
            }
          : {};
        const nextState = migrateRerollInventory(migrateClassToStyleState({ ...result.state, ...openingStatePatch }));

        setGameId(result.game_id);
        stateRef.current = nextState;
        rewardBaselineRef.current = nextState;
        setGameState(nextState);
        setSelectedOpeningStyleId(String(nextState.selectedStyleId || nextState.selected_style_id || 'balanced'));

        if (openingScene?.lines.length) {
          const scriptLines: StoryLine[] = openingScene.lines.map((line) => ({
            id: lineId.current++,
            role: 'kp' as const,
            speaker: line.speaker,
            text: line.text.replace(/\{name\}/g, payload.player_name),
            portrait: line.portrait,
            bgImage: line.bgImage,
            bgm: line.bgm || openingScene.bgm,
            scriptedSceneId: openingScene.id,
          }));
          setStory(scriptLines);
          setActiveIndex(0);
          setSuggestions(constrainActionSuggestions(
            nextState,
            makeSuggestions(openingScene.hints),
          ));
          openingScene.events?.forEach((eventText) => addEvent(eventText, 'state'));
        } else {
          const parsedOpening = extractHints(result.opening || DEFAULT_OPENING);
          const openingLines = splitNarrative(parsedOpening.text || DEFAULT_OPENING);
          setSuggestions(constrainActionSuggestions(nextState, parsedOpening.suggestions));
          appendStoryLines(openingLines.length ? openingLines : [DEFAULT_OPENING], 'kp', '主持人', true);
        }

        if (payload.skip_opening) setOpeningFastForward(true);
        setScreen('game');
      } catch (error: any) {
        setLoadError(error.message || '连接失败');
      }
    },
    [addEvent, appendStoryLines, clearEventTimers, clearRewardNotices, runtime],
  );

  const startDefaultGame = useCallback(() => {
    const fallbackStyle = getPlayerStyleById('balanced');
    void startGame({
      player_name: '\u5192\u9669\u8005',
      char_class: '\u5f85\u786e\u8ba4\u6d41\u6d3e',
      attr_str: fallbackStyle.attributes.str,
      attr_dex: fallbackStyle.attributes.dex,
      attr_con: fallbackStyle.attributes.con,
      attr_int: fallbackStyle.attributes.int,
      attr_wis: fallbackStyle.attributes.wis,
      attr_cha: fallbackStyle.attributes.cha,
      level: 3,
      skip_opening: false,
      selected_style_id: 'balanced',
      style_selection_pending: true,
    });
  }, [startGame]);

  const startStoryTest = useCallback(
    async (checkpoint: StoryTestCheckpoint) => {
      setScreen('loading');
      setLoadError('');
      setStory([]);
      clearEventTimers();
      clearRewardNotices();
      setEvents([]);
      setRewardNotices([]);
      setSuggestions([]);
      setActiveIndex(0);
      setPhase('narrating');
      setSaveMessage('');
      setSaveMessageTone('neutral');
      setShowStyleSelection(false);
      setShowBattlePrepPanel(false);
      setBattlePrepDice(null);
      setSelectedOpeningStyleId('balanced');
      setFullyVisibleLineId(null);
      setPendingTutorialBattleSetup(null);
      setPendingTutorialBattleSummary([]);
      pendingBattlePrepRef.current = null;
      battlePrepResultRef.current = null;
      battlePrepStateRef.current = null;
      pendingBattleRef.current = '';
      currentEncounterConfigRef.current = null;
      setOpeningFastForward(false);
      setFastForwardMode(false);
      setScriptedBgOverride(null);
      setOpeningActionTutorialDismissed(false);
      setOpeningActionTutorialStep(0);
      setSerlinIntroTutorialDismissed(false);
      setShowDicePoker(false);
      setShowBargainGame(false);
      setShowDrinkingDiceGame(false);
      setShowLuckyBoxGame(false);
      setShowApothecaryShopUI(false);
      setShowTavernDice(false);
      setShowCityMap(false);
      tutorialBattleIntentRef.current = false;
      tutorialBattleDiceRef.current = null;
      dicePokerAutoTriggeredRef.current = false;
      dicePokerPendingRef.current = '';
      scriptedBgSceneRef.current = '';
      lineId.current = 1;
      eventId.current = 1;
      kpSpeakerRef.current = '';

      try {
        const result = await runtime.createGame({
          player_name: checkpoint.statePatch.player_name || '剧情测试员',
          char_class: checkpoint.statePatch.char_class || '战士',
          attr_str: 16,
          attr_dex: 13,
          attr_con: 14,
          attr_int: 10,
          attr_wis: 12,
          attr_cha: 8,
          level: Number(checkpoint.statePatch.level ?? 3),
          skip_opening: true,
        });

        const scene = checkpoint.sceneId ? getScriptedScene(checkpoint.sceneId) : null;
        const scenePatch: GameState = {
          ...(scene?.statePatch ?? {}),
          ...(scene?.setArea ? { current_area: scene.setArea, actions_in_area: 0 } : {}),
        };
        const isOpeningTutorialCheckpoint = checkpoint.id === 'first-choice';
        const tutorialCheckpointDefaults: GameState = isOpeningTutorialCheckpoint
          ? {
              first_choice_resolved: false,
              tutorial_battle_done: false,
              tutorial_battle_pending: true,
              currentNodeId: 'opening_tutorial_battle',
            }
          : {
              first_choice_resolved: true,
              tutorial_battle_done: true,
              tutorial_battle_pending: false,
            };
        const statePatch: GameState = {
          ...tutorialCheckpointDefaults,
          ...checkpoint.statePatch,
          ...scenePatch,
          test_mode: true,
          story_test_checkpoint: checkpoint.id,
          tutorial_battle_pending: isOpeningTutorialCheckpoint,
          last_event: checkpoint.statePatch.last_event || scene?.lastEvent || `剧情测试：${checkpoint.label}`,
        };
        const nextState = synchronizeMainStoryState(migrateClassToStyleState(
          {
            ...result.state,
            ...statePatch,
          },
        ), scene?.id);
        const scriptLines = checkpoint.lines ?? scene?.lines ?? [
          {
            speaker: '系统',
            text: `已进入剧情测试节点：${checkpoint.label}`,
          },
        ];

        setGameId(result.game_id);
        stateRef.current = nextState;
        rewardBaselineRef.current = nextState;
        setGameState(nextState);
        setSelectedOpeningStyleId(String(nextState.selectedStyleId || nextState.selected_style_id || 'balanced'));
        setRewardNotices([]);
        setStory(scriptLines.map((line) => ({
          id: lineId.current++,
          role: 'kp' as const,
          speaker: line.speaker,
          text: line.text,
          portrait: ('portrait' in line && typeof line.portrait === 'string' ? line.portrait : undefined)
            || (scene ? getScriptedPortraitOverride(scene.id, line.speaker) : undefined),
          bgImage: 'bgImage' in line && typeof line.bgImage === 'string' ? line.bgImage : undefined,
          bgm: ('bgm' in line && typeof line.bgm === 'string' ? line.bgm : undefined) || scene?.bgm,
          scriptedSceneId: scene?.id || checkpoint.id,
        })));
        setSuggestions(constrainActionSuggestions(nextState, makeSuggestions(checkpoint.hints ?? scene?.hints ?? fallbackSuggestions(nextState).map((item) => item.text))));
        setScriptedBgOverride(scene?.bgImage || null);
        scriptedBgSceneRef.current = scene?.setArea || '';
        setActiveIndex(0);
        setPhase('narrating');
        addEvent(`剧情测试：${checkpoint.label}`, 'state');

        void patchGameState(result.game_id, nextState).catch((error: any) => {
          addEvent(error.message || '剧情测试状态同步失败', 'error');
        });
        setScreen('game');
      } catch (error: any) {
        setLoadError(error.message || '剧情测试启动失败');
      }
    },
    [addEvent, clearEventTimers, clearRewardNotices, runtime],
  );

  const completeCompanionSideEvent = useCallback(
    (result: CompanionEventCompleteResult) => {
      const current = stateRef.current;
      const rewards = result.state.rewards;
      const eventId = result.event.id;
      const inventoryText = String(current.inventory || '长剑,冒险者工具包');
      const nextInventory = rewards.reduce((inventory, reward) => (
        inventory.includes(reward) ? inventory : `${inventory},${reward}`
      ), inventoryText);
      const rewardText = rewards.length ? rewards.join('、') : '基础补给';

      // 根据支线 ID 确定对应的信任 key 和区域
      const companionConfig: Record<string, { trustKey: string; doneKey: string; area: string; nextHints: string[]; extraPatch: GameState }> = {
        ailin_wounded_names: {
          trustKey: 'trust_al',
          doneKey: 'ailin_wounded_names_done',
          area: '无光孢海·孢海据点出口',
          nextHints: ['前往蓝伞浅滩', '向尼布确认蓝伞浅滩路线', '让艾琳评估队伍污染状态'],
          extraPatch: {
            completedAilinSideQuest: true,
            currentNodeId: 'battle_blue_shoal_01',
          },
        },
        block_echo_forest: {
          trustKey: 'trust_block',
          doneKey: 'block_echo_forest_done',
          area: '无光孢海·回声菌林出口',
          nextHints: ['前往前线废弃据点', '检查沿途旧路标【智力DC12】', '让布洛克追踪污染痕迹【感知DC13】'],
          extraPatch: {
            completedBrockSideQuest: true,
            currentNodeId: 'abandoned_forward_post_intro',
          },
        },
        kaiya_broken_seals: {
          trustKey: 'trust_kl',
          doneKey: 'kaiya_broken_seals_done',
          area: '无光孢海·废弃据点暗道出口',
          nextHints: ['前往骨柱湿地', '让凯娅检查路线上可能残留的机关', '确认骨柱湿地的怪物活动【感知DC13】'],
          extraPatch: {
            completedKaiyaSideQuest: true,
            currentNodeId: 'battle_bone_marsh_02',
          },
        },
        serin_cracked_silver_staff: {
          trustKey: 'trust_sl',
          doneKey: 'serin_cracked_silver_staff_done',
          area: '无光孢海·黑石根区前沿',
          nextHints: ['进入黑石根区深处', '确认队伍Boss战前状态', '让瑟琳分析黑石脉冲规律【智力DC14】'],
          extraPatch: {
            completedSerinSideQuest3: true,
            currentNodeId: 'boss_blackstone_gatekeeper',
          },
        },
      };
      const config = companionConfig[eventId] || companionConfig.block_echo_forest;
      const companionId = COMPANION_ID_BY_EVENT_ID[eventId] || 'brock';
      const trustPatch = buildTrustPatch(current, { [companionId]: result.state.trust });

      const patch: GameState = {
        [config.doneKey]: true,
        [`${eventId}_result`]: result.state.result_title || result.event.title,
        [`${eventId}_rewards`]: rewardText,
        [`${eventId}_contamination`]: result.state.contamination,
        [`${eventId}_battle_result`]: result.state.battle_result || '',
        [config.trustKey]: result.state.trust,
        ...trustPatch,
        ...config.extraPatch,
        inventory: nextInventory,
        current_area: config.area,
        actions_in_area: 0,
        last_event: `完成同伴支线：${result.event.title}`,
      };

      const nextState = { ...current, ...patch };
      stateRef.current = nextState;
      setGameState(nextState);
      if (gameId) {
        void patchGameState(gameId, patch).catch(
          (error: any) => addEvent(error.message || '同伴支线状态同步失败', 'error'),
        );
      }

      const companionName = result.event.companion?.name || '同伴';
      addEvent(`${companionName}信任 ${result.state.trust}`, 'state');
      if (rewards.length) addEvent(`获得 ${rewardText}`, 'state');
      appendStoryLines([
        `同伴支线「${result.event.title}」已经结束。${result.state.result_text || '队伍重新整队。'}`,
        rewards.length
          ? `${companionName}将${rewardText}交给队伍。`
          : `${companionName}收好装备，提醒队伍接下来的区域会更加危险。`,
      ], 'kp', '主持人', true);
      setSuggestions(constrainActionSuggestions(nextState, makeSuggestions(config.nextHints)));
      setPhase('narrating');
      setCompanionEventId(eventId);
    },
    [addEvent, appendStoryLines, gameId],
  );

  const queueEncounterPrep = useCallback(
    (config: EncounterFlowConfig, baseState: GameState, openPanel = true) => {
      const resumedResult = baseState.lastPrepResult as BattlePrepResolveResult | undefined;
      const resumeCompletedPrep = Boolean(resumedResult && baseState.flags?.[config.prepDoneFlag]);
      const prepState: GameState = {
        ...baseState,
        currentEncounterId: config.encounterId,
        currentBattleId: config.battleId,
        nextAfterBattleSceneId: config.afterSceneId,
        encounterPhase: resumeCompletedPrep ? 'battlePending' : 'prepChoice',
      };
      currentEncounterConfigRef.current = config;
      pendingBattlePrepRef.current = getEncounterPrepActions(config);
      battlePrepStateRef.current = prepState;
      battlePrepResultRef.current = resumeCompletedPrep ? resumedResult! : null;
      pendingBattleRef.current = '';
      setBattlePrepNarration(resumeCompletedPrep ? String(baseState.lastPrepNarration || resumedResult?.text || '判定结果已经确认，队伍完成了战前准备。') : '');
      setBattlePrepNarrating(false);
      setBattlePrepNarrationDone(resumeCompletedPrep);
      stateRef.current = prepState;
      setGameState(prepState);
      setSuggestions([]);
      setPhase('narrating');
      setShowBattlePrepPanel(openPanel);
      setBpTrigger((n) => n + 1);
      if (gameId) {
        void patchGameState(gameId, {
          currentEncounterId: config.encounterId,
          currentBattleId: config.battleId,
          nextAfterBattleSceneId: config.afterSceneId,
          encounterPhase: 'prepChoice',
        }).catch((error: any) => addEvent(error.message || '战斗遭遇状态同步失败', 'error'));
      }
    },
    [addEvent, gameId],
  );

  const submitAction = useCallback(
    (text: string) => {
      let action = text.trim();
      if (!action || !gameId || streaming) return;

      const currentState = stateRef.current;
      const resumedSelection = selectionActionResumeRef.current?.action === action ? selectionActionResumeRef.current : null;
      if (resumedSelection) {
        selectionActionResumeRef.current = null;
      } else {
        const selectionCheck = SelectionActionCheck.fromAction(action, currentState);
        if (selectionCheck) {
          setSelectionActionCheck(selectionCheck);
          setBattlePrepDice(selectionCheck.result.roll ? storyCheckDiceResult(selectionCheck.result.roll) : null);
          return;
        }
      }
      let forcedStageAdvanceScene: ScriptedScene | null = null;
      let stageLimitNextAction = '';
      const blockRoute = (message: string, nextHints: string[]) => {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        appendStoryLines([message], 'kp', '瑟琳', true);
        setSuggestions(constrainActionSuggestions(stateRef.current, makeSuggestions(nextHints)));
        setPhase('narrating');
      };
      const patchStateNow = (patch: GameState, errorMessage: string) => {
        const nextState = { ...stateRef.current, ...patch };
        stateRef.current = nextState;
        setGameState(nextState);
        if (gameId) {
          void patchGameState(gameId, patch).catch((error: any) => addEvent(error.message || errorMessage, 'error'));
        }
      };

      if (currentState.serlin_intro_pending) {
        const submittedIntro = action;
        if (submittedIntro.length < 10) {
          blockRoute('瑟琳微微皱眉：「请认真介绍自己。至少说清楚你的身份和加入远征的理由。」', []);
          return;
        }
        appendStoryLines([`“${submittedIntro.slice(0, 60)}${submittedIntro.length > 60 ? '…' : ''}”`], 'player', gameState.player_name || '你', true);
        setPhase('narrating');
        setStreaming(true);
        setSuggestions([]);
        setDiceRoll(null);
        abortRef.current?.abort();

        const intro = submittedIntro.length > 200 ? submittedIntro.slice(0, 200) : submittedIntro;
        appendStoryLines(['瑟琳安静地打量着你，等待你的自我介绍……'], 'system', '系统', true);

        judgeSerlinIntro(intro)
          .then((result) => {
            const trustDelta = Math.max(0, Math.min(10, Math.round(result.trustDelta || 0)));
            const current = stateRef.current;
            const currentTrust = getCompanionTrust(current, 'serin');
            const nextTrust = Math.min(100, currentTrust + trustDelta);
            const trustPatch = buildTrustPatch(current, { serin: nextTrust });
            const signedDelta = trustDelta > 0 ? `+${trustDelta}` : String(trustDelta);

            const patch: GameState = {
              ...trustPatch,
              serlin_intro_pending: false,
              flags: { ...(current.flags || {}), player_introduced_to_serlin: true },
              playerProfile: {
                ...(current.playerProfile || {}),
                selfIntro: intro,
                serlinFirstImpression: result.evaluation || '',
                serlinIntroMaturityScore: result.maturityScore ?? 0,
                serlinIntroTrustDelta: trustDelta,
              },
              last_event: `玩家向瑟琳介绍了自己，瑟琳信任值 +${trustDelta}`,
            };

            const introResultLines = [
              `瑟琳安静地听完你的介绍。${result.evaluation || ''} 瑟琳信任值 +${trustDelta}。`,
              result.serlinReply || '「我会先观察你的行动。希望你的表现和你的话一致。」',
            ];
            if (trustDelta >= 8) {
              introResultLines.push('你能感觉到，瑟琳看向你的目光比刚才少了几分审视，多了一点认可。');
            } else if (trustDelta <= 2) {
              introResultLines.push('瑟琳没有立刻反驳你，但她的沉默显然不是完全的认同。');
            }
            appendStoryLines(introResultLines, 'kp', '瑟琳', true);
            if (trustDelta > 0) addEvent(`瑟琳信任 +${trustDelta}`, 'state');

            stateRef.current = { ...current, ...patch };
            setGameState((prev) => ({ ...prev, ...patch }));
            setStreaming(false);
            const suspenseScene = getScriptedScene('opening-suspense');
            if (suspenseScene) playScriptedScene(suspenseScene, { focus: false });
          })
          .catch((error: any) => {
            addEvent(error?.message || '瑟琳印象判定失败，已使用兜底', 'state');
            const current = stateRef.current;
            const currentTrust = getCompanionTrust(current, 'serin');
            const nextTrust = Math.min(100, currentTrust + 4);
            const trustPatch = buildTrustPatch(current, { serin: nextTrust });
            const patch: GameState = {
              ...trustPatch,
              serlin_intro_pending: false,
              flags: { ...(current.flags || {}), player_introduced_to_serlin: true },
              playerProfile: { ...(current.playerProfile || {}), selfIntro: intro },
              last_event: '玩家向瑟琳介绍了自己，瑟琳信任值 +4',
            };
            appendStoryLines([
              '瑟琳没有完全看透你的底细，但至少认为你愿意配合队伍行动。瑟琳信任值 +4。',
              '「我会先观察你的行动。希望你的表现和你的话一致。」',
            ], 'kp', '瑟琳', true);
            addEvent('瑟琳信任 +4', 'state');
            stateRef.current = { ...current, ...patch };
            setGameState((prev) => ({ ...prev, ...patch }));
            setStreaming(false);
            const suspenseScene = getScriptedScene('opening-suspense');
            if (suspenseScene) playScriptedScene(suspenseScene, { focus: false });
          });
        return;
      }

      if (currentState.ailin_answer_pending) {
        const submittedAnswer = action;
        appendStoryLines([submittedAnswer], 'player', gameState.player_name || '你', true);
        setPhase('narrating');
        setStreaming(true);
        setSuggestions([]);
        setDiceRoll(null);
        abortRef.current?.abort();

        const completeAilinRecruitAnswer = (rawResult: ReturnType<typeof fallbackAilinRecruitAnswer>) => {
          const score = clampNumber(rawResult.score, 0, 100, 50);
          const trustDelta = clampNumber(rawResult.trust_delta, -10, 10, 0);
          const reply = stripAllMachineProtocolText(rawResult.reply || '').trim() || fallbackAilinRecruitAnswer(submittedAnswer).reply;
          const current = stateRef.current;
          const currentTrust = getCompanionTrust(current, 'ailin');
          const nextTrust = clampNumber(currentTrust + trustDelta, 0, 100, currentTrust);
          const trustPatch = buildTrustPatch(current, { ailin: nextTrust });
          const signedDelta = trustDelta > 0 ? `+${trustDelta}` : String(trustDelta);
          const extraPatch: GameState = {
            ...trustPatch,
            ailin_answer_pending: false,
            ailin_answer_score: score,
            ailin_answer_delta: trustDelta,
            ailin_answer_text: submittedAnswer,
            ailin_answer_reason: rawResult.reason || '艾琳根据玩家回答调整了信任。',
            last_event: `回应艾琳关于修女与药箱的问题，艾琳信任${signedDelta}`,
          };

          appendStoryLines([reply], 'kp', '艾琳', true);
          // 明确展示信任值变化给玩家
          const trustFeedback = trustDelta > 0
            ? `对你的回答，艾琳轻轻点头，信任${signedDelta}。`
            : `艾琳听完，沉默了一瞬，信任${signedDelta || '不变'}。`;
          appendStoryLines([trustFeedback], 'system', '系统', true);
          if (trustDelta !== 0) addEvent(`艾琳信任 ${signedDelta}`, 'state');
          else addEvent('艾琳信任维持不变', 'state');

          const finale = getScriptedScene('cathedral-ailin-recruit-finale');
          if (finale) {
            playScriptedScene(finale, { focus: false, extraStatePatch: extraPatch });
          } else {
            patchStateNow({
              ...extraPatch,
              al_recruited: true,
              temple_ailin_recruited: true,
              current_area: '逆穹悬城·静默神殿',
              actions_in_area: 0,
            }, '艾琳入队状态同步失败');
            setSuggestions(makeSuggestions(['回到回声酒馆找布洛克']));
          }
          setStreaming(false);
        };

        judgeAilinRecruitAnswer({
          game_id: gameId,
          player_name: gameState.player_name || '冒险者',
          player_answer: submittedAnswer,
          current_trust: getCompanionTrust(currentState, 'ailin'),
        })
          .then((result) => {
            completeAilinRecruitAnswer({
              score: result.score,
              trust_delta: result.trust_delta,
              reason: result.reason,
              reply: result.reply,
            });
          })
          .catch((error: any) => {
            addEvent(error?.message || '艾琳回答判定失败，已使用兜底结算', 'state');
            completeAilinRecruitAnswer(fallbackAilinRecruitAnswer(submittedAnswer));
          });
        return;
      }

      if (currentState.kaiya_passphrase_pending) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        const saidPassphrase = normalizeNodeAction(action).includes(normalizeNodeAction('断缆不问来路'));
        if (saidPassphrase && hasKaiyaPassphrase(currentState)) {
          const kaiyaContact = getScriptedScene('blackmarket-kaiya-contact');
          if (kaiyaContact) {
            playScriptedScene(kaiyaContact, { focus: false });
            return;
          }
        }

        appendStoryLines([
          '「没有暗号，没有筹码，还想让我听公会的委托？你们是不是走错地方了？」',
        ], 'kp', '凯娅', true);
        patchStateNow({
          kaiya_passphrase_pending: true,
          kaiya_passphrase_failed: true,
          kaiya_passphrase_attempts: Number(currentState.kaiya_passphrase_attempts ?? 0) + 1,
          last_event: '凯娅拒绝错误暗号，等待重新输入',
        }, '凯娅暗号状态同步失败');
        setSuggestions([]);
        setPhase('narrating');
        return;
      }

      const currentVisibleSuggestions = constrainActionSuggestions(currentState, suggestions);
      const activeNode = getActionChoiceStage(currentState, currentVisibleSuggestions.map((item) => item.text || item.label));
      const matchedNodeHint = activeNode ? findNodeHint(action, activeNode) : null;
      if (activeNode) {
        const actionKey = normalizeNodeAction(matchedNodeHint || action);
        const isMainAction = isNodeMainAction(action, activeNode, matchedNodeHint);
        const usedChoices = readChoiceStageUsedChoices(currentState, activeNode);
        const usedSet = new Set(usedChoices);
        const currentCount = Number(currentState[choiceStageCountKey(activeNode)] ?? usedChoices.length);
        const choiceLimit = choiceLimitForStage(currentState, activeNode);

        if (usedSet.has(actionKey)) {
          blockRoute('瑟琳：「这件事刚刚已经处理过了。别在同一个选择上打转，换一个方向，或者直接推进下一段。」', filterNodeSuggestions(currentState, activeNode.hints));
          return;
        }

        if (currentCount >= choiceLimit && !isMainAction) {
          addEvent(`选择行动已达 ${choiceLimit}/${choiceLimit}，自动推进剧情`, 'state');
          const forcedScene = forcedSceneForChoiceStage(activeNode);
          if (forcedScene) {
            appendStoryLines([action], 'player', gameState.player_name || '你', true);
            playScriptedScene(forcedScene, { focus: false });
            return;
          }
          action = activeNode.mainHint;
        }

        if (!isMainAction && currentCount < choiceLimit) {
          const nextCount = Math.min(choiceLimit, currentCount + 1);
          const nextUsedChoices = [...usedChoices, actionKey];
          const nodePatch: GameState = {
            [choiceStageUsedKey(activeNode)]: nextUsedChoices.join('|'),
            [choiceStageCountKey(activeNode)]: nextCount,
          };
          stateRef.current = { ...currentState, ...nodePatch };
          setGameState((prev) => ({ ...prev, ...nodePatch }));
          if (gameId) {
            void patchGameState(gameId, nodePatch).catch((error: any) => addEvent(error.message || '节点选择状态同步失败', 'error'));
          }
          if (nextCount >= choiceLimit) {
            forcedStageAdvanceScene = forcedSceneForChoiceStage(activeNode);
            stageLimitNextAction = activeNode.mainHint;
          }
        }
      }

      const linearRouteBlock = getLinearRouteBlock(action, currentState);
      if (linearRouteBlock) {
        blockRoute(linearRouteBlock.message, linearRouteBlock.hints);
        return;
      }

      if (/静默神殿|寻找艾琳|前往教堂|去教堂/.test(action) && !currentState.salo_intel_done) {
        blockRoute('瑟琳：「先去回声酒馆找萨洛。我们还不知道艾琳今晚是否在神殿，也不知道另外两人的条件。」', [
          '前往回声酒馆找萨洛打听三名队友',
          '和瑟琳讨论队伍配置',
        ]);
        return;
      }

      if (/(?:寻找|找)布洛克|回到回声酒馆寻找布洛克|喝酒骰子|喝酒游戏|喝得尽兴/.test(action) && !currentState.al_recruited) {
        blockRoute('瑟琳：「先去静默神殿找艾琳。她能保证队伍在后续招募和下潜前有足够的治疗与净化准备。」', [
          '前往静默神殿寻找艾琳',
          '询问萨洛布洛克的脾气【感知DC12】',
        ]);
        return;
      }

      if (/前往黑市|去黑市|(?:寻找|找)凯娅|幸运盲盒|购买奥兰|抽盲盒/.test(action) && !currentState.brock_recruited) {
        blockRoute('瑟琳：「先回酒馆找布洛克。没有懂孢海生态的人，即使凯娅加入，我们也很难安全穿过第一层。」', [
          '回到回声酒馆寻找布洛克',
          '整理艾琳加入后的队伍分工',
        ]);
        return;
      }

      if (/降渊缆梯|缆梯|第一层/.test(action) && !currentState.expedition_registered) {
        blockRoute('瑟琳：「队伍还没有在公会完成正式登记。先回去找赫尔曼，领取物资和下潜许可。」', [
          '返回冒险者公会找赫尔曼正式登记小队',
          '整理五人队伍分工',
        ]);
        return;
      }

      if (/前往冒险者公会|去公会/.test(action) && currentState.kaiya_recruited && !currentState.expedition_registered) {
        const registration = getScriptedScene('guild-final-registration');
        if (registration) {
          playScriptedScene(registration, { playerAction: action });
          return;
        }
      }

      if (/前往回声酒馆|去酒馆|回声酒馆/.test(action) && currentState.al_recruited && !currentState.brock_recruited) {
        const brockScene = getScriptedScene('brock-tavern-intro');
        if (brockScene) {
          playScriptedScene(brockScene, { playerAction: action });
          return;
        }
      }

      // ====== 同伴支线入口 ======

      // （废案）艾琳支线：白枝下的名字 —— 已完全由脚本场景接管
      // const wantsAilinSideEvent = /陪艾琳.*伤员棚|停下协助艾琳|救治伤员|检查伤员|检查污染|确认污染|判断伤员污染|帮艾琳|艾琳.*伤员/.test(action);
      // if (wantsAilinSideEvent && (currentState.spore_outpost_reached || currentState.spore_outpost_arrived) && !currentState.ailin_wounded_names_done) {
      //   appendStoryLines([action], 'player', gameState.player_name || '你', true);
      //   setCompanionEventId('ailin_wounded_names');
      //   setSuggestions([]);
      //   setPhase('narrating');
      //   setScreen('companion-event');
      //   return;
      // }

      // 凯娅支线：少了两个封扣（废弃据点后）
      const wantsKaiyaSideEvent = /检查封扣|检查补给箱|调查封扣|凯娅.*调查|凯娅.*暗道|少了.*封扣/.test(action);
      if (wantsKaiyaSideEvent && currentState.frontline_abandoned_outpost_reached && !currentState.kaiya_broken_seals_done) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        setCompanionEventId('kaiya_broken_seals');
        setSuggestions([]);
        setPhase('narrating');
        setScreen('companion-event');
        return;
      }

      // 布洛克支线：回声菌林（已有）
      const wantsBrockSideEvent = /回声菌林|跟随布洛克|布洛克.*调查|布洛克.*菌林|呼救声规律|净化粉/.test(action);
      if (wantsBrockSideEvent && !currentState.block_echo_forest_done) {
        if (!currentState.blue_shoal_battle_done) {
          blockRoute('布洛克：「那片喊救命的菌林在蓝伞浅滩后面。先把浅滩里的东西处理掉，不然我们连声音从哪来都听不清。」', [
            '前往蓝伞浅滩',
            '确认蓝伞浅滩安全路线【感知DC13】',
            '让艾琳评估队伍污染状态',
          ]);
          return;
        }

        if (!currentState.brock_recruited) {
          blockRoute('瑟琳：「这片菌林必须由熟悉孢海生态的人判断。先回酒馆把布洛克请入队。」', linearRecruitmentHints(currentState));
          return;
        }

        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        appendStoryLines([
          '布洛克把铁锅从背上放低，示意所有人别再往前踏一步。前方菌盖之间传来干净得过分的求救声，像某种东西反复练习过同一句话。',
        ], 'kp', '主持人', true);
        setCompanionEventId('block_echo_forest');
        const patch: GameState = {
          block_echo_forest_started: true,
          current_area: '无光孢海·回声菌林',
          actions_in_area: 0,
          last_event: '跟随布洛克调查回声菌林',
        };
        patchStateNow(patch, '布洛克支线启动状态同步失败');
        setSuggestions([]);
        setPhase('narrating');
        setScreen('companion-event');
        return;
      }

      // 瑟琳支线：银杖的第一次裂痕（Boss 前必经）
      const wantsSerinSideEvent = /检查瑟琳银杖|银杖裂痕|瑟琳.*银杖|和瑟琳交谈|黑石脉冲规律/.test(action);
      if (wantsSerinSideEvent && currentState.pre_boss_rest_done && !currentState.serin_cracked_silver_staff_done) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        setCompanionEventId('serin_cracked_silver_staff');
        setSuggestions([]);
        setPhase('narrating');
        setScreen('companion-event');
        return;
      }

      const wantsBlueShoal = /前往蓝伞浅滩|进入蓝伞|蓝伞浅滩|穿过浅滩/.test(action);
      if (currentState.spore_outpost_reached && !currentState.ailin_wounded_names_done && wantsBlueShoal) {
        blockRoute('艾琳把药箱扣好，朝伤员棚看了一眼：「尼布还在核对浅滩路线。给我这段时间确认污染程度，至少别让我们把一个能说话的线索留在身后。」', [
          '陪艾琳去伤员棚确认污染情况',
          '判断伤员污染程度【医疗DC12】',
          '整理阵亡者木牌与伤员名册【智力DC13】',
        ]);
        return;
      }

      const wantsAbandonedPost = /前往前线废弃据点|前往废弃据点|调查废弃据点|进入废弃据点/.test(action);
      if (currentState.blue_shoal_battle_done && !currentState.block_echo_forest_done && wantsAbandonedPost) {
        blockRoute('布洛克抬手拦住队伍：「先别走直线。那片回声菌林在学人喊救命，不把污染菌核处理掉，后路会一直跟着我们叫。」', [
          '跟随布洛克调查回声菌林',
          '听布洛克解释呼救声规律【感知DC13】',
          '协助布洛克配置净化粉【感知DC14】',
        ]);
        return;
      }

      const wantsBoneMarsh = /前往骨柱湿地|进入骨柱|骨柱湿地|穿过湿地/.test(action);
      if (currentState.frontline_abandoned_outpost_reached && !currentState.kaiya_broken_seals_done && wantsBoneMarsh) {
        blockRoute('凯娅蹲在补给箱前，指尖按住新鲜的切痕：「少了两个封扣。先查清楚这条暗道，不然湿地里会有人替我们收账。」', [
          '让凯娅检查少了两个封扣',
          '检查补给箱封扣与锁痕【智力DC12】',
          '让凯娅判断暗道机关【敏捷DC13】',
        ]);
        return;
      }

      const wantsBoss = /进入黑石根区|黑石根区|黑石深处|黑石门卫|黑石守门者|确认进入黑石根区深处/.test(action);
      if (currentState.pre_boss_rest_done && !currentState.serin_cracked_silver_staff_done && wantsBoss) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        appendStoryLines([
          '瑟琳刚要起身，银杖忽然在黑石脉冲里亮了一下，杖身浮出一道细小裂痕。她下意识把手收紧，脸色比刚才更白。',
        ], 'kp', '主持人', true);
        setCompanionEventId('serin_cracked_silver_staff');
        setSuggestions([]);
        setPhase('narrating');
        setScreen('companion-event');
        return;
      }

      // 孢海据点调查完成 → 进入艾琳支线前置
      if (currentState.outpost_name_list_checked && currentState.patrol_log_checked && !currentState.ailin_wounded_pre_seen && /确认据点调查结果/.test(action)) {
        const preScene = getScriptedScene('ailin-wounded-pre');
        if (preScene) { appendStoryLines([action], 'player', gameState.player_name || '你', true); playScriptedScene(preScene, { focus: false }); }
        return;
      }
      // 艾琳支线入口
      if (currentState.ailin_wounded_pre_seen && /停下协助艾琳救治伤员/.test(action)) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        const sqScene = getScriptedScene('ailin-sidequest');
        if (sqScene) { const ct = getCompanionTrust(currentState,'ailin'); const tp = buildTrustPatch(currentState,{ailin:Math.min(100,ct+15)}); playScriptedScene(sqScene,{focus:false,extraStatePatch:tp}); addEvent('艾琳信任+15','state'); }
        return;
      }
      // 艾琳支线内选择
      if (/帮艾琳记录伤员说出的名字/.test(action) && !currentState.ailin_wounded_names_done) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        const ct = getCompanionTrust(currentState,'ailin'); const tp = buildTrustPatch(currentState,{ailin:Math.min(100,ct+5)});
        const sq = getScriptedScene('ailin-sidequest-complete'); if(sq){playScriptedScene(sq,{focus:false,extraStatePatch:{...tp,player_helped_record_names:true}});addEvent('艾琳信任+5','state');}
        return;
      }
      if (/优先追问第三巡逻队路线/.test(action) && !currentState.ailin_wounded_names_done) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        const sq = getScriptedScene('ailin-sidequest-complete'); if(sq){playScriptedScene(sq,{focus:false,extraStatePatch:{player_prioritized_route_info:true}});}
        return;
      }
      // 无视艾琳→信任-20
      if (/无视伤员继续前进/.test(action)) {
        const ig = getScriptedScene('ignore-ailin');
        if(ig){const ct=getCompanionTrust(currentState,'ailin');const tp=buildTrustPatch(currentState,{ailin:Math.max(0,ct-20)});stateRef.current={...currentState,...tp};setGameState(stateRef.current);appendStoryLines([action],'player',gameState.player_name||'你',true);playScriptedScene(ig,{focus:false});addEvent('艾琳信任-20','state');}
        return;
      }

      // 🔴 固定剧情脚本拦截：不需要AI生成，直接逐条显示
      const scripted = matchScriptedScene(action);
      if (scripted) {
        playScriptedScene(scripted.scene, { playerAction: action });
        return;
      }

      // 酒馆区域：选择玩骰子直接跳转游戏
      const areaText = String(stateRef.current.current_area || '');

      // 云苓商店入口选项：购买药剂 → 打开商店面板
      if (currentState.yunling_shop_unlocked && /^购买药剂$|^购买药$/.test(action.trim())) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        setShowApothecaryShopUI(true);
        setPhase('narrating');
        return;
      }

      // 云苓商店入口选项：返回公会登记
      if (currentState.yunling_shop_unlocked && /返回公会登记/.test(action.trim())) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        setShowApothecaryShopUI(false);
        const registration = getScriptedScene('guild-final-registration');
        if (registration) {
          playScriptedScene(registration, { focus: false });
        }
        return;
      }

      if (areaText.includes('酒馆') && /付\s*100G|付100G|100G购买|购买萨洛的情报|买情报/.test(action)) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        const currentGold = Number(currentState.gold ?? 200);
        const patch: GameState = {
          gold: Math.max(0, currentGold - 100),
          tavern_dice_done: true,
          tavern_info_paid: true,
          tavern_effective_wins: 1,
          tavern_yunling_unlocked: false,
          last_event: '支付100G购买萨洛的队友情报',
        };
        setGameState((prev) => ({ ...prev, ...patch }));
        if (gameId) {
          void patchGameState(gameId, patch).catch((error: any) => addEvent(error.message || '萨洛情报购买状态同步失败', 'error'));
        }
        addEvent('金币 -100', 'state');
        setStory((prev) => {
          const paidLines: StoryLine[] = [
            { id: lineId.current++, role: 'kp' as const, speaker: '萨洛', text: '「痛快。能用金币解决的问题，在这座城里已经算很温柔了。」' },
            { id: lineId.current++, role: 'kp' as const, speaker: '瑟琳', text: '「直接买情报可以节省时间。我们记下重点，然后立刻规划招募路线。」' },
          ];
          setActiveIndex(prev.length);
          return [...prev, ...paidLines];
        });
        const saloIntel = getScriptedScene('salo-companion-intel');
        if (saloIntel) playScriptedScene(saloIntel, { focus: false });
        return;
      }

      if (areaText.includes('酒馆') && /陪.*布洛克.*喝|布洛克.*喝得尽兴|喝酒/.test(action)) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        setShowDrinkingDiceGame(true);
        setPhase('action');
        return;
      }

      if (areaText.includes('酒馆') && /骰子|快艇|赌|玩一局|来一局|试试|接受/.test(action)) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        dicePokerPendingRef.current = action;
        setSuggestions([]);
        setPhase('narrating');
        setShowTavernDice(true);
        return;
      }

      // 黑市区域：幸运盲盒抽钻石
      const wantsLuckyBox = /(?:购买|抽|开启|买).*盲盒/.test(action) || action === '幸运盲盒';
      if (/黑市|补给市场|市场|奥兰|凯娅/.test(areaText) && wantsLuckyBox) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        setShowLuckyBoxGame(true);
        setPhase('action');
        return;
      }

      // 蓝伞浅滩入口拦截：未完成艾琳支线时阻止前往
      if (currentState.spore_outpost_reached && !currentState.ailin_wounded_names_done && !currentState.ailin_request_ignored && /前往蓝伞浅滩|进入蓝伞/.test(action)) {
        blockRoute('艾琳把药箱扣好，朝伤员棚看了一眼：「尼布还在核对浅滩路线。给我这段时间确认污染程度，至少别让我们把一个能说话的线索留在身后。」', ['陪艾琳去伤员棚确认污染情况','判断伤员污染程度【医疗DC12】','整理阵亡者木牌与伤员名册【智力DC13】']);
        return;
      }

      // ====== 深层主线触发：蓝伞浅滩前置→战斗 ======
      if (currentState.spore_outpost_reached && !currentState.blue_shoal_battle_done && /前往蓝伞浅滩|进入蓝伞|蓝伞浅滩|穿过浅滩/.test(action)) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        const encounterConfig = getEncounterConfigById('blue-shoal');
        const enterScene = getScriptedScene('enter-blue-shoal');
        if (enterScene && !currentState.enter_blue_shoal_played) {
          playScriptedScene(enterScene, { focus: false, extraStatePatch: { enter_blue_shoal_played: true } });
        } else if (encounterConfig) queueEncounterPrep(encounterConfig, currentState);
        return;
      }

      // ====== 深层主线触发：骨柱湿地战斗 ======
      if (currentState.kaiya_broken_seals_done
          && !currentState.bone_marsh_battle_done
          && /前往骨柱湿地|进入骨柱|骨柱湿地|穿过湿地/.test(action)) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        const encounterConfig = getEncounterConfigById('bone-pillar-wetland');
        if (encounterConfig) queueEncounterPrep(encounterConfig, currentState);
        return;
      }

      // ====== 深层主线触发：莱因选择 ======
      if (currentState.rhein_encounter_started && /帮助莱因|帮助.*莱因/.test(action)) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        setHelpedRhein(true);
        const currentTrustAl = getCompanionTrust(currentState, 'ailin');
        const currentTrustSl = getCompanionTrust(currentState, 'serin');
        const trustPatch = buildTrustPatch(currentState, {
          ailin: Math.min(100, Math.max(0, currentTrustAl + 4)),
          serin: Math.min(100, Math.max(0, currentTrustSl + 2)),
        });
        patchStateNow({
          helpedRhein: true,
          rhein_rescued_noncombat: true,
          ...trustPatch,
          currentNodeId: 'pre_boss_rest_intro',
          last_event: '帮助莱因，带他继续前进。艾琳和瑟琳对你的决定表示认可。',
        }, '莱因选择状态同步失败');
        addEvent('艾琳信任 +4', 'state');
        addEvent('瑟琳信任 +2', 'state');
        const preBoss = getScriptedScene('pre-boss-rest');
        if (preBoss) playScriptedScene(preBoss, { focus: false });
        return;
      }
      if (currentState.rhein_encounter_started && /无视莱因|不管莱因|不帮莱因|无视.*莱因/.test(action)) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        setHelpedRhein(false);
        const currentTrustAl = getCompanionTrust(currentState, 'ailin');
        const currentTrustKl = getCompanionTrust(currentState, 'kaiya');
        const trustPatch = buildTrustPatch(currentState, {
          ailin: Math.min(100, Math.max(0, currentTrustAl - 6)),
          kaiya: Math.min(100, Math.max(0, currentTrustKl + 1)),
        });
        patchStateNow({
          helpedRhein: false,
          rhein_rescued_noncombat: false,
          ...trustPatch,
          currentNodeId: 'pre_boss_rest_intro',
          last_event: '无视莱因，继续向黑石根区前进。艾琳沉默良久，凯娅却对效率表示满意。',
        }, '莱因选择状态同步失败');
        addEvent('艾琳信任 -6', 'state');
        addEvent('凯娅信任 +1', 'state');
        const preBoss = getScriptedScene('pre-boss-rest');
        if (preBoss) playScriptedScene(preBoss, { focus: false });
        return;
      }

      // ====== 深层主线触发：Boss 战 ======
      if (currentState.serin_cracked_silver_staff_done && !currentState.boss_defeated && /进入黑石根区|黑石根区|黑石深处|黑石门卫/.test(action)) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        const encounterConfig = getEncounterConfigById('boss-gatekeeper');
        if (encounterConfig) queueEncounterPrep(encounterConfig, currentState);
        else startDeepBattle('boss_blackstone_gatekeeper', undefined, () => {
            patchStateNow({
              act1_ending: 'ending_bad_time_reset',
              act1_ending_title: '逆时归零',
              endingId: 'ending_bad_time_reset',
              currentNodeId: 'ending_bad_time_reset',
              blackstone_gatekeeper_result: 'lose',
            }, 'Boss失败结局状态同步失败');
            const titleTimer = window.setTimeout(() => {
              setScreen('main-menu');
            }, 2000);
            eventTimersRef.current.push(titleTimer);
            setSuggestions(makeSuggestions(['[第一幕结束 · 逆时归零]']));
            setPhase('narrating');
          });
        return;
      }

      // ====== 深层主线触发：Boss核心选择 ======
      if (currentState.core_choice_pending && /破坏核心|强行开路|破坏.*核心/.test(action)) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        setBossCoreChoice('destroy');
        patchStateNow({ bossCoreChoice: 'destroy' }, 'Boss核心选择状态同步失败');
        routeAct1Ending('destroy');
        return;
      }
      if (currentState.core_choice_pending && /稳定核心|保留封印|稳定.*核心/.test(action)) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        setBossCoreChoice('stabilize');
        patchStateNow({ bossCoreChoice: 'stabilize' }, 'Boss核心选择状态同步失败');
        routeAct1Ending('stabilize');
        return;
      }

      setOpeningActionTutorialDismissed(true);

      // 自我介绍也是 player 消息，不能用聊天记录判断是否已经完成首次战前行动。
      const firstChoice = Boolean(currentState.tutorial_battle_pending && !currentState.first_choice_resolved);
      const retreatChoice = RETREAT_ACTION_RE.test(action);
      const shouldPrepareTutorialBattle = firstChoice;
      const actionForResolution = resumedSelection ? action.replace(/【[^】]+】/g, '').trim() : action;

      const forcedBattleAction = retreatChoice
        ? `${actionForResolution}。瑟琳立刻用银杖封住后撤路线，提醒队伍不能把裂隙爬兽放进人群，必须就地迎击最近的敌人`
        : actionForResolution;
      // SelectionActionCheck 已完成并锁定结果时，禁止旧教学流程再次强制投骰。
      const baseResolvedAction = shouldPrepareTutorialBattle && !resumedSelection
        ? ensureFirstBattleCheck(forcedBattleAction)
        : forcedBattleAction;
      const resolvedActionBase = forcedStageAdvanceScene
        ? withStageLimitDirective(baseResolvedAction, stageLimitNextAction || forcedStageAdvanceScene.triggers[0] || forcedStageAdvanceScene.id)
        : baseResolvedAction;
      const resolvedAction = `${resolvedActionBase}${resumedSelection?.lockedPrompt || ''}`;

      rewardNoticeDeferRef.current = true;
      queuedRewardNoticesRef.current = [];
      deferredSystemEventsRef.current = [];
      abortRef.current?.abort();
      parserRef.current = createNarrativeStreamParser();
      streamSuggestionsRef.current = [];
      diceFiredRef.current = false; // 重置骰子锁
      tutorialBattleIntentRef.current = shouldPrepareTutorialBattle;
      const lockedStoryCheck = resumedSelection ? stateRef.current.lastStoryCheckResult : null;
      tutorialBattleDiceRef.current = lockedStoryCheck?.finalRoll
        ? storyCheckDiceResult({
            d20: lockedStoryCheck.finalRoll.d20,
            modifier: lockedStoryCheck.modifier,
            total: lockedStoryCheck.finalRoll.total,
            dc: lockedStoryCheck.dc,
            skill: lockedStoryCheck.skillName,
          })
        : null;
      tutorialBattleActionRef.current = shouldPrepareTutorialBattle ? action : '';
      let streamedNarrativeLineCount = 0;
      setPhase('narrating');
      setStreaming(true);
      setSuggestions([]);
      setPendingTutorialBattleSetup(null);
      setPendingTutorialBattleSummary([]);
      appendStoryLines([action], 'player', gameState.player_name || '你', true);

      abortRef.current = runtime.streamAction(gameId, resolvedAction, {
        onNarrative: (chunk) => {
          const parsed = parserRef.current.push(chunk);
          if (parsed.suggestions.length) streamSuggestionsRef.current = parsed.suggestions;
          if (parsed.lines.length) {
            streamedNarrativeLineCount += parsed.lines.length;
            appendStoryLines(parsed.lines, 'kp', '主持人');
          }
        },
        onSuggestions: (items) => {
          streamSuggestionsRef.current = items;
          setSuggestions(constrainActionSuggestions(stateRef.current, items));
        },
        onSystem: (rawEvent) => {
          const parsed = runtime.parseSystemEvent(rawEvent);
          if (!parsed) return;
          // 已有锁定的选择行动结果时，丢弃后端遗留的重复技能检定事件。
          if (resumedSelection && parsed.type === 'skill_check') return;
          const message = runtime.formatSystemEvent(parsed);
          if (message) {
            deferredSystemEventsRef.current.push({
              message,
              tone: parsed.type === 'error' ? 'error' : 'dice',
            });
          }
          // 骰子动画：每轮最多触发一次
          if (!diceFiredRef.current && (parsed.type === 'skill_check' || parsed.type === 'attack_roll')) {
            diceFiredRef.current = true;
            if (tutorialBattleIntentRef.current) tutorialBattleDiceRef.current = parsed;
            setDiceRoll(parsed);
          }
        },
        onStateUpdate: (change) => {
          applyRuntimeStateChange(change);
        },
        onDone: () => {
          const parsed = parserRef.current.flush();
          if (parsed.suggestions.length) streamSuggestionsRef.current = parsed.suggestions;
          if (parsed.lines.length) {
            streamedNarrativeLineCount += parsed.lines.length;
            appendStoryLines(parsed.lines, 'kp', '主持人');
          }
          flushDeferredSystemEvents();
          if (tutorialBattleIntentRef.current) {
            const setup = buildTutorialBattleSetup(tutorialBattleDiceRef.current, tutorialBattleActionRef.current);
            setPendingTutorialBattleSetup(setup);
            appendStoryLines(setup.dialogueLines, 'system', '系统', true);
            setGameState((prev) => ({
              ...prev,
              first_choice_resolved: true,
              tutorial_battle_pending: false,
              current_area: '逆穹悬城·主缆街',
              last_event: '开局判定完成，进入教学战斗',
            }));
            addEvent('开局判定将影响战斗', 'state');
            setSuggestions([]);
            setPhase('narrating');
            const enterTutorialBattleTimer = window.setTimeout(() => {
              setScreen('tutorial-battle');
            }, 3000);
            eventTimersRef.current.push(enterTutorialBattleTimer);
          } else if (forcedStageAdvanceScene) {
            playScriptedScene(forcedStageAdvanceScene, { focus: false });
          } else {
            setSuggestions(constrainActionSuggestions(stateRef.current, streamSuggestionsRef.current));
          }

          // 酒馆区域：瑟琳提示后，显示固定两个选项
          const areaText = String(stateRef.current.current_area || '');
          if (
            areaText.includes('酒馆') &&
            !dicePokerAutoTriggeredRef.current &&
            !streaming
          ) {
            const recentText = story.slice(-6).map((l) => l.text).join('') + parsed.lines.join('');
            if (/瑟琳.*偷看|偷看.*骰|偷看.*牌|悄悄.*告诉|我能看到.*骰|透视.*骰|看穿.*骰|窥看/.test(recentText)) {
              dicePokerAutoTriggeredRef.current = true;
              setSuggestions(makeSuggestions(['接受游戏', '付100G购买萨洛的情报']));
            }
          }

          setStreaming(false);
        },
        onError: (error) => {
          const rawMessage = String(error || '').trim();
          const message = /connection\s*error|failed\s*to\s*fetch|network\s*error|networkerror|timeout|timed\s*out|econn|socket/i.test(rawMessage)
            ? '主持人暂时没有回应，已为本轮处理启用兜底。'
            : rawMessage || '主持人暂时没有回应，已为本轮处理启用兜底。';
          setStreaming(false);
          addEvent(message, 'state');
          flushDeferredSystemEvents();
          appendStoryLines([message], 'system', '系统');
          if (tutorialBattleIntentRef.current) {
            const fallbackSetup = buildTutorialBattleSetup(null, tutorialBattleActionRef.current);
            setPendingTutorialBattleSetup(fallbackSetup);
            setPendingTutorialBattleSummary(fallbackSetup.dialogueLines);
            setGameState((prev) => ({
              ...prev,
              first_choice_resolved: true,
              tutorial_battle_pending: false,
              current_area: '逆穹悬城·主缆街',
              last_event: '主持人兜底后进入教学战斗',
            }));
            setSuggestions([]);
            setPhase('narrating');
            const enterTutorialBattleTimer = window.setTimeout(() => {
              setScreen('tutorial-battle');
            }, 3000);
            eventTimersRef.current.push(enterTutorialBattleTimer);
          } else {
            setSuggestions(constrainActionSuggestions(stateRef.current));
          }
        },
      }, { visibleMessage: action });
    },
    [addEvent, appendStoryLines, applyRuntimeStateChange, flushDeferredSystemEvents, gameId, gameState.player_name, pendingTutorialBattleSetup, playScriptedScene, runtime, story, streaming, suggestions],
  );

  const handleSelectionActionReroll = useCallback((itemId: RerollItemId, chosenD20?: number) => {
    if (!selectionActionCheck) return;
    try {
      const nextState = selectionActionCheck.reroll(itemId, stateRef.current, chosenD20);
      stateRef.current = nextState;
      setGameState(nextState);
      setSelectionActionCheckVersion((version) => version + 1);
      setBattlePrepDice(selectionActionCheck.result.roll ? storyCheckDiceResult(selectionActionCheck.result.roll) : null);
      if (gameId) void patchGameState(gameId, { inventory: nextState.inventory }).catch(() => {});
    } catch (error: any) { addEvent(error.message || '重投失败', 'error'); }
  }, [addEvent, gameId, selectionActionCheck]);

  const handleSelectionActionConfirm = useCallback(() => {
    if (!selectionActionCheck) return;
    const result = selectionActionCheck.finalize();
    const nextState = { ...stateRef.current, lastStoryCheckResult: result.storyCheck, lastRerollUsed: Boolean(result.storyCheck?.rerollUsed),
      lastRerollItemId: result.storyCheck?.reroll?.itemId || null };
    stateRef.current = nextState;
    setGameState(nextState);
    selectionActionResumeRef.current = { action: selectionActionCheck.actionText, lockedPrompt: selectionActionCheck.lockedPrompt };
    const action = selectionActionCheck.actionText;
    setSelectionActionCheck(null);
    setBattlePrepDice(null);
    window.setTimeout(() => submitAction(action), 0);
  }, [selectionActionCheck, submitAction]);

  const handleBargainComplete = useCallback(
    (result: BargainCompleteResult) => {
      setShowBargainGame(false);

      const current = stateRef.current;
      const currentGold = Number(current.gold ?? 200);
      const inventoryText = String(current.inventory || '长剑,冒险者工具包');
      const nextInventory = inventoryText.includes(result.itemName)
        ? inventoryText
        : `${inventoryText},${result.itemName}`;
      const nextGold = Math.max(0, currentGold - result.finalPrice);
      const purchasePatch: GameState = {
        gold: nextGold,
        inventory: nextInventory,
        blackmarket_done: true,
        blackmarket_purchase_item: result.itemName,
        blackmarket_purchase_price: result.finalPrice,
        last_event: `完成黑市采购：${result.itemName}，成交价${result.finalPrice}金`,
      };

      addEvent(`获得 ${result.itemName}`, 'state');
      addEvent(`金币 -${result.finalPrice}`, 'state');

      const completeScene = getScriptedScene('blackmarket-complete');
      if (completeScene) {
        playScriptedScene(completeScene, {
          playerAction: '确认购买后前往降渊缆梯',
          extraStatePatch: purchasePatch,
        });
        return;
      }

      setGameState((prev) => ({ ...prev, ...purchasePatch }));
      if (gameId) {
        void patchGameState(gameId, purchasePatch).catch((error: any) => {
          addEvent(error.message || '黑市采购状态同步失败', 'error');
        });
      }
    },
    [addEvent, gameId, playScriptedScene],
  );

  const handleDrinkingDiceComplete = useCallback(
    (result: DrinkingDiceResult) => {
      setShowDrinkingDiceGame(false);
      const outcome = result.trustGain >= 12 ? 'decisive' : result.trustGain >= 8 ? 'narrow' : 'fail';
      const current = stateRef.current;
      const currentTrust = getCompanionTrust(current, 'brock');
      const delta = Number(result.trustGain || 0);

      // 使用 buildTrustPatch 确保所有别名同步
      const trustPatch = buildTrustPatch(current, { brock: currentTrust + delta });
      const patch: GameState = {
        ...trustPatch,
        sl_recruited: true,
        brock_recruited: true,
        brock_drinking_done: true,
        brock_drinking_rounds: result.totalRounds,
        brock_drinking_trust_gain: delta,
        brock_drinking_logs: result.logs,
        brock_drinking_outcome: outcome,
        brock_spore_sample_deal: true,
        last_event: `与布洛克喝酒挑战：${result.totalRounds}回合喝完${delta > 0 ? `，布洛克信任+${delta}` : ''}`,
      };
      setGameState((prev) => ({ ...prev, ...patch }));
      addEvent('布洛克加入队伍', 'state');
      if (delta > 0) addEvent(`布洛克信任 ${delta > 0 ? '+' : ''}${delta}`, 'state');

      // 根据胜负展示不同对话（含信任反馈）
      const trustNote = outcome === 'decisive'
        ? '布洛克对你另眼相看——不是每个公会来的人都能这么快压住他的铁锅烈酒。'
        : outcome === 'narrow'
        ? '布洛克嘴上挑刺，但心里已经把你从"普通公会蠢货"的名单里划掉了。'
        : '布洛克没多夸你，但他也没多骂——对一个刚认识的外来人，这已经是他的尊重。';

      const lines: Array<{ speaker: string; text: string }> = [
        { speaker: '主持人', text: `最后一口烈酒落下时，酒桌旁短暂安静了一瞬。你用了 ${result.totalRounds} 回合把布洛克推来的酒喝见底。` },
        { speaker: '布洛克', text: result.finalDialogue },
        { speaker: '布洛克', text: '「我跟你们走。条件再说一遍：采集三份活性孢子，不准焚烧菌巢，也不准把活样本扔进城市排水沟。」' },
        { speaker: '瑟琳', text: '「报酬由公会结算，样本归属也会写进附约。」' },
        { speaker: '布洛克', text: outcome === 'fail' ? '「酒量就先不夸了。不过你至少没把杯子扣我桌上。下去以后听我指挥，别看见发光的东西就伸手。」' : '「好，进了孢海以后听我指挥，别看见发光的东西就伸手。」' },
        { speaker: '主持人', text: `布洛克收起菌片，将铁锅挂在背包外侧。${trustNote}` },
      ];

      const storyLines = lines.map((line) => ({
        id: lineId.current++,
        role: 'kp' as const,
        speaker: line.speaker,
        text: line.text,
      }));
      setStory((prev) => [...prev, ...storyLines]);
      setActiveIndex((prev) => prev);
      setSuggestions(makeSuggestions([
        '前往黑市寻找凯娅',
        '请布洛克说明活性孢子样本的安全采集法【感知DC12】',
        '整理当前队伍分工',
      ]));
      setPhase('narrating');

      if (gameId) {
        void patchGameState(gameId, patch).catch((error: any) => addEvent(error.message || '布洛克入队状态同步失败', 'error'));
      }
    },
    [addEvent, gameId],
  );

  const handleOrlanBoxComplete = useCallback(
    (result: OrlanBoxResult) => {
      setShowLuckyBoxGame(false);
      const current = stateRef.current;
      const currentGold = Number(current.gold ?? 200);
      const hasDiamond = Boolean(result.hasDiamond || result.rewards.some((reward) => reward.itemId === 'diamond'));

      // 从 rewards 构建背包物品列表
      const inventoryText = String(current.inventory || '长剑,冒险者工具包');
      let nextInventory = inventoryText;
      for (const reward of result.rewards) {
        nextInventory = nextInventory ? `${nextInventory},${reward.name}` : reward.name;
      }

      // 事件消息
      for (const reward of result.rewards) {
        addEvent(`获得 ${reward.name}`, 'state');
      }
      if (result.spent) addEvent(`金币 -${result.spent}`, 'state');

      const basePatch: GameState = {
        gold: Math.max(0, currentGold - result.spent),
        inventory: nextInventory,
        lucky_box_done: true,
        lucky_box_attempts: result.drawCount,
        lucky_box_spent: result.spent,
        lucky_box_final_roll: result.finalD20,
        lucky_box_guaranteed: result.guaranteed,
      };

      if (result.failedNoGoldNoDiamond && !hasDiamond) {
        const currentTrust = getCompanionTrust(current, 'kaiya');
        const trustPatch = buildTrustPatch(current, { kaiya: currentTrust - 40 });
        const patch: GameState = {
          ...basePatch,
          ...trustPatch,
          orlanBoxFailedNoGoldNoDiamond: true,
          lucky_box_failed_no_gold_no_diamond: true,
          gotDiamondForKaiya: false,
          kaiya_diamond_paid: false,
          kaiya_joined_with_debt: true,
          last_event: `奥兰幸运盲盒失败，金币耗尽且没有获得钻石；凯娅负债入队，信任-40`,
        };

        addEvent('凯娅信任 -40', 'state');
        const debtScene = getScriptedScene('kaiya-recruited-with-debt');
        if (debtScene) {
          playScriptedScene(debtScene, { extraStatePatch: patch });
          if (current.tavern_yunling_unlocked) {
            const yunlingScene = getScriptedScene('yunling-black-market');
            if (yunlingScene) {
              const yunlingInventory = `${nextInventory},治疗药水x3`;
              playScriptedScene(yunlingScene, {
                focus: false,
                extraStatePatch: {
                  inventory: yunlingInventory,
                  yunling_free_healing_potions: 3,
                  last_event: '根据萨洛额外情报找到云苓并获得三瓶治疗药水',
                },
                dynamicHints: YUNLING_SHOP_HINTS,
              });
            }
          }
          return;
        }

        setGameState((prev) => ({ ...prev, ...patch, kl_recruited: true, kaiya_recruited: true }));
        if (gameId) {
          void patchGameState(gameId, { ...patch, kl_recruited: true, kaiya_recruited: true }).catch((error: any) => addEvent(error.message || '凯娅负债入队状态同步失败', 'error'));
        }
        return;
      }

      const patch: GameState = {
        ...basePatch,
        gotDiamondForKaiya: hasDiamond,
        kaiya_diamond_paid: hasDiamond,
        last_event: `奥兰幸运盲盒抽到钻石，共${result.drawCount}次，花费${result.spent}金`,
      };

      const scene = getScriptedScene('kaiya-recruited');
      if (scene) {
        playScriptedScene(scene, { extraStatePatch: patch });
        if (current.tavern_yunling_unlocked) {
          const yunlingScene = getScriptedScene('yunling-black-market');
          if (yunlingScene) {
            const yunlingInventory = `${nextInventory},治疗药水x3`;
            playScriptedScene(yunlingScene, {
              focus: false,
              extraStatePatch: {
                inventory: yunlingInventory,
                yunling_free_healing_potions: 3,
                last_event: '根据萨洛额外情报找到云苓并获得三瓶治疗药水',
              },
              dynamicHints: YUNLING_SHOP_HINTS,
            });
          }
        }
        return;
      }
      setGameState((prev) => ({ ...prev, ...patch }));
      if (gameId) {
        void patchGameState(gameId, patch).catch((error: any) => addEvent(error.message || '凯娅入队状态同步失败', 'error'));
      }
    },
    [addEvent, gameId, playScriptedScene],
  );

  // 云苓药铺：处理购买
  const handleApothecaryPurchase = useCallback(
    (itemId: string, name: string, price: number, stat?: string) => {
      const current = stateRef.current;
      const currentGold = Number(current.gold ?? 200);
      if ((stat || itemId === 'purification_heart') && (current[`yunling_${itemId}_bought`] || (itemId === 'purification_heart' && current.purification_heart_owned))) {
        return;
      }

      const inventoryText = String(current.inventory || '长剑,冒险者工具包');
      const nextInventory =
        itemId === 'purification_heart' && inventoryText.includes(name)
          ? inventoryText
          : `${inventoryText},${name}`;

      const patch: GameState = {
        gold: Math.max(0, currentGold - price),
        inventory: nextInventory,
        [`yunling_${itemId}_bought`]: true,
        last_event: `在云苓处购买${name}`,
      };

      if (stat) {
        patch[stat] = Number(current[stat] ?? 10) + 2;
      } else if (itemId === 'healing_potion') {
        const maxHp = Number(current.max_hp ?? current.current_hp ?? 20);
        const curHp = Number(current.current_hp ?? 20);
        patch.current_hp = Math.min(maxHp, curHp + 5);
      } else if (itemId === 'purification_heart') {
        patch.purification_heart_owned = true;
      }

      setGameState((prev) => ({ ...prev, ...patch }));
      addEvent(`金币 -${price}`, 'state');
      addEvent(`获得 ${name}`, 'state');

      if (gameId) {
        void patchGameState(gameId, patch).catch(
          (error: any) => addEvent(error.message || '云苓药水状态同步失败', 'error'),
        );
      }
    },
    [addEvent, gameId],
  );

  // 云苓药铺：离开 → 播放云苓告别固定剧情 → 自动进入公会登记
  const handleApothecaryExit = useCallback(() => {
    setShowApothecaryShopUI(false);
    const farewell = getScriptedScene('yunling-farewell');
    if (farewell) {
      const currentInv = String(stateRef.current.inventory || '');
      const nextInv = addInventoryQuantity(currentInv, '云苓的护身符', 1);
      playScriptedScene(farewell, {
        extraStatePatch: { inventory: nextInv, yunling_farewell_done: true },
        focus: false,
      });
    } else {
      const registration = getScriptedScene('guild-final-registration');
      if (registration) {
        appendStoryLines(['返回公会登记'], 'player', gameState.player_name || '你', true);
        playScriptedScene(registration, { focus: false });
      }
    }
  }, [appendStoryLines, gameState.player_name, playScriptedScene]);

  // ====== 深层战斗辅助函数 ======

  // 用 ref 存回调，避免闭包陈旧引用
  const deepBattleWinRef = useRef<(() => void) | null>(null);
  const deepBattleLoseRef = useRef<(() => void) | null>(null);

  const startDeepBattle = useCallback(
    (battleId: string, onWin?: () => void, onLose?: () => void) => {
      deepBattleWinRef.current = onWin || null;
      deepBattleLoseRef.current = onLose || null;
      setDeepBattleId(battleId);
      setSuggestions([]);
      setPhase('narrating');
      setScreen('deep-battle');
    },
    [],
  );

  const handleDeepBattleComplete = useCallback(
    (result?: { outcome: 'win' | 'lose' }) => {
      const currentBattleId = deepBattleId || stateRef.current.currentBattleId;
      const config = currentEncounterConfigRef.current
        || getEncounterConfigById(stateRef.current.currentEncounterId)
        || getEncounterConfigByBattleId(currentBattleId);
      setDeepBattleId('');
      if (result?.outcome === 'win') {
        if (!config) {
          addEvent(`战后剧情缺失：${currentBattleId || '未知战斗'}`, 'error');
          appendStoryLines(['战后剧情缺失。'], 'system', '系统', true);
          setScreen('game');
          setPhase('narrating');
          return;
        }

        const winPatch: GameState = {
          flags: {
            ...(stateRef.current.flags || {}),
            [config.battleDoneFlag]: true,
          },
          [config.battleDoneFlag]: true,
          currentBattleId: null,
          currentEncounterId: null,
          currentSceneId: config.afterSceneId,
          nextAfterBattleSceneId: null,
          encounterPhase: 'afterScene',
        };
        if (config.encounterId === 'blue-shoal') {
          winPatch.completedBlueShoalBattle = true;
          winPatch.battle_blue_shoal_result = 'win';
          winPatch.currentNodeId = 'sidequest_brock_echo_grove';
        }
        if (config.encounterId === 'bone-pillar-wetland') {
          winPatch.completedBoneMarshBattle = true;
          winPatch.battle_bone_marsh_result = 'win';
        }
        if (config.encounterId === 'boss-gatekeeper') {
          winPatch.bossDefeated = true;
          winPatch.blackstone_gatekeeper_result = 'win';
        }
        stateRef.current = { ...stateRef.current, ...winPatch };
        setGameState((prev) => ({ ...prev, ...winPatch }));
        if (gameId) {
          void patchGameState(gameId, winPatch).catch((error: any) => addEvent(error.message || '战斗胜利状态同步失败', 'error'));
        }
        setScreen('game');
        const afterScene = getScriptedScene(config.afterSceneId);
        if (afterScene) {
          playScriptedScene(afterScene, { focus: true });
        } else {
          addEvent(`战后剧情缺失：${config.afterSceneId}`, 'error');
          appendStoryLines(['战后剧情缺失。'], 'system', '系统', true);
          setPhase('narrating');
        }
      } else {
        deepBattleLoseRef.current?.();
        setScreen('game');
      }
      deepBattleWinRef.current = null;
      deepBattleLoseRef.current = null;
      currentEncounterConfigRef.current = null;
    },
    [addEvent, appendStoryLines, deepBattleId, gameId, playScriptedScene],
  );

  // ====== 战前行动 ======

  const handleBattlePrepResolve = useCallback(
    (choice: BattlePrepChoice, result: BattlePrepResolveResult) => {
      const config = currentEncounterConfigRef.current || getEncounterConfigById(stateRef.current.currentEncounterId);
      if (!config) {
        addEvent('战前行动缺少遭遇配置', 'error');
        return;
      }
      battlePrepResultRef.current = result;
      setBattlePrepNarration('');
      setBattlePrepNarrating(false);
      setBattlePrepNarrationDone(false);
      // 初投只保存待确认结果，不能提前应用战斗效果。
      const baseState = battlePrepStateRef.current || stateRef.current;
      const nextState = { ...baseState, lastBattlePrepChoice: choice.id, selectedPrepActionId: choice.id,
        lastPrepResult: result, lastStoryCheckResult: result.storyCheck || null, encounterPhase: 'prepConfirm' };
      battlePrepStateRef.current = nextState;
      stateRef.current = nextState;
      setGameState(nextState);
      // 同步到后端
      if (gameId) {
        void patchGameState(gameId, {
          lastBattlePrepChoice: nextState.lastBattlePrepChoice,
          selectedPrepActionId: nextState.selectedPrepActionId,
          lastPrepResult: nextState.lastPrepResult,
          currentEncounterId: nextState.currentEncounterId,
          currentBattleId: nextState.currentBattleId,
          nextAfterBattleSceneId: nextState.nextAfterBattleSceneId,
          lastStoryCheckResult: nextState.lastStoryCheckResult,
          encounterPhase: nextState.encounterPhase,
          last_event: `战前行动初次判定：${choice.label} — 等待确认`,
        }).catch(() => {});
      }
      // 显示骰子结果
      if (result.roll) {
        setBattlePrepDice(storyCheckDiceResult(result.roll));
      }
    },
    [addEvent, gameId],
  );

  const handleBattlePrepReroll = useCallback((itemId: RerollItemId, chosenD20?: number) => {
    const result = battlePrepResultRef.current;
    const choices = pendingBattlePrepRef.current;
    const choice = choices?.find((item) => item.id === stateRef.current.lastBattlePrepChoice);
    if (!result || !choice) return;
    try {
      const outcome = itemId === 'fiction-dice'
        ? useFictionDice(choice, result, stateRef.current)
        : useOmniDice(choice, result, stateRef.current, chosenD20 ?? 0);
      const nextState = { ...outcome.state, lastPrepResult: outcome.result, lastStoryCheckResult: outcome.result.storyCheck };
      battlePrepResultRef.current = outcome.result;
      battlePrepStateRef.current = nextState;
      stateRef.current = nextState;
      setGameState(nextState);
      if (outcome.result.roll) setBattlePrepDice(storyCheckDiceResult(outcome.result.roll));
      if (gameId) void patchGameState(gameId, { inventory: nextState.inventory, lastPrepResult: outcome.result, lastStoryCheckResult: outcome.result.storyCheck }).catch(() => {});
    } catch (error: any) { addEvent(error.message || '重投失败', 'error'); }
  }, [addEvent, gameId]);

  const handleBattlePrepConfirm = useCallback(() => {
    if (battlePrepNarrating || battlePrepNarrationDone) return;
    const config = currentEncounterConfigRef.current || getEncounterConfigById(stateRef.current.currentEncounterId);
    const choice = pendingBattlePrepRef.current?.find((item) => item.id === stateRef.current.lastBattlePrepChoice);
    const pending = battlePrepResultRef.current;
    if (!config || !choice || !pending) return;
    const result = finalizeBattlePrepResult(choice, pending);
    const nextState = applyBattlePrepEffect(battlePrepStateRef.current || stateRef.current, choice, result, {
      prepDoneFlag: config.prepDoneFlag, encounterId: config.encounterId, battleId: config.battleId, afterSceneId: config.afterSceneId,
    });
    nextState.lastStoryCheckResult = result.storyCheck || null;
    nextState.lastRerollUsed = Boolean(result.storyCheck?.rerollUsed);
    nextState.lastRerollItemId = result.storyCheck?.reroll?.itemId || null;
    nextState.encounterPhase = 'aiNarration';
    nextState.lastPrepNarration = '';
    nextState.lastPrepNarrationDone = false;
    battlePrepResultRef.current = result;
    battlePrepStateRef.current = nextState;
    stateRef.current = nextState;
    setGameState(nextState);
    setBattlePrepNarration('');
    setBattlePrepNarrating(true);
    setBattlePrepNarrationDone(false);
    const log = getBattlePrepLog(choice.id, result.result);
    if (log) addEvent(log, 'state');
    if (gameId) void patchGameState(gameId, { flags: nextState.flags, battleEffects: nextState.battleEffects, lastPrepResult: result,
      lastStoryCheckResult: result.storyCheck || null, lastRerollUsed: nextState.lastRerollUsed, lastRerollItemId: nextState.lastRerollItemId,
      encounterPhase: nextState.encounterPhase, selectedPrepActionId: choice.id, last_event: `战前行动：${choice.label} — ${result.result}` }).catch(() => {});
    const check = result.storyCheck;
    void fetchStoryCheckNarration({
      encounter_id: config.encounterId, action_id: choice.id, action_label: choice.label, action_desc: choice.desc,
      skill_name: check?.skillName || choice.check?.skill || '', dc: check?.dc || choice.check?.dc || 0,
      modifier: check?.modifier || 0, initial_roll: check?.initialRoll || {}, reroll: check?.reroll || null,
      final_roll: check?.finalRoll || {}, final_success: check?.finalRoll.success ?? result.result !== 'failed',
      reroll_used: Boolean(check?.rerollUsed), reroll_item_id: check?.reroll?.itemId || null,
      current_area: String(nextState.current_area || ''),
    }).then((narration) => {
      const completeNarration = narration || result.text;
      setBattlePrepNarration(completeNarration);
      setBattlePrepNarrating(false);
      setBattlePrepNarrationDone(true);
      const readyState = { ...stateRef.current, encounterPhase: 'battlePending', lastPrepNarration: completeNarration, lastPrepNarrationDone: true };
      stateRef.current = readyState;
      battlePrepStateRef.current = readyState;
      setGameState(readyState);
      if (gameId) void patchGameState(gameId, { encounterPhase: 'battlePending', lastPrepNarration: completeNarration, lastPrepNarrationDone: true }).catch(() => {});
    }).catch((error: any) => {
      const fallback = result.text;
      setBattlePrepNarration(fallback);
      setBattlePrepNarrating(false);
      setBattlePrepNarrationDone(true);
      const readyState = { ...stateRef.current, encounterPhase: 'battlePending', lastPrepNarration: fallback, lastPrepNarrationDone: true };
      stateRef.current = readyState;
      battlePrepStateRef.current = readyState;
      setGameState(readyState);
      addEvent(error.message || 'AI续写失败，已使用兜底文本', 'state');
    });
  }, [addEvent, battlePrepNarrating, battlePrepNarrationDone, gameId]);

  const handleBattlePrepEnterBattle = useCallback(() => {
    if (!battlePrepResultRef.current?.finalized || !battlePrepNarrationDone || battlePrepNarrating) {
      addEvent('请等待战前续写完整结束', 'state');
      return;
    }
    const config = currentEncounterConfigRef.current || getEncounterConfigById(stateRef.current.currentEncounterId);
    if (!config) {
      addEvent('无法进入战斗：遭遇配置缺失', 'error');
      return;
    }
    const battlePatch: GameState = {
      currentEncounterId: config.encounterId,
      currentBattleId: config.battleId,
      nextAfterBattleSceneId: config.afterSceneId,
      encounterPhase: 'battleRunning',
    };
    stateRef.current = { ...stateRef.current, ...battlePatch };
    setGameState((prev) => ({ ...prev, ...battlePatch }));
    if (gameId) {
      void patchGameState(gameId, battlePatch).catch((error: any) => addEvent(error.message || '战斗状态同步失败', 'error'));
    }

    setShowBattlePrepPanel(false);
    setBattlePrepDice(null);
    setBattlePrepNarration('');
    setBattlePrepNarrating(false);
    setBattlePrepNarrationDone(false);
    pendingBattlePrepRef.current = null;
    battlePrepResultRef.current = null;
    battlePrepStateRef.current = null;

    if (config.battleId === 'tutorial-crawler-battle') {
      setPendingTutorialBattleSetup(null);
      setPendingTutorialBattleSummary([]);
      setScreen('tutorial-battle');
      return;
    }

    const onLose = () => {
      if (config.encounterId === 'bone-pillar-wetland') {
        appendStoryLines([
          '骨柱湿地的敌群把队伍压回废弃据点方向。凯娅重新确认暗道补给，布洛克提醒你们下一次必须更快通过湿地中心。',
        ], 'kp', '主持人', true);
        setSuggestions(makeSuggestions(['前往骨柱湿地', '确认骨柱湿地的怪物活动【感知DC13】', '追踪拖拽痕迹前往骨柱湿地【感知DC13】']));
        setPhase('narrating');
        return;
      }
      if (config.encounterId === 'boss-gatekeeper') {
        const losePatch: GameState = {
          act1_ending: 'ending_bad_time_reset',
          act1_ending_title: '逆时归零',
          endingId: 'ending_bad_time_reset',
          currentNodeId: 'ending_bad_time_reset',
          blackstone_gatekeeper_result: 'lose',
          currentBattleId: null,
          currentEncounterId: null,
          nextAfterBattleSceneId: null,
          encounterPhase: 'afterScene',
        };
        stateRef.current = { ...stateRef.current, ...losePatch };
        setGameState(stateRef.current);
        if (gameId) {
          void patchGameState(gameId, losePatch).catch((error: any) => addEvent(error.message || 'Boss失败结局状态同步失败', 'error'));
        }
        const titleTimer = window.setTimeout(() => {
          setScreen('main-menu');
        }, 2000);
        eventTimersRef.current.push(titleTimer);
        setSuggestions(makeSuggestions(['[第一幕结束 · 逆时归零]']));
        setPhase('narrating');
        return;
      }
      appendStoryLines(
        ['蓝伞浅滩的孢光将队伍逼退。你们退回据点边缘重新整队，确认路线后还可以再次进入浅滩。'],
        'kp', '主持人', true,
      );
      setSuggestions(makeSuggestions([
        '前往蓝伞浅滩',
        '确认蓝伞浅滩安全路线【感知DC13】',
        '让艾琳评估队伍污染状态',
      ]));
      setPhase('narrating');
    };

    startDeepBattle(config.battleId, undefined, onLose);
  }, [addEvent, appendStoryLines, battlePrepNarrating, battlePrepNarrationDone, gameId, startDeepBattle]);

  // ====== 第一幕结局分流 ======

  const routeAct1Ending = useCallback((coreChoice: string) => {
    const current = stateRef.current;
    const helpedRhein = current.helpedRhein === true;

    let endingId = '';
    if (helpedRhein && coreChoice === 'stabilize') endingId = 'ending_guardian_still_stands';
    else if (helpedRhein && coreChoice === 'destroy') endingId = 'ending_carrying_the_wounded';
    else if (!helpedRhein && coreChoice === 'stabilize') endingId = 'ending_cold_expedition';
    else if (!helpedRhein && coreChoice === 'destroy') endingId = 'ending_break_the_gate';
    else endingId = 'ending_error';

    const endingTitles: Record<string, string> = {
      ending_guardian_still_stands: '守门者仍在',
      ending_carrying_the_wounded: '带伤者穿门',
      ending_cold_expedition: '冷静的远征',
      ending_break_the_gate: '裂门而下',
      ending_error: '选择未完成',
    };

    const endingTexts: Record<string, string> = {
      ending_guardian_still_stands: '核心稳定下来，封印未破。莱因靠在你们身侧，呼吸渐渐平稳。黑石门缓缓开启，门后不是地底堡垒，而是一片没有天空的地下海洋。远处灯塔般的光点在黑潮上明灭，像仍有人守着旧约。第一幕结束。',
      ending_carrying_the_wounded: '核心碎裂，封印崩溃。莱因咳出一口黑血，但他的手终于不再发抖。你们搀着他穿过破碎的石门，门后不是地底堡垒，而是一片地下海洋，黑潮正沿着裂开的门缝向外呼吸。至少，你们不是空手进去的。第一幕结束。',
      ending_cold_expedition: '核心稳定，封印保留。你回头看了一眼骨柱湿地方向——那里没有需要搀扶的人，也没有多余的包袱。黑石门打开，门后不是地底堡垒，而是一片冷寂的地下海洋。远征继续，只是队伍里少了一道会解释真相的呼吸。第一幕结束。',
      ending_break_the_gate: '核心粉碎，封印解除。没有幸存者需要照顾，没有多余的负担。黑石门在你们面前轰然洞开，门后不是地底堡垒，而是一片翻涌的地下海洋。黑潮像在等待一支不在乎代价的队伍。第一幕结束。',
      ending_error: '选择没有完成。黑石门卫的残骸仍在颤抖，但核心已经自行闭合。门不会打开——至少这一次不会。第一幕结束。',
    };

    const title = endingTitles[endingId] || endingTitles.ending_error;
    const text = endingTexts[endingId] || endingTexts.ending_error;
    const companionFeedback = [
      getEndingFeedback('ailin', getCompanionTrust(current, 'ailin')),
      getEndingFeedback('brock', getCompanionTrust(current, 'brock')),
      getEndingFeedback('kaiya', getCompanionTrust(current, 'kaiya')),
      getEndingFeedback('serin', getCompanionTrust(current, 'serin')),
    ].filter(Boolean);

    const patch: GameState = {
      act1_ending: endingId,
      act1_ending_title: title,
      endingId,
      bossCoreChoice: coreChoice,
      core_choice_pending: false,
      currentNodeId: 'ending_router',
      expedition_registered: true,
    };
    const nextState = { ...current, ...patch };
    stateRef.current = nextState;
    setGameState(nextState);
    if (gameId) {
      void patchGameState(gameId, patch).catch((error: any) => addEvent(error.message || '第一幕结局状态同步失败', 'error'));
    }

    appendStoryLines([text, ...companionFeedback], 'kp', '主持人', true);
    setSuggestions(makeSuggestions([`[第一幕结束 · ${title}]`]));
    setPhase('narrating');
  }, [addEvent, appendStoryLines, gameId]);

  const scene = useMemo(() => resolveDndScene(gameState), [gameState]);

  // 场景区域变更时清除脚本背景覆盖（仅当不在同一区域）
  useEffect(() => {
    const area = String(gameState.current_area || '');
    const refArea = scriptedBgSceneRef.current;
    if (refArea && area && !area.includes(refArea.replace('逆穹悬城·', ''))) {
      setScriptedBgOverride(null);
      scriptedBgSceneRef.current = '';
    }
  }, [gameState.current_area]);

  const currentLine = story[activeIndex];
  const currentLineIsScripted = currentLine?.role === 'kp' && Boolean(currentLine.scriptedSceneId || currentLine.bgm || currentLine.bgImage);
  const ctrlFastForwardActive = ctrlKeyHeld && currentLineIsScripted && screen === 'game' && phase === 'narrating' && !streaming;
  const toggleFastForwardActive =
    fastForwardMode &&
    phase === 'narrating' &&
    !streaming &&
    (currentLineIsScripted || !story.some((line) => line.role === 'player'));
  const autoAdvanceActive = openingFastForward || ctrlFastForwardActive || toggleFastForwardActive;
  const styleSelectionBlocked = showStyleSelection && phase === 'narrating' && Boolean(gameState.style_selection_pending);
  const canAdvance = Boolean(currentLine) && (activeIndex < story.length - 1 || !streaming) && !styleSelectionBlocked;
  const requestedBgmTrack = useMemo(() => externalBgmTrack || resolveBgmTrack(screen, currentLine, gameState), [externalBgmTrack, screen, currentLine, gameState]);

  const visibleSuggestions = useMemo(() => {
    return constrainActionSuggestions(gameState, suggestions);
  }, [gameState, suggestions, bpTrigger]);
  const choiceHelperText = actionChoiceStatusText(gameState, visibleSuggestions);
  const actionInputPlaceholder = gameState.ailin_answer_pending
    ? '回答艾琳：你们需要的是修女，还是随队药箱？'
    : gameState.serlin_intro_pending
      ? '向瑟琳介绍自己：用几句话描述你的身份和经历……'
      : gameState.kaiya_passphrase_pending
        ? '输入凯娅的暗号……'
        : '输入你的行动……';
  const areaText = String(gameState.current_area || '');
  const showLuckyBoxEntry = /黑市|补给市场|市场|奥兰|凯娅/.test(areaText)
    && Boolean(gameState.kaiya_intro_seen && !gameState.kaiya_passphrase_pending && !gameState.kaiya_recruited);
  const cityAreaVisited = /冒险者公会|回声酒馆|酒馆|黑市|补给市场|市场|静默神殿|神殿|降渊缆梯|缆梯/.test(areaText);
  const canUseCityMap = CITY_MAP_ENABLED && Boolean(gameState.city_map_unlocked || gameState.guild_registered || cityAreaVisited);
  const showOpeningActionTutorial =
    screen === 'game' &&
    phase === 'action' &&
    showActionPanel &&
    !openingActionTutorialDismissed &&
    !gameState.serlin_intro_pending &&
    Boolean(gameState.tutorial_battle_pending && !gameState.first_choice_resolved);

  const showSerlinIntroTutorial =
    screen === 'game' &&
    showActionPanel &&
    gameState.serlin_intro_pending &&
    !serlinIntroTutorialDismissed;

  useEffect(() => {
    if (requestedBgmTrack) {
      playBgmTrack(requestedBgmTrack);
      return;
    }
    stopBgmTrack();
  }, [requestedBgmTrack, playBgmTrack, stopBgmTrack]);

  useEffect(() => {
    if (!canUseCityMap && showCityMap) {
      setShowCityMap(false);
    }
  }, [canUseCityMap, showCityMap]);

  useEffect(() => {
    if (!openingFastForward) return;
    const hasPlayerLine = story.some((line) => line.role === 'player');
    if (phase === 'action' || hasPlayerLine || screen !== 'game') {
      setOpeningFastForward(false);
    }
  }, [openingFastForward, phase, screen, story]);

  // Ctrl+L toggles test fast-forward; holding Ctrl temporarily fast-forwards fixed script scenes.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (screen === 'game' && (e.key === 'Control' || e.ctrlKey)) {
        setCtrlKeyHeld(true);
      }
      if (e.ctrlKey && e.key === 'l' && screen === 'game' && !streaming && phase === 'narrating') {
        e.preventDefault();
        setFastForwardMode((prev) => !prev);
      }
      if (fastForwardMode && phase === 'action') {
        setFastForwardMode(false);
      }
    }

    function onKeyUp(e: KeyboardEvent) {
      if (e.key === 'Control' || !e.ctrlKey) {
        setCtrlKeyHeld(false);
      }
    }

    function onBlur() {
      setCtrlKeyHeld(false);
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
    };
  }, [screen, streaming, phase, fastForwardMode]);

  // 行动面板延迟显示：底部文本全部输出完 1 秒后才可以显示
  useEffect(() => {
    if (phase === 'action' && !showActionPanel) {
      const timer = window.setTimeout(() => setShowActionPanel(true), 1000);
      return () => window.clearTimeout(timer);
    }
    if (phase !== 'action') {
      setShowActionPanel(false);
    }
  }, [phase, showActionPanel]);

  // 暗号提示框：进入黑市场景后强制展示
  useEffect(() => {
    if (gameState.kaiya_passphrase_pending && !gameState.kaiya_passphrase_failed && !passphraseHintShownRef.current) {
      setShowPassphraseHint(true);
      passphraseHintShownRef.current = true;
    }
    if (!gameState.kaiya_passphrase_pending) {
      passphraseHintShownRef.current = false;
    }
  }, [gameState.kaiya_passphrase_pending, gameState.kaiya_passphrase_failed]);

  useEffect(() => {
    const shouldOpenStyleSelection =
      screen === 'game' &&
      phase === 'narrating' &&
      Boolean(gameState.style_selection_pending) &&
      currentLine?.scriptedSceneId === 'opening' &&
      fullyVisibleLineId === currentLine.id &&
      currentLine.text.includes(OPENING_STYLE_SELECTION_LINE);

    if (!shouldOpenStyleSelection) {
      if (!gameState.style_selection_pending && showStyleSelection) {
        setShowStyleSelection(false);
      }
      return;
    }

    setOpeningFastForward(false);
    setFastForwardMode(false);
    setShowStyleSelection(true);
  }, [currentLine, fullyVisibleLineId, gameState.style_selection_pending, phase, screen, showStyleSelection]);

  useEffect(() => {
    if (screen !== 'game' || streaming || showBattlePrepPanel) return;
    if (pendingBattlePrepRef.current || pendingBattleRef.current) return;
    const config = getEncounterConfigById(gameState.currentEncounterId);
    if (!config || isEncounterBattleDone(gameState, config)) return;
    if (gameState.encounterPhase === 'battleRunning') return;

    currentEncounterConfigRef.current = config;
    pendingBattlePrepRef.current = getEncounterPrepActions(config);
    battlePrepStateRef.current = gameState;

    if (canShowPrepChoice(gameState, config)) {
      battlePrepResultRef.current = null;
      setShowBattlePrepPanel(true);
      return;
    }

    if (gameState.lastPrepResult) {
      battlePrepResultRef.current = gameState.lastPrepResult as BattlePrepResolveResult;
      setShowBattlePrepPanel(true);
      return;
    }

    pendingBattleRef.current = config.battleId;
  }, [gameState, screen, showBattlePrepPanel, streaming]);

  const confirmOpeningStyle = useCallback(() => {
    const playerName = openingPlayerName.trim();
    if (!playerName) {
      addEvent('请先写下冒险者姓名', 'error');
      return;
    }
    const style = getPlayerStyleById(selectedOpeningStyleId || 'balanced');
    const maxHp = getMaxHp(style.attributes);
    const nextHp = Math.min(Number(stateRef.current.current_hp ?? maxHp), maxHp);
    const stylePatch: GameState = {
      selectedStyleId: style.id,
      selected_style_id: style.id,
      style_name: style.name,
      char_class: style.name,
      style_selection_pending: false,
      player_name: playerName,
      player: {
        ...(stateRef.current.player || {}),
        name: playerName,
        styleId: style.id,
        styleName: style.name,
        attributes: style.attributes,
        maxHp,
        hp: nextHp,
        ac: getAc(style.attributes),
      },
      ...style.attributes,
      current_hp: nextHp,
      max_hp: maxHp,
      ac: getAc(style.attributes),
      initiative_modifier: getInitiativeModifier(style.attributes),
      last_event: `${playerName}确认冒险者流派：${style.name}`,
    };
    const nextState = migrateClassToStyleState({ ...stateRef.current, ...stylePatch });
    stateRef.current = nextState;
    rewardBaselineRef.current = nextState;
    setGameState(nextState);
    setShowStyleSelection(false);
    insertStoryLinesAfterActive([
      {
        role: 'kp',
        speaker: '主持人',
        text: `你在登记页上写下姓名“${playerName}”与流派“${style.name}”。这不是头衔，只是危险真正降临时，你最熟悉的活法。`,
        scriptedSceneId: 'opening',
        bgm: currentLine?.bgm,
        bgImage: currentLine?.bgImage,
      },
    ], true);
    if (gameId) {
      void patchGameState(gameId, stylePatch).catch((error: any) => {
        addEvent(error.message || '流派状态同步失败', 'error');
      });
    }
  }, [addEvent, currentLine?.bgImage, currentLine?.bgm, gameId, insertStoryLinesAfterActive, openingPlayerName, selectedOpeningStyleId]);

  const advanceLine = useCallback(() => {
    if (styleSelectionBlocked) return;
    if (activeIndex < story.length - 1) {
      setActiveIndex((index) => Math.min(index + 1, story.length - 1));
      return;
    }

    if (!streaming) {
      // 战斗胜利后播放战后剧情（模仿 completeTutorialBattle：state 驱动 + advanceLine 播放）
      if (stateRef.current.flags?.after_battle_shoal_pending) {
        setGameState((prev) => ({
          ...prev,
          flags: { ...(prev.flags || {}), after_battle_shoal_pending: false },
        }));
        const af = getScriptedScene('after-battle-blue-shoal');
        if (af) playScriptedScene(af, { focus: true });
        return;
      }
      // 战前行动：pendingBattlePrepRef 有值时，直接进入 action 阶段，显示战前行动选项
      if (pendingBattlePrepRef.current) {
        setShowBattlePrepPanel(true);
        setPhase('narrating');
        void saveCurrentGame(AUTO_SAVE_SLOT, { silent: true, phaseOverride: 'narrating' });
        return;
      }
      if (pendingBattleRef.current) {
        const battleId = pendingBattleRef.current;
        pendingBattleRef.current = '';
        const config = currentEncounterConfigRef.current || getEncounterConfigByBattleId(battleId);
        if (config) {
          stateRef.current = {
            ...stateRef.current,
            currentEncounterId: config.encounterId,
            currentBattleId: config.battleId,
            nextAfterBattleSceneId: config.afterSceneId,
            encounterPhase: 'battleRunning',
          };
          setGameState(stateRef.current);
        }
        startDeepBattle(battleId);
        return;
      }
      const forcedCompanionEventId = getForcedCompanionEventId(stateRef.current);
      if (forcedCompanionEventId) {
        setCompanionEventId(forcedCompanionEventId);
        setSuggestions([]);
        setPhase('narrating');
        setScreen('companion-event');
        return;
      }
      setPhase('action');
      void saveCurrentGame(AUTO_SAVE_SLOT, { silent: true, phaseOverride: 'action' });
    }
  }, [activeIndex, appendStoryLines, pendingTutorialBattleSetup, pendingTutorialBattleSummary, saveCurrentGame, story.length, streaming, styleSelectionBlocked]);

  const openLoadGame = useCallback(() => {
    setSaveMessage('');
    setSaveMessageTone('neutral');
    void refreshSaves();
    setScreen('load-game');
  }, [refreshSaves]);

  const returnToTitleMenu = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    parserRef.current = createNarrativeStreamParser();
    clearEventTimers();
    setStreaming(false);
    setShowGameSaves(false);
    setShowCharacterInfo(false);
    setShowReturnTitleConfirm(false);
    setShowDicePoker(false);
    setShowBargainGame(false);
    setShowDrinkingDiceGame(false);
    setShowLuckyBoxGame(false);
    setShowApothecaryShopUI(false);
    setShowStyleSelection(false);
    setShowBattlePrepPanel(false);
    setSelectedOpeningStyleId('balanced');
    setSelectionActionCheck(null);
    setFullyVisibleLineId(null);
    setDiceRoll(null);
    setBattlePrepDice(null);
    setEvents([]);
    setPendingTutorialBattleSetup(null);
    setPendingTutorialBattleSummary([]);
    pendingBattlePrepRef.current = null;
    battlePrepResultRef.current = null;
    battlePrepStateRef.current = null;
    pendingBattleRef.current = '';
    currentEncounterConfigRef.current = null;
    setOpeningFastForward(false);
    setScriptedBgOverride(null);
    setOpeningActionTutorialDismissed(false);
    setOpeningActionTutorialStep(0);
    setSerlinIntroTutorialDismissed(false);
    tutorialBattleIntentRef.current = false;
    tutorialBattleDiceRef.current = null;
    setSaveMessage('');
    setSaveMessageTone('neutral');
    setScreen('main-menu');
  }, [clearEventTimers]);

  const completeTutorialBattle = useCallback(() => {
    // 防止重复触发
    if (stateRef.current.tutorial_battle_done) return;

    const rewardGold = randomIntInclusive(100, 200);
    const potionCount = randomIntInclusive(1, 2);
    const current = stateRef.current;
    const nextGold = Number(current.gold ?? 200) + rewardGold;
    const nextInventory = addInventoryQuantity(String(current.inventory || '长剑,冒险者工具包'), '治疗药水', potionCount);

    const tutorialStatePatch: GameState = {
      first_choice_resolved: true,
      tutorial_battle_done: true,
      tutorial_battle_pending: false,
      flags: {
        ...(current.flags || {}),
        tutorial_battle_done: true,
      },
      currentBattleId: null,
      currentEncounterId: null,
      currentSceneId: 'tutorial-battle-after',
      nextAfterBattleSceneId: null,
      encounterPhase: 'afterScene',
      current_area: '逆穹悬城·主缆街',
      gold: nextGold,
      inventory: nextInventory,
      tutorial_battle_reward_gold: rewardGold,
      tutorial_battle_reward_potions: potionCount,
      last_event: '击退补给吊箱中的裂隙爬兽',
    };

    rewardNoticeDeferRef.current = true;
    queuedRewardNoticesRef.current = [];
    deferredSystemEventsRef.current = [];

    // 金币不属于背包物品，需要直接入队；治疗药水由状态差分生成，避免重复提示。
    const rewardNotices: RewardNotice[] = [
      { id: rewardNoticeIdRef.current++, kind: 'item', name: `${rewardGold}G`, icon: 'coin', image: '/assets/icons/items/coin.png', summary: '守卫代表公会支付的应急酬金。' },
    ];
    queuedRewardNoticesRef.current = rewardNotices;

    const nextState = {
      ...current,
      ...tutorialStatePatch,
    };
    stateRef.current = nextState;
    setGameState(nextState);
    if (gameId) {
      void patchGameState(gameId, tutorialStatePatch).catch((error: any) => {
        addEvent(error.message || '教学战斗状态同步失败', 'error');
      });
    }
    setPhase('narrating');
    setPendingTutorialBattleSetup(null);
    setPendingTutorialBattleSummary([]);
    setOpeningFastForward(false);
    tutorialBattleIntentRef.current = false;
    tutorialBattleDiceRef.current = null;
    pendingBattlePrepRef.current = null;
    battlePrepResultRef.current = null;
    battlePrepStateRef.current = null;
    pendingBattleRef.current = '';
    currentEncounterConfigRef.current = null;
    const afterScene = getScriptedScene('tutorial-battle-after');
    if (afterScene) {
      playScriptedScene(afterScene, { focus: true });
    }
    addEvent(`教学战斗奖励：${rewardGold}G、治疗药水 x${potionCount}`, 'state');
    setScreen('game');
  }, [addEvent, gameId, playScriptedScene]);

  if (screen === 'main-menu') {
    return (
      <LazyBoundary>
        <TitleMenu
          onNewGame={startDefaultGame}
          onLoadGame={openLoadGame}
          onSettings={() => setShowAudioSettings(true)}
          onTest={() => setScreen('test')}
          onPrimeAudio={() => playBgmTrack(BGM_TRACKS.title)}
        />
        <AudioSettingsModal
          open={showAudioSettings}
          bgmVolume={bgmVolume}
          sfxVolume={sfxVolume}
          onBgmVolumeChange={setBgmVolume}
          onSfxVolumeChange={setSfxVolume}
          onClose={() => setShowAudioSettings(false)}
        />
      </LazyBoundary>
    );
  }

  if (screen === 'load-game') {
    return (
      <LazyBoundary>
        <LoadGameScreen
          saves={saves}
          saveBusySlot={saveBusySlot}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
          onBack={() => setScreen('main-menu')}
          onRefreshSaves={refreshSaves}
          onLoadSave={loadSavedGame}
        />
      </LazyBoundary>
    );
  }

  if (screen === 'test') {
    return <LazyBoundary><ErrorBoundary><TestScreen onBack={() => setScreen('main-menu')} onStoryTest={startStoryTest} /></ErrorBoundary></LazyBoundary>;
  }

  if (screen === 'loading') return <LoadingScreen error={loadError} onRetry={startDefaultGame} />;

  if (screen === 'tutorial-battle') {
    return (
      <LazyBoundary>
        <ErrorBoundary>
          <BattleTestScreen
            mode="tutorial"
            openingEffects={pendingTutorialBattleSetup?.openingEffects ?? []}
            onBack={() => {
              setPendingTutorialBattleSetup(null);
              setPendingTutorialBattleSummary([]);
              setScreen('game');
            }}
            onComplete={completeTutorialBattle}
            onSkip={completeTutorialBattle}
          />
        </ErrorBoundary>
      </LazyBoundary>
    );
  }

  if (screen === 'companion-event') {
    const eventTrustKeys: Record<string, string> = {
      ailin_wounded_names: 'trust_al',
      block_echo_forest: 'trust_block',
      kaiya_broken_seals: 'trust_kl',
      serin_cracked_silver_staff: 'trust_sl',
    };
    const trustKey = eventTrustKeys[companionEventId] || 'trust_block';
    const companionId = COMPANION_ID_BY_EVENT_ID[companionEventId] || 'brock';
    return (
      <LazyBoundary>
        <ErrorBoundary>
          <CompanionEventTestScreen
            testMode={false}
            returnLabel="返回主线"
            playerName={gameState.player_name || '你'}
            eventId={companionEventId}
            initialTrust={getCompanionTrust(gameState, companionId) || Number(gameState[trustKey] ?? 55)}
            onBack={() => setScreen('game')}
            onComplete={completeCompanionSideEvent}
          />
        </ErrorBoundary>
      </LazyBoundary>
    );
  }

  if (screen === 'deep-battle') {
    const battleConfig = getBattleConfigById(deepBattleId);
    if (!battleConfig) {
      setScreen('game');
      return null;
    }
    // 读取战前行动效果并转换为战斗开幕效果
    const be: any = gameState.battleEffects || {};
    const openingEffects: any[] = [];
    // 禁用敌方技能 → 日志反馈
    if (Array.isArray(be.disableEnemySkillFirstRound) && be.disableEnemySkillFirstRound.length) {
      const enemyId = battleConfig.units.find((u: any) => u.faction === 'enemy' && u.type === 'fungal_mimic')?.id;
      if (enemyId) {
        openingEffects.push({
          unitId: enemyId,
          log: `战前行动：拟声菌团第一回合无法使用【拟声扰乱】。`,
        });
      }
    }
    // 前排 AC 加成
    if (be.frontlineAcBonus) {
      const frontline = battleConfig.units.filter((u: any) => u.faction === 'ally' && (u.id === 'player' || u.id === 'serin' || u.id === 'brock'));
      frontline.forEach((u: any) => {
        openingEffects.push({
          unitId: u.id,
          acDelta: be.frontlineAcBonus,
          log: `战前行动：${u.name || u.id} AC +${be.frontlineAcBonus}。`,
        });
      });
    }
    // 全队稳息状态
    if (Array.isArray(be.allyStatus)) {
      const allies = battleConfig.units.filter((u: any) => u.faction === 'ally');
      be.allyStatus.forEach((st: any) => {
        allies.forEach((u: any) => {
          openingEffects.push({
            unitId: u.id,
            statuses: [st.name],
            log: `战前行动：${u.name || u.id} 获得【${st.name}】。`,
          });
        });
      });
    }
    // 攻击加成（日志反馈）
    if (be.attackBonusFirstRound) {
      openingEffects.push({
        unitId: 'player',
        log: `战前行动：我方第一回合攻击${be.targetEnemyType === 'fungal_mimic' ? '拟声菌团' : be.targetEnemyType || '敌人'}时命中 +${be.attackBonusFirstRound}。`,
      });
    }
    // 敌方惩罚（日志反馈）
    if (be.enemyAttackPenaltyFirstRound) {
      const targetEnemy = battleConfig.units.find((u: any) => u.faction === 'enemy' && u.type === be.targetEnemyType);
      if (targetEnemy) {
        openingEffects.push({
          unitId: targetEnemy.id,
          log: `战前行动：${targetEnemy.name || targetEnemy.id} 第一回合攻击命中 -${be.enemyAttackPenaltyFirstRound}。`,
        });
      }
    }
    return (
      <LazyBoundary>
        <ErrorBoundary>
          <BattleTestScreen
            mode="test"
            battleConfigOverride={battleConfig}
            openingEffects={openingEffects}
            onBack={() => {}}
            onComplete={(result) => handleDeepBattleComplete(result)}
            onSkip={() => handleDeepBattleComplete({ outcome: 'win' })}
          />
        </ErrorBoundary>
      </LazyBoundary>
    );
  }

  if (showBargainGame) {
    return <LazyBoundary><BargainTestScreen onBack={() => setShowBargainGame(false)} onComplete={handleBargainComplete} /></LazyBoundary>;
  }

  if (showApothecaryShopUI) {
    const purchasedShopKeys = shopItems
      .filter((item) => !item.repeatable)
      .filter((item) => Boolean(gameState[`yunling_${item.id}_bought`] || (item.id === 'purification_heart' && gameState.purification_heart_owned)))
      .map((item) => item.id);
    return (
      <LazyBoundary>
        <ApothecaryShop
          gold={Number(gameState.gold ?? 200)}
          inventoryText={String(gameState.inventory || '')}
          purchasedKeys={purchasedShopKeys}
          onPurchase={handleApothecaryPurchase}
          onExit={() => {
            setShowApothecaryShopUI(false);
            handleApothecaryExit();
          }}
          fullScreen
        />
      </LazyBoundary>
    );
  }

  return (
    <LazyBoundary>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="vn-app">
      <VisualNovelStage
        key={`vn-stage-${visualResetKey}`}
        scene={scene}
        line={currentLine}
        events={events}
        isStreaming={streaming}
        isActionPhase={phase === 'action'}
        canAdvance={phase !== 'action' && canAdvance}
        autoAdvance={autoAdvanceActive}
        autoAdvanceDelay={ctrlFastForwardActive ? 35 : toggleFastForwardActive ? 60 : 90}
        scriptedBgOverride={scriptedBgOverride}
        visualResetKey={visualResetKey}
        onAdvance={advanceLine}
        onLineFullyVisible={setFullyVisibleLineId}
        actionPanel={
          showActionPanel ? (
            <ActionPanel
              suggestions={visibleSuggestions}
              disabled={streaming}
              onSubmit={submitAction}
              placeholder={actionInputPlaceholder}
              helperText={choiceHelperText}
              hideFreeInput={visibleSuggestions.some((s) => /整理阵亡者名册|翻看旧巡逻记录|确认据点调查结果|停下协助艾琳|无视伤员继续前进|帮艾琳记录|优先追问第三巡逻队/.test(s.text))}
            />
          ) : undefined
        }
      />

      <AnimatePresence>
        {showOpeningActionTutorial && (
          <OpeningActionTutorial
            step={openingActionTutorialStep}
            total={OPENING_ACTION_TUTORIAL.length}
            onPrevious={() => setOpeningActionTutorialStep((step) => Math.max(0, step - 1))}
            onNext={() => {
              if (openingActionTutorialStep >= OPENING_ACTION_TUTORIAL.length - 1) {
                setOpeningActionTutorialDismissed(true);
                return;
              }
              setOpeningActionTutorialStep((step) => Math.min(OPENING_ACTION_TUTORIAL.length - 1, step + 1));
            }}
            onClose={() => setOpeningActionTutorialDismissed(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSerlinIntroTutorial && (
          <OpeningActionTutorial
            steps={SERLIN_INTRO_TUTORIAL}
            onClose={() => setSerlinIntroTutorialDismissed(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStyleSelection && (
          <motion.div
            className="style-selection-backdrop"
            role="dialog"
            aria-modal="true"
            aria-label="选择冒险者流派"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="style-selection-modal"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
            >
              <PlayerStyleSelector
                selectedStyleId={selectedOpeningStyleId}
                onSelect={setSelectedOpeningStyleId}
                playerName={openingPlayerName}
                onPlayerNameChange={setOpeningPlayerName}
                onConfirm={confirmOpeningStyle}
                confirmLabel="确认流派并继续"
                title="确认你的冒险者流派"
                subtitle="登记页只记录你在危险真正压下来时，最习惯依靠哪一种活法。"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 暗号提示框：进入黑市后在屏幕中央显示 */}
      {showPassphraseHint && (
        <motion.div
          className="opening-action-tutorial"
          role="dialog"
          aria-modal="true"
          aria-label="暗号提示"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="opening-action-tutorial-card"
            initial={{ opacity: 0, y: -14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <header>
              <span>暗号提示</span>
              <button type="button" aria-label="关闭" onClick={() => setShowPassphraseHint(false)}>×</button>
            </header>
            <h2>说出暗号才能让凯娅现身</h2>
            <p>萨洛告诉你的暗号已经记录在档案中。{'\n\n'}可点击右上角的 「背包」，进入「档案」 查看暗号线索，然后在下方输入框说出暗号。</p>
            <footer>
              <span />
              <button type="button" className="opening-action-tutorial-next" onClick={() => setShowPassphraseHint(false)}>
                知道了
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}

      {/* 骰子检定动画覆盖层 */}
      <DiceRollOverlay dice={diceRoll} dieType="d20" onClose={() => setDiceRoll(null)} />

      {/* 战前行动面板 */}
      <AnimatePresence>
        {showBattlePrepPanel && pendingBattlePrepRef.current && (
          <motion.div
            key="battle-prep"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget && !battlePrepResultRef.current) return; }}
          >
            <BattlePrepPanel
              choices={pendingBattlePrepRef.current}
              gameState={stateRef.current}
              onResolve={handleBattlePrepResolve}
              onReroll={handleBattlePrepReroll}
              onConfirm={handleBattlePrepConfirm}
              onEnterBattle={handleBattlePrepEnterBattle}
              resolvedResult={battlePrepResultRef.current}
              resolvedChoice={
                battlePrepResultRef.current
                  ? pendingBattlePrepRef.current.find((c) => c.id === stateRef.current.lastBattlePrepChoice) || null
                  : null
              }
              diceResult={battlePrepDice}
              narration={battlePrepNarration}
              narrationLoading={battlePrepNarrating}
              canContinue={battlePrepNarrationDone && !battlePrepNarrating}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <DiceRollOverlay
        dice={battlePrepDice}
        dieType="d20"
        diceKind="行动检定"
        charSkill={selectionActionCheck?.choice.label || pendingBattlePrepRef.current?.find((choice) => choice.id === stateRef.current.lastBattlePrepChoice)?.label}
        onClose={() => {}}
        rerollDecision={(selectionActionCheck?.result || battlePrepResultRef.current)?.finalized ? undefined : (() => {
          const activeResult = selectionActionCheck?.result || battlePrepResultRef.current;
          if (!activeResult?.storyCheck) return undefined;
          return {
            fictionQuantity: getRerollItemQuantity(gameState, 'fiction-dice'),
            omniQuantity: getRerollItemQuantity(gameState, 'omni-dice'),
            rerollUsed: activeResult.storyCheck.rerollUsed,
            onConfirm: selectionActionCheck ? handleSelectionActionConfirm : () => { setBattlePrepDice(null); handleBattlePrepConfirm(); },
            onUseFiction: selectionActionCheck ? () => handleSelectionActionReroll('fiction-dice') : () => handleBattlePrepReroll('fiction-dice'),
            onUseOmni: selectionActionCheck ? (value) => handleSelectionActionReroll('omni-dice', value) : (value) => handleBattlePrepReroll('omni-dice', value),
          };
        })()}
        comparisonRolls={(() => {
          const check = (selectionActionCheck?.result || battlePrepResultRef.current)?.storyCheck;
          if (!check?.reroll) return undefined;
          return { initial: check.initialRoll.d20, reroll: check.reroll.d20,
            selected: check.finalRoll.source === 'initial' ? 'initial' as const : 'reroll' as const };
        })()}
      />

      <RewardAcquisitionModal notices={rewardNotices} onDismiss={dismissRewardNotice} />

      {showLuckyBoxEntry && (
        <button
          type="button"
          className="game-dice-poker-btn game-bargain-btn"
          onClick={() => setShowLuckyBoxGame(true)}
        >
          幸运盲盒
        </button>
      )}

      {/* 剧情加速状态指示器 */}
      {(fastForwardMode || ctrlFastForwardActive) && (
        <div className="fast-forward-indicator">
          剧情加速中
        </div>
      )}

      <div className="game-top-actions">
        <button type="button" className="game-log-btn" onClick={() => setShowDialogueLog(true)}>
          📜 对话日志
        </button>
        {canUseCityMap && (
          <button
            type="button"
            className="game-map-btn"
            onClick={() => setShowCityMap(true)}
          >
            🗺️ 城市地图
          </button>
        )}
        <button type="button" className="game-title-btn" onClick={() => setShowReturnTitleConfirm(true)}>
          回到标题界面
        </button>
        <button
          type="button"
          className="game-save-btn"
          onClick={() => setShowGameSaves(true)}
        >
          📂 冒险存档
        </button>
        <div className="game-inventory-entry">
          <InventoryPanel state={gameState} onStatePatch={patchStateFromPanel} />
        </div>
        <button
          type="button"
          className="game-character-btn"
          aria-haspopup="dialog"
          aria-expanded={showCharacterInfo}
          onClick={() => setShowCharacterInfo(true)}
        >
          角色信息
        </button>
      </div>

      <AnimatePresence>
        {showReturnTitleConfirm && (
          <motion.div
            className="return-title-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReturnTitleConfirm(false)}
          >
            <motion.section
              className="return-title-modal"
              role="dialog"
              aria-modal="true"
              aria-label="返回标题界面确认"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="return-title-copy">
                <span>返回标题界面</span>
                <p>请先确认当前冒险进度已经存档。未保存的剧情和状态不会自动保存。</p>
              </div>
              <div className="return-title-actions">
                <button type="button" className="return-title-cancel" onClick={() => setShowReturnTitleConfirm(false)}>
                  取消
                </button>
                <button type="button" className="return-title-confirm" onClick={returnToTitleMenu}>
                  确定
                </button>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCharacterInfo && (
          <motion.div
            className="character-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCharacterInfo(false)}
          >
            <motion.section
              className="character-modal"
              role="dialog"
              aria-modal="true"
              aria-label="角色信息"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="character-modal-header">
                <div>
                  <span>角色信息</span>
                  <small>
                    {gameState.player_name || '冒险者'} · {getDisplayedStyleName(gameState)}
                  </small>
                </div>
                <button type="button" aria-label="关闭角色信息" onClick={() => setShowCharacterInfo(false)}>
                  ×
                </button>
              </div>
              <CharacterPanel state={gameState} />
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 对话日志弹窗 */}
      <AnimatePresence>
        {showDialogueLog && (
          <DialogueLog
            story={story}
            activeIndex={activeIndex}
            isStreaming={streaming}
            onClose={() => setShowDialogueLog(false)}
          />
        )}
      </AnimatePresence>

      {/* 快艇骰子游戏弹窗 */}
      <AnimatePresence>
        {showDicePoker && (
          <DicePokerGame
            gameId={gameId}
            npcName={dicePokerNpc}
            npcTrustKey=""
            onClose={() => setShowDicePoker(false)}
            onTrustChange={(npc, key, change) => {
              addEvent(`${npc}信任 ${change > 0 ? '+' : ''}${change}`, 'state');
            }}
            onGetClue={(info) => {
              addEvent(`获得情报：${info}`, 'dice');
            }}
            onComplete={(resultData) => {
              // 骰子游戏结束后，关闭弹窗并立即推进剧情
              setShowDicePoker(false);
              dicePokerAutoTriggeredRef.current = false;
              const pendingAction = dicePokerPendingRef.current;
              dicePokerPendingRef.current = '';

              // 把骰子游戏结果作为叙事追加到故事中
              const resultLines: string[] = [];
              if (resultData.ai_narration) resultLines.push(resultData.ai_narration.trim());
              if (resultData.npc_reaction) resultLines.push(resultData.npc_reaction.trim());
              if (resultLines.length) {
                appendStoryLines(resultLines, 'kp', dicePokerNpc);
              }

              // 向主持人后端提交行动，让主持人对骰子结果做出回应，推进剧情
              if (pendingAction && gameId) {
                setPhase('narrating');
                setStreaming(true);
                setSuggestions([]);
                abortRef.current?.abort();
                parserRef.current = createNarrativeStreamParser();
                streamSuggestionsRef.current = [];
                diceFiredRef.current = false;
                tutorialBattleIntentRef.current = false;
                tutorialBattleDiceRef.current = null;
                rewardNoticeDeferRef.current = true;
                queuedRewardNoticesRef.current = [];
                deferredSystemEventsRef.current = [];

                // 构造带结果上下文的行动文本
                const resultContext = resultData.result === 'win'
                  ? '（骰子游戏获胜）'
                  : resultData.result === 'tie'
                    ? '（骰子游戏平局）'
                    : '（骰子游戏落败）';
                const contextualAction = `${pendingAction}${resultContext}`;

                abortRef.current = runtime.streamAction(gameId, contextualAction, {
                  onNarrative: (chunk) => {
                    const parsed = parserRef.current.push(chunk);
                    if (parsed.suggestions.length) streamSuggestionsRef.current = parsed.suggestions;
                    if (parsed.lines.length) appendStoryLines(parsed.lines, 'kp', '主持人');
                  },
                  onSuggestions: (items) => {
                    streamSuggestionsRef.current = items;
                    setSuggestions(constrainActionSuggestions(stateRef.current, items));
                  },
                  onSystem: (rawEvent) => {
                    const parsed = runtime.parseSystemEvent(rawEvent);
                    if (!parsed) return;
                    const message = runtime.formatSystemEvent(parsed);
                    if (message) {
                      deferredSystemEventsRef.current.push({
                        message,
                        tone: parsed.type === 'error' ? 'error' : 'dice',
                      });
                    }
                  },
                  onStateUpdate: (change) => {
                    applyRuntimeStateChange(change);
                  },
                  onDone: () => {
                    const parsed = parserRef.current.flush();
                    if (parsed.suggestions.length) streamSuggestionsRef.current = parsed.suggestions;
                    if (parsed.lines.length) appendStoryLines(parsed.lines, 'kp', '主持人');
                    flushDeferredSystemEvents();
                    setSuggestions(constrainActionSuggestions(stateRef.current, streamSuggestionsRef.current));
                    setStreaming(false);
                  },
                  onError: (error) => {
                    const rawMessage = String(error || '').trim();
                    const message = /connection\s*error|failed\s*to\s*fetch|network\s*error|networkerror|timeout|timed\s*out|econn|socket/i.test(rawMessage)
                      ? '主持人暂时没有回应，已为本轮处理启用兜底。'
                      : rawMessage || '主持人暂时没有回应';
                    setStreaming(false);
                    addEvent(message, 'state');
                    flushDeferredSystemEvents();
                    appendStoryLines([message], 'system', '系统');
                    setSuggestions(constrainActionSuggestions(stateRef.current));
                  },
                });
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* 逆穹城地图 */}
      <CityMap
        visible={showCityMap && canUseCityMap}
        onClose={() => setShowCityMap(false)}
        onNavigate={(actionText) => {
          setShowCityMap(false);
          submitAction(actionText);
        }}
      />

      {/* 布洛克喝酒游戏弹窗 */}
      <AnimatePresence>
        {showDrinkingDiceGame && (
          <DrinkingDiceGame
            playerCon={Number(gameState.attr_con ?? gameState.con ?? 15)}
            onBack={() => setShowDrinkingDiceGame(false)}
            onComplete={handleDrinkingDiceComplete}
          />
        )}
      </AnimatePresence>

      {/* 酒馆三局骰子游戏 */}
      <AnimatePresence>
        {showTavernDice && (
          <TavernDicePoker
            gold={Number(gameState.gold ?? 200)}
            onClose={() => setShowTavernDice(false)}
            onComplete={(result: any) => {
              dicePokerPendingRef.current = '';
              dicePokerAutoTriggeredRef.current = false;
              setShowTavernDice(false);
              setPhase('narrating');
              setSuggestions([]);

              const wins = Number(result?.wins ?? 0);
              const effectiveWins = Number(result?.effectiveWins ?? wins);
              const spent = Number(result?.spent ?? 0);
              const earnings = Number(result?.earnings ?? 0);
              const gift = Number(result?.gift ?? 0);
              const currentGold = Number(stateRef.current.gold ?? 200);
              const saloIntel = getScriptedScene('salo-companion-intel');
              const saloClues = Array.isArray(saloIntel?.clues) ? saloIntel.clues : [];
              const saloPatch: GameState = saloIntel
                ? {
                    ...(saloIntel.statePatch ?? {}),
                    ...(saloClues.length ? { clues: mergeClues(stateRef.current.clues, saloClues) } : {}),
                    ...(saloIntel.setArea ? { current_area: saloIntel.setArea, actions_in_area: 0 } : {}),
                  }
                : {};
              const tavernPatch: GameState = {
                gold: Math.max(0, currentGold - spent + earnings + gift),
                tavern_dice_done: true,
                tavern_wins: wins,
                tavern_effective_wins: effectiveWins,
                tavern_dice_spent: spent,
                tavern_dice_earnings: earnings,
                tavern_dice_gift: gift,
                tavern_info_paid: Boolean(result?.paidInfo),
                tavern_yunling_unlocked: Boolean(result?.yunlingUnlocked),
                ...saloPatch,
                last_event: saloIntel?.lastEvent || `酒馆快艇骰子结束（${wins}胜，有效情报胜${effectiveWins}）`,
              };
              if (saloClues.length) {
                rewardNoticeDeferRef.current = true;
                queuedRewardNoticesRef.current = [];
              }
              const nextState = { ...stateRef.current, ...tavernPatch };
              stateRef.current = nextState;
              setGameState(nextState);
              if (gameId) {
                void patchGameState(gameId, tavernPatch).catch((error: any) => addEvent(error.message || '酒馆骰子状态同步失败', 'error'));
              }
              if (spent) addEvent(`金币 -${spent}`, 'state');
              if (earnings) addEvent(`骰局收回 +${earnings}G`, 'state');
              if (gift) addEvent(`萨洛彩头 +${gift}G`, 'state');
              saloIntel?.events?.forEach((eventText) => addEvent(eventText, 'state'));

              const postDiceLines: StoryLine[] = wins >= 2
                ? [
                    { id: lineId.current++, role: 'kp' as const, speaker: '萨洛', text: `「啧。${wins}胜。你这手气不像第一次玩。」` },
                    { id: lineId.current++, role: 'kp' as const, speaker: '萨洛', text: '「愿赌服输。我会把艾琳、布洛克、凯娅的位置和脾气都说清楚。你们最好记牢，找人比找路麻烦。另外，黑市深处有个药剂商叫云苓，她手里有针对深层污染的药剂——不是必需品，但能让你们在孢海里走得更远。」' },
                    { id: lineId.current++, role: 'kp' as const, speaker: '主持人', text: '萨洛把一只小钱袋丢到桌上，里面是整整一百枚金币。他又用酒渍在纸角画了一个不会响的铜铃，示意你们收好。' },
                    { id: lineId.current++, role: 'kp' as const, speaker: '瑟琳', text: '「萨洛很少这么干脆。看来他确实认为这三个人缺一不可。」' },
                    { id: lineId.current++, role: 'kp' as const, speaker: '主持人', text: '瑟琳将银杖收回袖口，对你微微点头。酒馆里的喧嚣重新漫上来，但萨洛的情报像一块石头坠入水面，散开的波纹还没停。' },
                  ]
                : effectiveWins >= 1
                ? [
                    { id: lineId.current++, role: 'kp' as const, speaker: '萨洛', text: result?.paidInfo ? '「钱也算一种手气。至少你们知道什么时候该少浪费时间。」' : '「一胜两负，不亏。冒险者的手气就是这样——从来不会让你空手回去。」' },
                    { id: lineId.current++, role: 'kp' as const, speaker: '萨洛', text: '「行，我说。艾琳、布洛克、凯娅，各有本事，也各有麻烦。你们想凑齐五人队，就得按他们的规矩来。」' },
                    { id: lineId.current++, role: 'kp' as const, speaker: '瑟琳', text: '「够用了。先听完情报，再规划路线。」' },
                  ]
                : [
                    { id: lineId.current++, role: 'kp' as const, speaker: '萨洛', text: '「输了也正常。悬城里每年有上百个冒险者从我这张桌子上爬走，最后活下来的从不靠骰子。」' },
                    { id: lineId.current++, role: 'kp' as const, speaker: '萨洛', text: '「情报还是给你——看在你们真要下孢海的份上。三个人都不好请，但都值得请。」' },
                    { id: lineId.current++, role: 'kp' as const, speaker: '瑟琳', text: '「先听他讲完。队伍凑齐之前，我们不能急着下缆梯。」' },
                  ];
              const saloLines: StoryLine[] = saloIntel
                ? saloIntel.lines.map((line) => ({
                    id: lineId.current++,
                    role: 'kp' as const,
                    speaker: line.speaker,
                    text: line.text,
                    portrait: line.portrait || getScriptedPortraitOverride(saloIntel.id, line.speaker),
                    bgImage: line.bgImage,
                    bgm: line.bgm || saloIntel.bgm,
                    scriptedSceneId: saloIntel.id,
                  }))
                : [];
              setStory((prev) => {
                setActiveIndex(prev.length);
                return [...prev, ...postDiceLines, ...saloLines];
              });

              setScriptedBgOverride(saloIntel?.bgImage || '/assets/scenes/06tavern-interior.webp');
              scriptedBgSceneRef.current = saloIntel?.setArea || '逆穹悬城·回声酒馆';
              setSuggestions(saloIntel
                ? constrainActionSuggestions(nextState, makeSuggestions(saloIntel.hints))
                : makeSuggestions([
                    '前往静默神殿寻找艾琳',
                    '和瑟琳讨论远征路线',
                  ]));
            }}
          />
        )}
      </AnimatePresence>

      {/* 奥兰幸运盲盒弹窗 */}
      <AnimatePresence>
        {showLuckyBoxGame && (
          <OrlanBoxGame
            gold={Number(gameState.gold ?? 200)}
            onBack={() => setShowLuckyBoxGame(false)}
            onComplete={handleOrlanBoxComplete}
          />
        )}
      </AnimatePresence>

      {/* 游戏内存档弹窗 */}
      <AnimatePresence>
        {showGameSaves && (
          <motion.div
            className="save-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGameSaves(false)}
          >
            <motion.div
              className="save-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="save-modal-header">
                <span>冒险存档</span>
                <button type="button" onClick={() => setShowGameSaves(false)}>✕</button>
              </div>
              <SaveLoadPanel
                title="冒险存档"
                saves={saves}
                busySlot={saveBusySlot}
                disabled={streaming}
                message={saveMessage}
                messageTone={saveMessageTone}
                onRefresh={refreshSaves}
                onSave={(slotKey, customTitle) => { saveCurrentGame(slotKey, { customTitle }); setShowGameSaves(false); }}
                onLoad={loadSavedGame}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.div>
    </LazyBoundary>
  );
}
