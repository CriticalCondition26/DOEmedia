/** JSON schema for structured ad copy output */
export const copyOutputSchema = {
  type: "object" as const,
  properties: {
    variations: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          hookType: {
            type: "string" as const,
            enum: [
              "question",
              "bold_claim",
              "statistic",
              "testimonial",
              "pain_point",
              "curiosity",
              "story",
              "direct_benefit",
              "pattern_interrupt",
            ],
          },
          primaryTextShort: { type: "string" as const, description: "Under 125 characters" },
          primaryTextMedium: { type: "string" as const, description: "Under 250 characters" },
          primaryTextLong: { type: "string" as const, description: "3-5 lines with line breaks" },
          headline: { type: "string" as const, description: "Under 40 characters" },
          description: { type: "string" as const, description: "Under 30 characters" },
          callToAction: { type: "string" as const },
          tone: { type: "string" as const },
          emotionalTrigger: { type: "string" as const },
        },
        required: [
          "hookType",
          "primaryTextShort",
          "primaryTextMedium",
          "primaryTextLong",
          "headline",
          "callToAction",
        ] as const,
      },
    },
  },
  required: ["variations"] as const,
};

export type CopyOutput = {
  variations: Array<{
    hookType: string;
    primaryTextShort: string;
    primaryTextMedium: string;
    primaryTextLong: string;
    headline: string;
    description?: string;
    callToAction: string;
    tone?: string;
    emotionalTrigger?: string;
  }>;
};
