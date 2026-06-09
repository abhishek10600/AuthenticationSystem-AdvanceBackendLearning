import express from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { loginUserSchema, registerUserSchema } from "./auth.schema.js";
import {
  getUserPermissionsController,
  loggedInUserController,
  loginUserController,
  logoutController,
  logoutUserFromAllSessions,
  refreshTokenController,
  registerUserController,
} from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/authentication.middleware.js";
import { loginRateLimiter } from "../../middlewares/rate-limit/login-rate-limit.js";
import { registerRateLimiter } from "../../middlewares/rate-limit/register-rate-limit.js";
import { refreshTokenRateLimiter } from "../../middlewares/rate-limit/refresh-token-rate-limit.js";

const router = express.Router();

router
  .route("/register")
  .post(
    registerRateLimiter,
    validate(registerUserSchema),
    registerUserController,
  );

router
  .route("/login")
  .post(loginRateLimiter, validate(loginUserSchema), loginUserController);

router.route("/me").get(authMiddleware, loggedInUserController);

router
  .route("/me/permissions")
  .get(authMiddleware, getUserPermissionsController);

router
  .route("/refresh-token")
  .post(refreshTokenRateLimiter, refreshTokenController);

router.route("/logout").post(authMiddleware, logoutController);

router
  .route("/logout-all-devices")
  .post(authMiddleware, logoutUserFromAllSessions);

export default router;
