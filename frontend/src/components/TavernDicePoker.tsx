import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DiceRollOverlay } from './DiceRollOverlay';
import type { DiceResult } from '../types/game';

// ── 类型 ──
interface TavernState {
  phase: 'intro' | 'skill' | 'playing' | 'round_end' | 'plead' | 'game_over';
  current_round: number;
  wins: number;
  peek_used: boolean;
  persuade_used: boolean;
  plead_available: boolean;
  reroll_bonus: number;
  peek_revealed_dice: number[];
  npc_text: string;
  dice: number[];
  rerolls_left: number;
  available_categories: Record<string, number>;
  round_history: RoundRecord[];
}

interface RoundRecord {
  round: number;
  player_score: number;
  npc_score: number;
  result: 'win' | 'tie' | 'lose';
  category: string;
  player_dice: number[];
  npc_dice: number[];
}

interface SkillResult {
  skill_id: string;
  roll: number;
  bonus: number;
  total: number;
  dc: number;
  success: boolean;
  narrative?: string;
  revealed_count?: number;
  reroll_bonus?: number;
}

interface GameResult {
  game_over: boolean;
  wins: number;
  losses: number;
  title: string;
  info: string;
  items: string[];
  round_history: RoundRecord[];
}

interface TavernDicePokerProps {
  onClose: () => void;
  onComplete?: (result: GameResult) => void;
}

const API = {
  start: () =>
    fetch('/api/tavern-dice/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }).then(r => r.json()),

  getState: (id: string) =>
    fetch(`/api/tavern-dice/${id}/state`).then(r => r.json()),

  useSkill: (id: string, skillId: string, bonus = 0) =>
    fetch(`/api/tavern-dice/${id}/use-skill`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skill_id: skillId, bonus }),
    }).then(r => r.json()),

  startRound: (id: string) =>
    fetch(`/api/tavern-dice/${id}/start-round`, { method: 'POST' }).then(r => r.json()),

  roll: (id: string) =>
    fetch('/api/tavern-dice/roll', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ game_id: id }) }).then(r => r.json()),

  keep: (id: string, indices: number[]) =>
    fetch('/api/tavern-dice/keep', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ game_id: id, keep_indices: indices }) }).then(r => r.json()),

  score: (id: string, category: string) =>
    fetch('/api/tavern-dice/score', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ game_id: id, category }) }).then(r => r.json()),

  plead: (id: string, bonus = 0) =>
    fetch(`/api/tavern-dice/${id}/plead`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bonus }) }).then(r => r.json()),

  nextRound: (id: string) =>
    fetch(`/api/tavern-dice/${id}/next-round`, { method: 'POST' }).then(r => r.json()),
};

