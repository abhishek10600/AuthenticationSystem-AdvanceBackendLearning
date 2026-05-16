import bcrypt from "bcrypt";
import { env } from "../../config/env.config.js";

const saltRounds = Number(env.SALT_ROUNDS);

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  return await bcrypt.compare(password, hashedPassword);
};
