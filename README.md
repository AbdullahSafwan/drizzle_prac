# Node.js TypeScript Express Boilerplate

A modern, production-ready boilerplate for building Node.js applications with TypeScript and Express.

## Features

- **TypeScript** - Type-safe development with ES2020 support
- **Express 5** - Fast, unopinionated web framework
- **Security** - Helmet for security headers, CORS enabled
- **Logging** - Morgan for HTTP request logging
- **Code Quality** - ESLint and Prettier pre-configured
- **Hot Reload** - Nodemon for automatic server restart during development

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Getting Started

### 1. Use This Template

There are two ways to use this boilerplate:

#### Option A: Use as GitHub Template (Recommended)

If this is hosted on GitHub, click the "Use this template" button to create a new repository with a clean git history.

#### Option B: Clone and Reinitialize Git

```bash
# Clone the repository
git clone <this-repo-url> my-new-project
cd my-new-project

# Remove the existing git history
rm -rf .git

# Initialize a new git repository
git init
git add .
git commit -m "Initial commit from boilerplate"

# Add your own remote repository
git remote add origin <your-new-repo-url>
git push -u origin main
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=8080
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:8080` (or your configured PORT).

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript in `dist/` |
| `npm start` | Run production server from compiled code |
| `npm run lint` | Run ESLint to check code quality |
| `npm run format:check` | Check code formatting with Prettier |
| `npm run format:fix` | Auto-fix code formatting issues |

## Project Structure

```
node_ts_template/
├── src/
│   ├── app.ts              # Express app configuration
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API route definitions
│   └── config/
│       └── env.ts          # Environment configuration
├── dist/                   # Compiled JavaScript (generated)
├── .env                    # Environment variables (create from .env.example)
├── tsconfig.json           # TypeScript configuration
├── eslint.config.mts       # ESLint configuration
├── .prettierrc             # Prettier configuration
└── nodemon.json            # Nodemon configuration
```

## Building Your Application

### Adding New Routes

1. Create a new route file in `src/routes/`:

```typescript
// src/routes/users.ts
import express from "express";

const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.json({ users: [] });
});

userRouter.post("/", (req, res) => {
  // Handle user creation
  res.status(201).json({ message: "User created" });
});

export default userRouter;
```

2. Import and use in [src/routes.ts](src/routes.ts):

```typescript
import express from "express";
import userRouter from "./routes/users";

const router = express.Router();

router.use("/api/v1/users", userRouter);

export default router;
```

### Adding Middleware

Add custom middleware in [src/app.ts](src/app.ts):

```typescript
// Example: Request timing middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} took ${duration}ms`);
  });
  next();
});
```

### Environment Configuration

Add new config values in [src/config/env.ts](src/config/env.ts):

```typescript
interface Config {
  port: number;
  nodeEnv: string;
  databaseUrl: string;  // Add new config
}

const config: Config = {
  port: Number(process.env.PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
};
```

### Adding Services/Controllers

Organize your code with services and controllers:

```
src/
├── controllers/
│   └── userController.ts
├── services/
│   └── userService.ts
├── models/
│   └── user.ts
└── middleware/
    └── auth.ts
```

### Error Handling

Add a global error handler in [src/app.ts](src/app.ts):

```typescript
// After all routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || "Internal Server Error",
    },
  });
});
```

## Production Deployment

### 1. Build the Application

```bash
npm run build
```

### 2. Set Production Environment

```bash
export NODE_ENV=production
export PORT=8080
```

### 3. Start the Server

```bash
npm start
```

### Docker Deployment (Optional)

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

## CORS Configuration

CORS is pre-configured in [src/app.ts](src/app.ts). Modify as needed:

```typescript
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Cache-Control"],
  }),
);
```

## Testing

Add your preferred testing framework:

```bash
# Example with Jest
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

## Common Use Cases

### REST API
Perfect as-is! Add your routes, controllers, and services.

### GraphQL API
Install Apollo Server and integrate with Express.

### Microservice
Use as a base for individual microservices with additional messaging libraries.

### Monorepo
Extend structure with `packages/` directory and workspace configuration.

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
