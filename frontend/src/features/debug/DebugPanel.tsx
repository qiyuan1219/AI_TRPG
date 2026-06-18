import type { DebugTrace } from '../../core/debug/DebugTrace';
import type { DiceEvent } from '../../core/dice/DiceEvent';
import type { EventEnvelope } from '../../core/events/EventEnvelope';

export interface DebugPackage {
  gameState: unknown;
  recentActions: unknown[];
  eventLog: Array<EventEnvelope<unknown>>;
  diceLog: DiceEvent[];
  statePatches: unknown[];
  debugTraces: DebugTrace[];
  sceneSummary?: unknown;
  aiRawOutputs?: unknown[];
  errors?: unknown[];
  versionInfo?: Record<string, unknown>;
}

export interface DebugPanelProps {
  enabled: boolean;
  traces: DebugTrace[];
  diceEvents: DiceEvent[];
  events: Array<EventEnvelope<unknown>>;
  createPackage: () => DebugPackage;
}

function downloadDebugPackage(debugPackage: DebugPackage) {
  const blob = new Blob([JSON.stringify(debugPackage, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  anchor.href = url;
  anchor.download = `debug_trace_${timestamp}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function DebugPanel({ enabled, traces, diceEvents, events, createPackage }: DebugPanelProps) {
  if (!enabled) return null;
  const latestTrace = traces[traces.length - 1];

  return (
    <aside className="debug-panel" aria-label="Debug Trace">
      <header>
        <b>DebugTrace</b>
        <button type="button" onClick={() => downloadDebugPackage(createPackage())}>
          导出调试包
        </button>
      </header>
      <section>
        <small>最近 Action</small>
        <pre>{latestTrace?.actionId || 'none'}</pre>
      </section>
      <section>
        <small>DiceEvents</small>
        <pre>{diceEvents.map((event) => `${event.rollId}: ${event.type} ${event.total}`).join('\n') || 'none'}</pre>
      </section>
      <section>
        <small>Events</small>
        <pre>{events.slice(-8).map((event) => `${event.sequence} ${event.type}`).join('\n') || 'none'}</pre>
      </section>
      <section>
        <small>StateDiff</small>
        <pre>{JSON.stringify(latestTrace?.state?.diff || [], null, 2)}</pre>
      </section>
    </aside>
  );
}
