// Clients
export {
  generateText,
  generateStructured,
  generateAdCopy,
  generateAnalysis,
} from "./claude-client";
export { analyzeVideoAd, generateVisualConcept } from "./gemini-client";

// Prompts
export {
  buildCreativeAnalysisPrompt,
  CREATIVE_ANALYSIS_SYSTEM,
  type PerformanceDataInput,
} from "./prompts/creative-analysis";
export {
  buildStrategyPrompt,
  STRATEGY_SYSTEM,
  type StrategyInput,
} from "./prompts/strategy-generation";
export {
  buildCopyPrompt,
  COPY_SYSTEM,
  type CopyGenerationInput,
} from "./prompts/copy-generation";
export {
  buildVideoBreakdownPrompt,
  buildHooksAnglesPrompt,
  VIDEO_ANALYSIS_SYSTEM,
} from "./prompts/hooks-angles";
export {
  buildVisualConceptPrompt,
  VISUAL_CONCEPT_SYSTEM,
} from "./prompts/visual-concepts";
export {
  buildAlertAnalysisPrompt,
  ALERT_ANALYSIS_SYSTEM,
  type AlertAnalysisInput,
} from "./prompts/alert-analysis";

// Schemas
export { analysisOutputSchema, type AnalysisOutput } from "./schemas/analysis-schema";
export { strategyOutputSchema, type StrategyOutput } from "./schemas/strategy-schema";
export { copyOutputSchema, type CopyOutput } from "./schemas/copy-schema";
export { conceptOutputSchema, type ConceptOutput } from "./schemas/concept-schema";

// Pipelines
export {
  runFullStrategyPipeline,
  type FullStrategyPipelineInput,
  type FullStrategyPipelineOutput,
} from "./pipelines/full-strategy";
export { generateCopyForBrief, generateCopyBatch } from "./pipelines/copy-pipeline";
