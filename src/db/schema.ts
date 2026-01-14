import { integer, pgTable, varchar, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const postsTable = pgTable("posts", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  content: varchar({ length: 5000 }).notNull(),
  authorId: uuid()
    .notNull()
    .references(() => usersTable.id),
});

export const schema = {
  users: usersTable,
  posts: postsTable,
};
