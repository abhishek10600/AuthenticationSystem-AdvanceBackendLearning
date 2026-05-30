export const SYSTEM_ROLES = {
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export const IMMUTABLE_ROLES = [
  SYSTEM_ROLES.ADMIN,
  SYSTEM_ROLES.SUPER_ADMIN,
] as const;
