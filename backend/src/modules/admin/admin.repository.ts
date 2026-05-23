import { prisma } from "../../lib/prisma.js";
import { IAdminRepository } from "./admin.interface.js";

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
}
