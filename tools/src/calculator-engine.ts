export type CalculatorInputs = Record<string, string | number>;
export type CalculatorOutput = Record<string, string>;

const numberFormatters = new Map<string, Intl.NumberFormat>();

function numberFormatter(minimumFractionDigits: number, maximumFractionDigits: number) {
  const key = `${minimumFractionDigits}:${maximumFractionDigits}`;
  let formatter = numberFormatters.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits,
      maximumFractionDigits,
    });
    numberFormatters.set(key, formatter);
  }
  return formatter;
}

function money(value: number, digits = 2) {
  if (!Number.isFinite(value)) return "n/a";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function count(value: number, digits = 0) {
  if (!Number.isFinite(value)) return "n/a";
  return numberFormatter(0, digits).format(value);
}

function fixed(value: number, digits: number) {
  return Number.isFinite(value) ? value.toFixed(digits) : "n/a";
}

function percentFromFraction(value: number, digits = 1) {
  return Number.isFinite(value) ? `${(value * 100).toFixed(digits)}%` : "n/a";
}

function num(inputs: CalculatorInputs, key: string) {
  const value = Number(inputs[key] ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function scenarioNum(inputs: CalculatorInputs, key: string, fallback: number) {
  return inputs[key] === undefined ? fallback : num(inputs, key);
}

function text(inputs: CalculatorInputs, key: string) {
  return String(inputs[key] ?? "");
}

function ratio(value: number) {
  return Number.isFinite(value) ? `${value.toFixed(2)}×` : "n/a";
}

function normalCdf(value: number) {
  const sign = value < 0 ? -1 : 1;
  const x = Math.abs(value) / Math.sqrt(2);
  const t = 1 / (1 + 0.3275911 * x);
  const erf =
    1 -
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t -
      0.284496736) *
      t +
      0.254829592) *
      t *
      Math.exp(-x * x));
  return 0.5 * (1 + sign * erf);
}

function characterStats(label: string, value: string, limit: number) {
  const chars = [...value].length;
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const remaining = limit - chars;
  return {
    [`text:${label}`]: `${chars} / ${limit}`,
    [`text:${label} status`]: `${Math.abs(remaining)} ${
      remaining < 0 ? "above window" : "remaining"
    } · ${words} words`,
  };
}

