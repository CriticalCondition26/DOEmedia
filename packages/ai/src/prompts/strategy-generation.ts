export interface StrategyInput {
  clientName: string;
  industry: string;
  brandVoice: string;
  targetAudience: string;
  performanceAnalysis: string;
  currentAdCount: number;
  assetsNeeded: number;
}

export const STRATEGY_SYSTEM = `You are a creative strategist at a top performance marketing agency managing Meta ads for e-commerce Shopify brands doing $5M-$100M/year in revenue.

You create data-driven creative strategies that directly translate performance analysis into actionable creative briefs. Your strategies are:
- Grounded in the data (every recommendation ties back to a performance insight)
- Format-specific (static briefs look different from video briefs)
- Structured for handoff (designers and editors can execute from your briefs)
- Prioritized (what to make first, what can wait)

For VIDEO briefs, you always structure around: Hook → Meat → Action/Offer
For STATIC briefs, you focus on: Visual concept + Headline approach + Key message
For CAROUSEL briefs, you plan: Slide-by-slide narrative flow`;

export function buildStrategyPrompt(input: StrategyInput): string {
  return `Generate a creative strategy for **${input.clientName}** (${input.industry}).

## Performance Analysis
${input.performanceAnalysis}

## Brand Context
- Brand Voice: ${input.brandVoice}
- Target Audience: ${input.targetAudience}
- Currently Active Ads: ${input.currentAdCount}
- Assets Needed This Cycle: ${input.assetsNeeded}

---

Create a complete creative strategy with:

### STRATEGIC OVERVIEW
2-3 sentences on the overall creative direction for this cycle. What's the thesis?

### RECOMMENDED CREATIVES (${input.assetsNeeded} total)
For each recommended creative, provide:

**[Format] — [Brief Title]**
- Hook: [What stops the scroll in the first 3 seconds / first impression]
- Angle: [The creative angle — social proof, problem/solution, UGC, lifestyle, etc.]
- Why: [How this ties to performance data]
- Priority: HIGH / MEDIUM / LOW

For VIDEO briefs, also include:
- Script Structure:
  - Hook (0-3s): [Exact concept]
  - Meat (3-20s): [Content structure]
  - Action/Offer (20-30s): [CTA and closing]
- Duration: [Target seconds]
- Style: [UGC/Professional/Mixed]

For STATIC briefs, also include:
- Visual Concept: [What the viewer sees]
- Headline Approach: [The headline direction]
- Layout: [Composition notes]

For CAROUSEL briefs, also include:
- Slide 1: [Hook slide]
- Slides 2-4: [Content slides]
- Final Slide: [CTA slide]

### WHAT TO KILL
Which current creatives should be paused based on the analysis?

### FORMAT MIX
Recommended split between video, static, and carousel for this cycle.`;
}
