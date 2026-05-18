import { Session, User } from "../../../generated/prisma/client.js";
import { createSessionType, createUserType } from "./auth.types.js";

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<User | null>;

  createUser(data: createUserType): Promise<User>;

  createSession(data: createSessionType): Promise<Session>;
}
