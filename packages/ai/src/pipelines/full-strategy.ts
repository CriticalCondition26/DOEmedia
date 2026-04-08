import { generateStructured, generateAnalysis, generateAdCopy } from "../claude-client";
import { generateVisualConcept } from "../gemini-client";
import {
  buildCreativeAnalysisPrompt,
  CREATIVE_ANALYSIS_SYSTEM,
  type PerformanceDataInput,
} from "../prompts/creative-analysis";
import {
  buildStrategyPrompt,
  STRATEGY_SYSTEM,
  type StrategyInput,
} from "../prompts/strategy-generation";
import {
  buildCopyPrompt,
  COPY_SYSTEM,
  type CopyGenerationInput,
} from "../prompts/copy-generation";
import { analysisOutputSchema, type AnalysisOutput } from "../schemas/analysis-schema";
import { strategyOutputSchema, type StrategyOutput } from "../schemas/strategy-schema";
import { copyOutputSchema, type CopyOutput } from "../schemas/copy-schema";
import { AI_MODELS, COPY_VARIANTS_PER_BRIEF } from "@doemedia/shared";

export interface FullStrategyPipelineInput {
  clientName: string;
  industry: string;
  brandVoice: string;
  targetAudience: string;
  productDescription: string;
  performanceData: PerformanceDataInput;
  assetsNeeded: number;
  currentAdCount: number;
}

export interface FullStrategyPipelineOutput {
  analysis: AnalysisOutput;
  strategy: StrategyOutput;
  copyVariants: Array<{
    briefTitle: string;
    format: string;
    copy: CopyOutput;
  }>;
  visualConcepts: Array<{
    briefTitle: string;
    concept: string; // Raw Gemini output
  }>;
}

/**
 * Run the full creative strategy pipeline for a client.
 *
 * Stage 1: Analyze performance data (Claude Sonnet)
 * Stage 2: Generate strategy with format-specific briefs (Claude Sonnet)
 * Stage 3: Generate copy for each brief (Claude Opus)
 * Stage 4: Generate visual concepts for each brief (Gemini Pro)
 *
 * @param onProgress - Optional callback for progress updates (0-100)
 */
export async function runFullStrategyPipeline(
  input: FullStrategyPipelineInput,
  onProgress?: (percent: number, stage: string) => void
): Promise<FullStrategyPipelineOutput> {
  // --- Stage 1: Performance Analysis ---
  onProgress?.(5, "Analyzing creative performance...");

  const analysisPrompt = buildCreativeAnalysisPrompt(input.performanceData);
  const analysis = await generateStructured<AnalysisOutput>(
    analysisPrompt,
    analysisOutputSchema,
    {
      model: AI_MODELS.ANALYSIS_STRATEGY,
      system: CREATIVE_ANALYSIS_SYSTEM,
      temperature: 0.3,
    }
  );

  onProgress?.(25, "Performance analysis complete");

  // --- Stage 2: Strategy Generation ---
  onProgress?.(30, "Generating creative strategy...");

  const strategyInput: StrategyInput = {
    clientName: input.clientName,
    industry: input.industry,
    brandVoice: input.brandVoice,
    targetAudience: input.targetAudience,
    performanceAnalysis: analysis.summary +
      "\n\nWinning patterns: " +
      analysis.winningPatterns.map((p) => p.pattern).join(", ") +
      "\n\nLosing patterns: " +
      analysis.losingPatterns.map((p) => p.pattern).join(", ") +
      "\n\nRecommendations: " +
      analysis.recommendations
        .map((r) => `${r.format} - ${r.hookConcept} (${r.angle})`)
        .join(", "),
    currentAdCount: input.currentAdCount,
    assetsNeeded: input.assetsNeeded,
  };

  const strategyPrompt = buildStrategyPrompt(strategyInput);
  const strategy = await generateStructured<StrategyOutput>(
    strategyPrompt,
    strategyOutputSchema,
    {
      model: AI_MODELS.ANALYSIS_STRATEGY,
      system: STRATEGY_SYSTEM,
      temperature: 0.5,
    }
  );

  onProgress?.(50, "Strategy generated with " + strategy.briefs.length + " briefs");

  // --- Stage 3: Copy Generation (Claude Opus) ---
  onProgress?.(55, "Generating ad copy with Claude Opus...");

  const copyVariants: FullStrategyPipelineOutput["copyVariants"] = [];

  for (let i = 0; i < strategy.briefs.length; i++) {
    const brief = strategy.briefs[i];
    const copyInput: CopyGenerationInput = {
      clientName: input.clientName,
      industry: input.industry,
      brandVoice: input.brandVoice,
      targetAudience: input.targetAudience,
      productDescription: input.productDescription,
      briefContext: {
        format: brief.format,
        hook: brief.hook,
        angle: brief.angle,
        keyMessage: brief.keyMessage,
        objective: brief.objective,
      },
      numVariants: COPY_VARIANTS_PER_BRIEF,
    };

    const copyPrompt = buildCopyPrompt(copyInput);
    const copy = await generateStructured<CopyOutput>(
      copyPrompt,
      copyOutputSchema,
      {
        model: AI_MODELS.COPY_CREATIVE, // Opus for copy
        system: COPY_SYSTEM,
        temperature: 0.8,
      }
    );

    copyVariants.push({
      briefTitle: brief.title,
      format: brief.format,
      copy,
    });

    const progress = 55 + Math.round((i / strategy.briefs.length) * 25);
    onProgress?.(progress, `Generated copy for "${brief.title}"`);
  }

  onProgress?.(80, "All copy generated");

  // --- Stage 4: Visual Concepts (Gemini Pro) ---
  onProgress?.(82, "Generating visual concepts...");

  const visualConcepts: FullStrategyPipelineOutput["visualConcepts"] = [];

  for (const brief of strategy.briefs) {
    if (brief.format === "IMAGE" || brief.format === "CAROUSEL") {
      const concept = await generateVisualConcept(
        `${brief.title}: ${brief.hook} — ${brief.angle} — ${brief.keyMessage}`,
        input.brandVoice,
        analysis.winningPatterns.map((p) => p.pattern)
      );

      visualConcepts.push({
        briefTitle: brief.title,
        concept,
      });
    }
  }

  onProgress?.(100, "Pipeline complete");

  return {
    analysis,
    strategy,
    copyVariants,
    visualConcepts,
  };
}
