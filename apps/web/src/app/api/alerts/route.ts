import { NextRequest, NextResponse } from "next/server";
import { db, accountAlerts, alertPreferences, clients, metaAdAccounts } from "@doemedia/db";
import { eq, desc, and, sql, inArray } from "drizzle-orm";

/**
 * GET /api/alerts
 *
 * Returns all active alerts, optionally filtered by:
 * - clientId: filter to a specific client
 * - severity: filter by severity level
 * - status: filter by alert status (default: "active")
 * - limit: max results (default: 50)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");
    const severity = searchParams.get("severity");
    const status = searchParams.get("status") ?? "active";
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 200);

    const conditions = [];

    if (status !== "all") {
      conditions.push(eq(accountAlerts.status, status));
    }
    if (clientId) {
      conditions.push(eq(accountAlerts.clientId, clientId));
    }
    if (severity) {
      conditions.push(eq(accountAlerts.severity, severity));
    }

    const alerts = await db
      .select({
        id: accountAlerts.id,
        clientId: accountAlerts.clientId,
        clientName: clients.name,
        metaAccountId: accountAlerts.metaAccountId,
        accountName: metaAdAccounts.accountName,
        alertType: accountAlerts.alertType,
        severity: accountAlerts.severity,
        status: accountAlerts.status,
        title: accountAlerts.title,
        message: accountAlerts.message,
        currentValue: accountAlerts.currentValue,
        previousValue: accountAlerts.previousValue,
        changePct: accountAlerts.changePct,
        targetValue: accountAlerts.targetValue,
        aiAnalysis: accountAlerts.aiAnalysis,
        aiRecommendation: accountAlerts.aiRecommendation,
        notifiedVia: accountAlerts.notifiedVia,
        firedAt: accountAlerts.firedAt,
      })
      .from(accountAlerts)
      .innerJoin(clients, eq(clients.id, accountAlerts.clientId))
      .leftJoin(metaAdAccounts, eq(metaAdAccounts.id, accountAlerts.metaAccountId))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(accountAlerts.firedAt))
      .limit(limit);

    // Get summary counts by severity
    const [summary] = await db
      .select({
        total: sql<number>`COUNT(*)`,
        critical: sql<number>`COUNT(*) FILTER (WHERE ${accountAlerts.severity} = 'critical')`,
        high: sql<number>`COUNT(*) FILTER (WHERE ${accountAlerts.severity} = 'high')`,
        medium: sql<number>`COUNT(*) FILTER (WHERE ${accountAlerts.severity} = 'medium')`,
        low: sql<number>`COUNT(*) FILTER (WHERE ${accountAlerts.severity} = 'low')`,
      })
      .from(accountAlerts)
      .where(eq(accountAlerts.status, "active"));

    return NextResponse.json({
      alerts,
      summary: {
        total: Number(summary?.total ?? 0),
        critical: Number(summary?.critical ?? 0),
        high: Number(summary?.high ?? 0),
        medium: Number(summary?.medium ?? 0),
        low: Number(summary?.low ?? 0),
      },
    });
  } catch (error) {
    console.error("Failed to fetch alerts:", error);
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}

/**
 * PATCH /api/alerts
 *
 * Update alert status (acknowledge, resolve, dismiss).
 * Body: { alertIds: string[], status: "acknowledged" | "resolved" | "dismissed", note?: string }
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { alertIds, status, note } = body as {
      alertIds: string[];
      status: string;
      note?: string;
    };

    if (!alertIds?.length || !status) {
      return NextResponse.json({ error: "alertIds and status required" }, { status: 400 });
    }

    const validStatuses = ["acknowledged", "resolved", "dismissed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Use: ${validStatuses.join(", ")}` }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {
      status,
      updatedAt: new Date(),
    };

    if (status === "resolved") {
      updateData.resolvedAt = new Date();
      if (note) updateData.resolutionNote = note;
    }

    await db
      .update(accountAlerts)
      .set(updateData)
      .where(inArray(accountAlerts.id, alertIds));

    return NextResponse.json({ updated: alertIds.length });
  } catch (error) {
    console.error("Failed to update alerts:", error);
    return NextResponse.json({ error: "Failed to update alerts" }, { status: 500 });
  }
}
