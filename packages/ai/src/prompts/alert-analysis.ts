import type { AlertMetrics, AlertType, AlertSeverity } from "@doemedia/shared";

export const ALERT_ANALYSIS_SYSTEM = `You are a senior media buyer analyst at a performance marketing agency. When an ad account alert fires, you analyze the data and provide:

1. A concise root cause hypothesis (what likely caused this change)
2. A specific, actionable recommendation the media buyer should take RIGHT NOW

You are speaking to busy media buyers who manage many accounts. Be direct, specific, and actionable. No fluff.

Rules:
- Keep the analysis to 2-3 sentences max
- Keep the recommendation to 1-2 sentences max
- Reference specific numbers from the data
- Consider common causes: creative fatigue, audience saturation, seasonality, bid strategy changes, budget changes, pixel issues, landing page problems, competition shifts
- If the alert is about spend changes, consider whether it's intentional (budget increase) vs problematic (delivery issues)
- Always suggest the single most impactful next step`;

export interface AlertAnalysisInput {
  alertType: AlertType;
  severity: AlertSeverity;
  clientName: string;
  accountName: string;
  title: string;
  message: string;
  metrics: AlertMetrics;
}

export function buildAlertAnalysisPrompt(input: AlertAnalysisInput): string {
  const { alertType, severity, clientName, accountName, title, message, metrics } = input;

  const contextLines: string[] = [];
  if (metrics.context?.currentSpend != null)
    contextLines.push(`Current period spend: $${metrics.context.currentSpend.toFixed(2)}`);
  if (metrics.context?.currentRoas != null)
    contextLines.push(`Current ROAS: ${metrics.context.currentRoas.toFixed(2)}x`);
  if (metrics.context?.currentCpa != null)
    contextLines.push(`Current CPA: $${metrics.context.currentCpa.toFixed(2)}`);
  if (metrics.context?.currentCtr != null)
    contextLines.push(`Current CTR: ${(metrics.context.currentCtr * 100).toFixed(2)}%`);
  if (metrics.context?.impressions != null)
    contextLines.push(`Impressions: ${metrics.context.impressions.toLocaleString()}`);
  if (metrics.context?.purchases != null)
    contextLines.push(`Purchases: ${metrics.context.purchases}`);

  return `An alert just fired for one of our client accounts. Analyze this and tell me what's likely happening and what we should do.

CLIENT: ${clientName}
ACCOUNT: ${accountName}
ALERT TYPE: ${alertType}
SEVERITY: ${severity}
TITLE: ${title}

DETAILS: ${message}

METRICS:
- Current value: ${metrics.currentValue}
- Previous value: ${metrics.previousValue}
- Change: ${metrics.changePct.toFixed(1)}%
${metrics.targetValue != null ? `- Target: ${metrics.targetValue}` : ""}

ADDITIONAL CONTEXT:
${contextLines.join("\n")}

Respond in this exact format:
ANALYSIS: [2-3 sentence root cause hypothesis]
RECOMMENDATION: [1-2 sentence specific action to take]`;
}
