import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { getPlayerStyleById } from '../data/dndClasses';
import type { CreateGamePayload, SaveSlotKey, SaveSlotSummary } from '../types/game';
import { SaveLoadPanel } from './SaveLoadPanel';

interface StartDNDProps {
  onStart: (payload: CreateGamePayload) => void;
  onBack?: () => void;
  saves?: SaveSlotSummary[];
  saveBusySlot?: SaveSlotKey | '';
  saveMessage?: string;
  saveMessageTone?: 'neutral' | 'success' | 'error';
  onRefreshSaves?: () => void;
  onLoadSave?: (slotKey: SaveSlotKey) => void;
}

export function StartDND({
  onStart,
  onBack,
  saves = [],
  saveBusySlot = '',
  saveMessage = '',
  saveMessageTone = 'neutral',
  onRefreshSaves,
  onLoadSave,
}: StartDNDProps) {
  const [name, setName] = useState('冒险者');
  const [showSaves, setShowSaves] = useState(false);
  const [skipOpening, setSkipOpening] = useState(false);

  function submit() {
    const fallbackStyle = getPlayerStyleById('balanced');
    onStart({
      player_name: name.trim() || '冒险者',
      char_class: '待确认流派',
      attr_str: fallbackStyle.attributes.str,
      attr_dex: fallbackStyle.attributes.dex,
      attr_con: fallbackStyle.attributes.con,
      attr_int: fallbackStyle.attributes.int,
      attr_wis: fallbackStyle.attributes.wis,
      attr_cha: fallbackStyle.attributes.cha,
      level: 3,
      skip_opening: skipOpening,
      style_selection_pending: true,
    });
  }

  return (
    <div className="start-screen">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="start-layout">
        <header className="start-header">
          <div>
            <p className="eyebrow">D&D AI-TRPG</p>
            <h1>地心之门</h1>
          </div>
          <div className="start-header-copy">
            <p>逆穹悬城倒挂在穹顶之下，无光孢海的荧光在深渊中明灭。</p>
            <p>流派会在入城前的最后一页登记档案中确认。</p>
            {onBack && (
              <button type="button" className="ghost-button" onClick={onBack}>
                返回
              </button>
            )}
          </div>
        </header>

        <section className="creator-grid start-entry-grid">
          <div className="creator-column start-entry-column">
            <label className="field-label" htmlFor="player-name">
              冒险者姓名
            </label>
            <input
              id="player-name"
              value={name}
              maxLength={12}
              onChange={(event) => setName(event.target.value)}
              className="text-field"
            />

            <div className="start-brief-card">
              <h3>登记说明</h3>
              <p>委托已经确认，开场剧情会先带你抵达逆穹悬城。</p>
              <p>当主持人念到登记页时，你会在那里正式选择自己的冒险者流派。</p>
            </div>

            <label className="start-inline-toggle">
              <input type="checkbox" checked={skipOpening} onChange={(e) => setSkipOpening(e.target.checked)} />
              <span>跳过固定开场，仍会保留流派确认环节</span>
            </label>

            <button type="button" onClick={submit} className="start-button">
              深入地下城
            </button>
          </div>
        </section>
      </motion.div>

      {onLoadSave && (
        <button
          type="button"
          className="load-save-fab"
          onClick={() => setShowSaves(true)}
          title="读取存档"
        >
          📂
        </button>
      )}

      <AnimatePresence>
        {showSaves && onLoadSave && (
          <motion.div
            className="save-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSaves(false)}
          >
            <motion.div
              className="save-modal"
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
            >
              <SaveLoadPanel
                saves={saves}
                busySlot={saveBusySlot}
                disabled={Boolean(saveBusySlot)}
                message={saveMessage}
                messageTone={saveMessageTone}
                onRefresh={onRefreshSaves}
                onLoad={(slotKey) => {
                  onLoadSave(slotKey);
                  setShowSaves(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default StartDND;
