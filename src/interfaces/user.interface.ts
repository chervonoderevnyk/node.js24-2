import { RoleEnum } from "../enums/role.enum";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  age: number;
  phone?: string;
  role: RoleEnum;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserUpdate {
  name?: string;
  email?: string;
  password?: string;
  age?: number;
  phone?: string;
  role?: RoleEnum;
  isVerified?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
}
