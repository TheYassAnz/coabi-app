import { z } from "zod";

export const BaseAccommodationSchema = z.object({
  name: z.string(),
  code: z.string(),
  location: z.string(),
  postalCode: z.number(),
  country: z.string(),
});

export const AccommodationPostSchema = BaseAccommodationSchema;

export const AccommodationResponseSchema = AccommodationPostSchema.extend({
  _id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const AccommodationPatchSchema = AccommodationPostSchema.partial();

export type AccommodationPost = z.infer<typeof AccommodationPostSchema>;
export type AccommodationResponse = z.infer<typeof AccommodationResponseSchema>;
export type AccommodationPatch = z.infer<typeof AccommodationPatchSchema>;
