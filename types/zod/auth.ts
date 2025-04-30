import { z } from "zod";
import { UserResponseSchema } from "./user";

const BaseRegisterSchema = z
  .object({
    username: z
      .string()
      .max(50, "Keep under 50 characters please")
      .nonempty("Required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(72, "Password must be at most 72 characters long")
      .nonempty("Required"),
    confirmPassword: z.string(),
    email: z
      .string()
      .nonempty("Required")
      .email("Email is not valid")
      .max(50, "Keep under 50 characters please"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const RegisterSchema = BaseRegisterSchema;

export const RegisterResponseSchema = UserResponseSchema;

const BaseLoginSchema = z.object({
  username: z.string().nonempty("Required"),
  password: z.string().nonempty("Required"),
});

export const AccessSchema = BaseLoginSchema;

export const AccessResponseSchema = z.object({
  accessToken: z.string(),
});

export type Register = z.infer<typeof RegisterSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type Access = z.infer<typeof AccessSchema>;
export type AccessResponse = z.infer<typeof AccessResponseSchema>;
