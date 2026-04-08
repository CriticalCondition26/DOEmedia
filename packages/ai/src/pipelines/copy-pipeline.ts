import { generateStructured } from "../claude-client";
import { buildCopyPrompt, COPY_SYSTEM, type CopyGenerationInput } from "../prompts/copy-generation";
import { copyOutputSchema, type CopyOutput } from "../schemas/copy-schema";
import { AI_MODELS } from "@doemedia/shared";

/**
 * Generate ad copy variants for a single brief.
 * Uses Claude Opus for maximum copy quality.
 */
export async function generateCopyForBrief(
  input: CopyGenerationInput
): Promise<CopyOutput> {
  const prompt = buildCopyPrompt(input);
  return generateStructured<CopyOutput>(prompt, copyOutputSchema, {
    model: AI_MODELS.COPY_CREATIVE,
    system: COPY_SYSTEM,
    temperature: 0.8,
  });
}

/**
 * Generate copy for multiple briefs in sequence.
 * Each brief gets its own Opus call for highest quality.
 */
export async function generateCopyBatch(
  inputs: CopyGenerationInput[],
  onProgress?: (completed: number, total: number, briefTitle: string) => void
): Promise<Array<{ briefIndex: number; copy: CopyOutput }>> {
  const results: Array<{ briefIndex: number; copy: CopyOutput }> = [];

  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const copy = await generateCopyForBrief(input);
    results.push({ briefIndex: i, copy });
    onProgress?.(i + 1, inputs.length, input.briefContext.hook);
  }

  return results;
}
