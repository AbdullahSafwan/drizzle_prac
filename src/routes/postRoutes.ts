import { Router } from "express";
import { postController } from "../controller/postController";

const router = Router();

router.post("/", postController.createPost);
router.get("/:userId", postController.getPostsByUserId);

export default router;
