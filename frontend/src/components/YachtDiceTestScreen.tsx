import { useMemo, useRef, useState, type MutableRefObject } from "react";
import { motion } from "framer-motion";
import { Dice3DView } from "./DiceRollOverlay";

interface YachtDiceTestScreenProps {
  onBack: () => void;
}

type Winner = "player" | "enemy" | "draw";
type SerlynAction = "stealth" | "favor";
type SessionState = "idle" | "prep" | "playing" | "round-settled" | "cashed-out" | "failed";

interface HandScore {
  label: string;
  rank: number;
  score: number;
  detail: string;
  tieBreak: number[];
}

interface CheckResult {
  kind: SerlynAction | "plea";
  roll: number;
  total: number;
  success: boolean;
  rolling: boolean;
  revealCount?: number;
}

interface AdvisorPlan {
  keepMask: boolean[];
  rerollIndexes: number[];
  expectedScore: number;
  winRate?: number;
  headline: string;
  detail: string;
}

const DICE_COUNT = 5;
const BASE_REROLLS = 2;
const EXTRA_REROLL_FROM_FAVOR = 1;
const MAX_ROUNDS = 3;
const ENTRY_FEE = 50;
const STARTING_GOLD = 24340;
const INITIAL_DICE = [1, 2, 3, 4, 5];
const SERLYN_STEALTH_BONUS = 7;
const SERLYN_FAVOR_BONUS = 5;
const PLAYER_PLEA_BONUS = 3;
const STEALTH_DC = 15;
const FAVOR_DC = 14;
const PLEA_DC = 15;
const DEFAULT_PLAYER_KEEP_MASK: boolean[] = Array(DICE_COUNT).fill(true);
const DEFAULT_LOCK_MASK: boolean[] = Array(DICE_COUNT).fill(false);

const HAND_RULES = [
  { label: "快艇", score: "800+", sample: "五颗同点，最高牌型。" },
  { label: "四条", score: "700+", sample: "四颗同点，剩余一颗不计牌型。" },
  { label: "葫芦", score: "600+", sample: "三颗同点 + 一对。" },
  { label: "顺子", score: "500+", sample: "1-2-3-4-5 或 2-3-4-5-6。" },
  { label: "三条", score: "400+", sample: "三颗同点。" },
  { label: "两对", score: "300+", sample: "两组对子。" },
  { label: "一对", score: "200+", sample: "一组对子。" },
  { label: "散牌", score: "100+", sample: "没有组合时，比最高点。" },
];

const OUTCOME_CACHE = new Map<number, number[][]>();

function rollDie(sides: number) {
  return Math.floor(Math.random() * sides) + 1;
}

function rollD6() {
  return rollDie(6);
}

function rollD20() {
  return rollDie(20);
}

function rollFiveDice() {
  return Array.from({ length: DICE_COUNT }, rollD6);
}

function sumDice(dice: number[]) {
  return dice.reduce((sum, value) => sum + value, 0);
}

