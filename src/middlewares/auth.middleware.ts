import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/appi-error";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const header = req.headers.authorization;
      if (!header) {
        throw new ApiError("Access token is required", 401);
      }
      const accessToken = header.split("Bearer ")[1];
      const payload = tokenService.checkToken(accessToken);

      const pair = await tokenRepository.findByParams({ accessToken });
      if (!pair) {
        throw new ApiError("Invalid access token", 401);
      }
      req.res.locals.JwtPayload = payload;
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
