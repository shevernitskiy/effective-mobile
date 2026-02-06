import { AppError } from "../../errors/app-error.js";
import { signAccessToken, signRefreshToken, verifyToken } from "../../lib/jwt.js";
import { comparePassword, hashPassword } from "../../lib/password.js";
import { authRepository } from "./auth.repository.js";
import { LoginBody, RefreshTokenBody, type RegisterBody } from "./auth.schema.js";

export const authService = {
  async register(data: RegisterBody) {
    const existingUser = await authRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new AppError("User with this email already exists", 409);
    }

    const heashedPassword = await hashPassword(data.password);
    const newUser = await authRepository.createUser({ ...data, password: heashedPassword });

    const { password: _password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  async login(data: LoginBody) {
    const user = await authRepository.findUserByEmail(data.email);
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    if (user.status === "blocked") {
      throw new AppError("User is blocked", 403);
    }

    const tokenPayload = { userId: user.id, role: user.role };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    const { password: _password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  },

  async refreshToken(data: RefreshTokenBody) {
    try {
      const decoded = verifyToken(data.refreshToken);

      const user = await authRepository.findUserById(decoded.userId);
      if (!user) {
        throw new AppError("User not found", 401);
      }

      if (user.status === "blocked") {
        throw new AppError("User is blocked", 403);
      }

      const tokenPayload = { userId: user.id, role: user.role };
      const newAccessToken = signAccessToken(tokenPayload);
      const newRefreshToken = signRefreshToken(tokenPayload);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (_error) {
      throw new AppError("Invalid or expired refresh token", 401);
    }
  },
};
