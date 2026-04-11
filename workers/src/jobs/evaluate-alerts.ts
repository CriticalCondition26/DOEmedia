import type { Job } from "bullmq";
import { db } from "@doemedia/db";
import {
  clients,
  metaAdAccounts,
  adInsightsDaily,
  accountAlerts,
  alertPreferences,
} from "@doemedia/db";
import { eq, sql, and, gte, lt, lte, desc } from "drizzle-orm";
import {
  DEFAULT_ALERT_RULES,
  ALERT_DAILY_LOOKBACK,
  ALERT_WEEKLY_LOOKBACK,
  MAX_ALERTS_PER_ACCOUNT_PER_DAY,
  type AlertType,
  type AlertSeverity,
  type AlertRuleConfig,
  type EvaluatedAlert,
  type AlertMetrics,
} from "@doemedia/shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AccountContext {
  clientId: string;
  clientName: string;
  metaAccountDbId: string;
  metaAccountId: string;
  accountName: string;
  monthlySpend: number | null;
  roasTarget: number | null;
  cpaTarget: number | null;
}

interface PeriodMetrics {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalPurchases: number;
  totalRevenue: number;
  avgCtr: number;
  roas: number;
  cpa: number;
  cpm: number;
  days: number;
}

// ---------------------------------------------------------------------------
// Main Job
// ---------------------------------------------------------------------------

/**
 * Evaluate alert rules across all active accounts.
 * Runs hourly via the scheduler. For each account:
 * 1. Pull current period vs comparison period metrics
 * 2. Evaluate each enabled alert rule
 * 3. Fire alerts that exceed thresholds
 * 4. Deduplicate against recently fired alerts
 */
