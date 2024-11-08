import joi from "joi";

import { regexConstant } from "../constanrs/regex.constant";
import { RoleEnum } from "../enums/role.enum";

export class userValidator {
  private static name = joi.string().min(3).trim();
  private static email = joi
    .string()
    .lowercase()
    .regex(regexConstant.EMAIL_REGEX);
  private static password = joi
    .string()
    .regex(regexConstant.PASSWORD_REGEX)
    .trim();
  private static age = joi.number().min(18).max(60);
  private static phone = joi.string().regex(regexConstant.PHONE_REGEX).trim();

  public static validateUserCreate = joi.object({
    name: this.name.required(),
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
}
