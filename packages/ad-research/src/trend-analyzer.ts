import type { AdLibraryAd } from "./meta-ad-library";

export interface TrendAnalysis {
  totalAdsAnalyzed: number;
  formatDistribution: Record<string, number>;
  topCTAs: Array<{ cta: string; count: number }>;
  topHookPatterns: Array<{ pattern: string; count: number; examples: string[] }>;
  publisherPlatformDistribution: Record<string, number>;
  averageAdAge: number; // days
  insights: string[]; // AI-generated insights (filled by AI package)
  actionItems: string[]; // AI-generated action items (filled by AI package)
}

/**
 * Analyze trends across a set of competitor ads.
 * This is the "Trend Radar" feature — surfaces dominating formats,
 * working CTAs, and patterns across up to 100 ads.
 */
export function analyzeTrends(ads: AdLibraryAd[]): Omit<TrendAnalysis, "insights" | "actionItems"> {
  const formatDistribution: Record<string, number> = {};
  const ctaCounts: Record<string, number> = {};
  const platformCounts: Record<string, number> = {};
  let totalAgeDays = 0;

  for (const ad of ads) {
    // Format detection
    if (ad.adCreativeVideoUrl) {
      formatDistribution["VIDEO"] = (formatDistribution["VIDEO"] ?? 0) + 1;
    } else if (ad.adCreativeImageUrl) {
      formatDistribution["IMAGE"] = (formatDistribution["IMAGE"] ?? 0) + 1;
    } else {
      formatDistribution["OTHER"] = (formatDistribution["OTHER"] ?? 0) + 1;
    }

    // CTA extraction from link titles
    if (ad.adCreativeLinkTitles) {
      for (const title of ad.adCreativeLinkTitles) {
        const normalized = title.trim().toLowerCase();
        ctaCounts[normalized] = (ctaCounts[normalized] ?? 0) + 1;
      }
    }

    // Platform distribution
    if (ad.publisherPlatforms) {
      for (const platform of ad.publisherPlatforms) {
        platformCounts[platform] = (platformCounts[platform] ?? 0) + 1;
      }
    }

    // Ad age
    const startDate = new Date(ad.adDeliveryStartTime);
    const now = new Date();
    const ageDays = Math.floor(
      (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    totalAgeDays += ageDays;
  }

  const topCTAs = Object.entries(ctaCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([cta, count]) => ({ cta, count }));

  return {
    totalAdsAnalyzed: ads.length,
    formatDistribution,
    topCTAs,
    topHookPatterns: [], // Will be filled by AI analysis
    publisherPlatformDistribution: platformCounts,
    averageAdAge: ads.length > 0 ? Math.round(totalAgeDays / ads.length) : 0,
  };
}
