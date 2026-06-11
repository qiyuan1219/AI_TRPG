import { Component, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ActionPanel } from './components/ActionPanel';
import { BattleTestScreen } from './components/BattleTestScreen';
import { BargainTestScreen, type BargainCompleteResult } from './components/BargainTestScreen';
import { CharacterPanel } from './components/CharacterPanel';
import { DicePokerGame } from './components/DicePokerGame';
import { DiceRollOverlay } from './components/DiceRollOverlay';
import type { EventFeedItem } from './components/EventFeed';
import { LoadGameScreen } from './components/LoadGameScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { SaveLoadPanel } from './components/SaveLoadPanel';
import { StartDND } from './components/StartDND';
import { TestScreen } from './components/TestScreen';
import { TitleMenu } from './components/TitleMenu';
import { VisualNovelStage } from './components/VisualNovelStage';
import { DialogueLog } from './components/DialogueLog';
import { DrinkingDiceGame } from './components/DrinkingDiceGame';
import { LuckyBoxGame } from './components/LuckyBoxGame';
import { CityMap } from './components/CityMap';
import { TavernDicePoker } from './components/TavernDicePoker';
import { findRegisteredSpeaker, resolveSpeakerName } from './data/characterRegistry';
import { resolveDndScene } from './data/dndScenes';
import { getScriptedScene, matchScriptedScene, type ScriptedScene } from './data/scriptedScenes';
import type { StoryTestCheckpoint } from './data/storyTestCheckpoints';
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
import { createNarrativeStreamParser, extractHints, makeSuggestions, parseNarrativeSegments, splitNarrative } from './utils/narrative';

type Screen = 'main-menu' | 'new-game' | 'load-game' | 'test' | 'loading' | 'game' | 'tutorial-battle';
type GamePhase = 'narrating' | 'action';

const DEFAULT_OPENING = '逆穹城倒挂在巨大洞穴的穹顶之上，蓝绿色荧光在远方深渊中明灭。你的冒险从这一刻开始。';
const RETREAT_ACTION_RE = /逃跑|撤退|脱战|逃离|后撤|拉开距离|跑路|避战|不战斗/;
const DC_CHECK_RE = /(?:DC|ＤＣ)\s*\d{1,2}/i;

interface TutorialBattleSetup {
  openingEffects: Array<{
    unitId: string;
    hpDelta?: number;
    acDelta?: number;
    statuses?: string[];
    traits?: string[];
    log: string;
  }>;
}

const YUNLING_POTION_OPTIONS: Array<{ action: string; key: string; label: string; stat?: string; cost: number }> = [
  { action: '购买力量药水', key: 'str_potion', label: '力量药水', stat: 'str', cost: 100 },
  { action: '购买敏捷药水', key: 'dex_potion', label: '敏捷药水', stat: 'dex', cost: 100 },
  { action: '购买体质药水', key: 'con_potion', label: '体质药水', stat: 'con', cost: 100 },
  { action: '购买智力药水', key: 'int_potion', label: '智力药水', stat: 'int', cost: 100 },
  { action: '购买感知药水', key: 'wis_potion', label: '感知药水', stat: 'wis', cost: 100 },
  { action: '购买魅力药水', key: 'cha_potion', label: '魅力药水', stat: 'cha', cost: 100 },
  { action: '购买治疗药水', key: 'healing_potion', label: '治疗药水', cost: 50 },
];

const YUNLING_SHOP_HINTS = [
  ...YUNLING_POTION_OPTIONS.map((option) => option.action),
  '不购买药水返回公会登记',
];

function findYunlingPotion(action: string) {
  return YUNLING_POTION_OPTIONS.find((option) => action.includes(option.action.replace('购买', '')) || action.includes(option.action));
}

