"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Overview", href: "" },
  { name: "Performance", href: "/performance" },
  { name: "Strategy", href: "/strategy" },
  { name: "Copy", href: "/copy" },
  { name: "Briefs", href: "/briefs" },
];

// TODO: Replace with real data
const mockClient = {
  name: "GlowSkin Co",
  industry: "Skincare",
  shopifyDomain: "glowskinco.myshopify.com",
  monthlySpend: 125000,
  podName: "Pod Alpha",
  status: "active",
  brandVoice: "Clean, confident, empowering. Speaks to women 25-45 who value self-care.",
  kpis: {
    spend7d: 28500,
    roas7d: 3.42,
    cpa7d: 24.5,
    ctr7d: 0.0187,
    impressions7d: 1245000,
    purchases7d: 1163,
    activeAds: 24,
    lastRefresh: "2 days ago",
  },
  topCreatives: [
    { name: "UGC Testimonial #3", format: "VIDEO", roas: 5.12, spend: 4200 },
    { name: "Before/After Static", format: "IMAGE", roas: 4.87, spend: 3800 },
    { name: "Problem/Solution Carousel", format: "CAROUSEL", roas: 4.15, spend: 2900 },
  ],
  fatigueAlerts: [
    { name: "Summer Sale Banner", format: "IMAGE", roasDropPercent: 35 },
  ],
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function ClientDetailPage() {
  const pathname = usePathname();
  const params = useParams();
  const clientId = params.clientId as string;
  const basePath = `/clients/${clientId}`;

  return (
    <div>
      {/* Client Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{mockClient.name}</h1>
            <Badge variant="success">{mockClient.status}</Badge>
            <Badge variant="secondary">{mockClient.industry}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {mockClient.podName} &middot; {mockClient.shopifyDomain}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Sync Data</Button>
          <Button>Generate Strategy</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-border">
        {tabs.map((tab) => {
          const tabPath = basePath + tab.href;
          const isActive = pathname === tabPath;
          return (
            <Link
              key={tab.name}
              href={tabPath}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>

      {/* Overview KPIs */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">7d Spend</p>
            <p className="text-2xl font-bold">{formatCurrency(mockClient.kpis.spend7d)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">7d ROAS</p>
            <p className="text-2xl font-bold text-success">{mockClient.kpis.roas7d.toFixed(2)}x</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">7d CPA</p>
            <p className="text-2xl font-bold">{formatCurrency(mockClient.kpis.cpa7d)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">7d Purchases</p>
            <p className="text-2xl font-bold">{mockClient.kpis.purchases7d.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Performing Creatives */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Creatives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockClient.topCreatives.map((creative, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border border-border/50 p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{creative.name}</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{creative.format}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(creative.spend)} spent
                      </span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-success">
                    {creative.roas.toFixed(2)}x
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fatigue Alerts + Brand Info */}
        <div className="space-y-6">
          {mockClient.fatigueAlerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Fatigue Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockClient.fatigueAlerts.map((alert, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-md border border-destructive/30 bg-destructive/5 p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{alert.name}</p>
                        <Badge variant="secondary">{alert.format}</Badge>
                      </div>
                      <span className="text-sm font-medium text-destructive">
                        ROAS down {alert.roasDropPercent}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Brand Voice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{mockClient.brandVoice}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
