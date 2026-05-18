import type { Client, ClientDefaults, Product, ProductAssumptions } from "./types";

export const DEFAULT_CLIENT_DEFAULTS: ClientDefaults = {
  tiktokPlatformFeePct: 5.5,
  tiktokTransactionFeePct: 2.24,
  returnRatePct: 0,
  averageDiscountPct: 10,
  monthlyAdSpend: 3000,
  agencyRetainer: 5500,
  agencyFeePct: 0,
  creatorPostRate: 2,
  organicAffiliateCommissionPct: 20,
  gmvMaxAffiliateCommissionPct: 5,
};

export const DEFAULT_PRODUCT_ASSUMPTIONS: ProductAssumptions = {
  units: 1000,
  averagePrice: 27.5,
  cogsPerUnit: 8,
  shippingPerUnit: 4,
  creatorPosts: 50,
  adSpendShare: 1,
  retainerShare: 1,
  overrides: {},
};

export function newClientId(): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `client_${Date.now()}_${rand}`;
}

export function newProductId(): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `product_${Date.now()}_${rand}`;
}

export function makeClient(name = "Untitled Client"): Client {
  const now = Date.now();
  return {
    id: newClientId(),
    name,
    vertical: "",
    defaults: { ...DEFAULT_CLIENT_DEFAULTS },
    products: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function makeProduct(name = "Untitled Product"): Product {
  return {
    id: newProductId(),
    name,
    included: true,
    assumptions: { ...DEFAULT_PRODUCT_ASSUMPTIONS, overrides: {} },
    updatedAt: Date.now(),
  };
}
