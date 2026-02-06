import type { Request, Response } from "express";

import { catchAsync } from "../../helpers/catch-async.js";
import { BlockUserParams, GetUserParams, GetUsersQuery } from "./users.schema.js";
import { userService } from "./users.service.js";

export const usersController = {
  getUser: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as GetUserParams;
    const user = await userService.getUserProfile(id);
    res.json({
      status: "success",
      data: user,
    });
  }),

  getUsers: catchAsync(async (req: Request, res: Response) => {
    const { limit, offset } = req.query as unknown as GetUsersQuery;

    const users = await userService.getAllUsers(limit, offset);
    res.json({
      status: "success",
      data: users,
    });
  }),

  blockUser: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params as BlockUserParams;
    const user = await userService.blockUser(id);
    res.json({
      status: "success",
      data: user,
    });
  }),
};
