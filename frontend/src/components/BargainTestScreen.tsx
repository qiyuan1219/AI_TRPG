import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { judgeBargain, type BargainJudgeResult } from "../services/api";
import type { DiceResult } from "../types/game";
import { Dice3DView, DiceRollOverlay } from "./DiceRollOverlay";

interface BargainTestScreenProps {
  onBack: () => void;
}

interface BargainItem {
  id: string;
  name: string;
  desc: string;
  basePrice: number;
  bossMood: string;
}

interface BargainRound {
  id: number;
  attempt: number;
  roll: number;
  bonus: number;
  total: number;
  words: string;
  result: BargainJudgeResult;
  priceBefore: number;
}

const MAX_ATTEMPTS = 5;
const BARGAIN_BONUS = 3;
const PHRASE_COUNT = 3;

const BARGAIN_ITEMS: BargainItem[] = [
  { id: "blackstone-knife", name: "黑石短匕", desc: "刀脊有微弱时间纹，刀身泛冷光。老板坚称只卖给懂行的人。", basePrice: 180, bossMood: "靠在柜台上打量你，手指敲着黑曜石算盘" },
  { id: "spore-lamp", name: "冷光孢灯", desc: "无光孢海常用灯具，能压低小型魔物的攻击性。底部铭刻逆穹城匠炉区标记。", basePrice: 95, bossMood: "从货架高处取下孢灯，吹了吹灯罩上的灰" },
  { id: "seal-map", name: "旧远征封蜡地图", desc: "标着孢海据点和黑暗之门，封蜡已碎了一半。真假难辨，但纸质显然很老。", basePrice: 260, bossMood: "把地图摊在柜台上，用镇纸压住卷角——然后抱臂站着，似乎不急着卖" },
];

/* ---- 本地话术生成器：根据物品、报价、已用次数生成3句不同策略的话术 ---- */
type PhraseStrategy = "flaw" | "rapport" | "walk" | "expert" | "bundle" | "future";

const STRATEGY_CN: Record<PhraseStrategy, string> = {
  flaw: "挑毛病",
  rapport: "套近乎",
  walk: "压价离开",
  expert: "行家视角",
  bundle: "打包还价",
  future: "长远交易",
};

function pickWeighted(available: PhraseStrategy[]): PhraseStrategy {
  const idx = Math.floor(Math.random() * available.length);
  return available[idx];
}

function generatePhrases(item: BargainItem, currentPrice: number, attempt: number): { text: string; strategy: PhraseStrategy }[] {
  const n = item.name;
  const p = currentPrice;
  const bp = item.basePrice;
  const templates: Record<PhraseStrategy, string[]> = {
    flaw: [
      `${n}是不错，但这刀鞘上的裂隙纹路一看就是受过暗影腐蚀。说实话，${p}金有点高了。`,
      `老板，这${n}我上手掂了掂，重心偏左。锻造的时候淬火不匀吧？${p}金这个价不太对。`,
      `${n}好是好，可你看这边缘，明显是二手转了好几道才到你柜台上。真按${p}金收，我亏了。`,
    ],
    rapport: [
      `巴托克老板，我上次从你这里拿的解毒剂救了条命。${n}给我个老客价，以后还来。`,
      `老板，咱们别按外人的价谈。${n}你给我个实在数，我在孢海捞到好东西第一个送你柜上。`,
      `我知道你从匠炉区拿这批货也不容易。${n} ${p}金——你再让一步，我也不多磨。`,
    ],
    walk: [
      `算了，${n} ${p}金这个价我去匠炉区能买两把新的。不降的话我这就走。`,
      `${p}金？老板，这价我再走两条街能在补给市场找到带附魔的。你诚不诚心卖？`,
      `不降就算了。${n}我再看看别家，黑市又不是只有你一个柜台。`,
    ],
    expert: [
      `我在无光孢海待过三个月。${n}的充能核心在这种湿度下最多撑四十个钟头。${p}金——按使用寿命折一下。`,
      `老板，这种黑石矿是孢海深层才有的脉。最近地脉震动加剧，矿源断了好几处。${n} ${bp}金的标价我理解，但${p}金按现在的采掘成本已经不亏了。`,
      `${n}的封蜡用的是旧纪元配方，防潮但脆。我刚才看了，已经有两条裂纹。${p}金你得再让一点。`,
    ],
    bundle: [
      `${n}我确实需要。这样：再加一瓶基础治疗药水，总共给你${Math.round(p * 1.3)}金。`,
      `老板，${n}我拿了。你再搭一个我看看——反正也是滞销货。${p}金我一口价不还。`,
      `不单买了。${n}加上冷光孢灯，打包一个远征补给价。你报个数。`,
    ],
    future: [
      `我明天就下孢海。${n}给我个能再来找你的价——我探到的矿石情报、远征队活动规律，回来先给你。`,
      `老板你在这柜台后打听消息不容易。${n}让一步，我帮你留意匠炉区新到的附魔武器报价。`,
      `实话跟你讲，我这趟去孢海东部。那边有处还没标在地图上的菌脉。${n}给我实惠价，菌脉坐标我标注给你。`,
    ],
  };

  // 根据尝试次数动态选择策略：前期多用 rapport/future，后期多用 walk/flaw
  const pool: PhraseStrategy[] =
    attempt <= 1 ? ["rapport", "expert", "future", "rapport", "flaw"] :
    attempt <= 3 ? ["flaw", "expert", "walk", "bundle", "future"] :
    ["walk", "flaw", "flaw", "expert", "walk"];

  const used = new Set<PhraseStrategy>();
  const results: { text: string; strategy: PhraseStrategy }[] = [];

  for (let i = 0; i < PHRASE_COUNT; i++) {
    const available = pool.filter((s) => !used.has(s));
    if (!available.length) break;
    const strategy = pickWeighted(available);
    used.add(strategy);
    const poolTemplates = templates[strategy];
    results.push({
      text: poolTemplates[Math.floor(Math.random() * poolTemplates.length)],
      strategy,
    });
  }

  return results;
}

