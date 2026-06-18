import { motion } from 'framer-motion';

export interface OpeningActionTutorialProps {
  step?: number;
  total?: number;
  onPrevious?: () => void;
  onNext?: () => void;
  onClose: () => void;
  steps?: Array<{ title: string; body: string; badge: string }>;
}

export const OPENING_ACTION_TUTORIAL = [
  {
    title: '选择行动',
    body: '当剧情发展到特定时刻时，主持人会提醒你进入"选择行动阶段"。下方会列出几条推荐行动，你可以直接点击其中一项，也可以在输入框写自己的做法，再点"执行"。AI主持人会根据你的行动以及判定点数推进剧情。',
    badge: 'ACTION',
  },
  {
    title: '六维属性',
    body: '所有行动判定基于 D&D 六维属性，推荐行动后标注的【属性DC】即表示该行动使用哪项属性判定。属性越高，加值越大，成功率越高。\n\n力量 —— 正面迎击、破门、运动\n敏捷 —— 闪避、巧手、潜行\n体质 —— 抵抗毒素、耐酒、忍耐疲劳\n感知 —— 观察、生存、医疗、察觉、自然、洞悉\n智力 —— 调查、奥秘、分析\n魅力 —— 说服、交涉、暗号',
    badge: '六维',
  },
  {
    title: '骰子判定',
    body: '带有"DC+数字"的行动会触发判定。需要你投掷一个对应面数的骰子（一般为20面骰，简称为D20），最终结果为骰子点数 + 属性调整值 + 熟练加值。对比行动所给出的DC，大于等于目标值则行动成功。小于目标值则行动失败',
    badge: 'DC(检定难度)',
  },
  {
    title: '大成功/大失败',
    body: '当骰面结果为1时称为大失败，大失败时会受到特别的惩罚。当骰面结果为20时称为大成功，会有特别的奖励或增益。',
    badge: '大成功/大失败',
  },
  {
    title: '虚构骰子',
    body: '完成一次允许重投的行动判定后，可以消耗 1 个虚构骰子重新投掷 D20。系统会比较初次判定与重投判定的总值，最终采用较高的一次结果。每次判定最多使用一个重投道具。',
    badge: '重投取高',
  },
  {
    title: '万能骰子',
    body: '完成一次允许重投的行动判定后，可以消耗 1 个万能骰子，自行指定本次 D20 的骰面点数（1～20），并直接采用指定结果。万能骰子与虚构骰子不能在同一次判定中重复使用。',
    badge: '指定点数',
  },
];

export function OpeningActionTutorial({
  step: stepProp,
  total: totalProp,
  onPrevious,
  onNext,
  onClose,
  steps: stepsProp,
}: OpeningActionTutorialProps) {
  const steps = stepsProp || OPENING_ACTION_TUTORIAL;
  const step = stepProp ?? 0;
  const total = totalProp ?? steps.length;
  const item = steps[step] ?? steps[0];
  const isFirst = step <= 0;
  const isLast = step >= total - 1;
  const isSingleStep = total <= 1;

  return (
    <motion.div
      className="opening-action-tutorial"
      role="dialog"
      aria-modal="true"
      aria-label="新手行动教程"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(event) => event.stopPropagation()}
    >
      <motion.div
        className="opening-action-tutorial-card"
        initial={{ opacity: 0, y: -14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.96 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <div className="opening-action-tutorial-progress">
          <i style={{ width: `${((step + 1) / total) * 100}%` }} />
        </div>
        <header>
          <span>{item.badge}</span>
          <button type="button" aria-label="关闭新手教程" onClick={onClose}>
            ×
          </button>
        </header>
        <h2>{item.title}</h2>
        <p>{item.body}</p>
        <footer>
          {!isSingleStep && (
            <button type="button" className="opening-action-tutorial-prev" disabled={isFirst} onClick={onPrevious}>
              上一步
            </button>
          )}
          {!isSingleStep && <small>{step + 1} / {total}</small>}
          <button
            type="button"
            className="opening-action-tutorial-next"
            onClick={isSingleStep ? onClose : onNext}
            style={isSingleStep ? { marginLeft: 'auto', marginRight: 'auto' } : undefined}
          >
            {isSingleStep ? '确认' : isLast ? '开始行动' : '下一步'}
          </button>
        </footer>
      </motion.div>
    </motion.div>
  );
}
