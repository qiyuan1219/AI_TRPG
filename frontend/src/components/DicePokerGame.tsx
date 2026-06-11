import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================
// 类型
// ============================================================
interface DicePokerSummary {
  game_id: string;
  dice: number[];
  kept: number[];
  rerolls_left: number;
  round_number: number;
  scores: Record<string, number | null>;
  used_categories: string[];
  available_categories: Record<string, number>;
  game_over: boolean;
  npc_name: string;
  current_bet_info: string;
}

interface DicePokerProps {
  gameId: string;               // 主游戏ID（用于关联NPC信任）
  npcName: string;              // 对战的NPC名称
  npcTrustKey: string;          // NPC信任值state key
  onClose: () => void;
  onTrustChange?: (npc: string, key: string, change: number) => void;
  onGetClue?: (betInfo: string) => void;
  /** 游戏结束时的回调，传递完整结果数据，用于触发剧情推进 */
  onComplete?: (result: any) => void;
}

// ============================================================
// 骰子表情映射
// ============================================================
const DICE_DOTS: Record<number, number[][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 2], [1, 0], [1, 2], [2, 0], [2, 2]],
};

// ============================================================
// API调用
// ============================================================
const API = {
  start: (gameId: string, npcName: string, npcTrustKey: string) =>
    fetch('/api/dice-poker/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game_id: gameId, npc_name: npcName, npc_trust_key: npcTrustKey }),
    }).then((r) => r.json()),

  roll: (gameId: string) =>
    fetch('/api/dice-poker/roll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game_id: gameId }),
    }).then((r) => r.json()),

  keep: (gameId: string, indices: number[]) =>
    fetch('/api/dice-poker/keep', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game_id: gameId, keep_indices: indices }),
    }).then((r) => r.json()),

  score: (gameId: string, category: string) =>
    fetch('/api/dice-poker/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game_id: gameId, category }),
    }).then((r) => r.json()),

  getHint: (gameId: string) =>
    fetch('/api/dice-poker/ai-hint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game_id: gameId }),
    }).then((r) => r.json()),
};

