import type { ActionSuggestion } from '../types/game';

const HINT_RE = /\[HINTS:([\s\S]*?)\]/g;
const SENTENCE_END_RE = /[。！？!?；;\n]/g;

function compactText(text: string) {
  return text
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function makeSuggestions(hints: string[]): ActionSuggestion[] {
  return hints
    .map((hint) => hint.trim())
    .filter(Boolean)
    .slice(0, 4)
    .map((hint, index) => ({
      id: `${index}-${hint}`,
      label: hint,
      text: hint,
    }));
}

export function extractHints(input: string): { text: string; suggestions: ActionSuggestion[] } {
  const hints: string[] = [];
  const text = input.replace(HINT_RE, (_, body: string) => {
    body.split('|').forEach((item) => hints.push(item));
    return '';
  });

  return {
    text: compactText(text),
    suggestions: makeSuggestions(hints),
  };
}

export function splitNarrative(input: string): string[] {
  const { text } = extractHints(input);
  if (!text) return [];

  return text
    .split(/(?<=[。！？!?；;])\s*|\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitCompleteSentences(input: string): { complete: string[]; tail: string } {
  SENTENCE_END_RE.lastIndex = 0;
  let lastEnd = -1;
  let match: RegExpExecArray | null;

  while ((match = SENTENCE_END_RE.exec(input))) {
    lastEnd = match.index + match[0].length;
  }

  if (lastEnd < 0) {
    return { complete: [], tail: input };
  }

  const ready = input.slice(0, lastEnd);
  return {
    complete: splitNarrative(ready),
    tail: input.slice(lastEnd),
  };
}

export function createNarrativeStreamParser() {
  let buffer = '';
  let latestSuggestions: ActionSuggestion[] = [];

  function consume() {
    const lines: string[] = [];

    while (buffer) {
      const hintStart = buffer.indexOf('[HINTS:');
      if (hintStart >= 0) {
        const hintEnd = buffer.indexOf(']', hintStart);
        const beforeHint = buffer.slice(0, hintStart);
        const split = splitCompleteSentences(beforeHint);
        lines.push(...split.complete);

        if (hintEnd < 0) {
          buffer = split.tail + buffer.slice(hintStart);
          break;
        }

        const hintBlock = buffer.slice(hintStart, hintEnd + 1);
        latestSuggestions = extractHints(hintBlock).suggestions;
        buffer = split.tail + buffer.slice(hintEnd + 1);
        continue;
      }

      const split = splitCompleteSentences(buffer);
      lines.push(...split.complete);
      buffer = split.tail;
      break;
    }

    return { lines, suggestions: latestSuggestions };
  }

  return {
    push(chunk: string) {
      buffer += chunk;
      return consume();
    },
    flush() {
      const parsed = extractHints(buffer);
      const lines = splitNarrative(parsed.text);
      if (parsed.suggestions.length) {
        latestSuggestions = parsed.suggestions;
      }
      buffer = '';
      return { lines, suggestions: latestSuggestions };
    },
  };
}
