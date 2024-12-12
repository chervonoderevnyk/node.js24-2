import jsonwebtoken from "jsonwebtoken";

import { configs } from "../configs/configs.js";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum.js";
import { ApiError } from "../errors/appi-error.js";
import { IActivateToken } from "../interfaces/action.token.interface.js";
import { ITokenPayload } from "../interfaces/token.interface.js";
import { IUser } from "../interfaces/user.interface.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { actionTokenRepository } from "../repositories/action.token.repository.js";
import { userRepository } from "../repositories/user.repository.js";

class ActionTokenService {
  public async generateActionToken(
    payload: ITokenPayload,
    type: ActionTokenTypeEnum,
  ): Promise<IActivateToken> {
    const token = jsonwebtoken.sign(
      payload,
      type === ActionTokenTypeEnum.VERIFY_EMAIL
        ? (configs.VERIFY_EMAIL as string)
        : (configs.ACTIVATE_TOKEN as string),
      {
        expiresIn:
          type === ActionTokenTypeEnum.VERIFY_EMAIL
            ? configs.VERIFY_EMAIL_EXPIRES_IN
            : configs.ACTIVATE_TOKEN_EXPIRES_IN,
      },
    );

    return {
      token,
      actionVerifyEmail: "Some default value or computed value", // Додати значення
    };
  }

  public checkActionToken(
    actionToken: string,
    type: ActionTokenTypeEnum,
  ): ITokenPayload {
    try {
      let secret: string;

      switch (type) {
        case ActionTokenTypeEnum.FORGOT_PASSWORD:
          secret = configs.ACTIVATE_TOKEN as string;
          break;
        case ActionTokenTypeEnum.VERIFY_EMAIL:
          secret = configs.VERIFY_EMAIL as string;
          break;
        default:
          throw new ApiError("Token type is not valid", 401);
      }
      return jsonwebtoken.verify(actionToken, secret) as ITokenPayload;
    } catch (error) {
      throw new ApiError("Token is not valid", 401);
    }
  }

  // public async activateToken(dto: IUser, actionToken: string): Promise<IUser> {
  //   console.log("Token in activateToken Service:", actionToken);
  //
  //   // Перевіряємо валідність токена
  //   const payload = tokenService.checkToken(actionToken);
  //
  //   if (!payload.userId) {
  //     throw new ApiError("Некоректний токен: відсутній userId", 400);
  //   }
  //
  //   // Перевіряємо, чи токен є у базі та чи він використаний
  //   const tokenRecord = await actionTokenRepository.isActionTokenUsed({
  //     actionToken,
  //   });
  //   if (!tokenRecord) {
  //     throw new ApiError("Action token not found in the database", 404);
  //   }
  //   if (tokenRecord.used) {
  //     throw new ApiError("Токен вже використаний", 400);
  //   }
  //
  //   // Отримуємо користувача
  //   const user = await userRepository.getById(payload.userId);
  //   if (!user) {
  //     throw new ApiError("Користувача не знайдено", 404);
  //   }
  //
  //   // Оновлюємо статус верифікації користувача
  //   const updatedUser = await userRepository.updateVerifiedUser(
  //     payload.userId,
  //     true,
  //   );
  //   if (!updatedUser) {
  //     throw new ApiError("Не вдалося оновити статус користувача", 404);
  //   }
  //
  //   // Оновлюємо статус токена
  //   await actionTokenRepository.markTokenAsUsed(actionToken);
  //
  //   return updatedUser;
  // }

  public async activateToken(actionToken: string): Promise<IUser> {
    console.log("Token in activateToken Service:", actionToken);

    const payload = await authMiddleware.validateActionToken(
      actionToken,
      ActionTokenTypeEnum.VERIFY_EMAIL,
    );

    // Отримуємо користувача
    const user = await userRepository.getById(payload.userId);
    if (!user) {
      throw new ApiError("Користувача не знайдено", 404);
    }

    // Оновлюємо статус верифікації користувача
    const updatedUser = await userRepository.updateVerifiedUser(
      payload.userId,
      true,
    );
    if (!updatedUser) {
      throw new ApiError("Не вдалося оновити статус користувача", 404);
    }

    // Оновлюємо статус токена
    await actionTokenRepository.markTokenAsUsed(actionToken);

    return updatedUser;
  }
}

export const actionTokenService = new ActionTokenService();
