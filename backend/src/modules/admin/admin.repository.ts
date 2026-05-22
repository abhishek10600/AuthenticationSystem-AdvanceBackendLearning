import { prisma } from "../../lib/prisma.js";
import { IAdminRepository } from "./admin.interface.js";

export class AdminRepository implements IAdminRepository {
  async getAllUsers() {
    const users = await prisma.user.findMany();

    return users;
  }
}
