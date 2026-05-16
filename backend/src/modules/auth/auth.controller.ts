import { Request, Response } from "express";
import { catchAsync } from "../../utils/common/helpers/CatchAsync.js";
import { authService } from "./auth.container.js";
import { sendResponse } from "../../utils/common/response/AppResponse.js";

export const registerUserController = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.registerUser({ email, password });

    sendResponse(res, 201, {
      success: true,
      message: "User registered successfully",
      data: result,
    });
  },
);
