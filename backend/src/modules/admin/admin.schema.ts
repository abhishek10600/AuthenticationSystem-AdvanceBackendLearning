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

export const deleteRoleSchema = z.object({
  roleId: z.uuid(),
});

export const assignRoleSchema = z.object({
  roleIds: z.array(z.uuid()).min(1),
});

export const assignRoleParamsSchema = z.object({
  userId: z.uuid(),
});

export const removeUserRoleParamsSchema = z.object({
  userId: z.uuid(),
  roleId: z.uuid(),
});

export const getAllUserOfRoleSchema = z.object({
  roleId: z.uuid(),
});

export const getUserPermissionsSchema = z.object({
  userId: z.uuid(),
});

export const getPermissionDetailSchema = z.object({
  permissionId: z.uuid(),
});

export const getUsersByPermissionSchema = z.object({
  permissionId: z.uuid(),
});

export type CreateRoleInputDTO = z.infer<typeof createRoleSchema>;
export type UpdateRoleInputDTO = z.infer<typeof updateRoleSchema>;
export type AssignRoleInputDTO = z.infer<typeof assignRoleSchema>;
