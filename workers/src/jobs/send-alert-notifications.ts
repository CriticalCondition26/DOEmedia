import type { Job } from "bullmq";
import { db } from "@doemedia/db";
import { accountAlerts, alertPreferences, clients } from "@doemedia/db";
import { eq, isNull, and } from "drizzle-orm";
import type { AlertSeverity, NotificationChannel } from "@doemedia/shared";

// ---------------------------------------------------------------------------
// Main Job
// ---------------------------------------------------------------------------

/**
 * Send notifications for alerts that haven't been notified yet.
 * Checks each alert's client preferences and dispatches to the right channels.
 */
export async function sendAlertNotifications(job: Job) {
  console.log("Sending alert notifications...");

  const unnotifiedAlerts = await db
    .select({
      alert: accountAlerts,
      clientName: clients.name,
    })
    .from(accountAlerts)
    .innerJoin(clients, eq(clients.id, accountAlerts.clientId))
    .where(
      and(
        eq(accountAlerts.status, "active"),
        isNull(accountAlerts.notifiedAt)
      )
    )
    .limit(50);

  if (unnotifiedAlerts.length === 0) {
    console.log("No pending notifications.");
    return { sent: 0 };
  }

  let sent = 0;

  for (const { alert, clientName } of unnotifiedAlerts) {
    try {
      // Load client preferences
      const [prefs] = await db
        .select()
        .from(alertPreferences)
        .where(eq(alertPreferences.clientId, alert.clientId))
        .limit(1);

      const channels = (prefs?.channels as NotificationChannel[] | null) ?? ["in_app"];

      // Check quiet hours
      if (prefs && isInQuietHours(prefs.quietHoursStart, prefs.quietHoursEnd, prefs.quietHoursTimezone)) {
        continue;
      }

      const usedChannels: string[] = [];

      // Slack
      if (channels.includes("slack") && prefs?.slackWebhookUrl) {
        await sendSlackNotification(
          prefs.slackWebhookUrl,
          alert.severity as AlertSeverity,
          alert.title,
          alert.message,
          clientName,
          alert.aiAnalysis,
          alert.aiRecommendation
        );
        usedChannels.push("slack");
      }

      // Email
      if (channels.includes("email") && prefs?.emailRecipients) {
        const recipients = prefs.emailRecipients as string[];
        if (recipients.length > 0) {
          await sendEmailNotification(
            recipients,
            alert.severity as AlertSeverity,
            alert.title,
            alert.message,
            clientName,
            alert.aiAnalysis,
            alert.aiRecommendation
          );
          usedChannels.push("email");
        }
      }

      // In-app is always recorded (the dashboard reads from the DB)
      usedChannels.push("in_app");

      // Mark as notified
      await db
        .update(accountAlerts)
        .set({
          notifiedVia: usedChannels,
          notifiedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(accountAlerts.id, alert.id));

      sent++;
    } catch (error) {
      console.error(`Failed to notify for alert ${alert.id}:`, error);
    }
  }

  console.log(`Sent ${sent} notifications.`);
  return { sent };
}

// ---------------------------------------------------------------------------
// Slack Notification
// ---------------------------------------------------------------------------

const SEVERITY_EMOJI: Record<AlertSeverity, string> = {
  critical: "\u{1F6A8}",  // rotating light
  high: "\u{1F534}",      // red circle
  medium: "\u{1F7E0}",    // orange circle
  low: "\u{1F7E1}",       // yellow circle
};

async function sendSlackNotification(
  webhookUrl: string,
  severity: AlertSeverity,
  title: string,
  message: string,
  clientName: string,
  aiAnalysis?: string | null,
  aiRecommendation?: string | null
) {
  const emoji = SEVERITY_EMOJI[severity];
  const severityLabel = severity.toUpperCase();

  const blocks: unknown[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `${emoji} ${severityLabel}: ${title}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: message,
      },
    },
  ];

  if (aiAnalysis) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*AI Analysis:* ${aiAnalysis}`,
      },
    });
  }

  if (aiRecommendation) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Recommended Action:* ${aiRecommendation}`,
      },
    });
  }

  blocks.push({
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: `Client: ${clientName} | ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET`,
      },
    ],
  });

  const payload = { blocks };

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Slack webhook failed: ${response.status} ${response.statusText}`);
  }
}

// ---------------------------------------------------------------------------
// Email Notification (via generic SMTP or service — placeholder)
// ---------------------------------------------------------------------------

async function sendEmailNotification(
  recipients: string[],
  severity: AlertSeverity,
  title: string,
  message: string,
  clientName: string,
  aiAnalysis?: string | null,
  aiRecommendation?: string | null
) {
  // TODO: Integrate with Resend, SendGrid, or AWS SES
  // For now, log what would be sent
  console.log(`[EMAIL] Would send to ${recipients.join(", ")}:`);
  console.log(`  Subject: [${severity.toUpperCase()}] ${title}`);
  console.log(`  Body: ${message}`);
  if (aiAnalysis) console.log(`  Analysis: ${aiAnalysis}`);
  if (aiRecommendation) console.log(`  Recommendation: ${aiRecommendation}`);
}

// ---------------------------------------------------------------------------
// Quiet Hours Check
// ---------------------------------------------------------------------------

function isInQuietHours(
  start?: string | null,
  end?: string | null,
  timezone?: string | null
): boolean {
  if (!start || !end) return false;

  const tz = timezone ?? "America/New_York";
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: tz,
  });
  const currentTime = formatter.format(now); // "HH:MM"

  // Simple string comparison works for HH:MM format
  if (start <= end) {
    // Same-day range: e.g., 09:00 to 17:00
    return currentTime >= start && currentTime < end;
  } else {
    // Overnight range: e.g., 22:00 to 07:00
    return currentTime >= start || currentTime < end;
  }
}
