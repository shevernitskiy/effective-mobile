import express from "express";

import { errorHandler } from "./middlewares/error.middleware.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { usersRouter } from "./modules/users/users.routes.js";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", usersRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

export { app };
