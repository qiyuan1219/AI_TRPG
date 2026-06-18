import { lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { GameState, StoryLine } from '../../types/game';

const CharacterPanel = lazy(() => import('../../components/CharacterPanel'));
const DialogueLog = lazy(() => import('../../components/DialogueLog').then((module) => ({ default: module.DialogueLog })));

export interface AppModalsProps {
  showReturnTitleConfirm: boolean;
  showCharacterInfo: boolean;
  showDialogueLog: boolean;
  gameState: GameState;
  displayedStyleName: string;
  story: StoryLine[];
  activeIndex: number;
  streaming: boolean;
  onCloseReturnTitle: () => void;
  onConfirmReturnTitle: () => void;
  onCloseCharacterInfo: () => void;
  onCloseDialogueLog: () => void;
}

export function AppModals({
  showReturnTitleConfirm,
  showCharacterInfo,
  showDialogueLog,
  gameState,
  displayedStyleName,
  story,
  activeIndex,
  streaming,
  onCloseReturnTitle,
  onConfirmReturnTitle,
  onCloseCharacterInfo,
  onCloseDialogueLog,
}: AppModalsProps) {
  return (
    <>
      <AnimatePresence>
        {showReturnTitleConfirm && (
          <motion.div
            className="return-title-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseReturnTitle}
          >
            <motion.section
              className="return-title-modal"
              role="dialog"
              aria-modal="true"
              aria-label="返回标题界面确认"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="return-title-copy">
                <span>返回标题界面</span>
                <p>请先确认当前冒险进度已经存档。未保存的剧情和状态不会自动保存。</p>
              </div>
              <div className="return-title-actions">
                <button type="button" className="return-title-cancel" onClick={onCloseReturnTitle}>取消</button>
                <button type="button" className="return-title-confirm" onClick={onConfirmReturnTitle}>确定</button>
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
            onClick={onCloseCharacterInfo}
          >
            <motion.section
              className="character-modal"
              role="dialog"
              aria-modal="true"
              aria-label="角色信息"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="character-modal-header">
                <div>
                  <span>角色信息</span>
                  <small>{gameState.player_name || '冒险者'} · {displayedStyleName}</small>
                </div>
                <button type="button" aria-label="关闭角色信息" onClick={onCloseCharacterInfo}>×</button>
              </div>
              <CharacterPanel state={gameState} />
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDialogueLog && (
          <DialogueLog
            story={story}
            activeIndex={activeIndex}
            isStreaming={streaming}
            onClose={onCloseDialogueLog}
          />
        )}
      </AnimatePresence>
    </>
  );
}
