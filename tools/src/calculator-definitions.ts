export type Category =
  | "Ad Metrics"
  | "Profitability"
  | "Customer Value"
  | "Testing"
  | "Utilities";

export type FieldDefinition = {
  key: string;
  label: string;
  defaultValue: string | number;
  unit?: "$" | "%" | "x" | "count" | "years" | "months";
  kind?: "number" | "text" | "textarea" | "select";
  options?: Array<string | number>;
  min?: number;
  max?: number;
  step?: number;
  modes?: string[];
};

export type CalculatorDefinition = {
  id: string;
  name: string;
  category: Category;
  tells: string;
  calculation: string;
  fields: FieldDefinition[];
  modes?: { value: string; label: string }[];
};

const n = (
  key: string,
  label: string,
  defaultValue: number,
  unit?: FieldDefinition["unit"],
  extra: Partial<FieldDefinition> = {},
): FieldDefinition => ({ key, label, defaultValue, unit, kind: "number", min: 0, ...extra });

export const categories: Category[] = [
  "Ad Metrics",
  "Profitability",
  "Customer Value",
  "Testing",
  "Utilities",
];

export const calculators: CalculatorDefinition[] = [
  {
    id: "ad-spend-calculator",
    name: "Ad Spend Calculator",
    category: "Ad Metrics",
    tells: "Project the traffic, orders, and revenue a media budget can produce.",
    calculation: "We move budget through CPM, click rate, conversion rate, and order value.",
    fields: [
      n("budget", "Ad budget", 10000, "$"),
      n("cpm", "CPM", 28, "$"),
      n("ctrPct", "Link CTR", 1.5, "%", { step: 0.1 }),
      n("cvrPct", "Conversion rate", 3, "%", { step: 0.1 }),
      n("aov", "Average order value", 80, "$"),
    ],
  },
  {
    id: "ad-budget-calculator",
    name: "Ad Budget Calculator",
    category: "Ad Metrics",
    tells: "Back into the budget required for a revenue target.",
    calculation: "We convert the target into orders, clicks, and spend using your AOV, CVR, and CPC.",
    fields: [
      n("revenueGoal", "Revenue goal", 50000, "$"),
      n("aov", "Average order value", 80, "$"),
      n("cvrPct", "Conversion rate", 3, "%", { step: 0.1 }),
      n("cpc", "Cost per click", 1.87, "$", { step: 0.01 }),
    ],
  },
  {
    id: "roas-calculator",
    name: "ROAS Calculator",
    category: "Ad Metrics",
    tells: "See return on ad spend or the spend ceiling for a target return.",
    calculation: "ROAS is revenue divided by spend. Allowed spend reverses that equation.",
    modes: [
      { value: "roas", label: "Solve For ROAS" },
      { value: "allowed-spend", label: "Solve For Allowed Spend" },
    ],
    fields: [
      n("revenue", "Revenue", 25000, "$"),
      n("spend", "Ad spend", 10000, "$", { modes: ["roas"] }),
      n("targetRoas", "Target ROAS", 3, "x", { step: 0.1, modes: ["allowed-spend"] }),
    ],
  },
  {
    id: "breakeven-roas-calculator",
    name: "Break-Even ROAS Calculator",
    category: "Profitability",
    tells: "Find the return required to cover variable costs and media.",
    calculation: "We divide order value by the contribution left before advertising.",
    fields: [
      n("aov", "Average order value", 80, "$"),
      n("cogs", "Product cost", 22, "$"),
      n("shipping", "Shipping and fulfillment", 8, "$"),
      n("processingRatePct", "Processing rate", 2.9, "%", { step: 0.1 }),
      n("processingFixed", "Fixed processing fee", 0.3, "$", { step: 0.05 }),
      n("otherVariable", "Other variable costs", 2, "$"),
    ],
  },
  {
    id: "mer-calculator",
    name: "MER Calculator",
    category: "Ad Metrics",
    tells: "Measure total store revenue against total advertising spend.",
    calculation: "MER is total revenue divided by all ad spend.",
    fields: [
      n("totalRevenue", "Total store revenue", 180000, "$"),
      n("totalAdSpend", "Total ad spend", 45000, "$"),
    ],
  },
  {
    id: "cpa-calculator",
    name: "CPA Calculator",
    category: "Ad Metrics",
    tells: "Solve for acquisition cost, conversions, or required budget.",
    calculation: "Each mode rearranges spend divided by conversions.",
    modes: [
      { value: "cpa", label: "Solve For CPA" },
      { value: "conversions", label: "Solve For Conversions" },
      { value: "budget", label: "Solve For Budget" },
    ],
    fields: [
      n("spend", "Ad spend", 5000, "$", { modes: ["cpa"] }),
      n("conversions", "Conversions", 80, "count", { modes: ["cpa"] }),
      n("budget", "Ad budget", 5000, "$", { modes: ["conversions"] }),
      n("targetCpa", "Target CPA", 45, "$", { modes: ["conversions", "budget"] }),
      n("conversionsGoal", "Conversion goal", 200, "count", { modes: ["budget"] }),
    ],
  },
  {
    id: "cpm-calculator",
    name: "CPM Calculator",
    category: "Ad Metrics",
    tells: "Solve the relationship between spend, impressions, and CPM.",
    calculation: "CPM is spend per thousand impressions. Each mode rearranges that equation.",
    modes: [
      { value: "cpm", label: "Solve For CPM" },
      { value: "spend", label: "Solve For Spend" },
      { value: "impressions", label: "Solve For Impressions" },
    ],
    fields: [
      n("spend", "Ad spend", 4200, "$", { modes: ["cpm", "impressions"] }),
      n("cpm", "CPM", 28, "$", { step: 0.5, modes: ["spend", "impressions"] }),
      n("impressions", "Impressions", 150000, "count", { step: 1000, modes: ["cpm", "spend"] }),
    ],
  },
  {
    id: "cpc-calculator",
    name: "CPC Calculator",
    category: "Ad Metrics",
    tells: "Find click cost from spend and clicks or from auction metrics.",
    calculation: "We divide spend by clicks, or derive click cost from CPM and CTR.",
    modes: [
      { value: "spend", label: "From Spend And Clicks" },
      { value: "auction", label: "From CPM And CTR" },
    ],
    fields: [
      n("spend", "Ad spend", 2400, "$", { modes: ["spend"] }),
      n("clicks", "Link clicks", 1284, "count", { modes: ["spend"] }),
      n("cpm", "CPM", 28, "$", { modes: ["auction"] }),
      n("ctrPct", "Link CTR", 1.5, "%", { step: 0.1, modes: ["auction"] }),
    ],
  },
  {
    id: "ctr-calculator",
    name: "CTR Calculator",
    category: "Ad Metrics",
    tells: "Measure link click rate or forecast clicks from planned reach.",
    calculation: "CTR is clicks divided by impressions.",
    modes: [
      { value: "ctr", label: "Solve For CTR" },
      { value: "clicks", label: "Solve For Clicks" },
    ],
    fields: [
      n("clicks", "Link clicks", 5357, "count", { modes: ["ctr"] }),
      n("impressions", "Impressions", 357143, "count", { modes: ["ctr"] }),
      n("planImpressions", "Planned impressions", 500000, "count", { modes: ["clicks"] }),
      n("planCtrPct", "Planned link CTR", 1.5, "%", { step: 0.1, modes: ["clicks"] }),
    ],
  },
  {
    id: "conversion-rate-calculator",
    name: "Conversion Rate Calculator",
    category: "Ad Metrics",
    tells: "Measure store conversion and the revenue impact of a modest lift.",
    calculation: "Conversion rate is orders divided by sessions.",
    fields: [
      n("orders", "Orders", 161, "count"),
      n("sessions", "Sessions", 5357, "count"),
      n("aov", "Average order value", 80, "$"),
    ],
  },
  {
    id: "ad-frequency-calculator",
    name: "Ad Frequency Calculator",
    category: "Ad Metrics",
    tells: "See how often the average reached person saw your ads.",
    calculation: "Frequency is impressions divided by reach.",
    fields: [
      n("impressions", "Impressions", 357143, "count"),
      n("reach", "Reach", 118000, "count"),
    ],
  },
  {
    id: "hook-rate-calculator",
    name: "Hook Rate Calculator",
    category: "Ad Metrics",
    tells: "Measure how often an impression becomes a three-second view.",
    calculation: "Hook rate divides three-second plays by impressions. Hold rate divides ThruPlays by hooks.",
    fields: [
      n("threeSecondPlays", "3-second video plays", 85000, "count"),
      n("impressions", "Impressions", 357143, "count"),
      n("thruPlays", "ThruPlays", 15000, "count"),
    ],
  },
  {
    id: "acos-calculator",
    name: "ACoS Calculator",
    category: "Ad Metrics",
    tells: "Compare advertising cost of sales with your contribution margin.",
    calculation: "ACoS is ad spend divided by attributed revenue.",
    fields: [
      n("adSpend", "Ad spend", 3000, "$"),
      n("adRevenue", "Attributed revenue", 12000, "$"),
      n("totalRevenue", "Total revenue", 30000, "$"),
      n("contributionMarginPct", "Contribution margin", 40, "%"),
    ],
  },
  {
    id: "aov-calculator",
    name: "AOV Calculator",
    category: "Profitability",
    tells: "Measure average order value and the impact of a larger basket.",
    calculation: "AOV is total revenue divided by orders.",
    fields: [
      n("revenue", "Total revenue", 48600, "$"),
      n("orders", "Orders", 610, "count"),
    ],
  },
  {
    id: "contribution-margin-calculator",
    name: "Contribution Margin Calculator",
    category: "Profitability",
    tells: "See what one order contributes after every variable cost.",
    calculation: "We subtract product, fulfillment, processing, and variable costs from selling price.",
    fields: [
      n("price", "Selling price", 80, "$"),
      n("cogs", "Product cost", 22, "$"),
      n("shipping", "Shipping and fulfillment", 8, "$"),
      n("processingRatePct", "Processing rate", 2.9, "%", { step: 0.1 }),
      n("processingFixed", "Fixed processing fee", 0.3, "$", { step: 0.05 }),
      n("otherVariable", "Other variable costs", 2, "$"),
    ],
  },
  {
    id: "ltv-calculator",
    name: "LTV Calculator",
    category: "Customer Value",
    tells: "Estimate revenue and contribution across a customer relationship.",
    calculation: "We multiply order value, purchase frequency, lifespan, and contribution rate.",
    fields: [
      n("aov", "Average order value", 80, "$"),
      n("ordersPerYear", "Orders per year", 2.4, "count", { step: 0.1 }),
      n("years", "Customer lifespan", 2, "years", { step: 0.5 }),
      n("marginRatePct", "Contribution margin rate", 55, "%"),
    ],
  },
  {
    id: "cac-calculator",
    name: "CAC Calculator",
    category: "Customer Value",
    tells: "Compare paid media CAC with fully loaded acquisition cost.",
    calculation: "We divide media and non-media acquisition spend by new customers.",
    fields: [
      n("paidSpend", "Paid media spend", 45000, "$"),
      n("otherSmSpend", "Other acquisition spend", 12000, "$"),
      n("newCustomers", "New customers", 950, "count"),
    ],
  },
  {
    id: "ltv-cac-ratio-calculator",
    name: "LTV:CAC Ratio Calculator",
    category: "Customer Value",
    tells: "See how much contribution value you earn for each acquisition dollar.",
    calculation: "We divide margin-basis lifetime value by customer acquisition cost.",
    fields: [
      n("ltv", "Customer lifetime value", 210, "$"),
      n("cac", "Customer acquisition cost", 60, "$"),
    ],
  },
  {
    id: "cac-payback-calculator",
    name: "CAC Payback Calculator",
    category: "Customer Value",
    tells: "Estimate how many months contribution takes to repay CAC.",
    calculation: "We divide CAC by monthly contribution per customer.",
    fields: [
      n("cac", "Customer acquisition cost", 60, "$"),
      n("aov", "Average order value", 80, "$"),
      n("marginRatePct", "Contribution margin rate", 55, "%"),
      n("ordersPerMonth", "Orders per customer per month", 0.2, "count", { step: 0.05 }),
    ],
  },
  {
    id: "marketing-roi-calculator",
    name: "Marketing ROI Calculator",
    category: "Profitability",
    tells: "Measure marketing return after gross margin, not just topline revenue.",
    calculation: "We subtract marketing cost from attributed gross profit, then divide by cost.",
    fields: [
      n("revenue", "Attributed revenue", 25000, "$"),
      n("marginRatePct", "Gross margin rate", 55, "%"),
      n("cost", "Total marketing cost", 10000, "$"),
    ],
  },
  {
    id: "discount-breakeven-calculator",
    name: "Discount Break-Even Calculator",
    category: "Profitability",
    tells: "Find the unit lift a discount needs to preserve contribution.",
    calculation: "We compare the discount with the contribution rate left after discounting.",
    fields: [
      n("contributionMarginPct", "Contribution margin", 55, "%"),
      n("discountPct", "Discount", 20, "%"),
      n("currentUnits", "Current units", 500, "count"),
    ],
  },
  {
    id: "free-shipping-threshold-calculator",
    name: "Free Shipping Threshold Calculator",
    category: "Profitability",
    tells: "Set a threshold that can cover the shipping subsidy.",
    calculation: "We add a planned lift to AOV, round to five dollars, and compare added contribution with shipping.",
    fields: [
      n("aov", "Average order value", 80, "$"),
      n("shippingCost", "Shipping cost per order", 8, "$"),
      n("contributionMarginPct", "Contribution margin", 55, "%"),
      n("upliftPct", "Uplift above AOV", 25, "%", { step: 5 }),
    ],
  },
  {
    id: "ab-test-significance-calculator",
    name: "A/B Test Significance Calculator",
    category: "Testing",
    tells: "Check whether the observed conversion gap is statistically significant.",
    calculation: "We run a two-sided, two-proportion z-test at a 0.05 threshold.",
    fields: [
      n("visitorsA", "Variant A visitors", 4800, "count"),
      n("conversionsA", "Variant A conversions", 144, "count"),
      n("visitorsB", "Variant B visitors", 4800, "count"),
      n("conversionsB", "Variant B conversions", 180, "count"),
    ],
  },
  {
    id: "ab-test-sample-size-calculator",
    name: "A/B Test Sample Size Calculator",
    category: "Testing",
    tells: "Estimate the traffic required for a fixed-horizon conversion test.",
    calculation: "We use baseline rate, relative effect, confidence, and power to size each variant.",
    fields: [
      n("baselinePct", "Baseline conversion rate", 3, "%", { step: 0.1 }),
      n("mdeRelPct", "Minimum detectable effect", 20, "%"),
      { key: "significance", label: "Significance", defaultValue: 95, kind: "select", options: [90, 95, 99], unit: "%" },
      { key: "power", label: "Power", defaultValue: 80, kind: "select", options: [80, 90], unit: "%" },
      n("dailySessions", "Daily visitors in test", 5000, "count", { step: 100 }),
    ],
  },
  {
    id: "creative-testing-budget-calculator",
    name: "Creative Testing Budget Calculator",
    category: "Testing",
    tells: "Set a test budget from concepts, target orders, and expected CPA.",
    calculation: "We multiply expected CPA by orders per concept and the number of concepts.",
    fields: [
      n("expectedCpa", "Expected CPA", 62, "$"),
      n("ordersPerConcept", "Orders per concept", 50, "count", { step: 5 }),
      n("concepts", "Concepts in test", 4, "count"),
      n("dailyBudget", "Daily test budget", 400, "$"),
    ],
  },
  {
    id: "utm-builder",
    name: "UTM Builder",
    category: "Utilities",
    tells: "Build a clean, consistently tagged campaign URL.",
    calculation: "We normalize each tag, replace existing UTM values, and preserve other URL parameters.",
    fields: [
      { key: "url", label: "Destination URL", defaultValue: "https://doemedia.com", kind: "text" },
      { key: "source", label: "Source", defaultValue: "facebook", kind: "text" },
      { key: "medium", label: "Medium", defaultValue: "paid-social", kind: "text" },
      { key: "campaign", label: "Campaign", defaultValue: "growth-review", kind: "text" },
      { key: "term", label: "Term", defaultValue: "", kind: "text" },
      { key: "content", label: "Content", defaultValue: "", kind: "text" },
    ],
  },
  {
    id: "ad-character-counter",
    name: "Ad Character Counter",
    category: "Utilities",
    tells: "Check ad copy length against common placement windows.",
    calculation: "We count Unicode characters and whitespace-separated words for each field.",
    modes: [
      { value: "meta", label: "Meta" },
      { value: "google", label: "Google" },
      { value: "tiktok", label: "TikTok" },
    ],
    fields: [
      { key: "primary", label: "Primary text", defaultValue: "Clear copy starts with the customer problem and earns the next line.", kind: "textarea", modes: ["meta", "tiktok"] },
      { key: "headline", label: "Headline", defaultValue: "Data Over Ego", kind: "text", modes: ["meta", "google"] },
      { key: "description", label: "Description", defaultValue: "Use the number that changes the decision.", kind: "text", modes: ["meta", "google"] },
    ],
  },
];