export function calculate(
  toolId: string,
  mode: string | null,
  inputs: CalculatorInputs,
): CalculatorOutput {
  switch (toolId) {
    case "ad-spend-calculator": {
      const budget = num(inputs, "budget");
      const impressions = num(inputs, "cpm") > 0 ? (budget / num(inputs, "cpm")) * 1000 : 0;
      const clicks = impressions * (num(inputs, "ctrPct") / 100);
      const orders = clicks * (num(inputs, "cvrPct") / 100);
      const revenue = orders * num(inputs, "aov");
      return {
        "headline:Projected ROAS": fixed(budget ? revenue / budget : 0, 2),
        "li:Budget": money(budget, 0),
        "li:Impressions": count(impressions),
        "li:Link clicks": count(clicks),
        "li:Orders": count(orders),
        "li:Revenue": money(revenue, 0),
        "Cost per acquisition": money(budget / orders),
        "Cost per link click": money(budget / clicks),
      };
    }
    case "ad-budget-calculator": {
      const revenue = num(inputs, "revenueGoal");
      const orders = revenue / num(inputs, "aov");
      const clicks = orders / (num(inputs, "cvrPct") / 100);
      const budget = clicks * num(inputs, "cpc");
      return {
        "headline:Required ad budget": money(budget, 0),
        "Orders needed": count(orders),
        "Clicks needed": count(clicks),
        "Implied CPA": money(num(inputs, "cpc") / (num(inputs, "cvrPct") / 100)),
        "Implied ROAS": ratio(revenue / budget),
        "text:daily": money(
          budget / scenarioNum(inputs, "flightDays", 30),
          0,
        ),
      };
    }
    case "roas-calculator": {
      const revenue = num(inputs, "revenue");
      const spend =
        mode === "allowed-spend"
          ? revenue / num(inputs, "targetRoas")
          : num(inputs, "spend");
      const roas = revenue / spend;
      const exploreTarget = scenarioNum(inputs, "exploreTargetRoas", 3);
      return {
        [mode === "allowed-spend" ? "headline:Allowed spend" : "headline:ROAS"]:
          mode === "allowed-spend" ? money(spend) : fixed(roas, 2),
        "Revenue at target": money(spend * exploreTarget, 0),
        "Revenue gap to target": money(spend * exploreTarget - revenue, 0),
        "Revenue per $1": money(roas),
        "Spend share": percentFromFraction(spend / revenue),
      };
    }
    case "breakeven-roas-calculator": {
      const aov = num(inputs, "aov");
      const contribution =
        aov -
        num(inputs, "cogs") -
        num(inputs, "shipping") -
        (aov * num(inputs, "processingRatePct")) / 100 -
        num(inputs, "processingFixed") -
        num(inputs, "otherVariable");
      const breakEven = contribution > 0 && aov > 0 ? aov / contribution : Infinity;
      const achievedRoas = scenarioNum(inputs, "achievedRoas", 3);
      const adSpend = aov / achievedRoas;
      const profit = contribution - adSpend;
      return {
        "headline:Break-even ROAS": fixed(breakEven, 2),
        "Profit per order": money(profit),
        "Ad spend per order": money(adSpend),
        "Net margin": percentFromFraction(profit / aov),
        "Break-even ROAS": ratio(breakEven),
      };
    }
    case "mer-calculator": {
      const revenue = num(inputs, "totalRevenue");
      const spend = num(inputs, "totalAdSpend");
      const mer = revenue / spend;
      return {
        "headline:MER": fixed(mer, 2),
        "All ad spend": money(spend, 0),
        "Revenue per ad dollar": money(mer),
        "text:store": money(revenue, 0),
        "text:mer": `${fixed(mer, 2)}× MER`,
      };
    }
    case "cpa-calculator": {
      let cpa: number;
      let spend: number;
      let conversions: number;
      if (mode === "conversions") {
        spend = num(inputs, "budget");
        cpa = num(inputs, "targetCpa");
        conversions = spend / cpa;
      } else if (mode === "budget") {
        cpa = num(inputs, "targetCpa");
        conversions = num(inputs, "conversionsGoal");
        spend = cpa * conversions;
      } else {
        spend = num(inputs, "spend");
        conversions = num(inputs, "conversions");
        cpa = spend / conversions;
      }
      const headline: CalculatorOutput =
        mode === "conversions"
          ? { "headline:Conversions at target": count(conversions, 1) }
          : mode === "budget"
            ? { "headline:Budget required": money(spend, 0) }
            : { "headline:Cost per acquisition": money(cpa) };
      return {
        ...headline,
        "Conversions per $1,000": count(1000 / cpa, 1),
        "Total acquisition spend": money(spend, 0),
        "text:cpc": money(cpa),
      };
    }
    case "cpm-calculator": {
      let spend = num(inputs, "spend");
      let impressions = num(inputs, "impressions");
      let cpm = num(inputs, "cpm");
      if (mode === "spend") spend = (cpm * impressions) / 1000;
      else if (mode === "impressions") impressions = (spend / cpm) * 1000;
      else cpm = (spend / impressions) * 1000;
      const headline: CalculatorOutput =
        mode === "spend"
          ? { "headline:Spend": money(spend, 0) }
          : mode === "impressions"
            ? { "headline:Impressions": count(impressions) }
            : { "headline:CPM": money(cpm) };
      return {
        ...headline,
        "Blocks of 1,000": count(impressions / 1000, 1),
        "Total impressions": count(impressions),
        "Total spend": money(spend, 0),
        "Single impression": money(cpm / 1000, 4),
      };
    }
    case "cpc-calculator": {
      const cpc =
        mode === "auction"
          ? num(inputs, "cpm") / (10 * num(inputs, "ctrPct"))
          : num(inputs, "spend") / num(inputs, "clicks");
      const clicksPer100 = 100 / cpc;
      const scenarioClicks = scenarioNum(inputs, "exploreSpend", 100) / cpc;
      return {
        "headline:Cost per click": money(cpc),
        "Per link click": money(cpc),
        "Clicks per $100": count(clicksPer100),
        "text:clicks": count(scenarioClicks),
      };
    }
    case "ctr-calculator": {
      const impressions =
        mode === "clicks" ? num(inputs, "planImpressions") : num(inputs, "impressions");
      const ctr =
        mode === "clicks"
          ? num(inputs, "planCtrPct")
          : (num(inputs, "clicks") / impressions) * 100;
      const clicks =
        mode === "clicks" ? (impressions * ctr) / 100 : num(inputs, "clicks");
      return {
        [mode === "clicks" ? "headline:Expected clicks" : "headline:Link CTR"]:
          mode === "clicks" ? count(clicks) : `${fixed(ctr, 2)}%`,
        "Link clicks": count(clicks),
        "Impressions": count(impressions),
        "text:per1000": count(ctr * 10, 1),
      };
    }
    case "conversion-rate-calculator": {
      const orders = num(inputs, "orders");
      const sessions = num(inputs, "sessions");
      const aov = num(inputs, "aov");
      return {
        "headline:Conversion rate": percentFromFraction(orders / sessions, 2),
        Revenue: money(orders * aov, 0),
        "Revenue per session": money((orders * aov) / sessions),
        "Orders per 1,000 sessions": count((orders / sessions) * 1000, 1),
        "Revenue at +0.5pt": money((orders + sessions * 0.005) * aov, 0),
      };
    }
    case "ad-frequency-calculator": {
      const impressions = num(inputs, "impressions");
      const reach = num(inputs, "reach");
      return {
        "headline:Frequency": fixed(impressions / reach, 1),
        "People reached": count(reach),
        "Ad impressions": count(impressions),
        "Repeat impressions": count(impressions - reach),
        "First exposure share": percentFromFraction(reach / impressions),
      };
    }
    case "hook-rate-calculator": {
      const plays = num(inputs, "threeSecondPlays");
      const impressions = num(inputs, "impressions");
      const hook = plays / impressions;
      return {
        "headline:Hook rate": percentFromFraction(hook, 2),
        "Hook rate": percentFromFraction(hook, 2),
        "Hold rate": percentFromFraction(num(inputs, "thruPlays") / plays, 2),
        "3s plays per 1,000": count(hook * 1000, 1),
      };
    }
    case "acos-calculator": {
      const spend = num(inputs, "adSpend");
      const revenue = num(inputs, "adRevenue");
      const total = num(inputs, "totalRevenue");
      const margin = num(inputs, "contributionMarginPct");
      const acos = (spend / revenue) * 100;
      return {
        "headline:ACoS": `${fixed(acos, 1)}%`,
        "Break-even ACoS": `${count(margin)}%`,
        Headroom: `${fixed(margin - acos, 1)} pts`,
        TACoS: `${fixed((spend / total) * 100, 1)}%`,
        "ROAS equivalent": ratio(revenue / spend),
        "Ad-attributed sales": money(revenue),
        Advertising: money(-spend),
      };
    }
    case "aov-calculator": {
      const revenue = num(inputs, "revenue");
      const orders = num(inputs, "orders");
      const aov = revenue / orders;
      const increase = scenarioNum(inputs, "aovIncrease", 10);
      return {
        "headline:Average order value": money(aov),
        "Orders held constant": count(orders),
        "Additional revenue": money(increase * orders, 0),
        "Scenario revenue": money((aov + increase) * orders, 0),
        "Current revenue": money(revenue, 0),
      };
    }
    case "contribution-margin-calculator": {
      const price = num(inputs, "price");
      const processing =
        (price * num(inputs, "processingRatePct")) / 100 +
        num(inputs, "processingFixed");
      const contribution =
        price -
        num(inputs, "cogs") -
        num(inputs, "shipping") -
        processing -
        num(inputs, "otherVariable");
      return {
        "headline:Contribution margin per order": money(contribution),
        "Selling price": money(price),
        "Product cost": money(-num(inputs, "cogs")),
        "Shipping & fulfillment": money(-num(inputs, "shipping")),
        "Payment processing": money(-processing),
        "Other variable costs": money(-num(inputs, "otherVariable")),
        "Contribution rate": percentFromFraction(contribution / price),
        "Contribution / 100 orders": money(contribution * 100, 0),
      };
    }
    case "ltv-calculator": {
      const annualRevenue = num(inputs, "aov") * num(inputs, "ordersPerYear");
      const revenueLtv = annualRevenue * num(inputs, "years");
      const contributionLtv = revenueLtv * (num(inputs, "marginRatePct") / 100);
      return {
        "headline:Margin LTV": money(contributionLtv),
        "Revenue LTV": money(revenueLtv),
        "Contribution LTV": money(contributionLtv),
        "Expected lifetime orders": count(
          num(inputs, "ordersPerYear") * num(inputs, "years"),
          1,
        ),
        "Contribution per year": money(
          annualRevenue * (num(inputs, "marginRatePct") / 100),
        ),
      };
    }
    case "cac-calculator": {
      const paid = num(inputs, "paidSpend");
      const other = num(inputs, "otherSmSpend");
      const customers = num(inputs, "newCustomers");
      return {
        "headline:Blended CAC": money((paid + other) / customers),
        "Fully loaded CAC": money((paid + other) / customers),
        "Paid CAC": money(paid / customers),
        "Non-media cost / customer": money(other / customers),
        "Media share of spend": percentFromFraction(paid / (paid + other)),
      };
    }
    case "ltv-cac-ratio-calculator": {
      const ltv = num(inputs, "ltv");
      const cac = num(inputs, "cac");
      return {
        "headline:LTV:CAC ratio": fixed(ltv / cac, 2),
        "Margin left per customer": money(ltv - cac),
        "Acquisition share of LTV": percentFromFraction(cac / ltv),
      };
    }
    case "cac-payback-calculator": {
      const cac = num(inputs, "cac");
      const perOrder = num(inputs, "aov") * (num(inputs, "marginRatePct") / 100);
      const monthly = perOrder * num(inputs, "ordersPerMonth");
      const inspectMonth = scenarioNum(inputs, "inspectMonth", 6);
      return {
        "headline:CAC payback": `${fixed(cac / monthly, 1)} mo`,
        "Contribution by this month": money(monthly * inspectMonth),
        "CAC still unrecovered": money(Math.max(0, cac - monthly * inspectMonth)),
        "Contribution per month": money(monthly),
        "Contribution per order": money(perOrder),
      };
    }
    case "marketing-roi-calculator": {
      const revenue = num(inputs, "revenue");
      const cost = num(inputs, "cost");
      const net = revenue * (num(inputs, "marginRatePct") / 100) - cost;
      return {
        "headline:Marketing ROI": `${fixed((net / cost) * 100, 1)}%`,
        "Gross profit − marketing": money(net),
        "Same inputs as ROAS": ratio(revenue / cost),
      };
    }
    case "discount-breakeven-calculator": {
      const margin = num(inputs, "contributionMarginPct");
      const discount = num(inputs, "discountPct");
      const units = num(inputs, "currentUnits");
      const retained = margin - discount;
      if (retained <= 0) {
        return {
          "headline:Volume lift to break even": "Cannot break even",
          "text:retained": `${fixed(retained, 1)} pts`,
        };
      }
      const lift = (discount / retained) * 100;
      return {
        "headline:Volume lift to break even": `+${fixed(lift, 1)}%`,
        "text:retained": `${fixed(retained, 1)} pts`,
        "text:units": count(units),
        "text:unitsNeeded": count(Math.ceil(units * (1 + lift / 100))),
      };
    }
    case "free-shipping-threshold-calculator": {
      const aov = num(inputs, "aov");
      const shipping = num(inputs, "shippingCost");
      const threshold =
        Math.round((aov * (1 + num(inputs, "upliftPct") / 100)) / 5) * 5;
      return {
        "headline:Suggested free shipping threshold": money(threshold, 0),
        "Threshold above AOV": money(threshold - aov),
        "Extra cart value to cover shipping": money(
          shipping / (num(inputs, "contributionMarginPct") / 100),
        ),
        "Shipping subsidy": money(shipping),
        Threshold: money(threshold),
      };
    }
    case "ab-test-significance-calculator": {
      const nA = num(inputs, "visitorsA");
      const cA = num(inputs, "conversionsA");
      const nB = num(inputs, "visitorsB");
      const cB = num(inputs, "conversionsB");
      const valid = nA > 0 && nB > 0 && cA <= nA && cB <= nB;
      if (!valid) return { "headline:Verdict": "Check inputs" };
      const rateA = cA / nA;
      const rateB = cB / nB;
      const pooled = (cA + cB) / (nA + nB);
      const standardError = Math.sqrt(
        pooled * (1 - pooled) * (1 / nA + 1 / nB),
      );
      const z = standardError ? (rateB - rateA) / standardError : 0;
      const pValue = 2 * (1 - normalCdf(Math.abs(z)));
      return {
        "headline:Verdict": pValue < 0.05 ? "Significant" : "Not significant",
        "text:p": pValue < 0.001 ? "< 0.001" : fixed(pValue, 3),
        "Relative lift (B vs A)": `${fixed(((rateB - rateA) / rateA) * 100, 1)}%`,
        "Rate difference": `${fixed((rateB - rateA) * 100, 2)} pts`,
        "z-score": fixed(z, 2),
        "text:rateA": percentFromFraction(rateA, 2),
        "text:rateB": percentFromFraction(rateB, 2),
      };
    }
    case "ab-test-sample-size-calculator": {
      const baseline = num(inputs, "baselinePct") / 100;
      const target = Math.min(
        baseline * (1 + num(inputs, "mdeRelPct") / 100),
        1,
      );
      const difference = target - baseline;
      const average = (baseline + target) / 2;
      const zAlpha: Record<number, number> = {
        90: 1.6449,
        95: 1.95996,
        99: 2.5758,
      };
      const zBeta: Record<number, number> = { 80: 0.84162, 90: 1.28155 };
      const first =
        zAlpha[num(inputs, "significance")] *
        Math.sqrt(2 * average * (1 - average));
      const second =
        zBeta[num(inputs, "power")] *
        Math.sqrt(
          baseline * (1 - baseline) + target * (1 - target),
        );
      const perVariant = Math.ceil(((first + second) ** 2) / difference ** 2);
      const total = perVariant * 2;
      return {
        "headline:Visitors per variant": count(perVariant),
        "Total visitors needed": count(total),
        "Days at your traffic": `${count(total / num(inputs, "dailySessions"), 1)} days`,
        "Target conversion rate": `${fixed(target * 100, 2)}%`,
      };
    }
    case "creative-testing-budget-calculator": {
      const total =
        num(inputs, "expectedCpa") *
        num(inputs, "ordersPerConcept") *
        num(inputs, "concepts");
      const daily = num(inputs, "dailyBudget");
      return {
        "headline:Total test budget": money(total, 0),
        "Total test budget": money(total, 0),
        "Estimated flight": daily
          ? `${count(total / daily, 1)} days`
          : "No daily budget",
      };
    }
    case "utm-builder": {
      const rawUrl = text(inputs, "url").trim();
      try {
        const url = new URL(
          /^[a-z][a-z\d+.-]*:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`,
        );
        const keys = ["source", "medium", "campaign", "term", "content"];
        for (const key of keys) {
          url.searchParams.delete(`utm_${key}`);
          const value = text(inputs, key).trim().toLowerCase().replace(/\s+/g, "-");
          if (value) url.searchParams.append(`utm_${key}`, value);
        }
        return { "text:url": url.toString() };
      } catch {
        return { "text:url": "" };
      }
    }
    case "ad-character-counter": {
      if (mode === "google") {
        const headline = text(inputs, "headline");
        return {
          "headline:Headline characters": `${[...headline].length} / 30`,
          ...characterStats("Headline", headline, 30),
          ...characterStats("Description", text(inputs, "description"), 90),
        };
      }
      const primary = text(inputs, "primary");
      const label = mode === "tiktok" ? "Ad text" : "Primary text";
      const limit = mode === "tiktok" ? 100 : 125;
      return {
        [`headline:${label} characters`]: `${[...primary].length} / ${limit}`,
        ...characterStats(label, primary, limit),
        ...(mode === "meta"
          ? {
              ...characterStats("Headline", text(inputs, "headline"), 40),
              ...characterStats("Description", text(inputs, "description"), 30),
            }
          : {}),
      };
    }
    default:
      throw new Error(`Unknown calculator: ${toolId}`);
  }
}
