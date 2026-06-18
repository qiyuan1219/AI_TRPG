import type { ActionSuggestion, GameState } from '../../types/game';

export function constrainStorySuggestions(
  state: GameState,
  suggestions: ActionSuggestion[],
  maximum = 4,
): ActionSuggestion[] {
  const seen = new Set<string>();
  return suggestions.filter((item) => {
    const key = String(item.text || item.label || '').trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, maximum);
}

export function nextStoryState(state: GameState, patch: Partial<GameState>): GameState {
  return { ...state, ...patch };
}
