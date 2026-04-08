import { getAdAccount, decryptToken } from "./client";

/** Fields to request from the Meta Insights API */
const INSIGHT_FIELDS = [
  "ad_id",
  "ad_name",
  "campaign_id",
  "campaign_name",
  "adset_id",
  "adset_name",
  "impressions",
  "clicks",
  "spend",
  "reach",
  "frequency",
  "ctr",
  "cpc",
  "cpm",
  "actions",
  "action_values",
  "cost_per_action_type",
  "video_p25_watched_actions",
  "video_p50_watched_actions",
  "video_p75_watched_actions",
  "video_p100_watched_actions",
];

export interface MetaInsightRow {
  ad_id: string;
  ad_name: string;
  campaign_id: string;
  adset_id: string;
  date_start: string;
  date_stop: string;
  impressions: string;
  clicks: string;
  spend: string;
  reach: string;
  frequency: string;
  ctr: string;
  cpc: string;
  cpm: string;
  actions?: Array<{ action_type: string; value: string }>;
  action_values?: Array<{ action_type: string; value: string }>;
  cost_per_action_type?: Array<{ action_type: string; value: string }>;
  video_p25_watched_actions?: Array<{ action_type: string; value: string }>;
  video_p50_watched_actions?: Array<{ action_type: string; value: string }>;
  video_p75_watched_actions?: Array<{ action_type: string; value: string }>;
  video_p100_watched_actions?: Array<{ action_type: string; value: string }>;
}

/**
 * Fetch daily ad-level insights for a Meta ad account.
 * Uses time_increment=1 for daily granularity.
 * Pulls `lookbackDays` days of data to capture attribution window updates.
 */
export async function fetchDailyInsights(
  metaAccountId: string,
  encryptedToken: string,
  lookbackDays: number = 7
): Promise<MetaInsightRow[]> {
  const token = decryptToken(encryptedToken);
  const account = getAdAccount(metaAccountId, token);

  const today = new Date();
  const since = new Date(today);
  since.setDate(since.getDate() - lookbackDays);

  const params = {
    fields: INSIGHT_FIELDS,
    level: "ad",
    time_increment: "1",
    time_range: {
      since: formatDate(since),
      until: formatDate(today),
    },
    limit: 500,
  };

  const insights: MetaInsightRow[] = [];

  try {
    let cursor = await account.getInsights([], params);
    while (cursor.length > 0) {
      for (const row of cursor) {
        insights.push(row._data as unknown as MetaInsightRow);
      }
      if (cursor.hasNext()) {
        cursor = await cursor.next();
      } else {
        break;
      }
    }
  } catch (error) {
    console.error(
      `Failed to fetch insights for ${metaAccountId}:`,
      error
    );
    throw error;
  }

  return insights;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}
