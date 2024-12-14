import { checkInactiveUsersCron } from "./check-inactive-users.js";
import { cleanOldPasswordsCron } from "./clean-old-passwords.cron.js";
import { removeOldTokensCron } from "./remote-old-tokens.crone.js";
import { testCron } from "./test.crone.js";

export const jobRunner = () => {
  testCron.start();
  removeOldTokensCron.start();
  cleanOldPasswordsCron.start();
  checkInactiveUsersCron.start();
};
