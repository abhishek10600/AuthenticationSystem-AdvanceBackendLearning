import { AuthAccount, AuthProvider } from "../../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { IAuthRepository } from "./auth.interface.js";
import {
  createSessionType,
  createUserType,
  updateSessionType,
} from "./auth.types.js";

export class AuthRepository implements IAuthRepository {
  async findUserByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  }

  async findUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  }

  async findSessionById(sessionId: string) {
    const session = await prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });

    return session;
  }

  async revokeUserAllSessions(userId: string) {
    await prisma.session.updateMany({
      where: {
        userId,
      },
      data: {
        isRevoked: true,
      },
    });
  }

  async createUser(data: createUserType) {
    const createdUser = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.hashedPassword,
      },
    });

    return createdUser;
  }

  async findSessionByUserIdAndSessionId(userId: string, sessionId: string) {
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId,
      },
    });

    return session;
  }

  async createSession(data: createSessionType) {
    const newSession = await prisma.session.create({
      data,
    });

    return newSession;
  }

  async updateSession(sessionId: string, data: updateSessionType) {
    const updatedSession = await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        refreshTokenHash: data.hashedNewRefreshToken,
        expiresAt: data.newRefreshTokenExpiresAt,
      },
    });

    return updatedSession;
  }

  async deleteSession(sessionId: string) {
    await prisma.session.update({
      where: {
        id: sessionId,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  async deleteUserAllSessions(userId: string) {
    await prisma.session.updateMany({
      where: {
        userId,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  async getUserPermissions(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        userRoles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,

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
            },
          },
        },
      },
    });

    return user;
  }

  async findAuthAccount(provider: AuthProvider, providerAccountId: string) {
    const authAccount = await prisma.authAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider,
          providerAccountId,
        },
      },
      include: {
        user: true,
      },
    });

    return authAccount;
  }

  async createAuthAccount(data: AuthAccount) {
    return await prisma.authAccount.create({
      data,
    });
  }
}
