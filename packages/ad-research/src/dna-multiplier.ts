import type { VideoAdBreakdown } from "@doemedia/shared";

export interface DNAMultiplierInput {
  videoUrl: string;
  videoBreakdown: VideoAdBreakdown;
  brandName: string;
  productDescription: string;
  brandVoice: string;
  targetAudience: string;
}

export interface AdVariation {
  hookConcept: string;
  meatStructure: string;
  offerAction: string;
  scriptOutline: string;
  format: "VIDEO" | "IMAGE" | "CAROUSEL";
  estimatedDuration?: number;
  differentiator: string; // How this variation differs from the original
}

export interface DNAMultiplierOutput {
  originalBreakdown: VideoAdBreakdown;
  variations: AdVariation[];
  strategicNotes: string;
}

/**
 * Build a prompt for the DNA Multiplier feature.
 * Takes a video ad breakdown from Gemini and generates
 * 10+ ad variation concepts for the client's brand.
 *
 * This is used with Claude Opus for highest-quality creative output.
 */
export function buildDNAMultiplierPrompt(input: DNAMultiplierInput): string {
  return `You are a world-class performance marketing creative strategist.

A winning video ad has been analyzed and here is its creative DNA:

**Original Ad Breakdown:**
- Hook Style: ${input.videoBreakdown.hookStyle}
- Hook: ${input.videoBreakdown.hookDescription}
- Content Structure: ${input.videoBreakdown.contentStructure}
- Main Content: ${input.videoBreakdown.meatDescription}
- Action/Offer: ${input.videoBreakdown.actionOffer}
- Proof Elements: ${input.videoBreakdown.proofElements.join(", ")}
- Pacing: ${input.videoBreakdown.pacing}
- Visual Style: ${input.videoBreakdown.visualStyle}

**Your Client:**
- Brand: ${input.brandName}
- Product: ${input.productDescription}
- Brand Voice: ${input.brandVoice}
- Target Audience: ${input.targetAudience}

**Your Task:**
Generate 10 NEW ad variation concepts that apply this winning creative DNA to ${input.brandName}'s brand and product. Each variation should:

1. Keep the core creative structure that makes the original ad work
2. Adapt the hook, content, and offer to fit ${input.brandName}'s brand voice and product
3. Differentiate from each other (different hooks, angles, or formats)
4. Include a mix of formats: at least 5 video concepts, 3 static concepts, and 2 carousel concepts

For each variation, provide:
- Hook concept (the first 3 seconds / first impression)
- Main content structure (the "meat")
- Action/Offer (the CTA and closing)
- Full script outline (for video) or layout description (for static/carousel)
- Estimated duration (for video)
- How it differs from the original

Also include strategic notes on why this creative DNA works and how to test these variations.`;
}
