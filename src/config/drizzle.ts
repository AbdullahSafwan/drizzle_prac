import { drizzle } from 'drizzle-orm/node-postgres';
import config from './env';

// You can specify any property from the node-postgres connection options
const db = drizzle({ 
  connection: { 
    connectionString: config.databaseUrl,
    ssl: true,
  }
});

export default db;
