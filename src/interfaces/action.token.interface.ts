import { ActionTokenTypeEnum } from "../enums/action-token-type.enum.js";
import { IUser } from "./user.interface.js";

export interface IActionToken {
  _id?: string;
  actionToken: string;
  _userId: string | IUser;
  used: boolean;
  type: ActionTokenTypeEnum;
}

export interface IActivateToken {
  token: string;
  actionVerifyEmail?: string;
}

export interface IForgotSetEmail extends Pick<IUser, "email"> {}
export interface IForgotResetPassword extends Pick<IUser, "password"> {}
