import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/common/errors/AppError.js";
import { prisma } from "../lib/prisma.js";
import { permissionService } from "../modules/auth/auth.permission.service.js";

export const authorizePermissions =
  (...requiredPermissions: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new AppError("Unauthorized", 401));
      }

      const permissions = await permissionService.getUserPermissions(
        req.user.userId,
      );

      // check required permissions
      const hasPermissions = requiredPermissions.every((permission) =>
        permissions.includes(permission),
      );

      if (!hasPermissions) {
        return next(new AppError("Forbidden", 403));
      }

      next();
    } catch (error) {
      return next(error);
    }
  };
