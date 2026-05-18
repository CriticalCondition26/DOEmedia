export type ClientDefaults = {
  tiktokPlatformFeePct: number;
  tiktokTransactionFeePct: number;
  returnRatePct: number;
  averageDiscountPct: number;
  monthlyAdSpend: number;
  agencyRetainer: number;
  agencyFeePct: number;
  creatorPostRate: number;
  organicAffiliateCommissionPct: number;
  gmvMaxAffiliateCommissionPct: number;
};

export type ProductAssumptions = {
  units: number;
  averagePrice: number;
  cogsPerUnit: number;
  shippingPerUnit: number;
  creatorPosts: number;
  adSpendShare: number;
  retainerShare: number;
  overrides: Partial<ClientDefaults>;
};

export type Product = {
  id: string;
  name: string;
  included: boolean;
  assumptions: ProductAssumptions;
  updatedAt: number;
};

export type Client = {
  id: string;
  name: string;
  vertical: string;
  defaults: ClientDefaults;
  products: Product[];
  createdAt: number;
  updatedAt: number;
};

export type Store = {
  clients: Client[];
  selectedClientId: string | null;
};

export type ProductForecast = {
  gmv: number;
  netRevenue: number;
  discount: number;
  returns: number;
  platformFee: number;
  transactionFee: number;
  organicAffiliate: number;
  gmvMaxAffiliate: number;
  cogs: number;
  shipping: number;
  creatorCost: number;
  adSpend: number;
  retainer: number;
  agencyFee: number;
  totalCosts: number;
  roi: number;
};
