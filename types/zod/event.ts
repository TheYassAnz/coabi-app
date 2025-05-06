import { z } from "zod";

const BaseEventSchema = z.object({
  title: z.string().max(50, "Keep under 50 characters please"),
  description: z
    .string()
    .max(500, "Keep under 500 characters please")
    .nullable(),
  plannedDate: z.coerce
    .date()
    .refine((date) => date !== null, { message: "Required" }),
  endDate: z.coerce
    .date()
    .refine((date) => date !== null, { message: "Required" }),
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

export interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string | null;
  status?: "pending" | "completed" | "cancelled";
}

export interface EventPost {
  title: string;
  description: string | null;
  plannedDate: Date;
  endDate: Date;
  userId: string;
  accommodationId: string | null;
}

export interface EventPatch {
  title?: string;
  description?: string | null;
  plannedDate?: Date;
  endDate?: Date;
}

export type EventResponse = z.infer<typeof EventResponseSchema>;
