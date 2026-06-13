import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DiceRollOverlay } from './DiceRollOverlay';
import { TutorialOverlay } from './TutorialOverlay';
import type { TutorialStep } from './TutorialOverlay';
import type { DiceResult } from '../types/game';

// ============================================================
// 类型定义
// ============================================================

interface RewardItem {
  itemId: string;
  name: string;
  count: number;
  type: string;
  desc: string;
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
  rewards: RewardItem[];        // 所有获得的奖励（用于加入背包）
  finalD20: number;
  guaranteed: boolean;
  rewardHistory: DrawRecord[];
}

interface OrlanBoxGameProps {
  gold: number;
  onBack: () => void;
  onComplete: (result: OrlanBoxResult) => void;
}

// ============================================================
// 奖励表
// ============================================================

const ORLAN_REWARD_TABLE: RewardItem[] = [
  { itemId: 'rusty_copper_ring', name: '生锈铜戒指', count: 1, type: 'junk', min: 1, max: 3, desc: '看起来不值钱，但奥兰坚称它有故事。' },
  { itemId: 'old_charm_fragment', name: '旧护符碎片', count: 1, type: 'material', min: 4, max: 5, desc: '残缺的护符碎片，或许能卖几个铜币。' },
  { itemId: 'bandage_powder', name: '止血粉', count: 1, type: 'consumable', min: 6, max: 8, desc: '可用于处理普通流血伤口。' },
  { itemId: 'weak_antidote', name: '弱效解毒剂', count: 1, type: 'consumable', min: 9, max: 11, desc: '能缓解轻微毒素，但对深层污染效果有限。' },
  { itemId: 'cold_light_stick', name: '冷光棒', count: 1, type: 'exploration', min: 12, max: 13, desc: '短时间照亮周围环境，不会产生明显热源。' },
  { itemId: 'sealed_sample_vial', name: '密封样本瓶', count: 1, type: 'exploration', min: 14, max: 15, desc: '可用于保存孢子、菌丝或污染残留。' },
  { itemId: 'minor_healing_potion', name: '小瓶治疗药水', count: 1, type: 'consumable', min: 16, max: 17, desc: '能恢复少量生命，适合应急。' },
  { itemId: 'black_market_token', name: '黑市筹码', count: 1, type: 'special', min: 18, max: 18, desc: '黑市流通的小筹码，或许以后能派上用场。' },
];

const DIAMOND_REWARD: RewardItem = {
  itemId: 'clean_diamond',
  name: '干净的钻石',
  count: 1,
  type: 'key',
  desc: '未经附魔、没有追踪印记的天然钻石。凯娅要的就是它。',
};

const COST_PER_DRAW = 20;
const PITY_LIMIT = 8;
const DIAMOND_THRESHOLD = 18; // D20 > 18 即 19/20

// ============================================================
// 抽卡文案
// ============================================================

const ORLAN_DRAW_LINES = {
  normal: [
    '奥兰敲了敲盒盖，示意你打开这一格。',
    '木盒内部传来细碎的金属声。',
    '盲盒暗格弹开，里面躺着一件小东西。',
  ],
  diamond: [
    '奥兰的笑容僵了一瞬。盒中，一颗钻石在冷光灯下亮了起来。',
    '周围的黑市摊主安静了一瞬。你抽中了真正值钱的东西。',
  ],
  pity: [
    '奥兰叹了口气，打开盒底的暗格。',
    '规矩就是规矩。第八次，钻石归你。',
  ],
  noGold: [
    '奥兰按住盒盖，笑着摇头：没金币，就别让幸运为难。',
  ],
  alreadyDone: '你已经拿到了钻石，没必要继续抽取。',
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================================
// 教程步骤
// ============================================================

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: '规则说明',
    badge: 'ORLAN BOX',
    body: '二十金一次。D20 投出 19 或 20 获得钻石。连续 8 次未中获得保底钻石。每次抽取都会获得小道具或钻石。',
  },
];

// ============================================================
// 核心逻辑函数
// ============================================================

function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

function getRewardByD20(d20: number): RewardItem {
  const reward = ORLAN_REWARD_TABLE.find(
    (item) => d20 >= (item.min ?? 1) && d20 <= (item.max ?? 20)
  );
  return reward ?? ORLAN_REWARD_TABLE[0];
}

function getDrawMessage(
  d20: number,
  reward: RewardItem,
  isPity: boolean,
  drawCount: number
): string {
  if (reward.itemId === 'clean_diamond' && isPity) {
    return `第 ${drawCount} 次抽取，保底触发。${pickRandom(ORLAN_DRAW_LINES.pity)}`;
  }
  if (reward.itemId === 'clean_diamond') {
    return `${pickRandom(ORLAN_DRAW_LINES.diamond)} D20 投出 ${d20}！`;
  }
  return `${pickRandom(ORLAN_DRAW_LINES.normal)} D20 投出 ${d20}。获得：${reward.name}——${reward.desc}`;
}

