export { db, type Database } from "./client";
export * from "./schema";

// Query helpers
export {
  getClientsWithPods,
  getClientById,
  getClientMetaAccounts,
  getClientPerformanceSummary,
} from "./queries/clients";
export {
  getTopAdsByRoas,
  getBottomAdsByRoas,
  getFormatBreakdown,
} from "./queries/insights";
export {
  getClientBriefs,
  getClientStrategies,
  getBriefCopyVariants,
  getBriefVisualConcepts,
  getClientCopyVariants,
} from "./queries/briefs";
