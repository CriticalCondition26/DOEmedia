import {
  pgTable,
  uuid,
  varchar,
  text,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { clients } from "./clients";
import { creativeBriefs } from "./creative-briefs";

export const visualConcepts = pgTable("visual_concepts", {
  id: uuid("id").primaryKey().defaultRandom(),
  briefId: uuid("brief_id").references(() => creativeBriefs.id),
  clientId: uuid("client_id")
    .references(() => clients.id)
    .notNull(),

  // Visual content
  conceptName: varchar("concept_name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  mood: varchar("mood", { length: 100 }), // energetic, minimal, luxurious, etc.
  colorPalette: jsonb("color_palette"), // [{ hex, name }]
  styleReferences: jsonb("style_references"), // [{ url, description }]
  aiImagePrompt: text("ai_image_prompt"), // Ready-to-use prompt for Midjourney/DALL-E
  layoutNotes: text("layout_notes"),

  modelUsed: varchar("model_used", { length: 50 }),
  status: varchar("status", { length: 20 }).default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
