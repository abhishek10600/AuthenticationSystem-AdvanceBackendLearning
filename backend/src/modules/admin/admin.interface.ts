import { User } from "../../../generated/prisma/client.js";

export interface IAdminRepository {
  getAllUsers(): Promise<User[]>;
}
