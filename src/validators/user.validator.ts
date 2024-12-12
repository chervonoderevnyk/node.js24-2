import joi from "joi";

import { regexConstant } from "../constanrs/regex.constant.js";
import { RoleEnum } from "../enums/role.enum.js";

export class userValidator {
  private static userName = joi.string().min(3).trim().required();
  private static email = joi
    .string()
    .lowercase()
    .regex(regexConstant.EMAIL_REGEX)
    .trim();

  private static password = joi
    .string()
    .regex(regexConstant.PASSWORD_REGEX)
    .trim();
  private static age = joi.number().min(18).max(60);
  private static phone = joi.string().regex(regexConstant.PHONE_REGEX).trim();

  public static validateUserCreate = joi.object({
    name: this.userName.required(),
    email: this.email.required(),
    password: this.password.required(),
    age: this.age.required(),
    phone: this.phone.required(),
  });

  public static validateUserUpdate = joi.object({
    name: this.name,
    email: this.email,
    age: this.age,
    phone: this.phone,
    role: joi.string().valid(...Object.values(RoleEnum)),
  });

  public static validateLogIn = joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });

  public static validateForgotPassword = joi.object({
    email: this.email.required(),
  });

  public static validateForgotPasswordSet = joi.object({
    password: this.password.required(),
  });

  public static changePassword = joi.object({
    oldPassword: this.password.required(),
    newPassword: this.password.required(),
  });
}
