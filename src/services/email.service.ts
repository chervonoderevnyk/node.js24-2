import * as path from "node:path";

import nodemailer, { Transporter } from "nodemailer";
import nodemailerHbs from "nodemailer-express-handlebars";

import { configs } from "../configs/configs.js";
import { emailConstant } from "../constanrs/email.constant.js";
import { EmailTypeEnum } from "../enums/email-type.enum.js";
import { EmailTypeToPayloadType } from "../types/email-type-to-payload.type.js";

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      from: configs.SMTP_EMAIL,
      auth: {
        user: configs.SMTP_EMAIL,
        pass: configs.SMTP_PASSWORD,
      },
    });

    this.transporter.use(
      "compile",
      nodemailerHbs({
        //         viewEngine: {
        //           extname: ".hbs",
        //           partialsDir: "src/templates/partials",
        //           layoutsDir: "src/templates/layouts",
        //         },
        //         viewPath: "src/templates/views",
        //         extName: ".hbs",
        //       })
        //   )
        // }
        viewEngine: {
          extname: ".hbs",
          partialsDir: path.join(process.cwd(), "src", "templates", "partials"),
          layoutsDir: path.join(process.cwd(), "src", "templates", "layouts"),
        },
        viewPath: path.join(process.cwd(), "src", "templates", "views"),

        extName: ".hbs",
      }),
    );
  }

  public async sendEmail<T extends EmailTypeEnum>(
    type: T,
    to: string,
    context: EmailTypeToPayloadType[T],
  ): Promise<void> {
    const { subject, template } = emailConstant[type];
    const mailOptions = {
      to,
      subject,
      template,
      context: {
        ...context,
        frontUrl: configs.FRONTEND_URL,
      },
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export const emailService = new EmailService();
