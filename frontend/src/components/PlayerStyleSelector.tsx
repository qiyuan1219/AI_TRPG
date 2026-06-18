import { motion } from 'framer-motion';
import { useId } from 'react';
import { PLAYER_STYLES, abilityModifier, getPlayerStyleById } from '../data/dndClasses';
import type { CharacterPreset } from '../types/game';

interface PlayerStyleSelectorProps {
  selectedStyleId: string;
  onSelect: (styleId: string) => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  title?: string;
  subtitle?: string;
  playerName?: string;
  onPlayerNameChange?: (name: string) => void;
}

const ATTRS: Array<{ key: keyof CharacterPreset['attributes']; name: string }> = [
  { key: 'str', name: '力量' },
  { key: 'dex', name: '敏捷' },
  { key: 'con', name: '体质' },
  { key: 'int', name: '智力' },
  { key: 'wis', name: '感知' },
  { key: 'cha', name: '魅力' },
];

const RADIUS = 68;
const VIEW = 230;
const CENTER = 115;
const MAX_VAL = 20;
const LEVELS = 3;
const LABEL_R = RADIUS + 22;

function polar(angle: number, r: number) {
  return { x: CENTER + r * Math.cos(angle), y: CENTER + r * Math.sin(angle) };
}

function hexPath(r: number): string {
  const points = ATTRS.map((_, index) => {
    const angle = Math.PI / 2 + (2 * Math.PI * index) / 6;
    return polar(angle, r);
  });
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`).join(' ') + 'Z';
}

function RadarChart({ preset }: { preset: CharacterPreset }) {
  const gradientId = useId();
  const dataPath = ATTRS.map((attr, index) => {
    const value = Math.min(preset.attributes[attr.key], MAX_VAL);
    const radius = (value / MAX_VAL) * RADIUS;
    const angle = Math.PI / 2 + (2 * Math.PI * index) / 6;
    const point = polar(angle, radius);
    return `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`;
  }).join(' ') + 'Z';

  return (
    <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="radar-chart" style={{ width: VIEW, height: VIEW }}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5fb7a7" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#d4a843" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {Array.from({ length: LEVELS }).map((_, level) => {
        const radius = (RADIUS / LEVELS) * (level + 1);
        return <path key={`grid-${level}`} d={hexPath(radius)} fill="none" stroke="rgba(231,211,161,0.15)" strokeWidth="1" />;
      })}

      {ATTRS.map((_, index) => {
        const angle = Math.PI / 2 + (2 * Math.PI * index) / 6;
        const point = polar(angle, RADIUS);
        return <line key={`axis-${index}`} x1={CENTER} y1={CENTER} x2={point.x} y2={point.y} stroke="rgba(231,211,161,0.12)" strokeWidth="1" />;
      })}

      <motion.path
        d={dataPath}
        fill={`url(#${gradientId})`}
        stroke="#5fb7a7"
        strokeWidth="2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      />

      {ATTRS.map((attr, index) => {
        const value = Math.min(preset.attributes[attr.key], MAX_VAL);
        const radius = (value / MAX_VAL) * RADIUS;
        const angle = Math.PI / 2 + (2 * Math.PI * index) / 6;
        const point = polar(angle, radius);
        return <circle key={`dot-${index}`} cx={point.x} cy={point.y} r="4" fill="#efd58c" />;
      })}

      {ATTRS.map((attr, index) => {
        const angle = Math.PI / 2 + (2 * Math.PI * index) / 6;
        const label = polar(angle, LABEL_R);
        const modifier = abilityModifier(preset.attributes[attr.key]);
        const dy = index === 0 ? '-0.4em' : index === 3 ? '0.4em' : '0em';
        return (
          <text
            key={`label-${index}`}
            x={label.x}
            y={label.y}
            dy={dy}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#f5ecd8"
            fontSize="13"
            fontWeight="800"
          >
            <tspan x={label.x} dy="0" fill="rgba(95,183,167,0.9)" fontSize="11" fontFamily="Consolas, monospace" fontWeight="900">
              {preset.attributes[attr.key]} {modifier}
            </tspan>
            <tspan x={label.x} dy="15" fill="#f5ecd8" fontSize="13" fontWeight="800">
              {attr.name}
            </tspan>
          </text>
        );
      })}
    </svg>
  );
}

export default function PlayerStyleSelector({
  selectedStyleId,
  onSelect,
  onConfirm,
  confirmLabel = '确认流派',
  title = '选择冒险者流派',
  subtitle = '流派只影响初始六维、生命、防护和先攻；行动技能会在游戏中自然判定。',
  playerName = '',
  onPlayerNameChange,
}: PlayerStyleSelectorProps) {
  const currentStyle = getPlayerStyleById(selectedStyleId);

  return (
    <div className="style-selector">
      <div className="style-selector-copy">
        <p className="eyebrow">冒险者登记</p>
        <h2>{title}</h2>
        <p>{subtitle}</p>
        {onPlayerNameChange && (
          <label className="adventurer-name-field">
            <span>冒险者姓名</span>
            <input
              type="text"
              value={playerName}
              maxLength={20}
              autoComplete="off"
              placeholder="写下你的名字"
              onChange={(event) => onPlayerNameChange(event.target.value)}
            />
          </label>
        )}
      </div>

      <section className="creator-grid style-selector-grid">
        <div className="creator-column">
          <div className="class-list" role="listbox" aria-label="选择冒险者流派">
            {PLAYER_STYLES.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-selected={selectedStyleId === item.id}
                onClick={() => onSelect(item.id)}
                className={`class-option ${selectedStyleId === item.id ? 'is-selected' : ''}`}
              >
                <span className="class-mark">{item.hotkey}</span>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.summary}</small>
                </span>
              </button>
            ))}
          </div>
        </div>

        <motion.div key={currentStyle.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} className="class-sheet">
          <div className="sheet-title">
            <div>
              <span>{currentStyle.name}</span>
              <p className="style-tagline">{currentStyle.tagline}</p>
            </div>
            <div className="sheet-stats-badge">
              <span className="badge-hp">HP {currentStyle.derived.hp}</span>
              <span className="badge-ac">AC {currentStyle.derived.ac}</span>
              <span className="badge-initiative">先攻 {abilityModifier(currentStyle.attributes.dex)}</span>
            </div>
          </div>

          <RadarChart preset={currentStyle} />

          <div className="style-attr-grid">
            {ATTRS.map((attr) => (
              <p key={attr.key}>
                <b>{attr.name}</b>
                <span>{currentStyle.attributes[attr.key]}</span>
                <em>{abilityModifier(currentStyle.attributes[attr.key])}</em>
              </p>
            ))}
          </div>

          <div className="trait-grid">
            <div>
              <h3>优势</h3>
              {currentStyle.advantages.map((item) => <p key={item}>{item}</p>)}
            </div>
            <div>
              <h3>限制</h3>
              {currentStyle.limitations.map((item) => <p key={item}>{item}</p>)}
            </div>
          </div>

          {onConfirm && (
            <button type="button" onClick={onConfirm} disabled={Boolean(onPlayerNameChange && !playerName.trim())} className="start-button">
              {confirmLabel}
            </button>
          )}
        </motion.div>
      </section>
    </div>
  );
}
