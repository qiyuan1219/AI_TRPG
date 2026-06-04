import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Dice3DView } from "./DiceRollOverlay";

interface YachtDiceTestScreenProps {
  onBack: () => void;
}

type ScoreSection = "upper" | "lower";

interface ScoreCategory {
  id: string;
  label: string;
  section: ScoreSection;
  description: string;
  score: (dice: number[]) => number;
}

const DICE_COUNT = 5;
const MAX_ROLLS = 3;

const UPPER_CATEGORIES: ScoreCategory[] = [1, 2, 3, 4, 5, 6].map((face) => ({
  id: `face-${face}`,
  label: `${face} 点`,
  section: "upper" as const,
  description: `只计算所有 ${face} 点骰子的点数总和。`,
  score: (dice) => dice.filter((value) => value === face).reduce((sum, value) => sum + value, 0),
}));

const LOWER_CATEGORIES: ScoreCategory[] = [
  {
    id: "three-kind",
    label: "三条",
    section: "lower",
    description: "至少 3 颗骰子点数相同，得所有骰子的点数总和。",
    score: (dice) => (hasCount(dice, 3) ? sumDice(dice) : 0),
  },
  {
    id: "four-kind",
    label: "四条",
    section: "lower",
    description: "至少 4 颗骰子点数相同，得所有骰子的点数总和。",
    score: (dice) => (hasCount(dice, 4) ? sumDice(dice) : 0),
  },
  {
    id: "full-house",
    label: "葫芦",
    section: "lower",
    description: "一组三同点数 + 一组二同点数，固定得 25 分。",
    score: (dice) => (isFullHouse(dice) ? 25 : 0),
  },
  {
    id: "small-straight",
    label: "小顺",
    section: "lower",
    description: "包含连续 4 个点数，例如 1-2-3-4，固定得 30 分。",
    score: (dice) => (hasStraight(dice, 4) ? 30 : 0),
  },
  {
    id: "large-straight",
    label: "大顺",
    section: "lower",
    description: "包含连续 5 个点数，即 1-2-3-4-5 或 2-3-4-5-6，固定得 40 分。",
    score: (dice) => (hasStraight(dice, 5) ? 40 : 0),
  },
  {
    id: "yacht",
    label: "快艇",
    section: "lower",
    description: "5 颗骰子点数完全相同，固定得 50 分。",
    score: (dice) => (hasCount(dice, 5) ? 50 : 0),
  },
  {
    id: "chance",
    label: "机会",
    section: "lower",
    description: "没有组合限制，得所有骰子的点数总和。",
    score: sumDice,
  },
];

const SCORE_CATEGORIES = [...UPPER_CATEGORIES, ...LOWER_CATEGORIES];
const INITIAL_DICE = [1, 2, 3, 4, 5];

function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
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

function hasCount(dice: number[], count: number) {
  return Object.values(countFaces(dice)).some((value) => value >= count);
}

function isFullHouse(dice: number[]) {
  const counts = Object.values(countFaces(dice)).sort((a, b) => a - b);
  return counts.length === 2 && counts[0] === 2 && counts[1] === 3;
}

function hasStraight(dice: number[], length: 4 | 5) {
  const unique = Array.from(new Set(dice)).sort((a, b) => a - b);
  const runs = length === 4 ? [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6]] : [[1, 2, 3, 4, 5], [2, 3, 4, 5, 6]];
  return runs.some((run) => run.every((value) => unique.includes(value)));
}

function makeEmptyScores() {
  return Object.fromEntries(SCORE_CATEGORIES.map((category) => [category.id, null])) as Record<string, number | null>;
}

function upperScore(scores: Record<string, number | null>) {
  return UPPER_CATEGORIES.reduce((sum, category) => sum + (scores[category.id] ?? 0), 0);
}

function lowerScore(scores: Record<string, number | null>) {
  return LOWER_CATEGORIES.reduce((sum, category) => sum + (scores[category.id] ?? 0), 0);
}

