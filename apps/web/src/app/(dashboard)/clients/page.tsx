import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// TODO: Replace with real data from database
const mockClients = [
  {
    id: "1",
    name: "GlowSkin Co",
    industry: "Skincare",
    monthlySpend: 125000,
    status: "active",
    lastRefresh: "2 days ago",
    activeAds: 24,
    roas: 3.42,
    podName: "Pod Alpha",
  },
  {
    id: "2",
    name: "FitLife Supplements",
    industry: "Supplements",
    monthlySpend: 89000,
    status: "active",
    lastRefresh: "5 days ago",
    activeAds: 18,
    roas: 2.87,
    podName: "Pod Alpha",
  },
  {
    id: "3",
    name: "UrbanThread Apparel",
    industry: "Fashion",
    monthlySpend: 210000,
    status: "active",
    lastRefresh: "1 day ago",
    activeAds: 36,
    roas: 4.15,
    podName: "Pod Beta",
  },
  {
    id: "4",
    name: "PureHome Essentials",
    industry: "Home & Garden",
    monthlySpend: 67000,
    status: "active",
    lastRefresh: "12 days ago",
    activeAds: 12,
    roas: 1.94,
    podName: "Pod Beta",
  },
  {
    id: "5",
    name: "VitalityPets",
    industry: "Pet Care",
    monthlySpend: 155000,
    status: "active",
    lastRefresh: "3 days ago",
    activeAds: 28,
    roas: 3.78,
    podName: "Pod Alpha",
  },
];

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
}

function getRefreshUrgency(lastRefresh: string): "success" | "warning" | "destructive" {
  if (lastRefresh.includes("12") || lastRefresh.includes("13") || lastRefresh.includes("14")) {
    return "destructive";
  }
  if (lastRefresh.includes("5") || lastRefresh.includes("6") || lastRefresh.includes("7")) {
    return "warning";
  }
  return "success";
}

export default function ClientsPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-muted-foreground">
            {mockClients.length} active clients across all pods
          </p>
        </div>
        <Button>Add Client</Button>
      </div>

      {/* KPI Summary */}
      <div className="mb-8 grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Monthly Spend</p>
            <p className="text-2xl font-bold">
              {formatCurrency(mockClients.reduce((sum, c) => sum + c.monthlySpend, 0))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg ROAS</p>
            <p className="text-2xl font-bold">
              {(mockClients.reduce((sum, c) => sum + c.roas, 0) / mockClients.length).toFixed(2)}x
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Ads</p>
            <p className="text-2xl font-bold">
              {mockClients.reduce((sum, c) => sum + c.activeAds, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Needs Refresh</p>
            <p className="text-2xl font-bold text-warning">
              {mockClients.filter((c) => c.lastRefresh.includes("12") || c.lastRefresh.includes("5")).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Client Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium">Industry</th>
                  <th className="pb-3 font-medium">Pod</th>
                  <th className="pb-3 font-medium text-right">Monthly Spend</th>
                  <th className="pb-3 font-medium text-right">ROAS</th>
                  <th className="pb-3 font-medium text-right">Active Ads</th>
                  <th className="pb-3 font-medium">Last Refresh</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockClients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-border/50 transition-colors hover:bg-muted/50"
                  >
                    <td className="py-3">
                      <Link
                        href={`/clients/${client.id}`}
                        className="font-medium text-foreground hover:text-primary"
                      >
                        {client.name}
                      </Link>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">
                      {client.industry}
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">
                      {client.podName}
                    </td>
                    <td className="py-3 text-right text-sm">
                      {formatCurrency(client.monthlySpend)}
                    </td>
                    <td className="py-3 text-right text-sm font-medium">
                      <span
                        className={
                          client.roas >= 3
                            ? "text-success"
                            : client.roas >= 2
                              ? "text-warning"
                              : "text-destructive"
                        }
                      >
                        {client.roas.toFixed(2)}x
                      </span>
                    </td>
                    <td className="py-3 text-right text-sm">{client.activeAds}</td>
                    <td className="py-3">
                      <Badge variant={getRefreshUrgency(client.lastRefresh)}>
                        {client.lastRefresh}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge variant="success">{client.status}</Badge>
                    </td>
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
