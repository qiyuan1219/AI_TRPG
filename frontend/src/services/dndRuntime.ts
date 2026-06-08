import { chatStream, createGame } from './api';
import type { DiceResult, GameRuntimeService, GameState } from '../types/game';

const NPC_TRUST_KEYS: Record<string, string> = {
  瑟琳: 'se_trust',
  森洛: 'sl_trust',
  莉亚瑟: 'ly_trust',
  艾琳: 'al_trust',
  克莱娅: 'kl_trust',
  雷铎: 'ld_trust',
};

const NPC_HP_KEYS: Record<string, string> = {
  瑟琳: 'se_hp',
  森洛: 'sl_hp',
  莉亚瑟: 'ly_hp',
  艾琳: 'al_hp',
  克莱娅: 'kl_hp',
  雷铎: 'ld_hp',
};

export function parseDiceEvent(event: string): DiceResult | null {
  const match = event.match(/^\[SYSTEM:(\w+):(\{.+\})\]$/);
  if (!match) {
    if (event.startsWith('[SYSTEM:') || event.startsWith('错误')) return null;
    return { type: 'text', data: { msg: event } };
  }

  try {
    return { type: match[1], data: JSON.parse(match[2]) };
  } catch {
    return { type: 'text', data: { msg: event } };
  }
}

export function formatDiceResult(dice: DiceResult): string {
  const d = dice.data;

  switch (dice.type) {
    case 'skill_check':
      return `${d.成功 ? '检定成功' : '检定失败'} D20=${d.掷骰?.replace('D20=', '')} +${d.加值} = ${d.总计} / DC${d.DC}`;
    case 'attack_roll': {
      const roll = d.攻击掷骰?.match(/D20=(\d+)/)?.[1] || '?';
      return `${d.命中 ? '命中' : '未命中'} D20=${roll}${d.伤害 ? `，造成 ${d.伤害} 点伤害` : ''} / AC${d.目标AC}`;
    }
    case 'roll_dice_tool':
      return `${d.骰子} = ${d.结果}`;
    case 'death_save':
      return d.成功 ? '死亡豁免成功' : '死亡豁免失败';
    case 'error':
      return String(d.msg || '发生错误');
    default:
      return d.msg || JSON.stringify(d);
  }
}

function formatStateChange(change: Record<string, any>) {
  if (change.type === 'snapshot') return '';

  const amount = Number(change.change || 0);
  const signed = amount > 0 ? `+${amount}` : String(amount);
  const reason = change.reason ? `：${change.reason}` : '';

  if (change.type === 'gold') return `金币 ${signed}${reason}`;
  if (change.type === 'hp') return `HP ${signed}${reason}`;
  if (change.type === 'inventory') return `${change.op === 'add' ? '获得' : '失去'} ${change.item}`;
  if (change.type === 'trust') return `${change.npc}信任 ${signed}${reason}`;
  if (change.type === 'area') return `场景切换：${change.new}${reason}`;
  if (change.type === 'level_up') return `升级到 Lv.${change.new}${reason}`;
  if (change.type === 'npc_hp') return `${change.npc} HP ${signed}${reason}`;
  if (change.type === 'attribute') return `${change.attr} ${signed}${reason}`;
  if (change.type === 'xp') return `经验 ${signed}${reason}`;
  if (change.type === 'complete_chapter') return change.reason || '章节完成';
  if (change.type === 'trigger_event') return `剧情事件：${change.event_name}`;

  return '';
}

function applyStateChange(state: GameState, change: Record<string, any>): GameState {
  if (change.type === 'snapshot') return { ...(change.state || state) };

  const next = { ...state };

  if (change.type === 'gold') next.gold = change.new;
  else if (change.type === 'hp') {
    next.current_hp = change.new;
    if (change.max) next.max_hp = change.max;
  } else if (change.type === 'inventory') next.inventory = change.inventory;
  else if (change.type === 'trust') {
    const key = NPC_TRUST_KEYS[change.npc];
    if (key) next[key] = change.new;
  } else if (change.type === 'area') next.current_area = change.new;
  else if (change.type === 'level_up') {
    next.level = change.new;
    next.max_hp = change.max_hp;
    next.current_hp = change.max_hp;
  } else if (change.type === 'npc_hp') {
    const key = NPC_HP_KEYS[change.npc];
    if (key) next[key] = change.new;
  } else if (change.type === 'attribute') next[change.attr] = change.new;
  else if (change.type === 'xp') next.xp = change.new;
  else if (change.type === 'complete_chapter') next.cleared_levels = change.new;
  else if (change.type === 'trigger_event') next.triggered_events = change.events;

  return next;
}

export const dndRuntime: GameRuntimeService = {
  id: 'dnd',
  name: '地心之门',
  createGame,
  streamAction(gameId, message, callbacks) {
    return chatStream(
      gameId,
      message,
      callbacks.onNarrative,
      callbacks.onSystem,
      callbacks.onDone,
      callbacks.onError,
      callbacks.onStateUpdate,
    );
  },
  applyStateChange,
  parseSystemEvent: parseDiceEvent,
  formatSystemEvent: formatDiceResult,
  formatStateChange,
};
