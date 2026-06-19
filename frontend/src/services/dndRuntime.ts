import { chatStream, createGame } from './api';
import type { DiceResult, GameRuntimeService, GameState } from '../types/game';
import { withCompanionTrust } from '../utils/trust';

const NPC_TRUST_KEYS: Record<string, string> = {
  瑟琳: 'se_trust',
  银杖: 'se_trust',
  银杖瑟琳: 'se_trust',
  '瑟琳·逆钟': 'se_trust',
  布洛克: 'sl_trust',
  '布洛克·铁锅': 'sl_trust',
  森洛: 'sl_trust',
  '森洛·铁锅': 'sl_trust',
  艾琳: 'al_trust',
  '艾琳·白枝': 'al_trust',
  白枝: 'al_trust',
  凯娅: 'kl_trust',
  软爪: 'kl_trust',
  软爪凯娅: 'kl_trust',
  克莱娅: 'kl_trust',
  '克莱娅·软爪': 'kl_trust',
};

const NPC_HP_KEYS: Record<string, string> = {
  瑟琳: 'se_hp',
  银杖: 'se_hp',
  银杖瑟琳: 'se_hp',
  '瑟琳·逆钟': 'se_hp',
  布洛克: 'sl_hp',
  '布洛克·铁锅': 'sl_hp',
  森洛: 'sl_hp',
  '森洛·铁锅': 'sl_hp',
  艾琳: 'al_hp',
  '艾琳·白枝': 'al_hp',
  白枝: 'al_hp',
  凯娅: 'kl_hp',
  软爪: 'kl_hp',
  软爪凯娅: 'kl_hp',
  克莱娅: 'kl_hp',
  '克莱娅·软爪': 'kl_hp',
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
    case 'skill_check': {
      const roll = String(d.掷骰 || '').replace('D20=', '') || '?';
      const total = d.总计 ?? '?';
      const dc = d.DC;
      const ability = d.六维 || '智力';
      const statMod = Number(d.属性加值 ?? 0);
      const profMod = Number(d.熟练加值 ?? 0);
      const success = d.成功;
      const crit = d.大成功;
      const fumble = d.大失败;

      const parts = [`${roll}（点数）`, `${statMod >= 0 ? '+' : ''}${statMod}（【${ability}】加值）`];
      if (profMod > 0) parts.push(`+${profMod}（熟练加值）`);

      const formula = parts.join(' + ');
      const suffix = crit ? '，大成功！' : fumble ? '，大失败！' : '';
      return `${success ? '检定成功' : '检定失败'}！结果：${total} = ${formula}${dc ? ` ${success ? '≥' : '<'} DC${dc}` : ''}${suffix}`;
    }
    case 'attack_roll': {
      const roll = String(d.攻击掷骰 || '').match(/D20=(\d+)/)?.[1] || '?';
      return `${d.命中 ? '命中' : '未命中'} D20=${roll}${d.伤害 ? `，造成 ${d.伤害} 点伤害` : ''} / AC${d.目标AC}`;
    }
    case 'roll_dice_tool':
      return `${d.骰子} = ${d.结果}`;
    case 'death_save':
      return d.成功 ? '死亡豁免成功' : '死亡豁免失败';
    case 'error':
      return String(d.msg || d.error || '发生错误');
    default:
      return d.msg || JSON.stringify(d);
  }
}

function formatTrustChange(change: Record<string, any>) {
  if (Array.isArray(change.applied)) {
    return change.applied
      .filter((item: any) => item.visibility !== 'hidden')
      .map((item: any) => {
        const amount = Number(item.delta || 0);
        const signed = amount > 0 ? `+${amount}` : String(amount);
        return `${item.companionName || '同伴'}信任 ${signed}${item.reason ? `：${item.reason}` : ''}`;
      })
      .join('；');
  }
  const amount = Number(change.change || 0);
  const signed = amount > 0 ? `+${amount}` : String(amount);
  return `${change.npc || '同伴'}信任 ${signed}${change.reason ? `：${change.reason}` : ''}`;
}

function formatStateChange(change: Record<string, any>) {
  if (change.type === 'snapshot') return '';
  if (change.type === 'trust') return formatTrustChange(change);

  const amount = Number(change.change || 0);
  const signed = amount > 0 ? `+${amount}` : String(amount);
  const reason = change.reason ? `：${change.reason}` : '';

  if (change.type === 'gold') return `金币 ${signed}${reason}`;
  if (change.type === 'hp') return `HP ${signed}${reason}`;
  if (change.type === 'inventory') return `${change.op === 'add' ? '获得' : '失去'} ${change.item}`;
  if (change.type === 'area') return `场景切换：${change.new}${reason}`;
  if (change.type === 'level_up') return `升级到 Lv.${change.new}${reason}`;
  if (change.type === 'npc_hp') return `${change.npc} HP ${signed}${reason}`;
  if (change.type === 'attribute') return `${change.attr} ${signed}${reason}`;
  if (change.type === 'xp') return `经验 ${signed}${reason}`;
  if (change.type === 'complete_chapter') return change.reason || '章节完成';
  if (change.type === 'trigger_event') return `剧情事件：${change.event_name}`;
  if (change.type === 'investigation_reward') {
    if (change.duplicate) return change.message || '调查已结算';
    const docs = Array.isArray(change.addedDocuments) ? change.addedDocuments.length : 0;
    const clues = Array.isArray(change.addedClues) ? change.addedClues.length : 0;
    const rewards = Array.isArray(change.appliedRewards) ? change.appliedRewards : [];
    const statParts = rewards
      .map((reward: Record<string, any>) => {
        const amount = Number(reward.change || 0);
        const signed = amount > 0 ? `+${amount}` : String(amount);
        if (reward.type === 'gold' && amount) return `金币 ${signed}`;
        if (reward.type === 'hp' && amount) return `HP ${signed}`;
        if (reward.type === 'attribute' && reward.attr && amount) return `${reward.attr} ${signed}`;
        return '';
      })
      .filter(Boolean);
    const parts = [
      docs ? `档案 +${docs}` : '',
      clues ? `线索 +${clues}` : '',
      ...statParts,
      change.resultLevel ? `判定：${change.resultLevel}` : '',
    ].filter(Boolean);
    return parts.length ? parts.join(' · ') : '调查奖励已记录';
  }

  return '';
}

