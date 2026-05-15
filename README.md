# RBAC Books Platform

Full-stack monorepo — book management with role-based access control (User / Admin).

**Backend:** Express · TypeScript · Prisma · PostgreSQL · JWT · Zod  
**Frontend:** React · Vite · TypeScript · Tailwind CSS · Axios

## Features

- JWT authentication (signup / login / me) with session restore
- RBAC: regular users can browse books; admins get full CRUD over books and users
- Role checks enforced on both sides — client and server validate independently
- Layered architecture on the backend: controllers → services → Prisma
- Request validation via Zod schemas with centralized error handling

## Quick Start

```bash
# Backend
cd backend && cp .env.example .env
pnpm install && pnpm prisma:migrate deploy && pnpm dev

# Frontend
cd frontend && cp .env.example .env
pnpm install && pnpm dev
```

Backend runs at `http://localhost:4000` · Frontend at `http://localhost:5173`

## Project Structure

```
.
├── backend/   # Express + Prisma API
└── frontend/  # React + Vite SPA
```

## Docs

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
