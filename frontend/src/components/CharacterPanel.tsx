import { abilityModifier } from '../data/dndClasses';
import type { GameState } from '../types/game';

interface CharacterPanelProps {
  state: GameState;
}

const ATTRS = [
  ['str', '力'],
  ['dex', '敏'],
  ['con', '体'],
  ['int', '智'],
  ['wis', '感'],
  ['cha', '魅'],
] as const;

export function CharacterPanel({ state }: CharacterPanelProps) {
  const currentHp = Number(state.current_hp ?? 30);
  const maxHp = Number(state.max_hp ?? 30);
  const hpPercent = Math.max(0, Math.min(100, (currentHp / Math.max(maxHp, 1)) * 100));
  const inventory = String(state.inventory || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <aside className="character-panel">
      <div className="panel-block character-identity">
        <span>{state.player_name || '冒险者'}</span>
        <strong>
          {state.char_class || '战士'} Lv.{state.level || 3}
        </strong>
      </div>

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

      <div className="panel-block">
        <h2>同伴信任</h2>
        <TrustRow name="格鲁姆" value={state.gm_trust ?? 60} />
        <TrustRow name="丽莎" value={state.ls_trust ?? 45} />
        <TrustRow name="塔莉亚" value={state.tl_trust ?? 75} />
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

function TrustRow({ name, value }: { name: string; value: number }) {
  return (
    <div className="trust-row">
      <span>{name}</span>
      <b className={value >= 70 ? 'trust-high' : value < 30 ? 'trust-low' : ''}>{value}</b>
    </div>
  );
}
