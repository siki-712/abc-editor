import { useState, useCallback, useEffect, type KeyboardEvent, type RefObject } from 'react';
import { ABC_FIELD_PATTERN, type AbcFieldKey } from '../types/abc';
import { getSuggestionsForField, type Suggestion } from '../data/abcSuggestions';
import { getCommandSuggestions } from '../data/abcCommands';

interface UseAbcAutoCompleteProps {
  value: string;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
}

interface AutoCompleteState {
  isOpen: boolean;
  suggestions: Suggestion[];
  selectedIndex: number;
  position: { top: number; left: number };
  fieldKey: AbcFieldKey | null;
  inputValue: string;
  isCommand: boolean; // コマンド入力モードかどうか
}

export const useAbcAutoComplete = ({
  value,
  textareaRef,
  onChange,
}: UseAbcAutoCompleteProps) => {
  const [state, setState] = useState<AutoCompleteState>({
    isOpen: false,
    suggestions: [],
    selectedIndex: 0,
    position: { top: 0, left: 0 },
    fieldKey: null,
    inputValue: '',
    isCommand: false,
  });

  // カーソル位置から現在の行とフィールド情報を取得
  const getCurrentLineInfo = useCallback(() => {
    if (!textareaRef.current) {
      return null;
    }

    const cursorPos = textareaRef.current.selectionStart;
    const lines = value.substring(0, cursorPos).split('\n');
    const currentLine = lines[lines.length - 1];

    // コマンド入力のチェック（/で始まる行）
    if (currentLine.startsWith('/')) {
      return {
        fieldKey: null,
        inputValue: currentLine,
        line: currentLine,
        lineStartPos: cursorPos - currentLine.length,
        isCommand: true,
      };
    }

    // ABC記法のフィールドパターンにマッチするかチェック
    const match = currentLine.match(ABC_FIELD_PATTERN);

    if (match) {
      const [, key, val] = match;
      return {
        fieldKey: key as AbcFieldKey,
        inputValue: val,
        line: currentLine,
        lineStartPos: cursorPos - currentLine.length,
        isCommand: false,
      };
    }

    return null;
  }, [value, textareaRef]);

  // カーソル位置を基準に候補リストの表示位置を計算
  const calculatePosition = useCallback(() => {
    if (!textareaRef.current) {
      return { top: 0, left: 0 };
    }

    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const lines = value.substring(0, cursorPos).split('\n');
    const currentLineNumber = lines.length - 1;

    // フォントサイズと行の高さを取得
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 24;
    const paddingTop = parseFloat(getComputedStyle(textarea).paddingTop) || 16;

    // 候補リストの位置を計算（現在行の下）
    const top = paddingTop + (currentLineNumber + 1) * lineHeight - textarea.scrollTop;
    const left = 60; // 行番号とパディングを考慮した左オフセット

    return { top, left };
  }, [value, textareaRef]);

  // テキスト変更時に候補を更新
  // NOTE: このuseEffectは外部システム（textarea要素のカーソル位置と内容）を監視し、
  // その変化に応じてオートコンプリートの状態を更新する正当な用途です
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const lineInfo = getCurrentLineInfo();

    if (!lineInfo) {
      setState((prev) => ({ ...prev, isOpen: false }));
      return;
    }

    let filteredSuggestions: Suggestion[] = [];

    if (lineInfo.isCommand) {
      // コマンド候補を取得
      filteredSuggestions = getCommandSuggestions(lineInfo.inputValue);
    } else if (lineInfo.fieldKey) {
      // フィールド候補を取得
      const allSuggestions = getSuggestionsForField(lineInfo.fieldKey);
      // 入力値でフィルタリング
      filteredSuggestions = allSuggestions.filter((suggestion) =>
        suggestion.value.toLowerCase().startsWith(lineInfo.inputValue.toLowerCase())
      );
    }

    if (filteredSuggestions.length > 0) {
      const position = calculatePosition();
      setState({
        isOpen: true,
        suggestions: filteredSuggestions,
        selectedIndex: 0,
        position,
        fieldKey: lineInfo.fieldKey,
        inputValue: lineInfo.inputValue,
        isCommand: lineInfo.isCommand,
      });
    } else {
      setState((prev) => ({ ...prev, isOpen: false }));
    }
  }, [value, getCurrentLineInfo, calculatePosition]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // 候補を選択してテキストに挿入
  const selectSuggestion = useCallback(
    (suggestion: Suggestion) => {
      if (!textareaRef.current) {
        return;
      }

      const cursorPos = textareaRef.current.selectionStart;
      const lines = value.substring(0, cursorPos).split('\n');
      const currentLine = lines[lines.length - 1];

      let newValue: string;
      let newCursorPos: number;

      if (state.isCommand && suggestion.template) {
        // コマンドの場合：行全体をテンプレートで置き換え
        const beforeLine = value.substring(0, cursorPos - currentLine.length);
        const afterLine = value.substring(cursorPos);
        newValue = beforeLine + suggestion.template + afterLine;
        newCursorPos = beforeLine.length + suggestion.template.length;
      } else if (state.fieldKey) {
        // フィールドの場合：フィールドキーの後の値を候補の値で置き換え
        const newLine = state.fieldKey + suggestion.value;
        const beforeLine = value.substring(0, cursorPos - currentLine.length);
        const afterLine = value.substring(cursorPos);
        newValue = beforeLine + newLine + afterLine;
        newCursorPos = beforeLine.length + newLine.length;
      } else {
        return;
      }

      onChange(newValue);

      // カーソル位置を更新
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = newCursorPos;
          textareaRef.current.selectionEnd = newCursorPos;
          textareaRef.current.focus();
        }
      }, 0);

      setState((prev) => ({ ...prev, isOpen: false }));
    },
    [textareaRef, state.fieldKey, state.isCommand, value, onChange]
  );

  // キーボード操作を処理
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (!state.isOpen) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setState((prev) => ({
            ...prev,
            selectedIndex: Math.min(prev.selectedIndex + 1, prev.suggestions.length - 1),
          }));
          break;

        case 'ArrowUp':
          e.preventDefault();
          setState((prev) => ({
            ...prev,
            selectedIndex: Math.max(prev.selectedIndex - 1, 0),
          }));
          break;

        case 'Enter':
          if (state.suggestions.length > 0) {
            e.preventDefault();
            selectSuggestion(state.suggestions[state.selectedIndex]);
          }
          break;

        case 'Escape':
          e.preventDefault();
          setState((prev) => ({ ...prev, isOpen: false }));
          break;
      }
    },
    [state.isOpen, state.suggestions, state.selectedIndex, selectSuggestion]
  );

  // マウスホバー時のインデックス更新
  const handleMouseEnter = useCallback((index: number) => {
    setState((prev) => ({ ...prev, selectedIndex: index }));
  }, []);

  return {
    isOpen: state.isOpen,
    suggestions: state.suggestions,
    selectedIndex: state.selectedIndex,
    position: state.position,
    handleKeyDown,
    selectSuggestion,
    handleMouseEnter,
  };
};
