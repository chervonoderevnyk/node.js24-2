import { EmailTypeEnum } from "../enums/email-type.enum.js";
import { emailService } from "../services/email.service.js";

class EmailUtil {
  public async sendEmailWithToken(
    emailType: EmailTypeEnum,
    email: string,
    name: string,
    actionToken: string,
    additionalData: Record<string, unknown> = {},
  ): Promise<void> {
    await emailService.sendEmail(emailType, email, {
      name,
      actionToken,
      ...additionalData,
    });
  }
}

export const emailUtil = new EmailUtil();
