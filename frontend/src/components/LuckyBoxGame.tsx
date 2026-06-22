import { useState } from 'react';
import { rollDiceEvent } from '../core/dice/createDiceEvent';
import { ORLAN_DIAMOND_MIN_ROLL, ORLAN_DRAW_COST, ORLAN_PITY_LIMIT } from '../features/minigames/blackMarketDrawFlow';

interface LuckyBoxGameProps {
  gold: number;
  onBack: () => void;
  onComplete: (result: { attempts: number; spent: number; finalRoll: number; guaranteed: boolean }) => void;
}

function rollD20() {
  return rollDiceEvent('shop_lottery', 'shop', 20).rolls[0];
}

export function LuckyBoxGame({ gold, onBack, onComplete }: LuckyBoxGameProps) {
  const [rolls, setRolls] = useState<number[]>([]);
  const [won, setWon] = useState(false);
  const spent = rolls.length * ORLAN_DRAW_COST;
  const canRoll = !won && rolls.length < ORLAN_PITY_LIMIT && gold - spent >= ORLAN_DRAW_COST;

  function draw() {
    if (!canRoll) return;
    const roll = rollD20();
    const nextRolls = [...rolls, roll];
    const guaranteed = nextRolls.length >= ORLAN_PITY_LIMIT;
    const success = roll >= ORLAN_DIAMOND_MIN_ROLL || guaranteed;
    setRolls(nextRolls);
    if (success) setWon(true);
  }

  const finalRoll = rolls[rolls.length - 1] ?? 0;
  const guaranteed = won && rolls.length >= ORLAN_PITY_LIMIT && finalRoll < ORLAN_DIAMOND_MIN_ROLL;

  return (
    <main
      className="test-screen"
      style={{
        backgroundImage: 'linear-gradient(90deg, rgba(10,8,14,0.88), rgba(10,8,14,0.58)), url(/assets/scenes/09.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <section className="test-layout">
        <header className="test-header">
          <div>
            <p className="eyebrow">ORLAN BOX</p>
            <h1>幸运盲盒</h1>
          </div>
          <button type="button" className="ghost-button" onClick={onBack}>返回</button>
        </header>

        <section className="dice-judge-panel">
          <div className="test-section-title">
            <span>{ORLAN_DRAW_COST}金一次</span>
            <small>D20 投出 {ORLAN_DIAMOND_MIN_ROLL}、19 或 20 获得钻石；第 {ORLAN_PITY_LIMIT} 次保底。当前为简化版规则。</small>
          </div>

          <div className="dice-judge-board">
            <div className="dice-judge-symbol">D20</div>
            <div className="dice-judge-copy">
              <strong>已抽 {rolls.length}/{ORLAN_PITY_LIMIT} 次，花费 {spent}G</strong>
              <p>
                {won
                  ? guaranteed ? '奥兰按保底规则拿出了钻石。' : `点数 ${finalRoll}，钻石到手。`
                  : canRoll ? '奥兰把盲盒推到柜台中央。' : '金币不足，无法继续抽取。'}
              </p>
            </div>
            {won ? (
              <button
                type="button"
                className="start-button"
                onClick={() => onComplete({ attempts: rolls.length, spent, finalRoll, guaranteed })}
              >
                交给凯娅
              </button>
            ) : (
              <button type="button" className="start-button" onClick={draw} disabled={!canRoll}>抽一次</button>
            )}
          </div>

          <div className="dice-history-list">
            {rolls.length ? rolls.map((roll, index) => (
              <p key={index}>
                <span>第 {index + 1} 次</span>
                <b>D20={roll}{roll >= ORLAN_DIAMOND_MIN_ROLL ? ' · 钻石' : ''}</b>
              </p>
            )) : (
              <p className="dice-history-empty">尚未抽取</p>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
