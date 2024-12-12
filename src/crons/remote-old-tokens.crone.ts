import { CronJob } from "cron";

import { configs } from "../configs/configs.js";
import { timeHelper } from "../helpers/time.helper.js";
import { tokenRepository } from "../repositories/token.repository.js";

const handler = async () => {
  try {
    console.log("[removeOldTokensCron] Cron job is running");
    const [value, unit] = timeHelper.parseString(
      configs.JWT_REFRESH_EXPIRES_IN as string,
    );
    console.log("Deleting tokens older than", value, unit);
    await tokenRepository.delete({
      createdAt: { $lte: timeHelper.subtractByParams(value, unit) },
    });
    console.log("[removeOldTokensCron] Deleted tokens:");
  } catch (error) {
    console.error("[removeOldTokensCron] Cron error:", error);
  }
};

export const removeOldTokensCron = new CronJob("0 * * * * *", handler);
