import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DiceRollOverlay } from './DiceRollOverlay';
import { TutorialOverlay } from './TutorialOverlay';
import type { TutorialStep } from './TutorialOverlay';
import type { DiceResult } from '../types/game';

function rollDie(sides: number) {
  return Math.floor(Math.random() * sides) + 1;
}

function conModifier(con: number) {
  return Math.floor((con - 10) / 2);
}

interface RoundResult {
  dc: number;
  d20: number;
  saveTotal: number;
  saveLabel: 'crit_success' | 'success' | 'fail' | 'big_fail';
  drunkLevel: number;
  drunkPenalty: number;
  pointBonus: number;
  playerPoint: number;
  playerDice: [number, number];
  brockPoint: number;
  brockDice: [number, number];
  winner: 'player' | 'brock' | 'draw';
}

export interface DrinkingDiceResult {
  playerWins: number;
  brockWins: number;
  draws: number;
  playerTotal: number;
  brockTotal: number;
  rounds: number;
  finalDrunkLevel: number;
  roundsDetail: RoundResult[];
}

interface DrinkingDiceGameProps {
  onBack: () => void;
  onComplete: (result: DrinkingDiceResult) => void;
  playerCon?: number;
  playerLevel?: number;
}

const DC_LIST = [10, 12, 14];
const ROUND_COUNT = 3;

const DRINKING_TUTORIAL: TutorialStep[] = [
  {
    title: '基本规则',
    badge: '铁锅喝酒骰',
    body: '共三轮，每轮两步：先进行体质豁免，再2d6拼点数。三轮后赢两局即获布洛克认可。\n\n即使全输，布洛克也会加入，只会影响他的态度和初始好感。',
  },
  {
    title: '体质豁免',
    badge: 'DC递增',
    body: '第1轮 DC10 → 第2轮 DC12 → 第3轮 DC14\n\n计算：d20 + 体质修正 + 熟练加值\n\n大成功(D20=20)：豁免自动成功，拼点数+2\n大失败(D20=1)：严重失败，醉意+2\n低于DC 5点以上：严重失败，醉意+2\n低于DC：普通失败，醉意+1',
  },
  {
    title: '醉意系统',
    badge: '惩罚',
    body: '每层醉意使拼点数 -2：\n醉意0：无影响\n醉意1：拼点 -2\n醉意2：拼点 -4\n醉意3：拼点 -6\n\n醉意不会直接导致失败，只会影响拼点分数。',
  },
  {
    title: '拼点数',
    badge: '2d6对决',
    body: '玩家：2d6 + 体质修正 - 醉意惩罚 + 大成功奖励\n布洛克：2d6 + 3（老酒鬼固定加值）\n\n你的点数 > 布洛克 → 你赢本轮\n你的点数 < 布洛克 → 布洛克赢本轮\n点数相同 → 平局',
  },
  {
    title: '策略提示',
    badge: '高分',
    body: '体质豁免是防守，拼点数是进攻。即使豁免失败，醉意累积后仍有机会在后续轮次靠骰运逆转。\n\n三轮后统计：赢2局以上→布洛克爽快认可；赢1局→勉强认可；0胜→嘲笑但依然加入。',
  },
];

