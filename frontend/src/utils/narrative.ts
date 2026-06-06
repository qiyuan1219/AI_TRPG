import type { ActionSuggestion } from '../types/game';

const HINT_RE = /\[HINTS:([\s\S]*?)\]/g;
const SENTENCE_END_CHARS = new Set(['。', '！', '？', '!', '?', '\n']);
const MIN_SEGMENT_TEXT_LENGTH = 10;

export interface NarrativeSegment {
  speaker: string;
  text: string;
}

export interface NarrativeParseResult {
  segments: NarrativeSegment[];
  lastSpeaker: string;
}

const SPEAKER_ALIASES: Record<string, string> = {
  // 核心同伴 - 瑟琳
  '瑟琳·逆钟': '瑟琳',
  '瑟琳': '瑟琳',
  '逆钟': '瑟琳',
  // 可选同伴
  '森洛·铁锅': '森洛',
  '森洛': '森洛',
  '铁锅': '森洛',
  '莉亚瑟·青弦': '莉亚瑟',
  '莉亚瑟': '莉亚瑟',
  '青弦': '莉亚瑟',
  '卡西亚·断羽': '卡西亚',
  '卡西亚': '卡西亚',
  '断羽': '卡西亚',
  '克莱娅·软爪': '克莱娅',
  '克莱娅': '克莱娅',
  '软爪': '克莱娅',
  '雷铎·炉心': '雷铎',
  '雷铎': '雷铎',
  '炉心': '雷铎',
  // 剧情NPC
  '米蕾娜·白契': '米蕾娜',
  '米蕾娜': '米蕾娜',
  '白契': '米蕾娜',
  '赫尔曼·断缆': '赫尔曼',
  '赫尔曼': '赫尔曼',
  '断缆': '赫尔曼',
  '温妮娅·铜铃': '温妮娅',
  '温妮娅': '温妮娅',
  '铜铃': '温妮娅',
  '莱因·铁脊': '莱因',
  '莱因': '莱因',
  '铁脊': '莱因',
  // 纯粹NPC
  '萨洛·杯底': '萨洛',
  '萨洛': '萨洛',
  '海伦特·灰杯': '海伦特',
  '海伦特': '海伦特',
  '奥布兰·晨爵': '奥布兰',
  '奥布兰': '奥布兰',
  '赛因·镜页': '赛因',
  '赛因': '赛因',
  '铁砧玛尔加': '玛尔加',
  '玛尔加': '玛尔加',
  '蓝伞尼布': '尼布',
  '尼布': '尼布',
  '烛账帕维': '帕维',
  '帕维': '帕维',
  '静默修女埃拉': '埃拉',
  '埃拉': '埃拉',
};

const SPEAKER_ALIASES_SORTED = Object.keys(SPEAKER_ALIASES).sort((a, b) => b.length - a.length);
const SPEECH_VERBS = [
  '说',
  '说道',
  '道',
  '问',
  '问道',
  '喊',
  '喊道',
  '吼',
  '吼道',
  '答',
  '答道',
  '回答',
  '回应',
  '告诉',
  '宣布',
  '大叫',
  '低语',
  '喃喃',
  '嘟囔',
  '插嘴',
  '补充',
  '补充道',
  '低声说',
  '压低声音说',
];

function normalizeModelText(text: string) {
  return text
    .replace(/「/g, '“')
    .replace(/」/g, '”')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[SCENE:[^\]]*\]\n?/g, '') // 剥离场景元数据，不展示给玩家
    .replace(/\r/g, '');
}

function visibleTextLength(text: string) {
  return text.replace(/[\s“”「」【】{}\[\]（）()，,。.!！?？；;：:、—\-…]/g, '').length;
}

function isShortText(text: string) {
  return visibleTextLength(text) > 0 && visibleTextLength(text) < MIN_SEGMENT_TEXT_LENGTH;
}

function joinSegmentText(...parts: string[]) {
  return parts.map((part) => part.trim()).filter(Boolean).join('');
}