export async function evaluateAlerts(job: Job) {
  console.log("Starting alert evaluation...");

  // Get all active clients with their Meta accounts
  const activeClients = await db
    .select({
      clientId: clients.id,
      clientName: clients.name,
      monthlySpend: clients.monthlySpend,
      roasTarget: clients.roasTarget,
      cpaTarget: clients.cpaTarget,
    })
    .from(clients)
    .where(eq(clients.isActive, true));

  let totalAlertsFired = 0;

  for (const client of activeClients) {
    const accounts = await db
      .select({
        dbId: metaAdAccounts.id,
        metaAccountId: metaAdAccounts.metaAccountId,
        accountName: metaAdAccounts.accountName,
      })
      .from(metaAdAccounts)
      .where(
        and(
          eq(metaAdAccounts.clientId, client.clientId),
          eq(metaAdAccounts.status, "active")
        )
      );

    if (accounts.length === 0) continue;

    // Load alert preferences (or use defaults)
    const [prefs] = await db
      .select()
      .from(alertPreferences)
      .where(eq(alertPreferences.clientId, client.clientId))
      .limit(1);

    if (prefs?.isMuted) continue;

    const enabledTypes = (prefs?.enabledAlertTypes as AlertType[] | null) ??
      DEFAULT_ALERT_RULES.filter((r) => r.enabledByDefault).map((r) => r.type);
    const customThresholds = (prefs?.customThresholds as Record<string, number> | null) ?? {};

    for (const account of accounts) {
      const context: AccountContext = {
        clientId: client.clientId,
        clientName: client.clientName,
        metaAccountDbId: account.dbId,
        metaAccountId: account.metaAccountId,
        accountName: account.accountName ?? account.metaAccountId,
        monthlySpend: client.monthlySpend ? Number(client.monthlySpend) : null,
        roasTarget: client.roasTarget ? Number(client.roasTarget) : null,
        cpaTarget: client.cpaTarget ? Number(client.cpaTarget) : null,
      };

      // Check how many alerts we've already fired today for this account
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [alertCount] = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(accountAlerts)
        .where(
          and(
            eq(accountAlerts.metaAccountId, account.dbId),
            gte(accountAlerts.firedAt, todayStart)
          )
        );

      if (Number(alertCount?.count ?? 0) >= MAX_ALERTS_PER_ACCOUNT_PER_DAY) {
        console.log(`Skipping ${account.metaAccountId} — daily alert limit reached`);
        continue;
      }

      // Pull metrics for comparison periods
      const currentDaily = await getMetricsForPeriod(account.dbId, ALERT_DAILY_LOOKBACK);
      const previousDaily = await getMetricsForPeriod(
        account.dbId,
        ALERT_DAILY_LOOKBACK,
        ALERT_DAILY_LOOKBACK
      );
      const currentWeekly = await getMetricsForPeriod(account.dbId, ALERT_WEEKLY_LOOKBACK);
      const previousWeekly = await getMetricsForPeriod(
        account.dbId,
        ALERT_WEEKLY_LOOKBACK,
        ALERT_WEEKLY_LOOKBACK
      );

      // Evaluate each enabled rule
      for (const rule of DEFAULT_ALERT_RULES) {
        if (!enabledTypes.includes(rule.type)) continue;

        const threshold = customThresholds[rule.type] ?? rule.defaultThresholdPct;
        const ruleWithThreshold = { ...rule, defaultThresholdPct: threshold };

        const alert = evaluateRule(
          ruleWithThreshold,
          context,
          { current: currentDaily, previous: previousDaily },
          { current: currentWeekly, previous: previousWeekly }
        );

        if (alert) {
          // Check for duplicate — don't fire same alert type within 6 hours
          const sixHoursAgo = new Date();
          sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);

          const [existing] = await db
            .select({ id: accountAlerts.id })
            .from(accountAlerts)
            .where(
              and(
                eq(accountAlerts.metaAccountId, account.dbId),
                eq(accountAlerts.alertType, alert.alertType),
                gte(accountAlerts.firedAt, sixHoursAgo)
              )
            )
            .limit(1);

          if (existing) continue;

          // Insert the alert
          await db.insert(accountAlerts).values({
            clientId: alert.clientId,
            metaAccountId: context.metaAccountDbId,
            alertType: alert.alertType,
            severity: alert.severity,
            title: alert.title,
            message: alert.message,
            currentValue: alert.metrics.currentValue.toString(),
            previousValue: alert.metrics.previousValue.toString(),
            changePct: alert.metrics.changePct.toString(),
            targetValue: alert.metrics.targetValue?.toString(),
            metricsSnapshot: alert.metrics.context,
          });

          totalAlertsFired++;
          console.log(
            `ALERT [${alert.severity}] ${alert.clientName} / ${alert.accountName}: ${alert.title}`
          );
        }
      }
    }
  }

  console.log(`Alert evaluation complete. ${totalAlertsFired} alerts fired.`);
  return { alertsFired: totalAlertsFired };
}

// ---------------------------------------------------------------------------
// Metrics Fetching
// ---------------------------------------------------------------------------

async function getMetricsForPeriod(
  accountDbId: string,
  days: number,
  offsetDays: number = 0
): Promise<PeriodMetrics> {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - offsetDays);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days);

  const endStr = endDate.toISOString().split("T")[0];
  const startStr = startDate.toISOString().split("T")[0];

  const [result] = await db
    .select({
      totalSpend: sql<number>`COALESCE(SUM(CAST(${adInsightsDaily.spend} AS DECIMAL)), 0)`,
      totalImpressions: sql<number>`COALESCE(SUM(${adInsightsDaily.impressions}), 0)`,
      totalClicks: sql<number>`COALESCE(SUM(${adInsightsDaily.clicks}), 0)`,
      totalPurchases: sql<number>`COALESCE(SUM(${adInsightsDaily.purchases}), 0)`,
      totalRevenue: sql<number>`COALESCE(SUM(CAST(${adInsightsDaily.purchaseValue} AS DECIMAL)), 0)`,
      dayCount: sql<number>`COUNT(DISTINCT ${adInsightsDaily.date})`,
    })
    .from(adInsightsDaily)
    .where(
      and(
        eq(adInsightsDaily.metaAccountId, accountDbId),
        gte(adInsightsDaily.date, startStr),
        lt(adInsightsDaily.date, endStr)
      )
    );

  const spend = Number(result?.totalSpend ?? 0);
  const impressions = Number(result?.totalImpressions ?? 0);
  const clicks = Number(result?.totalClicks ?? 0);
  const purchases = Number(result?.totalPurchases ?? 0);
  const revenue = Number(result?.totalRevenue ?? 0);
  const dayCount = Number(result?.dayCount ?? 0);

  return {
    totalSpend: spend,
    totalImpressions: impressions,
    totalClicks: clicks,
    totalPurchases: purchases,
    totalRevenue: revenue,
    avgCtr: impressions > 0 ? clicks / impressions : 0,
    roas: spend > 0 ? revenue / spend : 0,
    cpa: purchases > 0 ? spend / purchases : 0,
    cpm: impressions > 0 ? (spend / impressions) * 1000 : 0,
    days: dayCount,
  };
}

