"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CopyVariation {
  hookType: string;
  primaryTextShort: string;
  primaryTextMedium: string;
  primaryTextLong: string;
  headline: string;
  description?: string;
  callToAction: string;
  tone?: string;
  emotionalTrigger?: string;
}

export default function CopyPage() {
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState<CopyVariation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Form state
  const [hook, setHook] = useState("What if your morning routine could actually transform your skin in 14 days?");
  const [angle, setAngle] = useState("social_proof");
  const [format, setFormat] = useState("IMAGE");
  const [keyMessage, setKeyMessage] = useState("Clinically proven results in 14 days");
  const [numVariants, setNumVariants] = useState(5);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: "GlowSkin Co",
          industry: "Skincare",
          brandVoice: "Clean, confident, empowering. Speaks to women 25-45 who value self-care.",
          targetAudience: "Women 25-45, interested in skincare routines and clean beauty",
          productDescription: "Premium clean skincare products including serums, moisturizers, and SPF",
          format,
          hook,
          angle,
          keyMessage,
          objective: "Drive purchases",
          numVariants,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Copy generation failed");
      }

      const data = await response.json();
      setVariations(data.variations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string, idx: number) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Ad Copy Generator</h2>
          <p className="text-sm text-muted-foreground">
            Generate ad copy variations powered by Claude Opus — the strongest model for creative writing
          </p>
        </div>
      </div>

      {/* Input Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Brief Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Hook Concept</label>
              <textarea
                value={hook}
                onChange={(e) => setHook(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={2}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Key Message</label>
              <textarea
                value={keyMessage}
                onChange={(e) => setKeyMessage(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                rows={2}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Angle</label>
              <select
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="social_proof">Social Proof</option>
                <option value="problem_solution">Problem/Solution</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="ugc">UGC</option>
                <option value="founder_story">Founder Story</option>
                <option value="comparison">Comparison</option>
                <option value="educational">Educational</option>
                <option value="urgency">Urgency</option>
                <option value="emotional">Emotional</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="IMAGE">Static Image</option>
                <option value="VIDEO">Video</option>
                <option value="CAROUSEL">Carousel</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Variations</label>
              <select
                value={numVariants}
                onChange={(e) => setNumVariants(parseInt(e.target.value))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="3">3 variations</option>
                <option value="5">5 variations</option>
                <option value="8">8 variations</option>
                <option value="10">10 variations</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleGenerate} disabled={loading} className="w-full">
                {loading ? "Generating with Opus..." : "Generate Copy"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 border-destructive/50">
          <CardContent className="p-4">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <p className="text-sm text-muted-foreground">Generating {numVariants} copy variations with Claude Opus...</p>
          </CardContent>
        </Card>
      )}

      {/* Generated Variations */}
      {variations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{variations.length} Copy Variations</h3>
          {variations.map((v, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Variation {i + 1}</span>
                    <Badge variant="outline">{v.hookType.replace("_", " ")}</Badge>
                    {v.tone && <Badge variant="secondary">{v.tone}</Badge>}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(v.primaryTextLong, i)}
                  >
                    {copiedIdx === i ? "Copied!" : "Copy"}
                  </Button>
                </div>

                {/* Three lengths */}
                <div className="space-y-3">
                  <div className="rounded-md bg-muted/30 p-3">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">SHORT (&lt;125 chars)</p>
                    <p className="text-sm">{v.primaryTextShort}</p>
                  </div>
                  <div className="rounded-md bg-muted/30 p-3">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">MEDIUM (&lt;250 chars)</p>
                    <p className="text-sm">{v.primaryTextMedium}</p>
                  </div>
                  <div className="rounded-md bg-muted/30 p-3">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">LONG (Full)</p>
                    <p className="whitespace-pre-wrap text-sm">{v.primaryTextLong}</p>
                  </div>
                </div>

                {/* Headline + CTA */}
                <div className="mt-3 flex gap-6 border-t border-border pt-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">HEADLINE</p>
                    <p className="text-sm font-semibold">{v.headline}</p>
                  </div>
                  {v.description && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">DESCRIPTION</p>
                      <p className="text-sm">{v.description}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">CTA</p>
                    <p className="text-sm">{v.callToAction}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state when no variations generated */}
      {!loading && variations.length === 0 && !error && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-muted-foreground">
              Fill in the brief details above and click &ldquo;Generate Copy&rdquo; to create ad copy variations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
