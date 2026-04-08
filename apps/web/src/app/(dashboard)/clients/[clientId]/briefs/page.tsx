"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Brief {
  id: string;
  title: string;
  format: "IMAGE" | "VIDEO" | "CAROUSEL";
  hook: string;
  angle: string;
  keyMessage: string;
  objective: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: string;
  // Video-specific
  scriptStructure?: { hook: string; meat: string; actionOffer: string };
  targetDuration?: number;
  // Static-specific
  visualConcept?: string;
  headlineApproach?: string;
  // Carousel-specific
  slides?: Array<{ slideNumber: number; content: string }>;
}

// Example briefs - in production, these come from the strategy generation pipeline
const exampleBriefs: Brief[] = [
  {
    id: "1",
    title: "UGC Skin Transformation Testimonial",
    format: "VIDEO",
    hook: "Pattern interrupt with before/after transformation reveal",
    angle: "social_proof",
    keyMessage: "Real people, real results — see the transformation",
    objective: "Drive purchases of the Complete Skincare Set",
    priority: "HIGH",
    status: "draft",
    scriptStructure: {
      hook: "Quick flash of before skin (dull, textured) with text overlay 'I was SO skeptical...' — pause — then flash to glowing after",
      meat: "Customer talking directly to camera about their 14-day journey. Show morning routine application. Include 2-3 close-up skin texture shots. Overlay star rating and review snippet.",
      actionOffer: "End card with product lineup, '14-Day Glow Challenge' headline, 20% off code with countdown timer graphic",
    },
    targetDuration: 28,
  },
  {
    id: "2",
    title: "Dermatologist Recommendation Static",
    format: "IMAGE",
    hook: "Bold claim: '94% of dermatologists recommend this ingredient'",
    angle: "educational",
    keyMessage: "Backed by science, loved by skin",
    objective: "Build trust and drive serum purchases",
    priority: "HIGH",
    status: "draft",
    visualConcept: "Clean, clinical-meets-luxury aesthetic. Product bottle centered with subtle lab/science visual elements. Serum droplet macro photography. White/gold color palette.",
    headlineApproach: "Lead with the statistic as authority, then the benefit as emotion",
  },
  {
    id: "3",
    title: "Morning Routine Problem/Solution Carousel",
    format: "CAROUSEL",
    hook: "Pain point question: 'Tired of waking up to dull, tired-looking skin?'",
    angle: "problem_solution",
    keyMessage: "3 simple steps to morning glow",
    objective: "Educate on routine and drive starter kit sales",
    priority: "MEDIUM",
    status: "draft",
    slides: [
      { slideNumber: 1, content: "Hook slide: Close-up of frustrated face in mirror, bold text 'Your morning skin shouldn\\'t look like this'" },
      { slideNumber: 2, content: "Step 1: Cleanser — show product in use, explain the gentle formula" },
      { slideNumber: 3, content: "Step 2: Serum — dropper application close-up, highlight key ingredient" },
      { slideNumber: 4, content: "Step 3: SPF Moisturizer — final application, show the glow" },
      { slideNumber: 5, content: "CTA slide: Before/after comparison, 'Start your glow routine — 20% off starter kit'" },
    ],
  },
];

function getPriorityColor(priority: string) {
  if (priority === "HIGH") return "destructive" as const;
  if (priority === "MEDIUM") return "warning" as const;
  return "secondary" as const;
}

function getFormatIcon(format: string) {
  switch (format) {
    case "VIDEO":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      );
    case "CAROUSEL":
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="7" height="18" x="3" y="3" rx="1" />
          <rect width="7" height="18" x="14" y="3" rx="1" />
        </svg>
      );
    default:
      return (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      );
  }
}

