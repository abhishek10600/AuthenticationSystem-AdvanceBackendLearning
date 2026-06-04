import express from "express";
import {
  googleCallBackController,
  redirectToGoogleController,
} from "./oauth.controller.js";

const router = express.Router();

router.route("/google").get(redirectToGoogleController);

router.route("/google/callback").get(googleCallBackController);

export default router;
