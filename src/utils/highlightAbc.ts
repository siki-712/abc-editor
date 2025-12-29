import { tokenize } from './chamberAbc';

// TokenKindからCSSクラスへのマッピング
const TOKEN_CLASS_MAP: Record<string, string> = {
  // Header fields
  FieldLabel: 'abc-meta-key',
  Colon: 'abc-meta-key',

  // Notes
  Note: 'abc-note',
  Rest: 'abc-rest',
  OctaveUp: 'abc-octave-high',
  OctaveDown: 'abc-octave-low',
  NoteLength: 'abc-duration',

  // Accidentals
  Sharp: 'abc-accidental',
  Natural: 'abc-accidental',
  Flat: 'abc-accidental',

  // Bar lines
  Bar: 'abc-bar',
  DoubleBar: 'abc-bar-double',
  RepeatStart: 'abc-bar',
  RepeatEnd: 'abc-bar',
  ThinThickBar: 'abc-bar-double',
  ThickThinBar: 'abc-bar-double',

  // Grouping
  LeftBracket: 'abc-chord',
  RightBracket: 'abc-chord',
  LeftParen: 'abc-slur',
  RightParen: 'abc-slur',
  LeftBrace: 'abc-grace-note',
  RightBrace: 'abc-grace-note',

  // Other symbols
  Tie: 'abc-tie',
  BrokenRhythm: 'abc-broken-rhythm',
  Tuplet: 'abc-tuplet',
  Decoration: 'abc-decoration',

  // Text and numbers
  Text: 'abc-meta-value',
  Number: 'abc-duration',
  Slash: 'abc-duration',

  // Whitespace and structure
  Whitespace: '',
  Newline: '',
  Comment: 'abc-comment',
  LineContinuation: 'abc-text',

  // Special
  Eof: '',
  Error: 'abc-error',
};

// HTMLエスケープ
export const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

interface Token {
  kind: string;
  range: { start: number; end: number };
}

// ABC記法のシンタックスハイライト
export const highlightAbc = (code: string): string => {
  const tokens = tokenize(code) as Token[];

  if (!tokens || !Array.isArray(tokens)) {
    return escapeHtml(code);
  }

  let result = '';
  let lastEnd = 0;

  for (const token of tokens) {
    const start = token.range.start;
    const end = token.range.end;

    // トークン間のギャップがあれば追加
    if (start > lastEnd) {
      result += escapeHtml(code.slice(lastEnd, start));
    }

    const text = code.slice(start, end);
    const className = TOKEN_CLASS_MAP[token.kind];

    if (className) {
      result += `<span class="${className}">${escapeHtml(text)}</span>`;
    } else {
      result += escapeHtml(text);
    }

    lastEnd = end;
  }

  // 残りのテキストを追加
  if (lastEnd < code.length) {
    result += escapeHtml(code.slice(lastEnd));
  }

  return result;
};

// 楽譜行の文字単位ハイライト（互換性のため残す）
export const highlightMusicLine = (line: string): string => {
  return highlightAbc(line);
};
