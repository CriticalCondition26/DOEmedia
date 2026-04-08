import {
  searchAdLibrary,
  type AdLibraryAd,
  type AdLibrarySearchParams,
} from "./meta-ad-library";

export interface AdExplorerFilters {
  niche: string; // search terms for the niche
  countries?: string[];
  mediaType?: "ALL" | "IMAGE" | "VIDEO";
  competitorPageIds?: string[];
  limit?: number;
}

export interface ExplorerResult {
  ads: AdLibraryAd[];
  totalFound: number;
  searchParams: AdLibrarySearchParams;
}

/**
 * Search and filter competitor ads by niche, country, and format.
 * This is the "Ad Explorer" feature.
 */
export async function exploreAds(
  filters: AdExplorerFilters,
  accessToken: string
): Promise<ExplorerResult> {
  const params: AdLibrarySearchParams = {
    searchTerms: filters.niche,
    adReachedCountries: filters.countries ?? ["US"],
    mediaType: filters.mediaType ?? "ALL",
    searchPageIds: filters.competitorPageIds,
    limit: filters.limit ?? 50,
  };

  const ads = await searchAdLibrary(params, accessToken);

  return {
    ads,
    totalFound: ads.length,
    searchParams: params,
  };
}
