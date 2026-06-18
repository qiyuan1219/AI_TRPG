import { BattleActorSprite, type BattleActorFeedback, type BattleActorSpriteUnit } from './BattleActorSprite';

export interface BattleActorViewState {
  active: boolean;
  targetable: boolean;
  casting: boolean;
  impacted: boolean;
  animationKey?: number;
  effectKind?: string;
  feedback?: BattleActorFeedback;
}

export interface BattleFieldProps<TUnit extends BattleActorSpriteUnit = BattleActorSpriteUnit> {
  allies: TUnit[];
  enemies: TUnit[];
  getActorState: (unit: TUnit) => BattleActorViewState;
  onSelectUnit: (unitId: string) => void;
  getHpPercent: (unit: TUnit) => number;
  getSpriteSheetUrl: (model: string) => string | undefined;
}

export function BattleField<TUnit extends BattleActorSpriteUnit>({
  allies,
  enemies,
  getActorState,
  onSelectUnit,
  getHpPercent,
  getSpriteSheetUrl,
}: BattleFieldProps<TUnit>) {
  const renderUnit = (unit: TUnit) => {
    const state = getActorState(unit);
    return (
      <BattleActorSprite
        key={unit.id}
        unit={unit}
        active={state.active}
        targetable={state.targetable}
        casting={state.casting}
        impacted={state.impacted}
        animationKey={state.animationKey}
        effectKind={state.effectKind}
        feedback={state.feedback}
        onClick={() => onSelectUnit(unit.id)}
        getHpPercent={getHpPercent}
        getSpriteSheetUrl={getSpriteSheetUrl}
      />
    );
  };

  return (
    <section className="battle-field" aria-label="战斗场景">
      <div className="battle-side battle-side-ally">
        {allies.map(renderUnit)}
      </div>
      <div className="battle-side battle-side-enemy">
        {enemies.map(renderUnit)}
      </div>
    </section>
  );
}
