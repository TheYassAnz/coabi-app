import { z } from "zod";

const BaseRuleSchema = z.object({
  title: z
    .string()
    .max(50, "Keep under 50 characters please")
    .nonempty("Required"),
  description: z
    .string()
    .max(500, "Keep under 500 characters please")
    .nonempty("Required")
    .nullable(),
});

export const RulePostSchema = BaseRuleSchema.extend({
  accommodationId: z.string().optional(),
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
