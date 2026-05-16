import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import { AppError } from "../utils/common/errors/AppError.js";

export const validate =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((error) => ({
        field: error.path.join(""),
        message: error.message,
      }));

      throw new AppError(
        errors.map((error) => `${error.field}: ${error.message}`).join(", "),
        400,
      );
    }

    req.body = result.data;

    next();
  };
