import ms from "ms";
import {
  generateSessionId,
  hashRefreshToken,
} from "../../utils/auth/auth.helper.js";
import { signAccessToken, signRefreshToken } from "../../utils/auth/jwt.js";
import { comparePassword, hashPassword } from "../../utils/auth/password.js";
import { AppError } from "../../utils/common/errors/AppError.js";
import { IAuthRepository } from "./auth.interface.js";
import { sanitizedUserResponse } from "./auth.response.js";
import { env } from "../../config/env.config.js";
import { userType } from "./auth.types.js";

export class AuthService {
  constructor(private authRepo: IAuthRepository) {}

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

    const { email, password, userAgent, ipAddress } = data;

    const loggedInUser = await this.loginUser({
      email,
      password,
      userAgent,
      ipAddress,
    });

    return loggedInUser;

    // return sanitizedUserResponse(createdUser);
  }

  async loginUser(data: {
    email: string;
    password: string;
    userAgent: string;
    ipAddress: string;
  }) {
    const existingUser = await this.authRepo.findUserByEmail(data.email);

    if (!existingUser || !existingUser.passwordHash) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordCorrect = await comparePassword(
      data.password,
      existingUser.passwordHash,
    );

    if (!isPasswordCorrect) {
      throw new AppError("Invalid credentials", 401);
    }

    const sessionId = generateSessionId();

    const accessToken = signAccessToken({
      sub: existingUser.id,
      sessionId,
    });

    const refreshToken = signRefreshToken({
      sub: existingUser.id,
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
      userId: existingUser.id,
      refreshTokenHash: hashedRefreshToken,
      userAgent: data.userAgent,
      ipAddress: data.ipAddress,
      expiresAt,
    });

    return {
      user: sanitizedUserResponse(existingUser),
      refreshToken,
      accessToken,
    };
  }

  async getLoggedInUser(data: userType) {
    const user = await this.authRepo.findUserById(data.userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }
}
