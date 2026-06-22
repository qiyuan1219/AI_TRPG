import { describe, expect, it } from 'vitest';
import { buildHealingConsumablePatch, getHealingConsumable, getHealingTargets } from './healingConsumables';

describe('healing consumables', () => {
  it('caps player healing at max HP and consumes one potion', () => {
    const item = getHealingConsumable('healing_potion', '治疗药水')!;
    const result = buildHealingConsumablePatch({
      inventory: '长剑,治疗药水x2',
      current_hp: 45,
      max_hp: 50,
      player: { id: 'player', name: '冒险者', level: 1, gold: 0, hp: 45, maxHp: 50 },
    }, item, 'player', 12);
    expect(result.patch).toMatchObject({ current_hp: 50, inventory: '长剑,治疗药水', player: { hp: 50, maxHp: 50 } });
    expect(result.recovered).toBe(5);
  });

  it('uses D6 small potion on a recruited companion', () => {
    const item = getHealingConsumable('small_healing_potion', '小瓶治疗药水')!;
    const state = { inventory: '小瓶治疗药水', al_recruited: true, al_hp: 20 };
    expect(getHealingTargets(state).some((target) => target.id === 'ailin')).toBe(true);
    const result = buildHealingConsumablePatch(state, item, 'ailin', 6);
    expect(result.patch).toMatchObject({ al_hp: 26, inventory: '' });
  });

  it('does not consume a potion on a full-health target', () => {
    const item = getHealingConsumable('healing_potion', '治疗药水')!;
    expect(() => buildHealingConsumablePatch({ inventory: '治疗药水', current_hp: 50, max_hp: 50 }, item, 'player', 4))
      .toThrow('生命值已经全满');
  });
});
