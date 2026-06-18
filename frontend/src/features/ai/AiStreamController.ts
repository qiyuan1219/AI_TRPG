import type { ActionSuggestion, GameRuntimeService } from '../../types/game';

export interface AiStreamCallbacks {
  onNarrative: (text: string) => void;
  onSystem: (event: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
  onStateUpdate?: (change: Record<string, unknown>) => void;
  onSuggestions?: (suggestions: ActionSuggestion[]) => void;
}

/** Owns cancellation and request sequencing for one AI session. */
export class AiStreamController {
  private active?: AbortController;
  private requestSequence = 0;

  constructor(private readonly runtime: GameRuntimeService) {}

  start(gameId: string, message: string, callbacks: AiStreamCallbacks, options?: { visibleMessage?: string }) {
    this.cancel();
    this.requestSequence += 1;
    const sequence = this.requestSequence;
    const guarded = <T extends unknown[]>(callback: (...args: T) => void) =>
      (...args: T) => { if (sequence === this.requestSequence) callback(...args); };

    this.active = this.runtime.streamAction(gameId, message, {
      onNarrative: guarded(callbacks.onNarrative),
      onSystem: guarded(callbacks.onSystem),
      onDone: guarded(callbacks.onDone),
      onError: guarded(callbacks.onError),
      onStateUpdate: callbacks.onStateUpdate ? guarded(callbacks.onStateUpdate) : () => {},
      onSuggestions: callbacks.onSuggestions ? guarded(callbacks.onSuggestions) : undefined,
    }, options);
    return this.active;
  }

  cancel() {
    this.active?.abort();
    this.active = undefined;
  }
}
