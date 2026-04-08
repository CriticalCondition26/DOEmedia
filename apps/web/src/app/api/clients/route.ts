import { NextResponse } from "next/server";
import { db, clients } from "@doemedia/db";
import { eq } from "drizzle-orm";
import { createClientSchema } from "@doemedia/shared";

export async function GET() {
  try {
    const allClients = await db.select().from(clients).orderBy(clients.name);
    return NextResponse.json(allClients);
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createClientSchema.parse(body);

    const [newClient] = await db
      .insert(clients)
      .values({
        name: parsed.name,
        shopifyDomain: parsed.shopifyDomain,
        industry: parsed.industry,
        monthlySpend: parsed.monthlySpend?.toString(),
        notes: parsed.notes,
      })
      .returning();

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error("Failed to create client:", error);
    return NextResponse.json(
      { error: "Failed to create client" },
      { status: 400 }
    );
  }
}
