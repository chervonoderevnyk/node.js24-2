import { ApiError } from "../errors/appi-error";
import { ITokenPair } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  public async signUp(
    dto: IUser,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    await this.isEmailExist(dto.email);
    const password = await passwordService.hashPassword(dto.password);
    // const user = await userRepository.create({ ...dto, password });
    const user = await userRepository.create({
      ...dto,
      password,
      email: dto.email.toLowerCase(),
    });

    const tokens = await tokenService.generatePair({
      userId: user._id,
      role: user.role,
    });
    await tokenRepository.create({ ...tokens, _userId: user._id });

    return { user, tokens };
  }

  public async signIn(dto: any): Promise<{ user: IUser; tokens: ITokenPair }> {
    // const user = await userRepository.getByParams({ email: dto.email });
    const user = await userRepository.getByParams({
      email: dto.email.toLowerCase(),
    });

    if (!user) {
      throw new ApiError("Invalid credentials1", 401);
    }
    const isPasswordCorrect = await passwordService.comparePassword(
      dto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new ApiError("Invalid credentials2", 401);
    }

    const tokens = await tokenService.generatePair({
      userId: user._id,
      role: user.role,
    });
    await tokenRepository.create({ ...tokens, _userId: user._id });

    return { user, tokens };
  }

  public async isEmailExist(email: string): Promise<void> {
    const user = await userRepository.getByParams({ email });
    if (user) {
      throw new ApiError("Email already exist", 409);
    }
  }
}

export const authService = new AuthService();
