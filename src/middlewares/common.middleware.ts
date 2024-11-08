import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/appi-error";
import { IUser, IUserUpdate } from "../interfaces/user.interface";

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

  public validateUserCreateBody(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const dto: IUser = req.body;

      if (!dto.name || !dto.email || !dto.password || !dto.age) {
        throw new ApiError("Missing required user fields", 400);
      }

      next();
    } catch (e) {
      next(e);
    }
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
        next(new ApiError(e.details[0].message, 400));
      }
    };
  }
}

export const commonMiddleware = new CommonMiddleware();
