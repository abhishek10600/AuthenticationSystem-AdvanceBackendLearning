import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "../../lib/redis.js";

export const registerRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // testing

  max: 30, // testing

  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    sendCommand: async (...args: string[]) => {
      return redis.call(args[0], ...args.slice(1)) as Promise<any>;
    },

    prefix: "register",
  }),

  handler: (_, res) => {
    res.status(429).json({
      success: false,
      messgae:
        "Register Rate Limit Message: Too Many requests. Please try again later",
    });
  },

  keyGenerator: (req) => {
    return ipKeyGenerator(req.ip as string);
  },
});
