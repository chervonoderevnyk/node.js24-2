import { ActionTokenTypeEnum } from "../enums/action-token-type.enum.js";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface.js";
import { actionTokenRepository } from "../repositories/action.token.repository.js";
import { tokenRepository } from "../repositories/token.repository.js";
import { actionTokenService } from "../services/action.token.service.js";
import { tokenService } from "../services/token.service.js";

class TokenUtil {
  public async generateAndSaveTokens(
    payload: ITokenPayload,
    repository: typeof tokenRepository,
  ): Promise<ITokenPair> {
    const tokens = await tokenService.generatePair(payload);
    await repository.create({ ...tokens, _userId: payload.userId });
    return tokens;
  }

  public async generateAndSaveActionToken(
    payload: ITokenPayload,
    type: ActionTokenTypeEnum,
  ): Promise<{ token: string; type: ActionTokenTypeEnum }> {
    // Генерація токена
    const actionToken = await actionTokenService.generateActionToken(
      payload,
      type,
    );

    // Збереження токена в базі даних
    await actionTokenRepository.createActionToken({
      actionToken: actionToken.token,
      _userId: payload.userId,
      used: false,
      type,
    });

    return { token: actionToken.token, type };
  }
}

export const tokenUtil = new TokenUtil();
