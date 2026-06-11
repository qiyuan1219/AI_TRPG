import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { abilityModifier, DND_CLASSES, presetAc, presetHp } from '../data/dndClasses';
import type { CharacterPreset, CreateGamePayload, SaveSlotKey, SaveSlotSummary } from '../types/game';
import { SaveLoadPanel, SAVE_SLOT_KEYS } from './SaveLoadPanel';

interface StartDNDProps {
  onStart: (payload: CreateGamePayload) => void;
  onBack?: () => void;
  saves?: SaveSlotSummary[];
  saveBusySlot?: SaveSlotKey | '';
  saveMessage?: string;
  saveMessageTone?: 'neutral' | 'success' | 'error';
  onRefreshSaves?: () => void;
  onLoadSave?: (slotKey: SaveSlotKey) => void;
}

const ATTRS: Array<{ key: keyof CharacterPreset['stats']; name: string }> = [
  { key: 'str', name: '力量' },
  { key: 'dex', name: '敏捷' },
  { key: 'con', name: '体质' },
  { key: 'int', name: '智力' },
  { key: 'wis', name: '感知' },
  { key: 'cha', name: '魅力' },
];

// ============================================================
// SVG 六维雷达图（增加边距防止标签被裁剪）
// ============================================================
const RADIUS = 68;          // 六角形半径（缩小）
const VIEW = 230;           // viewBox
const CENTER = 115;         // viewBox 中心
const MAX_VAL = 20;         // 属性最大值（对应外圈）
const LEVELS = 3;           // 网格层数
const LABEL_R = RADIUS + 22; // 标签半径

function polar(angle: number, r: number): { x: number; y: number } {
  return { x: CENTER + r * Math.cos(angle), y: CENTER + r * Math.sin(angle) };
}

function hexPath(r: number): string {
  const pts = ATTRS.map((_, i) => {
    const a = (Math.PI / 2) + (2 * Math.PI * i) / 6; // 从顶部开始
    return polar(a, r);
  });
  return pts.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x},${p.y}`).join(' ') + 'Z';
}

function RadarChart({ stats }: { stats: Record<string, number> }) {
  const gradientId = useId();

  // 数据多边形路径
  const dataPath = ATTRS.map((attr, i) => {
    const val = Math.min(stats[attr.key], MAX_VAL);
    const r = (val / MAX_VAL) * RADIUS;
    const a = (Math.PI / 2) + (2 * Math.PI * i) / 6;
    const p = polar(a, r);
    return (i === 0 ? 'M' : 'L') + `${p.x},${p.y}`;
  }).join(' ') + 'Z';

  return (
    <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="radar-chart" style={{ width: VIEW, height: VIEW }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5fb7a7" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#d4a843" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* 网格层 */}
      {Array.from({ length: LEVELS }).map((_, level) => {
        const r = (RADIUS / LEVELS) * (level + 1);
        return (
          <path
            key={`grid-${level}`}
            d={hexPath(r)}
            fill="none"
            stroke="rgba(231,211,161,0.15)"
            strokeWidth="1"
          />
        );
      })}

      {/* 轴线 */}
      {ATTRS.map((_, i) => {
        const a = (Math.PI / 2) + (2 * Math.PI * i) / 6;
        const p = polar(a, RADIUS);
        return (
          <line
            key={`axis-${i}`}
            x1={CENTER} y1={CENTER} x2={p.x} y2={p.y}
            stroke="rgba(231,211,161,0.12)"
            strokeWidth="1"
          />
        );
      })}

      {/* 数据多边形（带动画） */}
      <motion.path
        d={dataPath}
        fill={`url(#${gradientId})`}
        stroke="#5fb7a7"
        strokeWidth="2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />

      {/* 数据点 */}
      {ATTRS.map((attr, i) => {
        const val = Math.min(stats[attr.key], MAX_VAL);
        const r = (val / MAX_VAL) * RADIUS;
        const a = (Math.PI / 2) + (2 * Math.PI * i) / 6;
        const p = polar(a, r);
        return (
          <circle key={`dot-${i}`} cx={p.x} cy={p.y} r="4" fill="#efd58c" />
        );
      })}

      {/* 属性标签 + 数值（合并为单行，彻底消除重叠） */}
      {ATTRS.map((attr, i) => {
        const a = (Math.PI / 2) + (2 * Math.PI * i) / 6;
        const mod = abilityModifier(stats[attr.key]);
        const lbl = polar(a, LABEL_R);
        // 顶部和底部的标签适当调整 y 偏移，避免被六角形遮挡
        const isTop = i === 0;
        const isBottom = i === 3;
        const dy = isTop ? '-0.4em' : isBottom ? '0.4em' : '0em';
        return (
          <text
            key={`label-${i}`}
            x={lbl.x}
            y={lbl.y}
            dy={dy}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#f5ecd8"
            fontSize="13"
            fontWeight="800"
          >
            <tspan x={lbl.x} dy="0" fill="rgba(95,183,167,0.9)" fontSize="11" fontFamily="Consolas, monospace" fontWeight="900">{stats[attr.key]} {mod}</tspan>
            <tspan x={lbl.x} dy="15" fill="#f5ecd8" fontSize="13" fontWeight="800">{attr.name}</tspan>
          </text>
        );
      })}
    </svg>
  );
}

