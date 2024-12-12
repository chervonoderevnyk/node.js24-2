import jsonwebtoken from "jsonwebtoken";

import { configs } from "../configs/configs.js";
import { ApiError } from "../errors/appi-error.js";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface.js";

class TokenService {
  public async generatePair(payload: ITokenPayload): Promise<ITokenPair> {
    const accessToken = jsonwebtoken.sign(
      payload,
      configs.JWT_SECRET as string,
      {
        expiresIn: configs.JWT_ACCESS_EXPIRES_IN,
      },
    );
    const refreshToken = jsonwebtoken.sign(
      payload,
      process.env.JWT_REFRESH_SECRET as string,
      {
        expiresIn: configs.JWT_REFRESH_EXPIRES_IN,
      },
    );
    console.log("Generated Tokens with Payload:", payload);
    return { accessToken, refreshToken };
  }

  public checkToken(token: string): ITokenPayload {
    try {
      return jsonwebtoken.verify(
        token,
        configs.JWT_SECRET as string,
      ) as ITokenPayload;
    } catch (error) {
      console.error("Token verification error:", error);
      throw new ApiError("Invalid token", 401);
    }
  }

  public checkRefreshToken2(token: string): ITokenPayload {
    try {
      const payload = jsonwebtoken.verify(
        token,
        configs.JWT_REFRESH_SECRET as string,
      ) as ITokenPayload;

      console.log("Refresh Token Payload:", payload); // Логування для перевірки
      return payload;
    } catch (error) {
      console.error("Refresh token verification error:", error.message);
      throw new ApiError("Invalid refresh token", 401);
    }
  }
}

export const tokenService = new TokenService();
