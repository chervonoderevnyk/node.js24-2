import { Router } from "express";

import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { commonMiddleware } from "../middlewares/common.middleware.js";
import { userValidator } from "../validators/user.validator.js";

const router = Router();

router.post(
  "/sign-up",
  commonMiddleware.isBodyValid(userValidator.validateUserCreate),
  authController.singUp,
);

router.post(
  "/sign-in",
  commonMiddleware.isBodyValid(userValidator.validateLogIn),
  authController.singIn,
);

router.post(
  "/refresh-token",
  authMiddleware.checkRefreshToken,
  authController.refreshToken,
);

export const authRouter = router;
