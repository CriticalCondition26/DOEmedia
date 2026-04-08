import { NextResponse } from "next/server";
import { db, pipelineItems, creativeBriefs, clients } from "@doemedia/db";
import { eq, desc, sql } from "drizzle-orm";

export async function GET() {
  try {
    const items = await db
      .select({
        id: pipelineItems.id,
        clientId: pipelineItems.clientId,
        clientName: clients.name,
        briefId: pipelineItems.briefId,
        type: pipelineItems.type,
        status: pipelineItems.status,
        assignedTo: pipelineItems.assignedTo,
        dueDate: pipelineItems.dueDate,
        notes: pipelineItems.notes,
        createdAt: pipelineItems.createdAt,
      })
      .from(pipelineItems)
      .leftJoin(clients, eq(pipelineItems.clientId, clients.id))
      .orderBy(desc(pipelineItems.createdAt));

    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch pipeline items:", error);
    return NextResponse.json({ error: "Failed to fetch pipeline items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, briefId, type, assignedTo, dueDate, notes } = body;

    if (!clientId || !type) {
      return NextResponse.json(
        { error: "clientId and type are required" },
        { status: 400 }
      );
    }

    const [item] = await db
      .insert(pipelineItems)
      .values({
        clientId,
        briefId: briefId ?? null,
        type,
        status: "queued",
        assignedTo: assignedTo ?? null,
        dueDate: dueDate ?? null,
        notes: notes ?? null,
      })
      .returning();

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Failed to create pipeline item:", error);
    return NextResponse.json({ error: "Failed to create pipeline item" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, assignedTo, notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ["queued", "in_progress", "review", "approved", "live", "done"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const [updated] = await db
      .update(pipelineItems)
      .set({
        status,
        assignedTo: assignedTo !== undefined ? assignedTo : undefined,
        notes: notes !== undefined ? notes : undefined,
        updatedAt: new Date(),
      })
      .where(eq(pipelineItems.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update pipeline item:", error);
    return NextResponse.json({ error: "Failed to update pipeline item" }, { status: 400 });
  }
}