export function YachtDiceTestScreen({ onBack }: YachtDiceTestScreenProps) {
  const [dice, setDice] = useState(INITIAL_DICE);
  const [locked, setLocked] = useState<boolean[]>(Array(DICE_COUNT).fill(false));
  const [rollCount, setRollCount] = useState(0);
  const [rolling, setRolling] = useState(false);
  const [revealed, setRevealed] = useState(true);
  const [scores, setScores] = useState(() => makeEmptyScores());
  const [message, setMessage] = useState("投掷 5 颗骰子开始本回合。");

  const usedCount = SCORE_CATEGORIES.filter((category) => scores[category.id] !== null).length;
  const round = Math.min(usedCount + 1, SCORE_CATEGORIES.length);
  const upper = upperScore(scores);
  const upperBonus = upper >= 63 ? 35 : 0;
  const lower = lowerScore(scores);
  const total = upper + upperBonus + lower;
  const gameOver = usedCount === SCORE_CATEGORIES.length;

  const availableScores = useMemo(
    () => Object.fromEntries(SCORE_CATEGORIES.map((category) => [category.id, category.score(dice)])),
    [dice],
  );

  function resetGame() {
    setDice(INITIAL_DICE);
    setLocked(Array(DICE_COUNT).fill(false));
    setRollCount(0);
    setRolling(false);
    setRevealed(true);
    setScores(makeEmptyScores());
    setMessage("投掷 5 颗骰子开始本回合。");
  }

  function rollDice() {
    if (rolling || gameOver || rollCount >= MAX_ROLLS) return;

    const nextDice = dice.map((value, index) => (locked[index] && rollCount > 0 ? value : rollD6()));
    setDice(nextDice);
    setRolling(true);
    setRevealed(false);
    setMessage("骰子滚动中。");

    window.setTimeout(() => {
      setRolling(false);
      window.setTimeout(() => {
        setRevealed(true);
        setRollCount((count) => count + 1);
        setMessage("可以锁定骰子、继续投掷，或选择一个计分格。");
      }, 420);
    }, 920);
  }

  function toggleLock(index: number) {
    if (rolling || rollCount === 0 || gameOver) return;
    setLocked((prev) => prev.map((value, itemIndex) => (itemIndex === index ? !value : value)));
  }

  function scoreCategory(category: ScoreCategory) {
    if (rolling || gameOver || rollCount === 0 || scores[category.id] !== null) return;

    const score = category.score(dice);
    setScores((prev) => ({ ...prev, [category.id]: score }));
    setLocked(Array(DICE_COUNT).fill(false));
    setRollCount(0);
    setRevealed(true);
    setMessage(`已将 ${score} 分填入「${category.label}」。`);
  }

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
            <p className="eyebrow">YACHT DICE</p>
            <h1>快艇骰子</h1>
          </div>
          <div className="yacht-header-actions">
            <button type="button" className="ghost-button" onClick={resetGame}>
              新局
            </button>
            <button type="button" className="ghost-button" onClick={onBack}>
              返回
            </button>
          </div>
        </header>

        <div className="yacht-game-grid">
          <section className="yacht-play-panel" aria-label="快艇骰子游戏区">
            <div className="yacht-status-row">
              <div>
                <span>第 {round}/{SCORE_CATEGORIES.length} 回合</span>
                <b>投掷 {rollCount}/{MAX_ROLLS}</b>
              </div>
              <strong>总分 {total}</strong>
            </div>

            <div className="yacht-dice-row" aria-label="五颗骰子">
              {dice.map((value, index) => (
                <button
                  key={index}
                  type="button"
                  className={`yacht-die ${locked[index] ? "is-locked" : ""}`}
                  onClick={() => toggleLock(index)}
                  disabled={rolling || rollCount === 0 || gameOver}
                >
                  <Dice3DView
                    dieType="d6"
                    roll={value}
                    rolling={rolling && !(locked[index] && rollCount > 0)}
                    revealed={revealed || locked[index]}
                    size={132}
                    className="yacht-dice-canvas"
                  />
                  <span>{locked[index] ? "已锁定" : rollCount === 0 ? "待投掷" : "可锁定"}</span>
                </button>
              ))}
            </div>

            <div className="yacht-control-row">
              <button
                type="button"
                className="start-button"
                onClick={rollDice}
                disabled={rolling || gameOver || rollCount >= MAX_ROLLS}
              >
                {rollCount === 0 ? "投掷骰子" : rollCount >= MAX_ROLLS ? "选择计分格" : "继续投掷"}
              </button>
              <p>{gameOver ? `游戏结束，最终得分 ${total}。` : message}</p>
            </div>

            <section className="yacht-rules-panel" aria-label="快艇骰子规则">
              <h2>游戏规则</h2>
              <p>快艇骰子使用 5 颗六面骰。玩家要在 13 个回合内把每个计分格各填写一次，最终总分越高越好。</p>
              <ol>
                <li>每回合最多可以投掷 3 次。第一次必须投全部 5 颗骰子。</li>
                <li>第一次投掷后，可以点击骰子将它锁定。锁定的骰子不会在下一次投掷中变化。</li>
                <li>你可以随时解锁骰子，只要本回合还没选择计分格。</li>
                <li>完成任意一次投掷后，必须选择一个尚未使用的计分格。该格分数可能是 0 分。</li>
                <li>计分后进入下一回合，所有骰子解除锁定，投掷次数归零。</li>
              </ol>
              <h3>上半区与奖励</h3>
              <p>一到六点只计算对应点数的骰子总和。上半区合计达到 63 分时，额外获得 35 分奖励。</p>
              <h3>下半区组合</h3>
              <p>三条/四条要求至少 3 或 4 颗同点，得全部骰子总和。葫芦固定 25 分，小顺固定 30 分，大顺固定 40 分，五颗同点的快艇固定 50 分，机会直接计算总和。</p>
            </section>
          </section>

          <ScoreTable
            scores={scores}
            availableScores={availableScores}
            rollCount={rollCount}
            rolling={rolling}
            gameOver={gameOver}
            upper={upper}
            upperBonus={upperBonus}
            lower={lower}
            total={total}
            onScore={scoreCategory}
          />
        </div>
      </motion.section>
    </main>
  );
}

