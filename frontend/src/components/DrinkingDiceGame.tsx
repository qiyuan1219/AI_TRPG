import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DiceRollOverlay } from './DiceRollOverlay';
import type { TutorialStep } from './TutorialOverlay';
import type { DiceResult } from '../types/game';

const INITIAL_ALCOHOL = 10;
const INITIAL_AC = 8;
const AC_STEP = 2;
const MAX_AC = 18;

function rollDie(sides: number) {
  return Math.floor(Math.random() * sides) + 1;
}

function conModifier(con: number) {
  return Math.floor((con - 10) / 2);
}

export type DrinkingRoundLog = {
  round: number;
  ac: number;
  d20: number;
  conMod: number;
  total: number;
  success: boolean;
  natural20: boolean;
  drinkRoll: number | null;
  alcoholBefore: number;
  alcoholAfter: number;
  message: string;
};

export type DrinkingGameResult = {
  totalRounds: number;
  trustGain: number;
  finalDialogue: string;
  logs: DrinkingRoundLog[];
};

export type DrinkingDiceResult = DrinkingGameResult;

interface DrinkingDiceGameProps {
  onBack: () => void;
  onComplete: (result: DrinkingDiceResult) => void;
  playerCon?: number;
}

export function getBrockTrustGain(totalRounds: number) {
  if (totalRounds === 1) return 15;
  if (totalRounds === 2) return 13;
  if (totalRounds === 3) return 10;
  if (totalRounds === 4) return 8;
  if (totalRounds === 5) return 5;
  if (totalRounds === 6) return 3;
  return 0;
}

export function getBrockFinalDialogue(totalRounds: number) {
  if (totalRounds === 1) {
    return '「……一口就见底？哈！我收回前言，你这家伙不是来喝酒的，你是来吓酒桶的！」';
  }
  if (totalRounds === 2) {
    return '「够狠！这酒连矿道里的老矮人都得慢慢咽，你倒是敢往喉咙里灌。」';
  }
  if (totalRounds === 3) {
    return '「不错，有点本事。能在第三轮前喝完的人，至少不会在孢海里被第一阵怪味熏倒。」';
  }
  if (totalRounds === 4) {
    return '「还行，脸色是差了点，但手没抖。跟你下深层，我多少能放心一些。」';
  }
  if (totalRounds === 5) {
    return '「勉强过关。酒量不算漂亮，不过你至少没把杯子扣我桌上。」';
  }
  if (totalRounds === 6) {
    return '「喝得慢了点，但能撑到最后也算有骨气。行吧，我记你一分。」';
  }
  return '「啧，酒喝完是喝完了，可这速度……到了无光孢海，别指望菌雾等你慢慢适应。」';
}

export function playBrockDrinkingGame(conMod: number): DrinkingGameResult {
  let alcohol = INITIAL_ALCOHOL;
  let ac = INITIAL_AC;
  let round = 1;
  const logs: DrinkingRoundLog[] = [];

  while (alcohol > 0) {
    const alcoholBefore = alcohol;
    const d20 = rollDie(20);
    const total = d20 + conMod;
    const natural20 = d20 === 20;
    const success = natural20 || total >= ac;
    let drinkRoll: number | null = null;
    let message = '';

    if (natural20) {
      alcohol = 0;
      message = `第${round}回合：你投出自然20！烈酒入口的一瞬间，你像是完全无视了酒劲，直接将杯中酒一饮而尽。`;
    } else if (success) {
      drinkRoll = rollDie(4);
      alcohol = Math.max(0, alcohol - drinkRoll);
      message = `第${round}回合：体质豁免 D20=${d20}，体质加值=${conMod}，总值=${total}，成功达到 AC ${ac}。你继续喝酒，酒量骰 1D4=${drinkRoll}，剩余酒量 ${alcohol}。`;
    } else {
      message = `第${round}回合：体质豁免 D20=${d20}，体质加值=${conMod}，总值=${total}，未达到 AC ${ac}。你被浓烈酒气呛到，本回合没能喝下去，剩余酒量仍为 ${alcohol}。`;
    }

    logs.push({
      round,
      ac,
      d20,
      conMod,
      total,
      success,
      natural20,
      drinkRoll,
      alcoholBefore,
      alcoholAfter: alcohol,
      message,
    });

    if (alcohol <= 0) break;
    round += 1;
    ac = Math.min(MAX_AC, ac + AC_STEP);
  }

  return {
    totalRounds: round,
    trustGain: getBrockTrustGain(round),
    finalDialogue: getBrockFinalDialogue(round),
    logs,
  };
}

