import type { GameState } from '../../types/game';
import { buildTrustPatch, getCompanionTrust } from '../../utils/trust';
import { DEFAULT_INVENTORY, appendInventoryItem } from '../inventory/inventoryStatePatch';

export interface OrlanRewardItem {
  itemId: string;
  name: string;
  count: number;
  type: string;
  desc: string;
  icon: string;
  min?: number;
  max?: number;
}

export interface OrlanDrawRecord {
  index: number;
  d20: number;
  reward: OrlanRewardItem;
  cost: number;
  isPity: boolean;
}

export interface OrlanBoxResult {
  drawCount: number;
  spent: number;
  rewards: OrlanRewardItem[];
  finalD20: number;
  guaranteed: boolean;
  rewardHistory: OrlanDrawRecord[];
  hasDiamond: boolean;
  failedNoGoldNoDiamond?: boolean;
}

export const ORLAN_DRAW_COST = 20;
export const ORLAN_PITY_LIMIT = 10;
export const ORLAN_DIAMOND_MIN_ROLL = 19;

export const ORLAN_REWARD_TABLE: OrlanRewardItem[] = [
  { itemId: 'copper_ring', name: '生锈铜戒指', count: 1, type: '旧物', min: 1, max: 2, icon: '/assets/prop/aolan_blindbox/copper_ring.png', desc: '边缘磨得发黑，奥兰坚持说它曾经属于一位勇敢的人。' },
  { itemId: 'old_talisman_fragments', name: '旧护符碎片', count: 1, type: '材料', min: 3, max: 4, icon: '/assets/prop/aolan_blindbox/old_talisman_fragments.png', desc: '残缺的护符碎片，表面还有几道不完整的祈愿纹。' },
  { itemId: 'hemostatic_powder', name: '止血粉', count: 1, type: '消耗品', min: 5, max: 6, icon: '/assets/prop/aolan_blindbox/hemostatic_powder.png', desc: '可用于处理普通流血伤口，味道像苦涩的铁锈。' },
  { itemId: 'weakly_effective_detoxifying_agent', name: '弱效解毒剂', count: 1, type: '消耗品', min: 7, max: 8, icon: '/assets/prop/aolan_blindbox/weakly_effective_detoxifying_agent.png', desc: '能缓解轻微毒素，但对深层污染效果有限。' },
  { itemId: 'cold_light_stick', name: '冷光棒', count: 1, type: '探索', min: 9, max: 10, icon: '/assets/prop/aolan_blindbox/cold_light_stick.png', desc: '短时间照亮周围环境，不会产生明显热源。' },
  { itemId: 'sealed_sample_bottle', name: '密封样本瓶', count: 1, type: '探索', min: 11, max: 13, icon: '/assets/prop/aolan_blindbox/sealed_sample_bottle.png', desc: '可用于保存孢子、菌丝或污染残留。' },
  { itemId: 'small_bottle_therapeutic_solution', name: '小瓶治疗药水', count: 1, type: '消耗品', min: 14, max: 16, icon: '/assets/prop/aolan_blindbox/small_bottle_therapeutic_solution.png', desc: '能恢复少量生命，适合应急。' },
  { itemId: 'blackmarket_chips', name: '黑市筹码', count: 1, type: '特殊', min: 17, max: 18, icon: '/assets/prop/aolan_blindbox/blackmarket_chips.png', desc: '黑市流通的小筹码，也许以后能派上用场。' },
];

export const ORLAN_DIAMOND_REWARD: OrlanRewardItem = {
  itemId: 'diamond',
  name: '干净的钻石',
  count: 1,
  type: '关键道具',
  icon: '/assets/prop/aolan_blindbox/diamond.png',
  desc: '未经附魔、没有追踪印记的天然钻石。凯娅要的就是它。',
};

export function resolveOrlanDraw(d20: number, drawCount: number, hasDiamond: boolean): OrlanDrawRecord {
  const nextDrawCount = drawCount + 1;
  const isNaturalDiamond = d20 >= ORLAN_DIAMOND_MIN_ROLL;
  const isPityDiamond = nextDrawCount >= ORLAN_PITY_LIMIT && !hasDiamond;
  const isPity = isPityDiamond && !isNaturalDiamond;
  const tableReward = ORLAN_REWARD_TABLE.find(
    (item) => d20 >= (item.min ?? 1) && d20 <= (item.max ?? 20),
  ) ?? ORLAN_REWARD_TABLE[0];
  const reward = isNaturalDiamond || isPityDiamond
    ? { ...ORLAN_DIAMOND_REWARD }
    : { ...tableReward };
  return { index: nextDrawCount, d20, reward, cost: ORLAN_DRAW_COST, isPity };
}

export interface OrlanCompletion {
  patch: GameState;
  hasDiamond: boolean;
  failedNoGoldNoDiamond: boolean;
  nextInventory: string;
  eventMessages: string[];
}

export function resolveOrlanCompletion(current: GameState, result: OrlanBoxResult): OrlanCompletion {
  const hasDiamond = Boolean(result.hasDiamond || result.rewards.some((reward) => reward.itemId === 'diamond'));
  let nextInventory = String(current.inventory || DEFAULT_INVENTORY);
  result.rewards.forEach((reward) => {
    nextInventory = appendInventoryItem(nextInventory, reward.name);
  });

  const failedNoGoldNoDiamond = Boolean(result.failedNoGoldNoDiamond && !hasDiamond);
  const basePatch: GameState = {
    gold: Math.max(0, Number(current.gold ?? 200) - result.spent),
    inventory: nextInventory,
    lucky_box_done: true,
    lucky_box_attempts: result.drawCount,
    lucky_box_spent: result.spent,
    lucky_box_final_roll: result.finalD20,
    lucky_box_guaranteed: result.guaranteed,
  };

  const eventMessages = result.rewards.map((reward) => `获得 ${reward.name}`);
  if (result.spent) eventMessages.push(`金币 -${result.spent}`);

  if (failedNoGoldNoDiamond) {
    const trustPatch = buildTrustPatch(current, { kaiya: getCompanionTrust(current, 'kaiya') - 40 });
    return {
      hasDiamond,
      failedNoGoldNoDiamond,
      nextInventory,
      eventMessages: [...eventMessages, '凯娅信任 -40'],
      patch: {
        ...basePatch,
        ...trustPatch,
        orlanBoxFailedNoGoldNoDiamond: true,
        lucky_box_failed_no_gold_no_diamond: true,
        gotDiamondForKaiya: false,
        kaiya_diamond_paid: false,
        kaiya_joined_with_debt: true,
        last_event: '奥兰幸运盲盒失败，金币耗尽且没有获得钻石；凯娅负债入队，信任-40',
      },
    };
  }

  return {
    hasDiamond,
    failedNoGoldNoDiamond,
    nextInventory,
    eventMessages,
    patch: {
      ...basePatch,
      gotDiamondForKaiya: hasDiamond,
      kaiya_diamond_paid: hasDiamond,
      last_event: `奥兰幸运盲盒抽到钻石，共${result.drawCount}次，花费${result.spent}金`,
    },
  };
}

export function buildYunlingBonusInventory(inventoryText: string) {
  return appendInventoryItem(inventoryText, '治疗药水x3');
}
