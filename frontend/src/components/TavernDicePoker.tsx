import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DiceRollOverlay } from './DiceRollOverlay';
import type { TutorialStep } from './TutorialOverlay';
import type { DiceResult } from '../types/game';
import { fetchMiniGameCommentary } from '../services/api';

type Phase = 'prep' | 'skill_result' | 'ready' | 'rolling' | 'play' | 'round_result' | 'plead' | 'final';
type SkillChoice = 'peek' | 'persuade' | 'none';
type RoundOutcome = 'win' | 'tie' | 'lose';

interface HandScore {
  rank: number;
  points: number;
  label: string;
}

interface RoundRecord {
  round: number;
  stake: number;
  result: RoundOutcome;
  playerDice: number[];
  saloDice: number[];
  playerScore: HandScore;
  saloScore: HandScore;
}

export interface TavernDicePokerResult {
  wins: number;
  effectiveWins: number;
  spent: number;
  earnings: number;
  gift: number;
  yunlingUnlocked: boolean;
  paidInfo?: boolean;
  records: RoundRecord[];
}

interface TavernDicePokerProps {
  gold?: number;
  onClose: () => void;
  onComplete?: (result: TavernDicePokerResult) => void;
}

const SELIN_INT = 4;
const SELIN_CHA = 3;
const ROUND_LIMIT = 3;
const BASE_REROLLS = 3;
const SALO_REROLLS_PER_ROUND = 1;
const BASE_STAKE = 50;
const PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function rollDie(sides = 6) {
  return Math.floor(Math.random() * sides) + 1;
}

function rollDice(count: number) {
  return Array.from({ length: count }, () => rollDie());
}

function countDice(dice: number[]) {
  const counts = new Map<number, number>();
  dice.forEach((die) => counts.set(die, (counts.get(die) || 0) + 1));
  return counts;
}

function scoreHand(dice: number[]): HandScore {
  const counts = [...countDice(dice).values()].sort((a, b) => b - a);
  const sorted = [...dice].sort((a, b) => a - b).join('');
  const sum = dice.reduce((total, die) => total + die, 0);

  if (counts[0] === 5) return { rank: 8, points: 800 + sum, label: '五骰同点' };
  if (sorted === '12345' || sorted === '23456') return { rank: 7, points: 700 + sum, label: '大顺' };
  if (counts[0] === 4) return { rank: 6, points: 600 + sum, label: '四骰同点' };
  if (counts[0] === 3 && counts[1] === 2) return { rank: 5, points: 500 + sum, label: '葫芦' };
  if (counts[0] === 3) return { rank: 4, points: 400 + sum, label: '三骰同点' };
  if (counts[0] === 2 && counts[1] === 2) return { rank: 3, points: 300 + sum, label: '两对' };
  if (counts[0] === 2) return { rank: 2, points: 200 + sum, label: '一对' };
  return { rank: 1, points: sum, label: '散点' };
}

function compareHands(playerDice: number[], saloDice: number[]): RoundOutcome {
  const player = scoreHand(playerDice);
  const salo = scoreHand(saloDice);
  if (player.points > salo.points) return 'win';
  if (player.points < salo.points) return 'lose';
  return 'tie';
}

