import { z } from "zod";
import { UserResponseSchema } from "./user";

export const RegisterSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
  email: z.string().email(),
});

export const BaseLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const LoginSchema = BaseLoginSchema;

export const LoginResponseSchema = z.object({
  token: z.string(),
});

export const RegisterResponseSchema = UserResponseSchema;

export type Register = z.infer<typeof RegisterSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
