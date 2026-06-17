import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { SceneVisual, StoryLine } from '../types/game';
import { resolvePortraitPath, resolveSpeakerName } from '../data/characterRegistry';
import { EventFeed, type EventFeedItem } from './EventFeed';

interface VisualNovelStageProps {
  scene: SceneVisual;
  line?: StoryLine;
  events: EventFeedItem[];
  isStreaming: boolean;
  isActionPhase: boolean;
  canAdvance: boolean;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
  actionPanel?: ReactNode;
  scriptedBgOverride?: string | null;  // 脚本场景直接指定的背景图，绕过文本匹配
  visualResetKey?: number;
  onAdvance: () => void;
}

function useTypewriter(text: string, speed = 20) {
  const [visible, setVisible] = useState('');
  const [done, setDone] = useState(true);

  useEffect(() => {
    if (!text) {
      setVisible('');
      setDone(true);
      return;
    }

    if (speed <= 0) {
      setVisible(text);
      setDone(true);
      return;
    }

    let index = 0;
    setVisible('');
    setDone(false);

    const timer = window.setInterval(() => {
      index += 1;
      setVisible(text.slice(0, index));
      if (index >= text.length) {
        setDone(true);
        window.clearInterval(timer);
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [speed, text]);

  const reveal = useCallback(() => {
    setVisible(text);
    setDone(true);
  }, [text]);

  return { visible, done, reveal };
}

export function VisualNovelStage({
  scene,
  line,
  events,
  isStreaming,
  isActionPhase,
  canAdvance,
  autoAdvance = false,
  autoAdvanceDelay = 110,
  actionPanel,
  scriptedBgOverride,
  visualResetKey = 0,
  onAdvance,
}: VisualNovelStageProps) {
  const text = line?.text || '';
  const { visible, done, reveal } = useTypewriter(text, autoAdvance ? 0 : 20);
  const [showActionPrompt, setShowActionPrompt] = useState(false);
  const actionPromptTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actionPromptShownRef = useRef(false);

  // 粘性背景：某行设置了 bgImage 后，后续无 bgImage 的行自动继承
  const [stickyBg, setStickyBg] = useState<string | null>(null);
  useEffect(() => {
    if (line?.bgImage) setStickyBg(line.bgImage);
  }, [line?.bgImage]);

  // 进入行动阶段时显示"选择行动"提示，1秒后自动消失
  useEffect(() => {
    if (!isActionPhase) {
      actionPromptShownRef.current = false;
      setShowActionPrompt(false);
      return;
    }

    if (actionPanel && !actionPromptShownRef.current) {
      actionPromptShownRef.current = true;
      setShowActionPrompt(true);
      actionPromptTimerRef.current = setTimeout(() => setShowActionPrompt(false), 1000);
    }

    return () => {
      if (actionPromptTimerRef.current) clearTimeout(actionPromptTimerRef.current);
    };
  }, [isActionPhase, Boolean(actionPanel)]);
  const speaker = useMemo(
    () => resolveSpeakerName(line?.speaker || (isStreaming ? '主持人' : '')),
    [isStreaming, line?.speaker],
  );
  const buttonLabel = useMemo(() => {
    if (isActionPhase) return '行动';
    if (!line && isStreaming) return '等待KP';
    if (!done) return '显示全文';
    if (!canAdvance) return '等待KP';
    return '下一句';
  }, [canAdvance, done, isActionPhase, isStreaming, line]);

  // 场景背景图多阶段切换
  const FALLBACK_TRIGGER = '双脚重新落地时，一座倒悬于洞穴穹顶之上的城市出现在你面前';  // 子串匹配，兼容AI文本微小差异
  const [bgRevealed, setBgRevealed] = useState(false);
  const [bgStageIndex, setBgStageIndex] = useState(-1);
  const stages = scene.bgStages || [];
  const revealBaseBackgroundImmediately = scene.id !== 'inverse-city';
  // 首触发词：始终用通用触发词展示主背景；后续由 bgStages 的 trigger 独立接管阶段切换
  const firstTrigger = FALLBACK_TRIGGER;

  useEffect(() => {
    setStickyBg(line?.bgImage || null);
    setBgRevealed(Boolean(line?.bgImage || scriptedBgOverride || revealBaseBackgroundImmediately));
    setBgStageIndex(-1);
  }, [visualResetKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // 场景切换时重置
  useEffect(() => {
    if (!scene.backgroundImage) { setBgRevealed(false); setBgStageIndex(-1); return; }
    setBgRevealed(revealBaseBackgroundImmediately);
    setBgStageIndex(-1);
  }, [scene.id, scene.backgroundImage, revealBaseBackgroundImmediately, stages.length]);

  // 第一阶段触发
  useEffect(() => {
    if (bgRevealed || !scene.backgroundImage) return;
    if (text.includes(firstTrigger)) { setBgRevealed(true); setBgStageIndex(0); }
  }, [bgRevealed, scene.backgroundImage, text, firstTrigger]);

  // 后续阶段触发：依次检测 bgStages 中的触发词（独立触发，不依赖 bgRevealed）
  useEffect(() => {
    if (!stages.length) return;
    for (let i = 0; i < stages.length; i++) {
      const stageIndex = i + 1;
      if (bgStageIndex >= stageIndex) continue;
      if (text.includes(stages[i].trigger)) {
        setBgStageIndex(stageIndex);
        setBgRevealed(true);
        break;
      }
    }
  }, [bgStageIndex, stages, text]);

  // 脚本显式指定背景：同步 stage 到文本匹配体系
  useEffect(() => {
    if (scriptedBgOverride) {
      setBgRevealed(true);
      setBgStageIndex(0);
    }
  }, [scriptedBgOverride]);

  // 生效背景图：当前台词 > override(场景级) > 粘性继承 > stage > 主背景
  const activeBgImage = useMemo(() => {
    if (line?.bgImage) return line.bgImage;
    if (scriptedBgOverride) return scriptedBgOverride;
    if (stickyBg) return stickyBg;
    if (bgStageIndex > 0 && stages[bgStageIndex - 1]) return stages[bgStageIndex - 1].image;
    if (bgRevealed && scene.backgroundImage) return scene.backgroundImage;
    return null;
  }, [line?.bgImage, stickyBg, scriptedBgOverride, bgStageIndex, bgRevealed, scene.backgroundImage, stages]);

  function advance() {
    if (isActionPhase) return;
    if (!line && isStreaming) return;
    if (!done) {
      reveal();
      return;
    }
    if (canAdvance) onAdvance();
  }

  useEffect(() => {
    if (!autoAdvance || isActionPhase || isStreaming || !line || !done || !canAdvance) return;

    const timer = window.setTimeout(() => {
      onAdvance();
    }, autoAdvanceDelay);

    return () => window.clearTimeout(timer);
  }, [autoAdvance, autoAdvanceDelay, canAdvance, done, isActionPhase, isStreaming, line, onAdvance]);

  // 空格键推进
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === ' ' && !isActionPhase && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        advance();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isActionPhase, canAdvance, done, isStreaming, line]);

  const portraitSrc = useMemo(() => line?.portrait || (speaker ? resolvePortraitPath(speaker) : null), [line?.portrait, speaker]);

  return (
    <main className={`vn-canvas ${scene.themeClass}`} onClick={advance}>
      <div className="scene-layer" />
      <div className="scene-vignette" />

      {/* 场景背景图 — 多阶段切换，角色出场时保留但降低不透明度 */}
      <AnimatePresence>
        {activeBgImage && (
          <motion.div
            key={`bg-${activeBgImage}`}
            className="scene-background-image"
            style={{ backgroundImage: `url(${activeBgImage})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: portraitSrc ? 0.6 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>

      <header className="scene-header">
        <span>{scene.title}</span>
        <small>{scene.subtitle}</small>
      </header>

      <EventFeed items={events} />

      {/* 角色立绘 — 居中，仅上半身，渐进式浮现 */}
      <AnimatePresence>
        {portraitSrc && (
          <div className="character-portrait" key={`${speaker}-${portraitSrc}`}>
            <motion.img
              src={portraitSrc}
              alt={speaker}
              initial={{ opacity: 0, filter: 'blur(8px) brightness(1.4)' }}
              animate={{ opacity: 1, filter: 'blur(0px) brightness(1)' }}
              exit={{ opacity: 0, filter: 'blur(4px) brightness(0.8)', transition: { duration: 0.5, ease: 'easeInOut' } }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            />
          </div>
        )}
      </AnimatePresence>

      <motion.section
        key={line?.id || 'empty-line'}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`dialogue-box dialogue-${line?.role || 'kp'}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="speaker-row">
          <span>{speaker || '主持人'}</span>
          {isStreaming && <i>AI主持人书写中</i>}
        </div>
        <p>{visible || (isStreaming ? '……' : '')}</p>
        <button
          type="button"
          onClick={advance}
          disabled={isActionPhase || (!line && isStreaming)}
          className="next-button"
        >
          {buttonLabel}
        </button>
      </motion.section>

      {/* 行动阶段中央艺术字提示 + 屏幕变黑特效 */}
      <AnimatePresence>
        {showActionPrompt && (
          <motion.div
            className="action-prompt-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <motion.div
              className="action-prompt-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            />
            <motion.span
              className="action-prompt-text"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.08 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              选择行动
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 行动面板 —— 中心垂直排列，视觉小说风格 */}
      {actionPanel && (
        <div className="vn-choices-wrapper">
          {actionPanel}
        </div>
      )}
    </main>
  );
}
