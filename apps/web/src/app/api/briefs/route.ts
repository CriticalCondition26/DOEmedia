import { NextResponse } from "next/server";
import { db, creativeBriefs, adCopyVariants, clients } from "@doemedia/db";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");
    const status = searchParams.get("status");

    let query = db
      .select({
        id: creativeBriefs.id,
        clientId: creativeBriefs.clientId,
        clientName: clients.name,
        strategyId: creativeBriefs.strategyId,
        title: creativeBriefs.title,
        objective: creativeBriefs.objective,
        format: creativeBriefs.format,
        hook: creativeBriefs.hook,
        angle: creativeBriefs.angle,
        targetAudience: creativeBriefs.targetAudience,
        keyMessage: creativeBriefs.keyMessage,
        visualDirection: creativeBriefs.visualDirection,
        scriptStructure: creativeBriefs.scriptStructure,
        duration: creativeBriefs.duration,
        status: creativeBriefs.status,
        assignedTo: creativeBriefs.assignedTo,
        dueDate: creativeBriefs.dueDate,
        priority: creativeBriefs.priority,
        createdAt: creativeBriefs.createdAt,
      })
      .from(creativeBriefs)
      .leftJoin(clients, eq(creativeBriefs.clientId, clients.id))
      .orderBy(desc(creativeBriefs.createdAt))
      .$dynamic();

    if (clientId) {
      query = query.where(eq(creativeBriefs.clientId, clientId));
    }

    const briefs = await query;
    return NextResponse.json(briefs);
  } catch (error) {
    console.error("Failed to fetch briefs:", error);
    return NextResponse.json({ error: "Failed to fetch briefs" }, { status: 500 });
  }
}

/** Update brief status — the core approval workflow */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, assignedTo, dueDate } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const validStatuses = [
      "draft",
      "pending_review",
      "approved",
      "in_production",
      "review",
      "completed",
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (status !== undefined) updateData.status = status;
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (dueDate !== undefined) updateData.dueDate = dueDate;

    const [updated] = await db
      .update(creativeBriefs)
      .set(updateData)
      .where(eq(creativeBriefs.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update brief:", error);
    return NextResponse.json({ error: "Failed to update brief" }, { status: 400 });
  }
}
