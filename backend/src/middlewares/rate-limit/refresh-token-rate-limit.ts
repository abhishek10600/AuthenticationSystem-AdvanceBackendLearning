import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "../../lib/redis.js";

export const refreshTokenRateLimiter = rateLimit({
  windowMs: 10 * 1000, // test
  max: 4, // test

  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    sendCommand: async (...args: string[]) => {
      return redis.call(args[0], ...args.slice(1)) as Promise<any>;
    },

    prefix: "refresh token",
  }),

  handler: (_, res) => {
    res.status(429).json({
      success: false,
      messgae:
        "Refresh Token Rate Limit Message: Too Many requests. Please try again later",
    });
  },

  keyGenerator: (req) => {
    return ipKeyGenerator(req.ip as string);
  },
});
