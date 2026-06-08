import { useMemo, useRef, useState, type MutableRefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  { label: "快艇", score: "800+", sample: "五颗同点" },
  { label: "四条", score: "700+", sample: "四颗同点" },
  { label: "葫芦", score: "600+", sample: "三条+一对" },
  { label: "顺子", score: "500+", sample: "1-5或2-6" },
  { label: "三条", score: "400+", sample: "三颗同点" },
  { label: "两对", score: "300+", sample: "两组对子" },
  { label: "一对", score: "200+", sample: "一组对子" },
  { label: "散牌", score: "100+", sample: "比最高点" },
];

const OUTCOME_CACHE = new Map<number, number[][]>();

function rollDie(sides: number) { return Math.floor(Math.random() * sides) + 1; }
function rollD6() { return rollDie(6); }
function rollD20() { return rollDie(20); }
function rollFiveDice() { return Array.from({ length: DICE_COUNT }, rollD6); }
function sumDice(dice: number[]) { return dice.reduce((sum, v) => sum + v, 0); }

function countFaces(dice: number[]) {
  return dice.reduce<Record<number, number>>((c, v) => { c[v] = (c[v] ?? 0) + 1; return c; }, {});
}

function sortedDice(dice: number[]) { return [...dice].sort((a, b) => b - a); }
function hasStraight(dice: number[]) {
  const u = Array.from(new Set(dice)).sort((a, b) => a - b);
  if ([1,2,3,4,5].every(v => u.includes(v))) return 5;
  if ([2,3,4,5,6].every(v => u.includes(v))) return 6;
  return 0;
}

function scoreFrom(rank: number, tieBreak: number[]) { return rank * 100 + (tieBreak[0] ?? 0); }

function evaluateHand(dice: number[]): HandScore {
  const counts = Object.entries(countFaces(dice)).map(([f,c]) => ({ face: Number(f), count: c })).sort((a,b) => b.count - a.count || b.face - a.face);
  const pairs = counts.filter(i => i.count >= 2).sort((a,b) => b.face - a.face);
  const sorted = sortedDice(dice);
  const straightHigh = hasStraight(dice);
  const yacht = counts.find(i => i.count === 5);
  if (yacht) return { label:"快艇", rank:8, score:scoreFrom(8,[yacht.face]), detail:`五颗${yacht.face}点`, tieBreak:[yacht.face] };
  const four = counts.find(i => i.count === 4);
  if (four) { const k = sorted.find(v => v !== four.face) ?? 0; return { label:"四条", rank:7, score:scoreFrom(7,[four.face,k]), detail:`四颗${four.face}点`, tieBreak:[four.face,k] }; }
  const triple = counts.find(i => i.count === 3);
  const pfh = pairs.find(i => i.face !== triple?.face);
  if (triple && pfh) return { label:"葫芦", rank:6, score:scoreFrom(6,[triple.face,pfh.face]), detail:`${triple.face}点三条+${pfh.face}点对子`, tieBreak:[triple.face,pfh.face] };
  if (straightHigh) return { label:"顺子", rank:5, score:scoreFrom(5,[straightHigh]), detail:straightHigh===6?"2-6":"1-5", tieBreak:[straightHigh] };
  if (triple) { const ks = sorted.filter(v => v!==triple.face); return { label:"三条", rank:4, score:scoreFrom(4,[triple.face,...ks]), detail:`三颗${triple.face}点`, tieBreak:[triple.face,...ks] }; }
  if (pairs.length >= 2) { const pf = pairs.slice(0,2).map(i=>i.face).sort((a,b)=>b-a); const k = sorted.find(v=>!pf.includes(v))??0; return { label:"两对", rank:3, score:scoreFrom(3,[...pf,k]), detail:`${pf[0]}+${pf[1]}对子`, tieBreak:[...pf,k] }; }
  if (pairs.length === 1) { const pf = pairs[0].face; const ks = sorted.filter(v=>v!==pf); return { label:"一对", rank:2, score:scoreFrom(2,[pf,...ks]), detail:`${pf}点对子`, tieBreak:[pf,...ks] }; }
  return { label:"散牌", rank:1, score:scoreFrom(1,sorted), detail:`最高${sorted[0]}点`, tieBreak:sorted };
}

function compareHands(a: HandScore, b: HandScore) {
  if (a.rank !== b.rank) return a.rank > b.rank ? 1 : -1;
  for (let i = 0; i < Math.max(a.tieBreak.length, b.tieBreak.length); i++) {
    const va = a.tieBreak[i] ?? 0, vb = b.tieBreak[i] ?? 0;
    if (va !== vb) return va > vb ? 1 : -1;
  }
  return 0;
}

