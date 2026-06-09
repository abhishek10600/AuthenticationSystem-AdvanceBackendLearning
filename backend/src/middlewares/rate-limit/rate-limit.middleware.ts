import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "../../lib/redis.js";

export const gloabalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // for testing

  max: 400, // for testing

  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    sendCommand: async (...args: string[]) => {
      return redis.call(args[0], ...args.slice(1)) as Promise<any>;
    },

    prefix: "global",
  }),

  handler: (_, res) => {
    res.status(429).json({
      success: false,
      message:
        "Global Rate Limit Message: Too many requests. Please try again later",
    });
  },
});
