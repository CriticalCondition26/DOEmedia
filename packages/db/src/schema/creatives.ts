import {
  pgTable,
  uuid,
  varchar,
  text,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { metaAdAccounts } from "./meta-accounts";

export const creatives = pgTable("creatives", {
  id: uuid("id").primaryKey().defaultRandom(),
  metaAccountId: uuid("meta_account_id")
    .references(() => metaAdAccounts.id)
    .notNull(),
  metaCreativeId: varchar("meta_creative_id", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 500 }),
  format: varchar("format", { length: 50 }), // IMAGE, VIDEO, CAROUSEL, COLLECTION
  body: text("body"), // primary text
  title: varchar("title", { length: 500 }), // headline
  description: text("description"),
  callToAction: varchar("call_to_action", { length: 100 }),
  linkUrl: varchar("link_url", { length: 1000 }),
  imageUrl: varchar("image_url", { length: 1000 }),
  videoUrl: varchar("video_url", { length: 1000 }),
  thumbnailUrl: varchar("thumbnail_url", { length: 1000 }),
  assetFeedSpec: jsonb("asset_feed_spec"), // for dynamic/carousel creatives
  creativeFeatures: jsonb("creative_features"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
