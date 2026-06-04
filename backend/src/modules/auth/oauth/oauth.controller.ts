import { Request, Response } from "express";
import { catchAsync } from "../../../utils/common/helpers/CatchAsync.js";
import { googleOAuthService } from "./oauth.container.js";
import { sendResponse } from "../../../utils/common/response/AppResponse.js";
import { clearOAuthStateCookie, setOAuthStateCookie } from "./oauth.helper.js";
import { AppError } from "../../../utils/common/errors/AppError.js";
import { OAUTH_STATE_COOKIE } from "./oauth.helper.js";

export const redirectToGoogleController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await googleOAuthService.generateGoogleAuthUrl();

    setOAuthStateCookie(res, result.state);

    sendResponse(res, 200, {
      success: true,
      message: "Google OAuth url generated successfully",
      data: {
        url: result.url,
      },
    });
  },
);

export const googleCallBackController = catchAsync(
  async (req: Request, res: Response) => {
    const state = req.query.state as string | undefined;
    const code = req.query.code as string | undefined;

    if (!state) {
      throw new AppError("OAuth state is missing", 400);
    }

    if (!code) {
      throw new AppError("Authorization code is missong", 400);
    }

    const cookieState = req.cookies[OAUTH_STATE_COOKIE];

    console.log({ cookieState });

    googleOAuthService.validateOAuthState(cookieState, state);

    clearOAuthStateCookie(res);

    const result = await googleOAuthService.handleGoogleCallback(code);

    sendResponse(res, 200, {
      success: true,
      message: "Google callback received successfully",
      data: result,
    });
  },
);
