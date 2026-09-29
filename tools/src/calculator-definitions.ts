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
  kind?: "number" | "range" | "text" | "textarea" | "select";
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
  guidance: string;
  calculation: string;
  formula: string;
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
    guidance: "Use this before setting a media budget. A strong projection produces enough revenue to cover spend and the contribution costs behind each order. A weak projection shows which funnel assumption needs work before more budget enters the system.",
    calculation: "Budget and CPM produce impressions. Click rate turns impressions into visits, conversion rate turns visits into orders, and order value turns orders into revenue.",
    formula: "revenue = (budget / CPM × 1,000) × click rate × conversion rate × order value",
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
    guidance: "Use this when a revenue target is fixed and you need the media requirement. The plan is workable when the required spend, daily pace, and implied acquisition cost fit your cash and contribution limits. If they do not, change the target or improve the funnel first.",
    calculation: "Revenue goal divided by order value gives required orders. Orders divided by conversion rate gives required clicks. Clicks multiplied by click cost gives the budget.",
    formula: "budget = (revenue goal / order value / conversion rate) × cost per click",
    fields: [
      n("revenueGoal", "Revenue goal", 50000, "$"),
      n("aov", "Average order value", 80, "$"),
      n("cvrPct", "Conversion rate", 3, "%", { step: 0.1 }),
      n("cpc", "Cost per click", 1.87, "$", { step: 0.01 }),
      n("flightDays", "Campaign length", 30, "count", { min: 7, max: 90, step: 1 }),
    ],
  },
  {
    id: "roas-calculator",
    name: "ROAS Calculator",
    category: "Ad Metrics",
    tells: "See return on ad spend or the spend ceiling for a target return.",
    guidance: "Use this to compare attributed revenue with media spend or to set a spend ceiling. More revenue per ad dollar is directionally better, but the reading is only healthy when it also clears your contribution costs.",
    calculation: "ROAS divides attributed revenue by ad spend. Allowed spend reverses the same relationship by dividing revenue by the target ROAS.",
    formula: "ROAS = attributed revenue / ad spend",
    modes: [
      { value: "roas", label: "Solve For ROAS" },
      { value: "allowed-spend", label: "Solve For Allowed Spend" },
    ],
    fields: [
      n("revenue", "Revenue", 25000, "$"),
      n("spend", "Ad spend", 10000, "$", { modes: ["roas"] }),
      n("targetRoas", "Target ROAS", 3, "x", { step: 0.1, modes: ["allowed-spend"] }),
      n("exploreTargetRoas", "Explore target ROAS", 3, "x", { kind: "range", min: 0.5, max: 8, step: 0.1 }),
    ],
  },
  {
    id: "breakeven-roas-calculator",
    name: "Break-Even ROAS Calculator",
    category: "Profitability",
    tells: "Find the return required to cover variable costs and media.",
    guidance: "Use this as the first order guardrail for media decisions. Achieved ROAS above break-even leaves contribution after ad spend. At or below break-even, the order has no profit left after variable costs and media.",
    calculation: "We subtract product, fulfillment, processing, and other variable costs from order value. Order value divided by that pre-ad contribution gives break-even ROAS.",
    formula: "break-even ROAS = order value / (order value - product cost - shipping - processing - other costs)",
    fields: [
      n("aov", "Average order value", 80, "$"),
      n("cogs", "Product cost", 22, "$"),
      n("shipping", "Shipping and fulfillment", 8, "$"),
      n("processingRatePct", "Processing rate", 2.9, "%", { step: 0.1 }),
      n("processingFixed", "Fixed processing fee", 0.3, "$", { step: 0.05 }),
      n("otherVariable", "Other variable costs", 2, "$"),
      n("achievedRoas", "Achieved ROAS", 3, "x", { kind: "range", min: 0.5, max: 8, step: 0.1 }),
    ],
  },
  {
    id: "mer-calculator",
    name: "MER Calculator",
    category: "Ad Metrics",
    tells: "Measure total store revenue against total advertising spend.",
    guidance: "Use this for the blended view across channels. A rising MER means more store revenue per ad dollar, while a falling MER means media is taking a larger share of revenue. Contribution still decides whether either reading is profitable.",
    calculation: "We divide total store revenue by all advertising spend, then show advertising as a share of revenue.",
    formula: "MER = total store revenue / total ad spend",
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
    guidance: "Use this to plan acquisition volume or check what each conversion costs. A lower CPA creates more room for contribution, while a CPA above the value created by a conversion makes additional scale destructive.",
    calculation: "Cost per acquisition divides spend by conversions. The other modes rearrange the same relationship to solve for conversion volume or required budget.",
    formula: "CPA = ad spend / conversions",
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
    guidance: "Use this to understand the price of reaching the market. A lower CPM buys more reach for the same spend. A higher CPM needs stronger click and conversion performance to produce the same economics.",
    calculation: "We divide spend by impressions and multiply by one thousand. Spend and impression modes rearrange that same equation.",
    formula: "CPM = ad spend / impressions × 1,000",
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
    guidance: "Use this to isolate the cost of earning a visit. Lower click cost preserves more budget for conversion, while higher click cost requires stronger on-site conversion or order value to hold acquisition cost.",
    calculation: "Spend mode divides ad spend by link clicks. Auction mode divides CPM by ten times the click-through rate.",
    formula: "cost per click = ad spend / link clicks",
    modes: [
      { value: "spend", label: "From Spend And Clicks" },
      { value: "auction", label: "From CPM And CTR" },
    ],
    fields: [
      n("spend", "Ad spend", 2400, "$", { modes: ["spend"] }),
      n("clicks", "Link clicks", 1284, "count", { modes: ["spend"] }),
      n("cpm", "CPM", 28, "$", { modes: ["auction"] }),
      n("ctrPct", "Link CTR", 1.5, "%", { step: 0.1, modes: ["auction"] }),
      n("exploreSpend", "Scenario spend", 100, "$", { kind: "range", min: 10, max: 1000, step: 10 }),
    ],
  },
  {
    id: "ctr-calculator",
    name: "CTR Calculator",
    category: "Ad Metrics",
    tells: "Measure link click rate or forecast clicks from planned reach.",
    guidance: "Use this to judge whether an ad earns traffic from the impressions it receives. A higher rate means more people choose to click. A lower rate points to the offer, message, creative, or audience before it points to the landing page.",
    calculation: "We divide link clicks by impressions and convert the result to a percentage. Click forecast mode multiplies planned impressions by the planned rate.",
    formula: "click-through rate = link clicks / impressions × 100",
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
    guidance: "Use this to connect site traffic with completed orders. A higher rate means more sessions become customers. A lower rate means paid traffic is arriving without enough purchases to support acquisition cost.",
    calculation: "We divide orders by sessions. Revenue multiplies orders by order value, and the lift scenario adds half a percentage point to the current conversion rate.",
    formula: "conversion rate = orders / sessions × 100",
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
    guidance: "Use this to watch repeat exposure. Rising frequency without stronger outcomes can signal fatigue or a constrained audience. Very low frequency can mean the message has not had enough chances to register.",
    calculation: "We divide total impressions by unique reach. Repeat impressions subtract reached people from all impressions.",
    formula: "frequency = impressions / reach",
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
    guidance: "Use this to separate the opening seconds from the rest of the video. A stronger hook rate means more impressions become viewers. A weak hold rate after a strong hook means the opening earns attention that the body does not keep.",
    calculation: "Hook rate divides three-second plays by impressions. Hold rate divides ThruPlays by three-second plays.",
    formula: "hook rate = three-second plays / impressions × 100",
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
    guidance: "Use this when advertising is managed as a share of attributed sales. ACoS below contribution margin leaves room before fixed costs. ACoS above contribution margin spends more on advertising than the order can contribute.",
    calculation: "We divide ad spend by attributed revenue. TACoS uses total revenue, and the ROAS equivalent reverses the ACoS relationship.",
    formula: "ACoS = ad spend / attributed revenue × 100",
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
    guidance: "Use this for pricing, bundles, and merchandising decisions. Higher order value creates more revenue per transaction when margin holds. A lift that comes from heavy discounting can raise AOV without improving contribution.",
    calculation: "We divide total revenue by order count. The scenario holds order volume constant and adds the selected increase to every order.",
    formula: "average order value = total revenue / orders",
    fields: [
      n("revenue", "Total revenue", 48600, "$"),
      n("orders", "Orders", 610, "count"),
      n("aovIncrease", "AOV increase", 10, "$", { kind: "range", min: 0, max: 100, step: 5 }),
    ],
  },
  {
    id: "contribution-margin-calculator",
    name: "Contribution Margin Calculator",
    category: "Profitability",
    tells: "See what one order contributes after every variable cost.",
    guidance: "Use this before judging media efficiency or setting acquisition limits. Positive contribution creates room for advertising and fixed costs. Zero or negative contribution means the order loses money before acquisition spend.",
    calculation: "We subtract product cost, fulfillment, percentage and fixed processing fees, and other variable costs from selling price.",
    formula: "contribution margin = selling price - product cost - shipping - processing - other variable costs",
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
    guidance: "Use this to size the long-term value available to repay acquisition. Higher contribution LTV creates more room for CAC. Weak LTV points to order value, purchase frequency, lifespan, or margin as the limiting lever.",
    calculation: "Order value times annual orders gives annual revenue. We multiply by customer lifespan and contribution rate to get margin-basis lifetime value.",
    formula: "contribution LTV = order value × orders per year × years × contribution margin rate",
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
    guidance: "Use this to stop non-media acquisition costs from disappearing from the decision. Fully loaded CAC is healthy only when customer contribution can repay it. A widening gap from paid CAC shows the cost outside media is growing.",
    calculation: "Paid CAC divides media spend by new customers. Blended CAC adds other acquisition spend before dividing by the same customer count.",
    formula: "blended CAC = (paid media spend + other acquisition spend) / new customers",
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
    guidance: "Use this to compare customer value with the cost to acquire it. A ratio above one leaves lifetime contribution after CAC. A ratio below one means acquisition costs more than the customer contributes.",
    calculation: "We divide margin-basis customer lifetime value by customer acquisition cost, then show the contribution left after CAC.",
    formula: "LTV:CAC ratio = contribution LTV / customer acquisition cost",
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
    guidance: "Use this to understand how long acquisition cash stays tied up. Shorter payback returns cash sooner for reinvestment. Longer payback increases the funding required to keep acquiring customers.",
    calculation: "Order value times contribution rate gives contribution per order. We multiply by monthly order frequency, then divide CAC by monthly contribution.",
    formula: "payback months = CAC / (order value × contribution margin rate × orders per month)",
    fields: [
      n("cac", "Customer acquisition cost", 60, "$"),
      n("aov", "Average order value", 80, "$"),
      n("marginRatePct", "Contribution margin rate", 55, "%"),
      n("ordersPerMonth", "Orders per customer per month", 0.2, "count", { step: 0.05 }),
      n("inspectMonth", "Inspect month", 6, "months", { kind: "range", min: 1, max: 60, step: 1 }),
    ],
  },
  {
    id: "marketing-roi-calculator",
    name: "Marketing ROI Calculator",
    category: "Profitability",
    tells: "Measure marketing return after gross margin, not just topline revenue.",
    guidance: "Use this when topline ROAS hides the cost of goods behind attributed revenue. Positive ROI means gross profit clears marketing cost. Negative ROI means the campaign destroys margin even if revenue looks healthy.",
    calculation: "We multiply attributed revenue by gross margin rate, subtract marketing cost, then divide the net return by marketing cost.",
    formula: "marketing ROI = (attributed revenue × gross margin rate - marketing cost) / marketing cost × 100",
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
    guidance: "Use this before launching a promotion. The discount works only if the required unit lift is realistic for the offer and inventory. If the discount consumes all contribution, no sales volume can restore the original contribution.",
    calculation: "We subtract discount rate from contribution margin, then divide the discount by the contribution rate that remains.",
    formula: "required volume lift = discount rate / (contribution margin rate - discount rate)",
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
    guidance: "Use this to set a cart target before offering free shipping. The threshold is stronger when the added cart contribution covers the shipping subsidy. If the required cart lift is larger than the threshold gap, the offer erodes contribution.",
    calculation: "We increase current order value by the selected uplift and round to the nearest five dollars. Shipping cost divided by contribution rate gives the cart lift needed to fund shipping.",
    formula: "cart lift needed = shipping cost / contribution margin rate",
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
    guidance: "Use this after both variants have collected visitors and conversions. A significant result says the observed gap is unlikely under equal conversion rates. A result that is not significant means the data does not yet separate signal from noise.",
    calculation: "We compare both conversion rates with a pooled two-proportion z-test and convert the z-score to a two-tailed p-value.",
    formula: "z = (variant B rate - variant A rate) / pooled standard error",
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
    guidance: "Use this before starting a fixed-horizon test. A traffic requirement that fits the available audience supports the planned effect size. An impractical requirement means the test needs more traffic, a larger detectable effect, or a different decision method.",
    calculation: "We convert baseline rate and relative effect into two rates, then combine the selected confidence and power constants to estimate visitors per variant.",
    formula: "visitors per variant = (confidence term + power term)² / rate difference²",
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
    guidance: "Use this before launching a concept test. The budget is workable when every concept can receive the planned order volume without starving the comparison. If the flight is too long or expensive, reduce scope before launch.",
    calculation: "Expected CPA multiplied by target orders gives budget per concept. We multiply that by concept count and divide by daily budget for flight length.",
    formula: "total test budget = expected CPA × orders per concept × concepts",
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
    guidance: "Use this before trafficking links across channels. A good URL has a valid destination and consistent source, medium, and campaign values. Missing or inconsistent tags split reporting and make campaign comparisons harder.",
    calculation: "We trim and lowercase each tag, replace spaces with hyphens, remove existing UTM fields, then append the new values while preserving other URL parameters.",
    formula: "campaign URL = destination URL + normalized UTM parameters",
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
    guidance: "Use this before copy enters a platform or handoff. Copy inside the selected placement window is less likely to be clipped. Copy above the window needs a tighter opening or headline before trafficking.",
    calculation: "We count Unicode code points for characters and split trimmed copy on whitespace for words, then compare each count with the selected platform window.",
    formula: "remaining characters = placement limit - character count",
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