export default function BriefsPage() {
  const [briefs] = useState<Brief[]>(exampleBriefs);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Creative Briefs</h2>
          <p className="text-sm text-muted-foreground">
            Format-specific briefs — Video (hook→meat→offer), Static (visual+headline), Carousel (slide-by-slide)
          </p>
        </div>
        <Button>Generate Briefs from Strategy</Button>
      </div>

      {/* Brief Cards */}
      <div className="space-y-4">
        {briefs.map((brief) => (
          <Card key={brief.id} className="overflow-hidden">
            {/* Brief Header */}
            <div
              className="flex cursor-pointer items-center justify-between p-4 hover:bg-muted/30"
              onClick={() => setExpandedId(expandedId === brief.id ? null : brief.id)}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                  {getFormatIcon(brief.format)}
                </div>
                <div>
                  <h3 className="font-semibold">{brief.title}</h3>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{brief.format}</Badge>
                    <Badge variant={getPriorityColor(brief.priority)}>{brief.priority}</Badge>
                    <Badge variant="outline">{brief.status}</Badge>
                  </div>
                </div>
              </div>
              <svg
                className={`h-5 w-5 text-muted-foreground transition-transform ${expandedId === brief.id ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {/* Expanded Content */}
            {expandedId === brief.id && (
              <CardContent className="border-t border-border pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">HOOK</p>
                    <p>{brief.hook}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">ANGLE</p>
                    <p>{brief.angle}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">KEY MESSAGE</p>
                    <p>{brief.keyMessage}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">OBJECTIVE</p>
                    <p>{brief.objective}</p>
                  </div>
                </div>

                {/* Format-Specific Section */}
                <div className="mt-4">
                  {/* VIDEO: Hook → Meat → Action/Offer */}
                  {brief.format === "VIDEO" && brief.scriptStructure && (
                    <div className="rounded-lg bg-muted/30 p-4">
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                        {getFormatIcon("VIDEO")}
                        Video Script Structure
                        {brief.targetDuration && (
                          <Badge variant="secondary">{brief.targetDuration}s</Badge>
                        )}
                      </h4>
                      <div className="space-y-3">
                        <div className="rounded-md border-l-4 border-primary bg-background p-3">
                          <p className="text-xs font-bold text-primary">HOOK (0-3s)</p>
                          <p className="text-sm">{brief.scriptStructure.hook}</p>
                        </div>
                        <div className="rounded-md border-l-4 border-warning bg-background p-3">
                          <p className="text-xs font-bold text-warning">MEAT (3-20s)</p>
                          <p className="text-sm">{brief.scriptStructure.meat}</p>
                        </div>
                        <div className="rounded-md border-l-4 border-success bg-background p-3">
                          <p className="text-xs font-bold text-success">ACTION/OFFER (20-{brief.targetDuration}s)</p>
                          <p className="text-sm">{brief.scriptStructure.actionOffer}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STATIC: Visual Concept + Headline */}
                  {brief.format === "IMAGE" && (
                    <div className="rounded-lg bg-muted/30 p-4">
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                        {getFormatIcon("IMAGE")}
                        Static Creative Direction
                      </h4>
                      <div className="space-y-3">
                        {brief.visualConcept && (
                          <div className="rounded-md border-l-4 border-primary bg-background p-3">
                            <p className="text-xs font-bold text-primary">VISUAL CONCEPT</p>
                            <p className="text-sm">{brief.visualConcept}</p>
                          </div>
                        )}
                        {brief.headlineApproach && (
                          <div className="rounded-md border-l-4 border-warning bg-background p-3">
                            <p className="text-xs font-bold text-warning">HEADLINE APPROACH</p>
                            <p className="text-sm">{brief.headlineApproach}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* CAROUSEL: Slide-by-Slide */}
                  {brief.format === "CAROUSEL" && brief.slides && (
                    <div className="rounded-lg bg-muted/30 p-4">
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                        {getFormatIcon("CAROUSEL")}
                        Carousel Slide Breakdown ({brief.slides.length} slides)
                      </h4>
                      <div className="space-y-2">
                        {brief.slides.map((slide) => (
                          <div
                            key={slide.slideNumber}
                            className="flex gap-3 rounded-md bg-background p-3"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                              {slide.slideNumber}
                            </div>
                            <p className="text-sm">{slide.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Button size="sm">Generate Copy</Button>
                  <Button size="sm" variant="outline">Edit Brief</Button>
                  <Button size="sm" variant="outline">Assign to Designer</Button>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
