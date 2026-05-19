import { prisma } from "../../lib/prisma.js";
import { IAuthRepository } from "./auth.interface.js";
import { createSessionType, createUserType } from "./auth.types.js";

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

  async createUser(data: createUserType) {
    const createdUser = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.hashedPassword,
      },
    });

    return createdUser;
  }

  async createSession(data: createSessionType) {
    const newSession = await prisma.session.create({
      data,
    });

    return newSession;
  }
}
