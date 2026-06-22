import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DiceRollOverlay } from './DiceRollOverlay';
import type { TutorialStep } from './TutorialOverlay';
import type { DiceResult } from '../types/game';
import { fetchMiniGameCommentary } from '../services/api';
import { rollDiceEvent } from '../core/dice/createDiceEvent';

const INITIAL_ALCOHOL = 10;
const INITIAL_AC = 5;
const AC_STEP = 2;
const MAX_AC = 16;

function rollDie(sides: number) {
  return rollDiceEvent('drinking_game', 'minigame', sides).rolls[0];
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
  fictionQuantity?: number;
  omniQuantity?: number;
  onConsumeRerollItem?: (itemId: 'fiction-dice' | 'omni-dice') => boolean;
}

export function getBrockTrustGain(totalRounds: number) {
  if (totalRounds === 1) return 15;
  if (totalRounds === 2) return 14;
  if (totalRounds === 3) return 13;
  if (totalRounds === 4) return 12;
  if (totalRounds === 5) return 10;
  if (totalRounds === 6) return 8;
  if (totalRounds === 7) return 6;
  return 5;
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

function buildDrinkingRound(round: number, ac: number, alcoholBefore: number, conMod: number, forcedD20?: number): DrinkingRoundLog {
    let alcohol = alcoholBefore;
    const d20 = forcedD20 ?? rollDie(20);
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

    return {
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
    };
}

function finishDrinkingResult(logs: DrinkingRoundLog[]): DrinkingGameResult {
  const totalRounds = logs[logs.length - 1]?.round ?? 0;
  return {
    totalRounds,
    trustGain: getBrockTrustGain(totalRounds),
    finalDialogue: getBrockFinalDialogue(totalRounds),
    logs,
  };
}

function appendDrinkingRounds(logs: DrinkingRoundLog[], conMod: number, alcohol: number, round: number, ac: number) {
  let currentAlcohol = alcohol;
  let currentRound = round;
  let currentAc = ac;
  while (currentAlcohol > 0) {
    const log = buildDrinkingRound(currentRound, currentAc, currentAlcohol, conMod);
    logs.push(log);
    currentAlcohol = log.alcoholAfter;

    if (currentAlcohol <= 0) break;
    currentRound += 1;
    currentAc = Math.min(MAX_AC, currentAc + AC_STEP);
  }
}

export function playBrockDrinkingGame(conMod: number): DrinkingGameResult {
  const logs: DrinkingRoundLog[] = [];
  appendDrinkingRounds(logs, conMod, INITIAL_ALCOHOL, 1, INITIAL_AC);
  return finishDrinkingResult(logs);
}

export function replaceBrockDrinkingRoll(result: DrinkingGameResult, logIndex: number, d20: number, conMod: number) {
  if (!Number.isInteger(d20) || d20 < 1 || d20 > 20) throw new Error('D20 点数必须在 1 到 20 之间');
  const original = result.logs[logIndex];
  if (!original) return result;
  const logs = result.logs.slice(0, logIndex);
  const replacement = buildDrinkingRound(original.round, original.ac, original.alcoholBefore, conMod, d20);
  logs.push(replacement);
  if (replacement.alcoholAfter > 0) {
    appendDrinkingRounds(logs, conMod, replacement.alcoholAfter, replacement.round + 1, Math.min(MAX_AC, replacement.ac + AC_STEP));
  }
  return finishDrinkingResult(logs);
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
    body: '第一回合 AC5。每回合结束后，如果酒还没喝完，AC +2，最高到 AC16。\n\n越拖到后面，酒劲越冲，体质豁免越难通过。',
  },
  {
    title: '喝酒与自然20',
    badge: '1D4酒量骰',
    placement: 'center',
    body: '体质豁免成功后，投 1D4，当前酒量减少对应点数。\n\n如果体质豁免投出自然20，直接把酒喝见底，游戏立即结束，不再投 1D4。',
  },
];

