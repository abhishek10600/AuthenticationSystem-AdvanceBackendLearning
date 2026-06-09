import express from "express";
import {
  googleCallBackController,
  redirectToGoogleController,
} from "./oauth.controller.js";
import { oAuthStartRateLimiter } from "../../../middlewares/rate-limit/google-oauth-start-rate-limit.js";
import { googleCallbackRateLimiter } from "../../../middlewares/rate-limit/google-callback-rate-limit.js";

const router = express.Router();

router.route("/google").get(oAuthStartRateLimiter, redirectToGoogleController);

router
  .route("/google/callback")
  .get(googleCallbackRateLimiter, googleCallBackController);

export default router;
