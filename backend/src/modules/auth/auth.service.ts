import ms from "ms";
import {
  generateSessionId,
  hashRefreshToken,
} from "../../utils/auth/auth.helper.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../utils/auth/jwt.js";
import { comparePassword, hashPassword } from "../../utils/auth/password.js";
import { AppError } from "../../utils/common/errors/AppError.js";
import { IAuthRepository } from "./auth.interface.js";
import { sanitizedUserResponse } from "./auth.response.js";
import { env } from "../../config/env.config.js";
import { userType } from "./auth.types.js";
import { loginLockoutService } from "./security/login-lockout.service.js";

export class AuthService {
  constructor(private authRepo: IAuthRepository) {}

  async createAuthenticatedSession(
    userId: string,
    userAgent: string,
    ipAddress: string,
  ) {
    const sessionId = generateSessionId();

    const accessToken = signAccessToken({
      sub: userId,
      sessionId,
    });

    const refreshToken = signRefreshToken({
      sub: userId,
      sessionId,
    });

    const hashedRefreshToken = hashRefreshToken(refreshToken);

    const refreshTokenExpiresIn = ms(
      env.REFRESH_TOKEN_EXPIRES_IN as ms.StringValue,
    );

    if (typeof refreshTokenExpiresIn !== "number") {
      throw new Error("Invalid refresh token expiry configuration");
    }

    const expiresAt = new Date(Date.now() + refreshTokenExpiresIn);

    await this.authRepo.createSession({
      id: sessionId,
      userId: userId,
      refreshTokenHash: hashedRefreshToken,
      userAgent: userAgent,
      ipAddress: ipAddress,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async registerUser(data: {
    email: string;
    password: string;
    userAgent: string;
    ipAddress: string;
  }) {
    const existingUser = await this.authRepo.findUserByEmail(data.email);

    if (existingUser) {
      throw new AppError("User with this email already exists!", 400);
    }

    const hashedPassword = await hashPassword(data.password);

    const createdUser = await this.authRepo.createUser({
      email: data.email,
      hashedPassword,
    });

    const authSession = await this.createAuthenticatedSession(
      createdUser.id,
      data.userAgent,
      data.ipAddress,
    );

    return {
      user: sanitizedUserResponse(createdUser),
      ...authSession,
    };
  }

  async loginUser(data: {
    email: string;
    password: string;
    userAgent: string;
    ipAddress: string;
  }) {
    const existingUser = await this.authRepo.findUserByEmail(data.email);

    if (!existingUser || !existingUser.passwordHash) {
      await loginLockoutService.recordFailure(data.email, data.ipAddress);
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordCorrect = await comparePassword(
      data.password,
      existingUser.passwordHash,
    );

    if (!isPasswordCorrect) {
      await loginLockoutService.recordFailure(data.email, data.ipAddress);
      throw new AppError("Invalid credentials", 401);
    }

    await loginLockoutService.clearFailures(data.email, data.ipAddress);

    const authSession = await this.createAuthenticatedSession(
      existingUser.id,
      data.userAgent,
      data.ipAddress,
    );

    return {
      user: sanitizedUserResponse(existingUser),
      ...authSession,
    };
  }

  async getLoggedInUser(data: userType) {
    const user = await this.authRepo.findUserById(data.userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  async refreshSession(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    const session = await this.authRepo.findSessionById(payload.sessionId);

    if (!session) {
      throw new AppError("Session not found", 404);
    }

    if (session.isRevoked) {
      throw new AppError("Session has been revoked", 401);
    }

    if (session.expiresAt < new Date()) {
      throw new AppError("Session has expired", 401);
    }

    const incomingRefreshTokenHash = hashRefreshToken(refreshToken);

    const isIncomingRefreshTokenValid =
      incomingRefreshTokenHash === session.refreshTokenHash;

    if (!isIncomingRefreshTokenValid) {
      await this.authRepo.revokeUserAllSessions(session.userId);

      throw new AppError("Refresh token reuse detected", 401);
    }

    const newAccessToken = signAccessToken({
      sub: session.userId,
      sessionId: session.id,
    });

    const newRefreshToken = signRefreshToken({
      sub: session.userId,
      sessionId: session.id,
    });

    const hashedNewRefreshToken = hashRefreshToken(newRefreshToken);

    const newRefreshTokenExpiresIn = ms(
      env.REFRESH_TOKEN_EXPIRES_IN as ms.StringValue,
    );

    if (typeof newRefreshTokenExpiresIn !== "number") {
      throw new Error("Invalid refresh token expiry configuration");
    }

    const newRefreshTokenExpiresAt = new Date(
      Date.now() + newRefreshTokenExpiresIn,
    );

    const updatedSession = await this.authRepo.updateSession(session.id, {
      hashedNewRefreshToken,
      newRefreshTokenExpiresAt,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string, sessionId: string) {
    const session = await this.authRepo.findSessionByUserIdAndSessionId(
      userId,
      sessionId,
    );

    if (!session) {
      throw new AppError(
        "Session not found or you are not authorized to perform this action",
        401,
      );
    }

    await this.authRepo.deleteSession(session.id);
  }

  async logoutUserFromAllSessions(userId: string) {
    await this.authRepo.deleteUserAllSessions(userId);
  }

  async getUserPermissions(userId: string) {
    const user = await this.authRepo.getUserPermissions(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // console.dir(user, { depth: null });

    // get the roles
    const roles = user.userRoles.map((userRole) => userRole.role.name);

    // get the permissions
    const permissions = user.userRoles.flatMap((userRole) =>
      userRole.role.rolePermissions.map(
        (rolePermission) => rolePermission.permission.name,
      ),
    );

    // get the unique permissions
    const uniquePermissions = [...new Set(permissions)];

    return {
      user: {
        id: user.id,
        email: user.email,
      },

      roles,

      permissions: uniquePermissions,
    };
  }
}
