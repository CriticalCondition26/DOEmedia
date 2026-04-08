import { metaSyncQueue, aiAnalysisQueue } from "./queues";

/**
 * Set up recurring job schedules.
 * These are the cron jobs that drive the entire system.
 */
export async function setupSchedulers() {
  // Sync all Meta ad accounts every 6 hours
  await metaSyncQueue.upsertJobScheduler(
    "sync-all-accounts",
    { every: 6 * 60 * 60 * 1000 }, // 6 hours in ms
    {
      name: "sync-all-accounts",
      data: {},
    }
  );

  // Check for creative refresh needs daily at 7 AM
  await metaSyncQueue.upsertJobScheduler(
    "check-refresh-needed",
    { pattern: "0 7 * * *" }, // Cron: 7 AM daily
    {
      name: "check-refresh-needed",
      data: {},
    }
  );

  // Run weekly AI analysis every Monday at 6 AM
  await aiAnalysisQueue.upsertJobScheduler(
    "weekly-analysis",
    { pattern: "0 6 * * 1" }, // Cron: 6 AM every Monday
    {
      name: "analyze-all-accounts",
      data: {},
    }
  );

  console.log("Job schedulers configured successfully");
}
