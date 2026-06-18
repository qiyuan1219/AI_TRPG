import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BargainTestScreen } from "./BargainTestScreen";
import { BattleTestScreen } from "./BattleTestScreen";
import { CompanionEventTestScreen } from "./CompanionEventTestScreen";
import { DiceRollOverlay, type DieType } from "./DiceRollOverlay";
import { PortraitTestScreen } from "./PortraitTestScreen";
import { SceneBgTestScreen } from "./SceneBgTestScreen";
import { YachtDiceTestScreen } from "./YachtDiceTestScreen";
import { STORY_TEST_CHECKPOINTS, type StoryTestCheckpoint } from "../data/storyTestCheckpoints";
import type { DiceResult } from "../types/game";
import { rollDiceEvent } from "../core/dice/createDiceEvent";

interface TestScreenProps {
  onBack: () => void;
  onStoryTest: (checkpoint: StoryTestCheckpoint) => void;
}

type TestMode = "menu" | "story" | "dice-select" | "dice-roll" | "battle" | "yacht" | "bargain" | "portrait" | "companion-event" | "scene-bg";

const DICE_OPTIONS: Array<{ type: DieType; label: string; sides: number }> = [
  { type: "d4", label: "四面骰", sides: 4 },
  { type: "d6", label: "六面骰", sides: 6 },
  { type: "d8", label: "八面骰", sides: 8 },
  { type: "d12", label: "十二面骰", sides: 12 },
  { type: "d20", label: "二十面骰", sides: 20 },
  { type: "d20", label: "命中 D20（暗红）", sides: 20 },
];

export function TestScreen({ onBack, onStoryTest }: TestScreenProps) {
  const [mode, setMode] = useState<TestMode>("menu");
  const [selectedDie, setSelectedDie] = useState<DieType>("d20");
  const [activeDice, setActiveDice] = useState<DiceResult | null>(null);
  const [isAttackD20, setIsAttackD20] = useState(false);
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
      setIsAttackD20(false);
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
    if (mode === "bargain") {
      setMode("menu");
      return;
    }
    if (mode === "story" || mode === "portrait" || mode === "companion-event" || mode === "scene-bg") {
      setMode("menu");
      return;
    }
    onBack();
  }

  function selectDie(dieType: DieType, attackVariant = false) {
    setSelectedDie(dieType);
    setIsAttackD20(attackVariant);
    setMode("dice-roll");
    setActiveDice(null);
  }

  function rollDie() {
    if (activeDice) return;

    const diceEvent = rollDiceEvent('test', 'test', currentDie.sides);
    const value = diceEvent.rolls[0];
    const id = Date.now();
    setHistory((prev) => [{ id, die: currentDie.type, value }, ...prev].slice(0, 8));
    setActiveDice({
      type: "dice_test",
      event: diceEvent,
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

  if (mode === "bargain") {
    return <BargainTestScreen onBack={() => setMode("menu")} />;
  }

  if (mode === "portrait") {
    return <PortraitTestScreen onBack={() => setMode("menu")} />;
  }

  if (mode === "companion-event") {
    return <CompanionEventTestScreen onBack={() => setMode("menu")} />;
  }

  if (mode === "scene-bg") {
    return <SceneBgTestScreen onBack={() => setMode("menu")} />;
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
            <button type="button" className="test-mode-button" onClick={() => setMode("story")}>
              <span>剧情节点</span>
              <small>直接跳到公会、酒馆、同伴选择、黑市、缆梯、孢海据点等主线片段</small>
            </button>
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
            <button type="button" className="test-mode-button" onClick={() => setMode("bargain")}>
              <span>讲价游戏</span>
              <small>黑市购买时触发：D20 判定、玩家话术、AI 老板视角回复与最多 5 次砍价</small>
            </button>
            <button type="button" className="test-mode-button" onClick={() => setMode("portrait")}>
              <span>🧑 角色立绘</span>
              <small>加载同伴与剧情 NPC 立绘，模拟视觉小说对话，验证资源完整性</small>
            </button>
            <button type="button" className="test-mode-button" onClick={() => setMode("companion-event")}>
              <span>同伴支线事件</span>
              <small>布洛克"回声菌林"：触发顺序、危机战斗、信任奖励与 AI 自由对话</small>
            </button>
            <button type="button" className="test-mode-button" onClick={() => setMode("scene-bg")}>
              <span>🖼 场景背景</span>
              <small>验证多阶段背景切换（初见逆穹城 → 教学战斗），测试立绘叠加透明度效果</small>
            </button>
          </section>
        )}

        {mode === "story" && (
          <section className="test-menu-grid" aria-label="剧情测试节点">
            {STORY_TEST_CHECKPOINTS.map((checkpoint) => (
              <button
                key={checkpoint.id}
                type="button"
                className="test-mode-button"
                onClick={() => onStoryTest(checkpoint)}
              >
                <span>{checkpoint.label}</span>
                <small>{checkpoint.desc}</small>
              </button>
            ))}
          </section>
        )}

        {mode === "dice-select" && (
          <section className="dice-select-panel">
            <div className="test-section-title">
              <span>选择骰子</span>
              <small>选择后进入判定界面</small>
            </div>
            <div className="dice-option-grid">
              {DICE_OPTIONS.map((item, idx) => (
                <button key={`${item.type}-${idx}`} type="button" className="dice-option-button" onClick={() => selectDie(item.type, idx === 5)}>
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
              <span>{currentDie.label}判定{isAttackD20 ? " · 攻击模式" : ""}</span>
              <small>点击投骰，确认 {`D${currentDie.sides}`}{isAttackD20 ? " 暗红金配色" : ""} 可以生成结果</small>
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

      <DiceRollOverlay
        dice={activeDice}
        dieType={selectedDie}
        attackMode={isAttackD20}
        diceKind={isAttackD20 ? "命中判定" : `D${currentDie.sides} 测试`}
        showD20Calc={isAttackD20}
        onClose={() => setActiveDice(null)}
      />
    </main>
  );
}
