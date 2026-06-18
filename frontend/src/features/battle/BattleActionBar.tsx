import { motion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';

export interface BattleActionBarSkill {
  id: string;
  name: string;
  resource: string;
  locked?: boolean;
}

export interface BattleActionBarUnit<TSkill extends BattleActionBarSkill = BattleActionBarSkill> {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  ac: number;
  model: string;
  skills: TSkill[];
}

export interface BattleActionBarProps<
  TSkill extends BattleActionBarSkill = BattleActionBarSkill,
  TUnit extends BattleActionBarUnit<TSkill> = BattleActionBarUnit<TSkill>,
> {
  unit: TUnit;
  usedResources: Partial<Record<string, boolean>>;
  pendingSkill?: TSkill;
  pendingTargets: TUnit[];
  advantage?: { type: 'advantage' | 'disadvantage'; reason: string } | null;
  tacticalAdvice?: { headline: string; reason: string; intent: string; confidence: number } | null;
  onInspect: () => void;
  onClose: () => void;
  onEndTurn: () => void;
  onChooseSkill: (skill: TSkill) => void;
  onSelectTarget: (target: TUnit) => void;
  onCancelTarget: () => void;
  isResourceSpent: (resource: string, usedResources: Partial<Record<string, boolean>>) => boolean;
  formatSkillFormula: (skill: TSkill) => ReactNode;
  getSkillTargetHint: (skill: TSkill) => string;
  getAvatarClassName: (model: string) => string;
  getAvatarStyle: (model: string) => CSSProperties | undefined;
}

export function BattleActionBar<
  TSkill extends BattleActionBarSkill,
  TUnit extends BattleActionBarUnit<TSkill>,
>({
  unit,
  usedResources,
  pendingSkill,
  pendingTargets,
  onInspect,
  onClose,
  onEndTurn,
  onChooseSkill,
  onSelectTarget,
  onCancelTarget,
  advantage,
  tacticalAdvice,
  isResourceSpent,
  formatSkillFormula,
  getSkillTargetHint,
  getAvatarClassName,
  getAvatarStyle,
}: BattleActionBarProps<TSkill, TUnit>) {
  return (
    <motion.section
      className="battle-action-sheet"
      role="dialog"
      aria-label={`${unit.name} 行动`}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 28 }}
    >
      <header>
        <div>
          <span>{unit.name} 的回合</span>
          {advantage && (
            <strong className={`battle-adv-badge ${advantage.type === 'advantage' ? 'is-adv' : 'is-dis'}`}>
              {advantage.type === 'advantage' ? '⚔️ 优势' : '⚠️ 劣势'}：{advantage.reason}
            </strong>
          )}
          {tacticalAdvice && (
            <small style={{ color: 'var(--teal)', fontWeight: 600 }}>
              瑟琳的建议：{tacticalAdvice.reason}
            </small>
          )}
          {!tacticalAdvice && <small>先选技能，再指定释放对象，随后进入骰子判定与效果结算。</small>}
        </div>
        <div className="battle-action-buttons">
          <button type="button" className="ghost-button" onClick={onInspect}>
            详情
          </button>
          <button type="button" className="ghost-button" onClick={onClose}>
            收起
          </button>
          <button type="button" className="start-button" onClick={onEndTurn}>
            结束回合
          </button>
        </div>
      </header>

      <div className="battle-action-content">
        <section className="battle-action-skill-list" aria-label="可用技能">
          {unit.skills.map((skill) => {
            const spent = isResourceSpent(skill.resource, usedResources);
            const disabled = spent || skill.locked;

            return (
              <button
                key={skill.id}
                type="button"
                className={`${disabled ? 'is-disabled' : ''} ${pendingSkill?.id === skill.id ? 'is-selected' : ''}`}
                disabled={disabled}
                onClick={() => onChooseSkill(skill)}
              >
                <span>技能</span>
                <b>{skill.name}</b>
                <small>{formatSkillFormula(skill)}</small>
                <em>{getSkillTargetHint(skill)}</em>
              </button>
            );
          })}
        </section>

        {pendingSkill && (
          <section className="battle-target-picker" aria-label="指定释放对象">
            <header>
              <div>
                <b>指定释放对象</b>
                <span>
                  {pendingSkill.name} · {getSkillTargetHint(pendingSkill)}
                </span>
              </div>
              <button type="button" className="ghost-button" onClick={onCancelTarget}>
                取消
              </button>
            </header>
            <div>
              {pendingTargets.map((target) => (
                <button key={target.id} type="button" onClick={() => onSelectTarget(target)}>
                  <span className={getAvatarClassName(target.model)} style={getAvatarStyle(target.model)} />
                  <b>{target.name}</b>
                  <small>
                    HP {target.hp}/{target.maxHp} · AC {target.ac}
                  </small>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.section>
  );
}
