import { userController } from "../controller/userController";
import { Router } from "express";

const router = Router();

router.get("/", userController.getAllUsers);

export default router;
