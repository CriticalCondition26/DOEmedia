import type { Job } from "bullmq";
import { db } from "@doemedia/db";
import { accountAlerts } from "@doemedia/db";
import { eq, isNull, and } from "drizzle-orm";
import { generateAnalysis } from "@doemedia/ai";
import {
  buildAlertAnalysisPrompt,
  ALERT_ANALYSIS_SYSTEM,
  type AlertAnalysisInput,
} from "@doemedia/ai";
import type { AlertType, AlertSeverity, AlertMetrics } from "@doemedia/shared";

/**
 * Enrich fired alerts with AI analysis.
 * Picks up alerts that don't have AI analysis yet and runs them through Claude.
 * This runs as a separate job so alert firing is never blocked by AI latency.
 */
export async function enrichAlertsWithAI(job: Job) {
  console.log("Enriching alerts with AI analysis...");

  // Find alerts without AI analysis (limit batch size to control costs)
  const unenrichedAlerts = await db
    .select()
    .from(accountAlerts)
    .where(
      and(
        eq(accountAlerts.status, "active"),
        isNull(accountAlerts.aiAnalysis)
      )
    )
    .limit(20);

  if (unenrichedAlerts.length === 0) {
    console.log("No alerts to enrich.");
    return { enriched: 0 };
  }

  console.log(`Found ${unenrichedAlerts.length} alerts to analyze...`);

  let enriched = 0;

  for (const alert of unenrichedAlerts) {
    try {
      const input: AlertAnalysisInput = {
        alertType: alert.alertType as AlertType,
        severity: alert.severity as AlertSeverity,
        clientName: "", // Will be filled from the alert context
        accountName: "",
        title: alert.title,
        message: alert.message,
        metrics: {
          currentValue: Number(alert.currentValue ?? 0),
          previousValue: Number(alert.previousValue ?? 0),
          changePct: Number(alert.changePct ?? 0),
          targetValue: alert.targetValue ? Number(alert.targetValue) : undefined,
          context: (alert.metricsSnapshot as AlertMetrics["context"]) ?? undefined,
        },
      };

      const prompt = buildAlertAnalysisPrompt(input);
      const response = await generateAnalysis(prompt, ALERT_ANALYSIS_SYSTEM);

      // Parse the structured response
      const analysisMatch = response.match(/ANALYSIS:\s*([\s\S]*?)(?=RECOMMENDATION:|$)/);
      const recommendationMatch = response.match(/RECOMMENDATION:\s*([\s\S]*?)$/);

      const analysis = analysisMatch?.[1]?.trim() ?? response;
      const recommendation = recommendationMatch?.[1]?.trim() ?? "";

      await db
        .update(accountAlerts)
        .set({
          aiAnalysis: analysis,
          aiRecommendation: recommendation,
          updatedAt: new Date(),
        })
        .where(eq(accountAlerts.id, alert.id));

      enriched++;
    } catch (error) {
      console.error(`Failed to enrich alert ${alert.id}:`, error);
      // Don't throw — continue with remaining alerts
    }
  }

  console.log(`Enriched ${enriched}/${unenrichedAlerts.length} alerts with AI analysis.`);
  return { enriched, total: unenrichedAlerts.length };
}
