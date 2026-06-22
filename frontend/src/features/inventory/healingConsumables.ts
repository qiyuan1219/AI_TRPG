import { DND_COMPANIONS } from '../../data/dndClasses';
import type { GameState } from '../../types/game';
import { changeInventoryQuantity } from './inventoryStatePatch';

export type HealingTargetId = 'player' | 'serin' | 'ailin' | 'brock' | 'kaiya';

export interface HealingConsumableDefinition {
  itemId: string;
  itemName: string;
  dieSides: 6 | 12;
}

export interface HealingTarget {
  id: HealingTargetId;
  name: string;
  hpKey: string;
  currentHp: number;
  maxHp: number;
  avatar: string;
}

export const HEALING_CONSUMABLES: Record<string, HealingConsumableDefinition> = {
  healing_potion: { itemId: 'healing_potion', itemName: '治疗药水', dieSides: 12 },
  small_healing_potion: { itemId: 'small_healing_potion', itemName: '小瓶治疗药水', dieSides: 6 },
};

const COMPANION_TARGETS: Array<{
  id: Exclude<HealingTargetId, 'player'>;
  companionId: string;
  recruitKeys: string[];
  avatar: string;
}> = [
  { id: 'serin', companionId: 'selin', recruitKeys: ['se_recruited', 'serin_recruited', 'selin_recruited'], avatar: '/assets/chibi/selin/avatar.png' },
  { id: 'ailin', companionId: 'ailin', recruitKeys: ['al_recruited', 'ailin_recruited'], avatar: '/assets/chibi/ailin/avatar.png' },
  { id: 'brock', companionId: 'senluo', recruitKeys: ['sl_recruited', 'brock_recruited'], avatar: '/assets/chibi/senluo/avatar.png' },
  { id: 'kaiya', companionId: 'kelaiya', recruitKeys: ['kl_recruited', 'kaiya_recruited'], avatar: '/assets/chibi/kelaiya/avatar.png' },
];

function finiteHp(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : fallback;
}

export function getHealingConsumable(itemId: string, itemName: string) {
  return HEALING_CONSUMABLES[itemId]
    || Object.values(HEALING_CONSUMABLES).find((item) => item.itemName === itemName)
    || null;
}

export function getHealingTargets(state: GameState): HealingTarget[] {
  const playerMax = finiteHp(state.max_hp ?? state.player?.maxHp, 30);
  const targets: HealingTarget[] = [{
    id: 'player',
    name: String(state.player_name || state.player?.name || '冒险者'),
    hpKey: 'current_hp',
    currentHp: Math.min(playerMax, finiteHp(state.current_hp ?? state.player?.hp, playerMax)),
    maxHp: playerMax,
    avatar: '/assets/chibi/adventurer/avatar.png',
  }];

  COMPANION_TARGETS.forEach((config) => {
    const preset = DND_COMPANIONS.find((item) => item.id === config.companionId);
    if (!preset) return;
    const hasJoined = config.id === 'serin'
      || config.recruitKeys.some((key) => Boolean(state[key]))
      || state[preset.hpKey] !== undefined;
    if (!hasJoined) return;
    const maxKey = `${preset.hpKey}_max`;
    const maxHp = finiteHp(state[maxKey], preset.hp);
    targets.push({
      id: config.id,
      name: preset.name,
      hpKey: preset.hpKey,
      currentHp: Math.min(maxHp, finiteHp(state[preset.hpKey], maxHp)),
      maxHp,
      avatar: config.avatar,
    });
  });
  return targets;
}

export function buildHealingConsumablePatch(
  state: GameState,
  item: HealingConsumableDefinition,
  targetId: HealingTargetId,
  rolledHealing: number,
) {
  if (!Number.isInteger(rolledHealing) || rolledHealing < 1 || rolledHealing > item.dieSides) {
    throw new Error(`治疗骰结果必须在 1 到 ${item.dieSides} 之间`);
  }
  const target = getHealingTargets(state).find((entry) => entry.id === targetId);
  if (!target) throw new Error('治疗目标不存在或尚未入队');
  if (target.currentHp >= target.maxHp) throw new Error(`${target.name}的生命值已经全满`);

  const nextHp = Math.min(target.maxHp, target.currentHp + rolledHealing);
  const recovered = nextHp - target.currentHp;
  const patch: Partial<GameState> = {
    inventory: changeInventoryQuantity(String(state.inventory || ''), item.itemName, -1),
    [target.hpKey]: nextHp,
    last_event: `${target.name}使用${item.itemName}，恢复${recovered}点生命（${nextHp}/${target.maxHp}）`,
  };
  if (target.id === 'player') {
    patch.player = { ...(state.player || {}), hp: nextHp, maxHp: target.maxHp } as any;
  }
  return { patch, target, recovered, nextHp };
}
