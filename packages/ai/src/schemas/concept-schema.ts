/** JSON schema for structured visual concept output */
export const conceptOutputSchema = {
  type: "object" as const,
  properties: {
    conceptName: { type: "string" as const },
    description: { type: "string" as const },
    mood: { type: "string" as const },
    colorPalette: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          hex: { type: "string" as const },
          name: { type: "string" as const },
          usage: { type: "string" as const },
        },
        required: ["hex", "name", "usage"] as const,
      },
    },
    layout: {
      type: "object" as const,
      properties: {
        composition: { type: "string" as const },
        textPlacement: { type: "string" as const },
        focalPoint: { type: "string" as const },
      },
      required: ["composition", "textPlacement", "focalPoint"] as const,
    },
    aiImagePrompts: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          label: { type: "string" as const },
          prompt: { type: "string" as const },
        },
        required: ["label", "prompt"] as const,
      },
    },
    moodKeywords: { type: "array" as const, items: { type: "string" as const } },
    styleReferences: { type: "array" as const, items: { type: "string" as const } },
  },
  required: [
    "conceptName",
    "description",
    "mood",
    "colorPalette",
    "layout",
    "aiImagePrompts",
    "moodKeywords",
  ] as const,
};

export type ConceptOutput = {
  conceptName: string;
  description: string;
  mood: string;
  colorPalette: Array<{ hex: string; name: string; usage: string }>;
  layout: {
    composition: string;
    textPlacement: string;
    focalPoint: string;
  };
  aiImagePrompts: Array<{ label: string; prompt: string }>;
  moodKeywords: string[];
  styleReferences?: string[];
};
