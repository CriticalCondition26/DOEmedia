import { NextResponse } from "next/server";
import { db, pods, users, clients } from "@doemedia/db";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allPods = await db.select().from(pods).orderBy(pods.name);

    // Enrich with member and client info
    const enriched = await Promise.all(
      allPods.map(async (pod) => {
        const members = await Promise.all(
          [
            pod.mediaBuyerId ? db.select().from(users).where(eq(users.id, pod.mediaBuyerId)).then(r => r[0]) : null,
            pod.strategistId ? db.select().from(users).where(eq(users.id, pod.strategistId)).then(r => r[0]) : null,
            pod.designerId ? db.select().from(users).where(eq(users.id, pod.designerId)).then(r => r[0]) : null,
            pod.amId ? db.select().from(users).where(eq(users.id, pod.amId)).then(r => r[0]) : null,
            pod.adLoaderId ? db.select().from(users).where(eq(users.id, pod.adLoaderId)).then(r => r[0]) : null,
          ]
        );

        const podClients = await db
          .select({ id: clients.id, name: clients.name, industry: clients.industry })
          .from(clients)
          .where(eq(clients.podId, pod.id));

        return {
          ...pod,
          members: {
            mediaBuyer: members[0] ?? null,
            strategist: members[1] ?? null,
            designer: members[2] ?? null,
            accountManager: members[3] ?? null,
            adLoader: members[4] ?? null,
          },
          clients: podClients,
          clientCount: podClients.length,
        };
      })
    );

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Failed to fetch pods:", error);
    return NextResponse.json({ error: "Failed to fetch pods" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, mediaBuyerId, strategistId, designerId, amId, adLoaderId } = body;

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const [newPod] = await db
      .insert(pods)
      .values({
        name,
        mediaBuyerId: mediaBuyerId ?? null,
        strategistId: strategistId ?? null,
        designerId: designerId ?? null,
        amId: amId ?? null,
        adLoaderId: adLoaderId ?? null,
      })
      .returning();

    return NextResponse.json(newPod, { status: 201 });
  } catch (error) {
    console.error("Failed to create pod:", error);
    return NextResponse.json({ error: "Failed to create pod" }, { status: 400 });
  }
}
