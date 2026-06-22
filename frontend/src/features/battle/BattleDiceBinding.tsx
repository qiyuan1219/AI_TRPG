import { DiceRollOverlay, type DiceRollOverlayProps } from '../../components/DiceRollOverlay';
import type { DiceResult } from '../../types/game';

export type BattleDicePhase = 'd20' | 'save' | 'damage' | null;

export interface BattleDicePendingAttack {
  unitName: string;
  targetName: string;
  targetAc: number;
  skillName: string;
  hit: boolean;
}

export interface BattleDiceBindingProps {
  activeDice: DiceResult | null;
  attackPhase: BattleDicePhase;
  pendingAttack: BattleDicePendingAttack | null;
  onClose: () => void;
  rerollDecision?: DiceRollOverlayProps['rerollDecision'];
  comparisonRolls?: DiceRollOverlayProps['comparisonRolls'];
}

function inferDiceKind(activeDice: DiceResult, attackPhase: BattleDicePhase) {
  if (attackPhase === 'd20') return '命中判定';
  if (attackPhase === 'save') return '豁免掷骰';
  if (attackPhase === 'damage') return '伤害掷骰';
  if (activeDice.type === 'skill_check') {
    return activeDice.data['成功'] !== undefined && activeDice.data['DC'] ? '豁免掷骰' : '检定掷骰';
  }
  if (activeDice.data['骰子']?.includes('D') && Number(activeDice.data['总计']) > 0) {
    if (activeDice.data['属性']?.includes('治疗') || activeDice.data['属性']?.includes('恢复')) return '治疗掷骰';
    if (activeDice.data['属性']?.includes('伤害')) return '伤害掷骰';
    return '投骰结果';
  }
  return '投骰结果';
}

function inferCharSkill(activeDice: DiceResult, pendingAttack: BattleDicePendingAttack | null) {
  if (pendingAttack) return `${pendingAttack.unitName} · ${pendingAttack.skillName}`;
  return activeDice.data['武器'] || activeDice.data['属性'] || '';
}

export function BattleDiceBinding({
  activeDice,
  attackPhase,
  pendingAttack,
  onClose,
  rerollDecision,
  comparisonRolls,
}: BattleDiceBindingProps) {
  if (!activeDice) return null;

  const isD20Phase = attackPhase === 'd20' || attackPhase === 'save';

  return (
    <DiceRollOverlay
      dice={activeDice}
      dieType="d20"
      attackMode={isD20Phase}
      attackMissed={attackPhase === 'd20' && pendingAttack?.hit === false}
      targetAc={pendingAttack?.targetAc ?? 0}
      diceKind={inferDiceKind(activeDice, attackPhase)}
      charSkill={inferCharSkill(activeDice, pendingAttack)}
      showD20Calc={isD20Phase}
      onClose={onClose}
      rerollDecision={rerollDecision}
      comparisonRolls={comparisonRolls}
    />
  );
}
