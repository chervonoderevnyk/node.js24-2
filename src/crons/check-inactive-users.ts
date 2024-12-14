import { CronJob } from "cron";

import { EmailTypeEnum } from "../enums/email-type.enum.js";
import { userRepository } from "../repositories/user.repository.js";
import { emailUtil } from "../utiles/email.util.js";

const checkInactiveUsers = async () => {
  try {
    // const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    const fiveDaysAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

    // Знаходимо неактивних користувачів
    const inactiveUsers = await userRepository.getList({
      lastVisit: { $lt: fiveDaysAgo },
    });

    for (const user of inactiveUsers) {
      // Відправка email
      await emailUtil.sendEmailWithToken(
        EmailTypeEnum.INACTIVITY_REMINDER, // Тип повідомлення
        user.email,
        user.name ?? "Dear User", // Ім'я або замінник
        "dummyActionToken",
        {
          frontUrl: process.env.FRONT_URL!, // Додаткові дані
        },
      );

      console.log(`Email sent to inactive user: ${user.email}`);
    }
  } catch (error) {
    console.error("Error checking inactive users:", error);
  }
};

export const checkInactiveUsersCron = new CronJob(
  // "0 0 * * *", // Запуск щодня опівночі
  "0 */1 * * *", // Запуск кожні 1 години
  checkInactiveUsers,
);
