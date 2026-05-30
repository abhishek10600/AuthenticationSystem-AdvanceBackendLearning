import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/common/errors/AppError.js";
import { verifyAccessToken } from "../utils/auth/jwt.js";
import { JWTPayload } from "../modules/auth/auth.types.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new AppError("Authentication required", 401));
    }

    if (!authHeader.startsWith("Bearer ")) {
      return next(new AppError("Invalid authentication header format", 401));
    }

    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      return next(new AppError("Access token missing", 401));
    }

    const payload = verifyAccessToken(accessToken) as JWTPayload;

    req.user = {
      userId: payload.sub,
      sessionId: payload.sessionId,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Access token expired", 401));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid access token", 401));
    }

    return next(error);
  }
};
