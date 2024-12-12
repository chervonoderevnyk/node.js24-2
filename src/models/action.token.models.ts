import mongoose from "mongoose";
import { IActionToken } from "src/interfaces/action.token.interface.js";

import { User } from "./user.models.js";

const { Schema } = mongoose;

const actionTokenSchema = new Schema(
  {
    actionToken: { type: String, required: true },
    _userId: { type: Schema.Types.ObjectId, ref: User, required: true },
    used: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ActionToken = mongoose.model<IActionToken>(
  "action_Tokens",
  actionTokenSchema,
);
