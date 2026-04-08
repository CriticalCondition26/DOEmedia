import { eq, desc, sql, and, gte } from "drizzle-orm";
import type { Database } from "../client";
import { adInsightsDaily, metaAdAccounts, ads, creatives } from "../schema";

/** Get top performing ads by ROAS for a client's accounts */
export async function getTopAdsByRoas(
  db: Database,
  accountIds: string[],
  days: number = 14,
  limit: number = 10
) {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);
  const sinceDateStr = sinceDate.toISOString().split("T")[0];

  return db
    .select({
      metaAdId: adInsightsDaily.metaAdId,
      totalSpend: sql<number>`SUM(CAST(${adInsightsDaily.spend} AS DECIMAL))`,
      totalImpressions: sql<number>`SUM(${adInsightsDaily.impressions})`,
      totalClicks: sql<number>`SUM(${adInsightsDaily.clicks})`,
      totalPurchases: sql<number>`SUM(${adInsightsDaily.purchases})`,
      totalRevenue: sql<number>`SUM(CAST(${adInsightsDaily.purchaseValue} AS DECIMAL))`,
      avgRoas: sql<number>`CASE WHEN SUM(CAST(${adInsightsDaily.spend} AS DECIMAL)) > 0 THEN SUM(CAST(${adInsightsDaily.purchaseValue} AS DECIMAL)) / SUM(CAST(${adInsightsDaily.spend} AS DECIMAL)) ELSE 0 END`,
      avgCtr: sql<number>`CASE WHEN SUM(${adInsightsDaily.impressions}) > 0 THEN CAST(SUM(${adInsightsDaily.clicks}) AS DECIMAL) / SUM(${adInsightsDaily.impressions}) ELSE 0 END`,
    })
    .from(adInsightsDaily)
    .where(
      sql`${adInsightsDaily.metaAccountId} = ANY(${accountIds}) AND ${adInsightsDaily.date} >= ${sinceDateStr}`
    )
    .groupBy(adInsightsDaily.metaAdId)
    .having(sql`SUM(CAST(${adInsightsDaily.spend} AS DECIMAL)) > 10`) // Min spend threshold
    .orderBy(desc(sql`avgRoas`))
    .limit(limit);
}

/** Get bottom performing ads by ROAS for a client's accounts */
export async function getBottomAdsByRoas(
  db: Database,
  accountIds: string[],
  days: number = 14,
  limit: number = 10
) {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);
  const sinceDateStr = sinceDate.toISOString().split("T")[0];

  return db
    .select({
      metaAdId: adInsightsDaily.metaAdId,
      totalSpend: sql<number>`SUM(CAST(${adInsightsDaily.spend} AS DECIMAL))`,
      totalPurchases: sql<number>`SUM(${adInsightsDaily.purchases})`,
      totalRevenue: sql<number>`SUM(CAST(${adInsightsDaily.purchaseValue} AS DECIMAL))`,
      avgRoas: sql<number>`CASE WHEN SUM(CAST(${adInsightsDaily.spend} AS DECIMAL)) > 0 THEN SUM(CAST(${adInsightsDaily.purchaseValue} AS DECIMAL)) / SUM(CAST(${adInsightsDaily.spend} AS DECIMAL)) ELSE 0 END`,
      avgCtr: sql<number>`CASE WHEN SUM(${adInsightsDaily.impressions}) > 0 THEN CAST(SUM(${adInsightsDaily.clicks}) AS DECIMAL) / SUM(${adInsightsDaily.impressions}) ELSE 0 END`,
    })
    .from(adInsightsDaily)
    .where(
      sql`${adInsightsDaily.metaAccountId} = ANY(${accountIds}) AND ${adInsightsDaily.date} >= ${sinceDateStr}`
    )
    .groupBy(adInsightsDaily.metaAdId)
    .having(sql`SUM(CAST(${adInsightsDaily.spend} AS DECIMAL)) > 10`)
    .orderBy(sql`avgRoas`)
    .limit(limit);
}

/** Get format breakdown for a client's accounts */
export async function getFormatBreakdown(
  db: Database,
  accountIds: string[],
  days: number = 14
) {
  // This would join with the creatives table to get format info
  // For now, return from the ads table
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);
  const sinceDateStr = sinceDate.toISOString().split("T")[0];

  return db
    .select({
      metaAdId: adInsightsDaily.metaAdId,
      totalSpend: sql<number>`SUM(CAST(${adInsightsDaily.spend} AS DECIMAL))`,
      totalRevenue: sql<number>`SUM(CAST(${adInsightsDaily.purchaseValue} AS DECIMAL))`,
    })
    .from(adInsightsDaily)
    .where(
      sql`${adInsightsDaily.metaAccountId} = ANY(${accountIds}) AND ${adInsightsDaily.date} >= ${sinceDateStr}`
    )
    .groupBy(adInsightsDaily.metaAdId);
}
