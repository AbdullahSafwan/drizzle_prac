import { Request, Response } from "express";
import { debugLog } from "../utils/helper";
import { postDao } from "../dao/postDao";

const createPost = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await postDao.createPost(data.title, data.content, data.authorId);
    res.status(200).json(result);
  } catch (error) {
    debugLog("error creating post", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPostsByUserId = async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId);
    const result = await postDao.getPostsByUserId(userId);
    res.status(200).json(result);
  } catch (error) {
    debugLog("error fetching posts", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const postController = { createPost, getPostsByUserId };
