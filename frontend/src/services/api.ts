import type {
  CreateGamePayload,
  CreateGameResult,
  LoadGameResult,
  SaveGamePayload,
  SaveSlotKey,
  SaveSlotSummary,
} from '../types/game';

const BASE = '/api/dnd';
const SAFE_SERVICE_MESSAGE = 'KP暂时没有回应，已为本轮处理启用兜底。';
const CONNECTION_ERROR_PATTERN =
  /(connection\s*error|failed\s*to\s*fetch|network\s*error|networkerror|load\s*failed|timeout|timed\s*out|econn|socket|fetch|body\s*stream|terminated|aborted)/i;

export interface BargainJudgePayload {
  item_name: string;
  base_price: number;
  current_price: number;
  attempt: number;
  max_attempts: number;
  roll: number;
  bonus: number;
  total: number;
  player_words: string;
  history: Array<Record<string, unknown>>;
}

export interface BargainJudgeResult {
  agreed: boolean;
  discount: number;
  new_price: number;
  mood: string;
  reason: string;
  boss_reply: string;
}

export interface CompanionSideEventChoice {
  id: string;
  label: string;
  text: string;
  trust: number;
  check?: {
    label: string;
    dc: number;
    bonus: number;
  } | null;
}

export interface CompanionSideEventState {
  phase: 'opening' | 'crisis' | 'battle_pending' | 'dialogue';
  trust: number;
  trust_band: string;
  threat: number;
  max_threat: number;
  contamination: number;
  round: number;
  flags: string[];
  rewards: string[];
  completed: boolean;
  result_title: string;
  result_text: string;
  last_choice?: CompanionSideEventChoice | null;
  last_roll?: Record<string, any> | null;
  battle_log: Array<Record<string, any>>;
  pending_battle?: string | null;
  battle_result?: string | null;
  choices: CompanionSideEventChoice[];
}

export interface CompanionSideEventInfo {
  id: string;
  companion: {
    id: string;
    name: string;
    trust_key: string;
    portrait: string;
  };
  title: string;
  location: string;
  eyebrow: string;
  summary: string;
  opening: string;
  objectives: string[];
  free_chat_prompt: string;
  chat_topics: string[];
}

export interface CompanionSideEventStartResult {
  session_id: string;
  event: CompanionSideEventInfo;
  state: CompanionSideEventState;
}

export interface CompanionSideEventChoiceResult {
  event: CompanionSideEventInfo;
  state: CompanionSideEventState;
  outcome: {
    choice: CompanionSideEventChoice;
    roll?: Record<string, any> | null;
    success?: boolean | null;
    phase_note: string;
  };
  feedback: string;
}

function toSafeMessage(value: unknown, fallback: string) {
  const message = String(value || '').trim();
  if (!message) return fallback;
  if (CONNECTION_ERROR_PATTERN.test(message)) return fallback;
  return message;
}

async function readErrorMessage(response: Response, fallback: string) {
  const body = await response.json().catch(() => ({}));
  return toSafeMessage(body.detail, fallback);
}

async function apiFetch(input: RequestInfo | URL, init: RequestInit | undefined, fallback: string) {
  try {
    return await fetch(input, init);
  } catch (error: any) {
    throw new Error(toSafeMessage(error?.message, fallback));
  }
}

export async function createGame(payload: CreateGamePayload): Promise<CreateGameResult> {
  const response = await apiFetch(`${BASE}/game/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, '创建游戏失败');

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, '创建游戏失败'));
  }

  return response.json();
}

export async function getState(gameId: string) {
  const response = await apiFetch(`${BASE}/game/${gameId}/state`, undefined, '获取状态失败');
  if (!response.ok) throw new Error(await readErrorMessage(response, '获取状态失败'));
  return response.json();
}

export async function listSaves(): Promise<{ saves: SaveSlotSummary[] }> {
  const response = await apiFetch(`${BASE}/saves`, undefined, '获取存档失败');
  if (!response.ok) throw new Error(await readErrorMessage(response, '获取存档失败'));
  return response.json();
}

export async function saveGame(gameId: string, payload: SaveGamePayload): Promise<{ save: SaveSlotSummary }> {
  const response = await apiFetch(`${BASE}/game/${gameId}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, '保存失败');

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, '保存失败'));
  }

  return response.json();
}

