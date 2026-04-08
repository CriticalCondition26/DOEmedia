import type { Job } from "bullmq";
import { metaSyncQueue } from "../queues";

/**
 * Fan-out job: Enqueue individual sync jobs for each active Meta ad account.
 * Runs every 6 hours via the scheduler.
 */
export async function syncAllAccounts(_job: Job) {
  console.log("Starting sync-all-accounts fan-out...");

  // TODO: Query database for all active meta_ad_accounts
  // For now, this is a placeholder
  const accounts: Array<{
    id: string;
    metaAccountId: string;
    accessToken: string;
  }> = [];

  console.log(`Found ${accounts.length} active accounts to sync`);

  // Enqueue individual sync jobs with staggered delays
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    await metaSyncQueue.add(
      "sync-meta-insights",
      {
        metaAccountId: account.metaAccountId,
        encryptedToken: account.accessToken,
        dbAccountId: account.id,
      },
      {
        delay: i * 5000, // 5 second delay between accounts to respect rate limits
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 30000, // Start retry at 30s
        },
      }
    );
  }

  return { accountsQueued: accounts.length };
}
