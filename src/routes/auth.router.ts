import { Router } from "express";

import { authController } from "../controllers/auth.controller.js";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum.js";
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

router.post(
  "/activate-token",
  authMiddleware.extractToken,
  authController.activateToken,
);

router.post("/logout", authMiddleware.checkAccessToken, authController.logout);

router.post(
  "/logout-all",
  authMiddleware.checkAccessToken,
  authController.logoutAll,
);

router.post(
  "/forgot-password",
  commonMiddleware.isBodyValid(userValidator.validateForgotPassword),
  authController.forgotPassword,
);

router.put(
  "/forgot-password",
  commonMiddleware.isBodyValid(userValidator.validateForgotPasswordSet),
  authMiddleware.checkActionTokenMiddleware(
    ActionTokenTypeEnum.FORGOT_PASSWORD,
  ),
  authController.forgotPasswordSet,
);

router.post(
  "/verify",
  authMiddleware.checkActionTokenMiddleware(ActionTokenTypeEnum.VERIFY_EMAIL),
  authController.verifyEmail,
);

export const authRouter = router;
