import {
  pgTable,
  uuid,
  varchar,
  date,
  bigint,
  integer,
  numeric,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { metaAdAccounts } from "./meta-accounts";

export const adInsightsDaily = pgTable(
  "ad_insights_daily",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    metaAccountId: uuid("meta_account_id")
      .references(() => metaAdAccounts.id)
      .notNull(),
    metaAdId: varchar("meta_ad_id", { length: 50 }).notNull(),
    metaCampaignId: varchar("meta_campaign_id", { length: 50 }),
    metaAdsetId: varchar("meta_adset_id", { length: 50 }),
    date: date("date").notNull(),

    // Core metrics
    impressions: bigint("impressions", { mode: "number" }).default(0),
    clicks: bigint("clicks", { mode: "number" }).default(0),
    spend: numeric("spend", { precision: 12, scale: 4 }).default("0"),
    reach: bigint("reach", { mode: "number" }).default(0),
    frequency: numeric("frequency", { precision: 8, scale: 4 }),

    // Computed rates
    ctr: numeric("ctr", { precision: 8, scale: 6 }),
    cpc: numeric("cpc", { precision: 10, scale: 4 }),
    cpm: numeric("cpm", { precision: 10, scale: 4 }),

    // Conversion metrics
    purchases: integer("purchases").default(0),
    purchaseValue: numeric("purchase_value", { precision: 12, scale: 4 }).default(
      "0"
    ),
    roas: numeric("roas", { precision: 10, scale: 4 }),
    cpa: numeric("cpa", { precision: 10, scale: 4 }),
    addToCarts: integer("add_to_carts").default(0),
    checkouts: integer("checkouts").default(0),

    // Video metrics
    videoViews3s: bigint("video_views_3s", { mode: "number" }).default(0),
    videoViews25: bigint("video_views_25", { mode: "number" }).default(0),
    videoViews50: bigint("video_views_50", { mode: "number" }).default(0),
    videoViews75: bigint("video_views_75", { mode: "number" }).default(0),
    videoViews100: bigint("video_views_100", { mode: "number" }).default(0),

    // Raw Meta API data (for flexibility)
    actions: jsonb("actions"),
    actionValues: jsonb("action_values"),
    costPerActionType: jsonb("cost_per_action_type"),
  },
  (table) => [
    uniqueIndex("uq_ad_insights_ad_date").on(table.metaAdId, table.date),
    index("idx_ad_insights_account_date").on(table.metaAccountId, table.date),
    index("idx_ad_insights_date").on(table.date),
  ]
);
