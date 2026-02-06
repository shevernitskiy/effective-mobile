import { Router } from "express";

import { validate } from "../../middlewares/validate.middleware.js";
import { authController } from "./auth.controller.js";
import { loginSchema, refreshTokenSchema, registerSchema } from "./auth.schema.js";

export const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), authController.register);
authRoutes.post("/login", validate(loginSchema), authController.login);
authRoutes.post("/refresh-token", validate(refreshTokenSchema), authController.refreshToken);
