import type { FieldDefinition } from "./calculator-definitions";

/**
 * Every numeric input renders as a slider. A slider moves along a list of
 * allowed values ("stops"). Small ranges use one even step. Large ranges use a
 * stepped ladder (fine steps at the low end, coarser steps higher up) so a
 * thumb on a phone can still land on useful numbers from $0 to $5M.
 */
export type SliderScale = {
  /** Human-readable summary of the range, used in docs and the report. */
  summary: string;
  stops: number[];
};

const round = (value: number) => Math.round(value * 10000) / 10000;

/** Build stops from `start` through each [end, step] segment in order. */
function ladder(start: number, ...segments: Array<[number, number]>): number[] {
  const stops = [start];
  let current = start;
  for (const [end, step] of segments) {
    while (current < end - 1e-9) {
      current = round(current + step);
      stops.push(Math.min(current, end));
    }
  }
  return stops;
}

const linear = (min: number, max: number, step: number) => ladder(min, [max, step]);

const fmt = (value: number) => value.toLocaleString("en-US");

function scale(summary: string, stops: number[]): SliderScale {
  return { summary, stops };
}

// Money ladders
const moneyTo1M = () =>
  scale("$0 to $1M (stepped: $50 → $250 → $1K → $10K)", ladder(0, [1000, 50], [10000, 250], [100000, 1000], [1000000, 10000]));
const moneyTo5M = () =>
  scale(
    "$0 to $5M (stepped: $50 → $250 → $1K → $10K → $50K)",
    ladder(0, [1000, 50], [10000, 250], [100000, 1000], [1000000, 10000], [5000000, 50000]),
  );
const orderValue = () => scale("$5 to $1,000 ($1 steps to $300, then $5)", ladder(5, [300, 1], [1000, 5]));
const unitCost = (max: number, step: number) => scale(`$0 to $${fmt(max)} ($${step} steps)`, linear(0, max, step));
const pct = (min: number, max: number, step: number) => scale(`${min}% to ${max}% (${step} steps)`, linear(min, max, step));

// Count ladders
const countTo10M = () =>
  scale(
    "0 to 10M (stepped: 100 → 1K → 5K → 50K)",
    ladder(0, [10000, 100], [100000, 1000], [1000000, 5000], [10000000, 50000]),
  );
const countTo100K = () =>
  scale("0 to 100K (stepped: 10 → 100 → 1K)", ladder(0, [1000, 10], [10000, 100], [100000, 1000]));
const countTo20K = () =>
  scale("0 to 20K (stepped: 1 → 10 → 100)", ladder(0, [200, 1], [2000, 10], [20000, 100]));

