import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  numeric,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { pods } from "./pods";

export const clients = pgTable("clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  shopifyDomain: varchar("shopify_domain", { length: 255 }),
  industry: varchar("industry", { length: 100 }),
  monthlySpend: numeric("monthly_spend", { precision: 12, scale: 2 }),
  brandVoice: text("brand_voice"),
  targetAudience: text("target_audience"),
  productDescription: text("product_description"),
  podId: uuid("pod_id").references(() => pods.id),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  notes: text("notes"),
  isActive: boolean("is_active").default(true).notNull(),

  // --- Per-Client KPI Targets ---
  // These define what "good" looks like for this specific client.
  // The AI compares actual performance against these targets in every analysis.
  cacTarget: numeric("cac_target", { precision: 10, scale: 2 }), // Target customer acquisition cost
  aovTarget: numeric("aov_target", { precision: 10, scale: 2 }), // Target average order value
  ltvTarget: numeric("ltv_target", { precision: 10, scale: 2 }), // Target lifetime value
  roasTarget: numeric("roas_target", { precision: 10, scale: 4 }), // Target ROAS (platform)
  merTarget: numeric("mer_target", { precision: 10, scale: 4 }), // Target marketing efficiency ratio (blended)
  conversionRateTarget: numeric("conversion_rate_target", { precision: 8, scale: 4 }), // Target CVR
  cpaTarget: numeric("cpa_target", { precision: 10, scale: 2 }), // Target cost per acquisition

  // --- Strategic Mode ---
  growthMode: varchar("growth_mode", { length: 20 }).default("growth"), // 'growth' | 'efficiency' | 'testing'
  testingBudgetPct: integer("testing_budget_pct").default(20), // % of spend for testing new creative
  funnelMix: jsonb("funnel_mix").default({ tofu: 40, mofu: 30, bofu: 30 }), // Funnel stage allocation

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
