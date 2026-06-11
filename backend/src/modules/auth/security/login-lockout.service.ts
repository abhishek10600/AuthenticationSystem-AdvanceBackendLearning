import redis from "../../../lib/redis.js";

export class LoginLockoutService {
  private FAILURE_WINDOW = 24 * 60 * 60;

  async checkLock(email: string, ip: string) {
    const lockKey = this.getPairLockKey(email, ip);

    const ttl = await redis.ttl(lockKey);

    if (ttl > 0) {
      return {
        locked: true,
        ttl,
      };
    }

    return {
      locked: false,
      ttl: 0,
    };
  }

  async recordFailure(email: string, ip: string) {
    const pairKey = this.getPairFailureKey(email, ip);
    const emailKey = this.getEmailFailureKey(email);
    const ipKey = this.getIpFailureKey(ip);

    const [pairAttempts] = await Promise.all([
      redis.incr(pairKey),
      redis.incr(emailKey),
      redis.incr(ipKey),
    ]);

    console.log({ pairAttempts });

    await Promise.all([
      redis.expire(pairKey, this.FAILURE_WINDOW),
      redis.expire(emailKey, this.FAILURE_WINDOW),
      redis.expire(ipKey, this.FAILURE_WINDOW),
    ]);

    const lockDuration = this.getLockDuration(pairAttempts);

    if (lockDuration > 0) {
      await redis.set(
        this.getPairLockKey(email, ip),
        "locked",
        "EX",
        lockDuration,
      );
    }

    return {
      attempts: pairAttempts,
      lockDuration,
    };
  }

  async clearFailures(email: string, ip: string) {
    await redis.del(
      this.getPairFailureKey(email, ip),
      this.getEmailFailureKey(email),
      this.getIpFailureKey(ip),
      this.getPairLockKey(email, ip),
    );
  }

  private getLockDuration(attempts: number) {
    if (attempts >= 20) {
      return 60 * 60;
    }

    if (attempts >= 15) {
      return 30 * 60;
    }

    if (attempts >= 10) {
      return 15 * 60;
    }

    if (attempts >= 5) {
      return 5 * 60;
    }

    return 0;
  }

  private getPairFailureKey(email: string, ip: string) {
    return `login_fail:pair:${ip}:${email}`;
  }

  private getEmailFailureKey(email: string) {
    return `login_fail:email:${email}`;
  }

  private getIpFailureKey(ip: string) {
    return `login_fail:ip:${ip}`;
  }

  private getPairLockKey(email: string, ip: string) {
    return `login_lock:pair:${ip}:${email}`;
  }
}

export const loginLockoutService = new LoginLockoutService();
