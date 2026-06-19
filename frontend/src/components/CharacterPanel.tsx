import { type ReactNode } from 'react';
import { abilityModifier, DND_COMPANIONS } from '../data/dndClasses';
import type { GameState } from '../types/game';
import { COMPANION_ID_BY_UI_ID, getCompanionTrust, getTrustTier, recentTrustLogs } from '../utils/trust';

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

const ACTIVE_COMPANION_IDS = new Set(['selin', 'ailin', 'senluo', 'kelaiya']);

function isCompanionJoined(id: string, state: GameState) {
  if (id === 'selin') return true;
  if (id === 'ailin') return Boolean(state.al_recruited || state.temple_ailin_recruited);
  if (id === 'senluo') return Boolean(state.sl_recruited || state.brock_recruited);
  if (id === 'kelaiya') return Boolean(state.kl_recruited || state.kaiya_recruited);
  return false;
}

export function CharacterPanel({ state, savePanel }: CharacterPanelProps) {
  const currentHp = Number(state.current_hp ?? 30);
  const maxHp = Number(state.max_hp ?? 30);
  const hpPercent = Math.max(0, Math.min(100, (currentHp / Math.max(maxHp, 1)) * 100));
  const styleName = String(state.style_name || state.player?.styleName || state.char_class || (state.style_selection_pending ? '待确认流派' : '均衡流'));
  const visibleCompanions = DND_COMPANIONS.filter((companion) => ACTIVE_COMPANION_IDS.has(companion.id));
  const trustLogs = recentTrustLogs(state, 5);

  return (
    <aside className="character-panel">
      <div className="panel-block character-identity">
        <span>{state.player_name || '冒险者'}</span>
        <strong>
          {styleName} Lv.{state.level || 3}
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

      <div className="panel-block">
        <h2>同伴信任</h2>
        {visibleCompanions.map((companion) => (
          <TrustRow
            key={companion.id}
            name={companion.name}
            value={getCompanionTrust(state, COMPANION_ID_BY_UI_ID[companion.id] || 'serin')}
            joined={isCompanionJoined(companion.id, state)}
            hp={Number(state[companion.hpKey] ?? companion.hp)}
            maxHp={companion.hp}
            fixed={companion.id === 'selin'}
          />
        ))}
        {trustLogs.length > 0 && (
          <div className="trust-log-list">
            {trustLogs.map((log) => {
              const delta = Number(log.delta || 0);
              const isHidden = log.visibility === 'hidden';
              return (
                <p key={log.id || `${log.companionId}-${log.createdAt}`} className={isHidden ? 'trust-hidden' : ''}>
                  <b>{log.companionName}</b>
                  {isHidden ? (
                    <em className="trust-subtle">~{delta > 0 ? '+' : ''}{delta > 0 ? delta : ''}</em>
                  ) : (
                    <em className={delta >= 0 ? 'trust-high' : 'trust-low'}>
                      {delta > 0 ? `+${delta}` : delta}
                    </em>
                  )}
                  <span>{log.reason}</span>
                </p>
              );
            })}
          </div>
        )}
      </div>

      <div className="panel-block companion-skill-block">
        <h2>队友技能</h2>
        {visibleCompanions.map((companion) => {
          const joined = isCompanionJoined(companion.id, state);
          const hp = Number(state[companion.hpKey] ?? companion.hp);
          const trust = getCompanionTrust(state, COMPANION_ID_BY_UI_ID[companion.id] || 'serin');
          return (
            <div key={companion.id} className={`companion-skill ${joined ? 'companion-joined' : 'companion-pending'}`}>
              <strong>
                {companion.name}
                <em>{companion.id === 'selin' ? '固定同行' : joined ? '已入队' : '待招募'}</em>
              </strong>
              <small>
                {companion.role} · HP {hp}/{companion.hp} · 信任 {trust} · {getTrustTier(trust)}
              </small>
              <p>{companion.skills.combat[0].name}: {companion.skills.combat[0].check}</p>
              <p>{companion.skills.nonCombat[0].name}: {companion.skills.nonCombat[0].check}</p>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function TrustRow({
  name,
  value,
  joined,
  hp,
  maxHp,
  fixed,
}: {
  name: string;
  value: number;
  joined: boolean;
  hp: number;
  maxHp: number;
  fixed?: boolean;
}) {
  return (
    <div className="trust-row">
      <span>
        {name}
        <small>{fixed ? '固定同行' : joined ? `已入队 · HP ${hp}/${maxHp}` : '待招募'}</small>
      </span>
      <b className={value >= 70 ? 'trust-high' : value < 30 ? 'trust-low' : ''}>{value}</b>
      <em className="trust-tier">{getTrustTier(value)}</em>
    </div>
  );
}

export default CharacterPanel;
