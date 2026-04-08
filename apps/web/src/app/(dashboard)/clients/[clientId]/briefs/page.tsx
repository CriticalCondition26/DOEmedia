import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BriefsPage() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Creative Briefs</h2>
          <p className="text-sm text-muted-foreground">
            Format-specific briefs for designers — static, video, and carousel
          </p>
        </div>
        <Button>Generate Briefs</Button>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold">No Briefs Created Yet</h3>
          <p className="mb-6 max-w-md text-center text-sm text-muted-foreground">
            Generate a creative strategy first, then create format-specific briefs
            for your designers. Each brief includes hook, angle, visual direction,
            and ad copy.
          </p>
          <Button>Generate Briefs from Strategy</Button>
        </CardContent>
      </Card>
    </div>
  );
}
