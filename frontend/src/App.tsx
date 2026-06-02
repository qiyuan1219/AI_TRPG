import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ActionPanel } from './components/ActionPanel';
import { CharacterPanel } from './components/CharacterPanel';
import type { EventFeedItem } from './components/EventFeed';
import { LoadingScreen } from './components/LoadingScreen';
import { StartDND } from './components/StartDND';
import { VisualNovelStage } from './components/VisualNovelStage';
import { resolveDndScene } from './data/dndScenes';
import { dndRuntime } from './services/dndRuntime';
import type { ActionSuggestion, CreateGamePayload, GameState, StoryLine } from './types/game';
import { createNarrativeStreamParser, extractHints, makeSuggestions, splitNarrative } from './utils/narrative';

type Screen = 'start' | 'loading' | 'game';
type GamePhase = 'narrating' | 'action';

const DEFAULT_OPENING = '王冠城的钟声穿过雾气。你的冒险从这一刻开始。';

function fallbackSuggestions(state: GameState): ActionSuggestion[] {
  const area = String(state.current_area || '');
  if (area.includes('公会') || area.includes('酒馆')) {
    return makeSuggestions(['询问悬赏细节', '招募同伴', '打听地城传闻']);
  }
  if (area.includes('B')) {
    return makeSuggestions(['观察四周', '检查线索', '让同伴提出建议']);
  }
  return makeSuggestions(['接过招募令', '去冒险者公会注册', '询问伊瑟拉真相']);
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

  const lineId = useRef(1);
  const eventId = useRef(1);
  const parserRef = useRef(createNarrativeStreamParser());
  const abortRef = useRef<AbortController | null>(null);
  const stateRef = useRef<GameState>({});

  useEffect(() => {
    stateRef.current = gameState;
  }, [gameState]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const appendStoryLines = useCallback(
    (texts: string[], role: StoryLine['role'], speaker: string, focus = false) => {
      const cleanTexts = texts.map((text) => text.trim()).filter(Boolean);
      if (!cleanTexts.length) return;

      const nextLines = cleanTexts.map((text) => ({
        id: lineId.current++,
        role,
        speaker,
        text,
      }));

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

    setEvents((prev) => [...prev, { id: eventId.current++, text: trimmed, tone }].slice(-8));
  }, []);

  const startGame = useCallback(
    async (payload: CreateGamePayload) => {
      setScreen('loading');
      setLoadError('');
      setStory([]);
      setEvents([]);
      setSuggestions([]);
      setActiveIndex(0);
      setPhase('narrating');

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
    [appendStoryLines, runtime],
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
          if (parsed) addEvent(runtime.formatSystemEvent(parsed), parsed.type === 'error' ? 'error' : 'dice');
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

  if (screen === 'start') return <StartDND onStart={startGame} />;
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
    </motion.div>
  );
}
