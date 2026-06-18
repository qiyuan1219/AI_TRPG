export interface SceneSummary {
  sceneId: string;
  areaId: string;
  title: string;
  currentObjective?: string;
  participants: string[];
  confirmedFacts: string[];
  unresolvedClues: string[];
  recentRuleEvents: string[];
  recentPlayerIntent?: string;
  lastUpdatedAt: string;
  version: number;
}

export function updateSceneSummary(
  previous: SceneSummary,
  update: Partial<Pick<SceneSummary, 'sceneId' | 'areaId' | 'title' | 'currentObjective' | 'participants' | 'recentPlayerIntent'>>,
  ruleEvent?: string,
): SceneSummary {
  return {
    ...previous,
    ...update,
    recentRuleEvents: ruleEvent ? [...previous.recentRuleEvents, ruleEvent].slice(-8) : previous.recentRuleEvents,
    lastUpdatedAt: new Date().toISOString(),
    version: previous.version || 1,
  };
}
