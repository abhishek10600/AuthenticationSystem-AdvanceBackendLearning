import { AppError } from "../../utils/common/errors/AppError.js";
import { permissionService } from "../auth/auth.permission.service.js";
import { toResponseDTO } from "./admin.dto.js";
import {
  ensureRoleIsAssignable,
  ensureRoleIsDeletable,
  ensureRoleIsEditable,
} from "./admin.helper.js";
import { IAdminRepository } from "./admin.interface.js";
import {
  AssignRoleInputDTO,
  CreateRoleInputDTO,
  UpdateRoleInputDTO,
} from "./admin.schema.js";

export class AdminService {
  constructor(private adminRepo: IAdminRepository) {}

  async getAllUsers() {
    const users = await this.adminRepo.getAllUsers();

    return users;
  }

  async getAllRoles() {
    const roles = await this.adminRepo.getAllRoles();

    const data = roles.map((role) => ({
      id: role.id,
      name: role.name,
      createdAt: role.createdAt,
      userCount: role.userRoles.length,
      permissions: role.rolePermissions.map(
        (rolePermission) => rolePermission.permission.name,
      ),
    }));

    return data;
  }

  async getRoleById(roleId: string) {
    const role = await this.adminRepo.getRoleById(roleId);

    if (!role) {
      throw new AppError("Role not found", 404);
    }

    const responseDTO = toResponseDTO(role);

    return responseDTO;
  }

  async createRole(data: CreateRoleInputDTO) {
    const role = await this.adminRepo.createRoleWithPermissions(
      data.name,
      data.permissions,
    );

    console.log({ role });

    return role;
  }

  async updateRole(roleId: string, data: UpdateRoleInputDTO) {
    const role = await this.adminRepo.getRoleById(roleId);

    if (!role) {
      throw new AppError("Role not found", 404);
    }

    ensureRoleIsEditable(role);

    const updatedRole = await this.adminRepo.updateRole(roleId, data);

    await permissionService.invalidateRoleUsers(roleId);

    return updatedRole;
  }

  async deleteRole(roleId: string) {
    const role = await this.adminRepo.getRoleById(roleId);

    if (!role) {
      throw new AppError("Role not found", 404);
    }

    ensureRoleIsDeletable(role);

    await permissionService.invalidateRoleUsers(roleId);

    await this.adminRepo.deleteRole(roleId);
  }

  async assignRoleToUser(userId: string, data: AssignRoleInputDTO) {
    const roles = await this.adminRepo.getRolesByIds(data.roleIds);

    for (const role of roles) {
      ensureRoleIsAssignable(role);
    }

    await this.adminRepo.assignRoleToUser(userId, data.roleIds);

    await permissionService.invalidateUserPermissions(userId);
  }

  async removeRoleFromUser(userId: string, roleId: string) {
    await this.adminRepo.removeUserRole(userId, roleId);

    await permissionService.invalidateUserPermissions(userId);
  }

  async getAllUsersByRoleId(roleId: string) {
    const data = await this.adminRepo.getAllUsersByRoleId(roleId);

    return data;
  }

  async getUserPermissions(userId: string) {
    const userPermissions = await permissionService.getUserPermissions(userId);

    return userPermissions;
  }

  async getAllPermissions() {
    const permissions = await this.adminRepo.getAllPermissions();

    return permissions;
  }

  async getPermissionDetails(permissionId: string) {
    const permission = await this.adminRepo.getPermissionDetails(permissionId);

    return permission;
  }

  async getUsersByPermissions(permissionId: string) {
    const permission = await this.adminRepo.getUsersByPermission(permissionId);

    if (!permission) {
      throw new AppError("Permission not found", 404);
    }

    const users = permission?.rolePermissions.flatMap((rolePermission) =>
      rolePermission.role.userRoles.map((userRole) => userRole.user),
    );

    if (!users) {
      throw new AppError("Users not found", 404);
    }

    const uniqueUsers = Array.from(
      new Map(users.map((user) => [user.id, user])).values(),
    );

    return {
      permission: {
        id: permission.id,
        name: permission.name,
      },
      users: uniqueUsers,
    };
  }
}
