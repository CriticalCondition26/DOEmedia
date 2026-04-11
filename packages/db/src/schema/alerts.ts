import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  timestamp,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { clients } from "./clients";
import { metaAdAccounts } from "./meta-accounts";

/**
 * Fired alerts — each row is a single alert event that was triggered
 * by the evaluation engine.
 */
export const accountAlerts = pgTable(
  "account_alerts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .references(() => clients.id)
      .notNull(),
    metaAccountId: uuid("meta_account_id")
      .references(() => metaAdAccounts.id),
    alertType: varchar("alert_type", { length: 50 }).notNull(),
    severity: varchar("severity", { length: 20 }).notNull(), // critical | high | medium | low
    status: varchar("status", { length: 20 }).default("active").notNull(), // active | acknowledged | resolved | dismissed
    title: varchar("title", { length: 500 }).notNull(),
    message: text("message").notNull(),

    // Metrics snapshot at time of alert
    currentValue: numeric("current_value", { precision: 14, scale: 4 }),
    previousValue: numeric("previous_value", { precision: 14, scale: 4 }),
    changePct: numeric("change_pct", { precision: 10, scale: 4 }),
    targetValue: numeric("target_value", { precision: 14, scale: 4 }),
    metricsSnapshot: jsonb("metrics_snapshot"), // Full context metrics

    // AI-generated analysis
    aiAnalysis: text("ai_analysis"),
    aiRecommendation: text("ai_recommendation"),

    // Notification tracking
    notifiedVia: jsonb("notified_via").$type<string[]>(), // ["slack", "email", "in_app"]
    notifiedAt: timestamp("notified_at"),

    // Resolution
    resolvedBy: uuid("resolved_by"),
    resolvedAt: timestamp("resolved_at"),
    resolutionNote: text("resolution_note"),

    firedAt: timestamp("fired_at").defaultNow().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("idx_alerts_client_status").on(table.clientId, table.status),
    index("idx_alerts_type_fired").on(table.alertType, table.firedAt),
    index("idx_alerts_severity").on(table.severity, table.firedAt),
    index("idx_alerts_account").on(table.metaAccountId, table.firedAt),
  ]
);

/**
 * Per-client alert preferences — custom thresholds, channels, quiet hours.
 */
export const alertPreferences = pgTable("alert_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .references(() => clients.id)
    .notNull()
    .unique(),

  // Which alert types are enabled for this client
  enabledAlertTypes: jsonb("enabled_alert_types")
    .$type<string[]>()
    .default([
      "spend_spike",
      "spend_drop",
      "roas_decline",
      "cpa_blowout",
      "ctr_fatigue",
      "zero_spend",
      "conversion_drop",
      "budget_pacing",
      "roas_below_target",
      "cpa_above_target",
    ]),

  // Notification channels
  channels: jsonb("channels").$type<string[]>().default(["in_app"]),
  slackWebhookUrl: text("slack_webhook_url"),
  emailRecipients: jsonb("email_recipients").$type<string[]>(),

  // Custom thresholds (override defaults per alert type)
  // e.g. { "spend_spike": 75, "roas_decline": 30 }
  customThresholds: jsonb("custom_thresholds").$type<Record<string, number>>(),

  // Quiet hours
  quietHoursStart: varchar("quiet_hours_start", { length: 5 }), // "22:00"
  quietHoursEnd: varchar("quiet_hours_end", { length: 5 }),     // "07:00"
  quietHoursTimezone: varchar("quiet_hours_timezone", { length: 50 }),

  // Global mute
  isMuted: boolean("is_muted").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
