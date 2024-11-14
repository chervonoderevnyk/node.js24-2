import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/appi-error.js";
import { tokenRepository } from "../repositories/token.repository.js";
import { tokenService } from "../services/token.service.js";

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
      res.locals.JwtPayload = payload;
      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const header = req.headers.authorization;
      if (!header) {
        throw new ApiError("Refresh token is required", 401);
      }
      const refreshToken = header.split("Bearer ")[1];
      const payload = tokenService.checkRefreshToken2(refreshToken);

      const pair = await tokenRepository.findByParams({ refreshToken });
      if (!pair) {
        throw new ApiError("Invalid refresh token", 401);
      }
      res.locals.JwtPayload = payload;
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
