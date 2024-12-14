import { CronJob } from "cron";

import { UserPassword } from "../models/password.models.js";

const cleanOldPasswords = async () => {
  try {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const result = await UserPassword.deleteMany({
      createdAt: { $lt: ninetyDaysAgo },
    });
    console.log("Old passwords deleted:", result.deletedCount);
  } catch (error) {
    console.error("Error deleting old passwords:", error);
  }
};

export const cleanOldPasswordsCron = new CronJob(
  "0 0 * * *",
  cleanOldPasswords,
); // Щоденний запуск опівночі
