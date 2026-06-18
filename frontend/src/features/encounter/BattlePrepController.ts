import {
  createBattlePrepFlowState,
  finalizeBattlePrepResult,
  lockBattlePrepForNarration,
  shouldShowBattlePrepPanel,
  useFictionDice,
  useOmniDice,
  type BattlePrepChoice,
  type BattlePrepResolveResult,
  type RerollItemId,
} from '../../utils/battlePrep';

export class BattlePrepController {
  create() {
    return createBattlePrepFlowState();
  }

  shouldShow(flow: Parameters<typeof shouldShowBattlePrepPanel>[0]) {
    return shouldShowBattlePrepPanel(flow);
  }

  reroll(itemId: RerollItemId, choice: BattlePrepChoice, result: BattlePrepResolveResult, state: any, chosenFace?: number) {
    return itemId === 'fiction-dice'
      ? useFictionDice(choice, result, state)
      : useOmniDice(choice, result, state, chosenFace ?? 0);
  }

  confirm(choice: BattlePrepChoice, result: BattlePrepResolveResult) {
    return {
      result: finalizeBattlePrepResult(choice, result),
      flow: lockBattlePrepForNarration(),
    };
  }
}

export const battlePrepController = new BattlePrepController();
