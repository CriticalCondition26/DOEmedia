import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_MODELS } from "@doemedia/shared";

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_AI_API_KEY environment variable is required");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

/**
 * Analyze a video ad by its URL using Gemini's multimodal capabilities.
 * Returns structured breakdown of the creative DNA.
 */
export async function analyzeVideoAd(
  videoUrl: string,
  brandContext: string
): Promise<string> {
  const client = getClient();
  const model = client.getGenerativeModel({ model: AI_MODELS.VISUAL });

  const prompt = `You are analyzing a video ad for a performance marketing agency.

Brand context: ${brandContext}
Video URL: ${videoUrl}

Analyze this ad and provide a structured breakdown:

1. **Hook Style** (first 3 seconds): What technique is used to stop the scroll? (question, bold claim, pattern interrupt, testimonial, shocking stat, etc.)
2. **Hook Description**: Describe exactly what happens in the hook
3. **Content Structure** (the "meat"): What is the main body structure? (problem/solution, demo, social proof montage, lifestyle, tutorial, etc.)
4. **Meat Description**: Describe the main content flow
5. **Action/Offer**: How does the CTA and offer land? (urgency, discount, free shipping, risk reversal, etc.)
6. **Proof Elements**: What proof/trust elements are used? (reviews, UGC, before/after, statistics, expert endorsement)
7. **Pacing**: Fast/medium/slow? Scene changes per second?
8. **Visual Style**: Professional/UGC/mixed? Colors? Lighting?
9. **Text Overlay Patterns**: How is text used on screen?
10. **Overall Score** (1-10): How effective is this ad likely to be?

Return as structured JSON.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Generate visual concepts and AI image prompts using Gemini
 */
export async function generateVisualConcept(
  briefDescription: string,
  brandAesthetic: string,
  winningStyles: string[]
): Promise<string> {
  const client = getClient();
  const model = client.getGenerativeModel({ model: AI_MODELS.VISUAL });

  const prompt = `You are an art director for performance marketing creative. Generate visual concepts for Meta ads.

Brief: ${briefDescription}
Brand aesthetic: ${brandAesthetic}
Winning visual styles for this account: ${winningStyles.join(", ")}

Provide:
1. Visual concept description (what the viewer sees)
2. Color palette (5 hex codes with rationale)
3. Layout direction (composition, text placement, focal point)
4. Photography/illustration style notes
5. 3 detailed AI image generation prompts (for Midjourney/DALL-E/Flux)
6. Reference mood keywords

Return as structured JSON.`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
