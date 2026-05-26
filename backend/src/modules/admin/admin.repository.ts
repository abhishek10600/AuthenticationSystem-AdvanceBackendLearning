import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/common/errors/AppError.js";
import { IAdminRepository } from "./admin.interface.js";
import {
  AssignRoleInputDTO,
  getRoleByIdSchema,
  UpdateRoleInputDTO,
} from "./admin.schema.js";
import { UpdateRoleInputType } from "./admin.types.js";

export class AdminRepository implements IAdminRepository {
  async getAllUsers() {
    const users = await prisma.user.findMany();

    return users;
  }

  async getAllRoles() {
    const roles = await prisma.role.findMany({
      where: {
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,

        userRoles: {
          select: {
            userId: true,
          },
        },

        rolePermissions: {
          select: {
            permission: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    return roles;
  }

  async getRoleById(roleId: string) {
    const role = await prisma.role.findUnique({
      where: {
        id: roleId,
        isDeleted: false,
      },

      select: {
        id: true,
        name: true,
        createdAt: true,

        rolePermissions: {
          select: {
            assignedAt: true,

            permission: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },

        userRoles: {
          select: {
            assignedAt: true,

            user: {
              select: {
                id: true,
                email: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    return role;
  }

  async getRolesByIds(roleIds: string[]) {
    const roles = await prisma.role.findMany({
      where: {
        id: {
          in: roleIds,
        },
      },
    });

    return roles;
  }

  async createRoleWithPermissions(name: string, permissions: string[]) {
    return prisma.$transaction(async (tx) => {
      const existingRole = await tx.role.findUnique({
        where: {
          name,
        },
      });

      if (existingRole) {
        throw new AppError("ROLE_ALREADY_EXISTS", 409);
      }

      const dbPermissions = await tx.permission.findMany({
        where: {
          name: {
            in: permissions,
          },
        },
      });

      if (dbPermissions.length !== permissions.length) {
        throw new AppError("INVALID_PERMISSIONS", 400);
      }

      const role = await tx.role.create({
        data: {
          name,
        },
      });

      await tx.rolePermission.createMany({
        data: dbPermissions.map((permission) => ({
          roleId: role.id,
          permissionId: permission.id,
        })),
      });

      return role;
    });
  }

  async updateRole(roleId: string, data: UpdateRoleInputDTO) {
    return prisma.$transaction(async (tx) => {
      const existingRole = await tx.role.findUnique({
        where: {
          id: roleId,
        },
        include: {
          rolePermissions: true,
        },
      });

      if (!existingRole) {
        throw new AppError("ROLE_NOT_FOUND", 404);
      }

      if (data.name) {
        const duplicateRole = await tx.role.findFirst({
          where: {
            name: data.name,

            NOT: {
              id: roleId,
            },
          },
        });

        if (duplicateRole) {
          throw new AppError("ROLE_ALREADY_EXISTS", 409);
        }
      }

      const updateRole = await tx.role.update({
        where: {
          id: roleId,
        },
        data: {
          ...(data.name && {
            name: data.name,
          }),
        },
      });

      if (data.permissions) {
        const dbPermissions = await tx.permission.findMany({
          where: {
            name: {
              in: data.permissions,
            },
          },
        });

        if (dbPermissions.length !== data.permissions.length) {
          throw new AppError("INVALID_PERMISSION", 400);
        }

        // delete the old permission
        await tx.rolePermission.deleteMany({
          where: {
            roleId,
          },
        });

        // insert new permissions
        await tx.rolePermission.createMany({
          data: dbPermissions.map((permission) => ({
            roleId,
            permissionId: permission.id,
          })),
        });
      }

      return updateRole;
    });
  }

  async deleteRole(roleId: string) {
    await prisma.$transaction(async (tx) => {
      const existingRole = await tx.role.findUnique({
        where: {
          id: roleId,
          isDeleted: false,
        },
        include: {
          userRoles: true,
        },
      });

      if (!existingRole) {
        throw new AppError("ROLE_NOT_FOUND", 404);
      }

      if (existingRole.userRoles.length > 0) {
        throw new AppError("ROLE_ASSIGNED_TO_USER", 409);
      }

      await tx.role.update({
        where: {
          id: roleId,
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      return true;
    });
  }

  async assignRoleToUser(userId: string, roleIds: string[]) {
    await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!existingUser) {
        throw new AppError("User not found", 404);
      }

      const roles = await tx.role.findMany({
        where: {
          id: {
            in: roleIds,
          },
          isDeleted: false,
        },
      });

      console.log({ roles });

      if (roles.length !== roleIds.length) {
        throw new AppError("INVALID_ROLES", 400);
      }

      const existingAssignments = await tx.userRole.findMany({
        where: {
          userId,
          roleId: {
            in: roleIds,
          },
        },
      });

      const existingRoleIds = new Set(
        existingAssignments.map((assignment) => assignment.roleId),
      );

      const newAssignment = roleIds.filter(
        (roleId) => !existingRoleIds.has(roleId),
      );

      if (newAssignment.length === 0) {
        throw new AppError("ROLES_ALREADY_ASSIGNED", 400);
      }

      await tx.userRole.createMany({
        data: newAssignment.map((roleId) => ({
          userId,
          roleId,
        })),
      });

      return true;
    });
  }
}