function countFaces(dice: number[]) {
  return dice.reduce<Record<number, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function sortedDice(dice: number[]) {
  return [...dice].sort((a, b) => b - a);
}

function hasStraight(dice: number[]) {
  const unique = Array.from(new Set(dice)).sort((a, b) => a - b);
  if ([1, 2, 3, 4, 5].every((value) => unique.includes(value))) return 5;
  if ([2, 3, 4, 5, 6].every((value) => unique.includes(value))) return 6;
  return 0;
}

function scoreFrom(rank: number, tieBreak: number[]) {
  return rank * 100 + (tieBreak[0] ?? 0);
}

function evaluateHand(dice: number[]): HandScore {
  const counts = Object.entries(countFaces(dice))
    .map(([face, count]) => ({ face: Number(face), count }))
    .sort((a, b) => b.count - a.count || b.face - a.face);
  const pairs = counts.filter((item) => item.count >= 2).sort((a, b) => b.face - a.face);
  const sorted = sortedDice(dice);
  const straightHigh = hasStraight(dice);

  const yacht = counts.find((item) => item.count === 5);
  if (yacht) {
    const tieBreak = [yacht.face];
    return { label: "快艇", rank: 8, score: scoreFrom(8, tieBreak), detail: `五颗 ${yacht.face} 点`, tieBreak };
  }

  const four = counts.find((item) => item.count === 4);
  if (four) {
    const kicker = sorted.find((value) => value !== four.face) ?? 0;
    const tieBreak = [four.face, kicker];
    return { label: "四条", rank: 7, score: scoreFrom(7, tieBreak), detail: `四颗 ${four.face} 点`, tieBreak };
  }

  const triple = counts.find((item) => item.count === 3);
  const pairForFullHouse = pairs.find((item) => item.face !== triple?.face);
  if (triple && pairForFullHouse) {
    const tieBreak = [triple.face, pairForFullHouse.face];
    return { label: "葫芦", rank: 6, score: scoreFrom(6, tieBreak), detail: `${triple.face} 点三条 + ${pairForFullHouse.face} 点对子`, tieBreak };
  }

  if (straightHigh) {
    const tieBreak = [straightHigh];
    return { label: "顺子", rank: 5, score: scoreFrom(5, tieBreak), detail: straightHigh === 6 ? "2-3-4-5-6" : "1-2-3-4-5", tieBreak };
  }

  if (triple) {
    const kickers = sorted.filter((value) => value !== triple.face);
    const tieBreak = [triple.face, ...kickers];
    return { label: "三条", rank: 4, score: scoreFrom(4, tieBreak), detail: `三颗 ${triple.face} 点`, tieBreak };
  }

  if (pairs.length >= 2) {
    const pairFaces = pairs.slice(0, 2).map((item) => item.face).sort((a, b) => b - a);
    const kicker = sorted.find((value) => !pairFaces.includes(value)) ?? 0;
    const tieBreak = [...pairFaces, kicker];
    return { label: "两对", rank: 3, score: scoreFrom(3, tieBreak), detail: `${pairFaces[0]} 点对子 + ${pairFaces[1]} 点对子`, tieBreak };
  }

  if (pairs.length === 1) {
    const pairFace = pairs[0].face;
    const kickers = sorted.filter((value) => value !== pairFace);
    const tieBreak = [pairFace, ...kickers];
    return { label: "一对", rank: 2, score: scoreFrom(2, tieBreak), detail: `${pairFace} 点对子`, tieBreak };
  }

  const tieBreak = sorted;
  return { label: "散牌", rank: 1, score: scoreFrom(1, tieBreak), detail: `最高 ${sorted[0]} 点，总点数 ${sumDice(dice)}`, tieBreak };
}

function compareHands(player: HandScore, enemy: HandScore) {
  if (player.rank !== enemy.rank) return player.rank > enemy.rank ? 1 : -1;

  const length = Math.max(player.tieBreak.length, enemy.tieBreak.length);
  for (let index = 0; index < length; index += 1) {
    const playerValue = player.tieBreak[index] ?? 0;
    const enemyValue = enemy.tieBreak[index] ?? 0;
    if (playerValue !== enemyValue) return playerValue > enemyValue ? 1 : -1;
  }

  return 0;
}

function outcomeFromCompare(compare: number): Winner {
  if (compare > 0) return "player";
  if (compare < 0) return "enemy";
  return "draw";
}

function longestStraightRun(dice: number[]) {
  const unique = Array.from(new Set(dice)).sort((a, b) => a - b);
  let best: number[] = [];
  let current: number[] = [];

  unique.forEach((value) => {
    if (!current.length || value === current[current.length - 1] + 1) {
      current.push(value);
    } else {
      if (current.length > best.length) best = current;
      current = [value];
    }
  });

  if (current.length > best.length) best = current;
  return best;
}

function chooseEnemyLocks(dice: number[]) {
  const hand = evaluateHand(dice);
  if (hand.rank >= 5) return dice.map(() => true);

  const counts = Object.entries(countFaces(dice))
    .map(([face, count]) => ({ face: Number(face), count }))
    .sort((a, b) => b.count - a.count || b.face - a.face);

  const topGroup = counts[0];
  if (topGroup.count >= 2) return dice.map((value) => value === topGroup.face);

  const run = longestStraightRun(dice);
  if (run.length >= 3) {
    const keptFaces = new Set(run);
    return dice.map((value) => keptFaces.has(value));
  }

  const highest = Math.max(...dice);
  return dice.map((value) => value === highest);
}

function buildResultText(winner: Winner, player: HandScore, enemy: HandScore) {
  if (winner === "draw") return `平局：双方都是 ${player.label}，关键点数完全相同。`;
  if (winner === "player") {
    return player.label === enemy.label ? `我方获胜：同为 ${player.label}，我方关键点数更高。` : `我方获胜：${player.label} 压过敌方 ${enemy.label}。`;
  }
  return player.label === enemy.label ? `敌方获胜：同为 ${enemy.label}，敌方关键点数更高。` : `敌方获胜：敌方 ${enemy.label} 压过我方 ${player.label}。`;
}

function clearTimers(timerRef: MutableRefObject<number[]>) {
  timerRef.current.forEach((timer) => window.clearTimeout(timer));
  timerRef.current = [];
}

function revealCountFromTotal(total: number) {
  if (total >= 24) return 5;
  if (total >= 21) return 4;
  if (total >= 18) return 3;
  return 2;
}

function randomRevealIndexes(count: number) {
  const indexes = [0, 1, 2, 3, 4];
  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [indexes[index], indexes[swapIndex]] = [indexes[swapIndex], indexes[index]];
  }
  return indexes.slice(0, count).sort((a, b) => a - b);
}

function diceOutcomes(count: number) {
  const cached = OUTCOME_CACHE.get(count);
  if (cached) return cached;
  if (count === 0) return [[]];

  const previous = diceOutcomes(count - 1);
  const outcomes: number[][] = [];
  previous.forEach((items) => {
    for (let face = 1; face <= 6; face += 1) {
      outcomes.push([...items, face]);
    }
  });
  OUTCOME_CACHE.set(count, outcomes);
  return outcomes;
}

function projectEnemyHand(enemyDice: number[], revealedIndexes: number[]) {
  if (revealedIndexes.length === 5) return evaluateHand(enemyDice);
  const revealedDice = revealedIndexes.map((index) => enemyDice[index]);
  if (!revealedDice.length) return null;

  const projected = [...revealedDice];
  const counts = Object.entries(countFaces(revealedDice))
    .map(([face, count]) => ({ face: Number(face), count }))
    .sort((a, b) => b.count - a.count || b.face - a.face);
  const bestFace = counts[0]?.face ?? Math.max(...revealedDice);
  while (projected.length < DICE_COUNT) projected.push(bestFace);
  return evaluateHand(projected);
}

