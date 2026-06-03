import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ActionPanel } from './components/ActionPanel';
import { CharacterPanel } from './components/CharacterPanel';
import { DiceRollOverlay } from './components/DiceRollOverlay';
import type { EventFeedItem } from './components/EventFeed';
import { LoadingScreen } from './components/LoadingScreen';
import { SaveLoadPanel } from './components/SaveLoadPanel';
import { StartDND } from './components/StartDND';
import { VisualNovelStage } from './components/VisualNovelStage';
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

type Screen = 'start' | 'loading' | 'game';
type GamePhase = 'narrating' | 'action';

const DEFAULT_OPENING = '王冠城的钟声穿过雾气。你的冒险从这一刻开始。';

function fallbackSuggestions(state: GameState): ActionSuggestion[] {
  const area = String(state.current_area || '');
  if (area.includes('公会') || area.includes('酒馆')) {
    return makeSuggestions(['调查登记簿【智力DC12】', '观察伊瑟拉是否隐瞒【洞悉DC14】', '让格鲁姆打听传闻【人脉DC13】']);
  }
  if (area.includes('B')) {
    return makeSuggestions(['谨慎搜索暗门【察觉DC14】', '让丽莎检查陷阱【巧手DC15】', '让塔莉亚解读符文【奥秘DC14】']);
  }
  return makeSuggestions(['接过招募令', '调查公会登记簿【智力DC12】', '询问伊瑟拉真相【洞悉DC14】']);
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
  const [screen, setScreen] = useState<Screen>('start');
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
  const [saveMessage, setSaveMessage] = useState('');
  const [saveMessageTone, setSaveMessageTone] = useState<'neutral' | 'success' | 'error'>('neutral');

  const lineId = useRef(1);
  const eventId = useRef(1);
  const parserRef = useRef(createNarrativeStreamParser());
  const abortRef = useRef<AbortController | null>(null);
  const stateRef = useRef<GameState>({});
  const kpSpeakerRef = useRef('');
  const eventTimersRef = useRef<number[]>([]);

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

      abortRef.current?.abort();
      parserRef.current = createNarrativeStreamParser();
      setPhase('narrating');
      setStreaming(true);
      setSuggestions([]);
      appendStoryLines([action], 'player', gameState.player_name || '你', true);

      abortRef.current = runtime.streamAction(gameId, action, {
        onNarrative: (chunk) => {
          const parsed = parserRef.current.push(chunk);
          if (parsed.lines.length) appendStoryLines(parsed.lines, 'kp', 'KP');
          if (parsed.suggestions.length) setSuggestions(parsed.suggestions);
        },
        onSystem: (rawEvent) => {
          const parsed = runtime.parseSystemEvent(rawEvent);
          if (!parsed) return;
          addEvent(runtime.formatSystemEvent(parsed), parsed.type === 'error' ? 'error' : 'dice');
          // 骰子检定类事件触发动画覆盖层
          if (parsed.type === 'skill_check' || parsed.type === 'attack_roll') {
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
          setSuggestions(parsed.suggestions.length ? parsed.suggestions : fallbackSuggestions(stateRef.current));
          setStreaming(false);
        },
        onError: (error) => {
          const message = error || '连接中断';
          setStreaming(false);
          addEvent(message, 'error');
          appendStoryLines([`KP 的声音暂时被杂讯打断：${message}`], 'system', '系统');
          setSuggestions(fallbackSuggestions(stateRef.current));
        },
      });
    },
    [addEvent, appendStoryLines, gameId, gameState.player_name, runtime, streaming],
  );

  const scene = useMemo(() => resolveDndScene(gameState), [gameState]);
  const currentLine = story[activeIndex];
  const canAdvance = Boolean(currentLine) && (activeIndex < story.length - 1 || !streaming);
  const visibleSuggestions = suggestions.length ? suggestions : fallbackSuggestions(gameState);

  const advanceLine = useCallback(() => {
    if (activeIndex < story.length - 1) {
      setActiveIndex((index) => Math.min(index + 1, story.length - 1));
      return;
    }

    if (!streaming) setPhase('action');
  }, [activeIndex, story.length, streaming]);

  if (screen === 'start') {
    return (
      <StartDND
        onStart={startGame}
        saves={saves}
        saveBusySlot={saveBusySlot}
        saveMessage={saveMessage}
        saveMessageTone={saveMessageTone}
        onRefreshSaves={refreshSaves}
        onLoadSave={loadSavedGame}
      />
    );
  }
  if (screen === 'loading') return <LoadingScreen error={loadError} onRetry={() => setScreen('start')} />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="vn-app">
      <CharacterPanel state={gameState} />
      <VisualNovelStage
        scene={scene}
        line={currentLine}
        events={events}
        isStreaming={streaming}
        isActionPhase={phase === 'action'}
        canAdvance={phase !== 'action' && canAdvance}
        onAdvance={advanceLine}
        actionPanel={
          phase === 'action' ? (
            <ActionPanel suggestions={visibleSuggestions} disabled={streaming} onSubmit={submitAction} />
          ) : undefined
        }
      />

      {/* 骰子检定动画覆盖层 */}
      <DiceRollOverlay dice={diceRoll} onClose={() => setDiceRoll(null)} />

      {/* 游戏内右上角存档按钮 */}
      <button
        type="button"
        className="game-save-btn"
        onClick={() => setShowGameSaves(true)}
      >
        📂 冒险存档
      </button>

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
