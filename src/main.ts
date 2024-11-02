import express, { NextFunction, Request, Response } from "express";

import { ApiError } from "./errors/appi-error";
import { userRouter } from "./routes/user.router";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);

app.use(
  "*",
  (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({ message: err.message });
  },
);

process.on("uncaughtException", (e) => {
  console.error("Uncaught exception:", e.message, e.stack);
  process.exit(1);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
