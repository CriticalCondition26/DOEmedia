/** JSON schema for structured strategy output */
export const strategyOutputSchema = {
  type: "object" as const,
  properties: {
    overview: { type: "string" as const, description: "2-3 sentence strategic overview" },
    themes: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          theme: { type: "string" as const },
          rationale: { type: "string" as const },
          priority: { type: "integer" as const, minimum: 1, maximum: 5 },
          exampleHooks: { type: "array" as const, items: { type: "string" as const } },
        },
        required: ["theme", "rationale", "priority", "exampleHooks"] as const,
      },
    },
    briefs: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          title: { type: "string" as const },
          format: { type: "string" as const, enum: ["IMAGE", "VIDEO", "CAROUSEL"] },
          hook: { type: "string" as const },
          angle: { type: "string" as const },
          keyMessage: { type: "string" as const },
          objective: { type: "string" as const },
          priority: { type: "string" as const, enum: ["HIGH", "MEDIUM", "LOW"] },
          // Video-specific
          scriptStructure: {
            type: "object" as const,
            properties: {
              hook: { type: "string" as const },
              meat: { type: "string" as const },
              actionOffer: { type: "string" as const },
            },
          },
          targetDuration: { type: "integer" as const },
          // Static-specific
          visualConcept: { type: "string" as const },
          headlineApproach: { type: "string" as const },
          // Carousel-specific
          slides: {
            type: "array" as const,
            items: {
              type: "object" as const,
              properties: {
                slideNumber: { type: "integer" as const },
                content: { type: "string" as const },
              },
            },
          },
        },
        required: ["title", "format", "hook", "angle", "keyMessage", "objective", "priority"] as const,
      },
    },
    killList: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          adName: { type: "string" as const },
          reason: { type: "string" as const },
        },
        required: ["adName", "reason"] as const,
      },
    },
    formatMix: {
      type: "object" as const,
      properties: {
        video: { type: "integer" as const },
        static: { type: "integer" as const },
        carousel: { type: "integer" as const },
      },
      required: ["video", "static", "carousel"] as const,
    },
  },
  required: ["overview", "themes", "briefs", "killList", "formatMix"] as const,
};

export type StrategyOutput = {
  overview: string;
  themes: Array<{
    theme: string;
    rationale: string;
    priority: number;
    exampleHooks: string[];
  }>;
  briefs: Array<{
    title: string;
    format: "IMAGE" | "VIDEO" | "CAROUSEL";
    hook: string;
    angle: string;
    keyMessage: string;
    objective: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    scriptStructure?: { hook: string; meat: string; actionOffer: string };
    targetDuration?: number;
    visualConcept?: string;
    headlineApproach?: string;
    slides?: Array<{ slideNumber: number; content: string }>;
  }>;
  killList: Array<{ adName: string; reason: string }>;
  formatMix: { video: number; static: number; carousel: number };
};
