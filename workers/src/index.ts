import { Worker } from "bullmq";
import { connection } from "./queues";
import { setupSchedulers } from "./schedulers";
import { syncMetaInsights } from "./jobs/sync-meta-insights";
import { syncAllAccounts } from "./jobs/sync-all-accounts";
import { generateStrategy } from "./jobs/generate-strategy";

async function main() {
  console.log("Starting Doe Media workers...");

  // Meta sync worker
  const metaSyncWorker = new Worker(
    "meta-sync",
    async (job) => {
      switch (job.name) {
        case "sync-meta-insights":
          return syncMetaInsights(job);
        case "sync-all-accounts":
        case "check-refresh-needed":
          return syncAllAccounts(job);
        default:
          console.warn(`Unknown meta-sync job: ${job.name}`);
      }
    },
    {
      connection,
      concurrency: 5, // Process up to 5 account syncs in parallel
    }
  );

  // AI analysis worker
  const aiAnalysisWorker = new Worker(
    "ai-analysis",
    async (job) => {
      switch (job.name) {
        case "analyze-all-accounts":
          console.log("Running weekly analysis for all accounts...");
          // TODO: Implement batch analysis
          break;
        default:
          console.warn(`Unknown ai-analysis job: ${job.name}`);
      }
    },
    {
      connection,
      concurrency: 2, // Limit AI concurrency to manage API costs
    }
  );

  // AI generation worker
  const aiGenerationWorker = new Worker(
    "ai-generation",
    async (job) => {
      switch (job.name) {
        case "generate-strategy":
          return generateStrategy(job);
        default:
          console.warn(`Unknown ai-generation job: ${job.name}`);
      }
    },
    {
      connection,
      concurrency: 3, // 3 concurrent strategy generations
    }
  );

  // Set up scheduled jobs
  await setupSchedulers();

  // Graceful shutdown
  const shutdown = async () => {
    console.log("Shutting down workers...");
    await metaSyncWorker.close();
    await aiAnalysisWorker.close();
    await aiGenerationWorker.close();
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  console.log("Workers started successfully. Waiting for jobs...");
}

main().catch(console.error);
