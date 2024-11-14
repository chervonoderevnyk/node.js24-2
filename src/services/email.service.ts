import nodemailer, {Transporter} from "nodemailer";
import nodemailerHbs from "nodemailer-express-handlebars";

import {configs} from "../configs/configs.js";
import {emailConstant} from "../constanrs/email.constant.js";
import {EmailTypeEnum} from "../enums/email-type.enum.js";
import * as path from "node:path";


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

  public async sendEmail(
      type: EmailTypeEnum,
      to: string,
      context: Record<string, string>,
    ): Promise<void> {
    const {subject,template} = emailConstant[type]
    const mailOptions = {
      to,
      subject,
      template,
      context,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export const emailService = new EmailService();