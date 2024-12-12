import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/appi-error.js";
import {
  IForgotResetPassword,
  IForgotSetEmail,
} from "../interfaces/action.token.interface.js";
import { ITokenPayload } from "../interfaces/token.interface.js";
import { ILogin, IUser } from "../interfaces/user.interface.js";
import { actionTokenService } from "../services/action.token.service.js";
import { authService } from "../services/auth.service.js";

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
      const dto = req.body as ILogin;
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

  public async activateToken(req: Request, res: Response, next: NextFunction) {
    try {
      // const dto: IUser = req.body;
      const actionToken = res.locals.actionPayload?.activateToken;

      const result = await actionTokenService.activateToken(actionToken);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenId = res.locals.tokenId as string;
      await authService.logout(tokenId);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async logoutAll(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = res.locals.jwtPayload as ITokenPayload;
      await authService.logoutAll(jwtPayload);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as IForgotSetEmail;
      if (typeof dto !== "string") {
        throw new ApiError("Invalid email format", 400);
      }
      await authService.forgotPassword(dto);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async forgotPasswordSet(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const dto = req.body as IForgotResetPassword;
      const jwtPayload = res.locals.jwtPayload as ITokenPayload;

      await authService.forgotPasswordSet(dto, jwtPayload);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = res.locals.jwtPayload as ITokenPayload;
      await authService.verifyEmail(jwtPayload);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
