import type { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/app-error.js";
import { verifyToken } from "../lib/jwt.js";
import { authRepository } from "../modules/auth/auth.repository.js";

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Authorization header is missing or invalid", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await authRepository.findUserById(decoded.userId);
    if (!user) {
      throw new AppError("User not found", 401);
    }

    if (user.status === "blocked") {
      throw new AppError("User is blocked", 403);
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError("Invalid or expired token", 401));
  }
};
