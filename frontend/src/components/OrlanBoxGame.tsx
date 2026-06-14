import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DiceRollOverlay } from './DiceRollOverlay';
import { TutorialOverlay } from './TutorialOverlay';
import type { TutorialStep } from './TutorialOverlay';
import type { DiceResult } from '../types/game';
import '../styles/orlan-box.css';

interface RewardItem {
  itemId: string;
  name: string;
  count: number;
  type: string;
  desc: string;
  icon: string;
  min?: number;
  max?: number;
}

interface DrawRecord {
  index: number;
  d20: number;
  reward: RewardItem;
  cost: number;
  isPity: boolean;
}

export interface OrlanBoxResult {
  drawCount: number;
  spent: number;
  rewards: RewardItem[];
  finalD20: number;
  guaranteed: boolean;
  rewardHistory: DrawRecord[];
}

interface OrlanBoxGameProps {
  gold: number;
  onBack: () => void;
  onComplete: (result: OrlanBoxResult) => void;
}

const ORLAN_REWARD_TABLE: RewardItem[] = [
  {
    itemId: 'copper_ring',
    name: '生锈铜戒指',
    count: 1,
    type: '旧物',
    min: 1,
    max: 3,
    icon: '/assets/prop/aolan_blindbox/copper_ring.png',
    desc: '边缘磨得发黑，奥兰坚持说它曾经属于一位勇敢的人。',
  },
  {
    itemId: 'old_talisman_fragments',
    name: '旧护符碎片',
    count: 1,
    type: '材料',
    min: 4,
    max: 5,
    icon: '/assets/prop/aolan_blindbox/old_talisman_fragments.png',
    desc: '残缺的护符碎片，表面还有几道不完整的祈愿纹。',
  },
  {
    itemId: 'hemostatic_powder',
    name: '止血粉',
    count: 1,
    type: '消耗品',
    min: 6,
    max: 8,
    icon: '/assets/prop/aolan_blindbox/hemostatic_powder.png',
    desc: '可用于处理普通流血伤口，味道像苦涩的铁锈。',
  },
  {
    itemId: 'weakly_effective_detoxifying_agent',
    name: '弱效解毒剂',
    count: 1,
    type: '消耗品',
    min: 9,
    max: 11,
    icon: '/assets/prop/aolan_blindbox/weakly_effective_detoxifying_agent.png',
    desc: '能缓解轻微毒素，但对深层污染效果有限。',
  },
  {
    itemId: 'cold_light_stick',
    name: '冷光棒',
    count: 1,
    type: '探索',
    min: 12,
    max: 13,
    icon: '/assets/prop/aolan_blindbox/cold_light_stick.png',
    desc: '短时间照亮周围环境，不会产生明显热源。',
  },
  {
    itemId: 'sealed_sample_bottle',
    name: '密封样本瓶',
    count: 1,
    type: '探索',
    min: 14,
    max: 15,
    icon: '/assets/prop/aolan_blindbox/sealed_sample_bottle.png',
    desc: '可用于保存孢子、菌丝或污染残留。',
  },
  {
    itemId: 'small_bottle_therapeutic_solution',
    name: '小瓶治疗药水',
    count: 1,
    type: '消耗品',
    min: 16,
    max: 17,
    icon: '/assets/prop/aolan_blindbox/small_bottle_therapeutic_solution.png',
    desc: '能恢复少量生命，适合应急。',
  },
  {
    itemId: 'blackmarket_chips',
    name: '黑市筹码',
    count: 1,
    type: '特殊',
    min: 18,
    max: 18,
    icon: '/assets/prop/aolan_blindbox/blackmarket_chips.png',
    desc: '黑市流通的小筹码，也许以后能派上用场。',
  },
];

const DIAMOND_REWARD: RewardItem = {
  itemId: 'diamond',
  name: '干净的钻石',
  count: 1,
  type: '关键道具',
  icon: '/assets/prop/aolan_blindbox/diamond.png',
  desc: '未经附魔、没有追踪印记的天然钻石。凯娅要的就是它。',
};

