import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { clients } from "./clients";
import { creativeAnalyses } from "./creative-analyses";
import { users } from "./users";

export const creativeStrategies = pgTable("creative_strategies", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .references(() => clients.id)
    .notNull(),
  analysisId: uuid("analysis_id").references(() => creativeAnalyses.id),
  title: varchar("title", { length: 255 }).notNull(),
  periodStart: date("period_start"),
  periodEnd: date("period_end"),

  // Strategy content
  overview: text("overview").notNull(),
  themes: jsonb("themes").notNull(), // [{ theme, rationale, priority }]
  formatsRecommended: jsonb("formats_recommended").notNull(), // [{ format, reason, qty }]
  hooksAngles: jsonb("hooks_angles").notNull(), // [{ hook, angle, target_audience }]
  staticBriefFramework: text("static_brief_framework"), // framework for static creatives
  videoBriefFramework: text("video_brief_framework"), // framework: hook -> meat -> offer
  carouselBriefFramework: text("carousel_brief_framework"), // slide-by-slide framework
  references: jsonb("references"), // competitor/inspiration references

  status: varchar("status", { length: 20 }).default("draft").notNull(),
  approvedBy: uuid("approved_by").references(() => users.id),
  approvedAt: timestamp("approved_at"),
  modelUsed: varchar("model_used", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