function chooseKeepIndexes(dice: number[]) {
  const counts = [...countDice(dice).entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  const [bestValue, bestCount] = counts[0] ?? [6, 1];
  if (bestCount >= 2) return dice.map((die, index) => (die === bestValue ? index : -1)).filter((index) => index >= 0);

  const high = dice.map((die, index) => (die >= 5 ? index : -1)).filter((index) => index >= 0);
  if (high.length) return high;
  const max = Math.max(...dice);
  return [dice.findIndex((die) => die === max)];
}

function improveOpponentHand(dice: number[]) {
  const keep = new Set(chooseKeepIndexes(dice));
  return dice.map((die, index) => (keep.has(index) ? die : rollDie()));
}

function getPeekCount(total: number) {
  if (total < 10) return 0;
  if (total <= 12) return 1;
  if (total <= 15) return 2;
  if (total <= 18) return 3;
  if (total <= 20) return 4;
  return 5;
}

function getPersuadeBonus(total: number) {
  if (total < 13) return 0;
  if (total <= 16) return 1;
  return 2;
}

function formatDice(dice: number[]) {
  return dice.join(' ');
}

function buildAdvice(playerDice: number[], visibleSaloDice: Array<number | null>, rerollsLeft: number) {
  if (!playerDice.length) return '点击开始投掷后，瑟琳会根据你的骰面与已透露的萨洛骰面给出建议。';

  const score = scoreHand(playerDice);
  const keep = chooseKeepIndexes(playerDice);
  const keepText = keep.map((index) => `第${index + 1}枚`).join('、');
  const visible = visibleSaloDice.filter((die): die is number => die !== null);
  const saloText = visible.length
    ? `已知萨洛骰面：${visible.join('、')}。`
    : '萨洛的未透露骰面仍不可见。';

  if (rerollsLeft <= 0) return `${saloText} 你现在是${score.label}，重投次数已用完，建议直接提交。`;
  if (score.rank >= 5) return `${saloText} 你现在是${score.label}，牌型已经很强，建议保留全部或只谨慎重投一枚低点骰。`;
  if (score.rank >= 3) return `${saloText} 你现在是${score.label}，建议保留成型骰和高点骰，尝试冲三同、四同或葫芦。`;
  return `${saloText} 你现在是${score.label}，建议保留${keepText || '最高点'}，重投其余骰子寻找对子或顺子。`;
}

function diceIndexText(indexes: number[]) {
  if (!indexes.length) return '无';
  return indexes.map((index) => `第${index + 1}枚`).join('、');
}

function fallbackSerinAdvice(playerDice: number[], visibleSaloDice: Array<number | null>, rerollsLeft: number) {
  if (!playerDice.length) return '「先等骰面落稳。我会看你和萨洛露出的点数，再判断怎么保留。」';
  const keep = chooseKeepIndexes(playerDice);
  const reroll = playerDice.map((_die, index) => index).filter((index) => !keep.includes(index));
  const score = scoreHand(playerDice);
  const visible = visibleSaloDice.filter((die): die is number => die !== null);
  if (rerollsLeft <= 0) return `「没有重投次数了。现在是${score.label}，直接提交，别把确定的点数交给运气。」`;
  if (score.rank >= 5) return `「${score.label}已经够强。保留全部；若一定要赌，只重投最低的一枚。」`;
  const salo = visible.length ? `萨洛露出的点数是${visible.join('、')}。` : '萨洛还藏着大半骰面。';
  return `「${salo}保留${diceIndexText(keep)}，重投${diceIndexText(reroll)}，先把${score.label}往更高牌型推。」`;
}

function createSkillDice(label: string, roll: number, bonus: number, dc: number, success: boolean): DiceResult {
  return {
    type: 'skill_check',
    data: {
      骰子: 'D20',
      掷骰: `D20=${roll}`,
      加值: bonus,
      总计: roll + bonus,
      DC: dc,
      成功: success,
      属性: label,
    },
  };
}

function DieFace({
  value,
  hidden = false,
  selected = false,
  rolling = false,
  disabled = false,
  onClick,
}: {
  value?: number;
  hidden?: boolean;
  selected?: boolean;
  rolling?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  const shownValue = value ?? 1;
  return (
    <button
      type="button"
      className={`tavern-die ${selected ? 'selected' : ''} ${hidden ? 'hidden' : ''} ${rolling ? 'rolling' : ''}`}
      disabled={disabled || hidden || !onClick}
      onClick={onClick}
      aria-label={hidden ? '隐藏骰面' : `${shownValue}点`}
    >
      {hidden ? (
        <span className="tavern-die-hidden">?</span>
      ) : (
        <span className="tavern-die-grid">
          {Array.from({ length: 9 }, (_, index) => (
            <i key={index} className={PIPS[shownValue]?.includes(index) ? 'filled' : ''} />
          ))}
        </span>
      )}
    </button>
  );
}

function RulePanel() {
  return (
    <aside className="tavern-rule-panel">
      <h3>规则说明</h3>
      <p>三局为限，每局先下注50G。你每局初始有3次重投机会，萨洛每局只会跟随调整1次。</p>
      <p>透视与说服各只能使用一次。透视只显示已成功看见的萨洛骰面，未透露骰面不会参与建议。</p>
      <p>胜1局获得三位队友情报。胜2局或3局，额外获得100G与云苓情报。</p>
    </aside>
  );
}

const TAVERN_DICE_TUTORIAL: TutorialStep[] = [
  {
    title: '基本规则',
    body: '每局你和萨洛各掷五枚骰子。你可以重投任意骰子（最多3次，说服成功增加次数），萨洛每局只会跟随调整1次，最终提交一副5骰牌型与萨洛比大小。牌型越高、单骰点数越大，总分越高。',
    badge: '快艇骰子',
  },
  {
    title: '瑟琳技能① · 透视',
    body: '每场游戏限用一次。瑟琳对你使用D20检定（INT+3 vs DC10），成功后可看见萨洛部分骰面：≤9=0枚，10~12=1枚，13~15=2枚，16~18=3枚，19~20=4枚，≥20大成功=5枚全揭示。已知骰面会帮助瑟琳提出更精准的策略建议。',
    badge: 'INT DC10',
  },
  {
    title: '瑟琳技能② · 说服',
    body: '每场游戏限用一次。瑟琳对萨洛使用魅力检定（CHA+1 vs DC13），成功可为当前局争取额外重投次数：≤12=0次，13~16=+1次，17+=+2次。大成功则翻倍生效。',
    badge: 'CHA DC13',
  },
  {
    title: '牌型一览（低→高）',
    body: '散点：无组合，纯点数总和。\n一对（如 2·2·3·5·6）：200分+总和。\n两对（如 2·2·4·4·6）：300分+总和。\n三同点（如 3·3·3·1·5）：400分+总和。\n葫芦·三同+一对（如 3·3·3·5·5）：500分+总和。\n四同点（如 4·4·4·4·2）：600分+总和。\n大顺·1~5或2~6（如 1·2·3·4·5）：700分+总和。\n五同点（如 6·6·6·6·6）：800分+总和。',
    badge: '牌型',
  },
  {
    title: '高分策略',
    body: '优先保留已有的对子/三同，重投散点。两对时可冲葫芦（留两对中最高的）、三同时可冲四同或葫芦。顺子听牌（如1·2·3·4·X）值得赌。如果瑟琳透视到萨洛牌型很强，可优先用说服争取重投次数再冲刺。每局重投有限，提交前务必确认是否还有提升空间。',
    badge: '策略',
  },
];

export function TavernDicePoker({ gold = 200, onComplete }: TavernDicePokerProps) {
  const [phase, setPhase] = useState<Phase>('prep');
  const [round, setRound] = useState(1);
  const [stake, setStake] = useState(BASE_STAKE);
  const [spent, setSpent] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [wins, setWins] = useState(0);
  const [peekUsed, setPeekUsed] = useState(false);
  const [persuadeUsed, setPersuadeUsed] = useState(false);
  const [pleadUsed, setPleadUsed] = useState(false);
  const [peekCount, setPeekCount] = useState(0);
  const [persuadeBonus, setPersuadeBonus] = useState(0);
  const [rerollsLeft, setRerollsLeft] = useState(BASE_REROLLS);
  const [saloRerollsLeft, setSaloRerollsLeft] = useState(SALO_REROLLS_PER_ROUND);
  const [playerDice, setPlayerDice] = useState<number[]>([]);
  const [saloDice, setSaloDice] = useState<number[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [records, setRecords] = useState<RoundRecord[]>([]);
  const [message, setMessage] = useState('萨洛把五枚骨白色骰子推到桌面中央。每局下注50G，三局为限。赢一局，他说出三名队友的完整情报；赢两局以上，他还会追加一条黑市药剂商的线索。');
  const [skillDice, setSkillDice] = useState<DiceResult | null>(null);
  const [rolling, setRolling] = useState(false);
  const [final, setFinal] = useState<TavernDicePokerResult | null>(null);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [serinAdvice, setSerinAdvice] = useState('「等骰子落稳。我会告诉你哪些该留，哪些该重新交给运气。」');

  const visibleSaloDice = useMemo(
    () => saloDice.map((die, index) => (index < peekCount ? die : null)),
    [saloDice, peekCount],
  );
  const advice = useMemo(
    () => buildAdvice(playerDice, visibleSaloDice, rerollsLeft),
    [playerDice, rerollsLeft, visibleSaloDice],
  );
  const lastRecord = records[records.length - 1];
  const availableGold = gold - spent + earnings;
  const projectedGold = availableGold - (phase === 'prep' || phase === 'skill_result' || phase === 'ready' ? stake : 0);
  const canAffordRound = projectedGold >= 0;
  const canBuyInfo = availableGold >= 50;

  function resetRoundState(nextRound: number, nextStake: number) {
    setRound(nextRound);
    setStake(nextStake);
    setPeekCount(0);
    setPersuadeBonus(0);
    setRerollsLeft(BASE_REROLLS);
    setSaloRerollsLeft(SALO_REROLLS_PER_ROUND);
    setPlayerDice([]);
    setSaloDice([]);
    setSelected(new Set());
    setPhase('prep');
    setMessage(`第${nextRound}局准备开始。萨洛敲了敲桌面，示意先把${nextStake}G押到桌上。`);
  }

  function useSkill(choice: SkillChoice) {
    if (choice === 'none') {
      setPeekCount(0);
      setPersuadeBonus(0);
      setPhase('ready');
      setMessage('瑟琳收回银杖，轻声说：「那就按普通规则来。我会只根据你能看到的骰面给建议。」');
      return;
    }

    const roll = rollDie(20);

    if (choice === 'peek') {
      const total = roll + SELIN_INT;
      const revealed = getPeekCount(total);
      setPeekUsed(true);
      setPeekCount(revealed);
      setSkillDice(createSkillDice('瑟琳透视', roll, SELIN_INT, 10, revealed > 0));
      setPhase('skill_result');
      if (revealed === 0) {
        setMessage(`D20=${roll}+${SELIN_INT}=${total}。瑟琳低声说：「老板盯得紧，这一局我无法获得任何信息。」`);
      } else if (revealed === 5) {
        setMessage(`D20=${roll}+${SELIN_INT}=${total}。瑟琳眼底银光一闪：「大成功，我能看到萨洛的所有骰子。」`);
      } else {
        setMessage(`D20=${roll}+${SELIN_INT}=${total}。瑟琳贴近你耳侧：「我能看清萨洛的${revealed}枚骰子，其余还被杯影挡着。」`);
      }
      window.setTimeout(() => setPhase('ready'), 1000);
      return;
    }

    const total = roll + SELIN_CHA;
    const bonus = getPersuadeBonus(total);
    setPersuadeUsed(true);
    setPersuadeBonus(bonus);
    setSkillDice(createSkillDice('瑟琳说服', roll, SELIN_CHA, 13, bonus > 0));
    setPhase('skill_result');
    if (bonus === 0) {
      setMessage(`D20=${roll}+${SELIN_CHA}=${total}。萨洛笑着摇头：「规矩就是规矩，银杖小姐。」`);
    } else if (bonus === 1) {
      setMessage(`D20=${roll}+${SELIN_CHA}=${total}。萨洛挑眉：「行，看在银杖的面子上，多给你一次机会。」`);
    } else {
      setMessage(`D20=${roll}+${SELIN_CHA}=${total}。萨洛微微摇了摇头：「看在银杖的面子上，多给你两次机会吧。」`);
    }
    window.setTimeout(() => setPhase('ready'), 1000);
  }

  function startRound() {
    if (!canAffordRound || rolling) return;
    setSpent((value) => value + stake);
    setRerollsLeft(BASE_REROLLS + persuadeBonus);
    setSaloRerollsLeft(SALO_REROLLS_PER_ROUND);
    setSelected(new Set());
    setPlayerDice([]);
    setSaloDice([]);
    setRolling(true);
    setPhase('rolling');
    setMessage(`第${round}局下注${stake}G。你和萨洛同时扣下骰杯，木桌下方传来沉闷的滚动声。`);
    window.setTimeout(() => {
      setPlayerDice(rollDice(5));
      setSaloDice(rollDice(5));
      setRolling(false);
      setPhase('play');
    }, 900);
  }

  function toggleDie(index: number) {
    if (phase !== 'play' || rolling) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function rerollUnselected() {
    if (phase !== 'play' || rerollsLeft <= 0 || rolling) return;
    const kept = new Set(selected);
    setRolling(true);
    const saloWillReroll = saloRerollsLeft > 0;
    setMessage(saloWillReroll
      ? '你把未保留的骰子重新扣进杯里。萨洛也眯起眼，挑走几枚骰子重投。'
      : '你把未保留的骰子重新扣进杯里。萨洛按住自己的骰杯，没有继续追你的节奏。');
    window.setTimeout(() => {
      setPlayerDice((dice) => dice.map((die, index) => (kept.has(index) ? die : rollDie())));
      setSaloDice((dice) => (saloWillReroll ? improveOpponentHand(dice) : dice));
      if (saloWillReroll) setSaloRerollsLeft((value) => Math.max(0, value - 1));
      setRerollsLeft((value) => value - 1);
      setSelected(new Set());
      setRolling(false);
    }, 760);
  }

  function submitRound() {
    if (!playerDice.length || !saloDice.length) return;
    const result = compareHands(playerDice, saloDice);
    const playerScore = scoreHand(playerDice);
    const saloScore = scoreHand(saloDice);
    const nextWins = result === 'win' ? wins + 1 : wins;
    const record: RoundRecord = { round, stake, result, playerDice, saloDice, playerScore, saloScore };
    setWins(nextWins);
    setRecords((prev) => [...prev, record]);
    setPhase('round_result');
    setMessage(result === 'win'
      ? `你以「${playerScore.label}」压过萨洛的「${saloScore.label}」。萨洛吹了声短哨，把你的赢注推回桌边。`
      : result === 'tie'
        ? `你和萨洛同为「${playerScore.label}」。萨洛摊开手：「平局不算赢，但也不算难看。」`
        : `你的「${playerScore.label}」输给萨洛的「${saloScore.label}」。他把骰子一颗颗排齐，笑得很慢。`);
  }

  function finishGame(
    rawWins: number,
    options: { extraSpent?: number; paidInfo?: boolean; extraEarnings?: number; effectiveWins?: number } = {},
  ) {
    const paidInfo = Boolean(options.paidInfo);
    const finalEarnings = earnings + (options.extraEarnings ?? 0);
    const effectiveWins = Math.max(rawWins, options.effectiveWins ?? 0, paidInfo ? 1 : 0);
    const gift = rawWins >= 2 ? 100 : 0;
    const result: TavernDicePokerResult = {
      wins: rawWins,
      effectiveWins,
      spent: spent + (options.extraSpent ?? 0),
      earnings: finalEarnings,
      gift,
      paidInfo,
      yunlingUnlocked: rawWins >= 2,
      records,
    };
    setFinal(result);
    setPhase('final');
    setMessage(rawWins >= 2
      ? '萨洛承认你赢得漂亮。除了三名队友的情报，他还拍出100G见面礼，并压低声音提到黑市深处的药剂商云苓。'
      : effectiveWins >= 1
        ? '萨洛收起骰子，承认这局情报交易可以按一胜结算。三名队友的信息会给，但云苓的额外线索仍然只属于真正赢下两局以上的人。'
      : '萨洛收起骰子。无论输赢，情报都会给，只是这张桌子会记住你们今晚的手气。');
  }

  function continueAfterRound(doubleStake: boolean) {
    if (round >= ROUND_LIMIT) {
      if (wins > 0) finishGame(wins);
      else setPhase('plead');
      return;
    }
    resetRoundState(round + 1, doubleStake ? stake * 2 : BASE_STAKE);
  }

  function continueAfterWin(doubleStake: boolean) {
    const payout = stake * 2;
    setEarnings((value) => value + payout);
    if (round >= ROUND_LIMIT) {
      finishGame(wins, { extraEarnings: payout });
      return;
    }
    resetRoundState(round + 1, doubleStake ? stake * 2 : BASE_STAKE);
  }

  function plead() {
    if (pleadUsed) return;
    setPleadUsed(true);
    const roll = rollDie(20);
    const total = roll + SELIN_CHA;
    const success = total > 15;
    setSkillDice(createSkillDice('瑟琳求情', roll, SELIN_CHA, 15, success));
    if (success) {
      setMessage(`D20=${roll}+${SELIN_CHA}=${total}。瑟琳没有替你们找借口，只提醒萨洛：下孢海的人少一个都可能回不来。萨洛沉默片刻，算你们取得一次有效情报胜利。`);
      window.setTimeout(() => finishGame(0, { effectiveWins: 1 }), 900);
    } else {
      setMessage(`D20=${roll}+${SELIN_CHA}=${total}。萨洛摇头：「规矩不能每次都软。」你们只能花50G购买情报。`);
    }
  }

  const canStart = phase === 'ready' || phase === 'skill_result';

  useEffect(() => {
    if (phase !== 'play' || rolling || !playerDice.length) return;
    const keep = chooseKeepIndexes(playerDice);
    const reroll = playerDice.map((_die, index) => index).filter((index) => !keep.includes(index));
    const fallback = fallbackSerinAdvice(playerDice, visibleSaloDice, rerollsLeft);
    setSerinAdvice(fallback);
    let cancelled = false;
    fetchMiniGameCommentary('serin', 'tavern_dice_advice', {
      player_dice: playerDice,
      visible_salo_dice: visibleSaloDice,
      rerolls_left: rerollsLeft,
      current_score: scoreHand(playerDice),
      recommended_keep_indices: keep,
      recommended_reroll_indices: reroll,
      local_advice: advice,
    }).then((line) => {
      if (!cancelled && line) setSerinAdvice(line);
    });
    return () => {
      cancelled = true;
    };
  }, [advice, phase, playerDice, rerollsLeft, rolling, visibleSaloDice]);

  return (
    <>
      {/* 强制教程：进入游戏前必须阅读完整规则（沿用新手战斗教学UI风格） */}
      {!tutorialCompleted && (
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
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="opening-action-tutorial-progress">
              <i style={{ width: `${((tutorialStep + 1) / TAVERN_DICE_TUTORIAL.length) * 100}%` }} />
            </div>
            <header>
              <span>{TAVERN_DICE_TUTORIAL[tutorialStep]?.badge}</span>
              <button type="button" aria-label="关闭规则教程" onClick={() => setTutorialCompleted(true)}>×</button>
            </header>
            <h2>{TAVERN_DICE_TUTORIAL[tutorialStep]?.title}</h2>
            <p>{TAVERN_DICE_TUTORIAL[tutorialStep]?.body}</p>
            <footer>
              <button
                type="button"
                className="opening-action-tutorial-prev"
                disabled={tutorialStep <= 0}
                onClick={() => setTutorialStep((s) => Math.max(0, s - 1))}
              >
                上一步
              </button>
              <small>{tutorialStep + 1} / {TAVERN_DICE_TUTORIAL.length}</small>
              <button
                type="button"
                className="opening-action-tutorial-next"
                onClick={() => {
                  if (tutorialStep >= TAVERN_DICE_TUTORIAL.length - 1) {
                    setTutorialCompleted(true);
                  } else {
                    setTutorialStep((s) => s + 1);
                  }
                }}
              >
                {tutorialStep >= TAVERN_DICE_TUTORIAL.length - 1 ? '开始游戏' : '下一步'}
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}

      {/* 游戏本体：教程完成后显示 */}
      {tutorialCompleted && (
    <motion.div
      className="tavern-dice-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.section
        className="tavern-dice-modal"
        role="dialog"
        aria-modal="true"
        aria-label="回声酒馆快艇骰子"
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
      >
        <header className="tavern-dice-header">
          <div>
            <span>回声酒馆 · 快艇骰子</span>
            <small>第 {round}/3 局 · 已胜 {wins} 局 · 当前下注 {stake}G</small>
          </div>
        </header>

        <div className="tavern-dice-board">
          <div className="tavern-action-zone">
            {phase === 'prep' && (
              <>
                <button type="button" className="tavern-tool-btn" disabled={peekUsed || !canAffordRound} onClick={() => useSkill('peek')}>
                  使用透视
                </button>
                <button type="button" className="tavern-tool-btn" disabled={persuadeUsed || !canAffordRound} onClick={() => useSkill('persuade')}>
                  说服萨洛
                </button>
                <button type="button" className="tavern-tool-btn primary" disabled={!canAffordRound} onClick={() => useSkill('none')}>
                  不使用技能
                </button>
              </>
            )}

            {(phase === 'ready' || phase === 'skill_result') && (
              <button type="button" className="tavern-tool-btn primary" disabled={!canStart || !canAffordRound} onClick={startRound}>
                开始对局
              </button>
            )}

            {(phase === 'rolling' || phase === 'play') && (
              <>
                <button type="button" className="tavern-tool-btn" disabled={rolling || rerollsLeft <= 0} onClick={rerollUnselected}>
                  重投未保留骰 ({rerollsLeft})
                </button>
                <button type="button" className="tavern-tool-btn primary" disabled={rolling || !playerDice.length} onClick={submitRound}>
                  提交骰面
                </button>
              </>
            )}

            {phase === 'round_result' && lastRecord && (
              lastRecord.result === 'win' ? (
                <>
                  <button type="button" className="tavern-tool-btn primary" onClick={() => continueAfterWin(false)}>
                    {round >= ROUND_LIMIT ? '查看结算' : '进入下一局'}
                  </button>
                  {round < ROUND_LIMIT && (
                    <button type="button" className="tavern-tool-btn" onClick={() => continueAfterWin(true)}>
                      翻倍下一局
                    </button>
                  )}
                </>
              ) : (
                <button type="button" className="tavern-tool-btn primary" onClick={() => continueAfterRound(false)}>
                  {round >= ROUND_LIMIT ? '查看结算' : '进入下一局'}
                </button>
              )
            )}

            {phase === 'plead' && (
              <>
                <button type="button" className="tavern-tool-btn primary" disabled={pleadUsed} onClick={plead}>
                  让瑟琳求情
                </button>
                <button type="button" className="tavern-tool-btn" disabled={!canBuyInfo} onClick={() => finishGame(0, { extraSpent: 50, paidInfo: true })}>
                  花50G买情报
                </button>
              </>
            )}

            {phase === 'final' && final && (
              <button type="button" className="tavern-tool-btn primary" onClick={() => onComplete?.(final)}>
                结算并返回剧情
              </button>
            )}
          </div>

          <main className="tavern-table-zone">
            <section className="tavern-dice-lane">
              <div className="tavern-lane-label">我方点数</div>
              <div className="tavern-dice-row">
                {(playerDice.length ? playerDice : Array.from<number | undefined>({ length: 5 })).map((die, index) => (
                  <DieFace
                    key={`player-${index}-${die ?? 'empty'}`}
                    value={die}
                    hidden={!die}
                    selected={selected.has(index)}
                    rolling={rolling}
                    disabled={phase !== 'play'}
                    onClick={die ? () => toggleDie(index) : undefined}
                  />
                ))}
              </div>
            </section>

            <section className="tavern-dice-lane">
              <div className="tavern-lane-label">敌方点数</div>
              <div className="tavern-dice-row">
                {(saloDice.length ? saloDice : Array.from<number | undefined>({ length: 5 })).map((die, index) => (
                  <DieFace
                    key={`salo-${index}-${die ?? 'empty'}`}
                    value={die}
                    hidden={!die || (visibleSaloDice[index] === null && phase !== 'round_result' && phase !== 'final')}
                    rolling={rolling}
                    disabled
                  />
                ))}
              </div>
            </section>

            <section className="tavern-status-row">
              <span>透视：{peekUsed ? '已使用' : '可用'}{peekCount ? ` · 已透露${peekCount}枚` : ''}</span>
              <span>说服：{persuadeUsed ? '已使用' : '可用'}{persuadeBonus ? ` · +${persuadeBonus}重投` : ''}</span>
              <span>萨洛调整：{saloRerollsLeft}</span>
              <span>预计金币：{projectedGold}G</span>
            </section>

            <section className="tavern-kp-box">
              <strong>{phase === 'play' && !rolling ? '瑟琳建议' : 'KP提示'}</strong>
              <p>{phase === 'play' && !rolling ? serinAdvice : message}</p>
              {phase === 'round_result' && lastRecord && (
                <div className="tavern-round-summary">
                  你：{formatDice(lastRecord.playerDice)}（{lastRecord.playerScore.label}）
                  <br />
                  萨洛：{formatDice(lastRecord.saloDice)}（{lastRecord.saloScore.label}）
                </div>
              )}
              {phase === 'final' && final && (
                <div className="tavern-round-summary">
                  最终：{final.wins}胜{final.effectiveWins > final.wins ? `（情报按${final.effectiveWins}胜结算）` : ''} · 花费{final.spent}G · 收回{final.earnings}G · 彩头{final.gift}G
                </div>
              )}
            </section>
          </main>

          <RulePanel />
        </div>

        {!canAffordRound && (
          <div className="tavern-dice-warning">金币不足，无法支付本局下注。</div>
        )}
      </motion.section>

      <DiceRollOverlay dice={skillDice} dieType="d20" onClose={() => setSkillDice(null)} />
    </motion.div>
      )}
    </>
  );
}
