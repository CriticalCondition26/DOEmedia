import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  date,
  timestamp,
} from "drizzle-orm/pg-core";
import { clients } from "./clients";
import { creativeBriefs } from "./creative-briefs";
import { users } from "./users";

export const pipelineItems = pgTable("pipeline_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .references(() => clients.id)
    .notNull(),
  briefId: uuid("brief_id").references(() => creativeBriefs.id),
  type: varchar("type", { length: 50 }).notNull(), // creative_refresh, copy_batch, strategy_review
  status: varchar("status", { length: 20 }).default("queued").notNull(), // queued, in_progress, review, approved, live, done
  assignedTo: uuid("assigned_to").references(() => users.id),
  dueDate: date("due_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const syncLogs = pgTable("sync_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  metaAccountId: uuid("meta_account_id").notNull(),
  jobType: varchar("job_type", { length: 50 }).notNull(), // insights, creatives, campaigns
  status: varchar("status", { length: 20 }).notNull(), // started, completed, failed
  recordsFetched: integer("records_fetched").default(0),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
});
