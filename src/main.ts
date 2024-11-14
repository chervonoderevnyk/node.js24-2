import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";
import dotenv from "dotenv";


import { ApiError } from "./errors/appi-error.js";
import { authRouter } from "./routes/auth.router.js";
import { userRouter } from "./routes/user.router.js";
import {configs} from "./configs/configs.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/users", userRouter);

app.use(
  "*",
  (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({ message: err.message });
  }
);

process.on("uncaughtException", (e) => {
  console.error("Uncaught exception:", e.message, e.stack);
  process.exit(1);
});

const host = configs.APP_HOST || "localhost"; // Значення за замовчуванням для APP_HOST
const mongoUrl = configs.MONGO_URL as string;  // Примусове приведення до string

app.listen(configs.APP_PORT, host, async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log(`Server is running on port ${configs.APP_PORT}`);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
});
