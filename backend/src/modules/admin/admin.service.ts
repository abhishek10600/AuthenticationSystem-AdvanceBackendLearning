import { AppError } from "../../utils/common/errors/AppError.js";
import { toResponseDTO } from "./admin.dto.js";
import { IAdminRepository } from "./admin.interface.js";
import { CreateRoleInputDTO, UpdateRoleInputDTO } from "./admin.schema.js";

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
    const updatedRole = await this.adminRepo.updateRole(roleId, data);

    return updatedRole;
  }
}
