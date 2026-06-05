import type { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../utils/appError";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (typeof req.isAuthenticated !== "function") {
    return next(
      new Error(
        "Passport authentication framework is not initialized properly.",
      ),
    );
  }

  if (!req.isAuthenticated()) {
    return next(
      new UnauthorizedError(
        "Unauthorized! Please login to access this resource.",
      ),
    );
  }

  next();
};
