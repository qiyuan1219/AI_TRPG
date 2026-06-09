import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ActionPanel } from './ActionPanel';
import { DialogueLog } from './DialogueLog';
import { DiceRollOverlay } from './DiceRollOverlay';
import { VisualNovelStage } from './VisualNovelStage';
import type { EventFeedItem } from './EventFeed';
import {
  chatCompanionSideEvent,
  chooseCompanionSideEvent,
  getCompanionSideEventFeedback,
  startCompanionSideEvent,
  type CompanionSideEventChoice,
  type CompanionSideEventChoiceResult,
  type CompanionSideEventInfo,
  type CompanionSideEventState,
} from '../services/api';
import type { ActionSuggestion, DiceResult, SceneVisual, StoryLine } from '../types/game';

interface CompanionEventTestScreenProps {
  onBack: () => void;
}

type RuntimePhase = 'narrating' | 'action';

const ECHO_FOREST_SCENE: SceneVisual = {
  id: 'companion-echo-forest',
  title: '回声菌林',
  subtitle: '同伴支线 / 第一幕',
  aliases: ['回声菌林', '地心之门'],
  themeClass: 'scene-maze',
};

const FREE_CHAT_SUGGESTIONS: ActionSuggestion[] = [
  { id: 'block-past', label: '问问布洛克以前是做什么的', text: '问问布洛克以前是做什么的' },
  { id: 'burn-forest', label: '问问为什么不能直接烧掉菌林', text: '问问为什么不能直接烧掉菌林' },
  { id: 'spore-morality', label: '问问孢海生态有没有善恶', text: '问问孢海生态有没有善恶' },
  { id: 'wetland-risk', label: '问问骨柱湿地接下来有什么风险', text: '问问骨柱湿地接下来有什么风险' },
];

function choiceLabel(choice: CompanionSideEventChoice) {
  const check = choice.check ? `【${choice.check.label}DC${choice.check.dc}】` : '';
  return `${choice.label}${check}`;
}

