import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BattleTestScreen } from "./BattleTestScreen";
import { DiceRollOverlay, type DieType } from "./DiceRollOverlay";
import { YachtDiceTestScreen } from "./YachtDiceTestScreen";
import type { DiceResult } from "../types/game";

interface TestScreenProps {
  onBack: () => void;
}

type TestMode = "menu" | "dice-select" | "dice-roll" | "battle" | "yacht";

const DICE_OPTIONS: Array<{ type: DieType; label: string; sides: number }> = [
  { type: "d4", label: "四面骰", sides: 4 },
  { type: "d6", label: "六面骰", sides: 6 },
  { type: "d8", label: "八面骰", sides: 8 },
  { type: "d12", label: "十二面骰", sides: 12 },
  { type: "d20", label: "二十面骰", sides: 20 },
];

export function TestScreen({ onBack }: TestScreenProps) {
  const [mode, setMode] = useState<TestMode>("menu");
  const [selectedDie, setSelectedDie] = useState<DieType>("d20");
  const [activeDice, setActiveDice] = useState<DiceResult | null>(null);
  const [history, setHistory] = useState<Array<{ id: number; die: DieType; value: number }>>([]);

  const currentDie = useMemo(
    () => DICE_OPTIONS.find((item) => item.type === selectedDie) ?? DICE_OPTIONS[4],
    [selectedDie],
  );

  function goBack() {
    if (mode === "dice-roll") {
      setMode("dice-select");
      return;
    }
    if (mode === "dice-select") {
      setMode("menu");
      return;
    }
    if (mode === "battle") {
      setMode("menu");
      return;
    }
    if (mode === "yacht") {
      setMode("menu");
      return;
    }
    onBack();
  }

  function selectDie(dieType: DieType) {
    setSelectedDie(dieType);
    setMode("dice-roll");
    setActiveDice(null);
  }

  function rollDie() {
    if (activeDice) return;

    const value = Math.floor(Math.random() * currentDie.sides) + 1;
    const id = Date.now();
    setHistory((prev) => [{ id, die: currentDie.type, value }, ...prev].slice(0, 8));
    setActiveDice({
      type: "dice_test",
      data: {
        骰子: `D${currentDie.sides}`,
        掷骰: `D${currentDie.sides}=${value}`,
        结果: value,
        总计: value,
        id,
      },
    });
  }

  if (mode === "battle") {
    return <BattleTestScreen onBack={() => setMode("menu")} />;
  }

  if (mode === "yacht") {
    return <YachtDiceTestScreen onBack={() => setMode("menu")} />;
  }

  return (
    <main className="test-screen">
      <motion.section
        className="test-layout"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <header className="test-header">
          <div>
            <p className="eyebrow">TEST LAB</p>
            <h1>测试</h1>
          </div>
          <button type="button" className="ghost-button" onClick={goBack}>
            返回
          </button>
        </header>

        {mode === "menu" && (
          <section className="test-menu-grid" aria-label="测试类型">
            <button type="button" className="test-mode-button" onClick={() => setMode("dice-select")}>
              <span>测试骰子</span>
              <small>验证 D4、D6、D8、D12、D20 是否能正常投出结果</small>
            </button>
            <button type="button" className="test-mode-button" onClick={() => setMode("battle")}>
              <span>测试战斗</span>
              <small>B1 层先攻、指定目标、骰子判定与 AI KP 战斗描写</small>
            </button>
            <button type="button" className="test-mode-button" onClick={() => setMode("yacht")}>
              <span>快艇骰子</span>
              <small>三轮赌局、瑟琳协助、AI建议、氛围旁白与点面 D6</small>
            </button>
          </section>
        )}

        {mode === "dice-select" && (
          <section className="dice-select-panel">
            <div className="test-section-title">
              <span>选择骰子</span>
              <small>选择后进入判定界面</small>
            </div>
            <div className="dice-option-grid">
              {DICE_OPTIONS.map((item) => (
                <button key={item.type} type="button" className="dice-option-button" onClick={() => selectDie(item.type)}>
                  <b>D{item.sides}</b>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {mode === "dice-roll" && (
          <section className="dice-judge-panel">
            <div className="test-section-title">
              <span>{currentDie.label}判定</span>
              <small>点击投骰，确认 {`D${currentDie.sides}`} 可以生成结果</small>
            </div>

            <div className="dice-judge-board">
              <div className="dice-judge-symbol">D{currentDie.sides}</div>
              <div className="dice-judge-copy">
                <strong>{history[0] ? `最近结果：${history[0].value}` : "等待投骰"}</strong>
                <p>{activeDice ? "投骰动画进行中" : "准备进行一次独立骰子判定。"}</p>
              </div>
              <button type="button" className="start-button" onClick={rollDie} disabled={Boolean(activeDice)}>
                投骰
              </button>
            </div>

            <div className="dice-history-list" aria-label="投骰记录">
              {history.length ? (
                history.map((item) => (
                  <p key={item.id}>
                    <span>{item.die.toUpperCase()}</span>
                    <b>{item.value}</b>
                  </p>
                ))
              ) : (
                <p className="dice-history-empty">暂无投骰记录</p>
              )}
            </div>
          </section>
        )}
      </motion.section>

      <DiceRollOverlay dice={activeDice} dieType={selectedDie} onClose={() => setActiveDice(null)} />
    </main>
  );
}
