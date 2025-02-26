import { RoleEnum } from "../enums/role.enum.js";

export interface IUser {
  avatar?: any;
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

export interface IUserListQuery {
  orderBy: string;
  order: string;
  limit?: number;
  page?: number;
  search?: string;
}

export interface IUserResponse
  extends Pick<
    IUser,
    | "_id"
    | "name"
    | "email"
    | "age"
    | "phone"
    | "avatar"
    | "role"
    | "isVerified"
    | "createdAt"
    | "updatedAt"
    | "lastVisit"
  > {}

export interface IUserResponseList extends IUserListQuery {
  data: IUserResponse[];
  total: number;
}