function outcomeFromCompare(c: number): Winner { return c > 0 ? "player" : c < 0 ? "enemy" : "draw"; }

function longestStraightRun(dice: number[]) {
  const u = Array.from(new Set(dice)).sort((a,b)=>a-b);
  let best: number[] = [], cur: number[] = [];
  u.forEach(v => { if (!cur.length || v === cur[cur.length-1]+1) cur.push(v); else { if (cur.length>best.length) best=cur; cur=[v]; } });
  if (cur.length>best.length) best=cur;
  return best;
}

function chooseEnemyLocks(dice: number[]) {
  const h = evaluateHand(dice); if (h.rank>=5) return dice.map(()=>true);
  const counts = Object.entries(countFaces(dice)).map(([f,c])=>({face:Number(f),count:c})).sort((a,b)=>b.count-a.count||b.face-a.face);
  const tg = counts[0]; if (tg.count>=2) return dice.map(v=>v===tg.face);
  const run = longestStraightRun(dice); if (run.length>=3) { const sf = new Set(run); return dice.map(v=>sf.has(v)); }
  const mx = Math.max(...dice); return dice.map(v=>v===mx);
}

function buildResultText(w: Winner, p: HandScore, e: HandScore) {
  if (w==="draw") return `平局：双方都是${p.label}`;
  if (w==="player") return p.label===e.label ? `我方获胜！同为${p.label}，我方关键点更高` : `我方获胜！${p.label} 压过敌方 ${e.label}`;
  return p.label===e.label ? `敌方获胜：同为${e.label}，敌方关键点更高` : `敌方获胜：${e.label} 压过我方 ${p.label}`;
}

function clearTimers(ref: MutableRefObject<number[]>) { ref.current.forEach(t=>clearTimeout(t)); ref.current=[]; }

function revealCountFromTotal(total: number) { if (total>=24) return 5; if (total>=21) return 4; if (total>=18) return 3; return 2; }
function randomRevealIndexes(count: number) {
  const idx = [0,1,2,3,4]; for (let i=idx.length-1;i>0;i--){const s=Math.floor(Math.random()*(i+1));[idx[i],idx[s]]=[idx[s],idx[i]];}
  return idx.slice(0,count).sort((a,b)=>a-b);
}

function diceOutcomes(count: number): number[][] {
  const cached = OUTCOME_CACHE.get(count); if (cached) return cached;
  if (count===0) return [[]];
  const prev = diceOutcomes(count-1); const outcomes: number[][] = [];
  prev.forEach(items => { for (let f=1;f<=6;f++) outcomes.push([...items,f]); });
  OUTCOME_CACHE.set(count, outcomes); return outcomes;
}

function projectEnemyHand(ed: number[], revealed: number[]) {
  if (revealed.length===5) return evaluateHand(ed); if (!revealed.length) return null;
  const rd = revealed.map(i=>ed[i]); const proj = [...rd];
  const counts = Object.entries(countFaces(rd)).map(([f,c])=>({face:Number(f),count:c})).sort((a,b)=>b.count-a.count||b.face-a.face);
  const bf = counts[0]?.face ?? Math.max(...rd);
  while (proj.length<DICE_COUNT) proj.push(bf);
  return evaluateHand(proj);
}

function describeEnemyRead(ed: number[], revealed: number[], settled: boolean) {
  if (settled||revealed.length===5) return `敌方完整牌型：${evaluateHand(ed).label}`;
  if (!revealed.length) return "瑟琳还未获取敌骰情报";
  const rd = revealed.map(i=>ed[i]); const pr = projectEnemyHand(ed,reversed);
  return `已透露 #${reversed.map(i=>i+1).join("/")}：${rd.join("/")}，推测追${pr?.label??"高点"}`;
}

