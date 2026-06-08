import { AuthProvider } from "../../../../generated/prisma/client.js";
import { env } from "../../../config/env.config.js";
import { googleClient } from "../../../lib/google.js";
import { AppError } from "../../../utils/common/errors/AppError.js";
import { IAuthRepository } from "../auth.interface.js";
import { sanitizedUserResponse } from "../auth.response.js";
import { AuthService } from "../auth.service.js";
import { GoogleUserProfile } from "./oauth.dto.js";
import { generateOAuthState } from "./oauth.helper.js";

export class GoogleOAuthService {
  constructor(
    private authRepo: IAuthRepository,
    private authServie: AuthService,
  ) {}
  async generateGoogleAuthUrl() {
    const state = generateOAuthState();

    const url = googleClient.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      state,
      scope: ["openid", "email", "profile"],
    });

    return {
      url,
      state,
    };
  }

  async validateOAuthState(cookieState: string, state: string) {
    if (!cookieState || !state || cookieState !== state) {
      throw new AppError("Invalid OAuth state", 401);
    }
  }

  async exchangeCodeForGoogleUser(code: string): Promise<GoogleUserProfile> {
    const { tokens } = await googleClient.getToken(code);

    if (!tokens.id_token) {
      throw new AppError("Google did not return an ID token", 401);
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new AppError("Failed to retrieve Google profile", 401);
    }

    if (!payload.sub) {
      throw new AppError("Google account identifier missing", 401);
    }

    if (!payload.email) {
      throw new AppError("Google email missing", 401);
    }

    return {
      providerAccountId: payload.sub,
      email: payload.email,
      emailVerified: payload.email_verified ?? false,
      name: payload.name,
      picture: payload.picture,
    };
  }

  async findOrCreateGoogleUser(googleUser: GoogleUserProfile) {
    const existingAuthAccount = await this.authRepo.findAuthAccount(
      AuthProvider.GOOGLE,
      googleUser.providerAccountId,
    );

    if (existingAuthAccount) {
      return existingAuthAccount.user;
    }

    const existingUser = await this.authRepo.findUserByEmail(googleUser.email);

    if (existingUser) {
      if (!googleUser.emailVerified) {
        throw new AppError("Google email is not verified", 401);
      }

      await this.authRepo.linkAuthAccount({
        userId: existingUser.id,
        provider: AuthProvider.GOOGLE,
        providerAccountId: googleUser.providerAccountId,
      });

      return existingUser;
    }

    const user = await this.authRepo.createUser({
      email: googleUser.email,
      hashedPassword: null,
    });

    await this.authRepo.createAuthAccount({
      id: crypto.randomUUID(),
      userId: user.id,
      provider: AuthProvider.GOOGLE,
      providerAccountId: googleUser.providerAccountId,
      createdAt: new Date(),
    });

    return sanitizedUserResponse(user);
  }

  async handleGoogleCallback(
    code: string,
    userAgent: string,
    ipAddress: string,
  ) {
    const googleUser = await this.exchangeCodeForGoogleUser(code);

    const user = await this.findOrCreateGoogleUser(googleUser);

    const authSession = await this.authServie.createAuthenticatedSession(
      user.id,
      userAgent,
      ipAddress,
    );

    return {
      user,
      accessToken: authSession.accessToken,
      refreshToken: authSession.refreshToken,
    };
  }
}
