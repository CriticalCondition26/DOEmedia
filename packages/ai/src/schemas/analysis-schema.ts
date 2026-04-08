/** JSON schema for structured creative analysis output */
export const analysisOutputSchema = {
  type: "object" as const,
  properties: {
    winningPatterns: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          pattern: { type: "string" as const, description: "Format + hook + angle combination" },
          roas: { type: "number" as const, description: "Average ROAS for this pattern" },
          hypothesis: { type: "string" as const, description: "Why this works" },
          examples: { type: "array" as const, items: { type: "string" as const } },
        },
        required: ["pattern", "roas", "hypothesis", "examples"] as const,
      },
    },
    losingPatterns: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          pattern: { type: "string" as const },
          roas: { type: "number" as const },
          reason: { type: "string" as const },
        },
        required: ["pattern", "roas", "reason"] as const,
      },
    },
    fatigueAlerts: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          adName: { type: "string" as const },
          signal: { type: "string" as const, description: "What indicates fatigue" },
          recommendation: { type: "string" as const },
        },
        required: ["adName", "signal", "recommendation"] as const,
      },
    },
    formatGaps: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          format: { type: "string" as const },
          opportunity: { type: "string" as const },
        },
        required: ["format", "opportunity"] as const,
      },
    },
    copyInsights: {
      type: "object" as const,
      properties: {
        winningHookTypes: { type: "array" as const, items: { type: "string" as const } },
        winningTones: { type: "array" as const, items: { type: "string" as const } },
        averageWinningLength: { type: "string" as const },
        keyObservation: { type: "string" as const },
      },
      required: ["winningHookTypes", "keyObservation"] as const,
    },
    recommendations: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          format: { type: "string" as const, enum: ["IMAGE", "VIDEO", "CAROUSEL"] },
          hookConcept: { type: "string" as const },
          angle: { type: "string" as const },
          rationale: { type: "string" as const },
          priority: { type: "string" as const, enum: ["HIGH", "MEDIUM", "LOW"] },
        },
        required: ["format", "hookConcept", "angle", "rationale", "priority"] as const,
      },
    },
    summary: { type: "string" as const, description: "2-3 sentence executive summary" },
  },
  required: [
    "winningPatterns",
    "losingPatterns",
    "fatigueAlerts",
    "recommendations",
    "summary",
  ] as const,
};

export type AnalysisOutput = {
  winningPatterns: Array<{
    pattern: string;
    roas: number;
    hypothesis: string;
    examples: string[];
  }>;
  losingPatterns: Array<{
    pattern: string;
    roas: number;
    reason: string;
  }>;
  fatigueAlerts: Array<{
    adName: string;
    signal: string;
    recommendation: string;
  }>;
  formatGaps?: Array<{
    format: string;
    opportunity: string;
  }>;
  copyInsights?: {
    winningHookTypes: string[];
    winningTones?: string[];
    averageWinningLength?: string;
    keyObservation: string;
  };
  recommendations: Array<{
    format: "IMAGE" | "VIDEO" | "CAROUSEL";
    hookConcept: string;
    angle: string;
    rationale: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
  }>;
  summary: string;
};
