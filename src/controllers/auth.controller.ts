import { NextFunction, Request, Response } from "express";

import { IUser } from "../interfaces/user.interface";
import { authService } from "../services/auth.service";

class AuthController {
  public async singUp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: IUser = req.body;
      const result = await authService.signUp(dto);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async singIn(req: Request, res: Response, next: NextFunction) {
    try {
      const dto: IUser = req.body as any;
      const result = await authService.signIn(dto);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.body.refreshToken;
      const result = await authService.refreshToken(refreshToken);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
