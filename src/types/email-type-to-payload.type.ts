import { EmailTypeEnum } from "../enums/email-type.enum.js";
import { EmailPayloadCombinedType } from "./email-payload-combined.type.js";
import { PickRquiredType } from "./pick-rquired.type.js";

type EmailContextWithFrontUrl<T> = T & { frontUrl: string };

export type EmailTypeToPayloadType = {
  [EmailTypeEnum.WELCOME]: EmailContextWithFrontUrl<
    PickRquiredType<
      EmailPayloadCombinedType,
      "name" | "actionToken" | "frontUrl"
    >
  >;

  [EmailTypeEnum.FORGOT_PASSWORD]: PickRquiredType<
    EmailPayloadCombinedType,
    "name" | "actionToken"
  >;

  [EmailTypeEnum.DELETE_ACCOUNT]: PickRquiredType<
    EmailPayloadCombinedType,
    "frontUrl"
  >;

  [EmailTypeEnum.LOG_OUT]: EmailContextWithFrontUrl<
    PickRquiredType<EmailPayloadCombinedType, "name" | "frontUrl">
  >;

  [EmailTypeEnum.INACTIVITY_REMINDER]: EmailContextWithFrontUrl<
    PickRquiredType<EmailPayloadCombinedType, "name" | "frontUrl">
  >;
};
