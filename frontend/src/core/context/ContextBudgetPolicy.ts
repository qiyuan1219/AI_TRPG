export interface ContextBudgetPolicy {
  maxTokens: number;
  maxHistoryMessages: number;
  maxMemories: number;
  maxCharacters: number;
}

export const CONTEXT_BUDGET_POLICIES: Record<string, ContextBudgetPolicy> = {
  main_chat: { maxTokens: 1400, maxHistoryMessages: 20, maxMemories: 8, maxCharacters: 18000 },
  battle_prep: { maxTokens: 960, maxHistoryMessages: 8, maxMemories: 4, maxCharacters: 9000 },
  battle_resolution: { maxTokens: 1024, maxHistoryMessages: 8, maxMemories: 4, maxCharacters: 10000 },
};
