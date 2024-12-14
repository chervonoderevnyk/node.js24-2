import mongoose from "mongoose";

import { RoleEnum } from "../enums/role.enum.js";
import { IUser } from "../interfaces/user.interface.js";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String, required: false },
    role: {
      type: String,
      enum: RoleEnum,
      required: true,
      default: RoleEnum.USER,
    },
    isVerified: { type: Boolean, required: true, default: false },
    lastVisit: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = mongoose.model<IUser>("users", userSchema);
