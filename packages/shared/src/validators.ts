import { z } from "zod";

export const createClientSchema = z.object({
  name: z.string().min(1).max(255),
  shopifyDomain: z.string().max(255).optional(),
  industry: z.string().max(100).optional(),
  monthlySpend: z.number().positive().optional(),
  notes: z.string().optional(),
});

export const updateClientSchema = createClientSchema.partial();

export const createBriefSchema = z.object({
  clientId: z.string().uuid(),
  strategyId: z.string().uuid().optional(),
  title: z.string().min(1).max(255),
  objective: z.string().min(1),
  format: z.enum(["IMAGE", "VIDEO", "CAROUSEL", "COLLECTION", "UGC_STYLE", "REELS"]),
  hook: z.string().min(1),
  angle: z.string().min(1),
  targetAudience: z.string().optional(),
  keyMessage: z.string().min(1),
  visualDirection: z.string().optional(),
  dueDate: z.string().datetime().optional(),
});

export const generateCopySchema = z.object({
  clientId: z.string().uuid(),
  briefId: z.string().uuid().optional(),
  brandVoice: z.string().optional(),
  productDescription: z.string().optional(),
  hookType: z.string().optional(),
  angle: z.string().optional(),
  numVariants: z.number().int().min(1).max(20).default(5),
});

export const generateStrategySchema = z.object({
  clientId: z.string().uuid(),
  lookbackDays: z.number().int().min(7).max(90).default(14),
});

export const connectMetaAccountSchema = z.object({
  clientId: z.string().uuid(),
  metaAccountId: z.string().min(1),
  accessToken: z.string().min(1),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type CreateBriefInput = z.infer<typeof createBriefSchema>;
export type GenerateCopyInput = z.infer<typeof generateCopySchema>;
export type GenerateStrategyInput = z.infer<typeof generateStrategySchema>;
export type ConnectMetaAccountInput = z.infer<typeof connectMetaAccountSchema>;
