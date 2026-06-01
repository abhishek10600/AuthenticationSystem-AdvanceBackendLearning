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

export type GetAllPermissionsType = Prisma.PermissionGetPayload<{
  select: {
    id: true;
    name: true;
  };
}>;

export type GetPermissionDetailType = Prisma.PermissionGetPayload<{
  where: {
    id: true;
  };
  select: {
    rolePermissions: {
      select: {
        role: {
          select: {
            id: true;
            name: true;
          };
        };
      };
    };
  };
}>;

export type GetUsersByPermissionType = Prisma.PermissionGetPayload<{
  where: {
    id: true;
  };
  select: {
    id: true;
    name: true;
    rolePermissions: {
      select: {
        role: {
          select: {
            userRoles: {
              select: {
                user: {
                  select: {
                    id: true;
                    email: true;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}>;
