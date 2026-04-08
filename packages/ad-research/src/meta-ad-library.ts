/**
 * Meta Ad Library API client for competitor creative research.
 * Free, official API that covers all active ads across Meta platforms.
 *
 * API Documentation: https://www.facebook.com/ads/library/api/
 */

export interface AdLibrarySearchParams {
  searchTerms?: string;
  adReachedCountries: string[]; // e.g., ["US", "GB"]
  adType?: "ALL" | "POLITICAL_AND_ISSUE_ADS";
  adActiveStatus?: "ALL" | "ACTIVE" | "INACTIVE";
  mediaType?: "ALL" | "IMAGE" | "MEME" | "VIDEO" | "NONE";
  searchPageIds?: string[]; // Specific page IDs to search
  limit?: number;
}

export interface AdLibraryAd {
  id: string;
  adCreativeBodies?: string[];
  adCreativeLinkCaptions?: string[];
  adCreativeLinkDescriptions?: string[];
  adCreativeLinkTitles?: string[];
  adDeliveryStartTime: string;
  adDeliveryStopTime?: string;
  adSnapshotUrl: string;
  pageId: string;
  pageName: string;
  publisherPlatforms?: string[];
  bylines?: string;
  adCreativeImageUrl?: string;
  adCreativeVideoUrl?: string;
}

/**
 * Search the Meta Ad Library for competitor ads.
 * Requires a Meta app with Ad Library API access.
 */
export async function searchAdLibrary(
  params: AdLibrarySearchParams,
  accessToken: string
): Promise<AdLibraryAd[]> {
  const baseUrl = "https://graph.facebook.com/v21.0/ads_archive";

  const queryParams = new URLSearchParams({
    access_token: accessToken,
    ad_reached_countries: JSON.stringify(params.adReachedCountries),
    ad_type: params.adType ?? "ALL",
    ad_active_status: params.adActiveStatus ?? "ACTIVE",
    fields: [
      "id",
      "ad_creative_bodies",
      "ad_creative_link_captions",
      "ad_creative_link_descriptions",
      "ad_creative_link_titles",
      "ad_delivery_start_time",
      "ad_delivery_stop_time",
      "ad_snapshot_url",
      "page_id",
      "page_name",
      "publisher_platforms",
      "bylines",
    ].join(","),
    limit: String(params.limit ?? 50),
  });

  if (params.searchTerms) {
    queryParams.set("search_terms", params.searchTerms);
  }
  if (params.searchPageIds?.length) {
    queryParams.set("search_page_ids", JSON.stringify(params.searchPageIds));
  }
  if (params.mediaType) {
    queryParams.set("media_type", params.mediaType);
  }

  const response = await fetch(`${baseUrl}?${queryParams.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Ad Library API error: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  return data.data ?? [];
}

/**
 * Get all ads from a specific competitor page.
 */
export async function getCompetitorAds(
  pageId: string,
  accessToken: string,
  countries: string[] = ["US"]
): Promise<AdLibraryAd[]> {
  return searchAdLibrary(
    {
      searchPageIds: [pageId],
      adReachedCountries: countries,
      adActiveStatus: "ACTIVE",
      limit: 100,
    },
    accessToken
  );
}
