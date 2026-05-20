export type createUserType = {
  email: string;
  hashedPassword: string;
};

export type userType = {
  userId: string;
  sessionId: string;
};

export type JWTPayload = {
  sub: string;
  sessionId: string;
};

export type findUserByIdType = {
  id: string;
  email: string;
  createdAt: Date;
};

export type createSessionType = {
  id: string;
  userId: string;
  refreshTokenHash: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
};

export type updateSessionType = {
  hashedNewRefreshToken: string;
  newRefreshTokenExpiresAt: Date;
};