function describeEnemyRead(enemyDice: number[], revealedIndexes: number[], settled: boolean) {
  if (settled || revealedIndexes.length === 5) return `敌方完整牌型：${evaluateHand(enemyDice).label}（${evaluateHand(enemyDice).detail}）。`;
  if (!revealedIndexes.length) return "瑟琳还没有拿到敌方骰面情报，建议先按我方期望牌型最大化。";

  const revealedDice = revealedIndexes.map((index) => enemyDice[index]);
  const projected = projectEnemyHand(enemyDice, revealedIndexes);
  return `瑟琳透露第 ${revealedIndexes.map((index) => index + 1).join("、")} 颗：${revealedDice.join(" / ")}。AI推测敌方可能在追 ${projected?.label ?? "高点"}。`;
}

function analyzeBestReroll(playerDice: number[], enemyDice: number[], revealedIndexes: number[], exactEnemy: boolean): AdvisorPlan {
  const targetHand = exactEnemy ? evaluateHand(enemyDice) : projectEnemyHand(enemyDice, revealedIndexes);
  let best: AdvisorPlan | null = null;

  for (let mask = 0; mask < 1 << DICE_COUNT; mask += 1) {
    const keepMask = Array.from({ length: DICE_COUNT }, (_, index) => Boolean(mask & (1 << index)));
    const rerollIndexes = keepMask.map((keep, index) => (!keep ? index : -1)).filter((index) => index >= 0);
    const outcomes = diceOutcomes(rerollIndexes.length);
    let totalScore = 0;
    let wins = 0;

    outcomes.forEach((outcome) => {
      const nextDice = [...playerDice];
      rerollIndexes.forEach((dieIndex, outcomeIndex) => {
        nextDice[dieIndex] = outcome[outcomeIndex];
      });
      const hand = evaluateHand(nextDice);
      totalScore += hand.score;
      if (targetHand && compareHands(hand, targetHand) > 0) wins += 1;
    });

    const expectedScore = totalScore / outcomes.length;
    const winRate = targetHand ? wins / outcomes.length : undefined;
    const rankValue = (winRate ?? 0) * 1000 + expectedScore;
    const bestValue = (best?.winRate ?? 0) * 1000 + (best?.expectedScore ?? 0);

    if (!best || rankValue > bestValue) {
      best = {
        keepMask,
        rerollIndexes,
        expectedScore,
        winRate,
        headline: "",
        detail: "",
      };
    }
  }

  const currentHand = evaluateHand(playerDice);
  const rerollText = best?.rerollIndexes.length ? `建议重掷第 ${best.rerollIndexes.map((index) => index + 1).join("、")} 颗。` : "建议不重掷，直接结算。";
  const targetText = targetHand ? `对照目标约为 ${targetHand.label}，预计胜率 ${Math.round((best?.winRate ?? 0) * 100)}%。` : "敌方信息不足，本轮按期望牌型分最大化。";

  return {
    ...(best ?? {
      keepMask: Array(DICE_COUNT).fill(true),
      rerollIndexes: [],
      expectedScore: currentHand.score,
      winRate: undefined,
      headline: "",
      detail: "",
    }),
    headline: `${rerollText} 当前是 ${currentHand.label}。`,
    detail: `${targetText} 枚举所有可保留方案后，推荐方案的期望牌型分约 ${Math.round(best?.expectedScore ?? currentHand.score)}。`,
  };
}

function buildYachtAtmosphere({
  sessionState,
  roundNumber,
  playerHand,
  enemyHand,
  revealedCount,
  advisorPlan,
  serlynCheck,
  roundWinner,
  rerollsLeft,
}: {
  sessionState: SessionState;
  roundNumber: number;
  playerHand: HandScore;
  enemyHand: HandScore;
  revealedCount: number;
  advisorPlan: AdvisorPlan | null;
  serlynCheck: CheckResult | null;
  roundWinner: Winner | null;
  rerollsLeft: number;
}) {
  if (sessionState === "idle") {
    return "萨洛把骰盅往桌上一扣，笑着等你付入场费。瑟琳没有催促，只在观察老板的手势。";
  }

  if (sessionState === "prep") {
    if (!serlynCheck) {
      return `第 ${roundNumber} 轮开局前，瑟琳看向你，等你决定是偷偷看牌，还是用话术多争取一次机会。`;
    }
    if (serlynCheck.kind === "stealth") {
      return serlynCheck.success
        ? `瑟琳从灯影里退回来，轻声报出她看见的线索：本轮至少能揭开 ${serlynCheck.revealCount ?? 0} 颗敌骰。`
        : "瑟琳指尖按在杯沿上，摇了摇头：老板这次盯得太紧，她不建议继续冒险。";
    }
    return serlynCheck.success
      ? "瑟琳把话题绕到老板年轻时的胜局，老板被哄得松口，赌桌多给你一次重掷。"
      : "老板笑着收回骰盅，瑟琳轻轻叹气：这人情牌没打动他，只能靠牌面说话。";
  }

  if (sessionState === "playing") {
    if (advisorPlan) {
      const pressure = advisorPlan.winRate === undefined ? "敌方情报不足" : `预计胜率 ${Math.round(advisorPlan.winRate * 100)}%`;
      return revealedCount
        ? `瑟琳压低声音补完情报，AI参谋把 ${pressure} 摆在你面前，建议这次别被高点散牌诱惑。`
        : `敌方骰盅仍然盖着，AI参谋只能按期望收益推演；还剩 ${rerollsLeft} 次重掷，先把牌型骨架做出来。`;
    }
    return "骰子还在桌面滚动，萨洛的手指敲着木边，等你决定哪些留下。";
  }

  if (sessionState === "round-settled") {
    if (roundWinner === "player") {
      return `我方 ${playerHand.label} 压住敌方 ${enemyHand.label}。萨洛挑眉看向奖池，等你决定见好就收还是继续翻倍。`;
    }
    if (roundWinner === "enemy") {
      return `敌方 ${enemyHand.label} 反压我方 ${playerHand.label}。瑟琳立刻提醒：现在只剩求情判定能把本局拉回来。`;
    }
    return `双方同为 ${playerHand.label}，赌桌短暂安静下来。老板摊手，示意本轮可以重开。`;
  }

  if (sessionState === "cashed-out") {
    return "你把奖池收进口袋，萨洛吹了声口哨，瑟琳把这场赌局记成了一次还算漂亮的情报演练。";
  }

  return "赌局气氛沉了下去。老板收回骰盅，瑟琳没有责怪你，只提醒下一次要先看清风险。";
}

