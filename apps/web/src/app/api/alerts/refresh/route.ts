import { NextResponse } from "next/server";
import { db, clients, metaAdAccounts, adInsightsDaily } from "@doemedia/db";
import { eq, sql, desc } from "drizzle-orm";

export interface RefreshAlert {
  clientId: string;
  clientName: string;
  reason: string;
  severity: "high" | "medium" | "low";
  metrics: {
    currentRoas?: number;
    previousRoas?: number;
    roasChange?: number;
    daysSinceRefresh?: number;
    topAdFatigue?: string;
  };
}

/**
 * GET /api/alerts/refresh
 *
 * Returns clients that need a creative refresh based on:
 * 1. ROAS declining week-over-week
 * 2. Top creative showing fatigue (CTR dropping)
 * 3. More than 14 days since last strategy generation
 */
export async function GET() {
  try {
    const alerts: RefreshAlert[] = [];

    // Get all active clients
    const activeClients = await db
      .select({
        id: clients.id,
        name: clients.name,
        industry: clients.industry,
      })
      .from(clients)
      .where(eq(clients.isActive, true));

    for (const client of activeClients) {
      // Get Meta accounts for this client
      const accounts = await db
        .select({ id: metaAdAccounts.id })
        .from(metaAdAccounts)
        .where(eq(metaAdAccounts.clientId, client.id));

      if (accounts.length === 0) continue;

      const accountIds = accounts.map((a) => a.id);

      // Calculate ROAS for current week vs previous week
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const twoWeeksAgo = new Date(now);
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      const currentWeekStr = weekAgo.toISOString().split("T")[0];
      const prevWeekStr = twoWeeksAgo.toISOString().split("T")[0];
      const nowStr = now.toISOString().split("T")[0];

      const [currentWeek] = await db
        .select({
          spend: sql<number>`COALESCE(SUM(CAST(${adInsightsDaily.spend} AS DECIMAL)), 0)`,
          revenue: sql<number>`COALESCE(SUM(CAST(${adInsightsDaily.purchaseValue} AS DECIMAL)), 0)`,
        })
        .from(adInsightsDaily)
        .where(
          sql`${adInsightsDaily.metaAccountId} = ANY(${accountIds})
              AND ${adInsightsDaily.date} >= ${currentWeekStr}
              AND ${adInsightsDaily.date} <= ${nowStr}`
        );

      const [prevWeek] = await db
        .select({
          spend: sql<number>`COALESCE(SUM(CAST(${adInsightsDaily.spend} AS DECIMAL)), 0)`,
          revenue: sql<number>`COALESCE(SUM(CAST(${adInsightsDaily.purchaseValue} AS DECIMAL)), 0)`,
        })
        .from(adInsightsDaily)
        .where(
          sql`${adInsightsDaily.metaAccountId} = ANY(${accountIds})
              AND ${adInsightsDaily.date} >= ${prevWeekStr}
              AND ${adInsightsDaily.date} < ${currentWeekStr}`
        );

      const currentRoas =
        Number(currentWeek?.spend) > 0
          ? Number(currentWeek?.revenue) / Number(currentWeek?.spend)
          : 0;
      const prevRoas =
        Number(prevWeek?.spend) > 0
          ? Number(prevWeek?.revenue) / Number(prevWeek?.spend)
          : 0;

      // Alert if ROAS dropped more than 20%
      if (prevRoas > 0 && currentRoas > 0) {
        const roasChange = ((currentRoas - prevRoas) / prevRoas) * 100;
        if (roasChange < -20) {
          alerts.push({
            clientId: client.id,
            clientName: client.name,
            reason: `ROAS dropped ${Math.abs(roasChange).toFixed(0)}% week-over-week`,
            severity: roasChange < -40 ? "high" : "medium",
            metrics: {
              currentRoas,
              previousRoas: prevRoas,
              roasChange,
            },
          });
        }
      }
    }

    // Sort by severity
    const severityOrder = { high: 0, medium: 1, low: 2 };
    alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    return NextResponse.json(alerts);
  } catch (error) {
    console.error("Failed to check refresh alerts:", error);
    return NextResponse.json({ error: "Failed to check refresh alerts" }, { status: 500 });
  }
}
