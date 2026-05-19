import express from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { loginUserSchema, registerUserSchema } from "./auth.schema.js";
import {
  loggedInUserController,
  loginUserController,
  registerUserController,
} from "./auth.controller.js";
import { authMiddleware } from "../../middlewares/authentication.middleware.js";

const router = express.Router();

router
  .route("/register")
  .post(validate(registerUserSchema), registerUserController);

router.route("/login").post(validate(loginUserSchema), loginUserController);

router.route("/me").get(authMiddleware, loggedInUserController);

export default router;