export function YachtDiceTestScreen({ onBack }: YachtDiceTestScreenProps) {
  const [gold, setGold] = useState(STARTING_GOLD);
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [roundNumber, setRoundNumber] = useState(1);
  const [stake, setStake] = useState(ENTRY_FEE);
  const [playerDice, setPlayerDice] = useState(INITIAL_DICE);
  const [enemyDice, setEnemyDice] = useState(INITIAL_DICE);
  const [playerLocked, setPlayerLocked] = useState<boolean[]>(DEFAULT_PLAYER_KEEP_MASK);
  const [enemyLocked, setEnemyLocked] = useState<boolean[]>(DEFAULT_LOCK_MASK);
  const [revealedEnemyIndexes, setRevealedEnemyIndexes] = useState<number[]>([]);
  const [rollCount, setRollCount] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [serlynCheck, setSerlynCheck] = useState<CheckResult | null>(null);
  const [serlynSkipped, setSerlynSkipped] = useState(false);
  const [bonusRerolls, setBonusRerolls] = useState(0);
  const [pleaCheck, setPleaCheck] = useState<CheckResult | null>(null);
  const [roundWinner, setRoundWinner] = useState<Winner | null>(null);
  const [message, setMessage] = useState("支付 50G 入场费后开始最多三轮的快艇赌局。");
  const timerRef = useRef<number[]>([]);

  const playerHand = useMemo(() => evaluateHand(playerDice), [playerDice]);
  const enemyHand = useMemo(() => evaluateHand(enemyDice), [enemyDice]);
  const maxRerolls = BASE_REROLLS + bonusRerolls;
  const rerollsLeft = rollCount > 0 ? Math.max(0, maxRerolls - (rollCount - 1)) : maxRerolls;
  const roundStarted = rollCount > 0;
  const roundSettled = sessionState === "round-settled";
  const exactEnemyKnown = roundSettled || revealedEnemyIndexes.length === DICE_COUNT;
  const canStartRound = sessionState === "prep" && !rolling && !serlynCheck?.rolling && (Boolean(serlynCheck) || serlynSkipped);
  const canUseAdvisor = sessionState === "playing" && roundStarted && !rolling && !roundSettled;
  const advisorPlan = useMemo(
    () => (canUseAdvisor ? analyzeBestReroll(playerDice, enemyDice, revealedEnemyIndexes, exactEnemyKnown) : null),
    [canUseAdvisor, enemyDice, exactEnemyKnown, playerDice, revealedEnemyIndexes],
  );
  const atmosphereLine = useMemo(
    () =>
      buildYachtAtmosphere({
        sessionState,
        roundNumber,
        playerHand,
        enemyHand,
        revealedCount: revealedEnemyIndexes.length,
        advisorPlan,
        serlynCheck,
        roundWinner,
        rerollsLeft,
      }),
    [advisorPlan, enemyHand, playerHand, revealedEnemyIndexes.length, rerollsLeft, roundNumber, roundWinner, serlynCheck, sessionState],
  );

  function resetRoundState(nextMessage: string) {
    clearTimers(timerRef);
    setPlayerDice(INITIAL_DICE);
    setEnemyDice(INITIAL_DICE);
    setPlayerLocked(DEFAULT_PLAYER_KEEP_MASK);
    setEnemyLocked(DEFAULT_LOCK_MASK);
    setRevealedEnemyIndexes([]);
    setRollCount(0);
    setRolling(false);
    setRevealed(false);
    setSerlynCheck(null);
    setSerlynSkipped(false);
    setBonusRerolls(0);
    setPleaCheck(null);
    setRoundWinner(null);
    setMessage(nextMessage);
  }

  function resetGame() {
    clearTimers(timerRef);
    setGold(STARTING_GOLD);
    setSessionState("idle");
    setRoundNumber(1);
    setStake(ENTRY_FEE);
    resetRoundState("支付 50G 入场费后开始最多三轮的快艇赌局。");
  }

  function enterGame() {
    if (gold < ENTRY_FEE) return;
    setGold((current) => current - ENTRY_FEE);
    setSessionState("prep");
    setRoundNumber(1);
    setStake(ENTRY_FEE);
    resetRoundState("已支付 50G 入场费。每轮开骰前，可以让瑟琳选择潜行偷窥或人情说服，两者只能选一个。");
  }

  function runSerlynCheck(kind: SerlynAction) {
    if (sessionState !== "prep" || serlynCheck?.rolling || serlynCheck || serlynSkipped) return;
    clearTimers(timerRef);
    const roll = rollD20();
    const bonus = kind === "stealth" ? SERLYN_STEALTH_BONUS : SERLYN_FAVOR_BONUS;
    const dc = kind === "stealth" ? STEALTH_DC : FAVOR_DC;
    const total = roll + bonus;
    const success = roll === 20 || (roll !== 1 && total >= dc);
    const revealCount = kind === "stealth" && success ? revealCountFromTotal(total) : 0;

    setSerlynCheck({ kind, roll, total, success, rolling: true, revealCount });
    setMessage(kind === "stealth" ? "瑟琳靠近赌桌阴影，准备潜行偷窥对手骰盅。" : "瑟琳开始和老板套近乎，试图多争取一次重掷机会。");

    const timer = window.setTimeout(() => {
      setSerlynCheck({ kind, roll, total, success, rolling: false, revealCount });
      if (kind === "stealth") {
        setMessage(success ? `潜行成功：${total} 点。开骰后瑟琳会随机透露 ${revealCount} 颗敌方骰子。` : `潜行失败：${total} 点。瑟琳没有暴露，但也没能偷看到牌。`);
      } else {
        setBonusRerolls(success ? EXTRA_REROLL_FROM_FAVOR : 0);
        setMessage(success ? `人情成功：${total} 点。老板松口，本轮额外获得 1 次重掷机会。` : `人情失败：${total} 点。老板笑着摇头，本轮仍然只有 2 次重掷机会。`);
      }
    }, 1150);
    timerRef.current.push(timer);
  }

  function skipSerlynAction() {
    if (sessionState !== "prep" || serlynCheck || serlynSkipped) return;
    setSerlynSkipped(true);
    setMessage("你决定不让瑟琳冒险，本轮直接开骰。");
  }

  function finishRolling(nextMessage: string) {
    const timer = window.setTimeout(() => {
      setRolling(false);
      setRevealed(true);
      setMessage(nextMessage);
    }, 960);
    timerRef.current.push(timer);
  }

  function startRound() {
    if (!canStartRound) return;
    clearTimers(timerRef);
    const nextEnemyDice = rollFiveDice();
    const revealCount = serlynCheck?.kind === "stealth" && serlynCheck.success ? serlynCheck.revealCount ?? 0 : 0;
    setPlayerDice(rollFiveDice());
    setEnemyDice(nextEnemyDice);
    setPlayerLocked(DEFAULT_PLAYER_KEEP_MASK);
    setEnemyLocked(DEFAULT_LOCK_MASK);
    setRevealedEnemyIndexes(revealCount ? randomRevealIndexes(revealCount) : []);
    setRollCount(1);
    setRolling(true);
    setRevealed(false);
    setSessionState("playing");
    setMessage("双方同时开骰。");
    finishRolling(revealCount ? "第一手完成。瑟琳已经把偷看到的敌方骰子告诉你，AI建议已更新。" : "第一手完成。敌方牌面隐藏，AI会先按我方期望牌型给建议。");
  }

  function togglePlayerLock(index: number) {
    if (sessionState !== "playing" || !roundStarted || rolling) return;
    setPlayerLocked((current) => current.map((locked, itemIndex) => (itemIndex === index ? !locked : locked)));
  }

  function applyAdvisorLocks() {
    if (!advisorPlan || !canUseAdvisor) return;
    setPlayerLocked(advisorPlan.keepMask);
    setMessage(`已按AI建议标记重掷骰：第 ${advisorPlan.rerollIndexes.length ? advisorPlan.rerollIndexes.map((index) => index + 1).join("、") : "无"} 颗。未标记骰子默认保留。`);
  }

  function rerollUnlockedDice() {
    if (sessionState !== "playing" || !roundStarted || rolling || rerollsLeft <= 0) return;
    clearTimers(timerRef);
    const nextEnemyLocks = chooseEnemyLocks(enemyDice);
    setEnemyLocked(nextEnemyLocks);
    setPlayerDice((current) => current.map((value, index) => (playerLocked[index] ? value : rollD6())));
    setEnemyDice((current) => current.map((value, index) => (nextEnemyLocks[index] ? value : rollD6())));
    setRollCount((count) => count + 1);
    setRolling(true);
    setRevealed(false);
    setMessage("双方重投已选中的骰子。敌方AI的保留选择只会在被瑟琳透露的位置显现。");
    finishRolling(rerollsLeft - 1 > 0 ? "重投完成。AI建议已根据新牌面重新计算。" : "最后一次重投完成。现在可以结算牌型。");
  }

  function settleHands() {
    if (sessionState !== "playing" || !roundStarted || rolling) return;
    const winner = outcomeFromCompare(compareHands(playerHand, enemyHand));
    setRoundWinner(winner);
    setSessionState("round-settled");
    setRevealedEnemyIndexes([0, 1, 2, 3, 4]);
    setMessage(buildResultText(winner, playerHand, enemyHand));
  }

  function prepareNextRound(nextRound: number, nextStake: number) {
    setRoundNumber(nextRound);
    setStake(nextStake);
    setSessionState("prep");
    resetRoundState(`第 ${nextRound} 轮赌资翻倍为 ${nextStake}G。开骰前重新选择瑟琳行动。`);
  }

  function cashOut() {
    const prize = stake * 2;
    setGold((current) => current + prize);
    setSessionState("cashed-out");
    setMessage(`你收走奖池 ${prize}G，本次快艇赌局结束。`);
  }

  function continueAfterWin() {
    if (roundNumber >= MAX_ROUNDS) {
      cashOut();
      return;
    }
    prepareNextRound(roundNumber + 1, stake * 2);
  }

  function restartDrawRound() {
    setSessionState("prep");
    resetRoundState("平局重开本轮，不消耗额外赌资。开骰前可以重新选择瑟琳行动。");
  }

  function runPleaCheck() {
    if (sessionState !== "round-settled" || roundWinner !== "enemy" || pleaCheck?.rolling || pleaCheck) return;
    clearTimers(timerRef);
    const roll = rollD20();
    const total = roll + PLAYER_PLEA_BONUS;
    const success = roll === 20 || (roll !== 1 && total >= PLEA_DC);
    setPleaCheck({ kind: "plea", roll, total, success, rolling: true });
    setMessage("你向老板求情，试图让这一局重新来过。");

    const timer = window.setTimeout(() => {
      setPleaCheck({ kind: "plea", roll, total, success, rolling: false });
      if (success) {
        setSessionState("prep");
        resetRoundState(`求情成功：D20 ${roll} + ${PLAYER_PLEA_BONUS} = ${total}。老板同意重启本轮。`);
      } else {
        setSessionState("failed");
        setMessage(`求情失败：D20 ${roll} + ${PLAYER_PLEA_BONUS} = ${total}。本次赌局失败，已损失入场费与当前赌资。`);
      }
    }, 1150);
    timerRef.current.push(timer);
  }

  const enemyRead = describeEnemyRead(enemyDice, revealedEnemyIndexes, roundSettled);
  const prize = stake * 2;

  return (
    <main className="yacht-screen">
      <motion.section
        className="yacht-layout"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <header className="test-header yacht-header">
          <div>
            <p className="eyebrow">YACHT STORY DUEL</p>
            <h1>快艇骰子赌局测试</h1>
            <small>入场费 50G，最多三轮。胜后可收走奖池，也可翻倍进入下一轮。</small>
          </div>
          <div className="yacht-header-actions">
            <button type="button" className="ghost-button" onClick={resetGame}>
              重置测试
            </button>
            <button type="button" className="ghost-button" onClick={onBack}>
              返回
            </button>
          </div>
        </header>

        <div className="yacht-game-grid">
          <section className="yacht-play-panel" aria-label="快艇骰子赌局">
            <section className="yacht-bank-panel" aria-label="赌局状态">
              <article>
                <span>金币</span>
                <b>{gold.toLocaleString()}G</b>
              </article>
              <article>
                <span>轮次</span>
                <b>{sessionState === "idle" ? "未入场" : `${roundNumber}/${MAX_ROUNDS}`}</b>
              </article>
              <article>
                <span>当前赌资</span>
                <b>{stake}G</b>
              </article>
              <article>
                <span>本轮奖池</span>
                <b>{prize}G</b>
              </article>
              {sessionState === "idle" && (
                <button type="button" className="start-button" onClick={enterGame} disabled={gold < ENTRY_FEE}>
                  支付 50G 入场
                </button>
              )}
            </section>

            <section className="yacht-serlyn-panel" aria-label="瑟琳开场行动">
              <div>
                <span>瑟琳行动</span>
                <b>每轮开骰前二选一</b>
                <small>
                  潜行成功会随机透露 2-5 颗敌方骰子；人情成功会让老板多给本轮 1 次重掷机会。
                </small>
              </div>
              <Dice3DView
                dieType="d20"
                roll={serlynCheck?.roll ?? null}
                rolling={Boolean(serlynCheck?.rolling)}
                revealed={Boolean(serlynCheck && !serlynCheck.rolling)}
                size={92}
                className="yacht-perception-die"
              />
              <div className="yacht-serlyn-actions">
                <button type="button" className="ghost-button" onClick={() => runSerlynCheck("stealth")} disabled={sessionState !== "prep" || Boolean(serlynCheck) || serlynSkipped}>
                  潜行偷窥
                </button>
                <button type="button" className="ghost-button" onClick={() => runSerlynCheck("favor")} disabled={sessionState !== "prep" || Boolean(serlynCheck) || serlynSkipped}>
                  人情说服
                </button>
                <button type="button" className="ghost-button" onClick={skipSerlynAction} disabled={sessionState !== "prep" || Boolean(serlynCheck) || serlynSkipped}>
                  跳过协助
                </button>
              </div>
              <p>
                {serlynCheck
                  ? `${serlynCheck.kind === "stealth" ? "潜行" : "人情"}：D20 ${serlynCheck.roll} + ${serlynCheck.kind === "stealth" ? SERLYN_STEALTH_BONUS : SERLYN_FAVOR_BONUS} = ${serlynCheck.total}，${serlynCheck.success ? "成功" : "失败"}。`
                  : serlynSkipped
                    ? "本轮未使用瑟琳协助。"
                    : "等待选择瑟琳行动。"}
              </p>
            </section>

            <div className="yacht-status-row">
              <div>
                <span>{sessionState === "round-settled" ? "本轮已结算" : sessionState === "playing" ? "对局进行中" : sessionState === "prep" ? "开场准备" : "赌局状态"}</span>
                <b>
                  投掷 {rollCount || 0}/{maxRerolls + 1} · 重投机会 {rerollsLeft}/{maxRerolls}
                </b>
              </div>
              <strong>{message}</strong>
            </div>

            <div className="yacht-duel-table">
              <DiceHand
                title="敌方：Joker 之王"
                subtitle={roundSettled || revealedEnemyIndexes.length === DICE_COUNT ? `${enemyHand.label} · 牌型分 ${enemyHand.score}` : revealedEnemyIndexes.length ? `瑟琳透露 ${revealedEnemyIndexes.length} 颗` : "牌型未知"}
                dice={enemyDice}
                locked={enemyLocked}
                rolling={rolling}
                visibleIndexes={roundSettled ? [0, 1, 2, 3, 4] : revealedEnemyIndexes}
                diceRevealed={revealed}
                side="enemy"
              />

              <DiceHand
                title="我方：冒险者"
                subtitle={roundStarted ? `${playerHand.label} · 牌型分 ${playerHand.score}` : "等待开骰"}
                dice={playerDice}
                locked={playerLocked}
                rolling={rolling}
                visibleIndexes={roundStarted ? [0, 1, 2, 3, 4] : []}
                diceRevealed={revealed}
                side="player"
                canToggle={sessionState === "playing" && roundStarted && !rolling}
                onToggle={togglePlayerLock}
              />
            </div>

            <section className="yacht-control-row" aria-label="对局操作">
              <button type="button" className="start-button" onClick={roundStarted ? rerollUnlockedDice : startRound} disabled={rolling || sessionState !== "playing" && !canStartRound || (roundStarted && rerollsLeft <= 0)}>
                {roundStarted ? (rerollsLeft > 0 ? "重掷选中骰" : "重掷已用完") : "开始本轮"}
              </button>
              <button type="button" className="ghost-button" onClick={settleHands} disabled={sessionState !== "playing" || !roundStarted || rolling}>
                结算牌型
              </button>
              <p>{enemyRead}</p>
            </section>

            <section className="yacht-advisor-panel" aria-label="AI 推荐">
              <header>
                <span>AI参谋</span>
                <b>根据我方牌型与瑟琳情报枚举计算</b>
              </header>
              {advisorPlan ? (
                <>
                  <p>{advisorPlan.headline}</p>
                  <small>{advisorPlan.detail}</small>
                  <button type="button" className="ghost-button" onClick={applyAdvisorLocks}>
                    按建议选择重掷骰
                  </button>
                </>
              ) : (
                <>
                  <p>开骰后，AI会根据当前牌型、剩余重投次数和已透露敌骰推荐重掷位置。</p>
                  <small>如果瑟琳没有拿到情报，AI会先按我方期望牌型分最大化。</small>
                </>
              )}
              <small className="yacht-atmosphere-line">氛围组：{atmosphereLine}</small>
            </section>

            {roundSettled && (
              <PostRoundPanel
                winner={roundWinner ?? "draw"}
                playerDice={playerDice}
                enemyDice={enemyDice}
                playerHand={playerHand}
                enemyHand={enemyHand}
                stake={stake}
                prize={prize}
                roundNumber={roundNumber}
                maxRounds={MAX_ROUNDS}
                pleaCheck={pleaCheck}
                onCashOut={cashOut}
                onContinue={continueAfterWin}
                onPlea={runPleaCheck}
                onDrawRestart={restartDrawRound}
              />
            )}
          </section>

          <aside className="yacht-side-panel" aria-label="快艇骰子规则">
            <section className="yacht-rank-ladder" aria-label="牌型阶梯">
              <header>
                <span>牌型阶梯</span>
                <small>分数越高越强</small>
              </header>
              {HAND_RULES.map((rule) => (
                <article key={rule.label} className="yacht-rank-row">
                  <b>{rule.label}</b>
                  <strong>{rule.score}</strong>
                  <span>{rule.sample}</span>
                </article>
              ))}
            </section>

            <section className="yacht-rules-panel" aria-label="详细规则说明">
              <h2>赌局规则</h2>
              <ol>
                <li>入场费 50G，最多进行 3 轮。第 1 轮赌资为 50G。</li>
                <li>每轮开骰前，瑟琳可以选择潜行偷窥或人情说服，两者只能选一个。</li>
                <li>潜行成功后，按判定总值随机透露 2-5 颗敌方骰子；人情成功后，本轮额外获得 1 次重掷。</li>
                <li>每轮双方同时投 5D6，默认有 2 次重掷机会。骰子默认保留，玩家点选的骰子会加入重掷队列。</li>
                <li>获胜后可拿走当前奖池结束，也可让赌资翻倍进入下一轮。</li>
                <li>失败后可进行一次求情判定，成功则重启本轮，失败则赌局直接失败。</li>
              </ol>
            </section>
          </aside>
        </div>
      </motion.section>
    </main>
  );
}

