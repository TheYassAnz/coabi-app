import { z } from "zod";

export const BaseTaskSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
});

export const TaskPostSchema = BaseTaskSchema.extend({
  userId: z.string(),
  accommodationId: z.string(),
});

export const TaskResponseSchema = TaskPostSchema.extend({
  _id: z.string(),
  done: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const TaskPatchSchema = BaseTaskSchema.extend({
  done: z.boolean(),
}).partial();

export type TaskPost = z.infer<typeof TaskPostSchema>;
export type TaskResponse = z.infer<typeof TaskResponseSchema>;
export type TaskPatch = z.infer<typeof TaskPatchSchema>;
