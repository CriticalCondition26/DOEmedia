"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// TODO: Replace with real data from Meta API + database
const mockPerformanceData = {
  dateRange: "Last 14 days",
  ads: [
    {
      id: "1",
      name: "UGC Testimonial #3",
      format: "VIDEO",
      status: "ACTIVE",
      spend: 4200,
      impressions: 185000,
      clicks: 3420,
      ctr: 0.0185,
      cpc: 1.23,
      cpm: 22.7,
      purchases: 171,
      roas: 5.12,
      cpa: 24.56,
    },
    {
      id: "2",
      name: "Before/After Static",
      format: "IMAGE",
      status: "ACTIVE",
      spend: 3800,
      impressions: 142000,
      clicks: 2980,
      ctr: 0.021,
      cpc: 1.28,
      cpm: 26.76,
      purchases: 155,
      roas: 4.87,
      cpa: 24.52,
    },
    {
      id: "3",
      name: "Problem/Solution Carousel",
      format: "CAROUSEL",
      status: "ACTIVE",
      spend: 2900,
      impressions: 98000,
      clicks: 1960,
      ctr: 0.02,
      cpc: 1.48,
      cpm: 29.59,
      purchases: 99,
      roas: 4.15,
      cpa: 29.29,
    },
    {
      id: "4",
      name: "Summer Sale Banner",
      format: "IMAGE",
      status: "ACTIVE",
      spend: 2100,
      impressions: 112000,
      clicks: 1680,
      ctr: 0.015,
      cpc: 1.25,
      cpm: 18.75,
      purchases: 42,
      roas: 1.84,
      cpa: 50.0,
    },
    {
      id: "5",
      name: "Founder Story Reel",
      format: "VIDEO",
      status: "ACTIVE",
      spend: 1800,
      impressions: 76000,
      clicks: 1520,
      ctr: 0.02,
      cpc: 1.18,
      cpm: 23.68,
      purchases: 68,
      roas: 3.67,
      cpa: 26.47,
    },
  ],
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export default function PerformancePage() {
  const { ads } = mockPerformanceData;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold">Creative Performance</h2>
        <p className="text-sm text-muted-foreground">{mockPerformanceData.dateRange}</p>
      </div>

      {/* Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ad-Level Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="pb-3 font-medium">Ad Name</th>
                  <th className="pb-3 font-medium">Format</th>
                  <th className="pb-3 font-medium text-right">Spend</th>
                  <th className="pb-3 font-medium text-right">Impressions</th>
                  <th className="pb-3 font-medium text-right">CTR</th>
                  <th className="pb-3 font-medium text-right">CPC</th>
                  <th className="pb-3 font-medium text-right">CPM</th>
                  <th className="pb-3 font-medium text-right">Purchases</th>
                  <th className="pb-3 font-medium text-right">ROAS</th>
                  <th className="pb-3 font-medium text-right">CPA</th>
                </tr>
              </thead>
              <tbody>
                {ads.map((ad) => (
                  <tr
                    key={ad.id}
                    className="border-b border-border/50 text-sm transition-colors hover:bg-muted/50"
                  >
                    <td className="py-3 font-medium">{ad.name}</td>
                    <td className="py-3">
                      <Badge variant="secondary">{ad.format}</Badge>
                    </td>
                    <td className="py-3 text-right">{formatCurrency(ad.spend)}</td>
                    <td className="py-3 text-right">{ad.impressions.toLocaleString()}</td>
                    <td className="py-3 text-right">{(ad.ctr * 100).toFixed(2)}%</td>
                    <td className="py-3 text-right">{formatCurrency(ad.cpc)}</td>
                    <td className="py-3 text-right">{formatCurrency(ad.cpm)}</td>
                    <td className="py-3 text-right">{ad.purchases}</td>
                    <td className="py-3 text-right">
                      <span
                        className={
                          ad.roas >= 3
                            ? "font-bold text-success"
                            : ad.roas >= 2
                              ? "text-warning"
                              : "text-destructive"
                        }
                      >
                        {ad.roas.toFixed(2)}x
                      </span>
                    </td>
                    <td className="py-3 text-right">{formatCurrency(ad.cpa)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
