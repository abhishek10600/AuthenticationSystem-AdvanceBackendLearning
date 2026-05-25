export const Permissions = {
  MANAGE_USERS: "manage_users",
  DELETE_POSTS: "delete_posts",
  VIEW_ANALYTICS: "view_analytics",
  MANAGE_ROLES: "manage_roles",
} as const;

export type PermissionType = (typeof Permissions)[keyof typeof Permissions];

export const PermissionValues = Object.values(Permissions);
