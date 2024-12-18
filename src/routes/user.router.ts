import { Router } from "express";

import { userController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { commonMiddleware } from "../middlewares/common.middleware.js";
import { userValidator } from "../validators/user.validator.js";

const router = Router();

router.get("/", userController.getList);
router.get("/me", authMiddleware.checkAccessToken, userController.getMe);

router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.getById,
);

router.put(
  "/me",
  authMiddleware.checkAccessToken,
  commonMiddleware.isBodyValid(userValidator.validateUserUpdate),
  commonMiddleware.validateUserUpdateBody,
  userController.updateMe,
);

router.delete("/me", authMiddleware.checkAccessToken, userController.deleteMe);

export const userRouter = router;
