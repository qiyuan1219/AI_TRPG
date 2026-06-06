import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ActionPanel } from './components/ActionPanel';
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

type Screen = 'main-menu' | 'new-game' | 'load-game' | 'test' | 'loading' | 'game';
type GamePhase = 'narrating' | 'action';

const DEFAULT_OPENING = '逆穹城倒挂在巨大洞穴的穹顶之上，蓝绿色荧光在远方深渊中明灭。你的冒险从这一刻开始。';

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

  const lineId = useRef(1);
  const eventId = useRef(1);
  const parserRef = useRef(createNarrativeStreamParser());
  const abortRef = useRef<AbortController | null>(null);
  const stateRef = useRef<GameState>({});
  const kpSpeakerRef = useRef('');
  const eventTimersRef = useRef<number[]>([]);
  const diceFiredRef = useRef(false); // 防重复投骰

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
      diceFiredRef.current = false; // 重置骰子锁
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
          // 骰子动画：每轮最多触发一次
          if (!diceFiredRef.current && (parsed.type === 'skill_check' || parsed.type === 'attack_roll')) {
            diceFiredRef.current = true;
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
          const rawMessage = String(error || '').trim();
          const message = /connection\s*error|failed\s*to\s*fetch|network\s*error|networkerror|timeout|timed\s*out|econn|socket/i.test(rawMessage)
            ? 'KP暂时没有回应，已为本轮处理启用兜底。'
            : rawMessage || 'KP暂时没有回应，已为本轮处理启用兜底。';
          setStreaming(false);
          addEvent(message, 'state');
          appendStoryLines([message], 'system', '系统');
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
    setSaveMessage('');
    setSaveMessageTone('neutral');
    setScreen('main-menu');
  }, [clearEventTimers]);

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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="vn-app">
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
