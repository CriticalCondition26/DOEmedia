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
import { creativeStrategies } from "./creative-strategies";
import { users } from "./users";

export const creativeBriefs = pgTable("creative_briefs", {
  id: uuid("id").primaryKey().defaultRandom(),
  strategyId: uuid("strategy_id").references(() => creativeStrategies.id),
  clientId: uuid("client_id")
    .references(() => clients.id)
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),

  // Brief content
  objective: text("objective").notNull(),
  format: varchar("format", { length: 50 }).notNull(), // IMAGE, VIDEO, CAROUSEL
  hook: text("hook").notNull(),
  angle: text("angle").notNull(),
  targetAudience: text("target_audience"),
  keyMessage: text("key_message").notNull(),
  visualDirection: text("visual_direction"),

  // Video-specific fields
  scriptStructure: jsonb("script_structure"), // { hook, meat, actionOffer } for video briefs
  duration: integer("duration"), // target duration in seconds
  pacingNotes: text("pacing_notes"),
  musicDirection: text("music_direction"),

  referenceAds: jsonb("reference_ads"), // [{ ad_id, reason }]
  specs: jsonb("specs"), // { dimensions, duration, etc. }

  // Workflow
  status: varchar("status", { length: 20 }).default("draft").notNull(),
  assignedTo: uuid("assigned_to").references(() => users.id),
  dueDate: date("due_date"),
  priority: integer("priority").default(3), // 1=urgent, 5=low
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
