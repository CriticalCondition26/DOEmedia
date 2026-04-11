import { NextRequest, NextResponse } from "next/server";
import { db, alertPreferences } from "@doemedia/db";
import { eq } from "drizzle-orm";

/**
 * GET /api/alerts/preferences?clientId=xxx
 *
 * Get alert preferences for a client.
 */
export async function GET(request: NextRequest) {
  try {
    const clientId = new URL(request.url).searchParams.get("clientId");
    if (!clientId) {
      return NextResponse.json({ error: "clientId required" }, { status: 400 });
    }

    const [prefs] = await db
      .select()
      .from(alertPreferences)
      .where(eq(alertPreferences.clientId, clientId))
      .limit(1);

    return NextResponse.json(prefs ?? null);
  } catch (error) {
    console.error("Failed to fetch alert preferences:", error);
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}

/**
 * PUT /api/alerts/preferences
 *
 * Create or update alert preferences for a client.
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { clientId, ...prefs } = body;

    if (!clientId) {
      return NextResponse.json({ error: "clientId required" }, { status: 400 });
    }

    const [existing] = await db
      .select({ id: alertPreferences.id })
      .from(alertPreferences)
      .where(eq(alertPreferences.clientId, clientId))
      .limit(1);

    if (existing) {
      const [updated] = await db
        .update(alertPreferences)
        .set({ ...prefs, updatedAt: new Date() })
        .where(eq(alertPreferences.clientId, clientId))
        .returning();
      return NextResponse.json(updated);
    } else {
      const [created] = await db
        .insert(alertPreferences)
        .values({ clientId, ...prefs })
        .returning();
      return NextResponse.json(created, { status: 201 });
    }
  } catch (error) {
    console.error("Failed to update alert preferences:", error);
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}
