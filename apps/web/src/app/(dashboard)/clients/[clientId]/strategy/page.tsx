"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StrategyResult {
  analysis: {
    winningPatterns: Array<{ pattern: string; roas: number; hypothesis: string; examples: string[] }>;
    losingPatterns: Array<{ pattern: string; roas: number; reason: string }>;
    fatigueAlerts: Array<{ adName: string; signal: string; recommendation: string }>;
    recommendations: Array<{ format: string; hookConcept: string; angle: string; rationale: string; priority: string }>;
    summary: string;
  };
  strategy: {
    overview: string;
    briefs: Array<{
      title: string;
      format: string;
      hook: string;
      angle: string;
      keyMessage: string;
      objective: string;
      priority: string;
      scriptStructure?: { hook: string; meat: string; actionOffer: string };
      targetDuration?: number;
      visualConcept?: string;
      headlineApproach?: string;
    }>;
    killList: Array<{ adName: string; reason: string }>;
    formatMix: { video: number; static: number; carousel: number };
  };
  copyVariants: Array<{
    briefTitle: string;
    format: string;
    copy: {
      variations: Array<{
        hookType: string;
        primaryTextShort: string;
        primaryTextMedium: string;
        primaryTextLong: string;
        headline: string;
        description?: string;
        callToAction: string;
      }>;
    };
  }>;
}

