export interface VisualConceptInput {
  briefTitle: string;
  format: string;
  hook: string;
  angle: string;
  keyMessage: string;
  brandAesthetic: string;
  winningVisualStyles: string[];
  industry: string;
}

export const VISUAL_CONCEPT_SYSTEM = `You are an art director for performance marketing creative. You specialize in visual concepts for Meta ads that drive purchases for e-commerce brands.

Your visual concepts are:
- Designed for thumb-stopping impact in a feed
- Optimized for the specific format (square for feed, 9:16 for stories/reels)
- Aligned with brand aesthetics while pushing creative boundaries
- Detailed enough for a designer to execute without ambiguity

You always provide AI image generation prompts that are ready to paste into Midjourney or DALL-E.`;

export function buildVisualConceptPrompt(input: VisualConceptInput): string {
  const styles = input.winningVisualStyles.length
    ? `\n## Winning Visual Styles for This Account\n${input.winningVisualStyles.map((s) => `- ${s}`).join("\n")}`
    : "";

  return `Create a visual concept for a ${input.format} Meta ad.

## Brief
- **Title:** ${input.briefTitle}
- **Hook:** ${input.hook}
- **Angle:** ${input.angle}
- **Key Message:** ${input.keyMessage}
- **Industry:** ${input.industry}

## Brand Aesthetic
${input.brandAesthetic}
${styles}

---

### VISUAL CONCEPT
**Concept Name:** [Give it a descriptive name]
**What the Viewer Sees:** [Detailed description of the visual — what's in frame, composition, focal point, action]

### COLOR PALETTE
Provide 5 colors:
1. Primary: #[hex] — [name] — [how it's used]
2. Secondary: #[hex] — [name] — [how it's used]
3. Accent: #[hex] — [name] — [how it's used]
4. Background: #[hex] — [name] — [how it's used]
5. Text: #[hex] — [name] — [how it's used]

### LAYOUT DIRECTION
- **Composition:** [Rule of thirds? Centered? Asymmetric?]
- **Text Placement:** [Where does text sit relative to the image?]
- **Focal Point:** [Where should the eye go first?]
- **Negative Space:** [How is breathing room used?]

### TYPOGRAPHY
- **Headline Style:** [Bold sans-serif? Handwritten? Serif?]
- **Body Style:** [Clean, small, supporting]
- **Text Hierarchy:** [What reads first, second, third?]

### AI IMAGE GENERATION PROMPTS
Provide 3 ready-to-use prompts:

**Prompt 1 (Product-focused):**
[Detailed prompt for Midjourney/DALL-E]

**Prompt 2 (Lifestyle):**
[Detailed prompt for Midjourney/DALL-E]

**Prompt 3 (Abstract/Mood):**
[Detailed prompt for Midjourney/DALL-E]

### MOOD KEYWORDS
[5-7 keywords that capture the feel: e.g., "clean, aspirational, warm, confident, premium"]`;
}