// ---------------------------------------------------------------------------
// Rule Evaluation
// ---------------------------------------------------------------------------

function evaluateRule(
  rule: AlertRuleConfig,
  ctx: AccountContext,
  daily: { current: PeriodMetrics; previous: PeriodMetrics },
  weekly: { current: PeriodMetrics; previous: PeriodMetrics }
): EvaluatedAlert | null {
  switch (rule.type) {
    case "spend_spike":
      return evaluateSpendSpike(rule, ctx, daily);
    case "spend_drop":
      return evaluateSpendDrop(rule, ctx, daily);
    case "roas_decline":
      return evaluateRoasDecline(rule, ctx, weekly);
    case "cpa_blowout":
      return evaluateCpaBlowout(rule, ctx, weekly);
    case "ctr_fatigue":
      return evaluateCtrFatigue(rule, ctx, weekly);
    case "zero_spend":
      return evaluateZeroSpend(ctx, daily);
    case "conversion_drop":
      return evaluateConversionDrop(rule, ctx, weekly);
    case "budget_pacing":
      return evaluateBudgetPacing(rule, ctx, daily);
    case "roas_below_target":
      return evaluateRoasBelowTarget(rule, ctx, weekly);
    case "cpa_above_target":
      return evaluateCpaAboveTarget(rule, ctx, weekly);
    default:
      return null;
  }
}

function buildContextMetrics(metrics: PeriodMetrics): AlertMetrics["context"] {
  return {
    currentSpend: metrics.totalSpend,
    currentRoas: metrics.roas,
    currentCpa: metrics.cpa,
    currentCtr: metrics.avgCtr,
    impressions: metrics.totalImpressions,
    purchases: metrics.totalPurchases,
  };
}

function determineSeverity(
  changePct: number,
  thresholds: AlertRuleConfig["severityThresholds"]
): AlertSeverity {
  const abs = Math.abs(changePct);
  if (abs >= thresholds.critical) return "critical";
  if (abs >= thresholds.high) return "high";
  if (abs >= thresholds.medium) return "medium";
  return "low";
}

function buildAlert(
  ctx: AccountContext,
  type: AlertType,
  severity: AlertSeverity,
  title: string,
  message: string,
  metrics: AlertMetrics
): EvaluatedAlert {
  return {
    clientId: ctx.clientId,
    clientName: ctx.clientName,
    metaAccountId: ctx.metaAccountId,
    accountName: ctx.accountName,
    alertType: type,
    severity,
    title,
    message,
    metrics,
  };
}

// ---------------------------------------------------------------------------
// Individual Rule Evaluators
// ---------------------------------------------------------------------------

