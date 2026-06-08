import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { SceneVisual, StoryLine } from '../types/game';
import { EventFeed, type EventFeedItem } from './EventFeed';

/* 角色立绘映射 */
const PORTRAIT_MAP: Record<string, string> = {
  冒险者: '/assets/characters/adventurer/adventurer_idle.png',
  瑟琳: '/assets/characters/selin/selin_idle.png',
  森洛: '/assets/characters/senluo/senluo_idle.png',
  莉亚瑟: '/assets/characters/liyase/liyase_idle.png',
  艾琳: '/assets/characters/ailin/ailin_idle.png',
  克莱娅: '/assets/characters/kelaiya/kelaiya_idle.png',
  雷铎: '/assets/characters/leiduo/leiduo_idle.png',
};

function getPortrait(speaker: string): string | null {
  const name = PORTRAIT_MAP[speaker];
  return name || null;
}

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
  onAdvance,
}: VisualNovelStageProps) {
  const text = line?.text || '';
  const { visible, done, reveal } = useTypewriter(text, autoAdvance ? 0 : 20);
  const speaker = line?.speaker || (isStreaming ? 'KP' : '');
  const buttonLabel = useMemo(() => {
    if (isActionPhase) return '行动';
    if (!line && isStreaming) return '等待KP';
    if (!done) return '显示全文';
    if (!canAdvance) return '等待KP';
    return '下一句';
  }, [canAdvance, done, isActionPhase, isStreaming, line]);

  // 场景背景图渐进式浮现：当文本中出现城市倒挂描写时触发
  const BG_TRIGGER = '一整座城市倒挂在巨大洞穴的穹顶之上';
  const [bgRevealed, setBgRevealed] = useState(false);
  useEffect(() => {
    if (!scene.backgroundImage) return;
    setBgRevealed(false);
  }, [scene.id, scene.backgroundImage]);
  useEffect(() => {
    if (bgRevealed || !scene.backgroundImage) return;
    if (text.includes(BG_TRIGGER)) setBgRevealed(true);
  }, [bgRevealed, scene.backgroundImage, text]);

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

  const portraitSrc = useMemo(() => (speaker ? getPortrait(speaker) : null), [speaker]);

  return (
    <main className={`vn-canvas ${scene.themeClass}`} onClick={advance}>
      <div className="scene-layer" />
      <div className="scene-vignette" />

      {/* 场景背景图 — 渐进式浮现 */}
      <AnimatePresence>
        {bgRevealed && scene.backgroundImage && (
          <motion.div
            key={`bg-${scene.id}`}
            className="scene-background-image"
            style={{ backgroundImage: `url(${scene.backgroundImage})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
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
          <div className="character-portrait" key={speaker}>
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
          <span>{speaker || 'KP'}</span>
          {isStreaming && <i>思考中</i>}
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

      {actionPanel}
    </main>
  );
}
