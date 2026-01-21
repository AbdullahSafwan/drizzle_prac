import db from "../config/drizzle";
import { postsTable } from "../db/schema";
import { debugLog } from "../utils/helper";
import { eq } from "drizzle-orm";

const createPost = async (title: string, content: string, authorId: string) => {
  try {
    const newPost = await db.insert(postsTable).values({
      authorId,
      title,
      content,
    });
    return newPost;
  } catch (error) {
    debugLog("Error creating post:", error);
    throw error;
  }
};

const getPostsByUserId = async (userId: string) => {
  try {
    const result = await db.select().from(postsTable).where(eq(postsTable.authorId, userId));
    return result;
  } catch (error) {
    debugLog("Error fetching posts:", error);
    throw error;
  }
};

export const postDao = { createPost, getPostsByUserId };