export function TavernDicePoker({ onClose, onComplete }: TavernDicePokerProps) {
  const [gameId, setGameId] = useState('');
  const [state, setState] = useState<TavernState | null>(null);
  const [finalResult, setFinalResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [narrative, setNarrative] = useState('');
  const [selectedDice, setSelectedDice] = useState<Set<number>>(new Set());
  const [skillResult, setSkillResult] = useState<SkillResult | null>(null);
  const [skillDice, setSkillDice] = useState<DiceResult | null>(null); // 技能判定骰子动画
  const skillPendingRef = useRef<'round' | 'plead_result' | null>(null); // 骰子动画结束后该干什么
  const pleadResultRef = useRef<{ success: boolean; narrative: string } | null>(null);
  const initRef = useRef(false);

  // 启动
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    (async () => {
      setLoading(true);
      try {
        const data = await API.start();
        setGameId(data.game_id);
        setState(data);
        setNarrative(`📋 第 1/3 局 —— 对阵 ${data.npc_name}\n\n${data.skill_hint}`);
      } catch (e: any) {
        setNarrative('启动骰子游戏失败：' + (e.message || '网络错误'));
      } finally { setLoading(false); }
    })();
  }, []);

  // ── 技能阶段操作 ──
  async function handleUseSkill(skillId: string) {
    if (!gameId || loading) return;
    setLoading(true);
    try {
      const result = await API.useSkill(gameId, skillId);
      setSkillResult(result);
      setNarrative(result.narrative || '');
      setState(prev => prev ? { ...prev, peek_used: result.peek_used!, persuade_used: result.persuade_used! } : prev);
      // 显示骰子动画
      skillPendingRef.current = 'round';
      setSkillDice({
        type: 'skill_check',
        data: {
          骰子: 'D20',
          掷骰: `D20=${result.roll}`,
          加值: result.bonus || 0,
          总计: result.total,
          DC: result.dc,
          成功: result.success,
          属性: skillId === 'peek' ? '瑟琳·时间之眼' : '瑟琳·银杖说服',
        },
      });
    } catch (e: any) {
      setNarrative('技能使用失败：' + (e.message || ''));
    } finally { setLoading(false); }
  }

  async function handleSkipSkill() {
    if (!gameId || loading) return;
    setLoading(true);
    setSkillResult(null);
    try {
      const data = await API.startRound(gameId);
      setState(prev => prev ? { ...prev, ...data, phase: data.phase } : prev);
      setNarrative(`🎲 第 ${data.round}/3 局开始！骰面：${data.dice.join(' ')}（重投 ${data.rerolls_left} 次）`);
    } catch (e: any) {
      setNarrative('开局失败：' + (e.message || ''));
    } finally { setLoading(false); }
  }

  // 骰子动画关闭后的回调
  function handleSkillDiceClose() {
    setSkillDice(null);
    const pending = skillPendingRef.current;
    skillPendingRef.current = null;
    if (pending === 'round') {
      // 技能判定结束 → 自动开始本局
      setLoading(true);
      API.startRound(gameId).then(data => {
        setState(prev => prev ? { ...prev, ...data, phase: data.phase } : prev);
        setNarrative(`🎲 第 ${data.round}/3 局开始！骰面：${data.dice.join(' ')}（重投 ${data.rerolls_left} 次）`);
        setLoading(false);
      }).catch(e => {
        setNarrative('开局失败：' + (e.message || ''));
        setLoading(false);
      });
    } else if (pending === 'plead_result') {
      // 求情判定结束 → 显示结果
      const result = pleadResultRef.current;
      pleadResultRef.current = null;
      if (result) {
        setNarrative(result.narrative);
        setLoading(false);
      }
    }
  }

  // ── 骰子操作 ──
  const toggleDice = (i: number) => {
    setSelectedDice(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  async function handleRoll() {
    if (!gameId || loading) return;
    setLoading(true);
    try {
      const data = await API.roll(gameId);
      setState(prev => prev ? { ...prev, dice: data.dice, rerolls_left: data.rerolls_left, available_categories: data.available_categories } : prev);
      setNarrative(data.narrative || '');
      setSelectedDice(new Set());
    } catch (e: any) { setNarrative('掷骰失败：' + (e.message || '')); }
    finally { setLoading(false); }
  }

  async function handleKeep() {
    if (!gameId || loading || selectedDice.size === 0) return;
    setLoading(true);
    try {
      const data = await API.keep(gameId, Array.from(selectedDice));
      setState(prev => prev ? { ...prev, dice: data.dice, rerolls_left: data.rerolls_left, available_categories: data.available_categories } : prev);
      setNarrative(data.narrative || '');
      setSelectedDice(new Set());
    } catch (e: any) { setNarrative('保留失败：' + (e.message || '')); }
    finally { setLoading(false); }
  }

  async function handleScore(category: string) {
    if (!gameId || loading) return;
    setLoading(true);
    try {
      const data = await API.score(gameId, category);
      setState(prev => prev ? { ...prev, phase: data.phase, round_history: [...(prev.round_history || []), data] } : prev);
      if (data.result === 'win') {
        setNarrative(`🎉 第 ${data.round} 局获胜！你的 ${category}：${data.player_score} vs 萨洛：${data.npc_score}`);
      } else if (data.result === 'tie') {
        setNarrative(`🤝 第 ${data.round} 局平局！你的 ${category}：${data.player_score} vs 萨洛：${data.npc_score}`);
      } else {
        setNarrative(`😔 第 ${data.round} 局落败。你的 ${category}：${data.player_score} vs 萨洛：${data.npc_score}\n\n瑟琳靠近你：「要我去求情吗？或许还能再给一次机会。」`);
      }
      setSkillResult(null);
    } catch (e: any) { setNarrative('计分失败：' + (e.message || '')); }
    finally { setLoading(false); }
  }

  // ── 求情 ──
  async function handlePlead() {
    if (!gameId || loading) return;
    setLoading(true);
    try {
      const data = await API.plead(gameId);
      pleadResultRef.current = {
        success: data.plead_success,
        narrative: data.narrative || '',
      };
      if (data.roll_detail) {
        skillPendingRef.current = 'plead_result';
        setSkillDice({
          type: 'skill_check',
          data: {
            骰子: 'D20',
            掷骰: `D20=${data.roll_detail.roll}`,
            加值: data.roll_detail.bonus || 0,
            总计: data.roll_detail.total,
            DC: data.roll_detail.dc,
            成功: data.roll_detail.success,
            属性: '瑟琳·低声求情',
          },
        });
      }
    } catch (e: any) {
      setNarrative('求情失败：' + (e.message || ''));
      setLoading(false);
    }
  }

  async function handleAcceptLoss() {
    setState(prev => prev ? { ...prev, phase: 'round_end' } : prev);
  }

  // ── 进入下一局 ──
  async function handleNextRound() {
    if (!gameId || loading) return;
    setLoading(true);
    setSkillResult(null);
    try {
      const data = await API.nextRound(gameId);
      if (data.game_over) {
        setFinalResult(data);
        setState(prev => prev ? { ...prev, phase: 'game_over' } : prev);
        setNarrative(`🏆 三局结束！战绩：${data.wins} 胜 ${data.total_rounds - data.wins} 败\n\n${data.info}`);
        if (onComplete) onComplete(data);
      } else {
        setState(prev => prev ? { ...prev, ...data, phase: data.phase } : prev);
        setNarrative(`📋 第 ${data.round}/3 局 —— 当前战绩 ${state?.wins} 胜\n\n${state?.npc_text}`);
      }
    } catch (e: any) { setNarrative('操作失败：' + (e.message || '')); }
    finally { setLoading(false); }
  }

  // ── 渲染 ──
  return (
    <motion.div
      className="tavern-dice-backdrop"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={state?.phase === 'game_over' ? onClose : undefined}
    >
      <motion.div
        className="tavern-dice-modal"
        initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
        onClick={e => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="tavern-dice-header">
          <span>🎲 快艇骰子 · 酒馆赌局</span>
          {state && (
            <small>第 {state.current_round}/3 局 · {state.wins} 胜</small>
          )}
          <button onClick={onClose} className="tavern-dice-close">✕</button>
        </div>

        {/* 叙事区 */}
        <div className="tavern-dice-narrative">{narrative || (loading ? '……' : '')}</div>

        {/* ── 技能阶段 ── */}
        {state?.phase === 'skill' && (
          <div className="tavern-skill-zone">
            <p>瑟琳站在你身旁，银杖微光。使用技能后再开始本局？</p>
            <div className="tavern-skill-buttons">
              <button disabled={state.peek_used || loading} onClick={() => handleUseSkill('peek')} className="tavern-skill-btn peek-btn">
                👁️ 偷窥对手骰子 (DC12)
                {state.peek_used && ' ✓已使用'}
              </button>
              <button disabled={state.persuade_used || loading} onClick={() => handleUseSkill('persuade')} className="tavern-skill-btn persuade-btn">
                💬 说服萨洛加重投 (DC14)
                {state.persuade_used && ' ✓已使用'}
              </button>
              <button disabled={loading} onClick={handleSkipSkill} className="tavern-skill-btn skip-btn">
                ⏩ 不使用技能，直接开始
              </button>
            </div>
          </div>
        )}

        {/* ── 游戏阶段 ── */}
        {state?.phase === 'playing' && (
          <div className="tavern-game-zone">
            {/* 对手信息 */}
            <div className="tavern-opponent-info">{state.npc_text}</div>

            {/* 骰子展示 */}
            <div className="tavern-dice-row">
              {state.dice.map((d, i) => (
                <button
                  key={i}
                  className={`tavern-die ${selectedDice.has(i) ? 'selected' : ''}`}
                  onClick={() => toggleDice(i)}
                  disabled={state.rerolls_left <= 0 || loading}
                >
                  <span className="die-dots">{'⚀⚁⚂⚃⚄⚅'[d - 1]}</span>
                  <small>{d}</small>
                </button>
              ))}
            </div>

            {/* 重投按钮 */}
            {state.rerolls_left > 0 && (
              <div className="tavern-reroll-buttons">
                <button disabled={loading} onClick={handleRoll} className="tavern-btn">
                  🎲 全部重投 ({state.rerolls_left})
                </button>
                <button disabled={loading || selectedDice.size === 0} onClick={handleKeep} className="tavern-btn tavern-btn-gold">
                  📌 保留选中并重投 ({state.rerolls_left})
                </button>
              </div>
            )}

            {/* 计分项 */}
            <div className="tavern-categories">
              <p className="tavern-cat-title">选择计分项：</p>
              <div className="tavern-cat-grid">
                {Object.entries(state.available_categories).map(([cat, score]) => (
                  <button key={cat} disabled={loading} onClick={() => handleScore(cat)} className="tavern-cat-btn">
                    {cat}: {score}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── 求情阶段 ── */}
        {state?.phase === 'plead' && (
          <div className="tavern-plead-zone">
            <p>本局落败。瑟琳靠近你，低声道：「要我向萨洛求个情吗？或许还能再给一次机会。」</p>
            <div className="tavern-plead-buttons">
              <button disabled={!state.plead_available || loading} onClick={handlePlead} className="tavern-btn tavern-btn-gold">
                🙏 瑟琳低声求情 (DC15)
              </button>
              <button disabled={loading} onClick={handleAcceptLoss} className="tavern-btn">
                😔 认了，进入下一局
              </button>
            </div>
          </div>
        )}

        {/* ── 局末阶段 ── */}
        {state?.phase === 'round_end' && (
          <div className="tavern-round-end">
            <p>当前战绩：{state.wins} 胜</p>
            <button disabled={loading} onClick={handleNextRound} className="tavern-btn tavern-btn-gold">
              {state.current_round >= 3 ? '查看最终结果' : '进入下一局 ▶'}
            </button>
          </div>
        )}

        {/* ── 最终结果 ── */}
        {(state?.phase === 'game_over' || finalResult) && (
          <div className="tavern-final-result">
            <h2>{finalResult?.title || '结束'}</h2>
            <p className="tavern-final-score">最终战绩：{finalResult?.wins || 0} 胜 {finalResult?.losses || 0} 败</p>
            <p className="tavern-final-info">{finalResult?.info}</p>
            {finalResult?.items && (
              <div className="tavern-final-items">
                {finalResult.items.map((item, i) => <span key={i}>🎁 {item}</span>)}
              </div>
            )}
            <button onClick={onClose} className="tavern-btn tavern-btn-gold">回到酒馆</button>
          </div>
        )}
      </motion.div>

      {/* 瑟琳技能判定骰子动画 */}
      <DiceRollOverlay
        dice={skillDice}
        dieType="d20"
        onClose={handleSkillDiceClose}
      />
    </motion.div>
  );
}
