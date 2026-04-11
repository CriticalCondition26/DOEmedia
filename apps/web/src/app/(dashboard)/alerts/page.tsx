"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  clientId: string;
  clientName: string;
  accountName: string | null;
  alertType: string;
  severity: string;
  status: string;
  title: string;
  message: string;
  currentValue: string | null;
  previousValue: string | null;
  changePct: string | null;
  targetValue: string | null;
  aiAnalysis: string | null;
  aiRecommendation: string | null;
  notifiedVia: string[] | null;
  firedAt: string;
}

interface AlertSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

const SEVERITY_STYLES: Record<string, { badge: string; border: string; bg: string }> = {
  critical: {
    badge: "bg-red-100 text-red-800 border-red-200",
    border: "border-l-red-500",
    bg: "bg-red-50/50",
  },
  high: {
    badge: "bg-orange-100 text-orange-800 border-orange-200",
    border: "border-l-orange-500",
    bg: "bg-orange-50/30",
  },
  medium: {
    badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
    border: "border-l-yellow-500",
    bg: "",
  },
  low: {
    badge: "bg-blue-100 text-blue-800 border-blue-200",
    border: "border-l-blue-400",
    bg: "",
  },
};

const ALERT_TYPE_LABELS: Record<string, string> = {
  spend_spike: "Spend Spike",
  spend_drop: "Spend Drop",
  roas_decline: "ROAS Decline",
  cpa_blowout: "CPA Blowout",
  ctr_fatigue: "CTR Fatigue",
  zero_spend: "Zero Spend",
  conversion_drop: "Conversion Drop",
  budget_pacing: "Budget Pacing",
  roas_below_target: "ROAS Below Target",
  cpa_above_target: "CPA Above Target",
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [summary, setSummary] = useState<AlertSummary>({ total: 0, critical: 0, high: 0, medium: 0, low: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchAlerts();
  }, [filter]);

  async function fetchAlerts() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: "active", limit: "100" });
      if (filter !== "all") params.set("severity", filter);
      const res = await fetch(`/api/alerts?${params}`);
      const data = await res.json();
      setAlerts(data.alerts ?? []);
      setSummary(data.summary ?? { total: 0, critical: 0, high: 0, medium: 0, low: 0 });
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    } finally {
      setLoading(false);
    }
  }

  async function updateAlertStatus(alertIds: string[], status: string) {
    try {
      await fetch("/api/alerts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertIds, status }),
      });
      fetchAlerts();
    } catch (err) {
      console.error("Failed to update alert:", err);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Account Alerts</h1>
        <p className="text-muted-foreground">
          Real-time monitoring of significant changes across all ad accounts
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <SummaryCard
          label="Critical"
          count={summary.critical}
          className="border-l-4 border-l-red-500"
          active={filter === "critical"}
          onClick={() => setFilter(filter === "critical" ? "all" : "critical")}
        />
        <SummaryCard
          label="High"
          count={summary.high}
          className="border-l-4 border-l-orange-500"
          active={filter === "high"}
          onClick={() => setFilter(filter === "high" ? "all" : "high")}
        />
        <SummaryCard
          label="Medium"
          count={summary.medium}
          className="border-l-4 border-l-yellow-500"
          active={filter === "medium"}
          onClick={() => setFilter(filter === "medium" ? "all" : "medium")}
        />
        <SummaryCard
          label="Low"
          count={summary.low}
          className="border-l-4 border-l-blue-400"
          active={filter === "low"}
          onClick={() => setFilter(filter === "low" ? "all" : "low")}
        />
      </div>

      {/* Alert List */}
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <p className="text-muted-foreground">Loading alerts...</p>
          </CardContent>
        </Card>
      ) : alerts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold">All Clear</h3>
            <p className="max-w-md text-center text-sm text-muted-foreground">
              No active alerts. All ad accounts are performing within normal parameters.
              The system checks for anomalies every hour.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const styles = SEVERITY_STYLES[alert.severity] ?? SEVERITY_STYLES.low;
            const isExpanded = expandedId === alert.id;
            return (
              <Card
                key={alert.id}
                className={cn("border-l-4 cursor-pointer transition-colors", styles.border, styles.bg)}
                onClick={() => setExpandedId(isExpanded ? null : alert.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <Badge className={styles.badge}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge className="bg-muted text-muted-foreground border-border">
                          {ALERT_TYPE_LABELS[alert.alertType] ?? alert.alertType}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(alert.firedAt).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="font-semibold">{alert.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>

                      {isExpanded && (
                        <div className="mt-4 space-y-3">
                          {alert.aiAnalysis && (
                            <div className="rounded-md bg-muted/50 p-3">
                              <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
                                AI Analysis
                              </p>
                              <p className="text-sm">{alert.aiAnalysis}</p>
                            </div>
                          )}
                          {alert.aiRecommendation && (
                            <div className="rounded-md bg-primary/5 p-3">
                              <p className="mb-1 text-xs font-semibold uppercase text-primary">
                                Recommended Action
                              </p>
                              <p className="text-sm font-medium">{alert.aiRecommendation}</p>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <button
                              className="rounded-md bg-muted px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/80"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateAlertStatus([alert.id], "acknowledged");
                              }}
                            >
                              Acknowledge
                            </button>
                            <button
                              className="rounded-md bg-green-100 px-3 py-1.5 text-xs font-medium text-green-800 transition-colors hover:bg-green-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateAlertStatus([alert.id], "resolved");
                              }}
                            >
                              Resolve
                            </button>
                            <button
                              className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateAlertStatus([alert.id], "dismissed");
                              }}
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-muted-foreground">{alert.clientName}</p>
                      {alert.accountName && (
                        <p className="text-xs text-muted-foreground">{alert.accountName}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  count,
  className,
  active,
  onClick,
}: {
  label: string;
  count: number;
  className?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all",
        className,
        active && "ring-2 ring-primary"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
