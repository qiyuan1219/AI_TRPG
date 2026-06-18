import { lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { SaveSlotKey, SaveSlotSummary } from '../../types/game';

const SaveLoadPanel = lazy(() => import('../../components/SaveLoadPanel').then((module) => ({ default: module.SaveLoadPanel })));

export interface SaveLoadBindingProps {
  open: boolean;
  saves: SaveSlotSummary[];
  busySlot: SaveSlotKey | '';
  disabled: boolean;
  message: string;
  messageTone: 'neutral' | 'success' | 'error';
  onClose: () => void;
  onRefresh: () => void;
  onSave: (slotKey: SaveSlotKey, customTitle?: string) => void;
  onLoad: (slotKey: SaveSlotKey) => void;
}

export function SaveLoadBinding({
  open,
  saves,
  busySlot,
  disabled,
  message,
  messageTone,
  onClose,
  onRefresh,
  onSave,
  onLoad,
}: SaveLoadBindingProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="save-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="save-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="save-modal-header">
              <span>冒险存档</span>
              <button type="button" onClick={onClose}>✕</button>
            </div>
            <SaveLoadPanel
              title="冒险存档"
              saves={saves}
              busySlot={busySlot}
              disabled={disabled}
              message={message}
              messageTone={messageTone}
              onRefresh={onRefresh}
              onSave={onSave}
              onLoad={onLoad}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
