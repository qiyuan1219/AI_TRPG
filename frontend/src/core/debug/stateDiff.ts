export interface StateDiffEntry {
  path: string;
  before: unknown;
  after: unknown;
  op: 'add' | 'remove' | 'replace';
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function joinPath(base: string, key: string) {
  return base ? `${base}.${key}` : key;
}

export function createStateHash(value: unknown): string {
  const stableStringify = (input: unknown): string => {
    if (Array.isArray(input)) return `[${input.map(stableStringify).join(',')}]`;
    if (isPlainObject(input)) {
      return `{${Object.keys(input).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(input[key])}`).join(',')}}`;
    }
    return JSON.stringify(input);
  };
  const json = stableStringify(value);
  let hash = 0;
  for (let index = 0; index < json.length; index += 1) {
    hash = ((hash << 5) - hash + json.charCodeAt(index)) | 0;
  }
  return `h${Math.abs(hash).toString(16)}`;
}

export function diffState(before: unknown, after: unknown, basePath = ''): StateDiffEntry[] {
  if (Object.is(before, after)) return [];

  if (!isPlainObject(before) || !isPlainObject(after)) {
    const op = before === undefined ? 'add' : after === undefined ? 'remove' : 'replace';
    return [{ path: basePath || '$', before, after, op }];
  }

  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const changes: StateDiffEntry[] = [];
  for (const key of keys) {
    changes.push(...diffState(before[key], after[key], joinPath(basePath, key)));
  }
  return changes;
}
