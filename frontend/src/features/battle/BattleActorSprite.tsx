export interface BattleActorSpriteUnit {
  id: string;
  name: string;
  model: string;
  hp: number;
  faction: 'ally' | 'enemy' | string;
  statuses?: unknown[];
}

export interface BattleActorFeedback {
  text: string;
  tone: 'damage' | 'heal' | 'miss' | 'effect' | string;
}

export interface BattleActorSpriteProps<TUnit extends BattleActorSpriteUnit = BattleActorSpriteUnit> {
  unit: TUnit;
  active: boolean;
  targetable: boolean;
  casting: boolean;
  impacted: boolean;
  animationKey?: number;
  effectKind?: string;
  feedback?: BattleActorFeedback;
  onClick: () => void;
  getHpPercent: (unit: TUnit) => number;
  getSpriteSheetUrl: (model: string) => string | undefined;
}

export function BattleActorSprite<TUnit extends BattleActorSpriteUnit>({
  unit,
  active,
  targetable,
  casting,
  impacted,
  animationKey,
  effectKind = 'slash',
  feedback,
  onClick,
  getHpPercent,
  getSpriteSheetUrl,
}: BattleActorSpriteProps<TUnit>) {
  const spriteSheetUrl = getSpriteSheetUrl(unit.model);
  const statusText = JSON.stringify(unit.statuses ?? []);
  const guarded = /防御|damage_reduction_once|护盾|减伤/.test(statusText);

  return (
    <button
      type="button"
      className={`battle-combatant battle-model-${unit.model} ${active ? 'is-active' : ''} ${targetable ? 'is-targetable' : ''} ${casting ? 'is-casting' : ''} ${impacted ? 'is-impacted' : ''} ${feedback?.tone === 'miss' ? 'is-missed' : ''} ${guarded ? 'is-guarded' : ''} ${unit.hp <= 0 ? 'is-defeated' : ''} ${unit.faction === 'enemy' ? 'is-enemy' : 'is-ally'}`}
      onClick={onClick}
      aria-label={unit.name}
    >
      <span className={`battle-sprite battle-sprite-${unit.model}`}>
        {spriteSheetUrl ? (
          <span
            className="sprite-sheet"
            style={{
              backgroundImage: `url(${spriteSheetUrl})`,
            }}
          />
        ) : (
          <>
            <span className="sprite-aura" />
            <span className="sprite-head" />
            <span className="sprite-body" />
            <span className="sprite-weapon" />
          </>
        )}
      </span>
      {impacted && (
        <span
          key={`impact-${animationKey ?? unit.id}`}
          className={`battle-impact-effect battle-impact-${effectKind}`}
          aria-hidden="true"
        >
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
      )}
      {feedback && (
        <span
          key={`feedback-${animationKey ?? unit.id}`}
          className={`battle-floating-feedback is-${feedback.tone}`}
          aria-hidden="true"
        >
          {feedback.text}
        </span>
      )}
      <span className="battle-combatant-info">
        <span className="battle-combatant-name">{unit.name}</span>
        <span className="battle-combatant-hp">
          <i style={{ width: `${getHpPercent(unit)}%` }} />
        </span>
      </span>
    </button>
  );
}
