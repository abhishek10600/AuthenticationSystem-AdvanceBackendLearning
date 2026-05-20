import crypto from "crypto";
import { Response } from "express";
import { env } from "../../config/env.config.js";
import ms from "ms";

export const hashRefreshToken = (refreshToken: string) => {
  return crypto.createHash("sha256").update(refreshToken).digest("hex");
};

export const generateSessionId = () => {
  return crypto.randomUUID();
};

export const setCookies = (res: Response, refreshToken: string) => {
  const refreshTokenMaxAge = ms(env.REFRESH_TOKEN_EXPIRES_IN as ms.StringValue);

  if (typeof refreshTokenMaxAge !== "number") {
    throw new Error("Invalid refresh token expiry configuration");
  }

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // blocks document.cookie from accessing cookie
    secure: env.NODE_ENV === "production", // if true it is only used for HTTPs
    sameSite: "strict",
    maxAge: refreshTokenMaxAge,
    path: "/api/v1/auth/refresh-token", // pass the refresh token path here
  });
};

export const clearCookies = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/v1/auth/refresh-token",
  });
};
