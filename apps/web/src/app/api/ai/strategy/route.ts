import { NextResponse } from "next/server";
import {
  runFullStrategyPipeline,
  type FullStrategyPipelineInput,
  type PerformanceDataInput,
} from "@doemedia/ai";
import { DEFAULT_ASSETS_PER_CYCLE } from "@doemedia/shared";

export const maxDuration = 300; // 5 minutes for full pipeline

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientName,
      industry,
      brandVoice,
      targetAudience,
      productDescription,
      performanceData,
    } = body;

    if (!clientName || !industry) {
      return NextResponse.json(
        { error: "clientName and industry are required" },
        { status: 400 }
      );
    }

    // Build performance data input
    // In production, this would be fetched from the database
    const perfData: PerformanceDataInput = performanceData ?? {
      clientName,
      industry,
      brandVoice: brandVoice ?? "",
      dateRange: {
        start: getDateDaysAgo(14),
        end: getDateDaysAgo(0),
      },
      topAds: [],
      bottomAds: [],
      overallMetrics: {
        totalSpend: 0,
        avgRoas: 0,
        avgCtr: 0,
        avgCpa: 0,
        totalPurchases: 0,
        totalRevenue: 0,
      },
      formatBreakdown: [],
    };

    const pipelineInput: FullStrategyPipelineInput = {
      clientName,
      industry,
      brandVoice: brandVoice ?? "",
      targetAudience: targetAudience ?? "",
      productDescription: productDescription ?? "",
      performanceData: perfData,
      assetsNeeded: DEFAULT_ASSETS_PER_CYCLE,
      currentAdCount: 0,
    };

    const result = await runFullStrategyPipeline(pipelineInput, (pct, stage) => {
      console.log(`[Strategy Pipeline] ${pct}% — ${stage}`);
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Strategy generation failed:", error);
    return NextResponse.json(
      { error: "Strategy generation failed", details: String(error) },
      { status: 500 }
    );
  }
}

function getDateDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}
