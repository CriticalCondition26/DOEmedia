import { NextResponse } from "next/server";
import { db, users } from "@doemedia/db";

export async function GET() {
  try {
    const allUsers = await db.select().from(users).orderBy(users.name);
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, role } = body;

    if (!email || !name || !role) {
      return NextResponse.json(
        { error: "email, name, and role are required" },
        { status: 400 }
      );
    }

    const validRoles = ["admin", "media_buyer", "strategist", "designer", "account_manager", "ad_loader"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: `role must be one of: ${validRoles.join(", ")}` },
        { status: 400 }
      );
    }

    const [newUser] = await db
      .insert(users)
      .values({ email, name, role })
      .returning();

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 400 });
  }
}