function analyzeBestReroll(pd: number[], ed: number[], revealed: number[], exact: boolean): AdvisorPlan {
  const target = exact ? evaluateHand(ed) : projectEnemyHand(ed,revealed);
  let best: AdvisorPlan | null = null;
  for (let mask=0; mask<1<<DICE_COUNT; mask++) {
    const km = Array.from({length:DICE_COUNT},(_,i)=>Boolean(mask&(1<<i)));
    const ri = km.map((k,i)=>(!k?i:-1)).filter(i=>i>=0);
    const outcomes = diceOutcomes(ri.length); let ts=0, wins=0;
    outcomes.forEach(out => {
      const nd = [...pd]; ri.forEach((di,oi)=>{nd[di]=out[oi];});
      const h = evaluateHand(nd); ts+=h.score;
      if (target && compareHands(h,target)>0) wins++;
    });
    const es = ts/outcomes.length, wr = target?wins/outcomes.length:undefined;
    const rv = (wr??0)*1000+es, bv = (best?.winRate??0)*1000+(best?.expectedScore??0);
    if (!best||rv>bv) best = { keepMask:km, rerollIndexes:ri, expectedScore:es, winRate:wr, headline:"", detail:"" };
  }
  const ch = evaluateHand(pd);
  const rt = best?.rerollIndexes.length ? `建议重掷 #${best.rerollIndexes.map(i=>i+1).join("/")}` : "建议不重掷直接结算";
  const tt = target ? `目标≈${target.label}，胜率${Math.round((best?.winRate??0)*100)}%` : "敌骰信息不足，按期望分最大化";
  return { ...(best??{keepMask:Array(DICE_COUNT).fill(true),rerollIndexes:[],expectedScore:ch.score,winRate:undefined,headline:"",detail:""}), headline:`${rt}。当前${ch.label}`, detail:`${tt}。期望分≈${Math.round(best?.expectedScore??ch.score)}` };
}

