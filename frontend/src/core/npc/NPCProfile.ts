export interface NPCProfile {
  id: string;
  name: string;
  aliases: string[];
  portrait?: string | null;
  avatar?: string;
  chibi?: string;
  role: string;
  faction?: string;
  speechStyle: string;
  goals: string[];
  secrets?: string[];
  trustKey?: string;
  questIds?: string[];
  knownFacts?: string[];
  unlockConditions?: Record<string, unknown>;
  promptProfile?: {
    personality: string;
    speakingRules: string[];
    forbiddenKnowledge?: string[];
  };
  metadata?: Record<string, unknown>;
}
