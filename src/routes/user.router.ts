import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { commonMiddleware } from "../middlewares/common.middleware";
import { userValidator } from "../validators/user.validator";

const router = Router();

router.get("/", userController.getList);
// router.post(
//   "/",
//   commonMiddleware.isBodyValid(userValidator.validateUserCreate),
//   commonMiddleware.validateUserCreateBody,
//   userController.create,
// );

router.put(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  commonMiddleware.isBodyValid(userValidator.validateUserUpdate),
  commonMiddleware.validateUserUpdateBody,
  userController.update,
);
router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.getById,
);
router.delete(
  "/:userId",
  commonMiddleware.isIdValid("userId"),
  userController.delete,
);

export const userRouter = router;
