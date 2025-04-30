import { z } from "zod";

const BaseUserSchema = z.object({
  firstName: z.string().max(50, "Keep under 50 characters please").nullable(),
  lastName: z.string().max(50, "Keep under 50 characters please").nullable(),
  username: z
    .string()
    .max(50, "Keep under 50 characters please")
    .nonempty("Required"),
  age: z
    .number()
    .min(0, "Age cannot be inferiour to 0")
    .max(120, "You are not above 120 years old :)")
    .nullable(),
  description: z
    .string()
    .max(500, "Keep under 500 characters please")
    .nullable(),
  email: z
    .string()
    .nonempty("Required")
    .email("Email is not valid")
    .max(50, "Keep under 50 characters please"),
  phoneNumber: z.string().max(15, "Keep under 15 characters please").nullable(),
  profilePictureId: z.string().nullable(),
  accommodationId: z.string().nullable(),
});

export const UserResponseSchema = BaseUserSchema.extend({
  _id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const UserPatchSchema = BaseUserSchema.partial();

export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserPatch = z.infer<typeof UserPatchSchema>;
