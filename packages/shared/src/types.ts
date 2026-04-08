/** User roles in the pod structure */
export type UserRole =
  | "admin"
  | "media_buyer"
  | "strategist"
  | "designer"
  | "account_manager"
  | "ad_loader";

/** Creative format types */
export type CreativeFormat =
  | "IMAGE"
  | "VIDEO"
  | "CAROUSEL"
  | "COLLECTION"
  | "UGC_STYLE"
  | "REELS";

/** Brief status workflow */
export type BriefStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "in_production"
  | "review"
  | "completed";

/** Copy approval status */
export type CopyStatus =
  | "generated"
  | "selected"
  | "approved"
  | "launched"
  | "rejected";

/** Pipeline item status */
export type PipelineStatus =
  | "queued"
  | "in_progress"
  | "review"
  | "approved"
  | "live"
  | "done";

/** Client status */
export type ClientStatus = "active" | "paused" | "churned";

/** Sync status for Meta data */
export type SyncStatus = "pending" | "syncing" | "completed" | "failed";

/** Strategy status */
export type StrategyStatus = "draft" | "approved" | "in_production" | "completed";

/** Hook types for ad copy classification */
export type HookType =
  | "question"
  | "bold_claim"
  | "statistic"
  | "testimonial"
  | "pain_point"
  | "curiosity"
  | "pattern_interrupt"
  | "story"
  | "direct_benefit";

/** Creative angle categories */
export type CreativeAngle =
  | "social_proof"
  | "problem_solution"
  | "lifestyle"
  | "founder_story"
  | "ugc"
  | "comparison"
  | "educational"
  | "urgency"
  | "emotional";

/** Video ad breakdown structure from Gemini analysis */
export interface VideoAdBreakdown {
  hookStyle: string;
  hookDescription: string;
  contentStructure: string;
  meatDescription: string;
  actionOffer: string;
  proofElements: string[];
  pacing: string;
  visualStyle: string;
  textOverlayPatterns: string;
  duration: number | null;
  overallScore: number;
}

/** Ad performance metrics summary */
export interface AdMetricsSummary {
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  purchases: number;
  purchaseValue: number;
  roas: number;
  cpa: number;
}
