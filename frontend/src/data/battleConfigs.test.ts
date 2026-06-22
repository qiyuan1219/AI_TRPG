import { describe, expect, it } from 'vitest';
import { getBattleConfigById } from './battleConfigs';
import { getPlayerStyleById } from './dndClasses';

describe('formal battle configs', () => {
  it('serves the tutorial encounter from the formal battle config map', () => {
    const config = getBattleConfigById('tutorial-crawler-battle');

    expect(config?.title).toBe('补给平台教学战斗');
    expect(config?.tutorialIntro?.steps).toHaveLength(6);
    expect(config?.units.filter((unit) => unit.faction === 'ally').map((unit) => unit.model))
      .toEqual(['adventurer', 'selin']);
    expect(config?.units.filter((unit) => unit.faction === 'enemy')).toHaveLength(3);
    const sporeDust = config?.units.find((unit) => unit.faction === 'enemy')?.skills.find((skill) => skill.name === '孢尘喷吐');
    expect(sporeDust?.roll.kind).toBe('attack');
  });

  it('uses readable shared player skills and defensive third slots', () => {
    const config = getBattleConfigById('enemy_pack_blue_shoal');
    const allies = config?.units.filter((unit) => unit.faction === 'ally') ?? [];
    const adventurer = allies.find((unit) => unit.model === 'adventurer');

    expect(adventurer?.skills.map((skill) => skill.name)).toEqual(['稳步斩击', '回气', '防御']);
    expect(allies.every((unit) => unit.skills[2]?.name === '防御')).toBe(true);
    expect(allies.find((unit) => unit.model === 'selin')).toMatchObject({ hp: 36, maxHp: 36, ac: 12 });
    expect(allies.find((unit) => unit.model === 'ailin')).toMatchObject({ hp: 36, maxHp: 36, ac: 12 });
    expect(allies.find((unit) => unit.model === 'senluo')).toMatchObject({ hp: 45, maxHp: 45, ac: 13 });
    expect(allies.find((unit) => unit.model === 'kelaiya')).toMatchObject({ hp: 30, maxHp: 30, ac: 18 });
    expect(allies.find((unit) => unit.model === 'senluo')?.skills[1].formula).toContain('1d12+3');
    expect(allies.find((unit) => unit.model === 'ailin')?.skills[1].effect).toContain('我方全体');
    expect(allies.find((unit) => unit.model === 'kelaiya')?.skills[1].formula).toContain('1d12');
  });

  it('removes crawler cower and marks mimic spore burst as a real group save', () => {
    const tutorial = getBattleConfigById('tutorial-crawler-battle')!;
    expect(tutorial.units.filter((unit) => unit.faction === 'enemy').every((unit) => !unit.skills.some((skill) => skill.name === '惊慌缩伏'))).toBe(true);
    const shoal = getBattleConfigById('enemy_pack_blue_shoal')!;
    const burst = shoal.units.find((unit) => unit.model === 'fungal_mimic')?.skills.find((skill) => skill.name === '孢粉爆发');
    expect(burst?.tags).toEqual(expect.arrayContaining(['豁免', '群体', '全体']));
  });

  it.each([
    'tutorial-crawler-battle',
    'enemy_pack_blue_shoal',
    'enemy_pack_bone_marsh',
    'boss_blackstone_gatekeeper',
  ])('injects the selected player style into %s', (battleId) => {
    const style = getPlayerStyleById('shadow-step');
    const config = getBattleConfigById(battleId, {
      selected_style_id: style.id,
      current_hp: 31,
      player: { styleId: style.id, attributes: style.attributes, hp: 31 },
    });
    const adventurer = config?.units.find((unit) => unit.model === 'adventurer');

    expect(adventurer?.abilities).toEqual(style.attributes);
    expect(adventurer?.hp).toBe(battleId === 'tutorial-crawler-battle' ? style.derived.hp : 31);
    expect(adventurer?.maxHp).toBe(style.derived.hp);
    expect(adventurer?.ac).toBe(style.derived.ac);
    expect(adventurer?.initiativeBonus).toBe(style.derived.initiativeModifier);
  });

  it('clamps carried HP to the selected style maximum', () => {
    const style = getPlayerStyleById('resonance');
    const config = getBattleConfigById('tutorial-crawler-battle', {
      selected_style_id: style.id,
      current_hp: 999,
      player: { styleId: style.id, attributes: style.attributes, hp: 999 },
    });
    const adventurer = config?.units.find((unit) => unit.model === 'adventurer');

    expect(adventurer?.hp).toBe(style.derived.hp);
    expect(adventurer?.maxHp).toBe(style.derived.hp);
  });
});
