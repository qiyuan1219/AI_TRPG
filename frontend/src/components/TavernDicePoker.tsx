import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { DiceRollOverlay } from './DiceRollOverlay';
import type { DiceResult } from '../types/game';

type Phase = 'prep' | 'skill_result' | 'rolling' | 'play' | 'round_result' | 'plead' | 'final';
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
  onClose: () => void;
  onComplete?: (result: TavernDicePokerResult) => void;
}

const SELIN_INT = 4;
const SELIN_CHA = 3;
const BASE_REROLLS = 3;
const STARTING_STAKE = 50;
const DIE_PIPS = [
  [],
  [4],
  [0, 8],
  [0, 4, 8],
  [0, 2, 6, 8],
  [0, 2, 4, 6, 8],
  [0, 2, 3, 5, 6, 8],
];

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

function compareHands(a: number[], b: number[]): RoundOutcome {
  const player = scoreHand(a);
  const salo = scoreHand(b);
  if (player.points > salo.points) return 'win';
  if (player.points < salo.points) return 'lose';
  return 'tie';
}

function chooseAdvice(playerDice: number[], visibleSaloDice: Array<number | null>) {
  const counts = countDice(playerDice);
  const bestGroup = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0];
  const visible = visibleSaloDice.filter((die): die is number => die !== null);
  const visibleText = visible.length ? `已看见萨洛 ${visible.length} 枚骰：${visible.join('、')}。` : '萨洛的骰面仍然藏着。';
  if (bestGroup?.[1] >= 3) {
    return `${visibleText} 瑟琳建议保留所有 ${bestGroup[0]}，只重掷散骰，争取四同或葫芦。`;
  }
  if (bestGroup?.[1] === 2) {
    return `${visibleText} 瑟琳建议保留对子和高点骰，别为了小顺拆掉已经成形的点数。`;
  }
  const keep = playerDice.map((die, index) => ({ die, index })).filter(({ die }) => die >= 5).map(({ index }) => index + 1);
  return `${visibleText} 你手里还没成型，瑟琳建议先留 ${keep.length ? `第 ${keep.join('、')} 枚高点骰` : '一到两枚最高点'}，其余重掷。`;
}

function improveOpponentHand(dice: number[]) {
  const counts = countDice(dice);
  const best = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0])[0]?.[0] ?? 6;
  return dice.map((die) => {
    if (die === best || die >= 5) return die;
    return Math.random() < 0.65 ? rollDie() : die;
  });
}

function PipDie({ value, hidden = false, selected = false, onClick }: { value: number; hidden?: boolean; selected?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      className={`tavern-die ${selected ? 'selected' : ''} ${hidden ? 'hidden' : ''}`}
      onClick={onClick}
      disabled={hidden || !onClick}
      aria-label={hidden ? '隐藏骰子' : `${value}点`}
    >
      {hidden ? (
        <span className="die-dots">?</span>
      ) : (
        <span className="die-dots" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, width: 46, height: 46 }}>
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} style={{ width: 8, height: 8, borderRadius: 999, background: DIE_PIPS[value].includes(i) ? 'currentColor' : 'transparent', alignSelf: 'center', justifySelf: 'center' }} />
          ))}
        </span>
      )}
    </button>
  );
}