export function StartDND({
  onStart,
  onBack,
  saves = [],
  saveBusySlot = '',
  saveMessage = '',
  saveMessageTone = 'neutral',
  onRefreshSaves,
  onLoadSave,
}: StartDNDProps) {
  const [name, setName] = useState('冒险者');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showSaves, setShowSaves] = useState(false);
  const [skipOpening, setSkipOpening] = useState(false);
  const currentClass = DND_CLASSES[selectedIndex];

  function submit() {
    onStart({
      player_name: name.trim() || '冒险者',
      char_class: currentClass.name,
      attr_str: currentClass.stats.str,
      attr_dex: currentClass.stats.dex,
      attr_con: currentClass.stats.con,
      attr_int: currentClass.stats.int,
      attr_wis: currentClass.stats.wis,
      attr_cha: currentClass.stats.cha,
      level: 3,
      skip_opening: skipOpening,
    });
  }

  return (
    <div className="start-screen">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="start-layout">
        <header className="start-header">
          <div>
            <p className="eyebrow">D&D AI-TRPG</p>
            <h1>地心之门</h1>
          </div>
          <div className="start-header-copy">
            <p>逆穹城倒挂在穹顶之下，无光孢海的荧光在深渊中明灭。</p>
            {onBack && (
              <button type="button" className="ghost-button" onClick={onBack}>
                返回
              </button>
            )}
          </div>
        </header>

        <section className="creator-grid">
          <div className="creator-column">
            <label className="field-label" htmlFor="player-name">
              冒险者姓名
            </label>
            <input
              id="player-name"
              value={name}
              maxLength={12}
              onChange={(event) => setName(event.target.value)}
              className="text-field"
            />

            <div className="class-list" role="listbox" aria-label="选择职业">
              {DND_CLASSES.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-selected={selectedIndex === index}
                  onClick={() => setSelectedIndex(index)}
                  className={`class-option ${selectedIndex === index ? 'is-selected' : ''}`}
                >
                  <span className="class-mark">{item.mark}</span>
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.desc}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <motion.div key={currentClass.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="class-sheet">
            <div className="sheet-title">
              <span>{currentClass.name}</span>
              <div className="sheet-stats-badge">
                <span className="badge-hp">❤️ HP {presetHp(currentClass.stats.con)}</span>
                <span className="badge-ac">🛡️ AC {presetAc(currentClass.id)}</span>
              </div>
            </div>

            {/* 🔴 六维雷达图替换原 stat-list */}
            <RadarChart stats={{
              str: currentClass.stats.str,
              dex: currentClass.stats.dex,
              con: currentClass.stats.con,
              int: currentClass.stats.int,
              wis: currentClass.stats.wis,
              cha: currentClass.stats.cha,
            }} />

            <div className="trait-grid">
              <div>
                <h3>优势</h3>
                {currentClass.pros.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
              <div>
                <h3>限制</h3>
                {currentClass.cons.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </div>
            </div>

            <div className="skill-preview">
              <div>
                <h3>战斗技能</h3>
                {currentClass.skills.combat.map((skill) => (
                  <p key={skill.name}>
                    <b>{skill.name}</b>
                    <span>{skill.check}</span>
                  </p>
                ))}
              </div>
              <div>
                <h3>非战斗技能</h3>
                {currentClass.skills.nonCombat.map((skill) => (
                  <p key={skill.name}>
                    <b>{skill.name}</b>
                    <span>{skill.check}</span>
                  </p>
                ))}
              </div>
            </div>

            <label
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 14px", border: "1px solid rgba(231,211,161,0.2)",
                borderRadius: 8, background: "rgba(255,255,255,0.03)",
                color: "var(--muted)", fontSize: "0.85rem", cursor: "pointer",
                userSelect: "none",
              }}
            >
              <input type="checkbox" checked={skipOpening} onChange={(e) => setSkipOpening(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "#5fb7a7", cursor: "pointer" }}
              />
              <span>⏭ 跳过初始剧情，直接进入行动</span>
            </label>

            <button type="button" onClick={submit} className="start-button">
              深入地下城
            </button>
          </motion.div>
        </section>
      </motion.div>

      {/* 右下角读取存档按钮 */}
      {onLoadSave && (
        <button
          type="button"
          className="load-save-fab"
          onClick={() => setShowSaves(true)}
          title="读取存档"
        >
          📂
        </button>
      )}

      {/* 存档弹窗 */}
      <AnimatePresence>
        {showSaves && (
          <motion.div
            className="save-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSaves(false)}
          >
            <motion.div
              className="save-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="save-modal-header">
                <span>读取存档</span>
                <button type="button" onClick={() => setShowSaves(false)}>✕</button>
              </div>
              <SaveLoadPanel
                title="读取存档"
                saves={saves}
                busySlot={saveBusySlot}
                message={saveMessage}
                messageTone={saveMessageTone}
                onRefresh={onRefreshSaves}
                onLoad={(slotKey) => {
                  onLoadSave?.(slotKey);
                  setShowSaves(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
