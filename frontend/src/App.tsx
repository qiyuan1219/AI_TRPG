import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ActionPanel } from './components/ActionPanel';
import { BattleTestScreen } from './components/BattleTestScreen';
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
import { resolveDndScene } from './data/dndScenes';
import { listSaves, loadGame, saveGame } from './services/api';
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
  if (area.includes('公会') || area.includes('酒馆')) {
    return makeSuggestions(['查看远征档案【调查DC12】', '打听地底堡垒传闻【感知DC12】', '让瑟琳分析时间异常【奥秘DC13】']);
  }
  if (area.includes('孢海') || area.includes('菌林') || area.includes('湿地')) {
    return makeSuggestions(['谨慎探查周围【感知DC14】', '让克莱娅检查陷阱【巧手DC15】', '让森洛辨识真菌生态【自然DC13】']);
  }
  if (area.includes('黑石') || area.includes('黑暗之门')) {
    return makeSuggestions(['分析黑石结构【奥秘DC15】', '辨识三圈纹路【历史DC14】', '让瑟琳感知时间异常']);
  }
  return makeSuggestions(['前往冒险者公会接取委托', '在逆穹城探索打听情报', '与瑟琳讨论远征计划']);
}

function normalizeStoryLines(lines: StoryLine[]): StoryLine[] {
  let nextId = 1;
  return (Array.isArray(lines) ? lines : [])
    .filter((line) => line && typeof line.text === 'string' && line.text.trim())
    .map((line) => {
      const rawId = Number(line.id);
      const id = Number.isFinite(rawId) && rawId > 0 ? rawId : nextId;
      nextId = Math.max(nextId, id + 1);

      return {
        id,
        role: line.role === 'player' || line.role === 'system' ? line.role : 'kp',
        speaker: line.speaker || 'KP',
        text: line.text,
      };
    });
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
  const [dicePokerNpc, setDicePokerNpc] = useState('莱因');
  const [showDialogueLog, setShowDialogueLog] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveMessageTone, setSaveMessageTone] = useState<'neutral' | 'success' | 'error'>('neutral');
  const [pendingTutorialBattleSetup, setPendingTutorialBattleSetup] = useState<TutorialBattleSetup | null>(null);
  const [openingFastForward, setOpeningFastForward] = useState(false);

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

        const parsed = parseNarrativeSegments(text, speaker || 'KP', kpSpeakerRef.current);
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
      tutorialBattleIntentRef.current = false;
      tutorialBattleDiceRef.current = null;
      lineId.current = 1;
      eventId.current = 1;
      kpSpeakerRef.current = '';

      try {
        const result = await runtime.createGame(payload);
        const parsedOpening = extractHints(result.opening || DEFAULT_OPENING);
        const openingLines = splitNarrative(parsedOpening.text || DEFAULT_OPENING);

        setGameId(result.game_id);
        setGameState(result.state);
        setSuggestions(parsedOpening.suggestions.length ? parsedOpening.suggestions : fallbackSuggestions(result.state));
        appendStoryLines(openingLines.length ? openingLines : [DEFAULT_OPENING], 'kp', 'KP', true);
        setOpeningFastForward(true);
        setScreen('game');
      } catch (error: any) {
        setLoadError(error.message || '连接失败');
      }
    },
    [appendStoryLines, clearEventTimers, runtime],
  );

  const submitAction = useCallback(
    (text: string) => {
      const action = text.trim();
      if (!action || !gameId || streaming) return;

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
          if (parsed.lines.length) appendStoryLines(parsed.lines, 'kp', 'KP');
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
          if (parsed.lines.length) appendStoryLines(parsed.lines, 'kp', 'KP');
          if (tutorialBattleIntentRef.current) {
            const setup = buildTutorialBattleSetup(tutorialBattleDiceRef.current);
            setPendingTutorialBattleSetup(setup);
            setGameState((prev) => ({
              ...prev,
              first_choice_resolved: true,
              current_area: '逆穹城·补给平台',
              last_event: '开局判定完成，等待进入教学战斗',
            }));
            setSuggestions(makeSuggestions(['进入教学战斗']));
            addEvent('开局判定将影响战斗', 'state');
          } else {
            setSuggestions(parsed.suggestions.length ? parsed.suggestions : fallbackSuggestions(stateRef.current));
          }
          setStreaming(false);
        },
        onError: (error) => {
          const rawMessage = String(error || '').trim();
          const message = /connection\s*error|failed\s*to\s*fetch|network\s*error|networkerror|timeout|timed\s*out|econn|socket/i.test(rawMessage)
            ? 'KP暂时没有回应，已为本轮处理启用兜底。'
            : rawMessage || 'KP暂时没有回应，已为本轮处理启用兜底。';
          setStreaming(false);
          addEvent(message, 'state');
          appendStoryLines([message], 'system', '系统');
          if (tutorialBattleIntentRef.current) {
            setPendingTutorialBattleSetup(buildTutorialBattleSetup(null));
            setGameState((prev) => ({
              ...prev,
              first_choice_resolved: true,
              current_area: '逆穹城·补给平台',
              last_event: 'KP兜底后进入教学战斗',
            }));
            setSuggestions(makeSuggestions(['进入教学战斗']));
          } else {
            setSuggestions(fallbackSuggestions(stateRef.current));
          }
        },
      });
    },
    [addEvent, appendStoryLines, gameId, gameState.player_name, runtime, story, streaming],
  );

  const scene = useMemo(() => resolveDndScene(gameState), [gameState]);
  const currentLine = story[activeIndex];
  const canAdvance = Boolean(currentLine) && (activeIndex < story.length - 1 || !streaming);
  const visibleSuggestions = suggestions.length ? suggestions : fallbackSuggestions(gameState);

  useEffect(() => {
    if (!openingFastForward) return;
    const hasPlayerLine = story.some((line) => line.role === 'player');
    if (phase === 'action' || hasPlayerLine || screen !== 'game') {
      setOpeningFastForward(false);
    }
  }, [openingFastForward, phase, screen, story]);

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
    setDiceRoll(null);
    setEvents([]);
    setPendingTutorialBattleSetup(null);
    setOpeningFastForward(false);
    tutorialBattleIntentRef.current = false;
    tutorialBattleDiceRef.current = null;
    setSaveMessage('');
    setSaveMessageTone('neutral');
    setScreen('main-menu');
  }, [clearEventTimers]);

  const completeTutorialBattle = useCallback(() => {
    if (stateRef.current.tutorial_battle_done) {
      setScreen('game');
      return;
    }

    setGameState((prev) => ({
      ...prev,
      first_choice_resolved: true,
      tutorial_battle_done: true,
      current_area: '逆穹城·补给平台',
      last_event: '击退补给吊箱中的裂隙爬兽',
    }));
    setPhase('narrating');
    setSuggestions(makeSuggestions([
      '查看吊箱封条【调查DC12】',
      '询问瑟琳这些魔物为什么怕光【奥秘DC13】',
      '前往冒险者公会接任务',
    ]));
    setPendingTutorialBattleSetup(null);
    setOpeningFastForward(false);
    tutorialBattleIntentRef.current = false;
    tutorialBattleDiceRef.current = null;
    appendStoryLines([
      '最后一只裂隙爬兽被银白色光芒逼退，撞在吊箱边缘，蜷缩着失去了攻击性。瑟琳收起指尖的光，视线仍停在那些蓝绿色孢尘上。',
      '瑟琳：「它们不是主动潜进来的。箱壁内侧有拖痕，像是被什么东西赶进去的。」',
      '守卫翻看吊箱封条，脸色忽然变了。守卫：「这是从孢海据点回收的空箱。按理说，它不该带回活物。」',
      '补给平台短暂安静下来，远处城市主缆发出低沉震响。你已经掌握了这场战斗的基本流程，而真正的问题刚刚露出第一道裂口。',
    ], 'kp', 'KP', true);
    addEvent('教学战斗完成', 'state');
    setScreen('game');
  }, [addEvent, appendStoryLines]);

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
    return <TestScreen onBack={() => setScreen('main-menu')} />;
  }

  if (screen === 'loading') return <LoadingScreen error={loadError} onRetry={() => setScreen('new-game')} />;

  if (screen === 'tutorial-battle') {
    return (
      <BattleTestScreen
        mode="tutorial"
        openingEffects={pendingTutorialBattleSetup?.openingEffects ?? []}
        onBack={() => {
          setPendingTutorialBattleSetup(null);
          setScreen('game');
        }}
        onComplete={completeTutorialBattle}
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
        autoAdvance={openingFastForward && phase === 'narrating' && !streaming && !story.some((line) => line.role === 'player')}
        autoAdvanceDelay={90}
        onAdvance={advanceLine}
        actionPanel={
          phase === 'action' ? (
            <ActionPanel suggestions={visibleSuggestions} disabled={streaming} onSubmit={submitAction} />
          ) : undefined
        }
      />

      {/* 骰子检定动画覆盖层 */}
      <DiceRollOverlay dice={diceRoll} dieType="d20" onClose={() => setDiceRoll(null)} />

      {/* 快艇骰子入口：进入酒馆场景时显示 */}
      {String(gameState.current_area || '').includes('酒馆') && (
        <button
          type="button"
          className="game-dice-poker-btn"
          onClick={() => { setDicePokerNpc('莱因'); setShowDicePoker(true); }}
        >
          🎲 快艇骰子
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

      <div className="game-top-actions">
        <button type="button" className="game-log-btn" onClick={() => setShowDialogueLog(true)}>
          📜 对话日志
        </button>
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
            npcTrustKey="ly"
            onClose={() => setShowDicePoker(false)}
            onTrustChange={(npc, key, change) => {
              addEvent(`${npc}信任 ${change > 0 ? '+' : ''}${change}`, 'state');
            }}
            onGetClue={(info) => {
              addEvent(`获得情报：${info}`, 'dice');
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
