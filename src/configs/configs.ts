import * as process from "node:process";

import dotenv from "dotenv";

dotenv.config();

export const configs = {
  APP_PORT: Number(process.env.APP_PORT),
  APP_HOST: process.env.APP_HOST,

  MONGO_URL: process.env.MONGO_URL,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,

  ACTIVATE_TOKEN: process.env.ACTIVATE_TOKEN,
  ACTIVATE_TOKEN_EXPIRES_IN: process.env.ACTIVATE_TOKEN_EXPIRES_IN,

  VERIFY_EMAIL: process.env.VERIFY_EMAIL,
  VERIFY_EMAIL_EXPIRES_IN: process.env.VERIFY_EMAIL_EXPIRES_IN,

  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,

  FRONTEND_URL: process.env.FRONTEND_URL,
};
