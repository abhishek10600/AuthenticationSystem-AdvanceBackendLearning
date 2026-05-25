import { z } from "zod";
import { PermissionValues } from "../../constants/permissions.js";

export const getRoleByIdSchema = z.object({
  roleId: z.uuid(),
});

export const createRoleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(50)
    .regex(
      /^[A-Z_]+$/,
      "Role name must contain only uppercase letters and underscores",
    ),

  permissions: z.array(z.enum(PermissionValues)),
});

export const updateRoleSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(50)
      .regex(/^[A-Z_]+$/)
      .optional(),

    permissions: z.array(z.enum(PermissionValues)).min(1).optional(),
  })
  .refine((data) => data.name !== undefined || data.permissions !== undefined, {
    message: "At least one field must be provided",
  });

export type CreateRoleInputDTO = z.infer<typeof createRoleSchema>;
export type UpdateRoleInputDTO = z.infer<typeof updateRoleSchema>;
