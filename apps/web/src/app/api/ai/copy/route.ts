import { NextResponse } from "next/server";
import { generateCopyForBrief, type CopyGenerationInput } from "@doemedia/ai";
import { COPY_VARIANTS_PER_BRIEF } from "@doemedia/shared";

export const maxDuration = 120; // 2 minutes for copy generation

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientName,
      industry,
      brandVoice,
      targetAudience,
      productDescription,
      format,
      hook,
      angle,
      keyMessage,
      objective,
      numVariants,
    } = body;

    if (!clientName || !hook || !angle) {
      return NextResponse.json(
        { error: "clientName, hook, and angle are required" },
        { status: 400 }
      );
    }

    const input: CopyGenerationInput = {
      clientName,
      industry: industry ?? "",
      brandVoice: brandVoice ?? "",
      targetAudience: targetAudience ?? "",
      productDescription: productDescription ?? "",
      briefContext: {
        format: format ?? "IMAGE",
        hook,
        angle,
        keyMessage: keyMessage ?? "",
        objective: objective ?? "Drive purchases",
      },
      numVariants: numVariants ?? COPY_VARIANTS_PER_BRIEF,
    };

    const result = await generateCopyForBrief(input);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Copy generation failed:", error);
    return NextResponse.json(
      { error: "Copy generation failed", details: String(error) },
      { status: 500 }
    );
  }
}
