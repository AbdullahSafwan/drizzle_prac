import { drizzle } from "drizzle-orm/node-postgres";
import config from "./env";

const db = drizzle({
  connection: {
    connectionString: config.databaseUrl,
    ssl: true,
  },
});

export default db;
