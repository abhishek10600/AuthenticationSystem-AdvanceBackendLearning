import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.config.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import { AppError } from "./utils/common/errors/AppError.js";

export const app = express();

// app.set("trust proxy", 1);

app.use(helmet());
app.use(requestLogger);
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health-check", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    uptime: process.uptime(),
    timestamp: Date.now(),
    message: "Health is fine",
  });
});

import authRouter from "./modules/auth/auth.route.js";
import adminRouter from "./modules/admin/admin.route.js";
import oauthRouter from "./modules/auth/oauth/oauth.route.js";
import { requestLogger } from "./middlewares/request-logger.middleware.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/auth", oauthRouter);

app.use((req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
