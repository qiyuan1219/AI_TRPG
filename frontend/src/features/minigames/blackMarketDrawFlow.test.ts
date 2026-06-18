import { describe, expect, it } from 'vitest';
import { resolveOrlanCompletion, resolveOrlanDraw, type OrlanBoxResult } from './blackMarketDrawFlow';

describe('black market draw flow', () => {
  it('awards a natural diamond on D20 >= 19', () => {
    expect(resolveOrlanDraw(18, 0, false).reward.itemId).toBe('blackmarket_chips');
    expect(resolveOrlanDraw(19, 0, false).reward.itemId).toBe('diamond');
    expect(resolveOrlanDraw(20, 0, false).reward.itemId).toBe('diamond');
  });

  it('awards the diamond on the tenth draw through pity', () => {
    const draw = resolveOrlanDraw(1, 9, false);
    expect(draw.reward.itemId).toBe('diamond');
    expect(draw.isPity).toBe(true);
  });

  it('keeps the no-gold debt outcome and Kaiya trust penalty', () => {
    const result: OrlanBoxResult = {
      drawCount: 2,
      spent: 40,
      rewards: [resolveOrlanDraw(1, 0, false).reward],
      finalD20: 1,
      guaranteed: false,
      rewardHistory: [],
      hasDiamond: false,
      failedNoGoldNoDiamond: true,
    };
    const outcome = resolveOrlanCompletion({ gold: 40, inventory: '长剑', trust_kl: 50 }, result);
    expect(outcome.failedNoGoldNoDiamond).toBe(true);
    expect(outcome.patch.gold).toBe(0);
    expect(outcome.patch.trust_kl).toBe(10);
    expect(outcome.patch.kl_trust).toBe(10);
    expect(outcome.patch.kaiya_joined_with_debt).toBe(true);
  });
});
