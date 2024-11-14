import { IUser } from "../interfaces/user.interface.js";
import { User } from "../models/user.models.js";

class UserRepository {
  public async getByParams(params: Partial<IUser>): Promise<IUser | null> {
    return await User.findOne(params);
  }

  public async getList(): Promise<IUser[]> {
    return await User.find();
  }

  public async create(dto: IUser): Promise<IUser> {
    return await User.create(dto);
  }

  public async update(userId: string, dto: IUser): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, dto, { new: true });
  }

  public async getById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  public async delete(userId: string): Promise<void> {
    await User.findByIdAndDelete(userId);
  }
}

export const userRepository = new UserRepository();
