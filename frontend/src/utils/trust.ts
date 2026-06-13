import type { CompanionId, GameState, TrustLog } from '../types/game';

export const COMPANION_TRUST_ALIASES: Record<CompanionId, string[]> = {
  serin: ['se_trust', 'trust_sl'],
  ailin: ['trust_al', 'al_trust'],
  brock: ['trust_block', 'sl_trust'],
  kaiya: ['trust_kl', 'kl_trust'],
};

export const COMPANION_DISPLAY_TRUST_KEY: Record<CompanionId, string> = {
  serin: 'se_trust',
  ailin: 'al_trust',
  brock: 'sl_trust',
  kaiya: 'kl_trust',
};

export const COMPANION_ID_BY_UI_ID: Record<string, CompanionId | undefined> = {
  selin: 'serin',
  ailin: 'ailin',
  senluo: 'brock',
  kelaiya: 'kaiya',
};

export const COMPANION_ID_BY_EVENT_ID: Record<string, CompanionId | undefined> = {
  ailin_wounded_names: 'ailin',
  block_echo_forest: 'brock',
  kaiya_broken_seals: 'kaiya',
  serin_cracked_silver_staff: 'serin',
};

const INITIAL_TRUST: Record<CompanionId, number> = {
  serin: 84,
  ailin: 55,
  brock: 50,
  kaiya: 45,
};

function clampTrust(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function getTrustTier(value: number) {
  if (value <= 29) return '疏离';
  if (value <= 49) return '谨慎';
  if (value <= 69) return '合作';
  if (value <= 84) return '信赖';
  return '深信';
}

export function getCompanionTrust(state: GameState, companionId: CompanionId) {
  const fromStructured = state.companionTrust?.[companionId];
  if (Number.isFinite(Number(fromStructured))) return clampTrust(Number(fromStructured));
  for (const key of COMPANION_TRUST_ALIASES[companionId]) {
    if (Number.isFinite(Number(state[key]))) return clampTrust(Number(state[key]));
  }
  return INITIAL_TRUST[companionId];
}

export function withCompanionTrust(state: GameState, companionId: CompanionId, value: number): GameState {
  const trust = clampTrust(value);
  const next: GameState = {
    ...state,
    companionTrust: {
      ...(state.companionTrust || {}),
      [companionId]: trust,
    },
  };
  for (const key of COMPANION_TRUST_ALIASES[companionId]) {
    next[key] = trust;
  }
  return next;
}

export function buildTrustPatch(state: GameState, changes: Partial<Record<CompanionId, number>>) {
  let next: GameState = { ...state };
  for (const [companionId, value] of Object.entries(changes) as Array<[CompanionId, number]>) {
    next = withCompanionTrust(next, companionId, value);
  }
  const patch: GameState = {
    companionTrust: next.companionTrust,
  };
  for (const companionId of Object.keys(changes) as CompanionId[]) {
    for (const key of COMPANION_TRUST_ALIASES[companionId]) {
      patch[key] = next[key];
    }
  }
  return patch;
}

export function recentTrustLogs(state: GameState, limit = 5): TrustLog[] {
  return Array.isArray(state.trustLogs) ? state.trustLogs.slice(-limit).reverse() : [];
}