function isFirstPlayerChoice(story: StoryLine[], state: GameState) {
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

function buildTutorialBattleSetup(dice: DiceResult | null): TutorialBattleSetup {
  const success = diceSucceeded(dice);
  const margin = getDiceMargin(dice);
  const rollText = dice
    ? `D20判定总计 ${dice.data.总计 ?? dice.data.结果 ?? '?'}`
    : '未取得明确骰点';

  // 🔴 铁律：判定无论成功失败，都必须进入完整战斗。只给战术优势/劣势，绝不秒杀。
  if (success && margin >= 5) {
    return {
      openingEffects: [
        {
          unitId: 'tutorial-crawler-a',
          hpDelta: -3,
          acDelta: -1,
          statuses: ['侧腹暴露'],
          traits: ['开局先制成功：HP-3，AC-1'],
          log: `开局先制成功：${rollText}。你抢在爬兽扑到之前切入侧腹——它嘶叫着踉跄后退，甲壳边缘裂开一道口子。`,
        },
        {
          unitId: 'tutorial-crawler-b',
          hpDelta: -2,
          acDelta: -1,
          statuses: ['畏光迟滞'],
          traits: ['开局先制成功：HP-2，AC-1'],
          log: '瑟琳趁势扬起一团银光。第二只爬兽被灼得偏头闪躲，动作明显慢了半拍。',
        },
      ],
    };
  }

  if (success) {
    return {
      openingEffects: [
        {
          unitId: 'tutorial-crawler-a',
          hpDelta: -2,
          statuses: ['重心偏移'],
          traits: ['开局判定成功：HP-2'],
          log: `开局判定成功：${rollText}。你压低重心迎上爬兽的冲势——它被顶得偏了方向，背脊撞上吊箱边缘。`,
        },
        {
          unitId: 'tutorial-crawler-b',
          acDelta: -1,
          statuses: ['阵脚散乱'],
          traits: ['开局判定成功：AC-1'],
          log: '另一只爬兽被同伴的撞击带乱了步伐，护甲下的软腹短暂暴露。',
        },
      ],
    };
  }

  return {
    openingEffects: [
      {
        unitId: 'tutorial-crawler-a',
        acDelta: -1,
        statuses: ['受惊'],
        traits: ['开局判定未成功：AC-1'],
        log: `开局判定未成功：${rollText}。爬兽比你预想的更敏捷——它从你手边擦过，但城市灯火让它不断眨眼，动作失了准头。`,
      },
      {
        unitId: 'tutorial-crawler-b',
        statuses: ['警觉'],
        traits: ['开局判定未成功：保持满血'],
        log: '第二只爬兽绕过吊箱从侧面逼近。它没有受伤，但狭小的补给平台让它的行动受到限制。',
      },
    ],
  };
}

function fallbackSuggestions(state: GameState): ActionSuggestion[] {
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
    return makeSuggestions(['查看远征档案【调查DC12】', '打听地底堡垒传闻【感知DC12】', '与米娜确认任务细节']);
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
      const text = line.text;
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
      });
    });

  return normalized;
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
  const [showDialogueLog, setShowDialogueLog] = useState(false);
  const [showCityMap, setShowCityMap] = useState(false);
  const [showTavernDice, setShowTavernDice] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveMessageTone, setSaveMessageTone] = useState<'neutral' | 'success' | 'error'>('neutral');
  const [pendingTutorialBattleSetup, setPendingTutorialBattleSetup] = useState<TutorialBattleSetup | null>(null);
  const [openingFastForward, setOpeningFastForward] = useState(false);
  const [fastForwardMode, setFastForwardMode] = useState(false);
  const [scriptedBgOverride, setScriptedBgOverride] = useState<string | null>(null);
  const [showActionPanel, setShowActionPanel] = useState(false); // 行动面板延迟显示

  const lineId = useRef(1);
  const eventId = useRef(1);
  const parserRef = useRef(createNarrativeStreamParser());
  const abortRef = useRef<AbortController | null>(null);
  const stateRef = useRef<GameState>({});
  const kpSpeakerRef = useRef('');
  const eventTimersRef = useRef<number[]>([]);
  const diceFiredRef = useRef(false); // 防重复投骰
  const tutorialBattleIntentRef = useRef(false);
  const tutorialBattleDiceRef = useRef<DiceResult | null>(null);
  const dicePokerPendingRef = useRef<string>(''); // 已进骰子游戏但尚未请求后端叙事
  const dicePokerAutoTriggeredRef = useRef(false); // 防止自动触发骰子游戏多次
  const scriptedBgSceneRef = useRef<string>('');    // 记录 override 对应的场景 id

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
    },
    [clearEventTimers],
  );

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
      const cleanTexts = texts.map((text) => text.trim()).filter(Boolean);
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

      const statePatch: GameState = {
        ...(scene.statePatch ?? {}),
        ...(options.extraStatePatch ?? {}),
        ...(scene.setArea ? { current_area: scene.setArea, actions_in_area: 0 } : {}),
        last_event: options.extraStatePatch?.last_event || scene.lastEvent || playerAction || '固定剧情推进',
      };

      if (Object.keys(statePatch).length) {
        setGameState((prev) => ({
          ...prev,
          ...statePatch,
        }));
        if (gameId) {
          void patchGameState(gameId, statePatch).catch((error: any) => {
            addEvent(error.message || '固定剧情状态同步失败', 'error');
          });
        }
      }

      setStory((prev) => {
        const newLines: StoryLine[] = scene.lines.map((line) => ({
          id: lineId.current++,
          role: 'kp' as const,
          speaker: line.speaker,
          text: line.text,
        }));
        const next = [...prev, ...newLines];
        if (options.focus !== false) {
          setActiveIndex(prev.length);
        }
        return next;
      });

      scene.events?.forEach((eventText) => addEvent(eventText, 'state'));
      const hints = options.dynamicHints ?? scene.hints;
      setSuggestions(makeSuggestions(hints));
      setScriptedBgOverride(scene.bgImage || null);
      scriptedBgSceneRef.current = scene.setArea || '';
      setPhase('narrating');
    },
    [addEvent, appendStoryLines, gameId, gameState.player_name],
  );

  const saveCurrentGame = useCallback(
    async (slotKey: SaveSlotKey) => {
      if (!gameId || streaming || saveBusySlot) return;

      setSaveBusySlot(slotKey);
      setSaveMessage('');
      setSaveMessageTone('neutral');

      try {
        const saveTitle = `${gameState.player_name || '冒险者'} · ${gameState.current_area || '未知区域'}`;
        const result = await saveGame(gameId, {
          slot_key: slotKey,
          title: saveTitle,
          story,
          suggestions: suggestions.length ? suggestions : fallbackSuggestions(gameState),
          active_index: activeIndex,
          phase,
        });

        upsertSaveSummary(result.save);
        setSaveMessage(`已写入：${result.save.title}`);
        setSaveMessageTone('success');
        addEvent('存档已写入', 'state');
      } catch (error: any) {
        const message = error.message || '保存失败';
        setSaveMessage(message);
        setSaveMessageTone('error');
        addEvent(message, 'error');
      } finally {
        setSaveBusySlot('');
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

        lineId.current = maxLineId + 1;
        eventId.current = 1;
        kpSpeakerRef.current = '';
        setGameId(result.game_id);
        setGameState(result.state);
        setStory(restoredStory);
        setActiveIndex(restoredStory.length ? Math.min(Math.max(result.active_index, 0), restoredStory.length - 1) : 0);
        setPhase(result.phase === 'narrating' ? 'narrating' : 'action');
        setStreaming(false);
        setSuggestions(result.suggestions.length ? result.suggestions : fallbackSuggestions(result.state));
        setPendingTutorialBattleSetup(null);
        setOpeningFastForward(false);
        tutorialBattleIntentRef.current = false;
        tutorialBattleDiceRef.current = null;
        clearEventTimers();
        setEvents([]);
        setScreen('game');
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
    [addEvent, clearEventTimers, saveBusySlot, screen, streaming, upsertSaveSummary],
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
      tutorialBattleIntentRef.current = false;
      tutorialBattleDiceRef.current = null;
      dicePokerAutoTriggeredRef.current = false;
      lineId.current = 1;
      eventId.current = 1;
      kpSpeakerRef.current = '';

      try {
        const result = await runtime.createGame(payload);

        setGameId(result.game_id);
        setGameState(result.state);

        // 🔴 优先使用固定脚本（speaker绝对正确），回退到AI文本解析
        if (result.opening_script?.length) {
          // 直接逐条加载：speaker/文本绝对不会出错
          const scriptLines: StoryLine[] = result.opening_script.map((line) => ({
            id: lineId.current++,
            role: 'kp' as const,
            speaker: line.speaker,
            text: line.text,
          }));
          setStory(scriptLines);
          setActiveIndex(0);  // 从第一句开始，逐条推进
          setSuggestions(
            result.opening_hints?.length
              ? makeSuggestions(result.opening_hints)
              : fallbackSuggestions(result.state),
          );
        } else {
          // 回退：AI文本解析
          const parsedOpening = extractHints(result.opening || DEFAULT_OPENING);
          const openingLines = splitNarrative(parsedOpening.text || DEFAULT_OPENING);
          setSuggestions(parsedOpening.suggestions.length ? parsedOpening.suggestions : fallbackSuggestions(result.state));
          appendStoryLines(openingLines.length ? openingLines : [DEFAULT_OPENING], 'kp', '主持人', true);
        }

        if (payload.skip_opening) setOpeningFastForward(true);
        // 安全网：开篇时确保逆穹城背景图显示，不依赖AI文本触发词匹配
        if (String(result.state.current_area || '').includes('逆穹')) {
          setScriptedBgOverride('/assets/scenes/01inverse-city-first-sight.webp');
          scriptedBgSceneRef.current = '逆穹悬城·主缆街';
        }
        setScreen('game');
      } catch (error: any) {
        setLoadError(error.message || '连接失败');
      }
    },
    [appendStoryLines, clearEventTimers, runtime],
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
      setShowDicePoker(false);
      setShowBargainGame(false);
      setShowDrinkingDiceGame(false);
      setShowLuckyBoxGame(false);
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
        const statePatch: GameState = {
          ...checkpoint.statePatch,
          ...scenePatch,
          test_mode: true,
          story_test_checkpoint: checkpoint.id,
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
        })));
        setSuggestions(makeSuggestions(checkpoint.hints ?? scene?.hints ?? fallbackSuggestions(nextState).map((item) => item.text)));
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

  const submitAction = useCallback(
    (text: string) => {
      const action = text.trim();
      if (!action || !gameId || streaming) return;

      const currentState = stateRef.current;
      const blockRoute = (message: string, nextHints: string[]) => {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        appendStoryLines([message], 'kp', '瑟琳', true);
        setSuggestions(makeSuggestions(nextHints));
        setPhase('narrating');
      };

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

      // 🔴 固定剧情脚本拦截：不需要AI生成，直接逐条显示
      const scripted = matchScriptedScene(action);
      if (scripted) {
        playScriptedScene(scripted.scene, { playerAction: action });
        return;
      }

      // 酒馆区域：选择玩骰子直接跳转游戏
      const areaText = String(stateRef.current.current_area || '');
      const yunlingPotion = findYunlingPotion(action);
      if ((currentState.yunling_shop_unlocked || areaText.includes('黑市深处')) && (/不购买|返回公会|登记/.test(action) || yunlingPotion)) {
        appendStoryLines([action], 'player', gameState.player_name || '你', true);
        if (/不购买|返回公会|登记/.test(action) && !yunlingPotion) {
          const registration = getScriptedScene('guild-final-registration');
          if (registration) {
            playScriptedScene(registration, { focus: false });
            return;
          }
        }

        if (yunlingPotion) {
          const gold = Number(currentState.gold ?? 200);
          if (gold < yunlingPotion.cost) {
            appendStoryLines([`云苓看了一眼你们的金币袋：「这瓶${yunlingPotion.label}要${yunlingPotion.cost}G。等钱够了再谈。」`], 'kp', '云苓', true);
            setSuggestions(makeSuggestions(YUNLING_SHOP_HINTS));
            setPhase('narrating');
            return;
          }

          const inventoryText = String(currentState.inventory || '长剑,冒险者工具包');
          const nextInventory = inventoryText.includes(yunlingPotion.label) ? inventoryText : `${inventoryText},${yunlingPotion.label}`;
          const patch: GameState = {
            gold: Math.max(0, gold - yunlingPotion.cost),
            inventory: nextInventory,
            [`yunling_${yunlingPotion.key}_bought`]: true,
            last_event: `在云苓处购买${yunlingPotion.label}`,
          };
          if (yunlingPotion.stat) patch[yunlingPotion.stat] = Number(currentState[yunlingPotion.stat] ?? 10) + 2;
          else patch.current_hp = Math.min(Number(currentState.max_hp ?? currentState.current_hp ?? 20), Number(currentState.current_hp ?? 20) + 5);

          setGameState((prev) => ({ ...prev, ...patch }));
          if (gameId) {
            void patchGameState(gameId, patch).catch((error: any) => addEvent(error.message || '云苓药水状态同步失败', 'error'));
          }
          addEvent(`金币 -${yunlingPotion.cost}`, 'state');
          addEvent(`获得 ${yunlingPotion.label}`, 'state');
          appendStoryLines([
            yunlingPotion.stat
              ? `云苓将${yunlingPotion.label}推到你面前：「下去之后再喝。药效很冲，能让身体短时间记住更强的状态。」你的${yunlingPotion.label.replace('药水', '')}提升了2点。`
              : '云苓递来一支温热的红色药剂：「治疗药水别等到快死才喝。它能让伤口闭合，但不能替你判断什么时候该撤。」你恢复了5点生命值。',
          ], 'kp', '云苓', true);
          setSuggestions(makeSuggestions(YUNLING_SHOP_HINTS));
          setPhase('narrating');
          return;
        }
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
        // "接受游戏" → 进入三局酒馆骰子
        if (/接受/.test(action)) {
          setShowTavernDice(true);
          dicePokerPendingRef.current = action;
          return;
        }
        // 原有触发词 → 进入旧版骰子游戏
        setDicePokerNpc('萨洛');
        setShowDicePoker(true);
        dicePokerPendingRef.current = action;
        setPhase('action');
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

      const firstChoice = isFirstPlayerChoice(story, stateRef.current);
      const retreatChoice = RETREAT_ACTION_RE.test(action);
      const shouldPrepareTutorialBattle = firstChoice && !retreatChoice;
      const resolvedAction = shouldPrepareTutorialBattle ? ensureFirstBattleCheck(action) : action;

      abortRef.current?.abort();
      parserRef.current = createNarrativeStreamParser();
      diceFiredRef.current = false; // 重置骰子锁
      tutorialBattleIntentRef.current = shouldPrepareTutorialBattle;
      tutorialBattleDiceRef.current = null;
      setPhase('narrating');
      setStreaming(true);
      setSuggestions([]);
      setPendingTutorialBattleSetup(null);
      appendStoryLines([resolvedAction], 'player', gameState.player_name || '你', true);

      if (firstChoice && retreatChoice) {
        setGameState((prev) => ({
          ...prev,
          first_choice_resolved: true,
          last_event: '玩家选择撤退，避开第一次教学战斗',
        }));
      }

      abortRef.current = runtime.streamAction(gameId, resolvedAction, {
        onNarrative: (chunk) => {
          const parsed = parserRef.current.push(chunk);
          if (parsed.lines.length) appendStoryLines(parsed.lines, 'kp', '主持人');
          if (parsed.suggestions.length) setSuggestions(parsed.suggestions);
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
          if (parsed.lines.length) appendStoryLines(parsed.lines, 'kp', '主持人');
          if (tutorialBattleIntentRef.current) {
            const setup = buildTutorialBattleSetup(tutorialBattleDiceRef.current);
            setPendingTutorialBattleSetup(setup);
            setGameState((prev) => ({
              ...prev,
              first_choice_resolved: true,
              current_area: '逆穹悬城·主缆街',
              last_event: '开局判定完成，等待进入教学战斗',
            }));
            setSuggestions(makeSuggestions(['进入教学战斗']));
            addEvent('开局判定将影响战斗', 'state');
          } else {
            setSuggestions(parsed.suggestions.length ? parsed.suggestions : fallbackSuggestions(stateRef.current));
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
            setPendingTutorialBattleSetup(buildTutorialBattleSetup(null));
            setGameState((prev) => ({
              ...prev,
              first_choice_resolved: true,
              current_area: '逆穹悬城·主缆街',
              last_event: '主持人兜底后进入教学战斗',
            }));
            setSuggestions(makeSuggestions(['进入教学战斗']));
          } else {
            setSuggestions(fallbackSuggestions(stateRef.current));
          }
        },
      });
    },
    [appendStoryLines, gameId, gameState.player_name, playScriptedScene, runtime, story, streaming],
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
    (result: { playerTotal: number; brockTotal: number; rounds: number }) => {
      setShowDrinkingDiceGame(false);
      const scene = getScriptedScene('brock-recruited');
      const patch: GameState = {
        brock_drinking_done: true,
        brock_drinking_player_total: result.playerTotal,
        brock_drinking_brock_total: result.brockTotal,
        last_event: `与布洛克完成喝酒骰子：你${result.playerTotal}点，布洛克${result.brockTotal}点`,
      };
      if (scene) {
        playScriptedScene(scene, { extraStatePatch: patch });
        return;
      }
      setGameState((prev) => ({ ...prev, ...patch }));
      if (gameId) {
        void patchGameState(gameId, patch).catch((error: any) => addEvent(error.message || '布洛克入队状态同步失败', 'error'));
      }
    },
    [addEvent, gameId, playScriptedScene],
  );

  const handleLuckyBoxComplete = useCallback(
    (result: { attempts: number; spent: number; finalRoll: number; guaranteed: boolean }) => {
      setShowLuckyBoxGame(false);
      const current = stateRef.current;
      const currentGold = Number(current.gold ?? 200);
      const inventoryText = String(current.inventory || '长剑,冒险者工具包');
      const nextInventory = inventoryText.includes('钻石') ? inventoryText : `${inventoryText},钻石`;
      const patch: GameState = {
        gold: Math.max(0, currentGold - result.spent),
        inventory: nextInventory,
        lucky_box_done: true,
        lucky_box_attempts: result.attempts,
        lucky_box_spent: result.spent,
        lucky_box_final_roll: result.finalRoll,
        lucky_box_guaranteed: result.guaranteed,
        last_event: `奥兰幸运盲盒抽到钻石，共${result.attempts}次，花费${result.spent}金`,
      };
      addEvent(`获得 钻石`, 'state');
      addEvent(`金币 -${result.spent}`, 'state');

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
  const canAdvance = Boolean(currentLine) && (activeIndex < story.length - 1 || !streaming);
  const visibleSuggestions = suggestions.length ? suggestions : fallbackSuggestions(gameState);
  const areaText = String(gameState.current_area || '');
  const showLuckyBoxEntry = /黑市|补给市场|市场|奥兰|凯娅/.test(areaText) && Boolean(gameState.kaiya_intro_seen && !gameState.kaiya_recruited);
  const cityAreaVisited = /冒险者公会|回声酒馆|酒馆|黑市|补给市场|市场|静默神殿|神殿|降渊缆梯|缆梯/.test(areaText);
  const canUseCityMap = Boolean(gameState.city_map_unlocked || gameState.guild_registered || cityAreaVisited);

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

  // Ctrl+L 剧情加速快捷键
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === 'l' && screen === 'game' && !streaming && phase === 'narrating') {
        e.preventDefault();
        setFastForwardMode((prev) => !prev);
      }
      // 加速模式下点击或按空格也会自动推进，但按 Ctrl+L 可随时关闭
      if (fastForwardMode && phase === 'action') {
        setFastForwardMode(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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
      setPhase('action');
    }
  }, [activeIndex, pendingTutorialBattleSetup, story.length, streaming]);

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
    setDiceRoll(null);
    setEvents([]);
    setPendingTutorialBattleSetup(null);
    setOpeningFastForward(false);
    setScriptedBgOverride(null);
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
    return <TitleMenu onNewGame={() => setScreen('new-game')} onLoadGame={openLoadGame} onTest={() => setScreen('test')} />;
  }

  if (screen === 'new-game') {
    return (
      <StartDND
        onStart={startGame}
        onBack={() => setScreen('main-menu')}
      />
    );
  }

  if (screen === 'load-game') {
    return (
      <LoadGameScreen
        saves={saves}
        saveBusySlot={saveBusySlot}
        saveMessage={saveMessage}
        saveMessageTone={saveMessageTone}
        onBack={() => setScreen('main-menu')}
        onRefreshSaves={refreshSaves}
        onLoadSave={loadSavedGame}
      />
    );
  }

  if (screen === 'test') {
    return <ErrorBoundary><TestScreen onBack={() => setScreen('main-menu')} onStoryTest={startStoryTest} /></ErrorBoundary>;
  }

  if (screen === 'loading') return <LoadingScreen error={loadError} onRetry={() => setScreen('new-game')} />;

  if (screen === 'tutorial-battle') {
    return (
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
    );
  }

  if (showBargainGame) {
    return <BargainTestScreen onBack={() => setShowBargainGame(false)} onComplete={handleBargainComplete} />;
  }

  if (showDrinkingDiceGame) {
    return <DrinkingDiceGame onBack={() => setShowDrinkingDiceGame(false)} onComplete={handleDrinkingDiceComplete} />;
  }

  if (showLuckyBoxGame) {
    return (
      <LuckyBoxGame
        gold={Number(gameState.gold ?? 200)}
        onBack={() => setShowLuckyBoxGame(false)}
        onComplete={handleLuckyBoxComplete}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="vn-app">
      <VisualNovelStage
        scene={scene}
        line={currentLine}
        events={events}
        isStreaming={streaming}
        isActionPhase={phase === 'action'}
        canAdvance={phase !== 'action' && canAdvance}
        autoAdvance={
          (openingFastForward || fastForwardMode) &&
          phase === 'narrating' &&
          !streaming &&
          !story.some((line) => line.role === 'player')
        }
        autoAdvanceDelay={fastForwardMode ? 60 : 90}
        scriptedBgOverride={scriptedBgOverride}
        onAdvance={advanceLine}
        actionPanel={
          showActionPanel ? (
            <ActionPanel suggestions={visibleSuggestions} disabled={streaming} onSubmit={submitAction} />
          ) : undefined
        }
      />

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
      {fastForwardMode && (
        <div className="fast-forward-indicator">
          ⏩ 剧情加速中 · Ctrl+L 关闭
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
            onJumpTo={(index) => {
              setActiveIndex(index);
              setPhase('narrating');
            }}
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
                    if (parsed.lines.length) appendStoryLines(parsed.lines, 'kp', '主持人');
                    if (parsed.suggestions.length) setSuggestions(parsed.suggestions);
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
                    if (parsed.lines.length) appendStoryLines(parsed.lines, 'kp', '主持人');
                    setSuggestions(parsed.suggestions.length ? parsed.suggestions : fallbackSuggestions(stateRef.current));
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
                    setSuggestions(fallbackSuggestions(stateRef.current));
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
            onClose={() => setShowTavernDice(false)}
            onComplete={(result: any) => {
              // 骰子结束后，推进剧情
              const pendingAction = dicePokerPendingRef.current;
              dicePokerPendingRef.current = '';
              dicePokerAutoTriggeredRef.current = false;

              // 关闭弹窗 + 标记完成
              setShowTavernDice(false);
              const wins = result?.wins ?? 0;
              const effectiveWins = result?.effectiveWins ?? wins;
              const spent = Number(result?.spent ?? 0);
              const earnings = Number(result?.earnings ?? 0);
              const gift = Number(result?.gift ?? 0);
              const currentGold = Number(stateRef.current.gold ?? 200);
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
                last_event: `酒馆快艇骰子结束（${wins}胜，有效情报胜${effectiveWins}）`,
              };
              setGameState((prev) => ({ ...prev, ...tavernPatch }));
              if (gameId) {
                void patchGameState(gameId, tavernPatch).catch((error: any) => addEvent(error.message || '酒馆骰子状态同步失败', 'error'));
              }
              if (spent) addEvent(`金币 -${spent}`, 'state');
              if (earnings) addEvent(`骰局收回 +${earnings}G`, 'state');
              if (gift) addEvent(`萨洛彩头 +${gift}G`, 'state');

              // 🔴 固定骰子后剧情，不依赖 AI（防止 AI 跑偏生成战斗内容）
              const postDiceLines: StoryLine[] = wins >= 2
                ? [
                    { id: lineId.current++, role: 'kp' as const, speaker: '萨洛', text: '「啧。两胜。你这手气不像第一次玩。」' },
                    { id: lineId.current++, role: 'kp' as const, speaker: '萨洛', text: '「愿赌服输。我会把艾琳、布洛克、凯娅的位置和脾气都说清楚。你们最好记牢，找人比找路麻烦。另外，黑市深处有个药剂商叫云苓，她手里有真正能下孢海的药。」' },
                    { id: lineId.current++, role: 'kp' as const, speaker: '主持人', text: '萨洛把一只小钱袋丢到桌上，里面是整整一百枚金币。他又用酒渍在纸角画了一个不会响的铜铃，示意你们收好。' },
                    { id: lineId.current++, role: 'kp' as const, speaker: '瑟琳', text: '「萨洛很少这么干脆。看来他确实认为这三个人缺一不可。」' },
                    { id: lineId.current++, role: 'kp' as const, speaker: '主持人', text: '瑟琳将银杖收回袖口，对你微微点头。酒馆里的喧嚣重新漫上来，但萨洛的情报像一块石头坠入水面，散开的波纹还没停。' },
                  ]
                : effectiveWins >= 1
                ? [
                    { id: lineId.current++, role: 'kp' as const, speaker: '萨洛', text: result?.paidInfo ? '「钱也算一种手气。至少你们知道什么时候该少浪费时间。」' : '「一胜一负，不亏。冒险者的手气就是这样——从来不会让你空手回去。」' },
                    { id: lineId.current++, role: 'kp' as const, speaker: '萨洛', text: '「行，我说。艾琳、布洛克、凯娅，各有本事，也各有麻烦。你们想凑齐五人队，就得按他们的规矩来。」' },
                    { id: lineId.current++, role: 'kp' as const, speaker: '瑟琳', text: '「够用了。先听完情报，再规划路线。」' },
                  ]
                : [
                    { id: lineId.current++, role: 'kp' as const, speaker: '萨洛', text: '「输了也正常。悬城里每年有上百个冒险者从我这张桌子上爬走，最后活下来的从不靠骰子。」' },
                    { id: lineId.current++, role: 'kp' as const, speaker: '萨洛', text: '「情报还是给你——看在你们真要下孢海的份上。三个人都不好请，但都值得请。」' },
                    { id: lineId.current++, role: 'kp' as const, speaker: '瑟琳', text: '「先听他讲完。队伍凑齐之前，我们不能急着下缆梯。」' },
                  ];
              setStory((prev) => {
                setActiveIndex(prev.length);
                return [...prev, ...postDiceLines];
              });

              const saloIntel = getScriptedScene('salo-companion-intel');
              if (saloIntel) {
                playScriptedScene(saloIntel, { focus: false });
              } else {
                setPhase('action');
                setSuggestions(makeSuggestions([
                  '前往静默神殿寻找艾琳',
                  '和瑟琳讨论远征路线',
                ]));
              }
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
  );
}
