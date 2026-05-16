import { User } from "../../../generated/prisma/client.js";
import { createUserType } from "./auth.types.js";

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<User | null>;

  createUser(data: createUserType): Promise<User>;
}
