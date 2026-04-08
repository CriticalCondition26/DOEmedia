import {
  pgTable,
  uuid,
  varchar,
  numeric,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { metaAdAccounts } from "./meta-accounts";

export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  metaAccountId: uuid("meta_account_id")
    .references(() => metaAdAccounts.id)
    .notNull(),
  metaCampaignId: varchar("meta_campaign_id", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 500 }),
  status: varchar("status", { length: 20 }),
  objective: varchar("objective", { length: 50 }),
  buyingType: varchar("buying_type", { length: 50 }),
  dailyBudget: numeric("daily_budget", { precision: 12, scale: 2 }),
  lifetimeBudget: numeric("lifetime_budget", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const adSets = pgTable("ad_sets", {
  id: uuid("id").primaryKey().defaultRandom(),
  campaignId: uuid("campaign_id")
    .references(() => campaigns.id)
    .notNull(),
  metaAdsetId: varchar("meta_adset_id", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 500 }),
  status: varchar("status", { length: 20 }),
  targeting: jsonb("targeting"),
  optimizationGoal: varchar("optimization_goal", { length: 50 }),
  bidStrategy: varchar("bid_strategy", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ads = pgTable("ads", {
  id: uuid("id").primaryKey().defaultRandom(),
  adSetId: uuid("ad_set_id")
    .references(() => adSets.id)
    .notNull(),
  metaAdId: varchar("meta_ad_id", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 500 }),
  status: varchar("status", { length: 20 }),
  creativeId: uuid("creative_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
