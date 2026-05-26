import express from "express";
import { authMiddleware } from "../../middlewares/authentication.middleware.js";
import { authorizePermissions } from "../../middlewares/authorization.middleware.js";
import { Permissions } from "../../constants/permissions.js";
import {
  assignRoleToUserController,
  createRoleController,
  deleteRoleController,
  getAllRolesController,
  getAllUsersController,
  getRoleByIdController,
  updateRoleController,
} from "./admin.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  assignRoleParamsSchema,
  assignRoleSchema,
  deleteRoleSchema,
  getRoleByIdSchema,
  updateRoleSchema,
} from "./admin.schema.js";

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
    updateRoleController,
  );

router
  .route("/roles/:roleId")
  .delete(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_ROLES),
    validate(deleteRoleSchema, "params"),
    deleteRoleController,
  );

router
  .route("/users/:userId/roles")
  .post(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_ROLES),
    validate(assignRoleParamsSchema, "params"),
    validate(assignRoleSchema, "body"),
    assignRoleToUserController,
  );

export default router;