function compactText(text: string) {
  return normalizeModelText(text)
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
  const text = normalizeModelText(input).replace(HINT_RE, (_, body: string) => {
    body.split('|').forEach((item) => hints.push(item));
    return '';
  });

  return {
    text: compactText(text),
    suggestions: makeSuggestions(hints),
  };
}

function normalizeNarrationPiece(piece: string) {
  return piece
    .replace(/^[\s，,：:]+/, '')
    .replace(/[\s，,]+$/, (match) => (match.includes('，') || match.includes(',') ? '，' : ''))
    .replace(/^随后，?/, '随后，')
    .trim();
}

function stripOuterSquareBrackets(text: string) {
  const trimmed = text.trim();
  if (/^\[[^\[\]]+\]$/.test(trimmed) && !trimmed.startsWith('[SYSTEM:')) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function findSpeaker(text: string, reverse = false): string {
  const normalized = text.replace(/[【】]/g, '');
  const aliases = reverse ? [...SPEAKER_ALIASES_SORTED].reverse() : SPEAKER_ALIASES_SORTED;
  let bestIndex = reverse ? -1 : Number.POSITIVE_INFINITY;
  let bestSpeaker = '';

  for (const alias of aliases) {
    const index = reverse ? normalized.lastIndexOf(alias) : normalized.indexOf(alias);
    if (index < 0) continue;

    if (reverse ? index >= bestIndex : index <= bestIndex) {
      bestIndex = index;
      bestSpeaker = SPEAKER_ALIASES[alias];
    }
  }

  return bestSpeaker;
}

function findSpeakerNearQuote(before: string, after: string) {
  // 优先搜索引号前整个文本（从后往前），不限36字符
  const beforeSpeaker = findSpeaker(before, true);
  if (beforeSpeaker) return beforeSpeaker;

  // 模式匹配：检查引号前是否紧跟「名字说」或「名字：」格式
  const beforePatternSpeaker = findSpeakerBySpeechPattern(before);
  if (beforePatternSpeaker) return beforePatternSpeaker;

  // 搜索引号后的短文本
  const afterSpeaker = findSpeaker(after.slice(0, 80));
  if (afterSpeaker) return afterSpeaker;

  return '';
}

// 引号前模式匹配：检测「名字说」「名字：」「【名字】」等常见发言人标记
function findSpeakerBySpeechPattern(before: string): string {
  const trimmed = before.trimEnd();
  // 检查文本末尾是否正好是「名字」或「名字说」等
  for (const alias of SPEAKER_ALIASES_SORTED) {
    const speaker = SPEAKER_ALIASES[alias];
    if (!speaker) continue;
    // 检查末尾是否为 alias + 说/道/问/喊 等
    for (const verb of ['说', '说道', '道', '问', '问道', '喊', '喊道', '插嘴', '低语', '叫', '回答', '宣布']) {
      if (trimmed.endsWith(`${alias}${verb}`) || trimmed.endsWith(`${speaker}${verb}`)) {
        return speaker;
      }
    }
    // 检查末尾是否为 alias：
    if (trimmed.endsWith(`${alias}：`) || trimmed.endsWith(`${speaker}：`) ||
        trimmed.endsWith(`${alias}:`) || trimmed.endsWith(`${speaker}:`)) {
      return speaker;
    }
  }
  return '';
}

// 在整个块中查找最近出现过的说话人（用于处理引号和名字不在同一行的情况）
function findLastSpeakerInBlock(block: string, upTo: number): string {
  const text = block.slice(0, upTo);
  return findSpeaker(text, true);
}

function isPureSpeechAttribution(text: string) {
  const cleaned = normalizeNarrationPiece(stripOuterSquareBrackets(text)).replace(/[【】\s：:，,。.!！?？；;]+$/g, '');
  if (!cleaned) return true;

  for (const alias of SPEAKER_ALIASES_SORTED) {
    const speaker = SPEAKER_ALIASES[alias];
    if (!speaker) continue;
    if (cleaned === alias || cleaned === speaker) return true;

    for (const verb of SPEECH_VERBS) {
      if (cleaned === `${alias}${verb}` || cleaned === `${speaker}${verb}`) return true;
    }
  }

  return false;
}

function pushNarration(segments: NarrativeSegment[], text: string, speaker: string) {
  if (isPureSpeechAttribution(text)) return;

  const cleaned = normalizeNarrationPiece(stripOuterSquareBrackets(text));
  if (!cleaned) return;

  splitPlainSentences(cleaned).forEach((line) => {
    segments.push({ speaker, text: line });
  });
}

function pushDialogue(segments: NarrativeSegment[], text: string, speaker: string) {
  const cleaned = text.trim();
  if (!cleaned) return;
  segments.push({ speaker, text: `“${cleaned}”` });
}

function mergeShortSegments(segments: NarrativeSegment[]) {
  const merged = [...segments];

  for (let index = 0; index <= merged.length - 3; index += 1) {
    const current = merged[index];
    const middle = merged[index + 1];
    const next = merged[index + 2];
    const sameSpeakerAroundNarration = current.speaker !== 'KP' && middle.speaker === 'KP' && next.speaker === current.speaker;
    const shortBridge = isShortText(current.text) || isShortText(middle.text);

    if (sameSpeakerAroundNarration && shortBridge) {
      merged.splice(index, 3, {
        speaker: current.speaker,
        text: joinSegmentText(current.text, middle.text, next.text),
      });
      index = Math.max(-1, index - 2);
    }
  }

  for (let index = 0; index < merged.length; index += 1) {
    const current = merged[index];
    if (!current || !isShortText(current.text) || merged.length <= 1) continue;

    const previous = merged[index - 1];
    const next = merged[index + 1];

    if (previous && previous.speaker === current.speaker) {
      previous.text = joinSegmentText(previous.text, current.text);
      merged.splice(index, 1);
      index = Math.max(-1, index - 2);
      continue;
    }

    if (next && next.speaker === current.speaker) {
      next.text = joinSegmentText(current.text, next.text);
      merged.splice(index, 1);
      index = Math.max(-1, index - 2);
      continue;
    }

    if (next) {
      next.text = joinSegmentText(current.text, next.text);
      merged.splice(index, 1);
      index = Math.max(-1, index - 2);
      continue;
    }

    if (previous) {
      previous.text = joinSegmentText(previous.text, current.text);
      merged.splice(index, 1);
      index = Math.max(-1, index - 2);
    }
  }

  return merged;
}

function splitPlainSentences(input: string) {
  const lines: string[] = [];
  let start = 0;

  for (let i = 0; i < input.length; i += 1) {
    if (!SENTENCE_END_CHARS.has(input[i])) continue;
    const line = input.slice(start, i + 1).trim();
    if (line) lines.push(line);
    start = i + 1;
  }

  const tail = input.slice(start).trim();
  if (tail) lines.push(tail);
  return mergeShortLines(lines);
}

function mergeShortLines(lines: string[]) {
  const merged = [...lines];

  for (let index = 0; index < merged.length; index += 1) {
    const current = merged[index];
    if (!isShortText(current) || merged.length <= 1) continue;

    if (index < merged.length - 1) {
      merged[index + 1] = joinSegmentText(current, merged[index + 1]);
      merged.splice(index, 1);
      index = Math.max(-1, index - 2);
      continue;
    }

    merged[index - 1] = joinSegmentText(merged[index - 1], current);
    merged.splice(index, 1);
    index = Math.max(-1, index - 2);
  }

  return merged;
}

export function parseNarrativeSegments(
  input: string,
  defaultSpeaker = 'KP',
  fallbackSpeaker = '',
): NarrativeParseResult {
  const { text } = extractHints(input);
  const segments: NarrativeSegment[] = [];
  let lastSpeaker = fallbackSpeaker;

  if (!text) return { segments, lastSpeaker };

  const blocks = text.split(/\n+/).map((block) => block.trim()).filter(Boolean);

  for (const block of blocks) {
    const quoteRe = /“([^”]*)”/g;
    let cursor = 0;
    let hasQuote = false;
    let match: RegExpExecArray | null;

    while ((match = quoteRe.exec(block))) {
      hasQuote = true;
      const before = block.slice(cursor, match.index);
      const after = block.slice(match.index + match[0].length);
      const actor = findSpeaker(before);

      if (actor) lastSpeaker = actor;
      pushNarration(segments, before, defaultSpeaker);

      // 三层回退搜索说话人
      let speaker = findSpeakerNearQuote(before, after);
      if (!speaker) speaker = findLastSpeakerInBlock(block, match.index);
      if (!speaker) speaker = lastSpeaker;
      if (!speaker) speaker = defaultSpeaker;
      pushDialogue(segments, match[1], speaker);
      if (speaker !== defaultSpeaker) lastSpeaker = speaker;

      cursor = match.index + match[0].length;
    }

    const tail = block.slice(cursor);
    const tailActor = findSpeaker(tail);
    pushNarration(segments, tail, defaultSpeaker);
    if (tailActor) lastSpeaker = tailActor;

    if (!hasQuote) {
      const actor = findSpeaker(block);
      if (actor) lastSpeaker = actor;
    }
  }

  return { segments: mergeShortSegments(segments), lastSpeaker };
}

function lastCompleteBoundary(input: string) {
  let inQuote = false;
  let lastEnd = -1;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (char === '“') {
      inQuote = true;
      continue;
    }
    if (char === '”') {
      inQuote = false;
      continue;
    }
    if (!SENTENCE_END_CHARS.has(char)) continue;

    if (inQuote) {
      let cursor = i + 1;
      while (/\s/.test(input[cursor] || '')) cursor += 1;
      if (input[cursor] === '”') lastEnd = cursor + 1;
      continue;
    }

    if (!inQuote) {
      lastEnd = i + 1;
    }
  }

  return lastEnd;
}

