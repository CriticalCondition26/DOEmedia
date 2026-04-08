import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  timestamp,
  boolean,
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
  podId: uuid("pod_id").references(() => pods.id),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  notes: text("notes"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
