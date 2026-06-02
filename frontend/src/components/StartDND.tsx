import { useState } from 'react';
import { motion } from 'framer-motion';
import { abilityModifier, DND_CLASSES, presetAc, presetHp } from '../data/dndClasses';
import type { CharacterPreset, CreateGamePayload } from '../types/game';

interface StartDNDProps {
  onStart: (payload: CreateGamePayload) => void;
}

const ATTRS: Array<{ key: keyof CharacterPreset['stats']; name: string }> = [
  { key: 'str', name: '力量' },
  { key: 'dex', name: '敏捷' },
  { key: 'con', name: '体质' },
  { key: 'int', name: '智力' },
  { key: 'wis', name: '感知' },
  { key: 'cha', name: '魅力' },
];

export function StartDND({ onStart }: StartDNDProps) {
  const [name, setName] = useState('冒险者');
  const [selectedIndex, setSelectedIndex] = useState(0);
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
    });
  }

  return (
    <div className="start-screen">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="start-layout">
        <header className="start-header">
          <div>
            <p className="eyebrow">D&D AI-TRPG</p>
            <h1>碎冠之影</h1>
          </div>
          <p>王冠城的雾正在升起，地下裂隙等待回应。</p>
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
              <small>
                HP {presetHp(currentClass.stats.con)} / AC {presetAc(currentClass.id)}
              </small>
            </div>

            <div className="stat-list">
              {ATTRS.map((attr) => {
                const value = currentClass.stats[attr.key];
                return (
                  <div key={attr.key} className="stat-row">
                    <span>{attr.name}</span>
                    <div className="stat-track">
                      <i style={{ width: `${(value / 18) * 100}%` }} />
                    </div>
                    <b>
                      {value} ({abilityModifier(value)})
                    </b>
                  </div>
                );
              })}
            </div>

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

            <button type="button" onClick={submit} className="start-button">
              深入地下城
            </button>
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
}
