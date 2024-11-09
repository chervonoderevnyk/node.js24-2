import { ApiError } from "../errors/appi-error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";
import { authService } from "./auth.service";

class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  public async update(userId: string, dto: IUser): Promise<IUser> {
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
    await authService.isEmailExist(email);
    return await userRepository.update(userId, dto);
  }

  public async getById(userId: string): Promise<IUser | undefined> {
    return await userRepository.getById(userId);
  }

  public async delete(userId: string): Promise<void> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    await userRepository.delete(userId);
  }
}

export const userService = new UserService();
