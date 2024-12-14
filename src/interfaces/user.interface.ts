import { RoleEnum } from "../enums/role.enum.js";

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
  lastVisit?: Date;
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
  lastVisit?: Date;
}

export interface ILogin extends Pick<IUser, "email" | "password"> {}
