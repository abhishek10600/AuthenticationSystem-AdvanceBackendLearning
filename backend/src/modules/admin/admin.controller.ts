import { Request, Response } from "express";
import { catchAsync } from "../../utils/common/helpers/CatchAsync.js";
import { sendResponse } from "../../utils/common/response/AppResponse.js";
import { adminService } from "./admin.container.js";
import { authService } from "../auth/auth.container.js";
import { request } from "http";

export const getAllUsersController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await adminService.getAllUsers();

    sendResponse(res, 200, {
      success: true,
      message: "Users fetched successfully",
      data: result,
    });
  },
);

export const getAllRolesController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await adminService.getAllRoles();

    sendResponse(res, 200, {
      success: true,
      message: "All roles fetched successfully",
      data: result,
    });
  },
);

export const getRoleByIdController = catchAsync(
  async (req: Request, res: Response) => {
    const roleId = req.params.roleId as string;

    const result = await adminService.getRoleById(roleId);

    sendResponse(res, 200, {
      success: true,
      message: "Role fetched successfully",
      data: result,
    });
  },
);

export const createRoleController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await adminService.createRole(req.body);

    sendResponse(res, 201, {
      success: true,
      message: "Role created successfully",
      data: result,
    });
  },
);

export const updateRoleController = catchAsync(
  async (req: Request, res: Response) => {
    const roleId = req.params.roleId as string;

    const result = await adminService.updateRole(roleId, req.body);

    sendResponse(res, 200, {
      success: true,
      message: "Role updated successfully",
      data: result,
    });
  },
);

export const deleteRoleController = catchAsync(
  async (req: Request, res: Response) => {
    const roleId = req.params.roleId as string;

    await adminService.deleteRole(roleId);

    sendResponse(res, 200, {
      success: true,
      message: "Role deleted successfully",
    });
  },
);

export const assignRoleToUserController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.userId as string;

    await adminService.assignRoleToUser(userId, req.body);

    sendResponse(res, 200, {
      success: true,
      message: "Role assigned to the user successfully",
    });
  },
);

export const removeRoleFromUserController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.userId as string;
    const roleId = req.params.roleId as string;

    await adminService.removeRoleFromUser(userId, roleId);

    sendResponse(res, 200, {
      success: true,
      message: "Role removed successfully",
    });
  },
);

export const getAllUserOfRoleController = catchAsync(
  async (req: Request, res: Response) => {
    const roleId = req.params.roleId as string;

    const result = await adminService.getAllUsersByRoleId(roleId);

    sendResponse(res, 200, {
      success: true,
      message: "Users fetched successfully",
      data: result,
    });
  },
);

export const getUserPermissionsController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.params.userId as string;

    const result = await adminService.getUserPermissions(userId);

    sendResponse(res, 200, {
      success: true,
      message: "User permissions fetched successfully",
      data: result,
    });
  },
);

export const getAllPermissionsController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await adminService.getAllPermissions();

    sendResponse(res, 200, {
      success: true,
      message: "Permissions fetched successfully",
      data: result,
    });
  },
);

export const getPermissionDetailController = catchAsync(
  async (req: Request, res: Response) => {
    const permissionId = req.params.permissionId as string;
    const result = await adminService.getPermissionDetails(permissionId);

    sendResponse(res, 200, {
      success: true,
      message: "Permission details fetched successfully",
      data: result,
    });
  },
);

export const getUsersByPermissionController = catchAsync(
  async (req: Request, res: Response) => {
    const permissionId = req.params.permissionId as string;
    const result = await adminService.getUsersByPermissions(permissionId);

    sendResponse(res, 200, {
      success: true,
      message: "User with the permissions fetched",
      data: result,
    });
  },
);
