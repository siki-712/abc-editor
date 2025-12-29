import { parse, analyze } from './chamberAbc';

export interface ValidationError {
  line: number; // 行番号（0始まり）
  column: number; // 列位置
  startCol: number; // 開始文字位置
  endCol: number; // 終了文字位置
  severity: 'error' | 'warning' | 'info';
  code: string; // エラーコード
  message: string; // エラーメッセージ
}

interface Diagnostic {
  code: string;
  severity: string;
  range: { start: number; end: number };
  message: string;
  labels?: Array<{ range: { start: number; end: number }; message: string }>;
  notes?: string[];
}

interface ParseResult {
  tune: unknown;
  diagnostics: Diagnostic[];
}

interface AnalysisResult {
  diagnostics: Diagnostic[];
}

/**
 * バイトオフセットから行と列を取得する
 */
const getLineCol = (source: string, offset: number): { line: number; col: number } => {
  let line = 0;
  let col = 0;
  let pos = 0;

  for (const char of source) {
    if (pos >= offset) break;
    if (char === '\n') {
      line++;
      col = 0;
    } else {
      col++;
    }
    pos++;
  }

  return { line, col };
};

/**
 * ABC記法をバリデーションして、エラーがある箇所を返す
 */
export const validateAbc = (code: string): ValidationError[] => {
  const errors: ValidationError[] = [];

  try {
    // パース時の診断情報を取得
    const parseResult = parse(code) as ParseResult;

    if (parseResult && parseResult.diagnostics) {
      for (const diagnostic of parseResult.diagnostics) {
        const start = getLineCol(code, diagnostic.range.start);

        errors.push({
          line: start.line,
          column: start.col,
          startCol: diagnostic.range.start,
          endCol: diagnostic.range.end,
          severity: diagnostic.severity.toLowerCase() as 'error' | 'warning' | 'info',
          code: diagnostic.code,
          message: diagnostic.message,
        });
      }
    }

    // 意味解析の診断情報を取得
    if (parseResult && parseResult.tune) {
      const analysisResult = analyze(parseResult.tune) as AnalysisResult;

      if (analysisResult && analysisResult.diagnostics) {
        for (const diagnostic of analysisResult.diagnostics) {
          const start = getLineCol(code, diagnostic.range.start);

          errors.push({
            line: start.line,
            column: start.col,
            startCol: diagnostic.range.start,
            endCol: diagnostic.range.end,
            severity: diagnostic.severity.toLowerCase() as 'error' | 'warning' | 'info',
            code: diagnostic.code,
            message: diagnostic.message,
          });
        }
      }
    }
  } catch (e) {
    // WASMが初期化されていない場合などは無視
    console.warn('validateAbc error:', e);
  }

  // 位置でソート
  errors.sort((a, b) => a.startCol - b.startCol);

  return errors;
};
