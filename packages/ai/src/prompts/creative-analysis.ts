import { AI_MODELS } from "@doemedia/shared";

export interface PerformanceDataInput {
  clientName: string;
  industry: string;
  brandVoice: string;
  dateRange: { start: string; end: string };
  topAds: Array<{
    name: string;
    format: string;
    spend: number;
    roas: number;
    ctr: number;
    cpa: number;
    primaryText?: string;
    headline?: string;
  }>;
  bottomAds: Array<{
    name: string;
    format: string;
    spend: number;
    roas: number;
    ctr: number;
    cpa: number;
    primaryText?: string;
    headline?: string;
  }>;
  overallMetrics: {
    totalSpend: number;
    avgRoas: number;
    avgCtr: number;
    avgCpa: number;
    totalPurchases: number;
    totalRevenue: number;
  };
  formatBreakdown: Array<{
    format: string;
    adCount: number;
    spend: number;
    avgRoas: number;
  }>;
}

export const CREATIVE_ANALYSIS_SYSTEM = `You are a senior Meta ads creative analyst for a performance marketing agency specializing in high-revenue e-commerce Shopify brands.

Your role is to analyze ad creative performance data and identify actionable patterns that drive ROAS. You think in terms of:
- Hook effectiveness (what stops the scroll)
- Creative angles (problem/solution, social proof, UGC, lifestyle, etc.)
- Format performance (static vs video vs carousel)
- Creative fatigue signals
- Copy patterns that convert

You are direct, data-driven, and focused on what will actually move the needle for the next creative cycle. No fluff.`;

export function buildCreativeAnalysisPrompt(input: PerformanceDataInput): string {
  const topAdsTable = input.topAds
    .map(
      (ad, i) =>
        `${i + 1}. "${ad.name}" [${ad.format}] — Spend: $${ad.spend.toFixed(0)}, ROAS: ${ad.roas.toFixed(2)}x, CTR: ${(ad.ctr * 100).toFixed(2)}%, CPA: $${ad.cpa.toFixed(2)}${ad.primaryText ? `\n   Copy: "${ad.primaryText.slice(0, 120)}..."` : ""}`
    )
    .join("\n");

  const bottomAdsTable = input.bottomAds
    .map(
      (ad, i) =>
        `${i + 1}. "${ad.name}" [${ad.format}] — Spend: $${ad.spend.toFixed(0)}, ROAS: ${ad.roas.toFixed(2)}x, CTR: ${(ad.ctr * 100).toFixed(2)}%, CPA: $${ad.cpa.toFixed(2)}${ad.primaryText ? `\n   Copy: "${ad.primaryText.slice(0, 120)}..."` : ""}`
    )
    .join("\n");

  const formatTable = input.formatBreakdown
    .map(
      (f) =>
        `- ${f.format}: ${f.adCount} ads, $${f.spend.toFixed(0)} spend, ${f.avgRoas.toFixed(2)}x avg ROAS`
    )
    .join("\n");

  return `Analyze the creative performance for **${input.clientName}** (${input.industry}) over the period ${input.dateRange.start} to ${input.dateRange.end}.

## Overall Account Metrics
- Total Spend: $${input.overallMetrics.totalSpend.toFixed(0)}
- Average ROAS: ${input.overallMetrics.avgRoas.toFixed(2)}x
- Average CTR: ${(input.overallMetrics.avgCtr * 100).toFixed(2)}%
- Average CPA: $${input.overallMetrics.avgCpa.toFixed(2)}
- Total Purchases: ${input.overallMetrics.totalPurchases}
- Total Revenue: $${input.overallMetrics.totalRevenue.toFixed(0)}

## Format Breakdown
${formatTable}

## Top Performing Ads (by ROAS)
${topAdsTable}

## Bottom Performing Ads (by ROAS)
${bottomAdsTable}

## Brand Context
- Brand Voice: ${input.brandVoice || "Not specified"}

---

Provide your analysis in the following structure:

### 1. WINNING PATTERNS
Identify the top 3 creative patterns that are driving results. For each pattern, specify:
- The combination of format + hook style + angle that's working
- Why it's working (your hypothesis)
- Specific examples from the top performers

### 2. LOSING PATTERNS
Identify the top 3 patterns to STOP doing. What's wasting spend?

### 3. FATIGUE ALERTS
Which creatives show signs of fatigue? (Declining CTR/ROAS, high frequency)

### 4. FORMAT GAPS
What formats are under-tested? Where are the opportunities?

### 5. COPY INSIGHTS
What copy patterns appear in winners vs losers? (Hook types, length, tone)

### 6. RECOMMENDATIONS
Specific, actionable recommendations for the next creative cycle. What 6-8 new creatives should be made? Specify format, hook concept, and angle for each.`;
}
