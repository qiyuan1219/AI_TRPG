export interface DiceResult {
  type: string;
  data: Record<string, any>;
}

export interface ActionSuggestion {
  id: string;
  label: string;
  text: string;
}

export interface StoryLine {
  id: number;
  role: 'kp' | 'player' | 'system';
  speaker: string;
  text: string;
}

export interface SceneVisual {
  id: string;
  title: string;
  subtitle: string;
  aliases: string[];
  themeClass: string;
}

export interface GameState {
  [key: string]: any;
}

export interface CharacterPreset {
  id: string;
  name: string;
  mark: string;
  desc: string;
  stats: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  pros: string[];
  cons: string[];
}

export interface CreateGamePayload {
  player_name: string;
  char_class: string;
  attr_str: number;
  attr_dex: number;
  attr_con: number;
  attr_int: number;
  attr_wis: number;
  attr_cha: number;
  level?: number;
}

export interface CreateGameResult {
  game_id: string;
  session_id?: string;
  opening: string;
  state: GameState;
}

export interface StreamCallbacks {
  onNarrative: (chunk: string) => void;
  onSystem: (event: string) => void;
  onStateUpdate: (change: Record<string, any>) => void;
  onDone: () => void;
  onError: (error: string) => void;
}

export interface GameRuntimeService {
  id: string;
  name: string;
  createGame: (payload: CreateGamePayload) => Promise<CreateGameResult>;
  streamAction: (
    gameId: string,
    message: string,
    callbacks: StreamCallbacks,
  ) => AbortController;
  applyStateChange: (state: GameState, change: Record<string, any>) => GameState;
  parseSystemEvent: (event: string) => DiceResult | null;
  formatSystemEvent: (event: DiceResult) => string;
  formatStateChange: (change: Record<string, any>) => string;
}
