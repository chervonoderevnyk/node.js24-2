import { FilterQuery } from "mongoose";

import { IUser, IUserListQuery } from "../interfaces/user.interface.js";
import { User } from "../models/user.models.js";

class UserRepository {
  public async getByParams(params: Partial<IUser>): Promise<IUser | null> {
    return await User.findOne(params);
  }

  // public async getList(query: IUserListQuery): Promise<[IUser[], number]> {
  //   const filterObj: FilterQuery<IUser> = { isVerified: true };
  //   if (query.search) {
  //     filterObj.$or = [
  //       { name: { $regex: query.search, $options: "i" } },
  //       { email: { $regex: query.search, $options: "i" } },
  //     ];
  //   }
  //   const limit = query.limit ?? 5; // default limit value
  //   const page = query.page ?? 1; // default page value
  //   const skip = (page - 1) * limit;
  //   return await Promise.all([
  //     User.find(filterObj).skip(skip).limit(limit).sort({ createdAt: -1 }),
  //     User.countDocuments(filterObj),
  //   ]);
  // }

  public async getList(query: IUserListQuery): Promise<[IUser[], number]> {
    const filterObj: FilterQuery<IUser> = {}; // Видалено isVerified: true

    // Пошук за іменем чи email (чутливий до регістру)
    if (query.search) {
      filterObj.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { email: { $regex: query.search, $options: "i" } },
      ];
    }

    // Обмеження та пагінація
    const limit = query.limit ?? 5;
    const page = query.page ?? 1;
    const skip = (page - 1) * limit;

    // Обробка сортування
    const sortField = query.orderBy ?? "createdAt";
    const sortOrder = query.order === "asc" ? 1 : -1;

    // Запити до бази даних
    return await Promise.all([
      User.find(filterObj)
        .skip(skip)
        .limit(limit)
        .sort({ [sortField]: sortOrder }),
      User.countDocuments(filterObj),
    ]);
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