// ============================================================
// 组件
// ============================================================

export function OrlanBoxGame({ gold, onBack, onComplete }: OrlanBoxGameProps) {
  const [drawCount, setDrawCount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [hasDiamond, setHasDiamond] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastD20, setLastD20] = useState<number | null>(null);
  const [lastReward, setLastReward] = useState<RewardItem | null>(null);
  const [lastDrawMessage, setLastDrawMessage] = useState('');
  const [rewardHistory, setRewardHistory] = useState<DrawRecord[]>([]);
  const [allRewards, setAllRewards] = useState<RewardItem[]>([]);

  // 骰子动画状态
  const [diceResult, setDiceResult] = useState<DiceResult | null>(null);
  const [pendingDraw, setPendingDraw] = useState<{
    d20: number;
    reward: RewardItem;
    isPity: boolean;
  } | null>(null);

  // 教程
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // 按钮状态
  const playerGold = gold - totalCost;
  const canDraw = !isCompleted && playerGold >= COST_PER_DRAW;

  let buttonText: string;
  if (isCompleted) {
    buttonText = '已获得钻石';
  } else if (playerGold < COST_PER_DRAW) {
    buttonText = '金币不足';
  } else {
    buttonText = '抽一次 20G';
  }

  // 执行抽取
  const doDraw = useCallback(() => {
    if (!canDraw) return;

    const d20 = rollD20();
    const nextDrawCount = drawCount + 1;
    const isNaturalDiamond = d20 > DIAMOND_THRESHOLD;
    const isPityDiamond = nextDrawCount >= PITY_LIMIT && !hasDiamond;

    let reward: RewardItem;
    let gotDiamond = false;
    let isPity = false;

    if (isNaturalDiamond || isPityDiamond) {
      reward = { ...DIAMOND_REWARD };
      gotDiamond = true;
      isPity = isPityDiamond && !isNaturalDiamond;
    } else {
      reward = { ...getRewardByD20(d20) };
    }

    const message = getDrawMessage(d20, reward, isPity, nextDrawCount);

    // 更新所有状态
    setDrawCount(nextDrawCount);
    setTotalCost((prev) => prev + COST_PER_DRAW);
    setLastD20(d20);
    setLastReward(reward);
    setLastDrawMessage(message);
    setAllRewards((prev) => [...prev, reward]);

    if (gotDiamond) {
      setHasDiamond(true);
      setIsCompleted(true);
    }

    // 先显示骰子动画
    const diceData: DiceResult = {
      type: 'skill_check',
      data: {
        掷骰: `D20=${d20}`,
        总计: String(d20),
        DC: '18',
        成功: gotDiamond,
        描述: gotDiamond ? '获得钻石！' : '未中钻石',
        骰子: 'd20',
      },
    };
    setDiceResult(diceData);
    setPendingDraw({ d20, reward, isPity });
  }, [canDraw, drawCount, hasDiamond]);

  // 骰子动画关闭后处理
  const handleDiceClose = useCallback(() => {
    setDiceResult(null);
    if (pendingDraw) {
      const { d20, reward, isPity } = pendingDraw;
      const record: DrawRecord = {
        index: drawCount,
        d20,
        reward,
        cost: COST_PER_DRAW,
        isPity,
      };
      setRewardHistory((prev) => [...prev, record]);
      setPendingDraw(null);
    }
  }, [pendingDraw, drawCount]);

  // 完成按钮
  const handleComplete = useCallback(() => {
    onComplete({
      drawCount,
      spent: totalCost,
      rewards: allRewards,
      finalD20: lastD20 ?? 0,
      guaranteed: rewardHistory.some((r) => r.isPity),
      rewardHistory,
    });
  }, [onComplete, drawCount, totalCost, allRewards, lastD20, rewardHistory]);

  const currentGoldDisplay = Math.max(0, gold - totalCost);

  return (
    <main
      className="test-screen"
      style={{
        backgroundImage:
          'linear-gradient(90deg, rgba(10,8,14,0.88), rgba(10,8,14,0.58)), url(/assets/scenes/10orlan-lucky-box.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* 教程覆盖层 */}
      {showTutorial && (
        <TutorialOverlay
          steps={TUTORIAL_STEPS}
          currentStep={tutorialStep}
          onClose={() => setShowTutorial(false)}
          onPrev={() => setTutorialStep((s) => Math.max(0, s - 1))}
          onNext={() => {
            if (tutorialStep >= TUTORIAL_STEPS.length - 1) {
              setShowTutorial(false);
              setTutorialStep(0);
            } else {
              setTutorialStep((s) => s + 1);
            }
          }}
        />
      )}

      {/* 骰子动画覆盖层 */}
      <DiceRollOverlay
        dice={diceResult}
        dieType="d20"
        onClose={handleDiceClose}
        diceKind="幸运盲盒抽取"
        charSkill="奥兰的幸运盲盒"
      />

      <section className="test-layout">
        {/* 头部 */}
        <header className="test-header">
          <div>
            <p className="eyebrow">ORLAN BOX</p>
            <h1>幸运盲盒</h1>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              type="button"
              className="ghost-button"
              onClick={() => setShowTutorial(true)}
              style={{ fontSize: '0.85rem', minHeight: 32, padding: '0 12px' }}
            >
              规则
            </button>
            <button type="button" className="ghost-button" onClick={onBack}>
              返回
            </button>
          </div>
        </header>

        {/* 旁白 */}
        <p
          style={{
            color: 'var(--muted)',
            fontSize: '0.95rem',
            lineHeight: 1.65,
            marginBottom: 18,
            fontStyle: 'italic',
          }}
        >
          奥兰把盲盒推到柜台中央。
        </p>

        {/* 规则摘要 */}
        <div className="test-section-title" style={{ marginBottom: 10 }}>
          <span>规则</span>
          <small>
            二十金一次。D20 大于 18 获得钻石。第 8 次保底。每次都会获得小道具或钻石。
          </small>
        </div>

        {/* 主面板 */}
        <section className="dice-judge-panel">
          {/* D20 显示区 + 按钮 */}
          <div className="dice-judge-board">
            <div className="dice-judge-symbol">
              {lastD20 !== null ? `D20=${lastD20}` : 'D20'}
            </div>
            <div className="dice-judge-copy">
              <strong>
                已抽 {drawCount}/{PITY_LIMIT} 次，花费 {totalCost}G
              </strong>
              <p style={{ marginTop: 4 }}>
                当前金币：{currentGoldDisplay}G
              </p>
              {lastDrawMessage && (
                <p
                  style={{
                    marginTop: 6,
                    color: hasDiamond ? 'var(--gold-soft)' : 'var(--muted)',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                  }}
                >
                  {lastDrawMessage}
                </p>
              )}
            </div>

            {isCompleted ? (
              <button
                type="button"
                className="start-button"
                onClick={handleComplete}
              >
                继续剧情
              </button>
            ) : (
              <button
                type="button"
                className="start-button"
                onClick={doDraw}
                disabled={!canDraw}
              >
                {buttonText}
              </button>
            )}
          </div>

          {/* 如果金币不足 */}
          {!isCompleted && playerGold < COST_PER_DRAW && (
            <p
              style={{
                color: 'rgba(211, 99, 99, 0.85)',
                fontSize: '0.88rem',
                textAlign: 'center',
                margin: 0,
              }}
            >
              {ORLAN_DRAW_LINES.noGold[0]}
            </p>
          )}

          {/* 最近获得 */}
          {lastReward && (
            <div
              style={{
                padding: '12px 18px',
                border: '1px solid rgba(231,211,161,0.2)',
                borderRadius: 8,
                background: 'rgba(16,19,26,0.82)',
              }}
            >
              <span
                style={{
                  color: 'var(--teal)',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                最近获得
              </span>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 6,
                }}
              >
                <strong
                  style={{
                    color: lastReward.itemId === 'clean_diamond' ? 'var(--gold-soft)' : 'var(--text)',
                    fontSize: '1.05rem',
                  }}
                >
                  {lastReward.name}
                  {lastReward.itemId === 'clean_diamond' ? ' 💎' : ''}
                </strong>
                <span
                  style={{
                    color: 'var(--muted)',
                    fontSize: '0.78rem',
                    background: 'rgba(255,255,255,0.06)',
                    padding: '2px 10px',
                    borderRadius: 4,
                  }}
                >
                  {lastReward.type}
                </span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 4 }}>
                {lastReward.desc}
              </p>
            </div>
          )}

          {/* 抽取记录 */}
          <div className="dice-history-list">
            {rewardHistory.length > 0 ? (
              rewardHistory.map((record) => (
                <motion.p
                  key={record.index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    borderLeft:
                      record.reward.itemId === 'clean_diamond'
                        ? '3px solid var(--gold-soft)'
                        : '3px solid transparent',
                    paddingLeft: record.reward.itemId === 'clean_diamond' ? 7 : 10,
                  }}
                >
                  <span>
                    第 {record.index} 次
                    {record.isPity && (
                      <span style={{ color: 'var(--gold-soft)', marginLeft: 6, fontSize: '0.75rem' }}>
                        [保底]
                      </span>
                    )}
                  </span>
                  <b>
                    D20={record.d20}{' '}
                    {record.reward.itemId === 'clean_diamond'
                      ? '💎 钻石'
                      : `· ${record.reward.name}`}
                  </b>
                </motion.p>
              ))
            ) : (
              <p className="dice-history-empty">尚未抽取</p>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

export default OrlanBoxGame;
