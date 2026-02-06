import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { adminOrSelf, restrictTo } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { usersController } from "./users.controller.js";
import { blockUser, getUserSchema, getUsersSchema } from "./users.schema.js";

export const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.get("/", restrictTo(["admin"]), validate(getUsersSchema), usersController.getUsers);
usersRouter.get("/:id", adminOrSelf, validate(getUserSchema), usersController.getUser);
usersRouter.patch("/:id/block", adminOrSelf, validate(blockUser), usersController.blockUser);
