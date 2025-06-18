import { z } from "zod";

const BaseAccommodationSchema = z.object({
  name: z
    .string()
    .max(50, "Keep under 50 characters please")
    .nonempty("Required"),
  code: z.string().max(12).optional(),
  location: z
    .string()
    .max(30, "Keep under 30 characters please")
    .nonempty("Required"),
  postalCode: z.number().min(501, "Not possible").max(100000, "Not possible"),
  country: z
    .string()
    .max(30, "Keep under 30 characters please")
    .nonempty("Required"),
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
