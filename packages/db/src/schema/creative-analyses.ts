import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  integer,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { clients } from "./clients";
import { metaAdAccounts } from "./meta-accounts";

export const creativeAnalyses = pgTable("creative_analyses", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .references(() => clients.id)
    .notNull(),
  metaAccountId: uuid("meta_account_id").references(() => metaAdAccounts.id),
  analysisPeriodStart: date("analysis_period_start").notNull(),
  analysisPeriodEnd: date("analysis_period_end").notNull(),

  // Analysis output
  winningPatterns: jsonb("winning_patterns").notNull(), // { formats, hooks, angles, visuals }
  losingPatterns: jsonb("losing_patterns").notNull(),
  fatigueAlerts: jsonb("fatigue_alerts"), // creatives showing fatigue
  audienceInsights: jsonb("audience_insights"),
  recommendations: jsonb("recommendations"), // what to create next
  summary: text("summary").notNull(), // human-readable summary

  // Video breakdowns from Gemini
  videoBreakdowns: jsonb("video_breakdowns"), // array of VideoAdBreakdown

  modelUsed: varchar("model_used", { length: 50 }),
  promptTokens: integer("prompt_tokens"),
  completionTokens: integer("completion_tokens"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
