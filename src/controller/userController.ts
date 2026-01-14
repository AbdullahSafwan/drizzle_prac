import { Request, Response } from "express";
import { debugLog } from "../utils/helper";
import { userDao } from "../dao/userDao";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userDao.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    debugLog("error fetching user users", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const userController = { getAllUsers };
