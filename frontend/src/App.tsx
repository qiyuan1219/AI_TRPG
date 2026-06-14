import { Component, lazy, Suspense, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ActionPanel } from './components/ActionPanel';
import type { BargainCompleteResult } from './components/BargainTestScreen';
import type { CompanionEventCompleteResult } from './components/CompanionEventTestScreen';
import { DiceRollOverlay } from './components/DiceRollOverlay';
import type { EventFeedItem } from './components/EventFeed';
import { LoadingScreen } from './components/LoadingScreen';
import { VisualNovelStage } from './components/VisualNovelStage';
import type { DrinkingDiceResult } from './components/DrinkingDiceGame';
import type { OrlanBoxResult } from './components/OrlanBoxGame';
import { findRegisteredSpeaker, resolveSpeakerName } from './data/characterRegistry';
import { resolveDndScene } from './data/dndScenes';
import { getScriptedScene, matchScriptedScene, type ScriptedScene } from './data/scriptedScenes';
import { getBattleConfigById } from './data/battleConfigs';
import { getEndingFeedback } from './data/companionSideQuests';
import type { StoryTestCheckpoint } from './data/storyTestCheckpoints';
import { shopItems } from './data/shopItems';
import { listSaves, loadGame, patchGameState, saveGame } from './services/api';
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

const TitleMenu = lazy(() => import('./components/TitleMenu').then((module) => ({ default: module.TitleMenu })));
const StartDND = lazy(() => import('./components/StartDND').then((module) => ({ default: module.StartDND })));
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

type Screen = 'main-menu' | 'new-game' | 'load-game' | 'test' | 'loading' | 'game' | 'tutorial-battle' | 'companion-event' | 'deep-battle';
type GamePhase = 'narrating' | 'action';

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
  '不购买药水返回公会登记',
];

const NODE_CHOICE_LIMIT = 3;
const GUILD_INTEL_NODE_HINTS = [
  '前往回声酒馆找萨洛打听三名队友',
  '先查看失踪远征队登记册【调查DC12】',
  '追问赫尔曼最近魔物上涌细节【洞悉DC13】',
];

const AUTO_SAVE_SLOT: SaveSlotKey = 'auto';

const SCRIPTED_PORTRAIT_OVERRIDES: Record<string, Record<string, string>> = {};

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

function hasClue(state: GameState, clueId: string) {
  const clues = Array.isArray(state.clues) ? state.clues : [];
  return clues.some((clue) => (typeof clue === 'string' ? clue === clueId : clue?.id === clueId));
}

