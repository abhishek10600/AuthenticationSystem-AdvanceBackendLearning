import { logger } from "../../../config/logger.js";
import redis from "../../../lib/redis.js";
import { AppError } from "../../../utils/common/errors/AppError.js";

export class RefreshProtectionService {
  private readonly REFRESH_LOCK_PREFIX = "refresh_lock";
  private readonly LOCK_TTL_SECONDS = 5;

  async acquireRefreshLock(sessionId: string) {
    const lockKey = `${this.REFRESH_LOCK_PREFIX}:${sessionId}`;

    const result = await redis.set(
      lockKey,
      "locked",
      "EX",
      this.LOCK_TTL_SECONDS,
      "NX",
    );

    if (!result) {
      throw new AppError("Refresh request already in progress", 409);
    }
  }

  async releaseRefreshLock(sessionId: string) {
    const lockKey = `${this.REFRESH_LOCK_PREFIX}:${sessionId}`;

    await redis.del(lockKey);
  }

  validateSession(session: {
    isRevoked: boolean;
    isDeleted: boolean;
    expiresAt: Date;
  }) {
    if (session.isDeleted) {
      throw new AppError("Session no longer exists", 401);
    }

    if (session.isRevoked) {
      throw new AppError("Session has been revoked", 401);
    }
  }

  logRefreshReuse(data: { userId: string; sessionId: string }) {
    logger.warn(`
        event: refresh_token_reuse,
        userId: ${data.userId},
        sessionId: ${data.sessionId},
        timestamp: ${new Date().toISOString()}
        `);
  }

  logSuspiciousRefresh(data: {
    userId: string;
    sessionId: string;
    previousUserAgent?: string | null;
    currentUserAgent?: string | null;
  }) {
    logger.warn(`
        event: suspicious_refresh,
        userId: ${data.userId},
        sessionId: ${data.sessionId},
        previousUserAgent: ${data.previousUserAgent},
        currentUserAgent: ${data.currentUserAgent},
        timestamp: ${new Date().toISOString()}
        `);
  }
}

export const refreshProtectionService = new RefreshProtectionService();
