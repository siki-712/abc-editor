import {
  ABC_FIELD_PATTERN,
  ABC_NOTE_PATTERN,
  ABC_ACCIDENTAL_PATTERN,
  ABC_BAR_PATTERN,
  ABC_CHORD_BRACKET_PATTERN,
  ABC_SLUR_PATTERN,
  ABC_DURATION_PATTERN,
  ABC_COMMENT_PATTERN,
} from '../types/abc';

// ABC記法のシンタックスハイライト
export const highlightAbc = (code: string): string => {
  const lines = code.split('\n');

  return lines
    .map((line) => {
      // コメント行のハイライト
      if (ABC_COMMENT_PATTERN.test(line)) {
        return `<span class="abc-comment">${escapeHtml(line)}</span>`;
      }

      // ABC記法の正式なフィールドのハイライト
      const match = line.match(ABC_FIELD_PATTERN);
      if (match) {
        const [, key, value] = match;
        return `<span class="abc-meta-key">${escapeHtml(key)}</span><span class="abc-meta-value">${escapeHtml(value)}</span>`;
      }

      // 楽譜部分の文字単位ハイライト
      return highlightMusicLine(line);
    })
    .join('\n');
};

// 楽譜行の文字単位ハイライト
const highlightMusicLine = (line: string): string => {
  let result = '';
  let i = 0;
  let slurLevel = 0; // スラーのネストレベル

  while (i < line.length) {
    const char = line[i];

    // 小節線（複数文字の可能性があるので先にチェック）
    if (char === '|' || char === ':') {
      let barSymbol = char;
      let j = i + 1;

      // |:, :|, ||, :: などをまとめて取得
      while (j < line.length && (line[j] === '|' || line[j] === ':' || line[j] === ']')) {
        barSymbol += line[j];
        j++;
      }

      if (ABC_BAR_PATTERN.test(barSymbol)) {
        result += `<span class="abc-bar">${escapeHtml(barSymbol)}</span>`;
        i = j;
        continue;
      }
    }

    // 臨時記号
    if (ABC_ACCIDENTAL_PATTERN.test(char)) {
      result += `<span class="abc-accidental">${escapeHtml(char)}</span>`;
      i++;
      continue;
    }

    // スラー（ネストレベルに応じて色分け）
    if (ABC_SLUR_PATTERN.test(char)) {
      if (char === '(') {
        // 開始括弧: 現在のレベルで色を適用してからレベルを上げる
        result += `<span class="abc-slur abc-slur-level-${slurLevel % 5}">${escapeHtml(char)}</span>`;
        slurLevel++;
      } else if (char === ')') {
        // 終了括弧: レベルを下げてからそのレベルで色を適用
        slurLevel = Math.max(0, slurLevel - 1);
        result += `<span class="abc-slur abc-slur-level-${slurLevel % 5}">${escapeHtml(char)}</span>`;
      }
      i++;
      continue;
    }

    // 音符（音長記号も一緒に処理）
    if (ABC_NOTE_PATTERN.test(char)) {
      result += `<span class="abc-note">${escapeHtml(char)}</span>`;
      i++;

      // 音符の後に続く音長記号をチェック
      let duration = '';
      let j = i;

      // 音長記号の先読み: /?\d+(/\d+)?
      if (j < line.length && (line[j] === '/' || /\d/.test(line[j]))) {
        // 先頭の / を取得
        if (line[j] === '/') {
          duration += line[j];
          j++;
        }

        // 数字を取得
        while (j < line.length && /\d/.test(line[j])) {
          duration += line[j];
          j++;
        }

        // 分数の場合: /\d+
        if (j < line.length && line[j] === '/') {
          duration += line[j];
          j++;

          // 分母の数字を取得
          while (j < line.length && /\d/.test(line[j])) {
            duration += line[j];
            j++;
          }
        }

        // 音長記号が有効な形式かチェック
        if (duration && ABC_DURATION_PATTERN.test(duration)) {
          result += `<span class="abc-duration">${escapeHtml(duration)}</span>`;
          i = j;
        }
      }

      continue;
    }

    // 和音括弧
    if (ABC_CHORD_BRACKET_PATTERN.test(char)) {
      result += `<span class="abc-chord">${escapeHtml(char)}</span>`;
      i++;
      continue;
    }

    // その他の文字
    result += `<span class="abc-text">${escapeHtml(char)}</span>`;
    i++;
  }

  return result;
};

// HTMLエスケープ
const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
