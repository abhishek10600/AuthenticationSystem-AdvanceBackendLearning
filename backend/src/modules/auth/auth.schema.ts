import { z } from "zod";

export const registerUserSchema = z
  .object({
    email: z.email("Invalid email").trim().toLowerCase(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .max(72, "Password cannot be more than 72 characters"),
    confirmPassword: z.string(),
    captchaToken: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password and ConfirmPassword do not match",
  });

export const loginUserSchema = z.object({
  email: z.email("Invalid email").trim().toLowerCase(),
  password: z.string(),
  captchaToken: z.string().optional(),
});

export type RegisterUserDTO = z.infer<typeof registerUserSchema>;
export type LoginUserDTO = z.infer<typeof loginUserSchema>;
