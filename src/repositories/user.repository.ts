import { IUser } from "../interfaces/user.interface.js";
import { User } from "../models/user.models.js";

class UserRepository {
  public async getByParams(params: Partial<IUser>): Promise<IUser | null> {
    return await User.findOne(params);
  }
  // public async getByParams(params: any): Promise<IUser | null> {
  //   return await User.findOne(params);
  // }

  public async getList(query: any): Promise<IUser[]> {
    return await User.find().limit(query.limit).skip(query.skip);
  }

  public async create(dto: IUser): Promise<IUser> {
    return await User.create(dto);
  }

  public async update(
    userId: string,
    dto: Partial<IUser>,
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, dto, {
      returnDocument: "after",
    });
  }

  public async getById(userId: string): Promise<IUser | null> {
    return await User.findById(userId);
  }

  public async delete(userId: string): Promise<void> {
    await User.findByIdAndDelete(userId);
  }

  public async updateVerifiedUser(
    userId: string,
    isVerified: boolean,
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { isVerified } },
      { new: true },
    );
  }
}

export const userRepository = new UserRepository();
