import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Cross-Portfolio Analytics</h1>
        <p className="text-muted-foreground">
          Creative patterns and performance trends across all 50 clients
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold">Analytics Coming Soon</h3>
          <p className="max-w-md text-center text-sm text-muted-foreground">
            Cross-portfolio analytics will be available once Meta ad accounts are
            connected and performance data is syncing. This will show winning
            creative patterns across all clients by industry.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