// ============================================================
// DicePokerGame 组件
// ============================================================
export function DicePokerGame({ gameId: hostGameId, npcName, npcTrustKey, onClose, onTrustChange, onGetClue, onComplete }: DicePokerProps) {
  const [pokerId, setPokerId] = useState('');
  const [summary, setSummary] = useState<DicePokerSummary | null>(null);
  const [selectedDice, setSelectedDice] = useState<Set<number>>(new Set());
  const [narrative, setNarrative] = useState('');
  const [aiHint, setAiHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<'init' | 'rolling' | 'keep' | 'scoring' | 'result'>('init');
  const [resultData, setResultData] = useState<any>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);

  // 开始游戏
  const startGame = useCallback(async () => {
    setLoading(true);
    try {
      const data = await API.start(hostGameId, npcName, npcTrustKey);
      setPokerId(data.game_id);
      setSummary(data.summary);
      setNarrative(data.narrative);
      setAiHint(data.hint || '');
      setPhase('rolling');
      setSelectedDice(new Set());
    } catch (e: any) {
      setNarrative('启动骰子游戏失败：' + (e.message || '网络错误'));
    } finally {
      setLoading(false);
    }
  }, [hostGameId, npcName, npcTrustKey]);

  // 纯重投（不保留任何骰子）
  const handleRollAll = async () => {
    if (!pokerId) return;
    setLoading(true);
    try {
      const data = await API.roll(pokerId);
      setSummary(data.summary);
      setNarrative(data.narrative);
      setAiHint(data.hint || '');
      setSelectedDice(new Set());
      if (data.summary.rerolls_left === 0) setPhase('scoring');
    } catch { } finally { setLoading(false); }
  };

  // 保留选中骰子并重投
  const handleKeepAndRoll = async () => {
    if (!pokerId) return;
    setLoading(true);
    try {
      const data = await API.keep(pokerId, Array.from(selectedDice));
      setSummary(data.summary);
      setNarrative(data.narrative);
      setAiHint(data.hint || '');
      setSelectedDice(new Set());
      if (data.summary.rerolls_left === 0) setPhase('scoring');
    } catch { } finally { setLoading(false); }
  };

  // 进入计分阶段
  const handleGoScore = () => setPhase('scoring');

  // 选择计分项
  const handleChooseCategory = async (category: string) => {
    if (!pokerId) return;
    setLoading(true);
    try {
      const data = await API.score(pokerId, category);
      setSummary(data.summary);
      setNarrative(data.ai_narration + '\n\n' + data.npc_reaction);
      setAiHint('');
      setResultData(data);
      setPhase('result');
      if (onTrustChange) {
        onTrustChange(data.trust_update?.npc || npcName, data.trust_update?.key || npcTrustKey, data.trust_change || 0);
      }
      if (data.result === 'win' && onGetClue) {
        onGetClue(data.bet_info);
      }
    } catch { } finally { setLoading(false); }
  };

  // 切换骰子选中状态
  const toggleDice = (index: number) => {
    if (phase !== 'rolling') return;
    setSelectedDice((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  useEffect(() => { startGame(); }, [startGame]);

  useEffect(() => {
    if (narrativeRef.current) {
      narrativeRef.current.scrollTop = narrativeRef.current.scrollHeight;
    }
  }, [narrative]);

  // ============================================================
  // 渲染
  // ============================================================
  return (
    <motion.div
      className="dice-poker-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="dice-poker-modal"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题栏 */}
        <div className="dice-poker-header">
          <span>🎲 快艇骰子 · 对阵 {npcName}</span>
          <button onClick={onClose}>✕</button>
        </div>

        {/* 骰子展示区 */}
        <div className="dice-poker-dice-area">
          {summary && summary.dice.map((val, idx) => (
            <motion.div
              key={`${idx}-${val}-${summary.round_number}`}
              className={`dice-poker-die ${selectedDice.has(idx) ? 'selected' : ''} ${phase === 'scoring' || phase === 'result' ? 'locked' : ''}`}
              onClick={() => toggleDice(idx)}
              whileHover={phase === 'rolling' ? { scale: 1.1 } : {}}
              animate={phase === 'init' ? {} : {
                rotate: [0, 360, 720],
                scale: [0.5, 1],
              }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <DiceFace value={val} />
              {selectedDice.has(idx) && <div className="dice-kept-mark">✓</div>}
            </motion.div>
          ))}
        </div>

        {/* 操作按钮 */}
        {phase === 'rolling' && (
          <div className="dice-poker-actions">
            <button disabled={loading} onClick={handleRollAll} className="poker-btn poker-btn-secondary">
              🎲 全部重投 ({summary?.rerolls_left ?? 0}次)
            </button>
            <button disabled={loading || selectedDice.size === 0} onClick={handleKeepAndRoll} className="poker-btn poker-btn-primary">
              📌 保留选中 + 重投 ({summary?.rerolls_left ?? 0}次)
            </button>
            <button disabled={loading} onClick={handleGoScore} className="poker-btn poker-btn-accent">
              🏆 直接计分
            </button>
          </div>
        )}

        {/* AI策略提示 */}
        {aiHint && phase !== 'result' && (
          <div className="dice-poker-hint">
            <span className="hint-label">🤖 AI策略建议</span>
            <pre>{aiHint}</pre>
          </div>
        )}

        {/* 计分面板 */}
        {phase === 'scoring' && summary && (
          <div className="dice-poker-score-panel">
            <h3>选择计分项：</h3>
            <div className="score-categories">
              {Object.entries(summary.available_categories).map(([cat, score]) => (
                <button
                  key={cat}
                  disabled={loading}
                  onClick={() => handleChooseCategory(cat)}
                  className={`score-category-btn ${score > 20 ? 'high' : score > 10 ? 'mid' : 'low'}`}
                >
                  <span className="cat-name">{cat}</span>
                  <span className="cat-score">{score}分</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 叙事区域 */}
        <div className="dice-poker-narrative" ref={narrativeRef}>
          {narrative.split('\n').map((line, i) => (
            <p key={i}>{line || '\u00A0'}</p>
          ))}
        </div>

        {/* 结果面板 */}
        {phase === 'result' && resultData && (
          <div className="dice-poker-result">
            <div className={`result-banner result-${resultData.result}`}>
              {resultData.result === 'win' ? '🎉 你赢了！' : resultData.result === 'tie' ? '🤝 平局' : '😔 你输了'}
            </div>
            <div className="result-scores">
              <span>你的得分：{resultData.player_score}</span>
              <span>{npcName}得分：{resultData.npc_score}</span>
            </div>
            {resultData.trust_change !== 0 && (
              <div className={`result-trust ${resultData.trust_change > 0 ? 'positive' : 'negative'}`}>
                {npcName}信任 {resultData.trust_change > 0 ? '+' : ''}{resultData.trust_change}
              </div>
            )}
            <button
              onClick={() => {
                if (onComplete) onComplete(resultData);
                onClose();
              }}
              className="poker-btn poker-btn-primary"
              style={{ marginTop: 12 }}
            >
              {resultData.result === 'win' ? '获得情报，继续冒险' : '回到酒馆'}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ============================================================
// 骰子面渲染
// ============================================================
function DiceFace({ value }: { value: number }) {
  const dots = DICE_DOTS[value] || [];
  return (
    <div className="dice-face">
      {Array.from({ length: 3 }).map((_, row) => (
        <div key={row} className="dice-row">
          {Array.from({ length: 3 }).map((_, col) => {
            const hasDot = dots.some(([r, c]) => r === row && c === col);
            return <div key={col} className={`dice-dot ${hasDot ? 'filled' : ''}`} />;
          })}
        </div>
      ))}
    </div>
  );
}