function rollD20() {
  return Math.floor(Math.random() * 20) + 1;
}

function makeDiceResult(roll: number, total: number): DiceResult {
  return {
    type: "skill_check",
    data: {
      骰子: "D20",
      属性: "黑市讲价",
      掷骰: `D20=${roll}`,
      加值: BARGAIN_BONUS,
      总计: total,
      DC: 15,
      成功: total >= 15,
      id: Date.now(),
    },
  };
}

export function BargainTestScreen({ onBack }: BargainTestScreenProps) {
  const [itemId, setItemId] = useState(BARGAIN_ITEMS[0].id);
  const selectedItem = useMemo(() => BARGAIN_ITEMS.find((item) => item.id === itemId) ?? BARGAIN_ITEMS[0], [itemId]);
  const [currentPrice, setCurrentPrice] = useState(selectedItem.basePrice);
  const [rounds, setRounds] = useState<BargainRound[]>([]);
  const [activeDice, setActiveDice] = useState<DiceResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [bossMessage, setBossMessage] = useState("");
  const [selectedPhrase, setSelectedPhrase] = useState<string>("");
  const [diceRolled, setDiceRolled] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);

  const attemptsUsed = rounds.length;
  const patienceLost = attemptsUsed >= MAX_ATTEMPTS;
  const floorPrice = Math.round(selectedItem.basePrice * 0.55);
  const lastRound = rounds[rounds.length - 1];

  // 生成3句话术选项
  const phrases = useMemo(
    () => generatePhrases(selectedItem, currentPrice, attemptsUsed),
    [selectedItem.id, currentPrice, attemptsUsed],
  );

  function resetForItem(nextItemId = itemId) {
    const nextItem = BARGAIN_ITEMS.find((item) => item.id === nextItemId) ?? BARGAIN_ITEMS[0];
    setItemId(nextItem.id);
    setCurrentPrice(nextItem.basePrice);
    setRounds([]);
    setActiveDice(null);
    setBusy(false);
    setBossMessage("");
    setSelectedPhrase("");
    setDiceRolled(false);
    setLastRoll(null);
  }

  // 选择话术 → 自动投骰
  const pickPhrase = useCallback(
    (phrase: string) => {
      if (busy || patienceLost) return;
      setSelectedPhrase(phrase);
      const roll = rollD20();
      const total = roll + BARGAIN_BONUS;
      setLastRoll(roll);
      setDiceRolled(true);
      setActiveDice(makeDiceResult(roll, total));
    },
    [busy, patienceLost],
  );

  // 骰子展示后自动提交
  const submitWithRoll = useCallback(
    async (roll: number, phrase: string) => {
      const total = roll + BARGAIN_BONUS;
      const attempt = attemptsUsed + 1;
      const priceBefore = currentPrice;

      setBusy(true);
      setBossMessage("老板眯着眼看了看骰点，又看了看你……");

      try {
        const result = await judgeBargain({
          item_name: selectedItem.name,
          base_price: selectedItem.basePrice,
          current_price: currentPrice,
          attempt,
          max_attempts: MAX_ATTEMPTS,
          roll,
          bonus: BARGAIN_BONUS,
          total,
          player_words: phrase,
          history: rounds.slice(-5).map((r) => ({
            attempt: r.attempt,
            total: r.total,
            words: r.words,
            agreed: r.result.agreed,
            discount: r.result.discount,
            new_price: r.result.new_price,
          })),
        });

        setCurrentPrice(result.new_price);
        setRounds((prev) => [
          ...prev,
          { id: Date.now(), attempt, roll, bonus: BARGAIN_BONUS, total, words: phrase, result, priceBefore },
        ]);
        setBossMessage(result.boss_reply);
      } catch {
        setBossMessage(`老板：「信号断了——但这轮我听到了。价钱不动，还是 ${currentPrice} 金。」`);
      } finally {
        setBusy(false);
        setDiceRolled(false);
        setLastRoll(null);
      }
    },
    [attemptsUsed, busy, currentPrice, patienceLost, rounds, selectedItem],
  );

  // 骰子展示完成后自动提交
  const onDiceClose = useCallback(() => {
    setActiveDice(null);
    if (lastRoll != null && selectedPhrase) {
      const r = lastRoll;
      const p = selectedPhrase;
      setSelectedPhrase("");
      setLastRoll(null);
      submitWithRoll(r, p);
    }
  }, [lastRoll, selectedPhrase, submitWithRoll]);

  return (
    <main className="bargain-vn-screen">
      {/* 背景层 */}
      <div className="bargain-vn-bg" />
      <div className="bargain-vn-vignette" />

      <header className="bargain-vn-header">
        <button type="button" className="ghost-button" onClick={onBack}>← 返回</button>
        <span>黑市讲价 · 鼠巷</span>
        <div className="bargain-vn-currency">💰 {currentPrice}G</div>
      </header>

      {/* 主舞台：老板区域 */}
      <section className="bargain-vn-stage">
        {/* 商品切换 */}
        <div className="bargain-vn-items">
          {BARGAIN_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={item.id === selectedItem.id ? "is-active" : ""}
              onClick={() => resetForItem(item.id)}
              disabled={busy}
            >
              {item.name} <em>{item.basePrice}G</em>
            </button>
          ))}
        </div>

        {/* 老板立绘 + 对话气泡 */}
        <div className="bargain-vn-boss-row">
          {busy && <div className="bargain-vn-dice-spin">🎲 投骰中…</div>}
          <div className="bargain-vn-boss-portrait">
            <div className="bargain-vn-boss-face">
              <span>🧔‍♂️</span>
              <small>巴托克</small>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={bossMessage || "empty"}
              className="bargain-vn-boss-bubble"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {bossMessage ? (
                <p>{bossMessage}</p>
              ) : (
                <p className="muted">{selectedItem.bossMood}。</p>
              )}
              {lastRound && (
                <span className={`bargain-vn-tag ${lastRound.result.agreed ? "agree" : "reject"}`}>
                  {lastRound.result.agreed
                    ? `↓ ${lastRound.result.discount}G · ${lastRound.result.mood}`
                    : `未降价 · ${lastRound.result.mood}`}
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 讲价记录时间线 */}
        {rounds.length > 0 && (
          <div className="bargain-vn-timeline">
            {rounds.map((r) => (
              <div key={r.id} className={`bargain-vn-timeline-item ${r.result.agreed ? "agree" : "reject"}`}>
                <span className="bargain-vn-timeline-num">#{r.attempt}</span>
                <span className="bargain-vn-timeline-dice">🎲{r.total}</span>
                <span className="bargain-vn-timeline-words">{r.words.slice(0, 28)}…</span>
                <span className="bargain-vn-timeline-price">{r.result.new_price}G</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 底部：话术选项 */}
      <section className="bargain-vn-actions">
        {patienceLost ? (
          <div className="bargain-vn-gameover">
            <p>老板摆了摆手：「行了，就这个价。爱要不要。」</p>
            <p className="muted">最终成交价：{currentPrice}G（共讲价 {attemptsUsed} 次）</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 8 }}>
              <button type="button" className="ghost-button" onClick={onBack}>返回菜单</button>
            </div>
          </div>
        ) : diceRolled ? (
          <div className="bargain-vn-waiting">
            <p>🎲 骰子已投出，老板正在判断…</p>
          </div>
        ) : (
          <>
            <p className="bargain-vn-prompt">
              选择你的讲价话术 <small>（第 {attemptsUsed + 1}/{MAX_ATTEMPTS} 次）</small>
            </p>
            <div className="bargain-vn-choices">
              {phrases.map((ph, i) => (
                <button
                  key={i}
                  type="button"
                  className="bargain-vn-choice"
                  onClick={() => pickPhrase(ph.text)}
                  disabled={busy}
                >
                  <span className="bargain-vn-choice-tag">{STRATEGY_CN[ph.strategy]}</span>
                  <span>{ph.text}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      {/* 3D 骰子覆盖层 */}
      <DiceRollOverlay dice={activeDice} dieType="d20" onClose={onDiceClose} />
    </main>
  );
}
