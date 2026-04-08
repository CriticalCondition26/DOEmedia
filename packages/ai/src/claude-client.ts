import Anthropic from "@anthropic-ai/sdk";
import { AI_MODELS } from "@doemedia/shared";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic();
  }
  return client;
}

export interface GenerateOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  system?: string;
}

/**
 * Generate text using Claude. Defaults to Opus for copy/creative work.
 */
export async function generateText(
  prompt: string,
  options: GenerateOptions = {}
): Promise<string> {
  const anthropic = getClient();
  const response = await anthropic.messages.create({
    model: options.model ?? AI_MODELS.COPY_CREATIVE,
    max_tokens: options.maxTokens ?? 4096,
    temperature: options.temperature ?? 0.7,
    system: options.system,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock?.text ?? "";
}

/**
 * Generate structured JSON output using Claude with tool use.
 */
export async function generateStructured<T>(
  prompt: string,
  schema: Record<string, unknown>,
  options: GenerateOptions = {}
): Promise<T> {
  const anthropic = getClient();
  const response = await anthropic.messages.create({
    model: options.model ?? AI_MODELS.COPY_CREATIVE,
    max_tokens: options.maxTokens ?? 8192,
    temperature: options.temperature ?? 0.5,
    system: options.system,
    messages: [{ role: "user", content: prompt }],
    tools: [
      {
        name: "output",
        description: "Structured output",
        input_schema: schema as Anthropic.Tool["input_schema"],
      },
    ],
    tool_choice: { type: "tool", name: "output" },
  });

  const toolBlock = response.content.find((block) => block.type === "tool_use");
  if (!toolBlock || toolBlock.type !== "tool_use") {
    throw new Error("No structured output returned from Claude");
  }
  return toolBlock.input as T;
}

/**
 * Generate ad copy using Opus (strongest model for highest-leverage output)
 */
export async function generateAdCopy(
  prompt: string,
  system: string
): Promise<string> {
  return generateText(prompt, {
    model: AI_MODELS.COPY_CREATIVE,
    temperature: 0.8,
    system,
    maxTokens: 4096,
  });
}

/**
 * Generate analysis using Sonnet (good for data analysis and pattern recognition)
 */
export async function generateAnalysis(
  prompt: string,
  system: string
): Promise<string> {
  return generateText(prompt, {
    model: AI_MODELS.ANALYSIS_STRATEGY,
    temperature: 0.3,
    system,
    maxTokens: 8192,
  });
}
