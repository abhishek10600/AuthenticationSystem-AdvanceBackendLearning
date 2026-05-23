import { Prisma } from "../../../generated/prisma/client.js";
export type createUserType = {
  email: string;
  hashedPassword: string;
};

export type userType = {
  userId: string;
  sessionId: string;
};

export type JWTPayload = {
  sub: string;
  sessionId: string;
};

export type findUserByIdType = {
  id: string;
  email: string;
  createdAt: Date;
};

export type createSessionType = {
  id: string;
  userId: string;
  refreshTokenHash: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
};

export type updateSessionType = {
  hashedNewRefreshToken: string;
  newRefreshTokenExpiresAt: Date;
};

export type UserPermissionsType = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;

    userRoles: {
      select: {
        role: {
          select: {
            id: true;
            name: true;

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
        };
      };
    };
  };
}>;