const DRINKING_TUTORIAL: TutorialStep[] = [
  {
    title: '基本规则',
    badge: '铁锅烈酒',
    placement: 'center',
    body: '你的初始酒量为10。每回合先进行体质豁免：D20 + 体质加值，对抗当前 AC。\n\n成功才能真正喝下去；失败会被酒气呛到，本回合酒量不减少。',
  },
  {
    title: 'AC递增',
    badge: '越来越烈',
    placement: 'center',
    body: '第一回合 AC8。每回合结束后，如果酒还没喝完，AC +2，最高到 AC18。\n\n越拖到后面，酒劲越冲，体质豁免越难通过。',
  },
  {
    title: '喝酒与自然20',
    badge: '1D4酒量骰',
    placement: 'center',
    body: '体质豁免成功后，投 1D4，当前酒量减少对应点数。\n\n如果体质豁免投出自然20，直接把酒喝见底，游戏立即结束，不再投 1D4。',
  },
  {
    title: '信任结算',
    badge: '布洛克评价',
    placement: 'center',
    body: '酒量归零后，根据完成回合数增加布洛克信任：1回合+15，2回合+13，3回合+10，4回合+8，5回合+5，6回合+3，超过6回合+0。\n\n无论结果如何，布洛克都会加入队伍。',
  },
];

function createSkillDice(log: DrinkingRoundLog): DiceResult {
  return {
    type: 'skill_check',
    data: {
      掷骰: `D20=${log.d20}`,
      加值: log.conMod,
      总计: log.total,
      DC: log.ac,
      成功: log.success,
      大成功: log.natural20,
      大失败: log.d20 === 1,
      属性: '体质豁免',
    },
  };
}

function resultTone(trustGain: number) {
  if (trustGain >= 10) return 'excellent';
  if (trustGain >= 5) return 'steady';
  if (trustGain > 0) return 'strained';
  return 'rough';
}

