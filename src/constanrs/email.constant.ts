import { EmailTypeEnum } from "../enums/email-type.enum.js";

export const emailConstant = {
  [EmailTypeEnum.WELCOME]: {
    subject: "Welcome to our platform!",
    template: "welcome",
  },
  [EmailTypeEnum.FORGOT_PASSWORD]: {
    subject: "Password reset instructions",
    template: "forgot-password",
  },
  [EmailTypeEnum.DELETE_ACCOUNT]: {
    subject: "Delete Account!!!",
    template: "delete-account!",
  },
  [EmailTypeEnum.LOG_OUT]: {
    subject: "logout",
    template: "logout",
  },
};