function applyStateChange(state: GameState, change: Record<string, any>): GameState {
  if (change.type === 'snapshot') {
    const snapshot = change.state && typeof change.state === 'object' ? change.state : {};
    const preserveExpandedStory = Boolean(state.postBlueShoalExpandedStarted);
    // 后端快照只包含后端认识的字段。直接替换会把前端剧情节点、调查次数和
    // “蓝伞浅滩后扩展”标记一起删掉，随后界面只能按区域名退回旧 fallback。
    // 快照在这里必须是增量合并；几个由前后端共同维护的对象也要保留本地扩展字段。
    const merged: GameState = {
      ...state,
      ...snapshot,
      flags: {
        ...(preserveExpandedStory ? snapshot.flags : state.flags || {}),
        ...(preserveExpandedStory ? state.flags : snapshot.flags || {}),
      },
      relationships: {
        ...(preserveExpandedStory ? snapshot.relationships : state.relationships || {}),
        ...(preserveExpandedStory ? state.relationships : snapshot.relationships || {}),
      },
      companionTrust: {
        ...(preserveExpandedStory ? snapshot.companionTrust : state.companionTrust || {}),
        ...(preserveExpandedStory ? state.companionTrust : snapshot.companionTrust || {}),
      },
      questLog: {
        ...(preserveExpandedStory ? snapshot.questLog : state.questLog || {}),
        ...(preserveExpandedStory ? state.questLog : snapshot.questLog || {}),
      },
      sceneState: {
        ...(preserveExpandedStory ? snapshot.sceneState : state.sceneState || {}),
        ...(preserveExpandedStory ? state.sceneState : snapshot.sceneState || {}),
      },
    };

    if (preserveExpandedStory) {
      // 本地规则先结算，随后才发起 AI 续写；此时后端推来的 snapshot 可能比
      // 本地慢一拍。扩展主线的路由、调查记录与本地奖励必须以当前前端状态为准。
      [
        'currentNodeId',
        'current_area',
        'postBlueShoalExpandedStarted',
        'blueShoalInvestigationActions',
        'boneMarshActions',
        'expeditionCampActions',
        'fortressInnerActions',
        'inventory',
        'documents',
        'clues',
      ].forEach((key) => {
        if (key in state) merged[key] = state[key];
      });
      Object.keys(state).forEach((key) => {
        if (key.startsWith('choice_') || key.startsWith('node_')) merged[key] = state[key];
      });
    }

    return merged;
  }

  let next = { ...state };

  if (change.type === 'gold') next.gold = change.new;
  else if (change.type === 'hp') {
    next.current_hp = change.new;
    if (change.max) next.max_hp = change.max;
  } else if (change.type === 'inventory') next.inventory = change.inventory;
  else if (change.type === 'trust') {
    if (change.companionTrust) next.companionTrust = change.companionTrust;
    if (Array.isArray(change.trustLogs)) next.trustLogs = change.trustLogs;
    if (Array.isArray(change.applied)) {
      change.applied.forEach((item: any) => {
        if (item.companionId && Number.isFinite(Number(item.newValue))) {
          next = withCompanionTrust(next, item.companionId, Number(item.newValue));
        }
      });
    } else if (change.companionId && Number.isFinite(Number(change.new))) {
      next = withCompanionTrust(next, change.companionId, Number(change.new));
    } else {
      const key = NPC_TRUST_KEYS[change.npc];
      if (key) next[key] = change.new;
    }
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
  else if (change.type === 'investigation_reward') {
    if (typeof change.inventory === 'string') next.inventory = change.inventory;
    if (Array.isArray(change.documents)) next.documents = change.documents;
    if (Array.isArray(change.clues)) next.clues = change.clues;
    if (Number.isFinite(Number(change.gold))) next.gold = Number(change.gold);
    if (Number.isFinite(Number(change.current_hp))) next.current_hp = Number(change.current_hp);
    if (Number.isFinite(Number(change.max_hp))) next.max_hp = Number(change.max_hp);
    if (change.attributes && typeof change.attributes === 'object') {
      Object.entries(change.attributes).forEach(([attr, value]) => {
        if (Number.isFinite(Number(value))) next[attr] = Number(value);
      });
    }
    if (change.flags && typeof change.flags === 'object') next.flags = change.flags;
    if (change.questLog && typeof change.questLog === 'object') next.questLog = change.questLog;
    if (change.sceneState && typeof change.sceneState === 'object') next.sceneState = change.sceneState;
  }

  return next;
}

export const dndRuntime: GameRuntimeService = {
  id: 'dnd',
  name: '地心之门',
  createGame,
  streamAction(gameId, message, callbacks, options) {
    return chatStream(
      gameId,
      message,
      callbacks.onNarrative,
      callbacks.onSystem,
      callbacks.onDone,
      callbacks.onError,
      callbacks.onStateUpdate,
      callbacks.onSuggestions,
      options?.visibleMessage,
    );
  },
  applyStateChange,
  parseSystemEvent: parseDiceEvent,
  formatSystemEvent: formatDiceResult,
  formatStateChange,
};
