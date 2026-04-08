export interface CopyGenerationInput {
  clientName: string;
  industry: string;
  brandVoice: string;
  targetAudience: string;
  productDescription: string;
  briefContext: {
    format: string;
    hook: string;
    angle: string;
    keyMessage: string;
    objective: string;
  };
  winningCopyExamples?: string[];
  numVariants: number;
}

export const COPY_SYSTEM = `You are an elite direct-response copywriter specializing in Meta ads for e-commerce brands. Your copy has generated millions in revenue across skincare, supplements, fashion, and home goods brands.

Your writing philosophy:
- The first line must stop the scroll. No exceptions.
- Every word earns its place. Cut ruthlessly.
- Speak the customer's language, not the brand's jargon.
- Lead with emotion, close with logic.
- The best ads feel like a friend recommending something, not a brand selling.

You write in the brand's voice, not yours. You adapt to whether they're bold and edgy, clean and minimal, or warm and empathetic.

Format rules:
- Primary Text: 3 lengths — short (<125 chars), medium (<250 chars), long (3-5 lines with line breaks)
- Headline: <40 characters, punchy
- Description: <30 characters
- Always include a clear CTA`;

export function buildCopyPrompt(input: CopyGenerationInput): string {
  const examples = input.winningCopyExamples?.length
    ? `\n## Winning Copy Examples (from this account)\n${input.winningCopyExamples.map((ex, i) => `${i + 1}. "${ex}"`).join("\n")}`
    : "";

  return `Generate ${input.numVariants} ad copy variations for **${input.clientName}** (${input.industry}).

## Brand Context
- Brand Voice: ${input.brandVoice}
- Target Audience: ${input.targetAudience}
- Product: ${input.productDescription}
${examples}

## Brief
- Format: ${input.briefContext.format}
- Hook Concept: ${input.briefContext.hook}
- Angle: ${input.briefContext.angle}
- Key Message: ${input.briefContext.keyMessage}
- Objective: ${input.briefContext.objective}

---

Generate ${input.numVariants} variations. Each variation should test a DIFFERENT hook type:

For each variation, provide:

**Variation [N] — [Hook Type: Question / Bold Claim / Statistic / Testimonial / Pain Point / Curiosity / Story / Direct Benefit]**

**Primary Text (Short — <125 chars):**
[One-liner version]

**Primary Text (Medium — <250 chars):**
[2-3 sentence version]

**Primary Text (Long):**
[3-5 lines with strategic line breaks for readability]

**Headline:** [<40 chars]
**Description:** [<30 chars]
**CTA:** [Shop Now / Learn More / Get Yours / etc.]

---

Make each variation genuinely different — different hooks, different emotional triggers, different structures. Don't just rephrase the same idea 5 times.`;
}
