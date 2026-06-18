import { motion } from 'framer-motion';

export interface BattleEffectPanelModel {
  id: number;
  actorName: string;
  skillName: string;
  formula: string;
  resultLine: string;
  narration: string;
  amount?: number;
  success?: boolean;
}

export interface BattleEffectPanelProps<TEffect extends BattleEffectPanelModel = BattleEffectPanelModel> {
  effect: TEffect;
  nextTurnLabel: string;
  nextTurnDisabled: boolean;
  onNextTurn: () => void;
}

export function BattleEffectPanel<TEffect extends BattleEffectPanelModel>({
  effect,
  nextTurnLabel,
  nextTurnDisabled,
  onNextTurn,
}: BattleEffectPanelProps<TEffect>) {
  return (
    <motion.section
      key={effect.id}
      className={`battle-effect-panel ${effect.success === false ? 'is-fail' : 'is-win'}`}
      aria-label="AI KP 回合结算"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="vn-dialogue-box">
        <span className="vn-speaker-tag">
          {effect.actorName} · {effect.skillName}
        </span>
        <p className="vn-result-line">
          <b>{effect.resultLine}</b>
          {typeof effect.amount === 'number' && (
            <em className="vn-amount">{effect.amount}</em>
          )}
        </p>
        <blockquote className="vn-narration">{effect.narration}</blockquote>
        <small className="vn-formula">{effect.formula}</small>
        <button
          type="button"
          className="vn-next-turn-btn"
          disabled={nextTurnDisabled}
          onClick={(event) => {
            event.stopPropagation();
            onNextTurn();
          }}
        >
          {nextTurnLabel}
        </button>
      </div>
    </motion.section>
  );
}
