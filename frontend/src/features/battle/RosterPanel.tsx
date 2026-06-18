import type { CSSProperties } from 'react';

export interface RosterUnit {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  ac: number;
  model: string;
}

export interface RosterPanelProps<TUnit extends RosterUnit = RosterUnit> {
  title: string;
  units: TUnit[];
  activeUnitId?: string;
  align?: 'left' | 'right';
  onSelect: (unitId: string) => void;
  getHpPercent: (unit: TUnit) => number;
  getAvatarClassName: (model: string) => string;
  getAvatarStyle: (model: string) => CSSProperties | undefined;
}

export function RosterPanel<TUnit extends RosterUnit>({
  title,
  units,
  activeUnitId,
  align = 'left',
  onSelect,
  getHpPercent,
  getAvatarClassName,
  getAvatarStyle,
}: RosterPanelProps<TUnit>) {
  return (
    <aside className={`battle-roster battle-roster-${align}`}>
      <span className="battle-roster-title">{title}</span>
      {units.map((unit) => (
        <button
          key={unit.id}
          type="button"
          className={`battle-roster-unit ${unit.id === activeUnitId ? 'is-active' : ''} ${unit.hp <= 0 ? 'is-defeated' : ''}`}
          onClick={() => onSelect(unit.id)}
        >
          <span className={getAvatarClassName(unit.model)} style={getAvatarStyle(unit.model)} />
          <span className="battle-roster-copy">
            <span className="roster-name-hp">
              <b>{unit.name}</b>
              <span className="battle-mini-hp">
                <i style={{ width: `${getHpPercent(unit)}%` }} />
              </span>
            </span>
            <small>
              HP {unit.hp}/{unit.maxHp} · AC {unit.ac}
            </small>
          </span>
        </button>
      ))}
    </aside>
  );
}
