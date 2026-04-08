import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { clients } from "./clients";
import { creativeBriefs } from "./creative-briefs";

export const adCopyVariants = pgTable("ad_copy_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  briefId: uuid("brief_id").references(() => creativeBriefs.id),
  clientId: uuid("client_id")
    .references(() => clients.id)
    .notNull(),

  // Copy content
  primaryText: text("primary_text").notNull(),
  headline: varchar("headline", { length: 255 }),
  description: text("description"),
  callToAction: varchar("call_to_action", { length: 100 }),

  // Classification
  hookType: varchar("hook_type", { length: 50 }),
  angle: varchar("angle", { length: 100 }),
  tone: varchar("tone", { length: 50 }),
  length: varchar("length", { length: 20 }), // short, medium, long

  // Metadata
  modelUsed: varchar("model_used", { length: 50 }),
  status: varchar("status", { length: 20 }).default("generated").notNull(),
  score: numeric("score", { precision: 5, scale: 2 }),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
