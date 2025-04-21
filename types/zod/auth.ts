import { z } from "zod";
import { BaseUserSchema } from "./user";

export const RegisterSchema = BaseUserSchema;

export const BaseLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const LoginSchema = BaseLoginSchema;

export const LoginResponseSchema = z.string();

export type Register = z.infer<typeof RegisterSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
