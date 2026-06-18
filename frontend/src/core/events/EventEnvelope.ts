export const EVENT_SCHEMA_VERSION = 1 as const;

export interface EventEnvelope<TPayload> {
  eventId: string;
  schemaVersion: typeof EVENT_SCHEMA_VERSION;
  sequence: number;
  correlationId?: string;
  type: string;
  source: string;
  createdAt: string;
  payload: TPayload;
}

let eventSequence = 0;

export function createEventEnvelope<TPayload>(
  type: string,
  source: string,
  payload: TPayload,
  correlationId?: string,
): EventEnvelope<TPayload> {
  eventSequence += 1;
  return {
    eventId: crypto.randomUUID(),
    schemaVersion: EVENT_SCHEMA_VERSION,
    sequence: eventSequence,
    correlationId,
    type,
    source,
    createdAt: new Date().toISOString(),
    payload,
  };
}
