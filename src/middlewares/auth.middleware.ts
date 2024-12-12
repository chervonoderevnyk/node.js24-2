import { NextFunction, Request, Response } from "express";

import { ActionTokenTypeEnum } from "../enums/action-token-type.enum.js";
import { ApiError } from "../errors/appi-error.js";
import { ITokenPayload } from "../interfaces/token.interface.js";
import { actionTokenRepository } from "../repositories/action.token.repository.js";
import { tokenRepository } from "../repositories/token.repository.js";
import { actionTokenService } from "../services/action.token.service.js";
import { tokenService } from "../services/token.service.js";

class AuthMiddleware {
  constructor() {
    this.checkAccessToken = this.checkAccessToken.bind(this);
    this.checkRefreshToken = this.checkRefreshToken.bind(this);
    this.extractToken = this.extractToken.bind(this);
    this.checkActionTokenMiddleware =
      this.checkActionTokenMiddleware.bind(this);
  }

  private async validateToken(
    req: Request,
    res: Response,
    next: NextFunction,
    tokenType: "access" | "refresh",
    checkFunction: (token: string) => any,
  ) {
    try {
      const header = req.headers.authorization;
      if (!header) {
        throw new ApiError(`${tokenType} token is required`, 401);
      }

      const token = header.split("Bearer ")[1];
      const payload = checkFunction(token);

      const pair = await tokenRepository.findByParams({
        [tokenType === "access" ? "accessToken" : "refreshToken"]: token,
      });
      if (!pair) {
        throw new ApiError(`Invalid ${tokenType} token`, 401);
      }

      res.locals.tokenId = pair._id;
      res.locals.jwtPayload = payload;
      next();
    } catch (e) {
      next(e);
    }
  }

  public checkAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    await this.validateToken(req, res, next, "access", tokenService.checkToken);
  };

  public checkRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    await this.validateToken(
      req,
      res,
      next,
      "refresh",
      tokenService.checkRefreshToken2,
    );
  };

  public async extractToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      console.log("Extracted Token:", token);
      res.locals.actionPayload = { activateToken: token };
    } else {
      console.error("Authorization header is missing or invalid.");
      throw new ApiError("Authorization token missing", 401);
    }

    console.log("Action Payload in Middleware:", res.locals.actionPayload);
    next();
  }

  public async validateActionToken(
    actionToken: string,
    type: ActionTokenTypeEnum,
  ): Promise<ITokenPayload> {
    if (!actionToken) {
      throw new ApiError("Action token is not provided", 401);
    }

    const payload = actionTokenService.checkActionToken(actionToken, type);

    const entity = await actionTokenRepository.isActionTokenUsed({
      actionToken,
    });
    if (!entity) {
      throw new ApiError("Action token not found in the database", 404);
    }

    if (entity.used) {
      throw new ApiError("Action token already used", 400);
    }

    return payload;
  }

  public checkActionTokenMiddleware(type: ActionTokenTypeEnum) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const actionToken = req.body?.token || req.headers["x-action-token"];
        res.locals.jwtPayload = await this.validateActionToken(
          actionToken,
          type,
        );
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

export const authMiddleware = new AuthMiddleware();

// public async checkAccessToken(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     const header = req.headers.authorization;
//     if (!header) {
//       throw new ApiError("Access token is required", 401);
//     }
//     const accessToken = header.split("Bearer ")[1];
//     const payload = actionTokenService.checkActionToken(
//       accessToken,
//       ActionTokenTypeEnum.VERIFY_EMAIL,
//     );
//
//     const pair = await tokenRepository.findByParams({ accessToken });
//     if (!pair) {
//       throw new ApiError("Invalid access token", 401);
//     }
//     res.locals.tokenId = pair._id;
//     res.locals.jwtPayload = payload;
//     console.log("jwtPayload у checkAccessToken:", payload);
//     console.log("jwtPayload у logoutAll:", payload);
//
//     next();
//   } catch (e) {
//     next(e);
//   }
// }
//
// public async checkRefreshToken(
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) {
//   try {
//     const header = req.headers.authorization;
//     if (!header) {
//       throw new ApiError("Refresh token is required", 401);
//     }
//     const refreshToken = header.split("Bearer ")[1];
//     const payload = tokenService.checkRefreshToken2(refreshToken);
//
//     const pair = await tokenRepository.findByParams({ refreshToken });
//     if (!pair) {
//       throw new ApiError("Invalid refresh token", 401);
//     }
//     res.locals.JwtPayload = payload;
//     next();
//   } catch (e) {
//     next(e);
//   }
// }

// public checkActionTokenMiddleware(type: ActionTokenTypeEnum) {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const actionToken = req.body?.token;
//       if (!actionToken) {
//         throw new ApiError("Action token is not provided", 401);
//       }
//       const payload = actionTokenService.checkActionToken(actionToken, type);
//       const entity =
//         await actionTokenRepository.isActionTokenUsed(actionToken);
//       if (!entity) {
//         throw new ApiError("Action token not found in the database", 404);
//       }
//       res.locals.jwtPayload = payload;
//       next();
//     } catch (e) {
//       next(e);
//     }
//   };
// }
