import { AppError } from "../../errors/app-error.js";
import { userRepository } from "./users.repository.js";

export const userService = {
  async getUserProfile(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },

  async getAllUsers(limit: number, offset: number) {
    const users = await userRepository.findAll(limit, offset);
    return users.map(({ password: _password, ...userWithoutPassword }) => userWithoutPassword);
  },

  async blockUser(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const updatedUser = await userRepository.updateStatus(id, "blocked");
    const { password: _password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  },
};