function buildYachtAtmosphere({ sessionState, roundNumber, playerHand, enemyHand, revealedCount, advisorPlan, serlynCheck, roundWinner, rerollsLeft }: {
  sessionState: SessionState; roundNumber: number; playerHand: HandScore; enemyHand: HandScore; revealedCount: number;
  advisorPlan: AdvisorPlan | null; serlynCheck: CheckResult | null; roundWinner: Winner | null; rerollsLeft: number;
}) {
  if (sessionState==="idle") return "萨洛把骰盅往桌上一扣，笑着等你付入场费。瑟琳没有催促，只在观察老板的手势。";
  if (sessionState==="prep") {
    if (!serlynCheck) return `第${roundNumber}轮开局前——让瑟琳偷偷看牌，还是用话术多争取一次重掷？`;
    if (serlynCheck.kind==="stealth") return serlynCheck.success ? `瑟琳从灯影里退回来：至少能揭开${serlynCheck.revealCount??0}颗敌骰。` : "瑟琳摇摇头：老板盯太紧，不建议再冒险。";
    return serlynCheck.success ? "瑟琳把话题绕到老板年轻时的胜局，老板松口多给一次重掷。" : "老板笑着收回骰盅。瑟琳轻叹：人情牌没打动他。";
  }
  if (sessionState==="playing") {
    if (advisorPlan) return revealedCount ? `瑟琳补齐情报，AI参谋建议${advisorPlan.headline}` : `敌骰仍盖着，还剩${rerollsLeft}次重掷。AI按期望收益推演。`;
    return "骰子还在桌面滚动，萨洛手指敲着木边等你决定。";
  }
  if (sessionState==="round-settled") {
    if (roundWinner==="player") return `我方${playerHand.label}压住敌方${enemyHand.label}！萨洛挑眉看奖池——见好就收，还是翻倍继续？`;
    if (roundWinner==="enemy") return `敌方${enemyHand.label}反压我方${playerHand.label}。瑟琳提醒：求情判定能把本局拉回来。`;
    return `双方同为${playerHand.label}，赌桌短暂安静。`;
  }
  if (sessionState==="cashed-out") return "你收起奖池，萨洛吹声口哨。瑟琳把这场记成一次还算漂亮的情报演练。";
  return "赌局气氛沉了下去。老板收回骰盅。";
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
  const [message, setMessage] = useState("支付 50G 入场费后开始快艇赌局，最多三轮。");
  const [showRules, setShowRules] = useState(false);
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
  const atmosphere = useMemo(
    () => buildYachtAtmosphere({ sessionState, roundNumber, playerHand, enemyHand, revealedCount: revealedEnemyIndexes.length, advisorPlan, serlynCheck, roundWinner, rerollsLeft }),
    [advisorPlan, enemyHand, playerHand, revealedEnemyIndexes.length, rerollsLeft, roundNumber, roundWinner, serlynCheck, sessionState],
  );
  const prize = stake * 2;

  function resetRoundState(next: string) {
    clearTimers(timerRef);
    setPlayerDice(INITIAL_DICE); setEnemyDice(INITIAL_DICE);
    setPlayerLocked(DEFAULT_PLAYER_KEEP_MASK); setEnemyLocked(DEFAULT_LOCK_MASK);
    setRevealedEnemyIndexes([]); setRollCount(0); setRolling(false); setRevealed(false);
    setSerlynCheck(null); setSerlynSkipped(false); setBonusRerolls(0);
    setPleaCheck(null); setRoundWinner(null); setMessage(next);
  }

  function resetGame() { clearTimers(timerRef); setGold(STARTING_GOLD); setSessionState("idle"); setRoundNumber(1); setStake(ENTRY_FEE); resetRoundState("支付 50G 入场费后开始快艇赌局，最多三轮。"); }

  function enterGame() { if (gold<ENTRY_FEE) return; setGold(c=>c-ENTRY_FEE); setSessionState("prep"); setRoundNumber(1); setStake(ENTRY_FEE); resetRoundState("已付 50G。每轮开骰前让瑟琳选择潜行偷窥或人情说服。"); }

  function runSerlynCheck(kind: SerlynAction) {
    if (sessionState!=="prep"||serlynCheck?.rolling||serlynCheck||serlynSkipped) return;
    clearTimers(timerRef);
    const roll = rollD20(), bonus = kind==="stealth"?SERLYN_STEALTH_BONUS:SERLYN_FAVOR_BONUS;
    const dc = kind==="stealth"?STEALTH_DC:FAVOR_DC, total = roll+bonus;
    const success = roll===20||(roll!==1&&total>=dc), rc = kind==="stealth"&&success?revealCountFromTotal(total):0;
    setSerlynCheck({kind,roll,total,success,rolling:true,revealCount:rc});
    const t = window.setTimeout(()=>{
      setSerlynCheck({kind,roll,total,success,rolling:false,revealCount:rc});
      if (kind==="stealth") setMessage(success?`潜行成功：${total}点，可透露${rc}颗敌骰`:`潜行失败：${total}点`);
      else { setBonusRerolls(success?EXTRA_REROLL_FROM_FAVOR:0); setMessage(success?`人情成功：${total}点，额外+1重掷`:`人情失败：${total}点`); }
    },1150);
    timerRef.current.push(t);
  }

  function skipSerlynAction() { if (sessionState!=="prep"||serlynCheck||serlynSkipped) return; setSerlynSkipped(true); setMessage("本轮不使用瑟琳协助，直接开骰。"); }

  function finishRolling(next: string) { const t=window.setTimeout(()=>{setRolling(false);setRevealed(true);setMessage(next);},960); timerRef.current.push(t); }

  function startRound() {
    if (!canStartRound) return; clearTimers(timerRef);
    const ned = rollFiveDice(), rc = serlynCheck?.kind==="stealth"&&serlynCheck.success?serlynCheck.revealCount??0:0;
    setPlayerDice(rollFiveDice()); setEnemyDice(ned);
    setPlayerLocked(DEFAULT_PLAYER_KEEP_MASK); setEnemyLocked(DEFAULT_LOCK_MASK);
    setRevealedEnemyIndexes(rc?randomRevealIndexes(rc):[]); setRollCount(1); setRolling(true); setRevealed(false); setSessionState("playing");
    finishRolling(rc?"AI建议已根据瑟琳情报更新":"敌方牌面隐藏，AI按期望牌型给建议。");
  }

  function togglePlayerLock(i: number) { if (sessionState!=="playing"||!roundStarted||rolling) return; setPlayerLocked(c=>c.map((l,idx)=>idx===i?!l:l)); }

  function applyAdvisorLocks() { if (!advisorPlan||!canUseAdvisor) return; setPlayerLocked(advisorPlan.keepMask); }

  function rerollUnlockedDice() {
    if (sessionState!=="playing"||!roundStarted||rolling||rerollsLeft<=0) return; clearTimers(timerRef);
    const nel = chooseEnemyLocks(enemyDice); setEnemyLocked(nel);
    setPlayerDice(c=>c.map((v,i)=>playerLocked[i]?v:rollD6()));
    setEnemyDice(c=>c.map((v,i)=>nel[i]?v:rollD6()));
    setRollCount(c=>c+1); setRolling(true); setRevealed(false);
    finishRolling(rerollsLeft-1>0?"重投完成，AI建议已更新":"最后一次重投完成，可以结算。");
  }

  function settleHands() {
    if (sessionState!=="playing"||!roundStarted||rolling) return;
    const w = outcomeFromCompare(compareHands(playerHand,enemyHand));
    setRoundWinner(w); setSessionState("round-settled"); setRevealedEnemyIndexes([0,1,2,3,4]);
    setMessage(buildResultText(w,playerHand,enemyHand));
  }

  function prepareNextRound(nr: number, ns: number) { setRoundNumber(nr); setStake(ns); setSessionState("prep"); resetRoundState(`第${nr}轮赌资翻倍为${ns}G。`); }

  function cashOut() { setGold(c=>c+prize); setSessionState("cashed-out"); setMessage(`你收走${prize}G，赌局结束。`); }
  function continueAfterWin() { if (roundNumber>=MAX_ROUNDS) { cashOut(); return; } prepareNextRound(roundNumber+1,stake*2); }
  function restartDrawRound() { setSessionState("prep"); resetRoundState("平局重开本轮。"); }

  function runPleaCheck() {
    if (sessionState!=="round-settled"||roundWinner!=="enemy"||pleaCheck?.rolling||pleaCheck) return;
    clearTimers(timerRef);
    const roll = rollD20(), total = roll+PLAYER_PLEA_BONUS, success = roll===20||(roll!==1&&total>=PLEA_DC);
    setPleaCheck({kind:"plea",roll,total,success,rolling:true});
    const t=window.setTimeout(()=>{setPleaCheck({kind:"plea",roll,total,success,rolling:false}); if(success){setSessionState("prep");resetRoundState(`求情成功：D20${roll}+${PLAYER_PLEA_BONUS}=${total}，重启本轮。`);}else{setSessionState("failed");setMessage(`求情失败：${total}，赌局结束。`);}},1150);
    timerRef.current.push(t);
  }

  return (
    <main className="yacht-vn-screen">
      <div className="yacht-vn-bg" />
      <div className="yacht-vn-vignette" />

      {/* 顶栏 */}
      <header className="yacht-vn-header">
        <button type="button" className="ghost-button" onClick={onBack}>← 返回</button>
        <span>快艇骰子 · 回声酒馆</span>
        <div className="yacht-vn-gold">💰 {gold.toLocaleString()}G</div>
      </header>

      {/* 舞台 */}
      <section className="yacht-vn-stage">
        {/* NPC气泡 */}
        <div className="yacht-vn-npc-row">
          <div className="yacht-vn-npc-portrait">
            <div className="yacht-vn-npc-face"><span>🧔‍♂️</span><small>萨洛</small></div>
            <div className="yacht-vn-npc-face" style={{ marginTop: 4 }}><span>🧙‍♀️</span><small>瑟琳</small></div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={atmosphere} className="yacht-vn-bubble" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.28}}>
              <p>{atmosphere}</p>
              {message && <span className="yacht-vn-bubble-tag">{message}</span>}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 入场/结束状态 */}
        {sessionState === "idle" && (
          <div className="yacht-vn-idle">
            <p>快艇骰子——回声酒馆最受欢迎的赌局。萨洛坐庄，瑟琳在一旁等你决定。</p>
            <button type="button" className="start-button" onClick={enterGame} disabled={gold<ENTRY_FEE}>支付 50G 入场</button>
          </div>
        )}

        {/* 瑟琳行动选择 */}
        {sessionState === "prep" && !serlynCheck && !serlynSkipped && (
          <div className="yacht-vn-serlyn">
            <Dice3DView dieType="d20" roll={serlynCheck?.roll??null} rolling={Boolean(serlynCheck?.rolling)} revealed={Boolean(serlynCheck)} size={92} className="yacht-vn-dice-sm" />
            <div className="yacht-vn-serlyn-btns">
              <button type="button" className="yacht-vn-choice-btn" onClick={()=>runSerlynCheck("stealth")}>潜行偷窥</button>
              <button type="button" className="yacht-vn-choice-btn" onClick={()=>runSerlynCheck("favor")}>人情说服</button>
              <button type="button" className="ghost-button" onClick={skipSerlynAction}>跳过</button>
            </div>
            <small>潜行成功透露敌骰 / 人情成功额外重掷</small>
          </div>
        )}

        {serlynCheck?.rolling && <div className="yacht-vn-rolling">🎲 瑟琳行动判定中…</div>}

        {/* 骰子面板 */}
        {(sessionState === "playing" || sessionState === "round-settled") && (
          <div className="yacht-vn-dice-area">
            <DiceHandSimple title="敌方" subtitle={roundSettled?`${enemyHand.label}·${enemyHand.score}分`:`隐藏`} dice={enemyDice} visibleIndexes={roundSettled?[0,1,2,3,4]:revealedEnemyIndexes} rolling={rolling} revealed={revealed} />
            <DiceHandSimple title="我方" subtitle={`${playerHand.label}·${playerHand.score}分`} dice={playerDice} visibleIndexes={roundStarted?[0,1,2,3,4]:[]} locking={playerLocked} rolling={rolling} revealed={revealed} canToggle={sessionState==="playing"&&roundStarted&&!rolling} onToggle={togglePlayerLock} />
          </div>
        )}

        {/* AI参谋 */}
        {advisorPlan && (
          <div className="yacht-vn-advisor">
            <span>🧠 AI参谋</span>
            <p>{advisorPlan.headline}</p>
            <button type="button" className="ghost-button" onClick={applyAdvisorLocks}>按建议标记</button>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="yacht-vn-actions-row">
          {sessionState === "prep" && (serlynCheck || serlynSkipped) && (
            <button type="button" className="start-button" onClick={startRound} disabled={rolling||!canStartRound}>开始本轮</button>
          )}
          {sessionState === "playing" && (
            <>
              <button type="button" className="start-button" onClick={rerollUnlockedDice} disabled={rolling||rerollsLeft<=0}>
                {rerollsLeft>0?`重掷 (${rerollsLeft}/${maxRerolls})`:"重掷已用完"}
              </button>
              <button type="button" className="ghost-button" onClick={settleHands} disabled={rolling}>结算牌型</button>
            </>
          )}
          {sessionState === "round-settled" && roundWinner === "player" && (
            <>
              <button type="button" className="start-button" onClick={cashOut}>拿走 {prize}G</button>
              <button type="button" className="ghost-button" onClick={continueAfterWin}>{roundNumber>=MAX_ROUNDS?"收走最终奖池":`翻倍 (${stake*2}G)`}</button>
            </>
          )}
          {sessionState === "round-settled" && roundWinner === "enemy" && (
            <>
              <Dice3DView dieType="d20" roll={pleaCheck?.roll??null} rolling={Boolean(pleaCheck?.rolling)} revealed={Boolean(pleaCheck)} size={72} className="yacht-vn-dice-sm" />
              <button type="button" className="ghost-button" onClick={runPleaCheck} disabled={Boolean(pleaCheck)}>求情判定</button>
            </>
          )}
          {sessionState === "round-settled" && roundWinner === "draw" && (
            <button type="button" className="ghost-button" onClick={restartDrawRound}>平局重开</button>
          )}
          {(sessionState === "cashed-out" || sessionState === "failed") && (
            <button type="button" className="ghost-button" onClick={resetGame}>再来一局</button>
          )}
        </div>

        {/* 规则展开 */}
        <button type="button" className="yacht-vn-rules-toggle" onClick={()=>setShowRules(!showRules)}>
          {showRules?"收起规则":"📋 牌型规则"}
        </button>
        {showRules && (
          <div className="yacht-vn-rules">
            {HAND_RULES.map(r=><span key={r.label}><b>{r.label}</b>{r.score} <i>{r.sample}</i></span>)}
          </div>
        )}
      </section>
    </main>
  );
}

/* ---- 简化骰子手 ---- */
function DiceHandSimple({ title, subtitle, dice, visibleIndexes, rolling, revealed, locking, canToggle, onToggle }: {
  title: string; subtitle: string; dice: number[]; visibleIndexes: number[]; rolling: boolean; revealed: boolean;
  locking?: boolean[]; canToggle?: boolean; onToggle?: (i:number)=>void;
}) {
  const vs = new Set(visibleIndexes);
  return (
    <div className="yacht-vn-hand">
      <header><span>{title}</span><small>{subtitle}</small></header>
      <div className="yacht-vn-dice-row">
        {dice.map((v,i)=>{
          const vis=vs.has(i), dieR=vis&&(revealed||(locking?locking[i]:false)), dieL=rolling&&(locking?!locking[i]:true);
          return (
            <button key={i} type="button" className={`yacht-vn-die ${locking&&!locking[i]?"is-reroll":""}`} onClick={()=>onToggle?.(i)} disabled={!canToggle}>
              <Dice3DView dieType="d6" roll={vis?v:null} rolling={dieL} revealed={dieR} size={100} className="yacht-vn-die-3d" faceStyle="pips" showResultBadge={false} />
              {!vis && <i className="yacht-vn-die-hidden">?</i>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
