import type { Client, ClientDefaults, Product, ProductForecast } from "./types";

export function effectiveDefaults(
  product: Product,
  defaults: ClientDefaults
): ClientDefaults {
  return { ...defaults, ...product.assumptions.overrides };
}

export function forecastProduct(
  product: Product,
  defaults: ClientDefaults
): ProductForecast {
  const d = effectiveDefaults(product, defaults);
  const a = product.assumptions;

  const gmv = a.units * a.averagePrice;
  const discount = gmv * (d.averageDiscountPct / 100);
  const netRevenue = gmv - discount;
  const returns = netRevenue * (d.returnRatePct / 100);
  const platformFee = netRevenue * (d.tiktokPlatformFeePct / 100);
  const transactionFee = netRevenue * (d.tiktokTransactionFeePct / 100);
  const organicAffiliate = netRevenue * (d.organicAffiliateCommissionPct / 100);
  const gmvMaxAffiliate = netRevenue * (d.gmvMaxAffiliateCommissionPct / 100);
  const cogs = a.units * a.cogsPerUnit;
  const shipping = a.units * a.shippingPerUnit;
  const creatorCost = a.creatorPosts * d.creatorPostRate;
  const adSpend = d.monthlyAdSpend * a.adSpendShare;
  const retainer = d.agencyRetainer * a.retainerShare;
  const agencyFee = adSpend * (d.agencyFeePct / 100);

  const totalCosts =
    discount +
    returns +
    platformFee +
    transactionFee +
    organicAffiliate +
    gmvMaxAffiliate +
    cogs +
    shipping +
    creatorCost +
    adSpend +
    retainer +
    agencyFee;

  return {
    gmv,
    netRevenue,
    discount,
    returns,
    platformFee,
    transactionFee,
    organicAffiliate,
    gmvMaxAffiliate,
    cogs,
    shipping,
    creatorCost,
    adSpend,
    retainer,
    agencyFee,
    totalCosts,
    roi: gmv - totalCosts,
  };
}

export type ClientTotals = {
  gmv: number;
  costs: number;
  profit: number;
  margin: number;
  mer: number;
};

export function totalsForClient(client: Client): ClientTotals {
  let gmv = 0;
  let costs = 0;
  let adSpend = 0;
  for (const p of client.products) {
    if (!p.included) continue;
    const f = forecastProduct(p, client.defaults);
    gmv += f.gmv;
    costs += f.totalCosts;
    adSpend += f.adSpend;
  }
  const profit = gmv - costs;
  return {
    gmv,
    costs,
    profit,
    margin: gmv > 0 ? profit / gmv : 0,
    mer: adSpend > 0 ? gmv / adSpend : 0,
  };
}
