import dotenv from "dotenv";
import { z } from "zod";
dotenv.config({
  path: "./.env",
});

const envSchema = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.enum(["development", "production", "test"]),
  FRONTEND_URL: z.url(),
  DATABASE_URL: z.string(),
  SALT_ROUNDS: z.coerce.number(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  ADMIN_EMAIL: z.email(),
  ADMIN_PASSWORD: z
    .string()
    .min(8, "Admin password must be at least 8 characters long"),
  REDIS_URL: z.string(),
  REDIS_PORT: z.coerce.number(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "Invalid environment variables: ",
    z.treeifyError(parsedEnv.error),
  );

  process.exit(1);
}

export const env = parsedEnv.data;
