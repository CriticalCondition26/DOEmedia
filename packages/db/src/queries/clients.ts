import { eq, desc, sql } from "drizzle-orm";
import type { Database } from "../client";
import { clients, metaAdAccounts, pods, adInsightsDaily } from "../schema";

/** Get all active clients with their pod and last sync info */
export async function getClientsWithPods(db: Database) {
  return db
    .select({
      id: clients.id,
      name: clients.name,
      industry: clients.industry,
      monthlySpend: clients.monthlySpend,
      status: clients.status,
      shopifyDomain: clients.shopifyDomain,
      brandVoice: clients.brandVoice,
      podId: clients.podId,
      createdAt: clients.createdAt,
    })
    .from(clients)
    .where(eq(clients.isActive, true))
    .orderBy(clients.name);
}

/** Get a single client by ID */
export async function getClientById(db: Database, clientId: string) {
  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.id, clientId))
    .limit(1);
  return client ?? null;
}

/** Get Meta ad accounts for a client */
export async function getClientMetaAccounts(db: Database, clientId: string) {
  return db
    .select()
    .from(metaAdAccounts)
    .where(eq(metaAdAccounts.clientId, clientId))
    .orderBy(desc(metaAdAccounts.lastSyncedAt));
}

/** Get performance summary for a client (last N days) */
export async function getClientPerformanceSummary(
  db: Database,
  clientId: string,
  days: number = 7
) {
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);
  const sinceDateStr = sinceDate.toISOString().split("T")[0];

  // Get account IDs for this client
  const accounts = await db
    .select({ id: metaAdAccounts.id })
    .from(metaAdAccounts)
    .where(eq(metaAdAccounts.clientId, clientId));

  if (accounts.length === 0) return null;

  const accountIds = accounts.map((a) => a.id);

  const result = await db
    .select({
      totalSpend: sql<number>`COALESCE(SUM(CAST(${adInsightsDaily.spend} AS DECIMAL)), 0)`,
      totalImpressions: sql<number>`COALESCE(SUM(${adInsightsDaily.impressions}), 0)`,
      totalClicks: sql<number>`COALESCE(SUM(${adInsightsDaily.clicks}), 0)`,
      totalPurchases: sql<number>`COALESCE(SUM(${adInsightsDaily.purchases}), 0)`,
      totalRevenue: sql<number>`COALESCE(SUM(CAST(${adInsightsDaily.purchaseValue} AS DECIMAL)), 0)`,
    })
    .from(adInsightsDaily)
    .where(
      sql`${adInsightsDaily.metaAccountId} = ANY(${accountIds}) AND ${adInsightsDaily.date} >= ${sinceDateStr}`
    );

  const r = result[0];
  if (!r) return null;

  const totalSpend = Number(r.totalSpend);
  const totalRevenue = Number(r.totalRevenue);
  const totalImpressions = Number(r.totalImpressions);
  const totalClicks = Number(r.totalClicks);
  const totalPurchases = Number(r.totalPurchases);

  return {
    totalSpend,
    totalImpressions,
    totalClicks,
    totalPurchases,
    totalRevenue,
    roas: totalSpend > 0 ? totalRevenue / totalSpend : 0,
    ctr: totalImpressions > 0 ? totalClicks / totalImpressions : 0,
    cpa: totalPurchases > 0 ? totalSpend / totalPurchases : 0,
    cpm: totalImpressions > 0 ? (totalSpend / totalImpressions) * 1000 : 0,
  };
}
