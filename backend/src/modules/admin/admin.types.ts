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
    isSystem: true;

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

export type GetAllUsersByRoleId = Prisma.UserRoleGetPayload<{
  where: {
    roleId: string;
  };
  include: {
    user: true;
  };
}>;

export type GetUserPermissions = Prisma.UserGetPayload<{
  where: {
    id: true;
  };

  include: {
    userRoles: {
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true;
              };
            };
          };
        };
      };
    };
  };
}>;
