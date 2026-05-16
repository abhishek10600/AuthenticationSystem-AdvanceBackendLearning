import express from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { registerUserSchema } from "./auth.schema.js";
import { registerUserController } from "./auth.controller.js";

const router = express.Router();

router
  .route("/register")
  .post(validate(registerUserSchema), registerUserController);

export default router;
