import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "../../lib/redis.js";

export const googleCallbackRateLimiter = rateLimit({
  windowMs: 10 * 1000, // testing

  max: 4, // testing

  standardHeaders: true,
  legacyHeaders: false,

  store: new RedisStore({
    sendCommand: async (...args: string[]) => {
      return redis.call(args[0], ...args.slice(1)) as Promise<any>;
    },

    prefix: "googleCallback",
  }),

  handler: (_, res) => {
    res.status(429).json({
      success: false,
      messgae:
        "Google Callback Rate Limit Message: Too many requests! Please try again later",
    });
  },

  keyGenerator: (req) => {
    return ipKeyGenerator(req.ip as string);
  },
});
