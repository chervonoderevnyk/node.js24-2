import { Router } from "express";

import { userController } from "../controllers/user.controller";

const router = Router();

router.get("/", userController.getList);
router.post("/", userController.create);

router.put("/:userId", userController.update);
router.get("/:userId", userController.getById);
router.delete("/:userId", userController.delete);

export const userRouter = router;
