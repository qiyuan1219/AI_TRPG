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
  portrait?: string;
  bgImage?: string;
}

export interface SceneVisual {
  id: string;
  title: string;
  subtitle: string;
  aliases: string[];
  themeClass: string;
  backgroundImage?: string;        // 场景背景图，渐进式浮现
  bgStages?: SceneBgStage[];       // 多阶段背景切换
}

/** 场景背景的阶段切换：当文本中出现 trigger 短语时切换到对应背景 */
export interface SceneBgStage {
  trigger: string;      // 文本匹配词
  image: string;        // 背景图路径
}

export interface GameState {
  [key: string]: any;
}

export type SkillKind = 'combat' | 'noncombat' | 'support' | 'story';

export interface SkillEntry {
  name: string;
  kind: SkillKind;
  check: string;
  effect: string;
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
  skills: {
    combat: SkillEntry[];
    nonCombat: SkillEntry[];
  };
}

export interface CompanionPreset {
  id: string;
  name: string;
  title: string;
  role: string;
  hp: number;
  ac: number;
  trustKey: string;
  hpKey: string;
  skills: {
    combat: SkillEntry[];
    nonCombat: SkillEntry[];
    story: SkillEntry[];
  };
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
  skip_opening?: boolean;
}

export interface CreateGameResult {
  game_id: string;
  session_id?: string;
  opening: string;
  opening_script?: Array<{ speaker: string; text: string; bgImage?: string }>;  // 固定开场脚本，speaker绝对正确
  opening_hints?: string[];                                    // 开场HINTS
  state: GameState;
}

export type SaveSlotKey = 'auto' | 'slot-1' | 'slot-2' | 'slot-3' | 'slot-4' | 'slot-5';

export interface SaveSlotSummary {
  slot_key: SaveSlotKey;
  title: string;
  source_game_id: string;
  player_name: string;
  char_class: string;
  level: number;
  current_area: string;
  last_event: string;
  saved_at: string;
}

export interface SaveGamePayload {
  slot_key: SaveSlotKey;
  title?: string;
  story: StoryLine[];
  suggestions: ActionSuggestion[];
  active_index: number;
  phase: 'narrating' | 'action';
}

export interface LoadGameResult {
  game_id: string;
  state: GameState;
  story: StoryLine[];
  suggestions: ActionSuggestion[];
  active_index: number;
  phase: 'narrating' | 'action';
  save: SaveSlotSummary;
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
