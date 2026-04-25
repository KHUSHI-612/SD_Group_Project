import type { Request, Response, NextFunction } from "express";
import { AuthMiddleware } from "./auth.middleware.js";
import { AppError } from "../../shared/error/AppError.js";

const authMiddleware = new AuthMiddleware();

export const validateGetStationsAccess = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const hasQueryParams = Object.keys(req.query).length > 0;
  if (!hasQueryParams) {
    return next();
  }

  return authMiddleware.authenticate(req, res, (error?: unknown) => {
    if (error) {
      return next(error);
    }

    if (req.query.owner_id && req.user?.user_id !== req.query.owner_id) {
      return next(
        new AppError("Forbidden: You can only view your own stations", 403),
      );
    }

    return next();
  });
};
