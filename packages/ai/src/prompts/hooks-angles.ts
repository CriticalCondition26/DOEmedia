export interface VideoBreakdownInput {
  videoUrl?: string;
  adName: string;
  adCopy?: string;
  brandName: string;
  industry: string;
}

export const VIDEO_ANALYSIS_SYSTEM = `You are a creative director who specializes in deconstructing high-performing Meta video ads for e-commerce brands.

When analyzing a video ad, you break it down into its creative DNA:
- Hook (first 3 seconds): What technique stops the scroll?
- Meat (middle section): What's the content structure?
- Action/Offer (closing): How does the CTA land?
- Proof elements: What builds trust?
- Production style: UGC, professional, mixed?

You are precise and tactical. Your breakdowns are structured so another creative team could recreate the ad's effectiveness for a different product.`;

export function buildVideoBreakdownPrompt(input: VideoBreakdownInput): string {
  return `Analyze this video ad and provide a complete creative DNA breakdown.

**Ad:** "${input.adName}"
**Brand:** ${input.brandName} (${input.industry})
${input.adCopy ? `**Ad Copy:** "${input.adCopy}"` : ""}
${input.videoUrl ? `**Video URL:** ${input.videoUrl}` : ""}

Provide a structured breakdown:

### HOOK (First 3 Seconds)
- **Hook Style:** [Question / Bold Claim / Pattern Interrupt / Testimonial / Shocking Stat / Before-After / Problem Statement / Curiosity Gap]
- **Hook Description:** [Exactly what happens in the first 3 seconds]
- **Why It Works:** [What psychological trigger does it pull?]

### MEAT (Main Content — 3-20 seconds)
- **Content Structure:** [Problem/Solution / Demo / Social Proof Montage / Lifestyle / Tutorial / Story / Comparison]
- **Flow Description:** [Step by step, what happens]
- **Proof Elements:** [Reviews, UGC clips, before/after, statistics, expert endorsement]
- **Key Claims:** [What specific claims or benefits are highlighted]

### ACTION/OFFER (Closing — Last 5-10 seconds)
- **CTA Style:** [Direct / Soft / Urgency / Scarcity / Risk Reversal]
- **Offer Elements:** [Discount, free shipping, guarantee, bundle, etc.]
- **Final Frame:** [What's the last thing the viewer sees?]

### PRODUCTION NOTES
- **Overall Style:** [UGC / Professional / Mixed / Founder-Led]
- **Pacing:** [Fast / Medium / Slow — scenes per second estimate]
- **Visual Style:** [Colors, lighting, camera angles]
- **Text Overlays:** [How is on-screen text used?]
- **Audio:** [Music style, voiceover type, sound effects]

### PERFORMANCE PREDICTION
- **Estimated Effectiveness:** [1-10 score]
- **Best Audience:** [Who would this ad resonate with most?]
- **Biggest Strength:** [One thing that makes this ad work]
- **Biggest Risk:** [One thing that could make it fail]`;
}

export function buildHooksAnglesPrompt(
  industry: string,
  productDescription: string,
  targetAudience: string,
  numHooks: number = 10
): string {
  return `Generate ${numHooks} scroll-stopping hook concepts for a ${industry} e-commerce brand.

**Product:** ${productDescription}
**Target Audience:** ${targetAudience}

For each hook, provide:

**Hook [N]**
- **Type:** [Question / Bold Claim / Pattern Interrupt / Testimonial / Shocking Stat / Curiosity Gap / Pain Point / Direct Benefit]
- **Hook Line:** [The exact first line or visual concept]
- **Best Format:** [Video / Static / Carousel]
- **Best Angle:** [Social proof / Problem-solution / Lifestyle / UGC / Educational / Urgency]
- **Why It Works:** [1 sentence on the psychology]

Make each hook genuinely different. Mix emotional triggers, question types, and formats. Think about what would actually stop a thumb mid-scroll on Instagram or Facebook.`;
}