const byKey: Record<string, () => SliderScale> = {
  // Budgets, spend and revenue
  budget: moneyTo1M,
  spend: moneyTo1M,
  adSpend: moneyTo1M,
  paidSpend: moneyTo1M,
  otherSmSpend: moneyTo1M,
  cost: moneyTo1M,
  totalAdSpend: moneyTo1M,
  revenue: moneyTo5M,
  revenueGoal: moneyTo5M,
  totalRevenue: moneyTo5M,
  adRevenue: moneyTo5M,
  dailyBudget: () => scale("$10 to $10K (stepped: $10 → $50 → $250)", ladder(10, [500, 10], [2000, 50], [10000, 250])),

  // Per-order money
  aov: orderValue,
  price: orderValue,
  cogs: () => unitCost(300, 1),
  shipping: () => scale("$0 to $50 ($0.50 steps)", linear(0, 50, 0.5)),
  shippingCost: () => scale("$0 to $50 ($0.50 steps)", linear(0, 50, 0.5)),
  otherVariable: () => scale("$0 to $50 ($0.50 steps)", linear(0, 50, 0.5)),
  processingFixed: () => scale("$0 to $1 ($0.05 steps)", linear(0, 1, 0.05)),

  // Media prices
  cpm: () => scale("$1 to $100 ($0.50 steps)", linear(1, 100, 0.5)),
  cpc: () => scale("$0.05 to $20 ($0.01 steps to $5, then $0.05)", ladder(0.05, [5, 0.01], [20, 0.05])),
  targetCpa: () => scale("$1 to $1,000 ($1 steps to $300, then $5)", ladder(1, [300, 1], [1000, 5])),
  expectedCpa: () => scale("$1 to $1,000 ($1 steps to $300, then $5)", ladder(1, [300, 1], [1000, 5])),
  cac: () => scale("$1 to $1,000 ($1 steps to $300, then $5)", ladder(1, [300, 1], [1000, 5])),
  ltv: () => scale("$0 to $5,000 ($5 steps to $1K, then $25)", ladder(0, [1000, 5], [5000, 25])),

  // Rates
  ctrPct: () => pct(0.1, 10, 0.1),
  planCtrPct: () => pct(0.1, 10, 0.1),
  cvrPct: () => pct(0.1, 10, 0.1),
  baselinePct: () => pct(0.1, 20, 0.1),
  processingRatePct: () => pct(0, 6, 0.1),
  contributionMarginPct: () => pct(0, 100, 1),
  marginRatePct: () => pct(0, 100, 1),
  discountPct: () => pct(0, 90, 1),
  upliftPct: () => pct(0, 100, 5),
  mdeRelPct: () => pct(1, 100, 1),

  // ROAS
  targetRoas: () => scale("0.5x to 10x (0.1 steps)", linear(0.5, 10, 0.1)),

  // Volumes
  impressions: countTo10M,
  planImpressions: countTo10M,
  reach: countTo10M,
  threeSecondPlays: countTo10M,
  thruPlays: countTo10M,
  clicks: countTo100K,
  sessions: countTo100K,
  orders: countTo100K,
  visitorsA: countTo100K,
  visitorsB: countTo100K,
  dailySessions: () => scale("100 to 100K (stepped: 100 → 1K)", ladder(100, [10000, 100], [100000, 1000])),
  conversions: countTo20K,
  conversionsGoal: countTo20K,
  conversionsA: countTo20K,
  conversionsB: countTo20K,
  newCustomers: countTo20K,
  currentUnits: countTo20K,
  ordersPerConcept: () => scale("5 to 200 (5 steps)", linear(5, 200, 5)),
  concepts: () => scale("1 to 20 (1 steps)", linear(1, 20, 1)),

  // Frequency and time
  ordersPerYear: () => scale("0.1 to 12 orders (0.1 steps)", linear(0.1, 12, 0.1)),
  ordersPerMonth: () => scale("0.05 to 2 orders (0.05 steps)", linear(0.05, 2, 0.05)),
  years: () => scale("0.5 to 10 years (0.5 steps)", linear(0.5, 10, 0.5)),
};

/** Resolve the slider scale for a numeric field. Default stays a stop. */
export function sliderScale(field: FieldDefinition): SliderScale {
  let result: SliderScale;
  if (field.kind === "range" || (field.min !== undefined && field.max !== undefined && field.step !== undefined && !byKey[field.key])) {
    // Existing explicit range controls keep their original bounds.
    const min = field.min ?? 0;
    const max = field.max ?? 100;
    const step = field.step ?? 1;
    result = scale(`${min} to ${max} (${step} steps)`, linear(min, max, step));
  } else {
    const factory = byKey[field.key];
    if (!factory) throw new Error(`No slider scale for field "${field.key}"`);
    result = factory();
  }
  const fallback = Number(field.defaultValue);
  if (Number.isFinite(fallback) && !result.stops.some((stop) => Math.abs(stop - fallback) < 1e-9)) {
    result = { ...result, stops: [...result.stops, fallback].sort((a, b) => a - b) };
  }
  return result;
}

/** Index of the stop closest to `value`. */
export function nearestStop(stops: number[], value: number): number {
  if (!Number.isFinite(value)) return 0;
  let lo = 0;
  let hi = stops.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (stops[mid] < value) lo = mid + 1;
    else hi = mid;
  }
  if (lo > 0 && Math.abs(stops[lo - 1] - value) <= Math.abs(stops[lo] - value)) return lo - 1;
  return lo;
}

function compact(value: number) {
  if (Math.abs(value) >= 1_000_000) return `${round(value / 1_000_000)}M`;
  if (Math.abs(value) >= 10_000) return `${round(value / 1000)}K`;
  return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

/** Format a field value for the live label next to the slider. */
export function formatFieldValue(field: FieldDefinition, value: number, short = false): string {
  const fractional = !Number.isInteger(round(value));
  switch (field.unit) {
    case "$": {
      if (short) return `$${compact(value)}`;
      return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: fractional ? 2 : 0,
        maximumFractionDigits: 2,
      });
    }
    case "%":
      return `${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}%`;
    case "x":
      return `${value.toFixed(1)}x`;
    case "years":
      return `${value.toLocaleString("en-US", { maximumFractionDigits: 1 })} ${value === 1 ? "year" : "years"}`;
    case "months":
      return `${value} mo`;
    default: {
      if (short) return compact(value);
      const label = value.toLocaleString("en-US", { maximumFractionDigits: 2 });
      return field.key === "flightDays" ? `${label} days` : label;
    }
  }
}
