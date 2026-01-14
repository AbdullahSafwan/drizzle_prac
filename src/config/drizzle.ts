import { drizzle } from "drizzle-orm/node-postgres";
import config from "./env";
import { schema } from "../db/schema";

const db = drizzle({
  connection: {
    connectionString: config.databaseUrl,
    ssl: false,
  },
  schema,
});

export default db;
