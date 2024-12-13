import mongoose, { Schema } from "mongoose";

const userPasswordSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true, versionKey: false },
);

export const UserPassword = mongoose.model(
  "user_passwords",
  userPasswordSchema,
);
