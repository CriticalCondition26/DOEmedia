/**
 * Ad Account Alert System — Types, Rules, and Configuration
 *
 * Defines the alert rules that media buyers care about most:
 * spend anomalies, performance drops, creative fatigue, and pacing issues.
 */

// ---------------------------------------------------------------------------
// Alert Types
// ---------------------------------------------------------------------------

/** Categories of alerts the system can fire */
export type AlertType =
  | "spend_spike"        // Spend increased significantly vs prior period
  | "spend_drop"         // Spend decreased significantly vs prior period
  | "roas_decline"       // ROAS dropped below target or vs prior period
  | "cpa_blowout"        // CPA exceeded target significantly
  | "ctr_fatigue"        // CTR dropping — creative exhaustion signal
  | "zero_spend"         // Account/campaign active but $0 spend (something broke)
  | "conversion_drop"    // Purchase volume dropped significantly
  | "budget_pacing"      // On track to over/underspend monthly budget
  | "roas_below_target"  // ROAS fell below client's configured target
  | "cpa_above_target";  // CPA rose above client's configured target

export type AlertSeverity = "critical" | "high" | "medium" | "low";

export type AlertStatus = "active" | "acknowledged" | "resolved" | "dismissed";

export type NotificationChannel = "slack" | "email" | "in_app";

// ---------------------------------------------------------------------------
// Alert Rule Definitions
// ---------------------------------------------------------------------------

export interface AlertRuleConfig {
  type: AlertType;
  label: string;
  description: string;
  /** Default % change threshold that triggers the alert */
  defaultThresholdPct: number;
  /** How severity escalates based on the magnitude */
  severityThresholds: {
    critical: number; // % change that = critical
    high: number;     // % change that = high
    medium: number;   // % change that = medium
  };
  /** Which comparison period to use */
  comparisonPeriod: "day_over_day" | "week_over_week" | "vs_target";
  /** Whether this alert is enabled by default for new clients */
  enabledByDefault: boolean;
}

/**
 * Default alert rules — these are the out-of-box rules every account gets.
 * Clients can customize thresholds via alert preferences.
 */
export const DEFAULT_ALERT_RULES: AlertRuleConfig[] = [
  {
    type: "spend_spike",
    label: "Spend Spike",
    description: "Daily spend increased significantly compared to the prior period average",
    defaultThresholdPct: 50,
    severityThresholds: { critical: 100, high: 75, medium: 50 },
    comparisonPeriod: "day_over_day",
    enabledByDefault: true,
  },
  {
    type: "spend_drop",
    label: "Spend Drop",
    description: "Daily spend decreased significantly compared to the prior period average",
    defaultThresholdPct: 50,
    severityThresholds: { critical: 80, high: 60, medium: 50 },
    comparisonPeriod: "day_over_day",
    enabledByDefault: true,
  },
  {
    type: "roas_decline",
    label: "ROAS Decline",
    description: "Return on ad spend dropped significantly week-over-week",
    defaultThresholdPct: 25,
    severityThresholds: { critical: 50, high: 35, medium: 25 },
    comparisonPeriod: "week_over_week",
    enabledByDefault: true,
  },
  {
    type: "cpa_blowout",
    label: "CPA Blowout",
    description: "Cost per acquisition spiked significantly",
    defaultThresholdPct: 40,
    severityThresholds: { critical: 80, high: 60, medium: 40 },
    comparisonPeriod: "week_over_week",
    enabledByDefault: true,
  },
  {
    type: "ctr_fatigue",
    label: "CTR Fatigue",
    description: "Click-through rate declining — signals creative exhaustion",
    defaultThresholdPct: 30,
    severityThresholds: { critical: 50, high: 40, medium: 30 },
    comparisonPeriod: "week_over_week",
    enabledByDefault: true,
  },
  {
    type: "zero_spend",
    label: "Zero Spend",
    description: "Active account has zero spend — ad delivery may be broken",
    defaultThresholdPct: 0, // Not threshold-based, binary check
    severityThresholds: { critical: 0, high: 0, medium: 0 },
    comparisonPeriod: "day_over_day",
    enabledByDefault: true,
  },
  {
    type: "conversion_drop",
    label: "Conversion Drop",
    description: "Purchase volume dropped significantly",
    defaultThresholdPct: 40,
    severityThresholds: { critical: 70, high: 50, medium: 40 },
    comparisonPeriod: "week_over_week",
    enabledByDefault: true,
  },
  {
    type: "budget_pacing",
    label: "Budget Pacing",
    description: "Account is on track to significantly over or underspend monthly budget",
    defaultThresholdPct: 20,
    severityThresholds: { critical: 40, high: 30, medium: 20 },
    comparisonPeriod: "vs_target",
    enabledByDefault: true,
  },
  {
    type: "roas_below_target",
    label: "ROAS Below Target",
    description: "ROAS fell below the client's configured target",
    defaultThresholdPct: 0, // Fires when below target at all
    severityThresholds: { critical: 30, high: 20, medium: 0 },
    comparisonPeriod: "vs_target",
    enabledByDefault: true,
  },
  {
    type: "cpa_above_target",
    label: "CPA Above Target",
    description: "CPA rose above the client's configured target",
    defaultThresholdPct: 0,
    severityThresholds: { critical: 50, high: 30, medium: 0 },
    comparisonPeriod: "vs_target",
    enabledByDefault: true,
  },
];

// ---------------------------------------------------------------------------
// Alert Data Shapes
// ---------------------------------------------------------------------------

/** The data payload attached to a fired alert */
export interface AlertMetrics {
  currentValue: number;
  previousValue: number;
  changePct: number;
  targetValue?: number;
  /** Additional context metrics for the AI analysis */
  context?: {
    currentSpend?: number;
    currentRoas?: number;
    currentCpa?: number;
    currentCtr?: number;
    impressions?: number;
    purchases?: number;
  };
}

/** A fully evaluated alert ready for storage / notification */
export interface EvaluatedAlert {
  clientId: string;
  clientName: string;
  metaAccountId: string;
  accountName: string;
  alertType: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  metrics: AlertMetrics;
  aiAnalysis?: string;
  aiRecommendation?: string;
}

/** Notification preferences per client */
export interface AlertPreferences {
  enabledAlertTypes: AlertType[];
  channels: NotificationChannel[];
  slackWebhookUrl?: string;
  emailRecipients?: string[];
  /** Custom thresholds override defaults (alertType -> threshold %) */
  customThresholds?: Partial<Record<AlertType, number>>;
  /** Quiet hours — don't send notifications during these times */
  quietHoursStart?: string; // "22:00"
  quietHoursEnd?: string;   // "07:00"
  quietHoursTimezone?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** How often to run the alert evaluation (in minutes) */
export const ALERT_CHECK_INTERVAL_MINUTES = 60;

/** Max alerts per account per day to prevent alert fatigue */
export const MAX_ALERTS_PER_ACCOUNT_PER_DAY = 10;

/** Days to look back for daily comparison */
export const ALERT_DAILY_LOOKBACK = 3;

/** Days to look back for weekly comparison */
export const ALERT_WEEKLY_LOOKBACK = 7;
