import { Role, User } from "../../../generated/prisma/client.js";
import { AssignRoleInputDTO, UpdateRoleInputDTO } from "./admin.schema.js";
import {
  AllRolesType,
  GetAllPermissionsType,
  GetAllUsersByRoleId,
  GetPermissionDetailType,
  GetRoleByIdType,
  GetUserPermissions,
  GetUsersByPermissionType,
} from "./admin.types.js";

export interface IAdminRepository {
  getAllUsers(): Promise<User[]>;

  getAllRoles(): Promise<AllRolesType>;

  getRoleById(roleId: string): Promise<GetRoleByIdType | null>;

  getRolesByIds(roleIds: string[]): Promise<Role[]>;

  createRoleWithPermissions(name: string, permissions: string[]): Promise<Role>;

  updateRole(roleId: string, data: UpdateRoleInputDTO): Promise<Role>;

  deleteRole(roleId: string): Promise<void>;

  assignRoleToUser(userId: string, roleId: string[]): Promise<void>;

  removeUserRole(userId: string, roleId: string): Promise<void>;

  getAllUsersByRoleId(roleId: string): Promise<GetAllUsersByRoleId[]>;

  getUserPermissions(userId: string): Promise<GetUserPermissions>;

  getAllPermissions(): Promise<GetAllPermissionsType[]>;

  getPermissionDetails(
    permissionId: string,
  ): Promise<GetPermissionDetailType | null>;

  getUsersByPermission(
    permissionId: string,
  ): Promise<GetUsersByPermissionType | null>;
}
