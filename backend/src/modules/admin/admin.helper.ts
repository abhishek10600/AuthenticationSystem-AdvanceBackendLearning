import { AppError } from "../../utils/common/errors/AppError.js";

export const ensureRoleIsEditable = (role: { isSystem: boolean }) => {
  if (role.isSystem) {
    throw new AppError("SYSTEM_ROLE_CANNOT_BE_MODIFIED", 403);
  }
};

export const ensureRoleIsDeletable = (role: {
  id: string;
  name: string;
  isSystem: boolean;
  createdAt: Date;
}) => {
  if (role.isSystem) {
    throw new AppError("SYSTEM_ROLES_CANNOT_BE_DELETED", 403);
  }
};

export const ensureRoleIsAssignable = (role: { isSystem: boolean }) => {
  if (role.isSystem) {
    throw new AppError("SYSTEM_ROLES_CANNOT_BE_ASSIGNED", 403);
  }
};
