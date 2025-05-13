import { z } from "zod";
import { UserResponseSchema } from "./user";

const BaseRegisterSchema = z
  .object({
    username: z
      .string()
      .max(50, "L'identifiant doit faire moins de 50 caractères")
      .nonempty("L'identifiant est requis"),
    password: z
      .string()
      .min(8, "Le mot de passe doit faire au moins 8 caractères")
      .max(72, "Le mot de passe doit faire moins de 72 caractères")
      .nonempty("Le mot de passe est requis"),
    confirmPassword: z
      .string()
      .min(8, "Le mot de passe doit faire au moins 8 caractères")
      .max(72, "Le mot de passe doit faire moins de 72 caractères")
      .nonempty("La confirmation du mot de passe est requise"),
    email: z
      .string()
      .nonempty("L'email est requis")
      .email("L'email n'est pas valide")
      .max(50, "L'email doit faire moins de 50 caractères"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const RegisterSchema = BaseRegisterSchema;

export const RegisterResponseSchema = UserResponseSchema;

const BaseLoginSchema = z.object({
  username: z.string().nonempty("L'identifiant est requis"),
  password: z.string().nonempty("Le mot de passe est requis"),
});

export const AccessSchema = BaseLoginSchema;

export const AccessResponseSchema = z.object({
  accessToken: z.string(),
});

export type Register = z.infer<typeof RegisterSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type Access = z.infer<typeof AccessSchema>;
export type AccessResponse = z.infer<typeof AccessResponseSchema>;
