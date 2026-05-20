import express from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { loginUserSchema, registerUserSchema } from "./auth.schema.js";
import {
  loggedInUserController,
  loginUserController,
  logoutController,
  logoutUserFromAllSessions,
  refreshTokenController,
  registerUserController,
} from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/authentication.middleware.js";

const router = express.Router();

router
  .route("/register")
  .post(validate(registerUserSchema), registerUserController);

router.route("/login").post(validate(loginUserSchema), loginUserController);

router.route("/me").get(authMiddleware, loggedInUserController);

router.route("/refresh-token").post(refreshTokenController);

router.route("/logout").post(authMiddleware, logoutController);

router
  .route("/logout-all-devices")
  .post(authMiddleware, logoutUserFromAllSessions);

export default router;
