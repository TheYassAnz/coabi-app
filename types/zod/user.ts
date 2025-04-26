import { z } from "zod";

export const BaseUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  age: z.number().min(0),
  description: z.string().nullable(),
  email: z.string().email(),
  phoneNumber: z.string(),
});

export const UserResponseSchema = BaseUserSchema.extend({
  _id: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const UserPatchSchema = BaseUserSchema.partial();

export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserPatch = z.infer<typeof UserPatchSchema>;
