import { z } from "zod";

export const BaseRuleSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
});

export const RulePostSchema = BaseRuleSchema.extend({
  accommodationId: z.string(),
});

export const RuleResponseSchema = RulePostSchema.extend({
  _id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const RulePatchSchema = BaseRuleSchema.partial();

export type RulePost = z.infer<typeof RulePostSchema>;
export type RuleResponse = z.infer<typeof RuleResponseSchema>;
export type RulePatch = z.infer<typeof RulePatchSchema>;
