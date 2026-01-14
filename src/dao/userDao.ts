import db from "../config/drizzle";
import { debugLog } from "../utils/helper";

const getAllUsers = async () => {
  try {
    const users = await db.query.users.findMany();
    return users;
  } catch (error) {
    debugLog("Error fetching users:", error);
    throw error;
  }
};

export const userDao = { getAllUsers };
