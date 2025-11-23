import { useEffect, useRef } from 'react';
import type { Suggestion } from '../data/abcSuggestions';

interface SuggestionListProps {
  suggestions: Suggestion[];
  selectedIndex: number;
  position: { top: number; left: number };
  onSelect: (suggestion: Suggestion) => void;
  onMouseEnter: (index: number) => void;
}

export const SuggestionList = ({
  suggestions,
  selectedIndex,
  position,
  onSelect,
  onMouseEnter,
}: SuggestionListProps) => {
  const selectedRef = useRef<HTMLDivElement>(null);

  // 選択されたアイテムを自動的にビューポート内にスクロール
  useEffect(() => {
    selectedRef.current?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }, [selectedIndex]);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div
      className="absolute z-50 bg-slate-800 rounded-md shadow-xl overflow-hidden"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        minWidth: '200px',
        maxWidth: '400px',
        maxHeight: '300px',
        overflowY: 'auto',
      }}
    >
      {suggestions.map((suggestion, index) => (
        <div
          key={`${suggestion.value}-${index}`}
          ref={index === selectedIndex ? selectedRef : null}
          className={`px-3 py-2 cursor-pointer ${
            index === selectedIndex
              ? 'bg-blue-600 text-white'
              : 'text-slate-200 hover:bg-slate-700'
          }`}
          onClick={() => onSelect(suggestion)}
          onMouseEnter={() => onMouseEnter(index)}
        >
          <div className="font-mono text-sm">{suggestion.value}</div>
          {suggestion.description && (
            <div className="text-xs opacity-75 mt-1">{suggestion.description}</div>
          )}
        </div>
      ))}
    </div>
  );
};
