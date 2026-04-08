import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function StrategyPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Creative Strategy</h2>
          <p className="text-sm text-muted-foreground">
            AI-generated strategy based on performance data analysis
          </p>
        </div>
        <Button>Generate New Strategy</Button>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold">No Strategy Generated Yet</h3>
          <p className="mb-6 max-w-md text-center text-sm text-muted-foreground">
            Connect a Meta ad account and sync performance data, then generate an
            AI-powered creative strategy that analyzes your winning patterns and
            recommends what to create next.
          </p>
          <div className="flex gap-3">
            <Button variant="outline">Connect Meta Account</Button>
            <Button>Generate Strategy</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
