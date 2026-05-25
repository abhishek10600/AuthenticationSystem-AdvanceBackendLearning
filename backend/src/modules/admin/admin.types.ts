import { Prisma } from "../../../generated/prisma/client.js";

export type AllRolesType = Prisma.RoleGetPayload<{
  select: {
    id: true;
    name: true;
    createdAt: true;

    userRoles: {
      select: {
        userId: true;
      };
    };

    rolePermissions: {
      select: {
        permission: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
  };
}>[];

export type GetRoleByIdType = Prisma.RoleGetPayload<{
  select: {
    id: true;
    name: true;
    createdAt: true;

    rolePermissions: {
      select: {
        assignedAt: true;

        permission: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };

    userRoles: {
      select: {
        assignedAt: true;

        user: {
          select: {
            id: true;
            email: true;
            createdAt: true;
          };
        };
      };
    };
  };
}>;

export type UpdateRoleInputType = {
  name?: string;
  permissions?: string[];
};