function createSkillDice(log: DrinkingRoundLog): DiceResult {
  return {
    type: 'skill_check',
    data: {
      掷骰: `D20=${log.d20}`,
      加值: log.conMod,
      属性加值: log.conMod,
      熟练加值: 0,
      六维: '体质',
      总计: log.total,
      DC: log.ac,
      成功: log.success,
      大成功: log.natural20,
      大失败: log.d20 === 1,
      属性: '体质豁免',
    },
  };
}

function createDrinkDice(log: DrinkingRoundLog): DiceResult | null {
  if (log.drinkRoll == null) return null;
  return {
    type: 'dice_test',
    data: {
      骰子: `1D4`,
      结果: String(log.drinkRoll),
      总计: log.drinkRoll,
      全部掷骰: [log.drinkRoll],
      属性: '酒量骰',
    },
  };
}

function resultTone(trustGain: number) {
  if (trustGain >= 10) return 'excellent';
  if (trustGain >= 5) return 'steady';
  if (trustGain > 0) return 'strained';
  return 'rough';
}

function fallbackBrockRoundComment(log: DrinkingRoundLog) {
  if (log.natural20) return '「……一口见底？哈！这杯子今天算是撞见硬茬了。」';
  if (log.success && (log.drinkRoll ?? 0) >= 3) return '「够狠，喉咙没打哆嗦，手也没抖。孢海里就该有这口气。」';
  if (log.success) return '「行，至少酒进去了。别急，下一口才开始咬人。」';
  if (log.d20 === 1) return '「咳成这样还坐得住？有骨气，但别把桌子也喷了。」';
  return '「被酒气顶回来了吧？别装没事，我这酒可不哄人。」';
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

export function DrinkingDiceGame({
  onBack,
  onComplete,
  playerCon = 15,
  fictionQuantity = 0,
  omniQuantity = 0,
  onConsumeRerollItem,
}: DrinkingDiceGameProps) {
  const conMod = conModifier(playerCon);
  const [result, setResult] = useState<DrinkingGameResult | null>(null);
  const [visibleRounds, setVisibleRounds] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [currentDice, setCurrentDice] = useState<DiceResult | null>(null);
  const pendingDrinkDiceRef = useRef<DiceResult | null>(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [brockComment, setBrockComment] = useState('「先说好，铁锅烈酒不讲礼貌。你要是倒了，我只笑三声。」');
  const [rerolledRounds, setRerolledRounds] = useState<Set<number>>(() => new Set());
  const [rerollComparison, setRerollComparison] = useState<{ initial: number; reroll: number; selected: 'initial' | 'reroll' } | undefined>();

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
    pendingDrinkDiceRef.current = null;
    setRerolledRounds(new Set());
    setRerollComparison(undefined);
    setBrockComment('「杯子端稳。喝酒看起来简单，能不能站着下孢海才是正事。」');
  }

  function revealNextRound() {
    if (!result || rolling || isComplete) return;
    const log = result.logs[visibleRounds];
    if (!log) return;
    setRolling(true);
    // 阶段1：体质豁免 D20（关闭后自动展示 1D4 酒量骰）
    pendingDrinkDiceRef.current = log.success ? createDrinkDice(log) : null;
    setRerollComparison(undefined);
    setCurrentDice(createSkillDice(log));
  }

  function applyReroll(itemId: 'fiction-dice' | 'omni-dice', chosenD20?: number) {
    if (!result || currentDice?.type !== 'skill_check') return;
    const logIndex = visibleRounds;
    const original = result.logs[logIndex];
    if (!original || rerolledRounds.has(original.round)) return;
    const reroll = itemId === 'fiction-dice' ? rollDie(20) : Math.max(1, Math.min(20, Math.floor(chosenD20 ?? 20)));
    const selectedRoll = itemId === 'fiction-dice' ? Math.max(original.d20, reroll) : reroll;
    if (!onConsumeRerollItem?.(itemId)) return;

    const nextResult = selectedRoll === original.d20
      ? result
      : replaceBrockDrinkingRoll(result, logIndex, selectedRoll, conMod);
    const nextLog = nextResult.logs[logIndex];
    setResult(nextResult);
    setRerolledRounds((current) => new Set(current).add(original.round));
    setRerollComparison({ initial: original.d20, reroll, selected: selectedRoll === original.d20 ? 'initial' : 'reroll' });
    pendingDrinkDiceRef.current = nextLog.success ? createDrinkDice(nextLog) : null;
    setCurrentDice(createSkillDice(nextLog));
    setBrockComment(itemId === 'fiction-dice'
      ? `「虚构骰子给了你 ${reroll} 点，规矩照旧——只认更高的那个。」`
      : `「万能骰子定成 ${selectedRoll} 点？行，骰子认你，酒可不一定认。」`);
  }

  function finishRound(log: DrinkingRoundLog) {
    if (!result) return;
    setVisibleRounds((value) => Math.min(result.logs.length, value + 1));
    setRolling(false);
    const fallback = fallbackBrockRoundComment(log);
    setBrockComment(fallback);
    fetchMiniGameCommentary('brock', 'drinking_round_end', {
      round: log.round,
      ac: log.ac,
      d20: log.d20,
      con_mod: log.conMod,
      total: log.total,
      success: log.success,
      natural20: log.natural20,
      drink_roll: log.drinkRoll,
      alcohol_before: log.alcoholBefore,
      alcohol_after: log.alcoholAfter,
    }).then((line) => {
      if (line) setBrockComment(line);
    });
  }

  // 骰子关闭时：若还有待展示的酒量骰则接力展示
  function handleDiceClose() {
    const pending = pendingDrinkDiceRef.current;
    pendingDrinkDiceRef.current = null;
    if (pending) {
      setCurrentDice(pending);
    } else {
      setCurrentDice(null);
      if (result && visibleRounds < result.logs.length) {
        finishRound(result.logs[visibleRounds]);
      }
    }
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
            <small>酒量10 · 起始AC5 · 每回合AC+2 · 自然20直接见底</small>
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
                  <b>{lastLog.natural20 ? '自然20！直接见底' : lastLog.success ? '豁免成功' : '豁免失败'}</b>
                  <span>D20={lastLog.d20} + {lastLog.conMod}（【体质】加值）= {lastLog.total} / AC{lastLog.ac}</span>
                  {lastLog.drinkRoll != null && <small>酒量骰 1D4={lastLog.drinkRoll}，酒量 {lastLog.alcoholBefore} → {lastLog.alcoholAfter}</small>}
                  {lastLog.natural20 && <small>自然20，酒量直接归零</small>}
                  {!lastLog.success && <small>本回合未喝下，酒量不变</small>}
                </div>
              )}
              <div className="brock-ai-comment">
                <span>布洛克</span>
                <p>{brockComment}</p>
              </div>
            </section>

            {isComplete && result && (
              <section className={`brock-drink-final ${tone}`}>
                <span>{result.totalRounds} 回合完成</span>
                <strong>布洛克信任 +{result.trustGain}</strong>
                <p>{result.finalDialogue}</p>
                <button type="button" className="tavern-tool-btn primary" onClick={finish}>
                  结算并返回剧情
                </button>
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

      <DiceRollOverlay
        dice={currentDice}
        dieType={currentDice?.type === 'dice_test' ? 'd4' : 'd20'}
        onClose={handleDiceClose}
        rerollDecision={currentDice?.type === 'skill_check' ? {
          fictionQuantity,
          omniQuantity,
          rerollUsed: Boolean(result?.logs[visibleRounds] && rerolledRounds.has(result.logs[visibleRounds].round)),
          onConfirm: handleDiceClose,
          onUseFiction: () => applyReroll('fiction-dice'),
          onUseOmni: (value) => applyReroll('omni-dice', value),
        } : undefined}
        comparisonRolls={rerollComparison}
      />

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
