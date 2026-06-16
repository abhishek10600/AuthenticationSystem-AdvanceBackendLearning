import { Request, Response } from "express";
import { catchAsync } from "../../utils/common/helpers/CatchAsync.js";
import { authService } from "./auth.container.js";
import { sendResponse } from "../../utils/common/response/AppResponse.js";
import { clearCookies, setCookies } from "../../utils/auth/auth.helper.js";
import { AppError } from "../../utils/common/errors/AppError.js";

export const registerUserController = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password, captchaToken } = req.body;
    const userAgent = req.headers["user-agent"] || "unknown";
    const ipAddress = req.ip || "unknown";

    const result = await authService.registerUser({
      email,
      password,
      userAgent,
      ipAddress,
      captchaToken,
    });

    setCookies(res, result.refreshToken);

    sendResponse(res, 201, {
      success: true,
      message: "User registered successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  },
);

export const loginUserController = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password, captchaToken } = req.body;
    const userAgent = req.headers["user-agent"] || "unknown";
    const ipAddress = req.ip || "unknown";

    const result = await authService.loginUser({
      email,
      password,
      userAgent,
      ipAddress,
      captchaToken,
    });

    console.log({ lalarefreshToken: result.refreshToken });

    setCookies(res, result.refreshToken);

    sendResponse(res, 200, {
      success: true,
      message: "User logged in successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  },
);

export const loggedInUserController = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const result = await authService.getLoggedInUser(user);

    sendResponse(res, 200, {
      success: true,
      message: "User fetched successfully",
      data: result,
    });
  },
);

export const refreshTokenController = catchAsync(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("Refresh token is missing.", 401);
    }

    const userAgent = req.headers["user-agent"] ?? "unknown";

    const result = await authService.refreshSession(refreshToken, userAgent);

    setCookies(res, result.refreshToken);

    sendResponse(res, 200, {
      success: true,
      message: "Refresh token rotated successfully",
      data: {
        accessToken: result.accessToken,
      },
    });
  },
);

export const logoutController = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;

    await authService.logout(user?.userId as string, user?.sessionId as string);

    clearCookies(res);

    sendResponse(res, 200, {
      success: true,
      message: "User logged out successfully",
    });
  },
);

export const logoutUserFromAllSessions = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;

    await authService.logoutUserFromAllSessions(user?.userId as string);

    clearCookies(res);

    sendResponse(res, 200, {
      success: true,
      message: "User logged out of all devices",
    });
  },
);

export const getUserPermissionsController = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;

    const result = await authService.getUserPermissions(user?.userId as string);

    sendResponse(res, 200, {
      success: true,
      message: "User permissions fetched successfully",
      data: result,
    });
  },
);
