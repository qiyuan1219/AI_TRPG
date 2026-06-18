import type { SceneSummary } from './SceneSummary';
import { CONTEXT_BUDGET_POLICIES } from './ContextBudgetPolicy';

export function buildAiContext(
  summary: SceneSummary,
  history: Array<Record<string, unknown>>,
  memories: string[],
  policyName = 'main_chat',
) {
  const policy = CONTEXT_BUDGET_POLICIES[policyName] || CONTEXT_BUDGET_POLICIES.main_chat;
  const context = {
    sceneSummary: summary,
    history: history.slice(-policy.maxHistoryMessages),
    memories: memories.slice(-policy.maxMemories),
  };
  while (JSON.stringify(context).length > policy.maxCharacters && context.history.length) context.history.shift();
  while (JSON.stringify(context).length > policy.maxCharacters && context.memories.length) context.memories.shift();
  return context;
}
