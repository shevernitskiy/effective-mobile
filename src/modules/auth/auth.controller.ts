import type { Request, Response } from "express";

import { catchAsync } from "../../helpers/catch-async.js";
import { authService } from "./auth.service.js";

export const authController = {
  register: catchAsync(async (req: Request, res: Response) => {
    const newUser = await authService.register(req.body);
    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  }),

  login: catchAsync(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.status(200).json({
      status: "success",
      data: result,
    });
  }),

  refreshToken: catchAsync(async (req: Request, res: Response) => {
    const result = await authService.refreshToken(req.body);
    res.status(200).json({
      status: "success",
      data: result,
    });
  }),
};
