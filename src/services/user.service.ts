import {IUser} from "../interfaces/user.interface.js";
import {userRepository} from "../repositories/user.repository.js";
import {ApiError} from "../errors/appi-error.js";
import {authService} from "./auth.service.js";


class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  public async updateMe(userId: string, dto: IUser): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const { name, email, password } = dto;

    if (name && name.length < 3) {
      throw new ApiError("Name must be at least 3 characters long", 400);
    }
    if (email && !email.includes("@")) {
      throw new ApiError("Invalid email format", 400);
    }
    if (password && password.length < 6) {
      throw new ApiError("Password must be at least 6 characters long", 400);
    }
    if (email && email !== user.email) {
    await authService.isEmailExist(email);
  }

  const updatedUser = await userRepository.update(userId, dto);
  if (!updatedUser) {
    throw new ApiError("User not found", 404); // Обробка випадку, якщо оновлення не відбулося
  }

  return updatedUser;
}

  public async getById(userId: string): Promise<IUser | undefined> {
  const user = await userRepository.getById(userId);
  return user ?? undefined;
}

public async getMe(userId: string): Promise<IUser | undefined> {
  const user = await userRepository.getById(userId);
  return user ?? undefined;
}

  public async deleteMe(userId: string): Promise<void> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    await userRepository.delete(userId);
  }
}

export const userService = new UserService();
