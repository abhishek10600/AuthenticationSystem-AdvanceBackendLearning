import { Response } from "express";
import { ApiResponnse } from "../../../types/index.js";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload: ApiResponnse<T>,
) => {
  return res.status(statusCode).json(payload);
};