export function DrinkingDiceGame({ onBack, onComplete, playerCon = 15, playerLevel = 3 }: DrinkingDiceGameProps) {
  const [roundIndex, setRoundIndex] = useState(0);
  const [drunkLevel, setDrunkLevel] = useState(0);
  const [playerWins, setPlayerWins] = useState(0);
  const [brockWins, setBrockWins] = useState(0);
  const [draws, setDraws] = useState(0);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [brockTotal, setBrockTotal] = useState(0);
  const [roundsDetail, setRoundsDetail] = useState<RoundResult[]>([]);
  const [phase, setPhase] = useState<'intro' | 'con_save' | 'con_result' | 'dice_roll' | 'round_result' | 'final'>('intro');
  const [currentDice, setCurrentDice] = useState<DiceResult | null>(null);
  const [conSaveResult, setConSaveResult] = useState<{ d20: number; total: number; label: string; pointBonus: number; newDrunk: number } | null>(null);
  const [diceResult, setDiceResult] = useState<{ player: [number, number]; brock: [number, number]; playerPoint: number; brockPoint: number; winner: string } | null>(null);
  const [tutorialStep, setTutorialStep] = useState(-1);

  const conMod = conModifier(playerCon);
  const conSaveBonus = conMod + (playerLevel >= 1 ? 2 : 0);

  function doConSave() {
    const dc = DC_LIST[roundIndex];
    const d20 = rollDie(20);
    const total = d20 + conSaveBonus;

    let newDrunk = drunkLevel;
    let pointBonus = 0;
    let label = 'fail';

    if (d20 === 20) {
      label = 'crit_success';
      pointBonus = 2;
    } else if (d20 === 1) {
      label = 'big_fail';
      newDrunk = Math.min(3, newDrunk + 2);
    } else if (total < dc - 5) {
      label = 'big_fail';
      newDrunk = Math.min(3, newDrunk + 2);
    } else if (total < dc) {
      label = 'fail';
      newDrunk = Math.min(3, newDrunk + 1);
    } else {
      label = 'success';
    }

    setConSaveResult({ d20, total, label, pointBonus, newDrunk });
    setCurrentDice({ type: 'skill_check', data: { 掷骰: `D20=${d20}`, 加值: conSaveBonus, 总计: total, DC: dc, 成功: label === 'success' || label === 'crit_success', 大成功: d20 === 20, 大失败: d20 === 1, 属性: '体质豁免' } });
    setPhase('con_result');
  }

  function doDiceRoll() {
    if (!conSaveResult) return;

    setDrunkLevel(conSaveResult.newDrunk);
    const penalty = conSaveResult.newDrunk * 2;

    const p1 = rollDie(6);
    const p2 = rollDie(6);
    const player2d6 = [p1, p2] as [number, number];
    const b1 = rollDie(6);
    const b2 = rollDie(6);
    const brock2d6 = [b1, b2] as [number, number];

    const playerPoint = p1 + p2 + conMod - penalty + conSaveResult.pointBonus;
    const brockPoint = b1 + b2 + 3;

    let winner: 'player' | 'brock' | 'draw';
    if (playerPoint > brockPoint) winner = 'player';
    else if (playerPoint < brockPoint) winner = 'brock';
    else winner = 'draw';

    setDiceResult({ player: player2d6, brock: brock2d6, playerPoint, brockPoint, winner });
    setPhase('round_result');

    const detail: RoundResult = {
      dc: DC_LIST[roundIndex],
      d20: conSaveResult.d20,
      saveTotal: conSaveResult.total,
      saveLabel: conSaveResult.label as RoundResult['saveLabel'],
      drunkLevel: conSaveResult.newDrunk,
      drunkPenalty: penalty,
      pointBonus: conSaveResult.pointBonus,
      playerPoint,
      playerDice: player2d6,
      brockPoint,
      brockDice: brock2d6,
      winner,
    };

    setRoundsDetail((prev) => [...prev, detail]);
    setPlayerTotal((prev) => prev + playerPoint);
    setBrockTotal((prev) => prev + brockPoint);

    if (winner === 'player') setPlayerWins((w) => w + 1);
    else if (winner === 'brock') setBrockWins((w) => w + 1);
    else setDraws((d) => d + 1);
  }

  function nextRound() {
    const nextIndex = roundIndex + 1;
    if (nextIndex >= ROUND_COUNT) {
      setPhase('final');
      setRoundIndex(nextIndex);
      return;
    }
    setRoundIndex(nextIndex);
    setConSaveResult(null);
    setDiceResult(null);
    setPhase('con_save');
  }

  function finish() {
    onComplete({
      playerWins,
      brockWins,
      draws,
      playerTotal,
      brockTotal,
      rounds: ROUND_COUNT,
      finalDrunkLevel: drunkLevel,
      roundsDetail,
    });
  }

  const conStatus = useMemo(() => {
    const labels: Record<string, string> = { crit_success: '大成功！本轮点数+2', success: '成功，正常拼点', fail: '失败，醉意+1 · 拼点-2', big_fail: '严重失败，醉意+2 · 拼点-4' };
    return conSaveResult ? labels[conSaveResult.label] ?? '' : '';
  }, [conSaveResult]);

  const drunkText = useMemo(() => {
    if (drunkLevel >= 3) return '醉意3层 · 拼点-6 · 布洛克看了直摇头';
    if (drunkLevel >= 2) return '醉意2层 · 拼点-4';
    if (drunkLevel >= 1) return '醉意1层 · 拼点-2';
    return '清醒 · 无惩罚';
  }, [drunkLevel]);

  const finalOutcome = useMemo(() => {
    if (playerWins >= 2) return { label: '大胜', text: '布洛克爽快认可', cls: 'win' };
    if (playerWins >= 1 || (brockWins < ROUND_COUNT && playerTotal >= brockTotal)) return { label: '小胜', text: '布洛克勉强认可', cls: 'tie' };
    return { label: '落败', text: '布洛克仍然加入', cls: 'lose' };
  }, [playerWins, brockWins, playerTotal, brockTotal]);

  return (
    <main
      className="test-screen"
      style={{
        backgroundImage: 'linear-gradient(90deg, rgba(10,8,14,0.88), rgba(10,8,14,0.58)), url(/assets/scenes/09brock-tavern-table.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <section className="test-layout">
        <header className="test-header">
          <div>
            <p className="eyebrow">铁锅喝酒骰</p>
            <h1>布洛克的考验</h1>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="button" className="ghost-button" style={{ background: 'rgba(95,183,167,0.12)', border: '1px solid rgba(95,183,167,0.25)', color: '#5fb7a7', fontSize: '0.8rem' }} onClick={() => setTutorialStep(0)}>
              ? 规则说明
            </button>
            <button type="button" className="ghost-button" onClick={onBack}>返回</button>
          </div>
        </header>

        <section className="dice-judge-panel">
          <div className="test-section-title">
            <span>
              {phase === 'final' ? '最终结果' : `第 ${roundIndex + 1}/3 轮`}
            </span>
            <small>
              胜 {playerWins} 局 · 负 {brockWins} 局 · 平 {draws} 局 · {drunkText}
            </small>
          </div>

          <div className="dice-judge-board">
            {phase === 'intro' && (
              <div className="dice-judge-copy" style={{ textAlign: 'center', padding: '20px 0' }}>
                <strong style={{ fontSize: '1.2rem' }}>规则说明</strong>
                <p style={{ marginTop: 12, lineHeight: 1.8 }}>
                  三轮拼酒，每轮先进行<b>体质豁免</b>（DC递增），再<b>2d6拼点数</b>。<br />
                  豁免失败会累积<b>醉意</b>，每层醉意拼点 -2。<br />
                  大成功(D20=20)豁免后拼点 +2。<br />
                  三轮后赢两局即获布洛克认可。
                </p>
                <button type="button" className="start-button" onClick={() => { setPhase('con_save'); }} style={{ marginTop: 16 }}>
                  开始喝酒
                </button>
              </div>
            )}

            {phase === 'con_save' && (
              <div className="dice-judge-copy" style={{ textAlign: 'center', padding: '20px 0' }}>
                <strong style={{ fontSize: '1.1rem' }}>体质豁免 DC{DC_LIST[roundIndex]}</strong>
                <p style={{ marginTop: 8 }}>d20 + 体质{conMod >= 0 ? '+' : ''}{conMod} + 熟练{conSaveBonus - conMod} = 体质豁免</p>
                <p style={{ fontSize: '0.8rem', color: '#999' }}>第{roundIndex + 1}轮，布洛克推来一杯颜色可疑的烈酒</p>
                <button type="button" className="start-button" onClick={doConSave} style={{ marginTop: 16 }}>
                  掷体质豁免 d20
                </button>
              </div>
            )}

            {phase === 'con_result' && conSaveResult && (
              <div className="dice-judge-copy" style={{ textAlign: 'center', padding: '16px 0' }}>
                <strong style={{ fontSize: '1.1rem', color: conSaveResult.label === 'success' || conSaveResult.label === 'crit_success' ? '#5fb7a7' : '#d36363' }}>
                  D20 {conSaveResult.d20} + {conSaveBonus} = {conSaveResult.total} / DC{DC_LIST[roundIndex]}
                </strong>
                <p style={{ marginTop: 8 }}>{conStatus}</p>
                <button type="button" className="start-button" onClick={doDiceRoll} style={{ marginTop: 16 }}>
                  拼点数 2d6
                </button>
              </div>
            )}

            {phase === 'round_result' && diceResult && (
              <div className="dice-judge-copy" style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginBottom: 12 }}>
                  <div>
                    <small>你</small>
                    <strong style={{ display: 'block', fontSize: '1.4rem' }}>
                      {diceResult.player[0]}+{diceResult.player[1]}{' '}
                      {conMod >= 0 ? '+' : ''}{conMod}{' '}
                      (醉意-{conSaveResult!.newDrunk * 2}{conSaveResult!.pointBonus ? ` 大成功+${conSaveResult!.pointBonus}` : ''})
                      {' '}= {diceResult.playerPoint}
                    </strong>
                  </div>
                  <div>
                    <small>布洛克</small>
                    <strong style={{ display: 'block', fontSize: '1.4rem' }}>
                      {diceResult.brock[0]}+{diceResult.brock[1]} + 3 = {diceResult.brockPoint}
                    </strong>
                  </div>
                </div>
                <strong style={{
                  fontSize: '1.2rem',
                  color: diceResult.winner === 'player' ? '#5fb7a7' : diceResult.winner === 'brock' ? '#d36363' : '#efd58c',
                }}>
                  {diceResult.winner === 'player' ? '你赢了这一轮！' : diceResult.winner === 'brock' ? '布洛克赢了这一轮' : '平局'}
                </strong>
                <button type="button" className="start-button" onClick={nextRound} style={{ marginTop: 16 }}>
                  {roundIndex < ROUND_COUNT - 1 ? '下一轮' : '查看结果'}
                </button>
              </div>
            )}

            {phase === 'final' && (
              <div className="dice-judge-copy" style={{ textAlign: 'center', padding: '20px 0' }}>
                <strong style={{ fontSize: '1.3rem', color: finalOutcome.cls === 'win' ? '#5fb7a7' : finalOutcome.cls === 'tie' ? '#efd58c' : '#d36363' }}>
                  {finalOutcome.text}
                </strong>
                <p style={{ marginTop: 12 }}>
                  你胜 {playerWins} · 布洛克胜 {brockWins} · 平 {draws} 局
                </p>
                <button type="button" className="start-button" onClick={finish} style={{ marginTop: 16 }}>
                  确认结果
                </button>
              </div>
            )}
          </div>

          <div className="dice-history-list">
            <AnimatePresence>
              {roundsDetail.length ? roundsDetail.map((round, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span>第 {index + 1} 轮 · DC{round.dc}</span>
                  <b>
                    D20={round.d20}/{round.dc}
                    {round.saveLabel === 'crit_success' ? ' 大成功' : round.saveLabel === 'big_fail' ? ' 严重失败' : round.saveLabel === 'fail' ? ' 失败' : ' 通过'}
                    {' → '}
                    你 {round.playerPoint} ({round.playerDice.join('+')})
                    {' vs '}
                    布洛克 {round.brockPoint} ({round.brockDice.join('+')})
                    {' '}
                    {round.winner === 'player' ? '✓' : round.winner === 'brock' ? '✗' : '='}
                  </b>
                </motion.p>
              )) : (
                <p className="dice-history-empty">还没有投骰记录</p>
              )}
            </AnimatePresence>
          </div>
        </section>
      </section>

      <DiceRollOverlay dice={currentDice} dieType="d20" onClose={() => setCurrentDice(null)} />

      <AnimatePresence>
        {tutorialStep >= 0 && (
          <TutorialOverlay
            steps={DRINKING_TUTORIAL}
            currentStep={tutorialStep}
            onClose={() => setTutorialStep(-1)}
            onPrev={() => setTutorialStep((s) => Math.max(0, s - 1))}
            onNext={() => setTutorialStep((s) => Math.min(DRINKING_TUTORIAL.length - 1, s + 1))}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
