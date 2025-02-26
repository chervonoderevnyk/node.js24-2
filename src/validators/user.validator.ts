import joi from "joi";

import { regexConstant } from "../constants/regex.constant.js";
import { OrderEnum } from "../enums/order.enum.js";
import { RoleEnum } from "../enums/role.enum.js";
import { UserListOrderByEnum } from "../enums/user.lisr.order.by.enum.js";

export class userValidator {
  // Основні схеми
  private static userName = joi.string().min(3).trim().required();
  private static email = joi
    .string()
    .lowercase()
    .regex(regexConstant.EMAIL_REGEX)
    .trim()
    .required();

  private static passwordSchema = joi
    .string()
    .regex(regexConstant.PASSWORD_REGEX)
    .trim()
    .required();

  private static age = joi.number().min(18).max(60).optional();
  private static phone = joi
    .string()
    .regex(regexConstant.PHONE_REGEX)
    .trim()
    .optional();

  private static role = joi
    .string()
    .valid(...Object.values(RoleEnum))
    .optional();

  // Валідації
  public static validateUserCreate = joi.object({
    name: this.userName,
    email: this.email,
    password: this.passwordSchema,
    age: this.age.required(),
    phone: this.phone.required(),
  });

  public static validateUserUpdate = joi.object({
    name: this.userName.optional(),
    email: this.email.optional(),
    age: this.age,
    phone: this.phone,
    role: this.role,
  });

  public static validateLogIn = joi.object({
    email: this.email,
    password: this.passwordSchema,
  });

  public static validateForgotPassword = joi.object({
    email: this.email,
  });

  public static validateForgotPasswordSet = joi.object({
    password: this.passwordSchema,
  });

  public static changePassword = joi.object({
    oldPassword: this.passwordSchema,
    newPassword: this.passwordSchema,
  });

  public static listQuery = joi.object({
    page: joi.number().min(1).default(1),
    limit: joi.number().min(1).max(100).default(10),
    search: joi.string().min(1),
    order: joi
      .string()
      .valid(...Object.values(OrderEnum))
      .default(OrderEnum.ASC),
    orderBy: joi
      .string()
      .valid(...Object.values(UserListOrderByEnum))
      .default(UserListOrderByEnum.NAME),
  });
}
