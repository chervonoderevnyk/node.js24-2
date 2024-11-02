import { ApiError } from "../errors/appi-error";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";

class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  public async create(dto: IUser): Promise<IUser> {
    const { name, email, password } = dto;

    if (!name || name.length < 3) {
      throw new ApiError("Name must be at least 3 characters long", 400);
    }
    if (!email || !email.includes("@")) {
      throw new ApiError("Invalid email format", 400);
    }
    if (!password || password.length < 6) {
      throw new ApiError("Password must be at least 6 characters long", 400);
    }
    return await userRepository.create(dto);
  }

  public async update(userId: number, dto: IUser): Promise<IUser> {
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

    return await userRepository.update(userId, dto);
  }

  public async getById(userId: number): Promise<IUser | undefined> {
    return await userRepository.getById(userId);
  }

  public async delete(userId: number): Promise<void> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    await userRepository.delete(userId);
  }
}

export const userService = new UserService();
