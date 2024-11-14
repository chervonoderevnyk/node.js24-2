import { EmailTypeEnum } from "../enums/email-type.enum.js";
import { EmailPayloadCombinedType } from "./email-payload-combined.type.js";
import { PickRquiredType } from "./pick-rquired.type.js";

export type EmailTypeToPayloadType = {
  [EmailTypeEnum.WELCOME]: PickRquiredType<EmailPayloadCombinedType, "name">;
  [EmailTypeEnum.FORGOT_PASSWORD]: PickRquiredType<
    EmailPayloadCombinedType,
    "name" | "token"
  >;
};
