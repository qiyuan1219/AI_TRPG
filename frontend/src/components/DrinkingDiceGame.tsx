import { useMemo, useState } from 'react';

interface DrinkingDiceGameProps {
  onBack: () => void;
  onComplete: (result: { playerTotal: number; brockTotal: number; rounds: number }) => void;
}

function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
}

export function DrinkingDiceGame({ onBack, onComplete }: DrinkingDiceGameProps) {
  const [rounds, setRounds] = useState<Array<{ player: number[]; brock: number[] }>>([]);
  const [finished, setFinished] = useState(false);

  const totals = useMemo(() => {
    return rounds.reduce(
      (sum, round) => ({
        player: sum.player + round.player.reduce((a, b) => a + b, 0),
        brock: sum.brock + round.brock.reduce((a, b) => a + b, 0),
      }),
      { player: 0, brock: 0 },
    );
  }, [rounds]);

  function rollRound() {
    if (finished || rounds.length >= 3) return;
    const next = {
      player: [rollD6(), rollD6()],
      brock: [rollD6(), rollD6()],
    };
    const nextRounds = [...rounds, next];
    setRounds(nextRounds);
    if (nextRounds.length >= 3) setFinished(true);
  }

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
            <p className="eyebrow">BROCK DICE</p>
            <h1>喝酒骰子</h1>
          </div>
          <button type="button" className="ghost-button" onClick={onBack}>返回</button>
        </header>

        <section className="dice-judge-panel">
          <div className="test-section-title">
            <span>三轮拼点数</span>
            <small>每轮双方各投 2D6，三轮总点数更高的一方赢。当前为简化版规则。</small>
          </div>

          <div className="dice-judge-board">
            <div className="dice-judge-symbol">2D6</div>
            <div className="dice-judge-copy">
              <strong>你 {totals.player} : {totals.brock} 布洛克</strong>
              <p>{finished ? '三轮结束，可以确认布洛克入队。' : `第 ${rounds.length + 1}/3 轮，拼的是酒量和骰运。`}</p>
            </div>
            {finished ? (
              <button
                type="button"
                className="start-button"
                onClick={() => onComplete({ playerTotal: totals.player, brockTotal: totals.brock, rounds: rounds.length })}
              >
                确认结果
              </button>
            ) : (
              <button type="button" className="start-button" onClick={rollRound}>投骰</button>
            )}
          </div>

          <div className="dice-history-list">
            {rounds.length ? rounds.map((round, index) => (
              <p key={index}>
                <span>第 {index + 1} 轮</span>
                <b>你 {round.player.join('+')} / 布洛克 {round.brock.join('+')}</b>
              </p>
            )) : (
              <p className="dice-history-empty">还没有投骰记录</p>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
