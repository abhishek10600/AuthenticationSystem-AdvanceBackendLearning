import { IMMUTABLE_ROLES } from "../../constants/system-role.js";
import { AppError } from "../../utils/common/errors/AppError.js";
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

    return updatedRole;
  }

  async deleteRole(roleId: string) {
    const role = await this.adminRepo.getRoleById(roleId);

    if (!role) {
      throw new AppError("Role not found", 404);
    }

    ensureRoleIsDeletable(role);

    // if (IMMUTABLE_ROLES.includes(role.name as any)) {
    //   throw new AppError("System roles cannot be deleted", 403);
    // }

    await this.adminRepo.deleteRole(roleId);
  }

  async assignRoleToUser(userId: string, data: AssignRoleInputDTO) {
    const roles = await this.adminRepo.getRolesByIds(data.roleIds);

    for (const role of roles) {
      ensureRoleIsAssignable(role);
    }

    // const immutableRoles = roles.filter((role) =>
    //   IMMUTABLE_ROLES.includes(role.name as any),
    // );

    // if (immutableRoles.length > 0) {
    //   throw new AppError("Immutable roles cannot be assigned", 403);
    // }

    await this.adminRepo.assignRoleToUser(userId, data.roleIds);
  }

  async removeRoleFromUser(userId: string, roleId: string) {
    await this.adminRepo.removeUserRole(userId, roleId);
  }

  async getAllUsersByRoleId(roleId: string) {
    const data = await this.adminRepo.getAllUsersByRoleId(roleId);

    return data;
  }

  async getUserPermissions(userId: string) {
    const user = await this.adminRepo.getUserPermissions(userId);

    const permissions = user.userRoles.flatMap((userRole) =>
      userRole.role.rolePermissions.map(
        (rolePermission) => rolePermission.permission.name,
      ),
    );

    const uniquePermissions = [...new Set(permissions)];

    return uniquePermissions;
  }
}