function splitFeedback(text: string) {
  return text
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}|\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function CompanionEventTestScreen({ onBack }: CompanionEventTestScreenProps) {
  const nextLineId = useRef(1);
  const nextEventId = useRef(1);
  const [sessionId, setSessionId] = useState('');
  const [event, setEvent] = useState<CompanionSideEventInfo | null>(null);
  const [state, setState] = useState<CompanionSideEventState | null>(null);
  const [story, setStory] = useState<StoryLine[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<RuntimePhase>('narrating');
  const [events, setEvents] = useState<EventFeedItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [showDialogueLog, setShowDialogueLog] = useState(false);
  const [activeDice, setActiveDice] = useState<DiceResult | null>(null);
  const [pendingFeedback, setPendingFeedback] = useState<CompanionSideEventChoiceResult | null>(null);

  useEffect(() => {
    void restart();
  }, []);

  const currentLine = story[activeIndex];
  const canAdvance = activeIndex < story.length - 1;

  const suggestions = useMemo<ActionSuggestion[]>(() => {
    if (!state) return [];
    if (state.phase === 'dialogue') return FREE_CHAT_SUGGESTIONS;
    return state.choices.map((choice) => ({
      id: choice.id,
      label: choiceLabel(choice),
      text: choice.id,
    }));
  }, [state]);

  function makeLine(role: StoryLine['role'], speaker: string, text: string): StoryLine {
    const id = nextLineId.current;
    nextLineId.current += 1;
    return { id, role, speaker, text };
  }

  function addEvent(text: string, tone: EventFeedItem['tone'] = 'state') {
    const id = nextEventId.current;
    nextEventId.current += 1;
    setEvents((prev) => [...prev.slice(-5), { id, text, tone }]);
  }

  function summarizeState(nextState: CompanionSideEventState) {
    addEvent(
      `信任 ${nextState.trust}（${nextState.trust_band}） / 威胁 ${nextState.threat}/${nextState.max_threat} / 污染 ${nextState.contamination}`,
      'state',
    );
    if (nextState.rewards.length) {
      addEvent(`奖励：${nextState.rewards.join('、')}`, 'state');
    }
  }

  function appendPhaseGuide(result: CompanionSideEventChoiceResult) {
    if (result.state.phase === 'dialogue') {
      setStory((prev) => [
        ...prev,
        makeLine(
          'kp',
          result.event.companion.name,
          `${result.event.free_chat_prompt} 现在你可以与布洛克自由交谈，AI 会根据你说的话返回内容。`,
        ),
      ]);
      return;
    }

    if (result.state.phase === 'crisis') {
      addEvent(`危机仍在继续：当前第 ${Math.min(result.state.round + 1, 3)}/3 次危机行动。`, 'state');
    }
  }

  function appendFeedback(text: string, companionName: string) {
    const paragraphs = splitFeedback(text);
    if (!paragraphs.length) return;

    setStory((prev) => {
      const next = [...prev];
      paragraphs.forEach((paragraph, index) => {
        next.push(makeLine('kp', index === 0 ? 'KP' : companionName, paragraph));
      });
      return next;
    });
  }

  async function restart() {
    setBusy(true);
    setActiveDice(null);
    setPendingFeedback(null);
    setEvents([]);
    try {
      const result = await startCompanionSideEvent();
      setSessionId(result.session_id);
      setEvent(result.event);
      setState(result.state);
      setStory([makeLine('kp', 'KP', result.event.opening)]);
      setActiveIndex(0);
      setPhase('action');
      addEvent('支线测试已开始', 'state');
      summarizeState(result.state);
    } catch (err: any) {
      setStory([makeLine('system', '系统', err?.message || '支线事件启动失败')]);
      setPhase('narrating');
      addEvent(err?.message || '支线事件启动失败', 'error');
    } finally {
      setBusy(false);
    }
  }

  async function choose(choice: CompanionSideEventChoice) {
    if (!sessionId || busy) return;
    setBusy(true);
    setPhase('narrating');
    setStory((prev) => {
      const next = [...prev, makeLine('player', '玩家', choice.label)];
      setActiveIndex(next.length - 1);
      return next;
    });

    try {
      const result = await chooseCompanionSideEvent(sessionId, choice.id, false);
      setEvent(result.event);
      setState(result.state);
      summarizeState(result.state);
      if (result.outcome.roll) {
        setActiveDice({
          type: 'skill_check',
          data: {
            ...result.outcome.roll,
            属性: result.outcome.roll['属性'] ?? result.outcome.roll['检定'] ?? '支线检定',
            id: Date.now(),
          },
        });
        addEvent(
          `${result.outcome.roll['检定'] ?? '支线检定'} ${result.outcome.roll['总计']} / DC ${result.outcome.roll['DC']}`,
          'dice',
        );
        setPendingFeedback(result);
        return;
      }
      await loadChoiceFeedback(result);
    } catch (err: any) {
      addEvent(err?.message || '支线选择结算失败', 'error');
      setStory((prev) => [...prev, makeLine('system', '系统', err?.message || '支线选择结算失败')]);
      setBusy(false);
    }
  }

  async function loadChoiceFeedback(fallbackResult: CompanionSideEventChoiceResult) {
    if (!sessionId) return;
    setBusy(true);
    try {
      const result = await getCompanionSideEventFeedback(sessionId);
      setEvent(result.event);
      setState(result.state);
      appendFeedback(result.feedback, result.event.companion.name);
      appendPhaseGuide(result);
    } catch (err: any) {
      addEvent(err?.message || '支线反馈生成失败', 'error');
      appendFeedback(fallbackResult.outcome.phase_note, fallbackResult.event.companion.name);
      appendPhaseGuide(fallbackResult);
    } finally {
      setPendingFeedback(null);
      setBusy(false);
    }
  }

  async function sendChat(message: string) {
    const content = message.trim();
    if (!content || !sessionId || busy) return;
    if (state?.phase !== 'dialogue') {
      addEvent('当前阶段请先使用下方支线选项。', 'error');
      return;
    }

    setBusy(true);
    setPhase('narrating');
    setStory((prev) => {
      const next = [...prev, makeLine('player', '玩家', content)];
      setActiveIndex(next.length - 1);
      return next;
    });

    try {
      const result = await chatCompanionSideEvent(sessionId, content);
      setState(result.state);
      setStory((prev) => [...prev, makeLine('kp', event?.companion.name || '布洛克·铁锅', result.reply)]);
    } catch (err: any) {
      addEvent(err?.message || '支线自由对话失败', 'error');
      setStory((prev) => [...prev, makeLine('system', '系统', err?.message || '支线自由对话失败')]);
    } finally {
      setBusy(false);
    }
  }

  function submitAction(text: string) {
    const matchedChoice = state?.choices.find((choice) => choice.id === text || choice.label === text);
    if (matchedChoice) {
      void choose(matchedChoice);
      return;
    }
    void sendChat(text);
  }

  function advanceLine() {
    setActiveIndex((index) => {
      const next = Math.min(index + 1, story.length - 1);
      if (next >= story.length - 1) setPhase('action');
      return next;
    });
  }

  function closeDice() {
    setActiveDice(null);
    if (pendingFeedback) {
      void loadChoiceFeedback(pendingFeedback);
    }
  }

  function actionHelperText() {
    if (state?.phase === 'dialogue') return '现在你可以与布洛克自由交谈，点击提示语可填入输入框。';
    if (state?.phase === 'crisis') {
      return `危机战斗：将威胁降至 0，或完成 3 次行动后结算。当前第 ${Math.min(state.round + 1, 3)}/3 次危机行动，保护布洛克推进最快。`;
    }
    return undefined;
  }

  const actionPanel = phase === 'action' && activeIndex >= story.length - 1 ? (
    <ActionPanel
      suggestions={suggestions}
      disabled={busy}
      onSubmit={submitAction}
      placeholder={state?.phase === 'dialogue' ? '问布洛克关于菌林、过去或骨柱湿地的事' : undefined}
      helperText={actionHelperText()}
      suggestionMode={state?.phase === 'dialogue' ? 'fill' : 'submit'}
    />
  ) : undefined;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="vn-app">
      <VisualNovelStage
        scene={ECHO_FOREST_SCENE}
        line={currentLine}
        events={events}
        isStreaming={busy}
        isActionPhase={phase === 'action' && activeIndex >= story.length - 1}
        canAdvance={phase !== 'action' && canAdvance}
        onAdvance={advanceLine}
        actionPanel={actionPanel}
      />

      <DiceRollOverlay dice={activeDice} dieType="d20" onClose={closeDice} />

      <div className="game-top-actions">
        <button type="button" className="game-log-btn" onClick={() => setShowDialogueLog(true)}>
          📜 对话日志
        </button>
        <button type="button" className="game-title-btn" onClick={onBack}>
          返回测试
        </button>
        <button type="button" className="game-save-btn" onClick={restart} disabled={busy}>
          重开支线
        </button>
      </div>

      <AnimatePresence>
        {showDialogueLog && (
          <DialogueLog
            story={story}
            activeIndex={activeIndex}
            isStreaming={busy}
            onClose={() => setShowDialogueLog(false)}
            onJumpTo={(index) => {
              setActiveIndex(index);
              setPhase('narrating');
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
