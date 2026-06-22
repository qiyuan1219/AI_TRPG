import { findRegisteredSpeaker, resolveSpeakerName } from '../../data/characterRegistry';
import type { GameState, LoadGameResult, StoryLine } from '../../types/game';
import { stripAllMachineProtocolText } from '../../utils/narrative';
import { normalizePersistedGameState, type SavePhase, type StateSynchronizer } from './saveSnapshot';

export function normalizeLoadedStoryLines(lines: StoryLine[]): StoryLine[] {
  let nextId = 1;
  let lastDialogueSpeaker = '';
  const normalized: StoryLine[] = [];

  (Array.isArray(lines) ? lines : [])
    .filter((line) => line && typeof line.text === 'string' && line.text.trim())
    .forEach((line) => {
      const rawId = Number(line.id);
      const id = Number.isFinite(rawId) && rawId > 0 ? rawId : nextId;
      nextId = Math.max(nextId, id + 1);
      const role = line.role === 'player' || line.role === 'system' ? line.role : 'kp';
      const text = stripAllMachineProtocolText(line.text);
      if (!text) return;
      const previousText = normalized[normalized.length - 1]?.text.trim() ?? '';
      const isDialogue = /^["「]/.test(text.trim());
      let speaker = resolveSpeakerName(line.speaker || '主持人') || '主持人';

      if (role === 'kp' && isDialogue) {
        const previousNamedSpeaker = findRegisteredSpeaker(previousText, true);
        const pronounContinuesPrevious = Boolean(lastDialogueSpeaker && /^(他们|她们|它们|他|她|它)/.test(previousText));
        const contextSpeaker = previousNamedSpeaker || (pronounContinuesPrevious ? lastDialogueSpeaker : '');
        if (contextSpeaker && speaker === '主持人') speaker = contextSpeaker;
      }
      if (role === 'kp' && isDialogue && speaker !== '主持人') lastDialogueSpeaker = speaker;

      normalized.push({ id, role, speaker, text, portrait: typeof line.portrait === 'string' ? line.portrait : undefined, bgImage: typeof line.bgImage === 'string' ? line.bgImage : undefined, bgm: typeof line.bgm === 'string' ? line.bgm : undefined, scriptedSceneId: typeof line.scriptedSceneId === 'string' ? line.scriptedSceneId : undefined, });
    });
  return normalized;
}

export function findInheritedBgImage(story: StoryLine[], activeIndex: number) {
  const end = Math.min(Math.max(activeIndex, 0), Math.max(story.length - 1, 0));
  for (let index = end; index >= 0; index -= 1) {
    const bgImage = story[index]?.bgImage;
    if (typeof bgImage === 'string' && bgImage.trim()) return bgImage;
  }
  return null;
}

export interface PreparedSaveRestore {
  state: GameState;
  story: StoryLine[];
  activeIndex: number;
  activeLine?: StoryLine;
  nextLineId: number;
  inheritedBgImage: string | null;
  phase: SavePhase;
  selectedStyleId: string;
  playerNameInput: string;
}

export function prepareSaveRestore(
  result: LoadGameResult,
  synchronizeState: StateSynchronizer,
): PreparedSaveRestore {
  const state = normalizePersistedGameState(result.state || {}, synchronizeState);
  const story = normalizeLoadedStoryLines(result.story || []);
  const activeIndex = story.length
    ? Math.min(Math.max(Number(result.active_index) || 0, 0), story.length - 1)
    : 0;
  const maxLineId = story.reduce((max, line) => Math.max(max, line.id), 0);
  return {
    state,
    story,
    activeIndex,
    activeLine: story[activeIndex],
    nextLineId: maxLineId + 1,
    inheritedBgImage: findInheritedBgImage(story, activeIndex),
    phase: result.phase === 'narrating' ? 'narrating' : 'action',
    selectedStyleId: String(state.selectedStyleId || state.selected_style_id || 'balanced'),
    playerNameInput: String(state.player_name || '').replace(/^冒险者$/, ''),
  };
}
