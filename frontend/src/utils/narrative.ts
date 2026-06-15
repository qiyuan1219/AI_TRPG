import type { ActionSuggestion } from '../types/game';
import {
  SPEAKER_ALIASES,
  SPEAKER_ALIASES_SORTED,
  findRegisteredSpeaker,
  resolveSpeakerName,
} from '../data/characterRegistry';

const ASCII_HINT_RE = /[\[\u3010]\s*HINTS\s*[:\uFF1A]\s*([\s\S]*?)[\]\u3011]/gi;
const ASCII_HINT_START_RE = /[\[\u3010]\s*HINTS\s*[:\uFF1A]/i;
const MACHINE_PROTOCOL_RE = /(?:[ \t]*(?:\[[^\]\r\n]{1,12}\]\s*)?)?[\[\u3010]\s*(?:STATE|SYSTEM|CMD|DIRECTIVE|SCENE)\s*[:\uFF1A][\s\S]*?(?:[\]\u3011]|$)/gi;
const MACHINE_PROTOCOL_START_RE = /(?:[ \t]*(?:\[[^\]\r\n]{1,12}\]\s*)?)?[\[\u3010]\s*(?:STATE|SYSTEM|CMD|DIRECTIVE|SCENE)\s*[:\uFF1A]/i;

const HINT_RE = /[\[【]\s*HINTS\s*[:：]\s*([\s\S]*?)[\]】]/gi;
const HINT_START_RE = /[\[【]\s*HINTS\s*[:：]/i;
const SENTENCE_END_CHARS = new Set(['。', '！', '？', '!', '?']);
const MIN_SEGMENT_TEXT_LENGTH = 10;

export interface NarrativeSegment {
  speaker: string;
  text: string;
}

export interface NarrativeParseResult {
  segments: NarrativeSegment[];
  lastSpeaker: string;
}

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
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[SCENE:[^\]]*\]\n?/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, '') // 多余空格压缩
}

function visibleTextLength(text: string) {
  return text.replace(/[\s""「」【】{}\[\]（）()，,。.!！?？；;：:、—\-…]/g, '').length;
}

function isShortText(text: string) {
  return visibleTextLength(text) > 0 && visibleTextLength(text) < MIN_SEGMENT_TEXT_LENGTH;
}

function joinSegmentText(...parts: string[]) {
  return parts.map((part) => part.trim()).filter(Boolean).join('');
}

function compactText(text: string) {
  return normalizeModelText(text)
    .trim();
}

function closingQuoteFor(char: string) {
  if (char === '「') return '」';
  if (char === '“') return '”';
  if (char === '"') return '"';
  return '';
}

function isQuoteClose(char: string, expectedClose: string) {
  return Boolean(expectedClose) && char === expectedClose;
}

function isDanglingClosingQuoteLine(text: string) {
  return /^[」”』]+[。！？.!?]*$/.test(text.trim());
}

function mergeOrDropDanglingClosingQuotes(lines: string[]) {
  const result: string[] = [];
  for (const line of lines) {
    if (isDanglingClosingQuoteLine(line)) {
      if (result.length > 0) result[result.length - 1] += line.trim();
      continue;
    }
    result.push(line);
  }
  return result;
}

export function stripMachineProtocolText(input: string) {
  return String(input || '').replace(MACHINE_PROTOCOL_RE, '').trim();
}

export function stripAllMachineProtocolText(input: string) {
  return stripHintBlocks(stripMachineProtocolText(input)).text
    .replace(/\bHINTS\b\s*[:：].*$/i, '')
    .trim();
}

function normalizeHintItem(item: string) {
  return item.trim().replace(/^[|]+|[|]+$/g, '').trim();
}

function collectHintBody(body: string, hints: string[]) {
  body.split('|')
    .map(normalizeHintItem)
    .filter(Boolean)
    .forEach((item) => hints.push(item));
}

function findHintStart(input: string) {
  const match = ASCII_HINT_START_RE.exec(input) || HINT_START_RE.exec(input);
  return match ? match.index : -1;
}

