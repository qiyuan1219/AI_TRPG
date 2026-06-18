import type { ReactNode } from 'react';

export interface SkillCardModel {
  id: string;
  name: string;
  resource: string;
  cooldown: string;
  rule: string;
  trigger?: string;
  locked?: boolean;
}

export interface SkillCardProps<TSkill extends SkillCardModel = SkillCardModel> {
  skill: TSkill;
  compact?: boolean;
  renderFormula: (skill: TSkill) => ReactNode;
  renderEffect: (skill: TSkill) => ReactNode;
  skillNeedsRoll: (skill: TSkill) => boolean;
  visibleSkillTags: (skill: TSkill) => string[];
}

export function SkillCard<TSkill extends SkillCardModel>({
  skill,
  compact = true,
  renderFormula,
  renderEffect,
  skillNeedsRoll,
  visibleSkillTags,
}: SkillCardProps<TSkill>) {
  return (
    <article className={`battle-skill-card ${skill.locked ? 'is-locked' : ''} ${compact ? 'is-compact' : ''}`}>
      <div className="battle-skill-card-head">
        <span>{skill.resource}</span>
        <b>{skill.name}</b>
        <em>{skill.cooldown}</em>
      </div>
      <small>{renderFormula(skill)}</small>
      {!compact && <p>{renderEffect(skill)}</p>}
      <div className="battle-skill-meta">
        <i>{skillNeedsRoll(skill) ? '需掷骰' : '无掷骰'}</i>
        <i>{skill.rule}</i>
        {skill.trigger && <i>{skill.trigger}</i>}
        {visibleSkillTags(skill).map((tag) => (
          <i key={tag}>{tag}</i>
        ))}
      </div>
    </article>
  );
}
