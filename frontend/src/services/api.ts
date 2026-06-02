import type { CreateGamePayload, CreateGameResult } from '../types/game';

const BASE = '/api/dnd';

export async function createGame(payload: CreateGamePayload): Promise<CreateGameResult> {
  const response = await fetch(`${BASE}/game/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || '创建游戏失败');
  }

  return response.json();
}

export async function getState(gameId: string) {
  const response = await fetch(`${BASE}/game/${gameId}/state`);
  if (!response.ok) throw new Error('获取状态失败');
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

  fetch(`${BASE}/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ game_id: gameId, message }),
    signal: ctrl.signal,
  })
    .then(async (response) => {
      if (!response.ok || !response.body) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.detail || '连接 KP 服务失败');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

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
            else if (event.type === 'done') onDone();
            else if (event.type === 'error') onError(event.content);
          } catch {
            // The parser keeps incomplete rows in buffer; malformed complete rows are ignored.
          }
        }
      }
    })
    .catch((error) => {
      if (!ctrl.signal.aborted) onError(error.message || '连接中断');
    });

  return ctrl;
}
