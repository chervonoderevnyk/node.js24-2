import { NextFunction, Request, Response } from "express";

import { IUser } from "../interfaces/user.interface";
import { userService } from "../services/user.service";

class UserController {
  public async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.getList();
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getById(
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.params.userId;
      const result = await userService.getById(userId);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getMe(
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.res.locals.JwtPayload.userId as string;
      const result = await userService.getMe(userId);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.res.locals.JwtPayload.userId as string;
      const dto: IUser = req.body;
      const result = await userService.updateMe(userId, dto);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async deleteMe(
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.res.locals.JwtPayload.userId as string;
      await userService.deleteMe(userId);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
