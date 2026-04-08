"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PipelineItem {
  id: string;
  clientName: string;
  briefTitle: string;
  format: string;
  type: string;
  status: string;
  assignedTo: string | null;
  dueDate: string | null;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

const columns = [
  { key: "queued", title: "Queued", color: "border-t-muted-foreground" },
  { key: "in_progress", title: "In Progress", color: "border-t-primary" },
  { key: "review", title: "Review", color: "border-t-warning" },
  { key: "approved", title: "Approved", color: "border-t-success" },
  { key: "live", title: "Live", color: "border-t-green-600" },
];

// Mock pipeline items
const mockItems: PipelineItem[] = [
  {
    id: "p1",
    clientName: "GlowSkin Co",
    briefTitle: "UGC Skin Transformation Testimonial",
    format: "VIDEO",
    type: "creative_production",
    status: "queued",
    assignedTo: "Karly",
    dueDate: "2026-04-15",
    priority: "HIGH",
  },
  {
    id: "p2",
    clientName: "GlowSkin Co",
    briefTitle: "Dermatologist Recommendation Static",
    format: "IMAGE",
    type: "creative_production",
    status: "queued",
    assignedTo: "Karly",
    dueDate: "2026-04-15",
    priority: "HIGH",
  },
  {
    id: "p3",
    clientName: "GlowSkin Co",
    briefTitle: "Morning Routine Carousel",
    format: "CAROUSEL",
    type: "creative_production",
    status: "in_progress",
    assignedTo: "Karly",
    dueDate: "2026-04-12",
    priority: "MEDIUM",
  },
  {
    id: "p4",
    clientName: "FitLife Supplements",
    briefTitle: "Pre-Workout Comparison Video",
    format: "VIDEO",
    type: "creative_production",
    status: "in_progress",
    assignedTo: "Karly",
    dueDate: "2026-04-13",
    priority: "HIGH",
  },
  {
    id: "p5",
    clientName: "FitLife Supplements",
    briefTitle: "Ingredient Spotlight Static",
    format: "IMAGE",
    type: "creative_production",
    status: "review",
    assignedTo: "David",
    dueDate: "2026-04-10",
    priority: "MEDIUM",
  },
  {
    id: "p6",
    clientName: "VitalityPets",
    briefTitle: "Happy Dog UGC Compilation",
    format: "VIDEO",
    type: "creative_production",
    status: "approved",
    assignedTo: "Jacob",
    dueDate: "2026-04-09",
    priority: "HIGH",
  },
  {
    id: "p7",
    clientName: "UrbanThread Apparel",
    briefTitle: "Street Style Lookbook Carousel",
    format: "CAROUSEL",
    type: "creative_production",
    status: "live",
    assignedTo: null,
    dueDate: null,
    priority: "MEDIUM",
  },
];

function getPriorityColor(priority: string) {
  if (priority === "HIGH") return "destructive" as const;
  if (priority === "MEDIUM") return "warning" as const;
  return "secondary" as const;
}

function getFormatColor(format: string) {
  if (format === "VIDEO") return "bg-blue-500/20 text-blue-400";
  if (format === "IMAGE") return "bg-pink-500/20 text-pink-400";
  return "bg-purple-500/20 text-purple-400";
}

export default function PipelinePage() {
  const [items, setItems] = useState<PipelineItem[]>(mockItems);

  function moveItem(itemId: string, newStatus: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, status: newStatus } : item
      )
    );
  }

  function getColumnItems(status: string) {
    return items.filter((item) => item.status === status);
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Creative Pipeline</h1>
          <p className="text-muted-foreground">
            Track creative production across all pods — {items.length} items in pipeline
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Filter by Pod</Button>
          <Button variant="outline">Filter by Client</Button>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="mb-6 flex gap-4">
        {columns.map((col) => {
          const count = getColumnItems(col.key).length;
          return (
            <div key={col.key} className="flex items-center gap-2 text-sm">
              <div className={`h-3 w-3 rounded-full ${col.color.replace("border-t-", "bg-")}`} />
              <span className="text-muted-foreground">{col.title}:</span>
              <span className="font-semibold">{count}</span>
            </div>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-5 gap-4">
        {columns.map((col) => {
          const colItems = getColumnItems(col.key);
          return (
            <div key={col.key}>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">{col.title}</h3>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                  {colItems.length}
                </span>
              </div>
              <div className={`min-h-[60vh] space-y-3 rounded-lg border border-border/50 border-t-4 ${col.color} bg-muted/20 p-3`}>
                {colItems.length === 0 ? (
                  <p className="py-8 text-center text-xs text-muted-foreground">
                    No items
                  </p>
                ) : (
                  colItems.map((item) => (
                    <Card key={item.id} className="cursor-pointer transition-shadow hover:shadow-md">
                      <CardContent className="p-3">
                        <div className="mb-2 flex items-start justify-between">
                          <span className={`rounded-md px-1.5 py-0.5 text-xs font-medium ${getFormatColor(item.format)}`}>
                            {item.format}
                          </span>
                          <Badge variant={getPriorityColor(item.priority)} className="text-[10px]">
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="mb-1 text-sm font-medium leading-tight">
                          {item.briefTitle}
                        </p>
                        <p className="mb-2 text-xs text-muted-foreground">
                          {item.clientName}
                        </p>

                        {/* Assignee + Due Date */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          {item.assignedTo && (
                            <span className="flex items-center gap-1">
                              <div className="h-4 w-4 rounded-full bg-primary/30" />
                              {item.assignedTo}
                            </span>
                          )}
                          {item.dueDate && (
                            <span>Due {new Date(item.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                          )}
                        </div>

                        {/* Quick status change buttons */}
                        <div className="mt-2 flex gap-1">
                          {col.key !== "live" && (
                            <button
                              onClick={() => {
                                const colIdx = columns.findIndex((c) => c.key === col.key);
                                if (colIdx < columns.length - 1) {
                                  moveItem(item.id, columns[colIdx + 1].key);
                                }
                              }}
                              className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/20"
                            >
                              Move &rarr;
                            </button>
                          )}
                          {col.key !== "queued" && (
                            <button
                              onClick={() => {
                                const colIdx = columns.findIndex((c) => c.key === col.key);
                                if (colIdx > 0) {
                                  moveItem(item.id, columns[colIdx - 1].key);
                                }
                              }}
                              className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-muted/80"
                            >
                              &larr; Back
                            </button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
