import mongoose from "mongoose";

import { IToken } from "../interfaces/token.interface.js";
import { User } from "./user.models.js";

const { Schema } = mongoose;

const tokenSchema = new Schema(
  {
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    _userId: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Token = mongoose.model<IToken>("tokens", tokenSchema);
