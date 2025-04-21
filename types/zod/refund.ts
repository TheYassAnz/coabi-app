import { z } from "zod";

export const BaseRefundSchema = z.object({
  title: z.string(),
  toRefund: z.number(),
  done: z.boolean(),
});

export const RefundBatchPostSchema = z.object({
  title: z.string(),
  toSplit: z.number(),
  userId: z.string(),
  roommateIds: z.string().array(),
});

export const RefundResponseSchema = BaseRefundSchema.extend({
  _id: z.string(),
  userId: z.string(),
  roommateId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const RefundPatchSchema = BaseRefundSchema.partial();

export type RefundBatchPost = z.infer<typeof RefundBatchPostSchema>;
export type RefundResponse = z.infer<typeof RefundResponseSchema>;
export type RefundPatch = z.infer<typeof RefundPatchSchema>;
