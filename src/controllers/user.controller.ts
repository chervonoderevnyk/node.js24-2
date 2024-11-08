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

  // public async create(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const dto: IUser = req.body;
  //     const result = await userService.create(dto);
  //     res.status(201).json(result);
  //   } catch (e) {
  //     next(e);
  //   }
  // }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const dto: IUser = req.body;
      const result = await userService.update(userId, dto);
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

  public async delete(
    req: Request<{ userId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.params.userId;
      await userService.delete(userId);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
