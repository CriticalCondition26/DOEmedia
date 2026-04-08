import type { MetaInsightRow } from "./insights";

export interface TransformedInsight {
  metaAdId: string;
  metaCampaignId: string;
  metaAdsetId: string;
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
  reach: number;
  frequency: number;
  ctr: number;
  cpc: number;
  cpm: number;
  purchases: number;
  purchaseValue: number;
  roas: number;
  cpa: number;
  addToCarts: number;
  checkouts: number;
  videoViews3s: number;
  videoViews25: number;
  videoViews50: number;
  videoViews75: number;
  videoViews100: number;
  actions: unknown;
  actionValues: unknown;
  costPerActionType: unknown;
}

/**
 * Transform a raw Meta API insight row into our DB format.
 * Extracts specific metrics from Meta's nested actions arrays.
 */
export function transformInsightRow(row: MetaInsightRow): TransformedInsight {
  const purchases = extractAction(row.actions, "purchase") ?? 0;
  const purchaseValue = extractAction(row.action_values, "purchase") ?? 0;
  const spend = parseFloat(row.spend) || 0;

  return {
    metaAdId: row.ad_id,
    metaCampaignId: row.campaign_id,
    metaAdsetId: row.adset_id,
    date: row.date_start,
    impressions: parseInt(row.impressions) || 0,
    clicks: parseInt(row.clicks) || 0,
    spend,
    reach: parseInt(row.reach) || 0,
    frequency: parseFloat(row.frequency) || 0,
    ctr: parseFloat(row.ctr) || 0,
    cpc: parseFloat(row.cpc) || 0,
    cpm: parseFloat(row.cpm) || 0,
    purchases,
    purchaseValue,
    roas: spend > 0 ? purchaseValue / spend : 0,
    cpa: purchases > 0 ? spend / purchases : 0,
    addToCarts:
      extractAction(row.actions, "offsite_conversion.fb_pixel_add_to_cart") ?? 0,
    checkouts:
      extractAction(
        row.actions,
        "offsite_conversion.fb_pixel_initiate_checkout"
      ) ?? 0,
    videoViews3s: extractVideoMetric(row.video_p25_watched_actions),
    videoViews25: extractVideoMetric(row.video_p25_watched_actions),
    videoViews50: extractVideoMetric(row.video_p50_watched_actions),
    videoViews75: extractVideoMetric(row.video_p75_watched_actions),
    videoViews100: extractVideoMetric(row.video_p100_watched_actions),
    actions: row.actions ?? null,
    actionValues: row.action_values ?? null,
    costPerActionType: row.cost_per_action_type ?? null,
  };
}

function extractAction(
  actions: Array<{ action_type: string; value: string }> | undefined,
  actionType: string
): number | null {
  if (!actions) return null;
  const action = actions.find((a) => a.action_type === actionType);
  return action ? parseFloat(action.value) : null;
}

function extractVideoMetric(
  actions: Array<{ action_type: string; value: string }> | undefined
): number {
  if (!actions) return 0;
  const action = actions.find((a) => a.action_type === "video_view");
  return action ? parseInt(action.value) : 0;
}
