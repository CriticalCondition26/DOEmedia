/** Default creative refresh cadence in days */
export const DEFAULT_REFRESH_CADENCE_DAYS = 14;

/** Target number of assets per refresh cycle per client */
export const DEFAULT_ASSETS_PER_CYCLE = 6;

/** Number of copy variants to generate per brief */
export const COPY_VARIANTS_PER_BRIEF = 5;

/** Number of days of performance data for analysis */
export const ANALYSIS_LOOKBACK_DAYS = 14;

/** Number of days of performance data for strategy */
export const STRATEGY_LOOKBACK_DAYS = 30;

/** Meta API sync interval in hours */
export const META_SYNC_INTERVAL_HOURS = 6;

/** Days of data to pull on each sync (captures attribution window) */
export const META_SYNC_LOOKBACK_DAYS = 7;

/** Max concurrent Meta API calls per account */
export const META_MAX_CONCURRENT_CALLS = 3;

/** Default number of clients per pod */
export const CLIENTS_PER_POD = 20;

/** AI Models */
export const AI_MODELS = {
  /** Strongest model — for ad copy, creative briefs, copy variations */
  COPY_CREATIVE: "claude-opus-4-6",
  /** Analysis model — for performance analysis, strategy generation */
  ANALYSIS_STRATEGY: "claude-sonnet-4-5-20250514",
  /** Visual model — for video analysis, visual concepts, image prompts */
  VISUAL: "gemini-2.0-flash",
} as const;