export function splitNarrative(input: string): string[] {
  const { text } = extractHints(input);
  if (!text) return [];

  const raw: string[] = [];
  let start = 0;
  let inQuote = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '“') {
      inQuote = true;
      continue;
    }
    if (char === '”') {
      inQuote = false;
      continue;
    }
    if (!inQuote && SENTENCE_END_CHARS.has(char)) {
      const line = text.slice(start, i + 1).trim();
      if (line) raw.push(line);
      start = i + 1;
    }
  }

  const tail = text.slice(start).trim();
  if (tail) raw.push(tail);

  // 合并过短的行(<3字符)到上一句, 避免孤立的括号/标点
  const result: string[] = [];
  for (const line of raw) {
    if (line.length < 3 && result.length > 0) {
      result[result.length - 1] += line;
    } else {
      result.push(line);
    }
  }
  return mergeShortLines(result);
}

function splitCompleteSentences(input: string): { complete: string[]; tail: string } {
  const normalized = normalizeModelText(input);
  const lastEnd = lastCompleteBoundary(normalized);

  if (lastEnd < 0) {
    return { complete: [], tail: normalized };
  }

  let ready = normalized.slice(0, lastEnd);
  let tail = normalized.slice(lastEnd);
  const readyLines = splitNarrative(ready);

  if (readyLines.length && isShortText(readyLines[readyLines.length - 1])) {
    const shortTail = readyLines.pop() || '';
    const shortIndex = ready.lastIndexOf(shortTail);
    if (shortIndex >= 0) {
      tail = ready.slice(shortIndex) + tail;
      ready = ready.slice(0, shortIndex);
    }
  }

  return {
    complete: splitNarrative(ready),
    tail,
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
      buffer += normalizeModelText(chunk);
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
