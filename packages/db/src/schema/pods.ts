import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const pods = pgTable("pods", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  mediaBuyerId: uuid("media_buyer_id").references(() => users.id),
  strategistId: uuid("strategist_id").references(() => users.id),
  designerId: uuid("designer_id").references(() => users.id),
  amId: uuid("am_id").references(() => users.id),
  adLoaderId: uuid("ad_loader_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
