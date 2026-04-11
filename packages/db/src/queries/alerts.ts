import { eq, desc, and, gte, sql } from "drizzle-orm";
import type { Database } from "../client";
import { accountAlerts, alertPreferences } from "../schema";

/** Get active alerts for a client */
export async function getClientAlerts(
  db: Database,
  clientId: string,
  limit: number = 20
) {
  return db
    .select()
    .from(accountAlerts)
    .where(
      and(eq(accountAlerts.clientId, clientId), eq(accountAlerts.status, "active"))
    )
    .orderBy(desc(accountAlerts.firedAt))
    .limit(limit);
}

/** Get alert count by severity for a client */
export async function getClientAlertSummary(db: Database, clientId: string) {
  const [result] = await db
    .select({
      total: sql<number>`COUNT(*)`,
      critical: sql<number>`COUNT(*) FILTER (WHERE ${accountAlerts.severity} = 'critical')`,
      high: sql<number>`COUNT(*) FILTER (WHERE ${accountAlerts.severity} = 'high')`,
      medium: sql<number>`COUNT(*) FILTER (WHERE ${accountAlerts.severity} = 'medium')`,
      low: sql<number>`COUNT(*) FILTER (WHERE ${accountAlerts.severity} = 'low')`,
    })
    .from(accountAlerts)
    .where(
      and(eq(accountAlerts.clientId, clientId), eq(accountAlerts.status, "active"))
    );

  return {
    total: Number(result?.total ?? 0),
    critical: Number(result?.critical ?? 0),
    high: Number(result?.high ?? 0),
    medium: Number(result?.medium ?? 0),
    low: Number(result?.low ?? 0),
  };
}

/** Get alert preferences for a client */
export async function getClientAlertPreferences(db: Database, clientId: string) {
  const [prefs] = await db
    .select()
    .from(alertPreferences)
    .where(eq(alertPreferences.clientId, clientId))
    .limit(1);
  return prefs ?? null;
}
