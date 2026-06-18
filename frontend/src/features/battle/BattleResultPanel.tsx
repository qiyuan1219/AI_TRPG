export interface BattleResultPanelProps {
  outcome: 'win' | 'lose';
  winTitle: string;
  loseTitle: string;
  winText: string;
  loseText: string;
  completeLabel?: string;
  onContinue?: (result: { outcome: 'win' | 'lose' }) => void;
}

export function BattleResultPanel({
  outcome,
  winTitle,
  loseTitle,
  winText,
  loseText,
  completeLabel,
  onContinue,
}: BattleResultPanelProps) {
  const won = outcome === 'win';

  return (
    <section className={`battle-end-banner ${won ? 'is-win' : 'is-lose'}`} aria-label="战斗结果">
      <b>{won ? winTitle : loseTitle}</b>
      <span>{won ? winText : loseText}</span>
      {completeLabel && onContinue && (
        <button type="button" className="start-button" onClick={() => onContinue({ outcome })}>
          {completeLabel}
        </button>
      )}
    </section>
  );
}
