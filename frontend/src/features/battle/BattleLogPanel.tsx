export interface BattleLogPanelProps {
  logs: string[];
}

export function BattleLogPanel({ logs }: BattleLogPanelProps) {
  return (
    <aside className="battle-log-panel" aria-label="战斗记录">
      <span>战斗记录</span>
      {logs.map((line, index) => (
        <p key={`${index}-${line}`}>{line}</p>
      ))}
    </aside>
  );
}
