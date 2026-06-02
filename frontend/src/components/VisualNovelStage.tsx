import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { SceneVisual, StoryLine } from '../types/game';
import { EventFeed, type EventFeedItem } from './EventFeed';

interface VisualNovelStageProps {
  scene: SceneVisual;
  line?: StoryLine;
  events: EventFeedItem[];
  isStreaming: boolean;
  isActionPhase: boolean;
  canAdvance: boolean;
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
  actionPanel,
  onAdvance,
}: VisualNovelStageProps) {
  const text = line?.text || '';
  const { visible, done, reveal } = useTypewriter(text);
  const speaker = line?.speaker || (isStreaming ? 'KP' : '');
  const buttonLabel = useMemo(() => {
    if (isActionPhase) return '行动';
    if (!line && isStreaming) return '等待KP';
    if (!done) return '显示全文';
    if (!canAdvance) return '等待KP';
    return '下一句';
  }, [canAdvance, done, isActionPhase, isStreaming, line]);

  function advance() {
    if (isActionPhase) return;
    if (!line && isStreaming) return;
    if (!done) {
      reveal();
      return;
    }
    if (canAdvance) onAdvance();
  }

  return (
    <main className={`vn-canvas ${scene.themeClass}`} onClick={advance}>
      <div className="scene-layer" />
      <div className="scene-vignette" />

      <header className="scene-header">
        <span>{scene.title}</span>
        <small>{scene.subtitle}</small>
      </header>

      <EventFeed items={events} />

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
