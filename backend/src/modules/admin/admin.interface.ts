import { Role, User } from "../../../generated/prisma/client.js";
import { UpdateRoleInputDTO } from "./admin.schema.js";
import { AllRolesType, GetRoleByIdType } from "./admin.types.js";

export interface IAdminRepository {
  getAllUsers(): Promise<User[]>;

  getAllRoles(): Promise<AllRolesType>;

  getRoleById(roleId: string): Promise<GetRoleByIdType | null>;

  createRoleWithPermissions(name: string, permissions: string[]): Promise<Role>;

  updateRole(roleId: string, data: UpdateRoleInputDTO): Promise<Role>;
}
