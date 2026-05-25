import express from "express";
import { authMiddleware } from "../../middlewares/authentication.middleware.js";
import { authorizePermissions } from "../../middlewares/authorization.middleware.js";
import { Permissions } from "../../constants/permissions.js";
import {
  createRoleController,
  getAllRolesController,
  getAllUsersController,
  getRoleByIdController,
  updateController,
} from "./admin.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { getRoleByIdSchema, updateRoleSchema } from "./admin.schema.js";

const router = express.Router();

router
  .route("/all-users")
  .get(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_USERS),
    getAllUsersController,
  );

router
  .route("/roles")
  .get(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_ROLES),
    getAllRolesController,
  );

router
  .route("/roles")
  .post(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_ROLES),
    createRoleController,
  );

router
  .route("/roles/:roleId")
  .get(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_ROLES),
    validate(getRoleByIdSchema, "params"),
    getRoleByIdController,
  );

router
  .route("/roles/:roleId")
  .patch(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_ROLES),
    validate(updateRoleSchema),
    updateController,
  );

export default router;
