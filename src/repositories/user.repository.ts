import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.models";

class UserRepository {
  public async getByEmail(email: string): Promise<IUser | undefined> {
    return await User.findOne({ email });
  }

  public async getList(): Promise<IUser[]> {
    return await User.find();
  }

  public async create(dto: IUser): Promise<IUser> {
    return await User.create(dto);
  }

  public async update(userId: string, dto: IUser): Promise<IUser> {
    return await User.findByIdAndUpdate(userId, dto, { new: true });
  }

  public async getById(userId: string): Promise<IUser> {
    return await User.findById(userId);
  }

  public async delete(userId: string): Promise<void> {
    await User.findByIdAndDelete(userId);
  }
}

export const userRepository = new UserRepository();
