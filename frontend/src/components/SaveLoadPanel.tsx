import type { SaveSlotKey, SaveSlotSummary } from '../types/game';

export const SAVE_SLOT_KEYS: SaveSlotKey[] = ['auto', 'slot-1', 'slot-2', 'slot-3', 'slot-4', 'slot-5'];

const SLOT_LABELS: Record<SaveSlotKey, string> = {
  auto: '自动存档',
  'slot-1': '存档一',
  'slot-2': '存档二',
  'slot-3': '存档三',
  'slot-4': '存档四',
  'slot-5': '存档五',
};

interface SaveLoadPanelProps {
  saves: SaveSlotSummary[];
  busySlot?: SaveSlotKey | '';
  disabled?: boolean;
  message?: string;
  messageTone?: 'neutral' | 'success' | 'error';
  title?: string;
  onRefresh?: () => void;
  onSave?: (slotKey: SaveSlotKey) => void;
  onLoad: (slotKey: SaveSlotKey) => void;
}

function formatSaveTime(value: string) {
  if (!value) return '未记录时间';

  const date = new Date(value.includes('T') ? value : value.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function SaveLoadPanel({
  saves,
  busySlot = '',
  disabled = false,
  message = '',
  messageTone = 'neutral',
  title = '冒险存档',
  onRefresh,
  onSave,
  onLoad,
}: SaveLoadPanelProps) {
  const saveBySlot = new Map(saves.map((save) => [save.slot_key, save]));
  const hasBusySlot = Boolean(busySlot);

  return (
    <div className="save-load-panel">
      <div className="save-load-header">
        <span>{title}</span>
        {onRefresh && (
          <button type="button" onClick={onRefresh} disabled={hasBusySlot}>
            刷新
          </button>
        )}
      </div>

      {message && <p className={`save-message save-message-${messageTone}`}>{message}</p>}

      <div className="save-slot-list">
        {SAVE_SLOT_KEYS.map((slotKey) => {
          const save = saveBySlot.get(slotKey);
          const isBusy = busySlot === slotKey;
          const isAutoSlot = slotKey === 'auto';

          return (
            <div key={slotKey} className={`save-slot ${save ? 'has-save' : ''} ${isAutoSlot ? 'is-auto-save' : ''}`}>
              <div className="save-slot-copy">
                <strong>{save?.title || SLOT_LABELS[slotKey]}</strong>
                <small>
                  {save
                    ? `${save.player_name} · ${save.char_class} Lv.${save.level}`
                    : '空存档位'}
                </small>
                <em>{save ? `${formatSaveTime(save.saved_at)} · ${save.current_area}` : '尚未写入冒险记录'}</em>
              </div>

              <div className="save-slot-actions">
                {onSave && !isAutoSlot && (
                  <button type="button" onClick={() => onSave(slotKey)} disabled={disabled || hasBusySlot}>
                    {isBusy ? '...' : '存'}
                  </button>
                )}
                <button type="button" onClick={() => onLoad(slotKey)} disabled={disabled || hasBusySlot || !save}>
                  {isBusy ? '...' : '读'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
