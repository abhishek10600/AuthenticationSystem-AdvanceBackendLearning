import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/common/errors/AppError.js";
import { IAdminRepository } from "./admin.interface.js";
import { UpdateRoleInputDTO } from "./admin.schema.js";
import { UpdateRoleInputType } from "./admin.types.js";

export class AdminRepository implements IAdminRepository {
  async getAllUsers() {
    const users = await prisma.user.findMany();

    return users;
  }

  async getAllRoles() {
    const roles = await prisma.role.findMany({
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
}
