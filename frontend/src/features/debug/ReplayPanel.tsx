import type { ReplayInput } from '../../core/replay/ReplayInput';
import type { ReplayResult } from '../../core/replay/ReplayResult';
import { runReplay } from '../../core/replay/ReplayRunner';

export interface ReplayPanelProps {
  enabled: boolean;
  input?: ReplayInput;
  onResult?: (result: ReplayResult) => void;
}

export function ReplayPanel({ enabled, input, onResult }: ReplayPanelProps) {
  if (!enabled) return null;

  const handleRunReplay = () => {
    if (!input) return;
    const result = runReplay(input);
    onResult?.(result);
  };

  return (
    <aside className="debug-panel replay-panel" aria-label="Replay">
      <header>
        <b>Replay</b>
        <button type="button" disabled={!input} onClick={handleRunReplay}>
          运行最小回放
        </button>
      </header>
      <p>Replay 只使用已记录的 GameAction、DiceEvent 与 StatePatch，不重新投骰，也不调用 AI。</p>
    </aside>
  );
}
