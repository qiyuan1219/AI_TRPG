import type { ReactNode } from 'react';
import { abilityModifier, DND_CLASSES, DND_COMPANIONS } from '../data/dndClasses';
import type { GameState, SkillEntry } from '../types/game';

interface CharacterPanelProps {
  state: GameState;
  savePanel?: ReactNode;
}

const ATTRS = [
  ['str', '力'],
  ['dex', '敏'],
  ['con', '体'],
  ['int', '智'],
  ['wis', '感'],
  ['cha', '魅'],
] as const;

export function CharacterPanel({ state, savePanel }: CharacterPanelProps) {
  const currentHp = Number(state.current_hp ?? 30);
  const maxHp = Number(state.max_hp ?? 30);
  const hpPercent = Math.max(0, Math.min(100, (currentHp / Math.max(maxHp, 1)) * 100));
  const inventory = String(state.inventory || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  const classPreset = DND_CLASSES.find((item) => item.name === state.char_class || item.id === state.char_class);

  return (
    <aside className="character-panel">
      <div className="panel-block character-identity">
        <span>{state.player_name || '冒险者'}</span>
        <strong>
          {state.char_class || '战士'} Lv.{state.level || 3}
        </strong>
      </div>

      {savePanel && <div className="panel-block">{savePanel}</div>}

      <div className="panel-block">
        <div className="meter-label">
          <span>HP</span>
          <b>
            {currentHp}/{maxHp}
          </b>
        </div>
        <div className="hp-track">
          <i style={{ width: `${hpPercent}%` }} />
        </div>
      </div>

      <div className="panel-grid">
        {ATTRS.map(([key, name]) => {
          const value = Number(state[key] ?? 10);
          return (
            <div key={key} className="attr-tile">
              <span>{name}</span>
              <b>{value}</b>
              <small>{abilityModifier(value)}</small>
            </div>
          );
        })}
      </div>

      <div className="panel-row">
        <span>AC</span>
        <b>{state.ac || 18}</b>
      </div>
      <div className="panel-row">
        <span>金币</span>
        <b>{state.gold || 200} GP</b>
      </div>

      {classPreset && (
        <div className="panel-block skill-block">
          <h2>职业技能</h2>
          <SkillGroup label="战斗" skills={classPreset.skills.combat} />
          <SkillGroup label="探索/对话" skills={classPreset.skills.nonCombat} />
        </div>
      )}

      <div className="panel-block">
        <h2>同伴信任</h2>
        {DND_COMPANIONS.map((companion) => (
          <TrustRow
            key={companion.id}
            name={companion.name}
            value={Number(state[companion.trustKey] ?? 50)}
          />
        ))}
      </div>

      <div className="panel-block companion-skill-block">
        <h2>队友技能</h2>
        {DND_COMPANIONS.map((companion) => (
          <div key={companion.id} className="companion-skill">
            <strong>{companion.name}</strong>
            <small>{companion.role}</small>
            <p>{companion.skills.combat[0].name}: {companion.skills.combat[0].check}</p>
            <p>{companion.skills.nonCombat[0].name}: {companion.skills.nonCombat[0].check}</p>
          </div>
        ))}
      </div>

      <div className="panel-block inventory-block">
        <h2>背包</h2>
        {inventory.slice(0, 5).map((item) => (
          <p key={item}>{item}</p>
        ))}
      </div>
    </aside>
  );
}

function SkillGroup({ label, skills }: { label: string; skills: SkillEntry[] }) {
  return (
    <div className="skill-group">
      <span>{label}</span>
      {skills.map((skill) => (
        <p key={skill.name}>
          <b>{skill.name}</b>
          <small>{skill.check}</small>
        </p>
      ))}
    </div>
  );
}

function TrustRow({ name, value }: { name: string; value: number }) {
  return (
    <div className="trust-row">
      <span>{name}</span>
      <b className={value >= 70 ? 'trust-high' : value < 30 ? 'trust-low' : ''}>{value}</b>
    </div>
  );
}
