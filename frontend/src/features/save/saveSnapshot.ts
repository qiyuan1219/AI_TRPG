import { migrateClassToStyleState } from '../../data/dndClasses';
import type { ActionSuggestion, GameState, SaveGamePayload, SaveSlotKey, StoryLine } from '../../types/game';
import { migrateRerollInventory } from '../../utils/battlePrep';
import { stripMachineProtocolText } from '../../utils/narrative';

export type SavePhase = 'narrating' | 'action';
export type StateSynchronizer = (state: GameState) => GameState;

export function normalizePersistedGameState(state: GameState, synchronizeState: StateSynchronizer) {
  return migrateRerollInventory(synchronizeState(migrateClassToStyleState(state)));
}

export function sanitizeStoryForSave(lines: StoryLine[]) {
  return (Array.isArray(lines) ? lines : [])
    .map((line) => ({ ...line, text: stripMachineProtocolText(line.text) }))
    .filter((line) => line.text.trim());
}

export function sanitizeSuggestionsForSave(items: ActionSuggestion[]) {
  return (Array.isArray(items) ? items : [])
    .map((item) => ({
      ...item,
      label: stripMachineProtocolText(item.label),
      text: stripMachineProtocolText(item.text),
    }))
    .filter((item) => item.label.trim() && item.text.trim());
}

export interface BuildSaveSnapshotInput {
  slotKey: SaveSlotKey;
  customTitle?: string;
  state: GameState;
  story: StoryLine[];
  suggestions: ActionSuggestion[];
  activeIndex: number;
  phase: SavePhase;
  saveArea: string;
}

export function buildSaveSnapshot({
  slotKey,
  customTitle,
  state,
  story,
  suggestions,
  activeIndex,
  phase,
  saveArea,
}: BuildSaveSnapshotInput): SaveGamePayload {
  const prefix = slotKey === 'auto' ? '自动' : '';
  const title = customTitle
    ? `${prefix}${prefix ? ' · ' : ''}${customTitle}`
    : `${prefix}${prefix ? ' · ' : ''}${state.player_name || '冒险者'} · ${saveArea}`;
  const sanitizedStory = sanitizeStoryForSave(story);
  return {
    slot_key: slotKey,
    title,
    state,
    story: sanitizedStory,
    suggestions: sanitizeSuggestionsForSave(suggestions),
    active_index: Math.min(activeIndex, Math.max(sanitizedStory.length - 1, 0)),
    phase,
  };
}