function evaluateSpendSpike(
  rule: AlertRuleConfig,
  ctx: AccountContext,
  daily: { current: PeriodMetrics; previous: PeriodMetrics }
): EvaluatedAlert | null {
  const { current, previous } = daily;
  if (previous.totalSpend === 0 || current.totalSpend === 0) return null;

  const avgDailyPrev = previous.days > 0 ? previous.totalSpend / previous.days : 0;
  const avgDailyCurr = current.days > 0 ? current.totalSpend / current.days : 0;
  if (avgDailyPrev === 0) return null;

  const changePct = ((avgDailyCurr - avgDailyPrev) / avgDailyPrev) * 100;

  if (changePct >= rule.defaultThresholdPct) {
    const severity = determineSeverity(changePct, rule.severityThresholds);
    return buildAlert(
      ctx,
      "spend_spike",
      severity,
      `Spend up ${changePct.toFixed(0)}% — ${ctx.clientName}`,
      `Daily spend for ${ctx.accountName} jumped from $${avgDailyPrev.toFixed(2)}/day to $${avgDailyCurr.toFixed(2)}/day (${changePct.toFixed(0)}% increase). Verify this is intentional.`,
      {
        currentValue: avgDailyCurr,
        previousValue: avgDailyPrev,
        changePct,
        context: buildContextMetrics(current),
      }
    );
  }
  return null;
}

function evaluateSpendDrop(
  rule: AlertRuleConfig,
  ctx: AccountContext,
  daily: { current: PeriodMetrics; previous: PeriodMetrics }
): EvaluatedAlert | null {
  const { current, previous } = daily;
  if (previous.totalSpend === 0) return null;

  const avgDailyPrev = previous.days > 0 ? previous.totalSpend / previous.days : 0;
  const avgDailyCurr = current.days > 0 ? current.totalSpend / current.days : 0;
  if (avgDailyPrev === 0) return null;

  const changePct = ((avgDailyPrev - avgDailyCurr) / avgDailyPrev) * 100;

  if (changePct >= rule.defaultThresholdPct) {
    const severity = determineSeverity(changePct, rule.severityThresholds);
    return buildAlert(
      ctx,
      "spend_drop",
      severity,
      `Spend down ${changePct.toFixed(0)}% — ${ctx.clientName}`,
      `Daily spend for ${ctx.accountName} dropped from $${avgDailyPrev.toFixed(2)}/day to $${avgDailyCurr.toFixed(2)}/day (${changePct.toFixed(0)}% decrease). Check if ads are being delivered.`,
      {
        currentValue: avgDailyCurr,
        previousValue: avgDailyPrev,
        changePct: -changePct,
        context: buildContextMetrics(current),
      }
    );
  }
  return null;
}

function evaluateRoasDecline(
  rule: AlertRuleConfig,
  ctx: AccountContext,
  weekly: { current: PeriodMetrics; previous: PeriodMetrics }
): EvaluatedAlert | null {
  const { current, previous } = weekly;
  if (previous.roas === 0 || current.roas === 0) return null;

  const changePct = ((previous.roas - current.roas) / previous.roas) * 100;

  if (changePct >= rule.defaultThresholdPct) {
    const severity = determineSeverity(changePct, rule.severityThresholds);
    return buildAlert(
      ctx,
      "roas_decline",
      severity,
      `ROAS down ${changePct.toFixed(0)}% WoW — ${ctx.clientName}`,
      `ROAS for ${ctx.accountName} dropped from ${previous.roas.toFixed(2)}x to ${current.roas.toFixed(2)}x week-over-week. Spend: $${current.totalSpend.toFixed(2)}, Revenue: $${current.totalRevenue.toFixed(2)}.`,
      {
        currentValue: current.roas,
        previousValue: previous.roas,
        changePct: -changePct,
        targetValue: ctx.roasTarget ?? undefined,
        context: buildContextMetrics(current),
      }
    );
  }
  return null;
}

function evaluateCpaBlowout(
  rule: AlertRuleConfig,
  ctx: AccountContext,
  weekly: { current: PeriodMetrics; previous: PeriodMetrics }
): EvaluatedAlert | null {
  const { current, previous } = weekly;
  if (previous.cpa === 0 || current.cpa === 0) return null;

  const changePct = ((current.cpa - previous.cpa) / previous.cpa) * 100;

  if (changePct >= rule.defaultThresholdPct) {
    const severity = determineSeverity(changePct, rule.severityThresholds);
    return buildAlert(
      ctx,
      "cpa_blowout",
      severity,
      `CPA up ${changePct.toFixed(0)}% WoW — ${ctx.clientName}`,
      `CPA for ${ctx.accountName} increased from $${previous.cpa.toFixed(2)} to $${current.cpa.toFixed(2)} week-over-week. Current purchases: ${current.totalPurchases}.`,
      {
        currentValue: current.cpa,
        previousValue: previous.cpa,
        changePct,
        targetValue: ctx.cpaTarget ?? undefined,
        context: buildContextMetrics(current),
      }
    );
  }
  return null;
}

