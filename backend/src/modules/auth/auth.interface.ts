import { Session, User } from "../../../generated/prisma/client.js";
import {
  createSessionType,
  createUserType,
  findUserByIdType,
  updateSessionType,
} from "./auth.types.js";

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<User | null>;

  findUserById(userId: string): Promise<findUserByIdType | null>;

  findSessionByUserIdAndSessionId(
    userId: string,
    sessionId: string,
  ): Promise<Session | null>;

  findSessionById(sessionId: string): Promise<Session | null>;

  revokeUserAllSessions(userId: string): Promise<void>;

  createUser(data: createUserType): Promise<User>;

  createSession(data: createSessionType): Promise<Session>;

  updateSession(sessionId: string, data: updateSessionType): Promise<Session>;

  deleteSession(sessionId: string): Promise<void>;

  deleteUserAllSessions(userId: string): Promise<void>;
}
