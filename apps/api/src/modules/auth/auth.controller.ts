import type { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../../config/http.config";
import { Env } from "../../config/app.config";
import {
  loginUserSchema,
  registerSchema,
} from "../../validators/auth.validator";
import { loginUserService, registerUserService } from "./auth.service";

export const googleCallback = asyncHandler(
  async (req: Request, res: Response) => {
    res.redirect(`${Env.FRONTEND_ORIGIN}`);
  },
);

export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = registerSchema.parse({ ...req.body });

    const { user } = await registerUserService(body);

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.status(HTTPSTATUS.CREATED).json({
        message: "User registered and logged in successfully",
        user,
      });
    });
  },
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = loginUserSchema.parse(req.body);

    const { user } = await loginUserService(body);

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      return res.status(HTTPSTATUS.CREATED).json({
        message: "User logged in successfully",
        user,
      });
    });
  },
);
