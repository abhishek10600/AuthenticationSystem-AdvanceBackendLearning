import express from "express";
import { authMiddleware } from "../../middlewares/authentication.middleware.js";
import { authorizePermissions } from "../../middlewares/authorization.middleware.js";
import { Permissions } from "../../constants/permissions.js";
import {
  assignRoleToUserController,
  createRoleController,
  deleteRoleController,
  getAllPermissionsController,
  getAllRolesController,
  getAllUserOfRoleController,
  getAllUsersController,
  getPermissionDetailController,
  getRoleByIdController,
  getUserPermissionsController,
  getUsersByPermissionController,
  removeRoleFromUserController,
  updateRoleController,
} from "./admin.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  assignRoleParamsSchema,
  assignRoleSchema,
  deleteRoleSchema,
  getAllUserOfRoleSchema,
  getPermissionDetailSchema,
  getRoleByIdSchema,
  getUserPermissionsSchema,
  getUsersByPermissionSchema,
  removeUserRoleParamsSchema,
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

router
  .route("/users/:userId/roles/:roleId")
  .delete(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_ROLES),
    validate(removeUserRoleParamsSchema, "params"),
    removeRoleFromUserController,
  );

router
  .route("/users/roles/:roleId")
  .get(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_ROLES),
    validate(getAllUserOfRoleSchema, "params"),
    getAllUserOfRoleController,
  );

router
  .route("/users/:userId/permissions")
  .get(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_USERS),
    validate(getUserPermissionsSchema, "params"),
    getUserPermissionsController,
  );

router
  .route("/permissions")
  .get(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_ROLES),
    getAllPermissionsController,
  );

router
  .route("/permissions/:permissionId")
  .get(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_ROLES),
    validate(getPermissionDetailSchema, "params"),
    getPermissionDetailController,
  );

router
  .route("/permissions/:permissionId/users")
  .get(
    authMiddleware,
    authorizePermissions(Permissions.MANAGE_ROLES),
    validate(getUsersByPermissionSchema, "params"),
    getUsersByPermissionController,
  );

export default router;
