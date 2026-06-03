import { motion } from 'framer-motion';
import type { SaveSlotKey, SaveSlotSummary } from '../types/game';
import { SaveLoadPanel } from './SaveLoadPanel';

interface LoadGameScreenProps {
  saves: SaveSlotSummary[];
  saveBusySlot: SaveSlotKey | '';
  saveMessage: string;
  saveMessageTone: 'neutral' | 'success' | 'error';
  onBack: () => void;
  onRefreshSaves: () => void;
  onLoadSave: (slotKey: SaveSlotKey) => void;
}

export function LoadGameScreen({
  saves,
  saveBusySlot,
  saveMessage,
  saveMessageTone,
  onBack,
  onRefreshSaves,
  onLoadSave,
}: LoadGameScreenProps) {
  return (
    <main className="load-game-screen">
      <motion.section
        className="load-game-layout"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <header className="load-game-header">
          <div>
            <p className="eyebrow">LOAD GAME</p>
            <h1>读取存档</h1>
          </div>
          <button type="button" className="ghost-button" onClick={onBack}>
            返回
          </button>
        </header>

        <div className="load-game-panel">
          <SaveLoadPanel
            title="冒险记录"
            saves={saves}
            busySlot={saveBusySlot}
            message={saveMessage}
            messageTone={saveMessageTone}
            onRefresh={onRefreshSaves}
            onLoad={onLoadSave}
          />
        </div>
      </motion.section>
    </main>
  );
}
