import type { NextFunction, Request, Response } from "express";

import type { UserRole } from "../database/schema.js";
import { AppError } from "../errors/app-error.js";

export const restrictTo =
  (allowedRoles: UserRole[]) => (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }
    next();
  };

export const adminOrSelf = (req: Request, _res: Response, next: NextFunction) => {
  const user = req.user;
  const targetId = req.params.id;
  if (!user) {
    return next(new AppError("Not authenticated", 401));
  }

  if (user.role === "admin") {
    return next();
  }

  if (user.userId === targetId) {
    return next();
  }
  return next(new AppError("You can only access your own data", 403));
};
