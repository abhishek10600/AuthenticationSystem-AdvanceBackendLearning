import { env } from "../../../config/env.config.js";
import { logger } from "../../../config/logger.js";
import { AppError } from "../../../utils/common/errors/AppError.js";
import { TurnstileVerificationResponse } from "../auth.types.js";

class CaptchaService {
  async verifyTurnstileToken(
    captchaToken: string,
    ipAddress?: string,
  ): Promise<void> {
    if (!captchaToken) {
      throw new AppError("Captcha token is required", 400);
    }

    try {
      const formData = new URLSearchParams();

      formData.append("secret", env.CLOUDFLARE_TURNSTILE_SECRET_KEY);
      formData.append("response", captchaToken);

      if (ipAddress) {
        formData.append("remoteip", ipAddress);
      }

      const response = await fetch(
        `${env.CLOUDFLARE_TURNSTILE_TOKEN_VERIFICATION_URL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new AppError("Captcha verification failed", 400);
      }

      const result = (await response.json()) as TurnstileVerificationResponse;

      if (!result.success) {
        logger.error(`{
            event: captcha_verification_failed,
            errorCode: ${result["error-codes"]},
            ipAddress: ${ipAddress},
            timestamp: ${new Date().toISOString()}
            }`);

        throw new AppError("Captcha Verification failed", 400);
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      logger.error(`{
        event: captcha_service_error,
        error: ${error},
        timestamp: ${new Date().toISOString()}
        }`);

      throw new AppError("Captcha verification failed", 400);
    }
  }
}

export const captchaService = new CaptchaService();