function getForcedCompanionEventId(state: GameState): string | null {
  if (hasStateFlag(state, 'spore_outpost_reached', 'spore_outpost_arrived', 'arrivedSporeOutpost')
      && !hasStateFlag(state, 'ailin_wounded_names_done', 'completedAilinSideQuest')) {
    return 'ailin_wounded_names';
  }
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
      '查看吊箱封条【调查DC12】',
      '询问瑟琳这些魔物为什么怕光【奥秘DC13】',
      '前往冒险者公会登记',
    ];
  }

  if (state.guild_registered && !state.salo_intel_done) {
    const area = String(state.current_area || '');
    if (area.includes('酒馆')) {
      return state.tavern_dice_done
        ? ['听萨洛说明三名队友的位置', '向萨洛打听地底堡垒传闻【魅力DC12】', '和瑟琳讨论远征路线']
        : ['和萨洛玩一局快艇骰子', '先在酒馆里转转再说'];
    }
    return hasClue(state, 'expedition_saw_spore_beasts')
      ? ['追问书记员报告中的孢化地底兽', ...GUILD_INTEL_NODE_HINTS].slice(0, 4)
      : GUILD_INTEL_NODE_HINTS;
  }

  if (state.salo_intel_done && !state.al_recruited) {
    return [
      '前往静默神殿寻找艾琳',
      '询问萨洛艾琳最近在照顾谁【洞悉DC12】',
      '和瑟琳确认招募顺序',
    ];
  }

  if (state.al_recruited && !state.brock_recruited) {
    const area = String(state.current_area || '');
    if (area.includes('神殿') || area.includes('教堂')) {
      return [
        '让艾琳疗伤【医药DC12】',
        '询问教堂历史【历史DC10】',
        '为战士祈祷',
        '回到回声酒馆找布洛克',
      ];
    }
    if (area.includes('酒馆') && state.brock_intro_seen) {
      return [
        '陪布洛克喝得尽兴',
        '询问布洛克需要采集哪种孢子样本【自然DC12】',
        '向萨洛确认布洛克的报酬行情【洞悉DC12】',
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
        '和凯娅确认她能处理的陷阱类型【巧手DC13】',
        '询问奥兰盲盒保底规则【洞悉DC12】',
      ];
    }
    return [
      '前往黑市寻找凯娅',
      '询问布洛克黑市附近的路况【生存DC12】',
      '和瑟琳确认米娜给出的暗号',
    ];
  }

  if (state.kaiya_recruited && state.tavern_yunling_unlocked && !state.yunling_shop_unlocked && !state.yunling_met) {
    return ['根据萨洛额外情报寻找云苓', '询问凯娅黑市深处的药剂商【调查DC12】', '整理下孢海前的药剂需求'];
  }

  // 云苓商店已开放，尚未完成购买 → 显示入口选项
  if (state.kaiya_recruited && state.yunling_shop_unlocked && state.yunling_met && !state.expedition_registered) {
    return ['购买药剂', '不购买，返回公会登记'];
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

  if (state.expedition_registered && arrivedSporeOutpost && !ailinSideDone) {
    return ['停下协助艾琳救治伤员', '判断伤员污染程度【医疗DC12】', '整理阵亡者名册【调查DC13】'];
  }

  if (ailinSideDone && !blueShoalDone) {
    return ['前往蓝伞浅滩', '确认蓝伞浅滩安全路线【生存DC13】', '让艾琳评估队伍污染状态'];
  }

  if (blueShoalDone && !brockSideDone) {
    return ['跟随布洛克调查回声菌林', '听布洛克解释呼救声规律【生存DC13】', '协助布洛克配置净化粉【自然DC14】'];
  }

  if (brockSideDone && !forwardPostReached) {
    return ['前往前线废弃据点', '检查沿途旧路标【调查DC12】', '让布洛克追踪污染痕迹【生存DC13】'];
  }

  if (forwardPostReached && !kaiyaSideDone) {
    return ['让凯娅检查少了两个封扣', '检查补给箱封扣与锁痕【调查DC12】', '让凯娅判断暗道机关【巧手DC13】'];
  }

  if (kaiyaSideDone && !boneMarshDone) {
    return ['前往骨柱湿地', '确认骨柱湿地的怪物活动【感知DC13】', '追踪拖拽痕迹前往骨柱湿地【生存DC13】'];
  }

  if (state.rhein_encounter_started && typeof state.helpedRhein !== 'boolean') {
    return ['帮助莱因', '无视莱因，继续前进'];
  }

  if (state.pre_boss_rest_done && !serinSideDone) {
    return ['检查瑟琳银杖裂痕', '和瑟琳交谈', '让瑟琳分析黑石脉冲规律【奥秘DC14】'];
  }

  if (serinSideDone && !bossDone) {
    return ['进入黑石根区深处', '确认队伍Boss战前状态', '让瑟琳分析黑石脉冲规律【奥秘DC14】'];
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

function readNodeUsedChoices(state: GameState, nodeId: string) {
  const raw = state[nodeChoiceStateKey(nodeId)];
  if (Array.isArray(raw)) return raw.map((item) => String(item));
  if (typeof raw === 'string') return raw.split('|').map((item) => item.trim()).filter(Boolean);
  return [];
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

function filterNodeSuggestions(state: GameState, hints: string[]) {
  const node = getActiveActionNode(state);
  if (!node) return hints;

  const used = new Set(readNodeUsedChoices(state, node.id));
  const count = Number(state[nodeChoiceCountKey(node.id)] ?? used.size);
  const mainKey = normalizeNodeAction(node.mainHint);
  const sourceHints = hints.length ? hints : node.hints;
  const filtered = sourceHints.filter((hint) => {
    const key = normalizeNodeAction(hint);
    if (count >= NODE_CHOICE_LIMIT) return key === mainKey;
    return !used.has(key);
  });

  if (filtered.length) return filtered.slice(0, 3);
  return [node.mainHint];
}

function constrainActionSuggestions(state: GameState, incoming: ActionSuggestion[] = []) {
  const linearHints = linearRecruitmentHints(state);
  if (linearHints.length) return makeSuggestions(filterNodeSuggestions(state, linearHints));
  const hints = incoming.length ? incoming.map((item) => item.text || item.label) : fallbackSuggestions(state).map((item) => item.text);
  return makeSuggestions(filterNodeSuggestions(state, hints));
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
      return makeSuggestions(['陪布洛克喝得尽兴', '询问布洛克需要采集哪种孢子样本【自然DC12】', '向萨洛确认布洛克的报酬行情【洞悉DC12】']);
    }
    if (state.tavern_dice_done && !state.salo_intel_done) {
      return makeSuggestions(['听萨洛说明三名队友的位置', '向萨洛打听地底堡垒传闻【魅力DC12】', '和瑟琳讨论远征路线']);
    }
    return makeSuggestions(['接受游戏', '付100G购买萨洛的情报']);
  }
  if (area.includes('公会')) {
    const guildHints = ['查看远征档案【调查DC12】', '打听地底堡垒传闻【感知DC12】', '与米娜确认任务细节'];
    if (hasClue(state, 'expedition_saw_spore_beasts')) {
      guildHints.unshift('追问书记员报告中的孢化地底兽');
    }
    return makeSuggestions(guildHints.slice(0, 4));
  }
  if (area.includes('孢海') || area.includes('菌林') || area.includes('湿地')) {
    return makeSuggestions(['谨慎探查周围【感知DC14】', '让凯娅检查陷阱【巧手DC15】', '让布洛克辨识真菌生态【自然DC13】']);
  }
  if (area.includes('黑石') || area.includes('黑暗之门')) {
    return makeSuggestions(['分析黑石结构【奥秘DC15】', '辨识三圈纹路【历史DC14】', '请求瑟琳感知时间异常【魅力DC12】']);
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
      const isDialogue = /^["“「]/.test(text.trim());
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

interface OpeningActionTutorialProps {
  step: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}

const OPENING_ACTION_TUTORIAL = [
  {
    title: '选择行动',
    body: '当剧情发展到特定时刻时，主持人会提醒你进入“选择行动阶段”。下方会列出几条推荐行动，你可以直接点击其中一项，也可以在输入框写自己的做法，再点“执行”。AI主持人会根据你的行动以及判定点数推进剧情。',
    badge: 'ACTION',
  },
  {
    title: '骰子判定',
    body: '带有“DC+数字”的行动会触发判定。需要你投掷一个对应面数的骰子（一般为20面骰，简称为D20），最终结果为骰子点数 + 属性调整值 + 熟练加值。对比行动所给出的DC，大于等于目标值则行动成功。小于目标值则行动失败',
    badge: 'DC(检定难度)',
  },
  {
    title: '大成功/大失败',
    body: '当骰面结果为1时称为大失败，大失败时会受到特别的惩罚。当骰面结果为20时称为大成功，会有特别的奖励或增益。',
    badge: '大成功/大失败',
  },
];

function OpeningActionTutorial({
  step,
  total,
  onPrevious,
  onNext,
  onClose,
}: OpeningActionTutorialProps) {
  const item = OPENING_ACTION_TUTORIAL[step] ?? OPENING_ACTION_TUTORIAL[0];
  const isFirst = step <= 0;
  const isLast = step >= total - 1;

  return (
    <motion.div
      className="opening-action-tutorial"
      role="dialog"
      aria-modal="true"
      aria-label="新手行动教程"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(event) => event.stopPropagation()}
    >
      <motion.div
        className="opening-action-tutorial-card"
        initial={{ opacity: 0, y: -14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.96 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <div className="opening-action-tutorial-progress">
          <i style={{ width: `${((step + 1) / total) * 100}%` }} />
        </div>
        <header>
          <span>{item.badge}</span>
          <button type="button" aria-label="关闭新手教程" onClick={onClose}>
            ×
          </button>
        </header>
        <h2>{item.title}</h2>
        <p>{item.body}</p>
        <footer>
          <button type="button" className="opening-action-tutorial-prev" disabled={isFirst} onClick={onPrevious}>
            上一步
          </button>
          <small>
            {step + 1} / {total}
          </small>
          <button type="button" className="opening-action-tutorial-next" onClick={onNext}>
            {isLast ? '开始行动' : '下一步'}
          </button>
        </footer>
      </motion.div>
    </motion.div>
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
  const [companionEventId, setCompanionEventId] = useState('block_echo_forest'); // 当前同伴支线 ID
  const [deepBattleId, setDeepBattleId] = useState(''); // 深层战斗ID（蓝伞/骨柱/Boss）
  const [helpedRhein, setHelpedRhein] = useState<boolean | null>(null); // 莱因选择
  const [bossCoreChoice, setBossCoreChoice] = useState<string | null>(null); // Boss核心选择
  const [showDialogueLog, setShowDialogueLog] = useState(false);
  const [showCityMap, setShowCityMap] = useState(false);
  const [showTavernDice, setShowTavernDice] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveMessageTone, setSaveMessageTone] = useState<'neutral' | 'success' | 'error'>('neutral');
  const [pendingTutorialBattleSetup, setPendingTutorialBattleSetup] = useState<TutorialBattleSetup | null>(null);
  const [openingFastForward, setOpeningFastForward] = useState(false);
  const [fastForwardMode, setFastForwardMode] = useState(false);
  const [ctrlKeyHeld, setCtrlKeyHeld] = useState(false);
  const [scriptedBgOverride, setScriptedBgOverride] = useState<string | null>(null);
  const [visualResetKey, setVisualResetKey] = useState(0);
  const [showActionPanel, setShowActionPanel] = useState(false); // 行动面板延迟显示
  const [openingActionTutorialDismissed, setOpeningActionTutorialDismissed] = useState(false);
  const [openingActionTutorialStep, setOpeningActionTutorialStep] = useState(0);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(() => readStoredVolume(AUDIO_STORAGE_KEYS.bgmVolume, 0.65));
  const [sfxVolume, setSfxVolume] = useState(() => readStoredVolume(AUDIO_STORAGE_KEYS.sfxVolume, 0.8));
  const [externalBgmTrack, setExternalBgmTrack] = useState('');

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
  const diceFiredRef = useRef(false); // 防重复投骰
  const tutorialBattleIntentRef = useRef(false);
  const tutorialBattleDiceRef = useRef<DiceResult | null>(null);
  const tutorialBattleActionRef = useRef('');
  const dicePokerPendingRef = useRef<string>(''); // 已进骰子游戏但尚未请求后端叙事
  const dicePokerAutoTriggeredRef = useRef(false); // 防止自动触发骰子游戏多次
  const scriptedBgSceneRef = useRef<string>('');    // 记录 override 对应的场景 id
  const autoSaveBusyRef = useRef(false);

  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  const clearEventTimers = useCallback(() => {
    eventTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    eventTimersRef.current = [];
  }, []);

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
      const statePatch: GameState = {
        ...(scene.statePatch ?? {}),
        ...(options.extraStatePatch ?? {}),
        ...(shouldShowPreDescentTrust ? { pre_descent_trust_feedback_done: true } : {}),
        ...(scene.setArea ? { current_area: scene.setArea, actions_in_area: 0 } : {}),
        last_event: options.extraStatePatch?.last_event || scene.lastEvent || playerAction || '固定剧情推进',
      };

      if (Object.keys(statePatch).length) {
        const nextState = { ...stateRef.current, ...statePatch };
        stateRef.current = nextState;
        setGameState(nextState);
        if (gameId) {
          void patchGameState(gameId, statePatch).catch((error: any) => {
            addEvent(error.message || '固定剧情状态同步失败', 'error');
          });
        }
      }

      setStory((prev) => {
        const newLines: StoryLine[] = [...injectedLines, ...scene.lines].map((line) => ({
          id: lineId.current++,
          role: 'kp' as const,
          speaker: line.speaker,
          text: line.text,
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
      const hints = options.dynamicHints ?? scene.hints;
      setSuggestions(options.dynamicHints ? makeSuggestions(hints) : constrainActionSuggestions({ ...stateRef.current, ...statePatch }, makeSuggestions(hints)));
      setScriptedBgOverride(scene.bgImage || null);
      scriptedBgSceneRef.current = scene.setArea || '';
      setPhase('narrating');
    },
    [addEvent, appendStoryLines, gameId, gameState.player_name],
  );

  const saveCurrentGame = useCallback(
    async (slotKey: SaveSlotKey, options: { silent?: boolean; phaseOverride?: GamePhase } = {}) => {
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
        const saveTitlePrefix = slotKey === AUTO_SAVE_SLOT ? '自动' : '';
        const saveTitle = `${saveTitlePrefix}${saveTitlePrefix ? ' · ' : ''}${gameState.player_name || '冒险者'} · ${gameState.current_area || '未知区域'}`;
        const result = await saveGame(gameId, {
          slot_key: slotKey,
          title: saveTitle,
          story,
          suggestions: constrainActionSuggestions(gameState, suggestions),
          active_index: activeIndex,
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
      gameState,
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
        const restoredStory = normalizeStoryLines(result.story);
        const maxLineId = restoredStory.reduce((max, line) => Math.max(max, line.id), 0);
        const restoredActiveIndex = restoredStory.length ? Math.min(Math.max(result.active_index, 0), restoredStory.length - 1) : 0;
        const restoredLine = restoredStory[restoredActiveIndex];
        const restoredBgImage = findInheritedBgImage(restoredStory, restoredActiveIndex);
        const restoredBgmTrack = resolveBgmTrack('game', restoredLine, result.state);

        lineId.current = maxLineId + 1;
        eventId.current = 1;
        kpSpeakerRef.current = '';
        setGameId(result.game_id);
        setGameState(result.state);
        setStory(restoredStory);
        setActiveIndex(restoredActiveIndex);
        setPhase(result.phase === 'narrating' ? 'narrating' : 'action');
        setStreaming(false);
        setSuggestions(constrainActionSuggestions(result.state, result.suggestions));
        setPendingTutorialBattleSetup(null);
        setOpeningFastForward(false);
        setFastForwardMode(false);
        setExternalBgmTrack('');
        setScriptedBgOverride(restoredBgImage);
        scriptedBgSceneRef.current = restoredBgImage ? String(result.state.current_area || '') : '';
        setVisualResetKey((key) => key + 1);
        setOpeningActionTutorialDismissed(false);
        setOpeningActionTutorialStep(0);
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
    [addEvent, clearEventTimers, playBgmTrack, saveBusySlot, screen, stopBgmTrack, streaming, upsertSaveSummary],
  );

  const startGame = useCallback(
    async (payload: CreateGamePayload) => {
      setScreen('loading');
      setLoadError('');
      setStory([]);
      clearEventTimers();
      setEvents([]);
      setSuggestions([]);
      setActiveIndex(0);
      setPhase('narrating');
      setSaveMessage('');
      setSaveMessageTone('neutral');
      setPendingTutorialBattleSetup(null);
      setOpeningFastForward(false);
      setScriptedBgOverride(null);
      setOpeningActionTutorialDismissed(false);
      setOpeningActionTutorialStep(0);
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
        const nextState = { ...result.state, ...openingStatePatch };

        setGameId(result.game_id);
        setGameState(nextState);

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
    [addEvent, appendStoryLines, clearEventTimers, runtime],
  );

  const startStoryTest = useCallback(
    async (checkpoint: StoryTestCheckpoint) => {
      setScreen('loading');
      setLoadError('');
      setStory([]);
      clearEventTimers();
      setEvents([]);
      setSuggestions([]);
      setActiveIndex(0);
      setPhase('narrating');
      setSaveMessage('');
      setSaveMessageTone('neutral');
      setPendingTutorialBattleSetup(null);
      setOpeningFastForward(false);
      setFastForwardMode(false);
      setScriptedBgOverride(null);
      setOpeningActionTutorialDismissed(false);
      setOpeningActionTutorialStep(0);
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
        const nextState = {
          ...result.state,
          ...statePatch,
        };
        const scriptLines = checkpoint.lines ?? scene?.lines ?? [
          {
            speaker: '系统',
            text: `已进入剧情测试节点：${checkpoint.label}`,
          },
        ];

        setGameId(result.game_id);
        setGameState(nextState);
        stateRef.current = nextState;
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

        void patchGameState(result.game_id, statePatch).catch((error: any) => {
          addEvent(error.message || '剧情测试状态同步失败', 'error');
        });
        setScreen('game');
      } catch (error: any) {
        setLoadError(error.message || '剧情测试启动失败');
      }
    },
    [addEvent, clearEventTimers, runtime],
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
          nextHints: ['前往蓝伞浅滩', '让艾琳评估队伍污染状态', '确认浅滩安全路线【生存DC13】'],
          extraPatch: {
            completedAilinSideQuest: true,
            currentNodeId: 'battle_blue_shoal_01',
          },
        },
        block_echo_forest: {
          trustKey: 'trust_block',
          doneKey: 'block_echo_forest_done',
          area: '无光孢海·回声菌林出口',
          nextHints: ['前往前线废弃据点', '检查沿途旧路标【调查DC12】', '让布洛克追踪污染痕迹【生存DC13】'],
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
          nextHints: ['进入黑石根区深处', '确认队伍Boss战前状态', '让瑟琳分析黑石脉冲规律【奥秘DC14】'],
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

  const submitAction = useCallback(
    (text: string) => {
      const action = text.trim();
      if (!action || !gameId || streaming) return;
      setOpeningActionTutorialDismissed(true);

      const currentState = stateRef.current;
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

      const activeNode = getActiveActionNode(currentState);
      const matchedNodeHint = activeNode ? findNodeHint(action, activeNode) : null;
      if (activeNode) {
        const actionKey = normalizeNodeAction(matchedNodeHint || action);
        const isMainAction = isNodeMainAction(action, activeNode, matchedNodeHint);
        const usedChoices = readNodeUsedChoices(currentState, activeNode.id);
        const usedSet = new Set(usedChoices);
        const currentCount = Number(currentState[nodeChoiceCountKey(activeNode.id)] ?? usedChoices.length);

        if (matchedNodeHint && usedSet.has(actionKey)) {
          blockRoute('瑟琳：「这条线索刚刚已经查过了。我们别在同一页记录上打转，换一个方向，或者直接去回声酒馆找萨洛。」', filterNodeSuggestions(currentState, activeNode.hints));
          return;
        }

        if (currentCount >= NODE_CHOICE_LIMIT && !isMainAction) {
          blockRoute('瑟琳：「这个节点能查的已经够多了。再拖下去只会耽误招募时间，下一步去回声酒馆找萨洛。」', [activeNode.mainHint]);
          return;
        }

        if (!isMainAction) {
          const nextUsedChoices = matchedNodeHint ? [...usedChoices, actionKey] : usedChoices;
          const nodePatch: GameState = {
            [nodeChoiceStateKey(activeNode.id)]: nextUsedChoices.join('|'),
            [nodeChoiceCountKey(activeNode.id)]: Math.min(NODE_CHOICE_LIMIT, currentCount + 1),
          };
          stateRef.current = { ...currentState, ...nodePatch };
          setGameState((prev) => ({ ...prev, ...nodePatch }));
          if (gameId) {
            void patchGameState(gameId, nodePatch).catch((error: any) => addEvent(error.message || '节点选择状态同步失败', 'error'));
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
          '询问萨洛布洛克的脾气【洞悉DC12】',
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

      // 艾琳支线：白枝下的名字（孢海据点后）
      const wantsAilinSideEvent = /停下协助艾琳|救治伤员|检查伤员|检查污染|判断伤员污染|整理名册|阵亡者名册|帮艾琳|艾琳.*伤员/.test(action);
      if (wantsAilinSideEvent && (currentState.spore_outpost_reached || currentState.spore_outpost_arrived) && !currentState.ailin_wounded_names_done) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        setCompanionEventId('ailin_wounded_names');
        setSuggestions([]);
        setPhase('narrating');
        setScreen('companion-event');
        return;
      }

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
            '确认蓝伞浅滩安全路线【生存DC13】',
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
        blockRoute('艾琳停在伤员棚前：「路线可以等一刻钟，污染不会等。先让我确认他们还能不能说话。」', [
          '停下协助艾琳救治伤员',
          '判断伤员污染程度【医疗DC12】',
          '整理阵亡者名册【调查DC13】',
        ]);
        return;
      }

      const wantsAbandonedPost = /前往前线废弃据点|前往废弃据点|调查废弃据点|进入废弃据点/.test(action);
      if (currentState.blue_shoal_battle_done && !currentState.block_echo_forest_done && wantsAbandonedPost) {
        blockRoute('布洛克抬手拦住队伍：「先别走直线。那片回声菌林在学人喊救命，不把污染菌核处理掉，后路会一直跟着我们叫。」', [
          '跟随布洛克调查回声菌林',
          '听布洛克解释呼救声规律【生存DC13】',
          '协助布洛克配置净化粉【自然DC14】',
        ]);
        return;
      }

      const wantsBoneMarsh = /前往骨柱湿地|进入骨柱|骨柱湿地|穿过湿地/.test(action);
      if (currentState.frontline_abandoned_outpost_reached && !currentState.kaiya_broken_seals_done && wantsBoneMarsh) {
        blockRoute('凯娅蹲在补给箱前，指尖按住新鲜的切痕：「少了两个封扣。先查清楚这条暗道，不然湿地里会有人替我们收账。」', [
          '让凯娅检查少了两个封扣',
          '检查补给箱封扣与锁痕【调查DC12】',
          '让凯娅判断暗道机关【巧手DC13】',
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

      // 云苓商店入口选项：不购买 → 离开
      if (currentState.yunling_shop_unlocked && /不购买.*返回公会|不买.*返回/.test(action.trim())) {
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

      // ====== 深层主线触发：蓝伞浅滩战斗 ======
      if (currentState.spore_outpost_reached && !currentState.blue_shoal_battle_done && /前往蓝伞浅滩|进入蓝伞|蓝伞浅滩|穿过浅滩/.test(action)) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        startDeepBattle('enemy_pack_blue_shoal', () => {
          // 胜利：进入战后结算
          const afterBattle = getScriptedScene('after-battle-blue-shoal');
          if (afterBattle) playScriptedScene(afterBattle, { focus: false });
        }, () => {
          appendStoryLines([
            '蓝伞浅滩的孢光将队伍逼退。你们退回据点边缘重新整队，确认路线后还可以再次进入浅滩。',
          ], 'kp', '主持人', true);
          setSuggestions(makeSuggestions(['前往蓝伞浅滩', '确认蓝伞浅滩安全路线【生存DC13】', '让艾琳评估队伍污染状态']));
          setPhase('narrating');
        });
        return;
      }

      // ====== 深层主线触发：骨柱湿地战斗 ======
      if (currentState.kaiya_broken_seals_done
          && !currentState.bone_marsh_battle_done
          && /前往骨柱湿地|进入骨柱|骨柱湿地|穿过湿地/.test(action)) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        startDeepBattle('enemy_pack_bone_marsh', () => {
          // 胜利：触发莱因登场
          const rheinScene = getScriptedScene('rhein-encounter');
          if (rheinScene) playScriptedScene(rheinScene, { focus: false });
        }, () => {
          appendStoryLines([
            '骨柱湿地的敌群把队伍压回废弃据点方向。凯娅重新确认暗道补给，布洛克提醒你们下一次必须更快通过湿地中心。',
          ], 'kp', '主持人', true);
          setSuggestions(makeSuggestions(['前往骨柱湿地', '确认骨柱湿地的怪物活动【感知DC13】', '追踪拖拽痕迹前往骨柱湿地【生存DC13】']));
          setPhase('narrating');
        });
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
        startDeepBattle('boss_blackstone_gatekeeper', () => {
          // Boss 击败：触发核心选择
          const coreScene = getScriptedScene('blackstone-core-choice');
          if (coreScene) playScriptedScene(coreScene, { focus: false });
        }, () => {
          // Boss 团灭：逆时归零坏结局 → 回到标题画面
          appendStoryLines([
            '黑石脉冲将队伍击倒在地。你感到时间在倒流——不，是有什么东西在把时间往回拨。你听见瑟琳喊了什么，但声音越来越远……然后一切归于寂静。',
          ], 'kp', '主持人', true);
          patchStateNow({
            act1_ending: 'ending_bad_time_reset',
            act1_ending_title: '逆时归零',
            endingId: 'ending_bad_time_reset',
            currentNodeId: 'ending_bad_time_reset',
            blackstone_gatekeeper_result: 'lose',
          }, 'Boss失败结局状态同步失败');
          // 显示结局后跳转标题画面
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

      const firstChoice = isFirstPlayerChoice(story, stateRef.current);
      const retreatChoice = RETREAT_ACTION_RE.test(action);
      const shouldPrepareTutorialBattle = firstChoice;
      const forcedBattleAction = retreatChoice
        ? `${action}。瑟琳立刻用银杖封住后撤路线，提醒队伍不能把裂隙爬兽放进人群，必须就地迎击最近的敌人`
        : action;
      const resolvedAction = shouldPrepareTutorialBattle ? ensureFirstBattleCheck(forcedBattleAction) : action;

      abortRef.current?.abort();
      parserRef.current = createNarrativeStreamParser();
      streamSuggestionsRef.current = [];
      diceFiredRef.current = false; // 重置骰子锁
      tutorialBattleIntentRef.current = shouldPrepareTutorialBattle;
      tutorialBattleDiceRef.current = null;
      tutorialBattleActionRef.current = shouldPrepareTutorialBattle ? action : '';
      let streamedNarrativeLineCount = 0;
      setPhase('narrating');
      setStreaming(true);
      setSuggestions([]);
      setPendingTutorialBattleSetup(null);
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
          addEvent(runtime.formatSystemEvent(parsed), parsed.type === 'error' ? 'error' : 'dice');
          // 骰子动画：每轮最多触发一次
          if (!diceFiredRef.current && (parsed.type === 'skill_check' || parsed.type === 'attack_roll')) {
            diceFiredRef.current = true;
            if (tutorialBattleIntentRef.current) tutorialBattleDiceRef.current = parsed;
            setDiceRoll(parsed);
          }
        },
        onStateUpdate: (change) => {
          setGameState((prev) => runtime.applyStateChange(prev, change));
          addEvent(runtime.formatStateChange(change), 'state');
        },
        onDone: () => {
          const parsed = parserRef.current.flush();
          if (parsed.suggestions.length) streamSuggestionsRef.current = parsed.suggestions;
          if (parsed.lines.length) {
            streamedNarrativeLineCount += parsed.lines.length;
            appendStoryLines(parsed.lines, 'kp', '主持人');
          }
          if (tutorialBattleIntentRef.current) {
            const setup = buildTutorialBattleSetup(tutorialBattleDiceRef.current, tutorialBattleActionRef.current);
            setPendingTutorialBattleSetup(setup);
            // 通过底部对话框告知玩家判定结果和具体效果
            appendStoryLines(setup.dialogueLines, 'system', '系统', streamedNarrativeLineCount === 0);
            setGameState((prev) => ({
              ...prev,
              first_choice_resolved: true,
              tutorial_battle_pending: false,
              current_area: '逆穹悬城·主缆街',
              last_event: '开局判定完成，等待进入教学战斗',
            }));
            setSuggestions(makeSuggestions(['进入教学战斗']));
            addEvent('开局判定将影响战斗', 'state');
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
          appendStoryLines([message], 'system', '系统');
          if (tutorialBattleIntentRef.current) {
            const fallbackSetup = buildTutorialBattleSetup(null, tutorialBattleActionRef.current);
            setPendingTutorialBattleSetup(fallbackSetup);
            appendStoryLines(fallbackSetup.dialogueLines, 'system', '系统', true);
            setGameState((prev) => ({
              ...prev,
              first_choice_resolved: true,
              tutorial_battle_pending: false,
              current_area: '逆穹悬城·主缆街',
              last_event: '主持人兜底后进入教学战斗',
            }));
            setSuggestions(makeSuggestions(['进入教学战斗']));
          } else {
            setSuggestions(constrainActionSuggestions(stateRef.current));
          }
        },
      });
    },
    [addEvent, appendStoryLines, gameId, gameState.player_name, playScriptedScene, runtime, story, streaming],
  );

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
      const outcome = result.playerWins >= 2 ? 'decisive' : result.playerWins >= 1 ? 'narrow' : 'fail';
      const trustBase = outcome === 'decisive' ? 68 : outcome === 'narrow' ? 60 : 50;
      const patch: GameState = {
        sl_recruited: true,
        sl_trust: trustBase,
        brock_recruited: true,
        brock_drinking_done: true,
        brock_drinking_wins: result.playerWins,
        brock_drinking_outcome: outcome,
        brock_spore_sample_deal: true,
        last_event: `与布洛克喝酒骰子：${result.playerWins}胜${result.brockWins}负`,
      };
      setGameState((prev) => ({ ...prev, ...patch }));
      addEvent('布洛克加入队伍', 'state');

      // 根据胜负展示不同对话
      const lines: Array<{ speaker: string; text: string }> = outcome === 'decisive' ? [
        { speaker: '主持人', text: '第三轮骰子停下时，酒桌旁短暂安静了一瞬。布洛克看着你的点数，又看了看你还算清醒的眼神，终于咧嘴笑了。' },
        { speaker: '布洛克', text: '「行。能喝，能扛，骰运也不差。至少你进孢海以后，不会第一天就让我背回来。」' },
        { speaker: '布洛克', text: '「我跟你们走。条件再说一遍：采集三份活性孢子，不准焚烧菌巢，也不准把活样本扔进城市排水沟。」' },
        { speaker: '瑟琳', text: '「报酬由公会结算，样本归属也会写进附约。」' },
        { speaker: '布洛克', text: '「你说话像本账册，不过账册至少可靠。好，进了孢海以后听我指挥，别看见发光的东西就伸手。」' },
        { speaker: '主持人', text: '布洛克收起菌片，将铁锅挂在背包外侧。远征队里，又多了一名熟悉孢海的生存专家。' },
      ] : outcome === 'narrow' ? [
        { speaker: '主持人', text: '最后一轮结束时，你已经能感觉到酒劲顶上额角，但骰子的结果仍然压过了布洛克。' },
        { speaker: '布洛克', text: '「赢得不漂亮，但赢了就是赢了。」' },
        { speaker: '布洛克', text: '「记住这种感觉。孢海里很多时候也一样，活下来不需要漂亮，只需要够稳。」' },
        { speaker: '布洛克', text: '「我跟你们走。采集活性孢子、不准烧菌巢，规矩等下细说。」' },
        { speaker: '瑟琳', text: '「能赢过布洛克已经不易。先整理队伍状态，然后去黑市找凯娅。」' },
      ] : [
        { speaker: '主持人', text: '最后一轮骰子落定，布洛克的点数再次压过你。酒馆里响起几声压低的笑。' },
        { speaker: '布洛克', text: '「酒量一般，骰运也一般。」' },
        { speaker: '布洛克', text: '「不过你至少没嘴硬说自己没醉，这点比很多公会蠢货强。」' },
        { speaker: '布洛克', text: '「我可以跟你们走。但下去以后，听我的。尤其是你。」' },
        { speaker: '瑟琳', text: '「能让他点头已经不容易了。先去黑市找凯娅，路上再商量报酬细节。」' },
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
        '请布洛克说明活性孢子样本的安全采集法【自然DC12】',
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
      addEvent(`金币 -${result.spent}`, 'state');

      const patch: GameState = {
        gold: Math.max(0, currentGold - result.spent),
        inventory: nextInventory,
        lucky_box_done: true,
        lucky_box_attempts: result.drawCount,
        lucky_box_spent: result.spent,
        lucky_box_final_roll: result.finalD20,
        lucky_box_guaranteed: result.guaranteed,
        gotDiamondForKaiya: true,
        kaiya_diamond_paid: true,
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

  // 云苓药铺：离开
  const handleApothecaryExit = useCallback(() => {
    const registration = getScriptedScene('guild-final-registration');
    if (registration) {
      appendStoryLines(['不购买药水，返回公会登记'], 'player', gameState.player_name || '你', true);
      playScriptedScene(registration, { focus: false });
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
      setScreen('game');
      setDeepBattleId('');
      if (result?.outcome === 'win') {
        deepBattleWinRef.current?.();
      } else {
        deepBattleLoseRef.current?.();
      }
      deepBattleWinRef.current = null;
      deepBattleLoseRef.current = null;
    },
    [],
  );

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
  const canAdvance = Boolean(currentLine) && (activeIndex < story.length - 1 || !streaming);
  const requestedBgmTrack = useMemo(() => externalBgmTrack || resolveBgmTrack(screen, currentLine, gameState), [externalBgmTrack, screen, currentLine, gameState]);
  const visibleSuggestions = constrainActionSuggestions(gameState, suggestions);
  const areaText = String(gameState.current_area || '');
  const showLuckyBoxEntry = /黑市|补给市场|市场|奥兰|凯娅/.test(areaText) && Boolean(gameState.kaiya_intro_seen && !gameState.kaiya_recruited);
  const cityAreaVisited = /冒险者公会|回声酒馆|酒馆|黑市|补给市场|市场|静默神殿|神殿|降渊缆梯|缆梯/.test(areaText);
  const canUseCityMap = CITY_MAP_ENABLED && Boolean(gameState.city_map_unlocked || gameState.guild_registered || cityAreaVisited);
  const showOpeningActionTutorial =
    screen === 'game' &&
    phase === 'action' &&
    showActionPanel &&
    !openingActionTutorialDismissed &&
    isFirstPlayerChoice(story, gameState);

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

  const advanceLine = useCallback(() => {
    if (activeIndex < story.length - 1) {
      setActiveIndex((index) => Math.min(index + 1, story.length - 1));
      return;
    }

    if (!streaming) {
      if (pendingTutorialBattleSetup) {
        setPhase('narrating');
        setScreen('tutorial-battle');
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
  }, [activeIndex, pendingTutorialBattleSetup, saveCurrentGame, story.length, streaming]);

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
    setDiceRoll(null);
    setEvents([]);
    setPendingTutorialBattleSetup(null);
    setOpeningFastForward(false);
    setScriptedBgOverride(null);
    setOpeningActionTutorialDismissed(false);
    setOpeningActionTutorialStep(0);
    tutorialBattleIntentRef.current = false;
    tutorialBattleDiceRef.current = null;
    setSaveMessage('');
    setSaveMessageTone('neutral');
    setScreen('main-menu');
  }, [clearEventTimers]);

  const completeTutorialBattle = useCallback(() => {
    // 防止重复触发
    if (stateRef.current.tutorial_battle_done) return;

    const tutorialStatePatch: GameState = {
      first_choice_resolved: true,
      tutorial_battle_done: true,
      tutorial_battle_pending: false,
      current_area: '逆穹悬城·主缆街',
      last_event: '击退补给吊箱中的裂隙爬兽',
    };

    setGameState((prev) => ({
      ...prev,
      ...tutorialStatePatch,
    }));
    if (gameId) {
      void patchGameState(gameId, tutorialStatePatch).catch((error: any) => {
        addEvent(error.message || '教学战斗状态同步失败', 'error');
      });
    }
    setPhase('narrating');
    setSuggestions(makeSuggestions([
      '查看吊箱封条【调查DC12】',
      '询问瑟琳这些魔物为什么怕光【奥秘DC13】',
      '前往冒险者公会登记',
    ]));
    setPendingTutorialBattleSetup(null);
    setOpeningFastForward(false);
    tutorialBattleIntentRef.current = false;
    tutorialBattleDiceRef.current = null;
    appendStoryLines([
      '最后一只裂隙爬兽被银白色光芒逼退，撞在吊箱边缘，蜷缩着失去了攻击性。',
      '瑟琳快步走到你身边，短银杖的微光扫过你的肩膀。瑟琳：「没有重伤。很好，你的反应速度比大部分第一次进悬城的人快。」',
      '黑缆守卫翻看着碎裂吊箱的封条，脸色渐渐沉了下来。守卫：「这是从孢海据点回收的空箱。最近三个月，类似事件发生了四次。」',
      '守卫收起手弩，语气严肃。守卫：「感谢你们出手。如果让它们冲进吊桥区，今天的通行记录上就要多几行红字了。」',
      '瑟琳的视线仍停在那些蓝绿色孢尘上。瑟琳：「四次不是偶然。它们不是主动潜进来的——箱壁内侧有拖痕，像是被什么东西赶上去的。」',
      '主缆街短暂安静下来，远处城市缆索发出低沉震响。守卫指了指公会方向。「冒险者公会在倒挂塔楼区，顺着主缆走到底。你们的委托应该需要先登记。」',
      '瑟琳将银杖收回腰间，对你微微点头。瑟琳：「先过去吧。米娜应该已经在等你了。」',
    ], 'kp', '主持人', true);
    addEvent('教学战斗完成', 'state');
    // 直接跳回游戏画面，不需要二次点击
    setScreen('game');
  }, [addEvent, appendStoryLines, gameId]);

  if (screen === 'main-menu') {
    return (
      <LazyBoundary>
        <TitleMenu
          onNewGame={() => setScreen('new-game')}
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

  if (screen === 'new-game') {
    return (
      <LazyBoundary>
        <StartDND
          onStart={startGame}
          onBack={() => setScreen('main-menu')}
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

  if (screen === 'loading') return <LoadingScreen error={loadError} onRetry={() => setScreen('new-game')} />;

  if (screen === 'tutorial-battle') {
    return (
      <LazyBoundary>
        <ErrorBoundary>
          <BattleTestScreen
            mode="tutorial"
            openingEffects={pendingTutorialBattleSetup?.openingEffects ?? []}
            onBack={() => {
              setPendingTutorialBattleSetup(null);
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
    return (
      <LazyBoundary>
        <ErrorBoundary>
          <BattleTestScreen
            mode="test"
            battleConfigOverride={battleConfig}
            onBack={() => setScreen('game')}
            onComplete={(result) => handleDeepBattleComplete(result)}
          />
        </ErrorBoundary>
      </LazyBoundary>
    );
  }

  if (showBargainGame) {
    return <LazyBoundary><BargainTestScreen onBack={() => setShowBargainGame(false)} onComplete={handleBargainComplete} /></LazyBoundary>;
  }

  if (showDrinkingDiceGame) {
    return <LazyBoundary><DrinkingDiceGame onBack={() => setShowDrinkingDiceGame(false)} onComplete={handleDrinkingDiceComplete} /></LazyBoundary>;
  }

  if (showLuckyBoxGame) {
    return (
      <LazyBoundary>
        <OrlanBoxGame
          gold={Number(gameState.gold ?? 200)}
          onBack={() => setShowLuckyBoxGame(false)}
          onComplete={handleOrlanBoxComplete}
        />
      </LazyBoundary>
    );
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
        actionPanel={
          showActionPanel ? (
            <ActionPanel suggestions={visibleSuggestions} disabled={streaming} onSubmit={submitAction} />
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

      {/* 骰子检定动画覆盖层 */}
      <DiceRollOverlay dice={diceRoll} dieType="d20" onClose={() => setDiceRoll(null)} />

      {showLuckyBoxEntry && (
        <button
          type="button"
          className="game-dice-poker-btn game-bargain-btn"
          onClick={() => setShowLuckyBoxGame(true)}
        >
          幸运盲盒
        </button>
      )}

      <button
        type="button"
        className="game-character-btn"
        aria-haspopup="dialog"
        aria-expanded={showCharacterInfo}
        onClick={() => setShowCharacterInfo(true)}
      >
        角色信息
      </button>

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
                    {gameState.player_name || '冒险者'} · {gameState.char_class || '战士'}
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
                    addEvent(runtime.formatSystemEvent(parsed), parsed.type === 'error' ? 'error' : 'dice');
                  },
                  onStateUpdate: (change) => {
                    setGameState((prev) => runtime.applyStateChange(prev, change));
                    addEvent(runtime.formatStateChange(change), 'state');
                  },
                  onDone: () => {
                    const parsed = parserRef.current.flush();
                    if (parsed.suggestions.length) streamSuggestionsRef.current = parsed.suggestions;
                    if (parsed.lines.length) appendStoryLines(parsed.lines, 'kp', '主持人');
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
              const saloPatch: GameState = saloIntel
                ? {
                    ...(saloIntel.statePatch ?? {}),
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
                    { id: lineId.current++, role: 'kp' as const, speaker: '萨洛', text: '「愿赌服输。我会把艾琳、布洛克、凯娅的位置和脾气都说清楚。你们最好记牢，找人比找路麻烦。另外，黑市深处有个药剂商叫云苓，她手里有真正能下孢海的药。」' },
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
                onSave={(slotKey) => { saveCurrentGame(slotKey); setShowGameSaves(false); }}
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