const COST_PER_DRAW = 20;
const PITY_LIMIT = 8;
const DIAMOND_THRESHOLD = 18;

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: '规则说明',
    badge: 'ORLAN BOX',
    body: '20G 一次，D20 投出 19 或 20 获得钻石。连续 8 次未中会触发保底；每次抽取都会获得一个小道具或钻石。',
  },
];

function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}

function getRewardByD20(d20: number) {
  return ORLAN_REWARD_TABLE.find((item) => d20 >= (item.min ?? 1) && d20 <= (item.max ?? 20)) ?? ORLAN_REWARD_TABLE[0];
}

function RewardReveal({
  record,
  onClose,
}: {
  record: DrawRecord;
  onClose: () => void;
}) {
  const isDiamond = record.reward.itemId === 'diamond';
  return (
    <motion.div
      className="orlan-reward-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.section
        className={`orlan-reward-card ${isDiamond ? 'orlan-reward-card-diamond' : ''}`}
        initial={{ opacity: 0, scale: 0.9, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      >
        <span className="orlan-reward-kicker">{record.isPity ? '保底奖励' : `D20 = ${record.d20}`}</span>
        <div className="orlan-reward-image-frame">
          <img src={record.reward.icon} alt={record.reward.name} />
        </div>
        <h2>{record.reward.name}</h2>
        <p>{record.reward.desc}</p>
        <button type="button" onClick={onClose}>
          收下
        </button>
      </motion.section>
    </motion.div>
  );
}

export function OrlanBoxGame({ gold, onBack, onComplete }: OrlanBoxGameProps) {
  const [drawCount, setDrawCount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [hasDiamond, setHasDiamond] = useState(false);
  const [lastD20, setLastD20] = useState<number | null>(null);
  const [lastReward, setLastReward] = useState<RewardItem | null>(null);
  const [rewardHistory, setRewardHistory] = useState<DrawRecord[]>([]);
  const [allRewards, setAllRewards] = useState<RewardItem[]>([]);
  const [diceResult, setDiceResult] = useState<DiceResult | null>(null);
  const [pendingDraw, setPendingDraw] = useState<DrawRecord | null>(null);
  const [revealedDraw, setRevealedDraw] = useState<DrawRecord | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const currentGold = Math.max(0, gold - totalCost);
  const canDraw = !hasDiamond && currentGold >= COST_PER_DRAW;

  const doDraw = useCallback(() => {
    if (!canDraw) return;

    const d20 = rollD20();
    const nextDrawCount = drawCount + 1;
    const isNaturalDiamond = d20 > DIAMOND_THRESHOLD;
    const isPityDiamond = nextDrawCount >= PITY_LIMIT && !hasDiamond;
    const isPity = isPityDiamond && !isNaturalDiamond;
    const reward = isNaturalDiamond || isPityDiamond ? { ...DIAMOND_REWARD } : { ...getRewardByD20(d20) };
    const record: DrawRecord = {
      index: nextDrawCount,
      d20,
      reward,
      cost: COST_PER_DRAW,
      isPity,
    };

    setDrawCount(nextDrawCount);
    setTotalCost((value) => value + COST_PER_DRAW);
    setLastD20(d20);
    setLastReward(reward);
    setAllRewards((prev) => [...prev, reward]);
    setPendingDraw(record);
    if (reward.itemId === 'diamond') setHasDiamond(true);

    setDiceResult({
      type: 'skill_check',
      data: {
        掷骰: `D20=${d20}`,
        总计: d20,
        DC: DIAMOND_THRESHOLD + 1,
        成功: reward.itemId === 'diamond',
        描述: reward.itemId === 'diamond' ? '获得钻石' : `获得${reward.name}`,
        骰子: 'd20',
      },
    });
  }, [canDraw, drawCount, hasDiamond]);

  const handleDiceClose = useCallback(() => {
    setDiceResult(null);
    if (pendingDraw) {
      setRewardHistory((prev) => [...prev, pendingDraw]);
      setRevealedDraw(pendingDraw);
      setPendingDraw(null);
    }
  }, [pendingDraw]);

  const handleComplete = useCallback(() => {
    onComplete({
      drawCount,
      spent: totalCost,
      rewards: allRewards,
      finalD20: lastD20 ?? 0,
      guaranteed: rewardHistory.some((record) => record.isPity),
      rewardHistory,
    });
  }, [allRewards, drawCount, lastD20, onComplete, rewardHistory, totalCost]);

  return (
    <main className="orlan-box-screen">
      {showTutorial && (
        <TutorialOverlay
          steps={TUTORIAL_STEPS}
          currentStep={tutorialStep}
          onClose={() => setShowTutorial(false)}
          onPrev={() => setTutorialStep((value) => Math.max(0, value - 1))}
          onNext={() => {
            if (tutorialStep >= TUTORIAL_STEPS.length - 1) {
              setShowTutorial(false);
              setTutorialStep(0);
            } else {
              setTutorialStep((value) => value + 1);
            }
          }}
        />
      )}

      <DiceRollOverlay
        dice={diceResult}
        dieType="d20"
        onClose={handleDiceClose}
        diceKind="幸运盲盒抽取"
        charSkill="奥兰的幸运盲盒"
      />

      <AnimatePresence>
        {revealedDraw && <RewardReveal record={revealedDraw} onClose={() => setRevealedDraw(null)} />}
      </AnimatePresence>

      <section className="orlan-box-panel">
        <header className="orlan-box-header">
          <div>
            <span>ORLAN BOX</span>
            <h1>幸运盲盒</h1>
            <p>奥兰把木盒推到柜台中央，盒盖下传来细碎的金属声。</p>
          </div>
          <div className="orlan-box-actions">
            <button type="button" onClick={() => setShowTutorial(true)}>
              规则
            </button>
            <button type="button" onClick={onBack}>
              返回
            </button>
          </div>
        </header>

        <div className="orlan-box-main">
          <div className="orlan-d20-display">
            <span>{lastD20 ?? 'D20'}</span>
            <small>{hasDiamond ? '钻石已入手' : `保底 ${drawCount}/${PITY_LIMIT}`}</small>
          </div>

          <div className="orlan-box-status">
            <strong>当前金币 {currentGold}G</strong>
            <p>20G 一次。D20 投出 19 或 20 获得钻石，第 8 次未中会触发保底。</p>
            {lastReward && (
              <div className="orlan-last-reward">
                <img src={lastReward.icon} alt={lastReward.name} />
                <span>
                  最近获得
                  <b>{lastReward.name}</b>
                </span>
              </div>
            )}
          </div>

          {hasDiamond ? (
            <button type="button" className="orlan-primary-button" onClick={handleComplete} disabled={Boolean(revealedDraw)}>
              继续剧情
            </button>
          ) : (
            <button type="button" className="orlan-primary-button" onClick={doDraw} disabled={!canDraw || Boolean(diceResult) || Boolean(revealedDraw)}>
              {currentGold < COST_PER_DRAW ? '金币不足' : '抽一次 20G'}
            </button>
          )}
        </div>

        {!hasDiamond && currentGold < COST_PER_DRAW && (
          <p className="orlan-warning">奥兰按住盒盖，笑着摇头：没金币，就别让幸运为难。</p>
        )}

        <div className="orlan-history">
          {rewardHistory.length > 0 ? (
            rewardHistory.map((record) => (
              <motion.div
                key={record.index}
                className={record.reward.itemId === 'diamond' ? 'orlan-history-row-diamond' : ''}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <img src={record.reward.icon} alt={record.reward.name} />
                <span>第 {record.index} 次</span>
                <b>D20={record.d20}</b>
                <strong>{record.reward.name}</strong>
                {record.isPity && <em>保底</em>}
              </motion.div>
            ))
          ) : (
            <p className="orlan-empty">尚未抽取</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default OrlanBoxGame;
