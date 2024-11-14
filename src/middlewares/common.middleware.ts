import { NextFunction, Request, Response } from "express";
import Joi, { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/appi-error.js";
import { IUserUpdate } from "../interfaces/user.interface.js";

const { ValidationError } = Joi;

class CommonMiddleware {
  public isIdValid(paramName: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params[paramName];
        if (!isObjectIdOrHexString(id)) {
          throw new ApiError("Invalid user ID", 400);
        }
        next();
      } catch (e) {
        next(e);
      }
    };
  }

  public validateUserUpdateBody(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const dto: IUserUpdate = req.body;

      if (!dto) {
        throw new ApiError("Body cannot be empty", 400);
      }

      next();
    } catch (e) {
      next(e);
    }
  }

  public isBodyValid(validator: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.body = await validator.validateAsync(req.body);
        next();
      } catch (e) {
        if (e instanceof ValidationError) {
          next(new ApiError(e.details[0].message, 400));
        } else {
          next(e); // Для інших помилок передаємо далі без змін
        }
      }
    };
  }
}

export const commonMiddleware = new CommonMiddleware();