function GameTutorialPrompt({
  steps,
  currentStep,
  onClose,
  onPrev,
  onNext,
}: {
  steps: TutorialStep[];
  currentStep: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const step = steps[currentStep];
  if (!step) return null;
  const isLast = currentStep >= steps.length - 1;

  return (
    <motion.div
      className="opening-action-tutorial"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="opening-action-tutorial-card"
        initial={{ opacity: 0, y: -14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.96 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <div className="opening-action-tutorial-progress">
          <i style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
        </div>
        <header>
          <span>{step.badge}</span>
          <button type="button" aria-label="关闭规则教程" onClick={onClose}>×</button>
        </header>
        <h2>{step.title}</h2>
        <p>{step.body}</p>
        <footer>
          <button
            type="button"
            className="opening-action-tutorial-prev"
            disabled={currentStep <= 0}
            onClick={onPrev}
          >
            上一步
          </button>
          <small>{currentStep + 1} / {steps.length}</small>
          <button
            type="button"
            className="opening-action-tutorial-next"
            onClick={onNext}
          >
            {isLast ? '开始游戏' : '下一步'}
          </button>
        </footer>
      </motion.div>
    </motion.div>
  );
}

export function DrinkingDiceGame({ onBack, onComplete, playerCon = 15 }: DrinkingDiceGameProps) {
  const conMod = conModifier(playerCon);
  const [result, setResult] = useState<DrinkingGameResult | null>(null);
  const [visibleRounds, setVisibleRounds] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [currentDice, setCurrentDice] = useState<DiceResult | null>(null);
  const [tutorialStep, setTutorialStep] = useState(0);

  const visibleLogs = result?.logs.slice(0, visibleRounds) ?? [];
  const lastLog = visibleLogs[visibleLogs.length - 1] ?? null;
  const nextLog = result?.logs[visibleRounds] ?? null;
  const alcohol = lastLog?.alcoholAfter ?? INITIAL_ALCOHOL;
  const nextAc = nextLog?.ac ?? INITIAL_AC;
  const isComplete = Boolean(result && visibleRounds >= result.logs.length);
  const tone = result ? resultTone(result.trustGain) : 'steady';
  const progress = Math.max(0, Math.min(100, (alcohol / INITIAL_ALCOHOL) * 100));

  const statusText = useMemo(() => {
    if (!result) return '布洛克把一只厚底酒杯推到你面前，杯沿还挂着辛辣的白雾。';
    if (isComplete) return `挑战完成：共 ${result.totalRounds} 回合，布洛克信任 +${result.trustGain}`;
    if (!nextLog) return '烈酒已经见底。';
    return `准备第 ${nextLog.round} 回合体质豁免：D20 + ${conMod} vs AC ${nextLog.ac}`;
  }, [conMod, isComplete, nextLog, result]);

  function startChallenge() {
    const nextResult = playBrockDrinkingGame(conMod);
    setResult(nextResult);
    setVisibleRounds(0);
    setRolling(false);
    setCurrentDice(null);
  }

  function revealNextRound() {
    if (!result || rolling || isComplete) return;
    const log = result.logs[visibleRounds];
    if (!log) return;
    setRolling(true);
    setCurrentDice(createSkillDice(log));
    window.setTimeout(() => {
      setVisibleRounds((value) => Math.min(result.logs.length, value + 1));
      setRolling(false);
    }, 720);
  }

  function finish() {
    if (!result) return;
    onComplete(result);
  }

  return (
    <motion.div
      className="brock-drink-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.section
        className="brock-drink-modal"
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 18 }}
        transition={{ duration: 0.18 }}
      >
        <header className="brock-drink-header">
          <div>
            <span>布洛克的烈酒考验</span>
            <small>酒量10 · 初始AC8 · 每回合AC+2 · 自然20直接见底</small>
          </div>
          <button type="button" className="brock-drink-close" onClick={onBack} aria-label="关闭喝酒游戏">×</button>
        </header>

        <section className="brock-drink-board">
          <aside className="brock-drink-side">
            <button type="button" className="tavern-tool-btn" onClick={() => setTutorialStep(0)}>
              规则说明
            </button>
            <button type="button" className="tavern-tool-btn primary" onClick={result ? revealNextRound : startChallenge} disabled={rolling || isComplete}>
              {!result ? '开始挑战' : isComplete ? '酒已见底' : `掷第${nextLog?.round ?? visibleRounds + 1}回合`}
            </button>
            <button type="button" className="tavern-tool-btn" onClick={finish} disabled={!isComplete}>
              确认结果
            </button>
          </aside>

          <main className="brock-drink-table">
            <div className="brock-drink-status">
              <div>
                <small>剩余酒量</small>
                <strong>{alcohol} / {INITIAL_ALCOHOL}</strong>
              </div>
              <div>
                <small>当前AC</small>
                <strong>{isComplete ? '-' : nextAc}</strong>
              </div>
              <div>
                <small>体质加值</small>
                <strong>{conMod >= 0 ? `+${conMod}` : conMod}</strong>
              </div>
              <div>
                <small>信任预期</small>
                <strong>{result && isComplete ? `+${result.trustGain}` : '--'}</strong>
              </div>
            </div>

            <div className="brock-drink-meter" aria-label={`剩余酒量 ${alcohol}`}>
              <i style={{ width: `${progress}%` }} />
            </div>

            <section className="brock-drink-message">
              <p>{statusText}</p>
              {lastLog && (
                <div className={`brock-drink-last ${lastLog.success ? 'success' : 'fail'}`}>
                  <b>{lastLog.natural20 ? '自然20' : lastLog.success ? '豁免成功' : '豁免失败'}</b>
                  <span>D20={lastLog.d20} + {lastLog.conMod} = {lastLog.total} / AC{lastLog.ac}</span>
                  <small>{lastLog.drinkRoll ? `酒量骰 1D4=${lastLog.drinkRoll}` : lastLog.natural20 ? '直接见底' : '本回合未喝下'}</small>
                </div>
              )}
            </section>

            {isComplete && result && (
              <section className={`brock-drink-final ${tone}`}>
                <span>{result.totalRounds} 回合完成</span>
                <strong>布洛克信任 +{result.trustGain}</strong>
                <p>{result.finalDialogue}</p>
              </section>
            )}
          </main>

          <aside className="brock-drink-log">
            <h3>回合记录</h3>
            <div>
              {visibleLogs.length ? visibleLogs.map((log) => (
                <motion.article
                  key={log.round}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <span>第 {log.round} 回合 · AC{log.ac}</span>
                  <p>{log.message}</p>
                </motion.article>
              )) : (
                <p className="brock-drink-empty">读完规则后，点击开始挑战。</p>
              )}
            </div>
          </aside>
        </section>
      </motion.section>

      <DiceRollOverlay dice={currentDice} dieType="d20" onClose={() => setCurrentDice(null)} />

      <AnimatePresence>
        {tutorialStep >= 0 && (
          <GameTutorialPrompt
            steps={DRINKING_TUTORIAL}
            currentStep={tutorialStep}
            onClose={() => setTutorialStep(-1)}
            onPrev={() => setTutorialStep((step) => Math.max(0, step - 1))}
            onNext={() => {
              if (tutorialStep >= DRINKING_TUTORIAL.length - 1) {
                setTutorialStep(-1);
              } else {
                setTutorialStep((step) => step + 1);
              }
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
