import type { Job } from "bullmq";
import { fetchDailyInsights, transformInsightRow } from "@doemedia/meta-api";
import { META_SYNC_LOOKBACK_DAYS } from "@doemedia/shared";

export interface SyncMetaInsightsData {
  metaAccountId: string; // Meta's act_XXXX ID
  encryptedToken: string;
  dbAccountId: string; // Our internal UUID
}

/**
 * Worker job: Fetch daily ad-level insights for a single Meta ad account.
 * Pulls the last 7 days of data (to capture attribution window updates).
 * Upserts into ad_insights_daily table.
 */
export async function syncMetaInsights(job: Job<SyncMetaInsightsData>) {
  const { metaAccountId, encryptedToken, dbAccountId } = job.data;

  console.log(`Syncing insights for account ${metaAccountId}...`);

  try {
    // 1. Fetch raw insights from Meta API
    const rawInsights = await fetchDailyInsights(
      metaAccountId,
      encryptedToken,
      META_SYNC_LOOKBACK_DAYS
    );

    console.log(`Fetched ${rawInsights.length} insight rows for ${metaAccountId}`);

    // 2. Transform into our DB format
    const transformed = rawInsights.map(transformInsightRow);

    // 3. Upsert into database
    // TODO: Implement batch upsert using drizzle's onConflictDoUpdate
    // For now, log what we'd insert
    console.log(
      `Would upsert ${transformed.length} insight rows for account ${dbAccountId}`
    );

    return {
      accountId: metaAccountId,
      rowsFetched: rawInsights.length,
      rowsTransformed: transformed.length,
    };
  } catch (error) {
    console.error(`Failed to sync account ${metaAccountId}:`, error);
    throw error; // BullMQ will retry based on queue config
  }
}