export async function loadGame(slotKey: SaveSlotKey): Promise<LoadGameResult> {
  const response = await apiFetch(`${BASE}/saves/${slotKey}/load`, { method: 'POST' }, '读取存档失败');

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, '读取存档失败'));
  }

  return response.json();
}

export async function judgeBargain(payload: BargainJudgePayload): Promise<BargainJudgeResult> {
  const response = await apiFetch(`${BASE}/bargain/judge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }, '讲价判定失败');

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, '讲价判定失败'));
  }

  return response.json();
}

export async function startCompanionSideEvent(
  eventId = 'block_echo_forest',
  initialTrust = 55,
): Promise<CompanionSideEventStartResult> {
  const response = await apiFetch(`${BASE}/side-events/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event_id: eventId, initial_trust: initialTrust }),
  }, '支线事件启动失败');

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, '支线事件启动失败'));
  }

  return response.json();
}

export async function chooseCompanionSideEvent(
  sessionId: string,
  choiceId: string,
  includeFeedback = true,
): Promise<CompanionSideEventChoiceResult> {
  const response = await apiFetch(`${BASE}/side-events/${sessionId}/choose`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ choice_id: choiceId, include_feedback: includeFeedback }),
  }, '支线选择结算失败');

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, '支线选择结算失败'));
  }

  return response.json();
}

export async function getCompanionSideEventFeedback(
  sessionId: string,
): Promise<CompanionSideEventChoiceResult> {
  const response = await apiFetch(`${BASE}/side-events/${sessionId}/feedback`, {
    method: 'POST',
  }, '支线反馈生成失败');

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, '支线反馈生成失败'));
  }

  return response.json();
}

export async function completeCompanionSideEventBattle(
  sessionId: string,
  result: 'win' | 'lose',
): Promise<{
  event: CompanionSideEventInfo;
  state: CompanionSideEventState;
  battle_result: Record<string, any>;
  feedback: string;
}> {
  const response = await apiFetch(`${BASE}/side-events/${sessionId}/battle-result`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ result }),
  }, '支线战斗结算失败');

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, '支线战斗结算失败'));
  }

  return response.json();
}

export async function chatCompanionSideEvent(
  sessionId: string,
  message: string,
): Promise<{ reply: string; history: Array<Record<string, string>>; state: CompanionSideEventState }> {
  const response = await apiFetch(`${BASE}/side-events/${sessionId}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  }, '支线自由对话失败');

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, '支线自由对话失败'));
  }

  return response.json();
}

export function chatStream(
  gameId: string,
  message: string,
  onNarrative: (text: string) => void,
  onSystem: (event: string) => void,
  onDone: () => void,
  onError: (error: string) => void,
  onStateUpdate?: (change: Record<string, any>) => void,
) {
  const ctrl = new AbortController();

  apiFetch(`${BASE}/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ game_id: gameId, message }),
    signal: ctrl.signal,
  }, SAFE_SERVICE_MESSAGE)
    .then(async (response) => {
      if (!response.ok || !response.body) {
        throw new Error(await readErrorMessage(response, SAFE_SERVICE_MESSAGE));
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let finished = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;

          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === 'narrative') onNarrative(event.content);
            else if (event.type === 'system') onSystem(event.content);
            else if (event.type === 'state_update') onStateUpdate?.(event.content);
            else if (event.type === 'state_snapshot') onStateUpdate?.({ type: 'snapshot', state: event.content });
            else if (event.type === 'done') {
              finished = true;
              onDone();
            }
            else if (event.type === 'error') onError(toSafeMessage(event.content, SAFE_SERVICE_MESSAGE));
          } catch {
            // The parser keeps incomplete rows in buffer; malformed complete rows are ignored.
          }
        }
      }

      if (!finished) onDone();
    })
    .catch((error) => {
      if (!ctrl.signal.aborted) onError(toSafeMessage(error?.message, SAFE_SERVICE_MESSAGE));
    });

  return ctrl;
}
