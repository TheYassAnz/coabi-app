import { z } from "zod";
import { BaseUserSchema } from "./user";

export const RegisterSchema = BaseUserSchema;

export const BaseLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const LoginSchema = BaseLoginSchema;

export const LoginResponseSchema = z.object({
  message: z.string(),
  data: z.string(),
});

export const RegisterResponseSchema = z.object({
  message: z.string(),
  data: z.object({}),
});

export type Register = z.infer<typeof RegisterSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