function ScoreTable({
  scores,
  availableScores,
  rollCount,
  rolling,
  gameOver,
  upper,
  upperBonus,
  lower,
  total,
  onScore,
}: {
  scores: Record<string, number | null>;
  availableScores: Record<string, number>;
  rollCount: number;
  rolling: boolean;
  gameOver: boolean;
  upper: number;
  upperBonus: number;
  lower: number;
  total: number;
  onScore: (category: ScoreCategory) => void;
}) {
  return (
    <aside className="yacht-score-panel" aria-label="计分表">
      <header>
        <span>计分表</span>
        <small>每格只能选择一次</small>
      </header>

      <ScoreSection
        title="上半区"
        categories={UPPER_CATEGORIES}
        scores={scores}
        availableScores={availableScores}
        rollCount={rollCount}
        rolling={rolling}
        gameOver={gameOver}
        onScore={onScore}
      />
      <div className="yacht-score-total-row">
        <span>上半区合计</span>
        <b>{upper}</b>
      </div>
      <div className="yacht-score-total-row">
        <span>奖励 63+</span>
        <b>{upperBonus}</b>
      </div>

      <ScoreSection
        title="下半区"
        categories={LOWER_CATEGORIES}
        scores={scores}
        availableScores={availableScores}
        rollCount={rollCount}
        rolling={rolling}
        gameOver={gameOver}
        onScore={onScore}
      />
      <div className="yacht-score-total-row">
        <span>下半区合计</span>
        <b>{lower}</b>
      </div>
      <div className="yacht-grand-total">
        <span>总分</span>
        <b>{total}</b>
      </div>
    </aside>
  );
}

function ScoreSection({
  title,
  categories,
  scores,
  availableScores,
  rollCount,
  rolling,
  gameOver,
  onScore,
}: {
  title: string;
  categories: ScoreCategory[];
  scores: Record<string, number | null>;
  availableScores: Record<string, number>;
  rollCount: number;
  rolling: boolean;
  gameOver: boolean;
  onScore: (category: ScoreCategory) => void;
}) {
  return (
    <section className="yacht-score-section">
      <h2>{title}</h2>
      {categories.map((category) => {
        const scored = scores[category.id] !== null;
        return (
          <button
            key={category.id}
            type="button"
            className={`yacht-score-row ${scored ? "is-scored" : ""}`}
            disabled={scored || rolling || gameOver || rollCount === 0}
            onClick={() => onScore(category)}
          >
            <span>
              <b>{category.label}</b>
              <small>{category.description}</small>
            </span>
            <strong>{scored ? scores[category.id] : rollCount > 0 ? availableScores[category.id] : "-"}</strong>
          </button>
        );
      })}
    </section>
  );
}
