import { EmailTypeEnum } from "../enums/email-type.enum.js";
import { ApiError } from "../errors/appi-error.js";
import { ITokenPair } from "../interfaces/token.interface.js";
import { ILogin, IUser } from "../interfaces/user.interface.js";
import { tokenRepository } from "../repositories/token.repository.js";
import { userRepository } from "../repositories/user.repository.js";
import { emailService } from "./email.service.js";
import { passwordService } from "./password.service.js";
import { tokenService } from "./token.service.js";

class AuthService {
  public async signUp(
    dto: IUser,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    await this.isEmailExist(dto.email);
    const password = await passwordService.hashPassword(dto.password);
    const user = await userRepository.create({
      ...dto,
      password,
      email: dto.email.toLowerCase(),
    });

    const tokens = await tokenService.generatePair({
      userId: user._id!,
      role: user.role,
    });
    await tokenRepository.create({ ...tokens, _userId: user._id! });

    await emailService.sendEmail(EmailTypeEnum.WELCOME, dto.email, {
      name: dto.name,
    });
    return { user, tokens };
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

    const tokens = await tokenService.generatePair({
      userId: user._id!,
      role: user.role,
    });
    await tokenRepository.create({ ...tokens, _userId: user._id! });

    return { user, tokens };
  }

  public async refreshToken(refreshToken: string): Promise<ITokenPair> {
    // Крок 1: Перевіряємо, чи є токен дійсним
    const payload = tokenService.checkRefreshToken2(refreshToken);

    // Крок 2: Перевіряємо, чи існує користувач
    const user = await userRepository.getByParams({ _id: payload.userId });
    if (!user) {
      throw new ApiError("Користувача не знайдено", 404);
    }

    // Крок 3: Видаляємо старий рефреш-токен
    await tokenRepository.deleteByRefreshToken(refreshToken);

    // Крок 4: Генеруємо нові токени
    const newTokens = await tokenService.generatePair({
      userId: user._id!,
      role: user.role,
    });

    // Крок 5: Зберігаємо нові токени в базі даних
    await tokenRepository.create({ ...newTokens, _userId: user._id! });

    return newTokens;
  }

  public async isEmailExist(email: string): Promise<void> {
    const user = await userRepository.getByParams({ email });
    if (user) {
      throw new ApiError("Email already exist", 409);
    }
  }
}

export const authService = new AuthService();
