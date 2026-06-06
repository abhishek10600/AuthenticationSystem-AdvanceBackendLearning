import { AuthProvider, Prisma } from "../../../generated/prisma/client.js";
export type createUserType = {
  email: string;
  hashedPassword: string | null;
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

export type LinkAuthAccountType = {
  userId: string;
  provider: AuthProvider;
  providerAccountId: string;
};

export type AuthAccountWithUser = Prisma.AuthAccountGetPayload<{
  where: {
    provider_providerAccountId: {
      provider: true;
      providerAccountId: true;
    };
  };
  include: {
    user: true;
  };
}>;
