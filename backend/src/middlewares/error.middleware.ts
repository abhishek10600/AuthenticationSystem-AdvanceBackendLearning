import { NextFunction, Request, Response } from "express";
import { env } from "../config/env.config.js";

export const globalErrorHandler = (
  err: Error & {
    statusCode?: number;
    status?: string;
    isOperational?: boolean;
  },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || "error";

  if (env.NODE_ENV === "development") {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      stack: err.stack,
      error,
    });
  }

  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};
