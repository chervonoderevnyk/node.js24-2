import { FilterQuery } from "mongoose";

import { IToken } from "../interfaces/token.interface.js";
import { Token } from "../models/token.models.js";

class TokenRepository {
  public async create(dto: IToken): Promise<IToken> {
    return await Token.create(dto);
  }

  public async findByParams(
    params: FilterQuery<IToken>,
  ): Promise<IToken | null> {
    return await Token.findOne(params);
  }

  public async delete(params: FilterQuery<IToken>): Promise<void> {
    await Token.deleteMany(params);
  }
}

export const tokenRepository = new TokenRepository();

// public async deleteByRefreshToken(refreshToken: string): Promise<void> {
//   await Token.deleteOne({ refreshToken });
// }
//
// public async deleteByParams(params: FilterQuery<IToken>): Promise<void> {
//   await Token.deleteMany(params);
// }
//
// public async deleteById(id: string): Promise<void> {
//   await Token.deleteOne({ _id: id });
// }
