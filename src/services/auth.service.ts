import { ActionTokenTypeEnum } from "../enums/action-token-type.enum.js";
import { EmailTypeEnum } from "../enums/email-type.enum.js";
import { ApiError } from "../errors/appi-error.js";
import {
  IActivateToken,
  IForgotResetPassword,
  IForgotSetEmail,
} from "../interfaces/action.token.interface.js";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface.js";
import { ILogin, IUser } from "../interfaces/user.interface.js";
import { UserPassword } from "../models/password.models.js";
import { actionTokenRepository } from "../repositories/action.token.repository.js";
import { tokenRepository } from "../repositories/token.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import { emailUtil } from "../utiles/email.util.js";
import { tokenUtil } from "../utiles/token.util.js";
import { passwordService } from "./password.service.js";
import { tokenService } from "./token.service.js";

class AuthService {
  public async signUp(
    dto: IUser,
  ): Promise<{ user: IUser; tokens: ITokenPair; actionToken: IActivateToken }> {
    await this.isEmailExist(dto.email);
    const password = await passwordService.hashPassword(dto.password);
    const user = await userRepository.create({
      ...dto,
      password,
      email: dto.email.toLowerCase(),
    });

    const tokens = await tokenUtil.generateAndSaveTokens(
      { userId: user._id!, role: user.role },
      tokenRepository,
    );

    const actionToken = await tokenUtil.generateAndSaveActionToken(
      { userId: user._id!, role: user.role },
      ActionTokenTypeEnum.VERIFY_EMAIL,
    );

    await emailUtil.sendEmailWithToken(
      EmailTypeEnum.WELCOME,
      dto.email,
      dto.name ?? "Dear",
      actionToken.token,
      { frontUrl: process.env.FRONT_URL! },
    );

    return {
      user,
      tokens,
      actionToken: {
        ...actionToken,
        actionVerifyEmail: "Some value",
      },
    };
  }

  public async signIn(
    dto: ILogin,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    const user = await userRepository.getByParams({
      email: dto.email.toLowerCase(),
    });

    if (!user) {
      throw new ApiError("Invalid credentials", 401);
    }
    const isPasswordCorrect = await passwordService.comparePassword(
      dto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new ApiError("Invalid credentials", 401);
    }

    const tokens = await tokenUtil.generateAndSaveTokens(
      { userId: user._id!, role: user.role },
      tokenRepository,
    );

    return { user, tokens };
  }

  public async refreshToken(refreshToken: string): Promise<ITokenPair> {
    // Перевіряємо, чи є токен дійсним
    const payload = tokenService.checkRefreshToken2(refreshToken);

    // Перевіряємо, чи існує користувач
    const user = await userRepository.getByParams({ _id: payload.userId });
    if (!user) {
      throw new ApiError("Користувача не знайдено", 404);
    }

    // Видаляємо старий рефреш-токен
    await tokenRepository.delete({ refreshToken });

    // Генеруємо нові токени
    // Зберігаємо нові токени в базі даних
    return await tokenUtil.generateAndSaveTokens(
      { userId: user._id!, role: user.role },
      tokenRepository,
    );
  }

  public async isEmailExist(email: string): Promise<void> {
    const user = await userRepository.getByParams({ email });
    if (user) {
      throw new ApiError("Email already exist", 409);
    }
  }

  public async logout(tokenId: string): Promise<void> {
    await tokenRepository.delete({ tokenId });
  }

  public async logoutAll(payload: ITokenPayload): Promise<void> {
    if (!payload.userId) {
      throw new ApiError("Не вдається виконати logout: userId відсутній", 400);
    }
    await tokenRepository.delete({ _userId: payload.userId });
  }

  public async forgotPassword(dto: IForgotSetEmail): Promise<void> {
    const user = await userRepository.getByParams({ email: dto.email });
    if (!user) return;

    const actionToken = await tokenUtil.generateAndSaveActionToken(
      { userId: user._id!, role: user.role },
      ActionTokenTypeEnum.FORGOT_PASSWORD,
    );
    // await emailService.sendEmail(EmailTypeEnum.FORGOT_PASSWORD, dto.email, {
    //   name: user.name,
    //   actionToken: actionToken.token,
    // });
    await emailUtil.sendEmailWithToken(
      EmailTypeEnum.WELCOME,
      dto.email,
      user.name ?? "Dear",
      actionToken.token,
      { frontUrl: process.env.FRONT_URL! },
    );
  }

  public async forgotPasswordSet(
    dto: IForgotResetPassword,
    jwtPayload: ITokenPayload,
  ): Promise<void> {
    const password = await passwordService.hashPassword(dto.password);
    await userRepository.update(jwtPayload.userId, { password });
    await actionTokenRepository.deleteTokensByParams({
      _userId: jwtPayload.userId,
      type: ActionTokenTypeEnum.FORGOT_PASSWORD,
    });
    await tokenRepository.delete({ _userId: jwtPayload.userId });
  }

  public async verifyEmail(jwtPayload: ITokenPayload): Promise<void> {
    await userRepository.update(jwtPayload.userId, { isVerified: true });
    await actionTokenRepository.deleteTokensByParams({
      _userId: jwtPayload.userId,
      type: ActionTokenTypeEnum.VERIFY_EMAIL,
    });
    await tokenRepository.delete({ _userId: jwtPayload.userId });
  }

  // public async changePassword(
  //   jwtPayload: ITokenPayload,
  //   dto: { oldPassword: string; newPassword: string },
  // ): Promise<void> {
  //   const user = await userRepository.getById(jwtPayload.userId);
  //   if (!user) {
  //     throw new ApiError("User not found", 404);
  //   }
  //   const isPasswordCorrect = await passwordService.comparePassword(
  //     dto.oldPassword,
  //     user.password,
  //   );
  //   if (!isPasswordCorrect) {
  //     throw new ApiError("Invalid old password", 401);
  //   }
  //   const newPassword = await passwordService.hashPassword(dto.newPassword);
  //   await userRepository.update(jwtPayload.userId, { password: newPassword });
  //   await tokenRepository.delete({ _userId: jwtPayload.userId });
  // }

  public async changePassword(
    jwtPayload: ITokenPayload,
    dto: { oldPassword: string; newPassword: string },
  ): Promise<void> {
    const user = await userRepository.getById(jwtPayload.userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const isPasswordCorrect = await passwordService.comparePassword(
      dto.oldPassword,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new ApiError("Invalid old password", 401);
    }

    const passwords = await UserPassword.find({
      userId: user._id,
      createdAt: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) }, // останні 90 днів
    });

    for (const record of passwords) {
      const isSame = await passwordService.comparePassword(
        dto.newPassword,
        record.password,
      );
      if (isSame) {
        throw new ApiError(
          "New password must not be the same as recent passwords",
          400,
        );
      }
    }

    const newPassword = await passwordService.hashPassword(dto.newPassword);

    // Оновлення пароля користувача
    await userRepository.update(jwtPayload.userId, { password: newPassword });

    // Збереження нового пароля в історії
    await UserPassword.create({ userId: user._id, password: newPassword });

    // Видалення токенів
    await tokenRepository.delete({ _userId: jwtPayload.userId });
  }
}

export const authService = new AuthService();
