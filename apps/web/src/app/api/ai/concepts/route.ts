import { NextResponse } from "next/server";
import { generateVisualConcept } from "@doemedia/ai";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { briefDescription, brandAesthetic, winningStyles } = body;

    if (!briefDescription) {
      return NextResponse.json(
        { error: "briefDescription is required" },
        { status: 400 }
      );
    }

    const result = await generateVisualConcept(
      briefDescription,
      brandAesthetic ?? "",
      winningStyles ?? []
    );

    return NextResponse.json({ concept: result });
  } catch (error) {
    console.error("Visual concept generation failed:", error);
    return NextResponse.json(
      { error: "Visual concept generation failed", details: String(error) },
      { status: 500 }
    );
  }
}
