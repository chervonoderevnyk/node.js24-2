import { FilterQuery } from "mongoose";

import { IActionToken } from "../interfaces/action.token.interface.js";
import { ActionToken } from "../models/action.token.models.js";
import { Token } from "../models/token.models.js";

class ActionTokenRepository {
  public async createActionToken(dto: IActionToken): Promise<IActionToken> {
    return await ActionToken.create(dto);
  }

  public async isActionTokenUsed(
    params: FilterQuery<IActionToken>,
  ): Promise<IActionToken | null> {
    return await ActionToken.findOne({ ...params });
  }

  public async markTokenAsUsed(actionToken: string): Promise<void> {
    await ActionToken.updateOne({ actionToken }, { $set: { used: true } });
  }

  public async deleteTokensByParams(
    params: FilterQuery<IActionToken>,
  ): Promise<void> {
    await Token.deleteMany(params);
  }
}

export const actionTokenRepository = new ActionTokenRepository();

// public async deleteByParams(
//   params: FilterQuery<IActionToken>,
// ): Promise<void> {
//   await Token.deleteMany(params);
// }
