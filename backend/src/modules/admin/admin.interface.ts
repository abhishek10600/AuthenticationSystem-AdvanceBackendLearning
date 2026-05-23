import { User } from "../../../generated/prisma/client.js";
import { AllRolesType, GetRoleByIdType } from "./admin.types.js";

export interface IAdminRepository {
  getAllUsers(): Promise<User[]>;

  getAllRoles(): Promise<AllRolesType>;

  getRoleById(roleId: string): Promise<GetRoleByIdType | null>;
}
