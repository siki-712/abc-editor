import { useRef, useMemo, useState } from "react";
import { useLineNumbers } from "../hooks/useLineNumbers";
import { highlightAbc } from "../utils/highlightAbc";
import { useAbcAutoComplete } from "../hooks/useAbcAutoComplete";
import { SuggestionList } from "./SuggestionList";
import { validateAbc, type ValidationError } from "../utils/validateAbc";

interface AbcEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const AbcEditor = ({ value, onChange }: AbcEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const [hoveredError, setHoveredError] = useState<ValidationError | null>(null);

  const lineNumbers = useLineNumbers(value);
  const highlightedCode = highlightAbc(value);
  const validationErrors = useMemo(() => validateAbc(value), [value]);

  // オートコンプリート機能
  const {
    isOpen,
    suggestions,
    selectedIndex,
    position,
    handleKeyDown,
    selectSuggestion,
    handleMouseEnter,
  } = useAbcAutoComplete({ value, textareaRef, onChange });

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current && highlightRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className="w-full md:w-1/2 h-2/3 md:h-full flex flex-col p-4" style={{ backgroundColor: '#161616' }}>
      <div className="w-full flex-1 flex flex-col rounded-lg border border-slate-600 overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
        {/* エディタ部分 */}
        <div className="flex-1 flex overflow-hidden">
        {/* 行番号 */}
        <div
          ref={lineNumbersRef}
          className="overflow-hidden text-right text-sm font-mono leading-relaxed text-slate-500 select-none"
          style={{ backgroundColor: '#0f0f0f', minWidth: '2.5rem' }}
        >
          <pre className="m-0 pl-1 pr-3 py-4">{lineNumbers}</pre>
        </div>

        {/* エディタエリア */}
        <div className="flex-1 relative">
          {/* シンタックスハイライト背景 */}
          <div
            ref={highlightRef}
            className="absolute inset-0 overflow-hidden px-4 py-4 text-sm font-mono leading-relaxed pointer-events-none"
            style={{
              backgroundColor: '#1a1a1a',
              opacity: hoveredError ? 0.3 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            <pre
              className="m-0"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </div>

          {/* ホバー中の小節ハイライト */}
          {hoveredError && (() => {
            const lines = value.split('\n');
            const errorLine = lines[hoveredError.line] || '';
            const errorMeasure = errorLine.substring(hoveredError.startCol, hoveredError.endCol);
            const highlightedMeasure = highlightAbc(errorMeasure);

            return (
              <div
                className="absolute inset-0 overflow-hidden px-4 py-4 text-sm font-mono leading-relaxed pointer-events-none"
                style={{ backgroundColor: 'transparent' }}
              >
                <pre className="m-0">
                  {lines.map((line, lineIndex) => {
                    if (lineIndex === hoveredError.line) {
                      const before = line.substring(0, hoveredError.startCol);
                      const after = line.substring(hoveredError.endCol);

                      return (
                        <div key={lineIndex}>
                          <span style={{ opacity: 0 }}>{before}</span>
                          <span
                            className="bg-amber-500/20 px-1 rounded"
                            dangerouslySetInnerHTML={{ __html: highlightedMeasure }}
                          />
                          <span style={{ opacity: 0 }}>{after}</span>
                        </div>
                      );
                    }
                    return <div key={lineIndex} style={{ opacity: 0 }}>{line}</div>;
                  })}
                </pre>
              </div>
            );
          })()}

          {/* テキストエリア */}
          <textarea
            ref={textareaRef}
            className="absolute inset-0 w-full h-full resize-none px-4 py-4 text-sm font-mono leading-relaxed outline-none border-0"
            style={{ backgroundColor: 'transparent', color: 'transparent', caretColor: '#fff' }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            placeholder="Type /header to insert template..."
          />

          {/* オートコンプリート候補リスト */}
          {isOpen && (
            <SuggestionList
              suggestions={suggestions}
              selectedIndex={selectedIndex}
              position={position}
              onSelect={selectSuggestion}
              onMouseEnter={handleMouseEnter}
            />
          )}
        </div>
        </div>

        {/* エラー表示エリア */}
        {validationErrors.length > 0 && (
          <div
            className="border-t border-slate-600 px-4 py-3 text-xs font-mono overflow-auto"
            style={{ backgroundColor: '#0f0f0f', maxHeight: '8rem' }}
          >
            <div className="text-slate-500 mb-2 text-[10px] uppercase tracking-wide">
              Validation Errors ({validationErrors.length})
            </div>
            {validationErrors.map((error, index) => (
              <div
                key={index}
                className="flex items-start gap-3 mb-2 last:mb-0 hover:bg-slate-800/30 px-2 py-1 rounded transition-colors cursor-pointer"
                onMouseEnter={() => setHoveredError(error)}
                onMouseLeave={() => setHoveredError(null)}
              >
                <span className="text-amber-500 shrink-0 mt-0.5">⚠️</span>
                <div className="flex-1 flex gap-2">
                  <span className="text-cyan-400 shrink-0">
                    Ln {error.line + 1}, M{error.measureIndex + 1}:
                  </span>
                  <span className="text-amber-300">{error.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
