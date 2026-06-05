import type { Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../../config/http.config";

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  return res.status(HTTPSTATUS.OK).json({
    success: true,
    message: "User fetched successfully",
    user,
  });
});
