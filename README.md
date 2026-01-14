# Drizzle Practice App

A Node.js + TypeScript project demonstrating Drizzle ORM with PostgreSQL, featuring a complete REST API setup with Express.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Docker and Docker Compose (for local PostgreSQL)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your database configuration:

```env
PORT=8080
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Docker PostgreSQL credentials
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=drizzle_prac
DB_PORT=5432
```

### 3. Start PostgreSQL Database

Using Docker Compose:

```bash
docker-compose up -d
```

### 4. Run Database Migrations

Generate migrations from your schema:

```bash
npx drizzle-kit generate
```

Push migrations to the database:

```bash
npx drizzle-kit migrate
```

### 5. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:8080` (or your configured PORT).

## Available Scripts

| Command                    | Description                                 |
| -------------------------- | ------------------------------------------- |
| `npm run dev`              | Start development server with hot reload    |
| `npm run build`            | Compile TypeScript to JavaScript in `dist/` |
| `npm start`                | Run production server from compiled code    |
| `npm run lint`             | Run ESLint to check code quality            |
| `npm run format:check`     | Check code formatting with Prettier         |
| `npm run format:fix`       | Auto-fix code formatting issues             |
| `npx drizzle-kit generate` | Generate migrations from schema changes     |
| `npx drizzle-kit migrate`  | Apply migrations to database                |
| `npx drizzle-kit push`     | Push schema directly to database (dev only) |
| `npx drizzle-kit studio`   | Open Drizzle Studio (database GUI)          |

## Project Structure

```
drizzle_prac/
├── src/
│   ├── app.ts              # Express app configuration
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API route definitions
│   ├── config/
│   │   ├── env.ts          # Environment configuration
│   │   └── drizzle.ts      # Drizzle ORM client setup
│   └── db/
│       └── schema.ts       # Database schema definitions
├── drizzle/                # Generated migrations
│   ├── meta/               # Migration metadata
│   └── *.sql               # SQL migration files
├── dist/                   # Compiled JavaScript (generated)
├── .env                    # Environment variables (create from .env.example)
├── drizzle.config.ts       # Drizzle Kit configuration
├── docker-compose.yml      # PostgreSQL container setup
├── tsconfig.json           # TypeScript configuration
├── eslint.config.mts       # ESLint configuration
├── .prettierrc             # Prettier configuration
└── nodemon.json            # Nodemon configuration
```

## Working with Drizzle ORM

### Database Schema

Define your database tables in [src/db/schema.ts](src/db/schema.ts):

```typescript
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});
```

### Running Migrations

After modifying your schema, generate and apply migrations:

```bash
# Generate migration files
npx drizzle-kit generate

# Apply migrations to database
npx drizzle-kit migrate
```

For development, you can push schema changes directly without migrations:

```bash
npx drizzle-kit push
```

### Drizzle Studio

View and edit your database with Drizzle Studio GUI:

```bash
npx drizzle-kit studio
```

Opens a web interface at `https://local.drizzle.studio`

### Database Queries

Use Drizzle ORM in your routes:

```typescript
import express from "express";
import db from "./config/drizzle";
import { user } from "./db/schema";
import { eq } from "drizzle-orm";

const router = express.Router();

// Get all users
router.get("/users", async (req, res) => {
  const users = await db.select().from(user);
  res.json(users);
});

// Get user by id
router.get("/users/:id", async (req, res) => {
  const [foundUser] = await db
    .select()
    .from(user)
    .where(eq(user.id, parseInt(req.params.id)));

  if (!foundUser) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(foundUser);
});

// Create user
router.post("/users", async (req, res) => {
  const [newUser] = await db.insert(user).values(req.body).returning();

  res.status(201).json(newUser);
});

// Update user
router.put("/users/:id", async (req, res) => {
  const [updatedUser] = await db
    .update(user)
    .set(req.body)
    .where(eq(user.id, parseInt(req.params.id)))
    .returning();

  res.json(updatedUser);
});

// Delete user
router.delete("/users/:id", async (req, res) => {
  await db.delete(user).where(eq(user.id, parseInt(req.params.id)));

  res.status(204).send();
});

export default router;
```

### Adding New Tables

1. Add table definition to [src/db/schema.ts](src/db/schema.ts):

```typescript
export const posts = pgTable("posts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  content: text().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

2. Generate and apply migration:

```bash
npx drizzle-kit generate --name=add-posts-table
npx drizzle-kit migrate
```

### Common Drizzle Patterns

**Relationships:**

```typescript
// One-to-many
const usersWithPosts = await db.query.user.findMany({
  with: {
    posts: true,
  },
});

// Joins
const result = await db.select().from(user).leftJoin(posts, eq(posts.userId, user.id));
```

**Filtering:**

```typescript
import { eq, gt, like, and, or } from "drizzle-orm";

// Simple filter
await db.select().from(user).where(eq(user.email, "test@example.com"));

// Multiple conditions
await db
  .select()
  .from(user)
  .where(and(gt(user.age, 18), like(user.name, "%John%")));
```

**Transactions:**

```typescript
await db.transaction(async (tx) => {
  await tx.insert(user).values({ name: "John", age: 30, email: "john@example.com" });
  await tx.insert(posts).values({ title: "First post", content: "...", userId: 1 });
});
```

## Docker Setup

### Local Development with Docker

Start PostgreSQL container:

```bash
docker-compose up -d
```

Stop container:

```bash
docker-compose down
```

View logs:

```bash
docker-compose logs -f postgres
```

### Full Application Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t drizzle-app .
docker run -p 8080:8080 --env-file .env drizzle-app
```

## Production Deployment

### 1. Run Migrations

Ensure migrations are applied to production database:

```bash
npx drizzle-kit migrate
```

### 2. Build the Application

```bash
npm run build
```

### 3. Set Production Environment

```bash
export NODE_ENV=production
export PORT=8080
export DATABASE_URL=postgresql://user:password@prod-host:5432/dbname
```

### 4. Start the Server

```bash
npm start
```

## Troubleshooting

### Migration Errors

If you encounter table rename errors with `drizzle-kit generate`:

1. Check the snapshot files in `drizzle/meta/`
2. If renaming tables, use `--custom` flag to write manual SQL:
   ```bash
   npx drizzle-kit generate --custom
   ```
3. For development, use `push` to sync schema directly:
   ```bash
   npx drizzle-kit push
   ```

### Database Connection Issues

Verify your `DATABASE_URL` format:

```
postgresql://username:password@host:port/database
```

Test connection:

```bash
psql $DATABASE_URL
```

### TypeScript Errors

Regenerate types after schema changes:

```bash
npm run build
```

## Useful Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Drizzle Kit Documentation](https://orm.drizzle.team/kit-docs/overview)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Documentation](https://expressjs.com/)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Run `npm run lint` and `npm run format:check`
4. Commit your changes
5. Push to the branch
6. Create a Pull Request

## License

ISC

## Author

AbdullahSafwan
