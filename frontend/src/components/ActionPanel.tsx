import { useState } from 'react';
import type { ActionSuggestion } from '../types/game';

interface ActionPanelProps {
  suggestions: ActionSuggestion[];
  disabled: boolean;
  onSubmit: (text: string) => void;
  placeholder?: string;
  helperText?: string;
  suggestionMode?: 'submit' | 'fill';
  hideFreeInput?: boolean;
}

export function ActionPanel({
  suggestions,
  disabled,
  onSubmit,
  placeholder = '输入你的行动……',
  helperText,
  suggestionMode = 'submit',
  hideFreeInput = false,
}: ActionPanelProps) {
  const [customAction, setCustomAction] = useState('');

  function submit(text: string) {
    const next = text.trim();
    if (!next || disabled) return;
    setCustomAction('');
    onSubmit(next);
  }

  return (
    <div className="vn-choices-list">
      {helperText && <p className="vn-choice-helper">{helperText}</p>}
      {suggestions.map((item) => (
        <button
          key={item.id}
          type="button"
          className="vn-choice-btn"
          onClick={() => {
            if (suggestionMode === 'fill') {
              setCustomAction(item.text);
              return;
            }
            submit(item.text);
          }}
          disabled={disabled}
        >
          {item.label}
        </button>
      ))}
      {!hideFreeInput && (
      <form className="vn-choice-custom" onSubmit={(event) => { event.preventDefault(); submit(customAction); }}>
        <input value={customAction} onChange={(event) => setCustomAction(event.target.value)} placeholder={placeholder} disabled={disabled} />
        <button type="submit" disabled={disabled || !customAction.trim()}>执行</button>
      </form>
      )}
    </div>
  );
}
