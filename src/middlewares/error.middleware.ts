import type { NextFunction, Request, Response } from "express";

import { AppError } from "../errors/app-error.js";
import { logger } from "../lib/logger.js";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  logger.error(err);
  res.status(500).json({
    status: "error",
    message: "Something went wrong",
  });
};
