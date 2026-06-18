import { motion } from 'framer-motion';

interface BattleTutorialIntroStep {
  title: string;
  text: string;
}

interface BattleTutorialIntroModel {
  title: string;
  subtitle: string;
  steps: BattleTutorialIntroStep[];
}

export interface BattleTutorialIntroProps {
  intro: BattleTutorialIntroModel;
  step: number;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}

export function BattleTutorialIntro({
  intro,
  step,
  onPrevious,
  onNext,
  onClose,
}: BattleTutorialIntroProps) {
  const item = intro.steps[step] ?? intro.steps[0];
  const total = intro.steps.length;
  const isFirst = step <= 0;
  const isLast = step >= total - 1;

  return (
    <motion.section
      className="battle-tutorial-intro-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={intro.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="battle-tutorial-intro"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <div className="battle-tutorial-progress">
          <i style={{ width: `${((step + 1) / total) * 100}%` }} />
        </div>
        <header>
          <span>COMBAT</span>
          <button type="button" aria-label="关闭战斗教学" onClick={onClose}>
            ×
          </button>
        </header>

        <small>{intro.subtitle}</small>
        <h2>{item.title.replace(/^[①②③④⑤⑥]\s*/, '')}</h2>
        <p>{item.text}</p>

        <footer>
          <button type="button" className="battle-tutorial-prev" disabled={isFirst} onClick={onPrevious}>
            上一步
          </button>
          <em>
            {step + 1} / {total}
          </em>
          <button type="button" className="battle-tutorial-next" onClick={onNext}>
            {isLast ? '开始先攻' : '下一步'}
          </button>
        </footer>
      </motion.div>
    </motion.section>
  );
}
