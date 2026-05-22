import { IAdminRepository } from "./admin.interface.js";

export class AdminService {
  constructor(private adminRepo: IAdminRepository) {}

  async getAllUsers() {
    const users = await this.adminRepo.getAllUsers();

    return users;
  }
}
