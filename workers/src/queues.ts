import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const metaSyncQueue = new Queue("meta-sync", { connection });
export const aiAnalysisQueue = new Queue("ai-analysis", { connection });
export const aiGenerationQueue = new Queue("ai-generation", { connection });

export { connection };