export function TavernDicePoker({ onClose, onComplete }: TavernDicePokerProps) {
  const [phase, setPhase] = useState<Phase>('prep');
  const [round, setRound] = useState(1);
  const [stake, setStake] = useState(STARTING_STAKE);
  const [spent, setSpent] = useState(0);
  const [wins, setWins] = useState(0);
  const [peekUsed, setPeekUsed] = useState(false);
  const [persuadeUsed, setPersuadeUsed] = useState(false);
  const [peekCount, setPeekCount] = useState(0);
  const [persuadeBonus, setPersuadeBonus] = useState(0);
  const [rerollsLeft, setRerollsLeft] = useState(BASE_REROLLS);
  const [playerDice, setPlayerDice] = useState<number[]>([]);
  const [saloDice, setSaloDice] = useState<number[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [records, setRecords] = useState<RoundRecord[]>([]);
  const [message, setMessage] = useState('萨洛把五颗骨白色骰子推到桌面中央。每局押金50G，赢下一局就能拿到完整情报；赢两局以上，他还会额外给你们一份黑市药剂商的线索。');
  const [canStart, setCanStart] = useState(true);
  const [skillDice, setSkillDice] = useState<DiceResult | null>(null);
  const [rolling, setRolling] = useState(false);
  const [final, setFinal] = useState<TavernDicePokerResult | null>(null);

  const visibleSaloDice = useMemo(
    () => saloDice.map((die, index) => (index < peekCount ? die : null)),
    [saloDice, peekCount],
  );
  const advice = useMemo(() => (playerDice.length ? chooseAdvice(playerDice, visibleSaloDice) : ''), [playerDice, visibleSaloDice]);
  const lastRecord = records[records.length - 1];

  function showSkillRoll(label: string, roll: number, bonus: number, dc: number, success: boolean) {
    setSkillDice({
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
    });
  }

  function prepareSkill(choice: SkillChoice) {
    setCanStart(false);
    if (choice === 'none') {
      setPeekCount(0);
      setPersuadeBonus(0);
      setMessage(`第${round}局准备开始。瑟琳收回银杖，让骰杯里的声音保持原样。`);
      setPhase('skill_result');
      window.setTimeout(() => setCanStart(true), 1000);
      return;
    }

    const roll = rollDie(20);
    if (choice === 'peek') {
      const total = roll + SELIN_INT;
      const revealed = total < 10 ? 0 : total <= 12 ? 1 : total <= 15 ? 2 : total <= 18 ? 3 : total <= 20 ? 4 : 5;
      setPeekUsed(true);
      setPeekCount(revealed);
      setMessage(revealed === 0
        ? `D20=${roll}+${SELIN_INT}=${total}。银杖的光被酒馆铜铃反射打散，瑟琳没能看清萨洛的骰面。`
        : `D20=${roll}+${SELIN_INT}=${total}。瑟琳的银杖微微发亮，本局开始后可看见萨洛 ${revealed} 枚骰。`);
      showSkillRoll('瑟琳·透视骰面', roll, SELIN_INT, 10, revealed > 0);
    } else {
      const total = roll + SELIN_CHA;
      const bonus = total < 13 ? 0 : total <= 16 ? 1 : 2;
      setPersuadeUsed(true);
      setPersuadeBonus(bonus);
      setMessage(bonus === 0
        ? `D20=${roll}+${SELIN_CHA}=${total}。萨洛笑着敲了敲杯沿：「规矩就是规矩，小姑娘。」本局没有额外重掷。`
        : `D20=${roll}+${SELIN_CHA}=${total}。萨洛被瑟琳说得挑了挑眉，本局额外获得 ${bonus} 次重掷机会。`);
      showSkillRoll('瑟琳·银杖说服', roll, SELIN_CHA, 13, bonus > 0);
    }
    setPhase('skill_result');
    window.setTimeout(() => setCanStart(true), 1000);
  }

  function startRound() {
    setSpent((value) => value + stake);
    setRerollsLeft(BASE_REROLLS + persuadeBonus);
    setSelected(new Set());
    setPlayerDice([]);
    setSaloDice([]);
    setRolling(true);
    setPhase('rolling');
    setMessage(`第${round}局押下 ${stake}G。骰杯同时扣下，桌边的铜铃轻轻一响。`);
    window.setTimeout(() => {
      setPlayerDice(rollDice(5));
      setSaloDice(rollDice(5));
      setRolling(false);
      setPhase('play');
    }, 850);
  }

  function toggleDie(index: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function rerollUnselected() {
    if (rerollsLeft <= 0 || rolling) return;
    setRolling(true);
    setMessage('骰子在杯底乱撞。萨洛也扣住自己的骰杯，像是在和某个坏习惯谈判。');
    window.setTimeout(() => {
      setPlayerDice((dice) => dice.map((die, index) => (selected.has(index) ? die : rollDie())));
      setSaloDice((dice) => improveOpponentHand(dice));
      setRerollsLeft((value) => value - 1);
      setSelected(new Set());
      setRolling(false);
    }, 700);
  }

  function submitRound() {
    const result = compareHands(playerDice, saloDice);
    const playerScore = scoreHand(playerDice);
    const saloScore = scoreHand(saloDice);
    const nextWins = result === 'win' ? wins + 1 : wins;
    const record: RoundRecord = { round, stake, result, playerDice, saloDice, playerScore, saloScore };
    setRecords((prev) => [...prev, record]);
    setWins(nextWins);
    setPhase('round_result');
    setMessage(result === 'win'
      ? `你以「${playerScore.label}」压过萨洛的「${saloScore.label}」。萨洛吹了声短哨，把酒杯推远了一点。`
      : result === 'tie'
        ? `你和萨洛同为「${playerScore.label}」。萨洛摊开手：「平局不算赢，但也不算难看。」`
        : `你的「${playerScore.label}」输给萨洛的「${saloScore.label}」。他把骰子一颗颗排齐，笑得很慢。`);
  }

  function completeGame(rawWins: number, extraSpent = 0, paidInfo = false, earnings = 0) {
    const effectiveWins = Math.max(rawWins, paidInfo ? 1 : 0);
    const gift = rawWins >= 2 ? 100 : 0;
    const result: TavernDicePokerResult = {
      wins: rawWins,
      effectiveWins,
      spent: spent + extraSpent,
      earnings,
      gift,
      paidInfo,
      yunlingUnlocked: rawWins >= 2,
      records,
    };
    setFinal(result);
    setPhase('final');
    setMessage(rawWins >= 2
      ? '萨洛承认你们赢得漂亮，除了三名队友的情报，还额外给出黑市药剂商云苓的线索，并拍出100G作为彩头。'
      : '萨洛收起骰子。无论输赢，情报都会给，只是这张桌子会记住你们今晚的手气。');
    onComplete?.(result);
  }

  function nextRound(doubleStake: boolean) {
    if (round >= 3) {
      if (wins > 0) completeGame(wins);
      else setPhase('plead');
      return;
    }
    setRound((value) => value + 1);
    setStake(doubleStake ? stake * 2 : STARTING_STAKE);
    setPeekCount(0);
    setPersuadeBonus(0);
    setPlayerDice([]);
    setSaloDice([]);
    setSelected(new Set());
    setCanStart(true);
    setPhase('prep');
    setMessage(doubleStake
      ? `萨洛把筹码推高到 ${stake * 2}G。「翻倍，胆子不错。下一局别眨眼。」`
      : '你暂时收住筹码，继续下一局。瑟琳站在你身侧，银杖光芒压得很低。');
  }

  function plead() {
    const roll = rollDie(20);
    const total = roll + SELIN_CHA;
    showSkillRoll('瑟琳·低声求情', roll, SELIN_CHA, 15, total > 15);
    if (total > 15) {
      setMessage(`D20=${roll}+${SELIN_CHA}=${total}。瑟琳没有替你们找借口，只是提醒萨洛：下孢海的人少一个都可能回不来。萨洛沉默片刻，算你们取得一次有效情报胜利。`);
      window.setTimeout(() => completeGame(1, 0, false), 900);
    } else {
      setMessage(`D20=${roll}+${SELIN_CHA}=${total}。萨洛摇头：「规矩不能每次都软。」你们必须支付50G买下情报。`);
    }
  }

  return (
    <motion.div
      className="tavern-dice-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={phase === 'final' ? onClose : undefined}
    >
      <motion.div
        className="tavern-dice-modal"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="tavern-dice-header">
          <span>快艇骰子 · 萨洛的情报桌</span>
          <small>第{round}/3局 · {wins}胜 · 押金{stake}G</small>
          <button type="button" onClick={onClose} className="tavern-dice-close">x</button>
        </div>

        <div className="tavern-dice-narrative">{message}</div>

        {phase === 'prep' && (
          <div className="tavern-skill-zone">
            <p>瑟琳看向你，等你决定这一局是否动用她的帮助。透视和说服各只能使用一次。</p>
            <div className="tavern-skill-buttons">
              <button type="button" disabled={peekUsed} onClick={() => prepareSkill('peek')} className="tavern-skill-btn peek-btn">
                使用透视
                {peekUsed && '（已用）'}
              </button>
              <button type="button" disabled={persuadeUsed} onClick={() => prepareSkill('persuade')} className="tavern-skill-btn persuade-btn">
                说服萨洛
                {persuadeUsed && '（已用）'}
              </button>
              <button type="button" onClick={() => prepareSkill('none')} className="tavern-skill-btn skip-btn">不用技能</button>
            </div>
          </div>
        )}

        {phase === 'skill_result' && (
          <div className="tavern-round-end">
            <button type="button" disabled={!canStart} onClick={startRound} className="tavern-btn tavern-btn-gold">
              开始本局
            </button>
          </div>
        )}

        {(phase === 'rolling' || phase === 'play') && (
          <div className="tavern-game-zone">
            <div className="tavern-opponent-info">{phase === 'rolling' || rolling ? '骰杯正在震动...' : advice}</div>
            <div className="tavern-dice-row">
              <strong>你</strong>
              {playerDice.length === 0
                ? Array.from({ length: 5 }, (_, i) => <PipDie key={i} value={1} hidden />)
                : playerDice.map((die, index) => (
                    <PipDie key={index} value={die} selected={selected.has(index)} onClick={() => toggleDie(index)} />
                  ))}
            </div>
            <div className="tavern-dice-row">
              <strong>萨洛</strong>
              {saloDice.length === 0
                ? Array.from({ length: 5 }, (_, i) => <PipDie key={i} value={1} hidden />)
                : saloDice.map((die, index) => (
                    <PipDie key={index} value={die} hidden={visibleSaloDice[index] === null} />
                  ))}
            </div>
            <div className="tavern-reroll-buttons">
              <button type="button" disabled={rolling || rerollsLeft <= 0} onClick={rerollUnselected} className="tavern-btn">
                重掷未保留骰（{rerollsLeft}）
              </button>
              <button type="button" disabled={rolling || playerDice.length === 0} onClick={submitRound} className="tavern-btn tavern-btn-gold">
                提交本局
              </button>
            </div>
          </div>
        )}

        {phase === 'round_result' && lastRecord && (
          <div className="tavern-round-end">
            <p>
              你：{lastRecord.playerDice.join(' ')}（{lastRecord.playerScore.label}）
              {' '}vs 萨洛：{lastRecord.saloDice.join(' ')}（{lastRecord.saloScore.label}）
            </p>
            {lastRecord.result === 'win' ? (
              <div className="tavern-plead-buttons">
                <button type="button" onClick={() => completeGame(wins, 0, false, stake * 2)} className="tavern-btn tavern-btn-gold">收下筹码并结束游戏</button>
                {round < 3 && <button type="button" onClick={() => nextRound(true)} className="tavern-btn">翻倍进入下一局</button>}
              </div>
            ) : (
              <button type="button" onClick={() => nextRound(false)} className="tavern-btn tavern-btn-gold">
                {round >= 3 ? '查看最终结果' : '进入下一局'}
              </button>
            )}
          </div>
        )}

        {phase === 'plead' && (
          <div className="tavern-plead-zone">
            <p>三局未胜。瑟琳可以替你们低声求情；若失败，就只能支付50G买下萨洛的情报。</p>
            <div className="tavern-plead-buttons">
              <button type="button" onClick={plead} className="tavern-btn tavern-btn-gold">让瑟琳求情</button>
              <button type="button" onClick={() => completeGame(0, 50, true)} className="tavern-btn">支付50G购买情报</button>
            </div>
          </div>
        )}

        {phase === 'final' && final && (
          <div className="tavern-final-result">
            <h2>骰局结束</h2>
            <p className="tavern-final-score">战绩：{final.wins}胜 · 花费{final.spent}G · 收回{final.earnings}G · 彩头{final.gift}G</p>
            <p className="tavern-final-info">{final.yunlingUnlocked ? '额外情报：黑市药剂商云苓。' : '获得三名队友的完整情报。'}</p>
            <button type="button" onClick={onClose} className="tavern-btn tavern-btn-gold">回到酒馆</button>
          </div>
        )}
      </motion.div>

      <DiceRollOverlay dice={skillDice} dieType="d20" onClose={() => setSkillDice(null)} />
    </motion.div>
  );
}