function evaluateCtrFatigue(
  rule: AlertRuleConfig,
  ctx: AccountContext,
  weekly: { current: PeriodMetrics; previous: PeriodMetrics }
): EvaluatedAlert | null {
  const { current, previous } = weekly;
  if (previous.avgCtr === 0 || current.avgCtr === 0) return null;

  const changePct = ((previous.avgCtr - current.avgCtr) / previous.avgCtr) * 100;

  if (changePct >= rule.defaultThresholdPct) {
    const severity = determineSeverity(changePct, rule.severityThresholds);
    return buildAlert(
      ctx,
      "ctr_fatigue",
      severity,
      `CTR declining ${changePct.toFixed(0)}% — creative fatigue? — ${ctx.clientName}`,
      `CTR for ${ctx.accountName} dropped from ${(previous.avgCtr * 100).toFixed(2)}% to ${(current.avgCtr * 100).toFixed(2)}% WoW. This often signals creative exhaustion — consider refreshing top ads.`,
      {
        currentValue: current.avgCtr,
        previousValue: previous.avgCtr,
        changePct: -changePct,
        context: buildContextMetrics(current),
      }
    );
  }
  return null;
}

function evaluateZeroSpend(
  ctx: AccountContext,
  daily: { current: PeriodMetrics; previous: PeriodMetrics }
): EvaluatedAlert | null {
  const { current, previous } = daily;
  // Only alert if they HAD spend before but now have zero
  if (current.totalSpend === 0 && previous.totalSpend > 0) {
    return buildAlert(
      ctx,
      "zero_spend",
      "critical",
      `Zero spend detected — ${ctx.clientName}`,
      `${ctx.accountName} has had $0 in spend over the last ${ALERT_DAILY_LOOKBACK} days but was previously spending $${previous.totalSpend.toFixed(2)}. Ads may be paused, disapproved, or payment failed.`,
      {
        currentValue: 0,
        previousValue: previous.totalSpend,
        changePct: -100,
        context: buildContextMetrics(current),
      }
    );
  }
  return null;
}

function evaluateConversionDrop(
  rule: AlertRuleConfig,
  ctx: AccountContext,
  weekly: { current: PeriodMetrics; previous: PeriodMetrics }
): EvaluatedAlert | null {
  const { current, previous } = weekly;
  if (previous.totalPurchases === 0) return null;

  const changePct =
    ((previous.totalPurchases - current.totalPurchases) / previous.totalPurchases) * 100;

  if (changePct >= rule.defaultThresholdPct) {
    const severity = determineSeverity(changePct, rule.severityThresholds);
    return buildAlert(
      ctx,
      "conversion_drop",
      severity,
      `Conversions down ${changePct.toFixed(0)}% — ${ctx.clientName}`,
      `Purchases for ${ctx.accountName} dropped from ${previous.totalPurchases} to ${current.totalPurchases} WoW (${changePct.toFixed(0)}% decrease). Check pixel, landing pages, and checkout flow.`,
      {
        currentValue: current.totalPurchases,
        previousValue: previous.totalPurchases,
        changePct: -changePct,
        context: buildContextMetrics(current),
      }
    );
  }
  return null;
}

