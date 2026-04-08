import { eq, desc } from "drizzle-orm";
import type { Database } from "../client";
import {
  creativeBriefs,
  creativeStrategies,
  adCopyVariants,
  visualConcepts,
} from "../schema";

/** Get all briefs for a client */
export async function getClientBriefs(db: Database, clientId: string) {
  return db
    .select()
    .from(creativeBriefs)
    .where(eq(creativeBriefs.clientId, clientId))
    .orderBy(desc(creativeBriefs.createdAt));
}

/** Get all strategies for a client */
export async function getClientStrategies(db: Database, clientId: string) {
  return db
    .select()
    .from(creativeStrategies)
    .where(eq(creativeStrategies.clientId, clientId))
    .orderBy(desc(creativeStrategies.createdAt));
}

/** Get copy variants for a brief */
export async function getBriefCopyVariants(db: Database, briefId: string) {
  return db
    .select()
    .from(adCopyVariants)
    .where(eq(adCopyVariants.briefId, briefId))
    .orderBy(adCopyVariants.createdAt);
}

/** Get visual concepts for a brief */
export async function getBriefVisualConcepts(db: Database, briefId: string) {
  return db
    .select()
    .from(visualConcepts)
    .where(eq(visualConcepts.briefId, briefId))
    .orderBy(visualConcepts.createdAt);
}

/** Get all copy variants for a client */
export async function getClientCopyVariants(db: Database, clientId: string) {
  return db
    .select()
    .from(adCopyVariants)
    .where(eq(adCopyVariants.clientId, clientId))
    .orderBy(desc(adCopyVariants.createdAt));
}
