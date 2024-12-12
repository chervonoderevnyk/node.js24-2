import { removeOldTokensCron } from "./remote-old-tokens.crone.js";
import { testCron } from "./test.crone.js";

export const jobRunner = () => {
  testCron.start();
  removeOldTokensCron.start();
};
