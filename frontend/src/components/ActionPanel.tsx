import { useState } from 'react';
import type { ActionSuggestion } from '../types/game';

interface ActionPanelProps {
  suggestions: ActionSuggestion[];
  disabled: boolean;
  onSubmit: (text: string) => void;
}

export function ActionPanel({ suggestions, disabled, onSubmit }: ActionPanelProps) {
  const [customAction, setCustomAction] = useState('');

  function submit(text: string) {
    const next = text.trim();
    if (!next || disabled) return;
    setCustomAction('');
    onSubmit(next);
  }

  return (
    <div className="action-panel">
      <div className="suggestion-grid">
        {suggestions.map((item) => (
          <button key={item.id} type="button" onClick={() => submit(item.text)} disabled={disabled}>
            {item.label}
          </button>
        ))}
      </div>
      <form
        className="custom-action"
        onSubmit={(event) => {
          event.preventDefault();
          submit(customAction);
        }}
      >
        <input
          value={customAction}
          onChange={(event) => setCustomAction(event.target.value)}
          placeholder="输入你的行动"
          disabled={disabled}
        />
        <button type="submit" disabled={disabled || !customAction.trim()}>
          执行
        </button>
      </form>
    </div>
  );
}