function evaluateBudgetPacing(
  rule: AlertRuleConfig,
  ctx: AccountContext,
  daily: { current: PeriodMetrics }
): EvaluatedAlert | null {
  if (!ctx.monthlySpend || ctx.monthlySpend <= 0) return null;

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dayOfMonth = now.getDate();

  // Project monthly spend based on current daily average
  const avgDaily = daily.current.days > 0 ? daily.current.totalSpend / daily.current.days : 0;
  const projectedMonthly = avgDaily * daysInMonth;

  const pacingPct = ((projectedMonthly - ctx.monthlySpend) / ctx.monthlySpend) * 100;

  // Only alert after we're at least 5 days into the month (need enough data)
  if (dayOfMonth < 5) return null;

  if (Math.abs(pacingPct) >= rule.defaultThresholdPct) {
    const direction = pacingPct > 0 ? "overspend" : "underspend";
    const severity = determineSeverity(pacingPct, rule.severityThresholds);
    return buildAlert(
      ctx,
      "budget_pacing",
      severity,
      `Pacing to ${direction} by ${Math.abs(pacingPct).toFixed(0)}% — ${ctx.clientName}`,
      `${ctx.accountName} is on track to spend $${projectedMonthly.toFixed(0)} this month vs $${ctx.monthlySpend.toFixed(0)} budget (${pacingPct > 0 ? "+" : ""}${pacingPct.toFixed(0)}%). Avg daily: $${avgDaily.toFixed(2)}.`,
      {
        currentValue: projectedMonthly,
        previousValue: ctx.monthlySpend,
        changePct: pacingPct,
        targetValue: ctx.monthlySpend,
        context: buildContextMetrics(daily.current),
      }
    );
  }
  return null;
}

function evaluateRoasBelowTarget(
  rule: AlertRuleConfig,
  ctx: AccountContext,
  weekly: { current: PeriodMetrics }
): EvaluatedAlert | null {
  if (!ctx.roasTarget || ctx.roasTarget <= 0) return null;
  if (weekly.current.roas === 0 || weekly.current.totalSpend === 0) return null;

  if (weekly.current.roas < ctx.roasTarget) {
    const belowPct = ((ctx.roasTarget - weekly.current.roas) / ctx.roasTarget) * 100;
    const severity = determineSeverity(belowPct, rule.severityThresholds);
    return buildAlert(
      ctx,
      "roas_below_target",
      severity,
      `ROAS ${weekly.current.roas.toFixed(2)}x vs ${ctx.roasTarget.toFixed(2)}x target — ${ctx.clientName}`,
      `${ctx.accountName} ROAS is ${weekly.current.roas.toFixed(2)}x, which is ${belowPct.toFixed(0)}% below the ${ctx.roasTarget.toFixed(2)}x target. Spend: $${weekly.current.totalSpend.toFixed(2)}.`,
      {
        currentValue: weekly.current.roas,
        previousValue: ctx.roasTarget,
        changePct: -belowPct,
        targetValue: ctx.roasTarget,
        context: buildContextMetrics(weekly.current),
      }
    );
  }
  return null;
}

function evaluateCpaAboveTarget(
  rule: AlertRuleConfig,
  ctx: AccountContext,
  weekly: { current: PeriodMetrics }
): EvaluatedAlert | null {
  if (!ctx.cpaTarget || ctx.cpaTarget <= 0) return null;
  if (weekly.current.cpa === 0 || weekly.current.totalPurchases === 0) return null;

  if (weekly.current.cpa > ctx.cpaTarget) {
    const abovePct = ((weekly.current.cpa - ctx.cpaTarget) / ctx.cpaTarget) * 100;
    const severity = determineSeverity(abovePct, rule.severityThresholds);
    return buildAlert(
      ctx,
      "cpa_above_target",
      severity,
      `CPA $${weekly.current.cpa.toFixed(2)} vs $${ctx.cpaTarget.toFixed(2)} target — ${ctx.clientName}`,
      `${ctx.accountName} CPA is $${weekly.current.cpa.toFixed(2)}, which is ${abovePct.toFixed(0)}% above the $${ctx.cpaTarget.toFixed(2)} target. Purchases: ${weekly.current.totalPurchases}.`,
      {
        currentValue: weekly.current.cpa,
        previousValue: ctx.cpaTarget,
        changePct: abovePct,
        targetValue: ctx.cpaTarget,
        context: buildContextMetrics(weekly.current),
      }
    );
  }
  return null;
}
