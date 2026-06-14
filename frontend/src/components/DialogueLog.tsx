import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StoryLine } from '../types/game';
import { stripAllMachineProtocolText } from '../utils/narrative';

interface DialogueLogProps {
  story: StoryLine[];
  activeIndex: number;
  isStreaming: boolean;
  onClose: () => void;
}

export function DialogueLog({ story, activeIndex, isStreaming, onClose }: DialogueLogProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const wasStreamingRef = useRef(isStreaming);
  const visibleStory = story
    .slice(0, Math.min(Math.max(activeIndex + 1, 0), story.length))
    .map((line) => ({ ...line, text: stripAllMachineProtocolText(line.text) }))
    .filter((line) => line.text);

  // 自动滚到底部（新对话进入时）
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [visibleStory.length]);

  // 流式输出结束时也滚动
  useEffect(() => {
    if (wasStreamingRef.current && !isStreaming && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
    wasStreamingRef.current = isStreaming;
  }, [isStreaming]);

  function roleLabel(role: StoryLine['role']) {
    if (role === 'player') return '你';
    if (role === 'system') return '系统';
    return '';
  }

  function lineClass(line: StoryLine) {
    if (line.role === 'player') return 'log-line-player';
    if (line.role === 'system') return 'log-line-system';
    return 'log-line-kp';
  }

  return (
    <motion.div
      className="dialogue-log-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="dialogue-log-modal"
        initial={{ opacity: 0, x: 60, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 40, scale: 0.96 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="dialogue-log-header">
          <span>📜 对话日志</span>
          <small>{visibleStory.length} 条记录</small>
          <button onClick={onClose} aria-label="关闭日志">✕</button>
        </div>

        {/* 日志列表 */}
        <div className="dialogue-log-list" ref={listRef}>
          {visibleStory.length === 0 && (
            <p className="log-empty">暂无对话记录</p>
          )}
          {visibleStory.map((line, idx) => {
            const isActive = idx === visibleStory.length - 1;
            return (
              <div
                key={line.id}
                className={`log-entry ${lineClass(line)} ${isActive ? 'log-entry-active' : ''}`}
              >
                <span className="log-entry-meta">
                  {roleLabel(line.role) && (
                    <b className={`log-role-${line.role}`}>{roleLabel(line.role)}</b>
                  )}
                  {line.speaker && line.speaker !== '主持人' && line.role === 'kp' && (
                    <b className="log-role-speaker">{line.speaker}</b>
                  )}
                  {isActive && <i className="log-now-mark">当前</i>}
                </span>
                <p className="log-entry-text">{line.text}</p>
              </div>
            );
          })}
        </div>

        {/* 底部快捷 */}
        <div className="dialogue-log-footer">
          <button onClick={() => {
            if (listRef.current) listRef.current.scrollTop = 0;
          }}>
            ⬆ 回到顶部
          </button>
          <button onClick={() => {
            if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
          }}>
            ⬇ 最新对话
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