function findHintEnd(input: string, start: number) {
  for (let index = start; index < input.length; index += 1) {
    if (input[index] !== ']' && input[index] !== '】') continue;
    const next = input.slice(index + 1).match(/\S/)?.[0] ?? '';
    if (next === '|' || next === ']' || next === '】') continue;
    return index;
  }
  return -1;
}

function stripHintBlocks(input: string, hints: string[] = []) {
  let cursor = 0;
  let text = '';

  while (cursor < input.length) {
    const start = findHintStart(input.slice(cursor));
    if (start < 0) {
      text += input.slice(cursor);
      break;
    }

    const absoluteStart = cursor + start;
    text += input.slice(cursor, absoluteStart);

    const end = findHintEnd(input, absoluteStart);
    if (end < 0) {
      text += input.slice(absoluteStart);
      break;
    }

    const fragment = input.slice(absoluteStart, end + 1);
    const body = fragment
      .replace(/^[\[\u3010]\s*HINTS\s*[:\uFF1A]/i, '')
      .replace(/[\]\u3011]$/, '');
    collectHintBody(body, hints);
    cursor = end + 1;
  }

  return { text, hints };
}

function collectHintItems(fragment: string, hints: string[]) {
  fragment
    .replace(/^[\s|]+|[\s|]+$/g, '')
    .split('|')
    .map(normalizeHintItem)
    .filter((item) => item && !/^HINTS\s*[:：]?$/i.test(item))
    .forEach((item) => hints.push(item));
}

