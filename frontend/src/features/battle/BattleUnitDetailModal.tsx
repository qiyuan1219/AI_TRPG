import { motion } from 'framer-motion';
import type { CSSProperties, ReactNode } from 'react';
import { SkillCard, type SkillCardModel } from './SkillCard';

export interface BattleUnitDetailAbility {
  key: string;
  label: string;
}

export interface BattleUnitDetailModel<TSkill extends SkillCardModel = SkillCardModel> {
  id: string;
  name: string;
  role: string;
  model: string;
  hp: number;
  maxHp: number;
  ac: number;
  proficiency: number;
  weaponMastery?: string;
  abilities: Record<string, number>;
  statuses: string[];
  traits: string[];
  resourceProfile: string[];
  skills: TSkill[];
  nonCombatSkills: Array<{ name: string; check: string; effect: string }>;
}

export interface BattleUnitDetailModalProps<
  TSkill extends SkillCardModel = SkillCardModel,
  TUnit extends BattleUnitDetailModel<TSkill> = BattleUnitDetailModel<TSkill>,
> {
  unit: TUnit;
  initiative?: { total: number };
  abilityLabels: BattleUnitDetailAbility[];
  onClose: () => void;
  getHpPercent: (unit: TUnit) => number;
  getAvatarClassName: (model: string) => string;
  getAvatarStyle: (model: string) => CSSProperties | undefined;
  formatModifier: (value: number) => string;
  abilityModifier: (value: number) => number;
  formatCombatText: (value: string) => string;
  renderSkillFormula: (skill: TSkill) => ReactNode;
  renderSkillEffect: (skill: TSkill) => ReactNode;
  skillNeedsRoll: (skill: TSkill) => boolean;
  visibleSkillTags: (skill: TSkill) => string[];
}

export function BattleUnitDetailModal<
  TSkill extends SkillCardModel,
  TUnit extends BattleUnitDetailModel<TSkill>,
>({
  unit,
  initiative,
  abilityLabels,
  onClose,
  getHpPercent,
  getAvatarClassName,
  getAvatarStyle,
  formatModifier,
  abilityModifier,
  formatCombatText,
  renderSkillFormula,
  renderSkillEffect,
  skillNeedsRoll,
  visibleSkillTags,
}: BattleUnitDetailModalProps<TSkill, TUnit>) {
  return (
    <motion.div
      className="battle-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.section
        className="battle-unit-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${unit.name} 详情`}
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="battle-modal-header">
          <div className={getAvatarClassName(unit.model)} style={getAvatarStyle(unit.model)} />
          <div>
            <span>{unit.name}</span>
            <small>{unit.role}</small>
          </div>
          <button type="button" aria-label="关闭" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="battle-detail-grid">
          <section className="battle-detail-block">
            <h2>状态</h2>
            <div className="battle-stat-row">
              <span>HP</span>
              <b>
                {unit.hp}/{unit.maxHp}
              </b>
            </div>
            <div className="battle-wide-hp">
              <i style={{ width: `${getHpPercent(unit)}%` }} />
            </div>
            <div className="battle-stat-row">
              <span>AC</span>
              <b>{unit.ac}</b>
            </div>
            <div className="battle-stat-row">
              <span>熟练</span>
              <b>{formatModifier(unit.proficiency)}</b>
            </div>
            {initiative && (
              <div className="battle-stat-row">
                <span>先攻</span>
                <b>{initiative.total}</b>
              </div>
            )}
            {unit.weaponMastery && (
              <div className="battle-stat-note">
                <b>精通资源</b>
                <span>{formatCombatText(unit.weaponMastery)}</span>
              </div>
            )}
            <div className="battle-status-list">
              {unit.statuses.map((status) => (
                <span key={status}>{formatCombatText(status)}</span>
              ))}
            </div>
          </section>

          <section className="battle-detail-block battle-abilities">
            <h2>六维数值</h2>
            {abilityLabels.map(({ key, label }) => {
              const value = unit.abilities[key];
              return (
                <div key={key} className="battle-ability-tile">
                  <span>{label}</span>
                  <b>{value}</b>
                  <small>{formatModifier(abilityModifier(value))}</small>
                </div>
              );
            })}
          </section>

          <section className="battle-detail-block battle-traits">
            <h2>规则画像</h2>
            {unit.traits.map((trait) => (
              <span key={trait}>{formatCombatText(trait)}</span>
            ))}
            {unit.resourceProfile.map((profile) => (
              <span key={profile}>{formatCombatText(profile)}</span>
            ))}
          </section>

          <section className="battle-detail-block battle-skills">
            <h2>战斗技能</h2>
            {unit.skills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                compact={false}
                renderFormula={renderSkillFormula}
                renderEffect={renderSkillEffect}
                skillNeedsRoll={skillNeedsRoll}
                visibleSkillTags={visibleSkillTags}
              />
            ))}
          </section>

          {unit.nonCombatSkills.length > 0 && (
            <section className="battle-detail-block battle-noncombat-skills">
              <h2>非战斗技能</h2>
              {unit.nonCombatSkills.map((skill) => (
                <article key={skill.name}>
                  <b>{skill.name}</b>
                  <small>{skill.check}</small>
                  <p>{skill.effect}</p>
                </article>
              ))}
            </section>
          )}
        </div>
      </motion.section>
    </motion.div>
  );
}
