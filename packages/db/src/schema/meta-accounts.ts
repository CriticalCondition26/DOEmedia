import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { clients } from "./clients";

export const metaAdAccounts = pgTable("meta_ad_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .references(() => clients.id)
    .notNull(),
  metaAccountId: varchar("meta_account_id", { length: 50 }).notNull().unique(),
  accountName: varchar("account_name", { length: 255 }),
  accessToken: text("access_token").notNull(), // encrypted
  tokenExpiresAt: timestamp("token_expires_at"),
  currency: varchar("currency", { length: 10 }).default("USD"),
  timezone: varchar("timezone", { length: 50 }),
  status: varchar("status", { length: 20 }).default("active").notNull(),
  lastSyncedAt: timestamp("last_synced_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