export default function StrategyPage() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState("");
  const [result, setResult] = useState<StrategyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setProgress("Starting strategy pipeline...");

    try {
      const response = await fetch("/api/ai/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: "GlowSkin Co", // TODO: Get from route params + DB
          industry: "Skincare",
          brandVoice: "Clean, confident, empowering. Speaks to women 25-45 who value self-care.",
          targetAudience: "Women 25-45, interested in skincare routines and clean beauty",
          productDescription: "Premium clean skincare products including serums, moisturizers, and SPF",
          performanceData: {
            clientName: "GlowSkin Co",
            industry: "Skincare",
            brandVoice: "Clean, confident, empowering",
            dateRange: { start: "2026-03-25", end: "2026-04-08" },
            topAds: [
              { name: "UGC Testimonial #3", format: "VIDEO", spend: 4200, roas: 5.12, ctr: 0.0185, cpa: 24.56, primaryText: "I never thought a serum could change my skin this fast..." },
              { name: "Before/After Static", format: "IMAGE", spend: 3800, roas: 4.87, ctr: 0.021, cpa: 24.52, primaryText: "Real results, real customers. No filters." },
              { name: "Problem/Solution Carousel", format: "CAROUSEL", spend: 2900, roas: 4.15, ctr: 0.02, cpa: 29.29, primaryText: "Tired of dull, dry skin? Here's what dermatologists recommend..." },
              { name: "Founder Story Reel", format: "VIDEO", spend: 1800, roas: 3.67, ctr: 0.02, cpa: 26.47, primaryText: "I started GlowSkin because I couldn't find clean products that actually worked..." },
            ],
            bottomAds: [
              { name: "Summer Sale Banner", format: "IMAGE", spend: 2100, roas: 1.84, ctr: 0.015, cpa: 50.0, primaryText: "Summer Sale! 20% off everything!" },
              { name: "Product Grid", format: "IMAGE", spend: 1200, roas: 1.42, ctr: 0.012, cpa: 65.0, primaryText: "Shop our bestsellers" },
            ],
            overallMetrics: {
              totalSpend: 28500,
              avgRoas: 3.42,
              avgCtr: 0.0187,
              avgCpa: 24.5,
              totalPurchases: 1163,
              totalRevenue: 97470,
            },
            formatBreakdown: [
              { format: "VIDEO", adCount: 8, spend: 12000, avgRoas: 4.12 },
              { format: "IMAGE", adCount: 12, spend: 11500, avgRoas: 2.85 },
              { format: "CAROUSEL", adCount: 4, spend: 5000, avgRoas: 3.65 },
            ],
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Strategy generation failed");
      }

      const data = await response.json();
      setResult(data);
      setProgress("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setProgress("");
    } finally {
      setLoading(false);
    }
  }

  // If we have results, show the full strategy
  if (result) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Creative Strategy</h2>
            <p className="text-sm text-muted-foreground">
              AI-generated strategy based on performance data analysis
            </p>
          </div>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Regenerate"}
          </Button>
        </div>

        {/* Strategic Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Strategic Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{result.strategy.overview}</p>
          </CardContent>
        </Card>

        {/* Analysis Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Performance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm leading-relaxed">{result.analysis.summary}</p>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="mb-2 text-sm font-semibold text-success">Winning Patterns</h4>
                <div className="space-y-2">
                  {result.analysis.winningPatterns.map((p, i) => (
                    <div key={i} className="rounded-md border border-success/20 bg-success/5 p-3">
                      <p className="text-sm font-medium">{p.pattern}</p>
                      <p className="text-xs text-muted-foreground">{p.hypothesis}</p>
                      <Badge variant="success" className="mt-1">{p.roas.toFixed(2)}x ROAS</Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold text-destructive">Losing Patterns</h4>
                <div className="space-y-2">
                  {result.analysis.losingPatterns.map((p, i) => (
                    <div key={i} className="rounded-md border border-destructive/20 bg-destructive/5 p-3">
                      <p className="text-sm font-medium">{p.pattern}</p>
                      <p className="text-xs text-muted-foreground">{p.reason}</p>
                      <Badge variant="destructive" className="mt-1">{p.roas.toFixed(2)}x ROAS</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Format Mix */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Recommended Format Mix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 rounded-md bg-primary/10 p-4 text-center">
                <p className="text-2xl font-bold">{result.strategy.formatMix.video}</p>
                <p className="text-sm text-muted-foreground">Video</p>
              </div>
              <div className="flex-1 rounded-md bg-primary/10 p-4 text-center">
                <p className="text-2xl font-bold">{result.strategy.formatMix.static}</p>
                <p className="text-sm text-muted-foreground">Static</p>
              </div>
              <div className="flex-1 rounded-md bg-primary/10 p-4 text-center">
                <p className="text-2xl font-bold">{result.strategy.formatMix.carousel}</p>
                <p className="text-sm text-muted-foreground">Carousel</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Briefs */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Recommended Creatives ({result.strategy.briefs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.strategy.briefs.map((brief, i) => (
                <div key={i} className="rounded-lg border border-border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{brief.title}</h4>
                      <Badge variant="secondary">{brief.format}</Badge>
                      <Badge
                        variant={
                          brief.priority === "HIGH"
                            ? "destructive"
                            : brief.priority === "MEDIUM"
                              ? "warning"
                              : "secondary"
                        }
                      >
                        {brief.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Hook</p>
                      <p>{brief.hook}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Angle</p>
                      <p>{brief.angle}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Key Message</p>
                      <p>{brief.keyMessage}</p>
                    </div>
                    {brief.scriptStructure && (
                      <div className="col-span-2 rounded-md bg-muted/50 p-3">
                        <p className="mb-1 text-xs font-semibold text-muted-foreground">VIDEO SCRIPT</p>
                        <p><span className="font-medium">Hook (0-3s):</span> {brief.scriptStructure.hook}</p>
                        <p><span className="font-medium">Meat:</span> {brief.scriptStructure.meat}</p>
                        <p><span className="font-medium">Action/Offer:</span> {brief.scriptStructure.actionOffer}</p>
                        {brief.targetDuration && (
                          <p className="mt-1 text-xs text-muted-foreground">Target: {brief.targetDuration}s</p>
                        )}
                      </div>
                    )}
                    {brief.visualConcept && (
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Visual Concept</p>
                        <p>{brief.visualConcept}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Generated Copy */}
        {result.copyVariants.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Generated Ad Copy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {result.copyVariants.map((cv, i) => (
                  <div key={i}>
                    <div className="mb-3 flex items-center gap-2">
                      <h4 className="font-semibold">{cv.briefTitle}</h4>
                      <Badge variant="secondary">{cv.format}</Badge>
                    </div>
                    <div className="grid gap-3">
                      {cv.copy.variations.map((v, j) => (
                        <div key={j} className="rounded-md border border-border p-3">
                          <div className="mb-2 flex items-center gap-2">
                            <Badge variant="outline">{v.hookType}</Badge>
                            <span className="text-xs text-muted-foreground">Variation {j + 1}</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground">PRIMARY TEXT</p>
                              <p className="whitespace-pre-wrap">{v.primaryTextLong}</p>
                            </div>
                            <div className="flex gap-4">
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">HEADLINE</p>
                                <p className="font-medium">{v.headline}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-muted-foreground">CTA</p>
                                <p>{v.callToAction}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Kill List */}
        {result.strategy.killList.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recommended to Kill/Pause</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {result.strategy.killList.map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md border border-destructive/20 bg-destructive/5 p-3">
                    <span className="text-sm font-medium">{item.adName}</span>
                    <span className="text-sm text-muted-foreground">{item.reason}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Empty state / Generate button
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Creative Strategy</h2>
          <p className="text-sm text-muted-foreground">
            AI-generated strategy based on performance data analysis
          </p>
        </div>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Strategy"}
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-destructive/50">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <h3 className="mb-2 text-lg font-semibold">Generating Strategy...</h3>
            <p className="text-sm text-muted-foreground">{progress}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              This runs a 4-stage AI pipeline: Analysis (Sonnet) → Strategy (Sonnet) → Copy (Opus) → Visual Concepts (Gemini)
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <svg className="h-8 w-8 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold">Generate a Creative Strategy</h3>
            <p className="mb-6 max-w-md text-center text-sm text-muted-foreground">
              The AI pipeline will analyze your creative performance data, identify
              winning patterns, and generate format-specific briefs with ad copy
              variations. Uses Claude Opus for copy, Sonnet for strategy, and Gemini
              for visual concepts.
            </p>
            <Button onClick={handleGenerate} disabled={loading}>
              Generate Strategy
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
