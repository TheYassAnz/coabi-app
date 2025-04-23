import { z } from "zod";

export const BaseEventSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  plannedDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const EventPostSchema = BaseEventSchema.extend({
  userId: z.string(),
  accommodationId: z.string(),
});

export const EventResponseSchema = EventPostSchema.extend({
  _id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const EventPatchSchema = BaseEventSchema.partial();

export type EventPost = z.infer<typeof EventPostSchema>;
export type EventResponse = z.infer<typeof EventResponseSchema>;
export type EventPatch = z.infer<typeof EventPatchSchema>;
