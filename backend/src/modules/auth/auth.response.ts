import { email } from "zod";
import { User } from "../../../generated/prisma/client.js";

export const sanitizedUserResponse = (user: User) => {
  return {
    id: user.id,
    email: user.email,
    isEmailVerified: user.isEmailVerified,
    provider: user.provider,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
