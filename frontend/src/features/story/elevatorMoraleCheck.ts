import type { GameState } from '../../types/game';
import { buildTrustPatch, getCompanionTrust } from '../../utils/trust';

export const ELEVATOR_MORALE_ACTION_RE = /鼓舞队伍士气.*垂降前重新集中精神/;

export function resolveElevatorMoraleCheck(
  state: GameState,
  action: string,
  success: boolean,
): { patch: GameState; directive: string } | null {
  if (!ELEVATOR_MORALE_ACTION_RE.test(action) || state.elevator_morale_check_done) return null;

  if (success) {
    const trustPatch = buildTrustPatch(state, {
      serin: getCompanionTrust(state, 'serin') + 2,
      ailin: getCompanionTrust(state, 'ailin') + 2,
      brock: getCompanionTrust(state, 'brock') + 2,
      kaiya: getCompanionTrust(state, 'kaiya') + 2,
    });
    return {
      patch: {
        ...trustPatch,
        elevator_morale_check_done: true,
        elevator_morale_check_success: true,
        last_event: '垂降前成功鼓舞队伍，全体队友信任值 +2',
      } satisfies GameState,
      directive: '\n【缆梯鼓舞固定结算】检定成功。写出主角在垂降前说出鼓励的话，队伍重新集中精神；瑟琳、艾琳、布洛克、凯娅信任值各 +2。不得改变奖励。',
    };
  }

  const currentHp = Math.max(0, Number(state.current_hp ?? state.player?.hp ?? 0));
  const nextHp = Math.max(0, currentHp - 1);
  const playerPatch = state.player ? { player: { ...state.player, hp: nextHp } } : {};
  return {
    patch: {
      elevator_morale_check_done: true,
      elevator_morale_check_success: false,
      current_hp: nextHp,
      ...playerPatch,
      last_event: '垂降时感到头晕，未能鼓舞队伍，生命值 -1',
    } satisfies GameState,
    directive: '\n【缆梯鼓舞固定结算】检定失败。写出下降过程中主角感到头晕，没能对队友说出鼓励的话；所有队友信任值不变，主角 HP -1。不得给予其他补偿或改变结果。',
  };
}
