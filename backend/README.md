# RBAC Books API — Backend

Express + TypeScript + Prisma + PostgreSQL backend with JWT auth, input validation (Zod), and role-based access control.

## Step 1 — Database setup

1. Provision a hosted PostgreSQL database (e.g. [Neon](https://neon.tech), [Supabase](https://supabase.com), or Railway) or run it locally via Docker.
2. Copy `.env.example` to `.env` and fill in your `DATABASE_URL` and `JWT_SECRET`.
3. Install dependencies and apply the migrations:

```bash
cd backend
pnpm install
pnpm prisma:generate
pnpm prisma:migrate deploy
```

## Step 2 — Run the server

```bash
pnpm dev          # starts ts-node-dev on PORT (default 4000)
pnpm build        # compiles TypeScript to /dist
```

Healthcheck: `GET http://localhost:4000/health`

## API Routes

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Authenticate and get JWT |
| GET | `/api/auth/me` | Auth | Get current user profile |
| GET | `/api/books` | Auth | Get all books |
| GET | `/api/books/:id` | Auth | Get book by ID |
| POST/PUT/DELETE | `/api/books...` | **Admin** | Manage books |
| GET/POST/PUT/DELETE | `/api/users...` | **Admin** | Manage users |

## Project structure (Layered Architecture)

```
backend/
├── prisma/
│   └── schema.prisma         # Database models (User, Book, Role enum)
├── src/
│   ├── config/             # DB connection & Env validation
│   ├── controllers/        # HTTP layer (Req/Res handling)
│   ├── middlewares/        # Auth, RBAC, Zod validation, Error handling
│   ├── routes/             # Express routers
│   ├── schemas/            # Zod validation schemas
│   ├── services/           # Core business logic & DB interactions
│   ├── utils/              # Custom AppError & AsyncHandler
│   ├── app.ts              # Express app factory
│   └── server.ts           # Entry point + graceful shutdown
```

## Environment variables

| Key             | Description                              | Default |
| --------------- | ---------------------------------------- | ------- |
| `DATABASE_URL`  | PostgreSQL connection string             | -       |
| `JWT_SECRET`    | Secret for signing JWTs                  | -       |
| `JWT_EXPIRES_IN`| Token TTL                                | `7d`    |
| `PORT`          | HTTP port                                | `4000`  |
| `CORS_ORIGIN`   | Allowed frontend origin                  | `http://localhost:5173` |