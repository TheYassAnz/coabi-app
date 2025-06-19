import { z } from "zod";

const BaseRefundSchema = z.object({
  title: z.string().max(50, "Keep under 50 characters please"),
  toRefund: z
    .number()
    .min(0, "Refund cannot be inferior to 0")
    .max(1000000, "Not possible"),
  done: z.boolean(),
});

export const RefundBatchPostSchema = z.object({
  title: z.string().max(50, "Keep under 50 characters please"),
  toSplit: z
    .number()
    .min(0, "Refund cannot be inferior to 0")
    .max(1000000, "Not possible"),
  userId: z.string(),
  roommateIds: z.string().array(),
  accommodationId: z.string(),
});

export const RefundResponseSchema = BaseRefundSchema.extend({
  _id: z.string(),
  userId: z.union([
    z.string(),
    z.object({
      _id: z.string(),
      username: z.string(),
    }),
  ]),
  roommateId: z.union([
    z.string(),
    z.object({
      _id: z.string(),
      username: z.string(),
    }),
  ]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const RefundPatchSchema = BaseRefundSchema.partial();

export type RefundBatchPost = z.infer<typeof RefundBatchPostSchema>;
export type RefundResponse = z.infer<typeof RefundResponseSchema>;
export type RefundPatch = z.infer<typeof RefundPatchSchema>;