function DiceHand({
  title,
  subtitle,
  dice,
  locked,
  rolling,
  visibleIndexes,
  diceRevealed,
  side,
  canToggle = false,
  onToggle,
}: {
  title: string;
  subtitle: string;
  dice: number[];
  locked: boolean[];
  rolling: boolean;
  visibleIndexes: number[];
  diceRevealed: boolean;
  side: "player" | "enemy";
  canToggle?: boolean;
  onToggle?: (index: number) => void;
}) {
  const visibleSet = new Set(visibleIndexes);

  return (
    <section className={`yacht-hand-panel is-${side} ${visibleIndexes.length ? "is-visible" : "is-hidden"}`} aria-label={title}>
      <header>
        <div>
          <span>{side === "enemy" ? "对手" : "我方"}</span>
          <h2>{title}</h2>
        </div>
        <strong>{subtitle}</strong>
      </header>

      <div className="yacht-dice-row">
        {dice.map((value, index) => {
          const isVisible = visibleSet.has(index);
          const dieRevealed = isVisible && (diceRevealed || locked[index]);
          const dieRolling = rolling && !locked[index];
          const isRerollSelected = side === "player" && isVisible && !locked[index];
          const isEnemyLocked = side === "enemy" && locked[index];

          return (
            <button
              key={`${side}-${index}`}
              type="button"
              className={`yacht-die ${isEnemyLocked ? "is-locked" : ""} ${isRerollSelected ? "is-reroll" : ""} ${!isVisible ? "is-hidden" : ""}`}
              onClick={() => onToggle?.(index)}
              disabled={!canToggle}
            >
              <Dice3DView
                dieType="d6"
                roll={isVisible ? value : null}
                rolling={dieRolling}
                revealed={dieRevealed}
                size={118}
                className="yacht-dice-canvas"
                faceStyle="pips"
                showResultBadge={false}
              />
              {!isVisible && <i className="yacht-hidden-mark">?</i>}
              <span>{side === "enemy" ? (isVisible ? (locked[index] ? "敌方保留" : "敌方骰面") : "隐藏") : locked[index] ? "默认保留" : "选中重掷"}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function PostRoundPanel({
  winner,
  playerDice,
  enemyDice,
  playerHand,
  enemyHand,
  stake,
  prize,
  roundNumber,
  maxRounds,
  pleaCheck,
  onCashOut,
  onContinue,
  onPlea,
  onDrawRestart,
}: {
  winner: Winner;
  playerDice: number[];
  enemyDice: number[];
  playerHand: HandScore;
  enemyHand: HandScore;
  stake: number;
  prize: number;
  roundNumber: number;
  maxRounds: number;
  pleaCheck: CheckResult | null;
  onCashOut: () => void;
  onContinue: () => void;
  onPlea: () => void;
  onDrawRestart: () => void;
}) {
  return (
    <section className={`yacht-result-panel is-${winner}`} aria-label="结算结果">
      <h2>{buildResultText(winner, playerHand, enemyHand)}</h2>
      <p>
        我方：{playerDice.join(" / ")} · {playerHand.label}（{playerHand.detail}）· {playerHand.score} 分
      </p>
      <p>
        敌方：{enemyDice.join(" / ")} · {enemyHand.label}（{enemyHand.detail}）· {enemyHand.score} 分
      </p>

      {winner === "player" && (
        <div className="yacht-result-actions">
          <button type="button" className="start-button" onClick={onCashOut}>
            拿走奖池 {prize}G
          </button>
          <button type="button" className="ghost-button" onClick={onContinue}>
            {roundNumber >= maxRounds ? "收走最终奖池" : `翻倍进入下一轮（${stake * 2}G）`}
          </button>
        </div>
      )}

      {winner === "enemy" && (
        <div className="yacht-result-actions">
          <Dice3DView
            dieType="d20"
            roll={pleaCheck?.roll ?? null}
            rolling={Boolean(pleaCheck?.rolling)}
            revealed={Boolean(pleaCheck && !pleaCheck.rolling)}
            size={86}
            className="yacht-perception-die"
          />
          <button type="button" className="ghost-button" onClick={onPlea} disabled={Boolean(pleaCheck)}>
            求情判定
          </button>
          <small>
            {pleaCheck
              ? `D20 ${pleaCheck.roll} + ${PLAYER_PLEA_BONUS} = ${pleaCheck.total}，${pleaCheck.success ? "成功重启本轮" : "失败，赌局结束"}。`
              : `冒险者 魅力 +${PLAYER_PLEA_BONUS} / DC ${PLEA_DC}，成功可重启本轮。`}
          </small>
        </div>
      )}

      {winner === "draw" && (
        <div className="yacht-result-actions">
          <button type="button" className="ghost-button" onClick={onDrawRestart}>
            平局重开本轮
          </button>
        </div>
      )}
    </section>
  );
}
