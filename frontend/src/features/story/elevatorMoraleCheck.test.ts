import { describe, expect, it } from 'vitest';
import { resolveElevatorMoraleCheck } from './elevatorMoraleCheck';

const action = '鼓舞队伍士气，让众人在垂降前重新集中精神【魅力DC10】';

describe('resolveElevatorMoraleCheck', () => {
  it('成功时为四名队友各增加 2 点信任', () => {
    const result = resolveElevatorMoraleCheck({ se_trust: 84, trust_al: 55, trust_block: 50, trust_kl: 45 }, action, true);
    expect(result?.patch.companionTrust).toEqual({ serin: 86, ailin: 57, brock: 52, kaiya: 47 });
    expect(result?.patch.elevator_morale_check_success).toBe(true);
  });

  it('失败时只扣 1 点生命且不改变信任', () => {
    const result = resolveElevatorMoraleCheck({
      current_hp: 12,
      player: { id: 'player', name: '测试员', level: 1, gold: 0, hp: 12, maxHp: 12 },
      trust_al: 55,
    }, action, false);
    expect(result?.patch.current_hp).toBe(11);
    expect(result?.patch.player?.hp).toBe(11);
    expect(result?.patch.companionTrust).toBeUndefined();
  });

  it('同一检定不能重复结算', () => {
    expect(resolveElevatorMoraleCheck({ elevator_morale_check_done: true }, action, true)).toBeNull();
  });
});
