import { NextResponse } from "next/server";
import { db, creativeBriefs, adCopyVariants, clients, visualConcepts } from "@doemedia/db";
import { eq } from "drizzle-orm";

/**
 * GET /api/export/handoff?clientId=xxx
 *
 * Export approved creatives packaged for ad loader handoff to Meta.
 * Returns briefs with their approved copy and visual direction in a
 * structured format ready for ad loading.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json(
        { error: "clientId is required" },
        { status: 400 }
      );
    }

    // Get client info
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, clientId))
      .limit(1);

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Get approved briefs
    const approvedBriefs = await db
      .select()
      .from(creativeBriefs)
      .where(eq(creativeBriefs.clientId, clientId));

    // For each brief, get approved copy variants and visual concepts
    const handoffPackage = await Promise.all(
      approvedBriefs.map(async (brief) => {
        const copyVariants = await db
          .select()
          .from(adCopyVariants)
          .where(eq(adCopyVariants.briefId, brief.id));

        const concepts = await db
          .select()
          .from(visualConcepts)
          .where(eq(visualConcepts.briefId, brief.id));

        return {
          brief: {
            id: brief.id,
            title: brief.title,
            format: brief.format,
            hook: brief.hook,
            angle: brief.angle,
            keyMessage: brief.keyMessage,
            objective: brief.objective,
            status: brief.status,
            scriptStructure: brief.scriptStructure,
          },
          approvedCopy: copyVariants
            .filter((v) => v.status === "approved")
            .map((v) => ({
              primaryText: v.primaryText,
              headline: v.headline,
              description: v.description,
              callToAction: v.callToAction,
              hookType: v.hookType,
            })),
          allCopy: copyVariants.map((v) => ({
            id: v.id,
            primaryText: v.primaryText,
            headline: v.headline,
            description: v.description,
            callToAction: v.callToAction,
            hookType: v.hookType,
            status: v.status,
          })),
          visualConcepts: concepts.map((c) => ({
            conceptName: c.conceptName,
            description: c.description,
            mood: c.mood,
            colorPalette: c.colorPalette,
            aiImagePrompt: c.aiImagePrompt,
          })),
        };
      })
    );

    return NextResponse.json({
      client: {
        id: client.id,
        name: client.name,
        industry: client.industry,
      },
      exportedAt: new Date().toISOString(),
      totalBriefs: handoffPackage.length,
      handoff: handoffPackage,
    });
  } catch (error) {
    console.error("Failed to export handoff:", error);
    return NextResponse.json(
      { error: "Failed to export handoff" },
      { status: 500 }
    );
  }
}