function findLoosePipeHintStart(input: string) {
  const leadingPipe = input.search(/^\s*\|/);
  if (leadingPipe >= 0) return leadingPipe;

  const afterSentence = input.search(/[。！？.!?」”"]\s*\|/);
  if (afterSentence < 0) return -1;
  const pipeOffset = input.slice(afterSentence).search(/\|/);
  return pipeOffset < 0 ? -1 : afterSentence + pipeOffset;
}

function looksLikeActionSuggestionArtifact(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (MACHINE_PROTOCOL_START_RE.test(trimmed)) return true;
  if (ASCII_HINT_START_RE.test(trimmed) || HINT_START_RE.test(trimmed) || /\bHINTS\b/i.test(trimmed)) return true;

  const pipeCount = (trimmed.match(/\|/g) || []).length;
  const hasCheckMarker = /(?:DC|ＤＣ)\s*\d{1,3}|[\u3010\u3011]/i.test(trimmed);
  return (trimmed.startsWith('|') || pipeCount >= 2) && hasCheckMarker;
}

function stripLooseHintArtifacts(text: string, hints: string[] = []) {
  const hintStart = findHintStart(text);
  if (hintStart >= 0) return text.slice(0, hintStart);

  const loosePipeStart = findLoosePipeHintStart(text);
  if (loosePipeStart >= 0) {
    const fragment = text.slice(loosePipeStart);
    if (looksLikeActionSuggestionArtifact(fragment)) {
      collectHintItems(fragment, hints);
      return text.slice(0, loosePipeStart);
    }
  }

  return text.replace(/\bHINTS\b\s*[:：].*$/i, '');
}

export function makeSuggestions(hints: string[]): ActionSuggestion[] {
  return hints
    .map((hint) => hint.trim())
    .filter(Boolean)
    .slice(0, 8)
    .map((hint, index) => ({
      id: `${index}-${hint}`,
      label: hint,
      text: hint,
    }));
}

export function extractHints(input: string): { text: string; suggestions: ActionSuggestion[] } {
  const hints: string[] = [];
  const withoutMachineProtocol = stripMachineProtocolText(input);
  const text = stripHintBlocks(normalizeModelText(withoutMachineProtocol), hints).text;

  return {
    text: compactText(stripLooseHintArtifacts(text, hints)),
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
  return findRegisteredSpeaker(text, reverse);
}

function findExactRegisteredSpeaker(candidate: string) {
  const normalizedCandidate = candidate.trim().replace(/[「」『』“”"']/g, '').replace(/\s+/g, '');
  if (!normalizedCandidate) return '';

  for (const alias of Object.keys(SPEAKER_ALIASES)) {
    const normalizedAlias = alias.replace(/[「」『』“”"']/g, '').replace(/\s+/g, '');
    if (normalizedAlias === normalizedCandidate) {
      return SPEAKER_ALIASES[alias];
    }
  }
  return '';
}

function stripSpeechVerbSuffix(candidate: string) {
  let cleaned = candidate.trim();
  for (const verb of SPEECH_VERBS.slice().sort((a, b) => b.length - a.length)) {
    if (cleaned.endsWith(verb)) {
      cleaned = cleaned.slice(0, -verb.length).trim();
      break;
    }
  }
  return cleaned;
}

function explicitDialogueSpeaker(candidate: string) {
  const suffix = candidate.trim().split(/[。！？.!?；;\n]/).pop()?.trim() ?? '';
  if (!suffix || /[，,、]/.test(suffix)) return '';

  const cleaned = stripSpeechVerbSuffix(suffix);
  if (!cleaned || /^(他|她|它|他们|她们|有人|对方|那人|她们俩|他们俩)$/.test(cleaned)) return '';
  return findExactRegisteredSpeaker(cleaned);
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

function findExplicitSpeakerMarker(before: string): string {
  const suffix = before.trimEnd().split(/[。！？.!?]/).pop()?.trim() ?? '';
  if (!suffix || /[，,、；;]/.test(suffix)) return '';

  const verbPattern = SPEECH_VERBS
    .slice()
    .sort((a, b) => b.length - a.length)
    .join('|');
  const match = suffix.match(new RegExp(`^([^「」"“”【】\\[\\]：:\\s]{1,16})(?:${verbPattern})?[：:]$`));
  const candidate = match?.[1]?.trim() ?? '';
  if (!candidate || /^(他|她|它|他们|她们|对方|那人)$/.test(candidate)) return '';

  return resolveSpeakerName(candidate);
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
  return findExplicitSpeakerMarker(before);
}

function stripTrailingSpeakerMarker(text: string) {
  let trimmed = text.trimEnd();

  for (const alias of SPEAKER_ALIASES_SORTED) {
    const speaker = SPEAKER_ALIASES[alias];
    if (!speaker) continue;

    for (const verb of ['', ...SPEECH_VERBS]) {
      const candidates = [
        `${alias}${verb}：`,
        `${speaker}${verb}：`,
        `${alias}${verb}:`,
        `${speaker}${verb}:`,
      ];
      const marker = candidates.find((item) => trimmed.endsWith(item));
      if (marker) {
        trimmed = trimmed.slice(0, -marker.length);
        return trimmed;
      }
    }
  }

  const suffix = trimmed.split(/[。！？.!?]/).pop()?.trim() ?? '';
  const explicitSpeaker = findExplicitSpeakerMarker(trimmed);
  if (explicitSpeaker && suffix && !/[，,、；;]/.test(suffix)) {
    return trimmed.slice(0, trimmed.length - suffix.length);
  }

  return text;
}

function isNonSpeechQuoteContext(before: string) {
  const suffix = before.trimEnd().slice(-32);
  return /(标出|标注|写着|写有|刻着|刻有|贴着|显示|列着|列出|名为|题为|写作|称为|画着|注明|备注为|标签是|位置是|代号是|名字是)[：:]?$/.test(suffix);
}

// 在整个块中查找最近出现过的说话人（用于处理引号和名字不在同一行的情况）
function findLastSpeakerInBlock(block: string, upTo: number): string {
  const text = block.slice(0, upTo);
  return findSpeaker(text, true);
}

function isPureSpeechAttribution(text: string) {
  const raw = text.trim();
  // 如果包含【】舞台提示，这不是纯发言标记，不要丢弃
  if (raw.includes('【') || raw.includes('】')) return false;

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
  if (looksLikeActionSuggestionArtifact(text)) return;
  if (isPureSpeechAttribution(text)) return;

  const raw = text.trim();
  if (isDanglingClosingQuoteLine(raw)) return;
  // 舞台提示保留【】，只清洗普通叙述
  const cleaned = raw.includes('【')
    ? normalizeNarrationPiece(raw)
    : normalizeNarrationPiece(stripOuterSquareBrackets(text));
  if (!cleaned) return;

  splitPlainSentences(cleaned).forEach((line) => {
    segments.push({ speaker, text: line });
  });
}

function pushDialogue(segments: NarrativeSegment[], text: string, speaker: string) {
  const cleaned = text.trim();
  if (looksLikeActionSuggestionArtifact(cleaned)) return;
  if (isDanglingClosingQuoteLine(cleaned)) return;
  if (!cleaned) return;
  segments.push({ speaker, text: `"${cleaned}"` });
}

function mergeShortSegments(segments: NarrativeSegment[]) {
  const merged = [...segments];

  for (let index = 0; index <= merged.length - 3; index += 1) {
    const current = merged[index];
    const middle = merged[index + 1];
    const next = merged[index + 2];
    const sameSpeakerAroundNarration = current.speaker !== '主持人' && middle.speaker === '主持人' && next.speaker === current.speaker;
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
    if (current.speaker !== '主持人') continue;

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
  defaultSpeaker = '主持人',
  fallbackSpeaker = '',
): NarrativeParseResult {
  const { text } = extractHints(input);
  const segments: NarrativeSegment[] = [];
  let lastSpeaker = fallbackSpeaker;

  if (!text) return { segments, lastSpeaker };

  const blocks = text.split(/\n+/).map((block) => block.trim()).filter(Boolean);

  // 合并孤立的 「」 后引号：AI 偶尔在引号内换行导致 」 单独成行
  for (let i = blocks.length - 1; i > 0; i -= 1) {
    if (isDanglingClosingQuoteLine(blocks[i])) {
      blocks[i - 1] += blocks[i];
      blocks.splice(i, 1);
    }
  }
  while (blocks.length && isDanglingClosingQuoteLine(blocks[0])) {
    blocks.shift();
  }

  for (const block of blocks) {
    const dialogueRe = /([^「」“”\n。！？.!?]+?)\s*[:：]\s*([「“])([\s\S]*?)([」”])/g;
    let cursor = 0;
    let hasDialogue = false;
    let match: RegExpExecArray | null;

    while ((match = dialogueRe.exec(block))) {
      const speaker = explicitDialogueSpeaker(match[1]);
      if (!speaker) {
        pushNarration(segments, block.slice(cursor, match.index + match[0].length), defaultSpeaker);
        cursor = match.index + match[0].length;
        continue;
      }

      hasDialogue = true;
      const before = block.slice(cursor, match.index);
      const actor = findSpeaker(before);
      const narrationSpeaker = before.includes('【') && actor ? actor : defaultSpeaker;
      pushNarration(segments, before, narrationSpeaker);
      pushDialogue(segments, match[3], speaker);
      lastSpeaker = speaker;

      cursor = match.index + match[0].length;
    }

    const tail = block.slice(cursor);
    const tailActor = findSpeaker(tail);
    const tailSpeaker = tail.includes('【') && tailActor ? tailActor : defaultSpeaker;
    pushNarration(segments, tail, tailSpeaker);
    // 仅在叙述末尾有明确说话人标记（如"XX："）时才更新 lastSpeaker，避免常见词误匹配
    const tailHasExplicitMarker = findSpeakerBySpeechPattern(tail);
    if (tailHasExplicitMarker) lastSpeaker = tailHasExplicitMarker;

    if (!hasDialogue) {
      const explicitMarker = findSpeakerBySpeechPattern(block);
      if (explicitMarker) lastSpeaker = explicitMarker;
    }
  }

  return { segments: mergeShortSegments(segments), lastSpeaker };
}

function lastCompleteBoundary(input: string) {
  let quoteClose = '';
  let lastEnd = -1;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (!quoteClose) {
      const close = closingQuoteFor(char);
      if (close) {
        quoteClose = close;
        continue;
      }
    } else if (isQuoteClose(char, quoteClose)) {
      quoteClose = '';
      continue;
    }

    if (!SENTENCE_END_CHARS.has(char)) continue;

    if (quoteClose) {
      // 中文标点在引号内，向前看是否紧接后引号
      let cursor = i + 1;
      while (cursor < input.length && (input[cursor] === ' ' || input[cursor] === '\t' || input[cursor] === '\u3000')) {
        cursor += 1;
      }
      if (cursor < input.length && isQuoteClose(input[cursor], quoteClose)) {
        lastEnd = cursor + 1;
        quoteClose = '';
        i = cursor; // 跳过后引号
      }
      continue;
    }

    // 不在引号中
    lastEnd = i + 1;
  }

  return lastEnd;
}

export function splitNarrative(input: string): string[] {
  const { text } = extractHints(input);
  if (!text) return [];

  const raw: string[] = [];
  let start = 0;
  let quoteClose = '';

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    // 追踪引号状态（用于判断句子边界是否需要包含后引号）
    if (!quoteClose) {
      const close = closingQuoteFor(char);
      if (close) {
        quoteClose = close;
        continue;
      }
    } else if (isQuoteClose(char, quoteClose)) {
      quoteClose = '';
      continue;
    }

    // 句子结束字符 — 不跳过引号内的，而是检查引号是否即将闭合
    if (SENTENCE_END_CHARS.has(char)) {
      if (quoteClose) {
        // 中文标点规矩：句号/问号/叹号在引号内部
        // 向前看：紧接在句末标点后的是否是后引号？
        let cursor = i + 1;
        while (cursor < text.length && (text[cursor] === ' ' || text[cursor] === '\t' || text[cursor] === '\u3000')) {
          cursor += 1;
        }
        if (cursor < text.length && isQuoteClose(text[cursor], quoteClose)) {
          // 句子结束 → 后引号紧随其后 → 整个 "..." 作为一句切出
          const line = text.slice(start, cursor + 1).trim();
          if (line) raw.push(line);
          start = cursor + 1;
          quoteClose = '';
          i = cursor;
          continue;
        }
        // 引号内句号但后引号还没来（对话还没说完），继续累积
        continue;
      }
      // 不在引号中，普通叙事句结束
      const line = text.slice(start, i + 1).trim();
      if (line) raw.push(line);
      start = i + 1;
    }
  }

  const tail = text.slice(start).trim();
  if (tail) raw.push(tail);

  // 合并孤立引号/过短行到上一句
  const result: string[] = [];
  for (const line of raw) {
    if (isDanglingClosingQuoteLine(line)) {
      if (result.length > 0) result[result.length - 1] += line.trim();
    } else if (result.length > 0 && line.length < 3) {
      result[result.length - 1] += line;
    } else {
      result.push(line);
    }
  }
  return mergeOrDropDanglingClosingQuotes(result);
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

  const lastReadyLine = readyLines[readyLines.length - 1] || '';
  if (readyLines.length && isShortText(lastReadyLine) && !/[」”』]$/.test(lastReadyLine.trim())) {
    const shortTail = readyLines.pop() || '';
    const shortIndex = ready.lastIndexOf(shortTail);
    if (shortIndex >= 0) {
      tail = ready.slice(shortIndex) + tail;
      ready = ready.slice(0, shortIndex);
    }
  }

  return {
    complete: mergeOrDropDanglingClosingQuotes(splitNarrative(ready)),
    tail,
  };
}

export function createNarrativeStreamParser() {
  let buffer = '';
  let latestSuggestions: ActionSuggestion[] = [];

  function consume() {
    const lines: string[] = [];

    while (buffer) {
      const hintStart = findHintStart(buffer);
      if (hintStart >= 0) {
        const hintEnd = findHintEnd(buffer, hintStart);
        const beforeHint = buffer.slice(0, hintStart);
        const split = splitCompleteSentences(beforeHint);
        lines.push(...mergeOrDropDanglingClosingQuotes(split.complete));

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
      lines.push(...mergeOrDropDanglingClosingQuotes(split.complete));
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
      const lines = mergeOrDropDanglingClosingQuotes(splitNarrative(parsed.text));
      if (parsed.suggestions.length) {
        latestSuggestions = parsed.suggestions;
      }
      buffer = '';
      return { lines, suggestions: latestSuggestions };
    },
  };
}
