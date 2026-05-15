# Frontend — RBAC Books & Users

React + Vite + TypeScript + Tailwind CSS frontend for the RBAC backend.

## Setup

```bash
cd frontend
cp .env.example .env       # set VITE_API_URL to your backend URL
pnpm install
pnpm dev
```

App runs at http://localhost:5173 and expects the API at `VITE_API_URL` (default `http://localhost:4000/api`).

## Structure

- `src/services/` — Axios client with JWT interceptor + auth/books/users API wrappers
- `src/context/AuthContext.tsx` — Auth state, login/signup/logout, session restore
- `src/components/ProtectedRoute.tsx` — Route guard (auth + optional `adminOnly`)
- `src/components/AppLayout.tsx`, `Navbar.tsx` — Shared shell, hides `Users` link for non-admins
- `src/pages/` — `Login`, `Signup`, `BooksList`, `BookDetail`, `BookForm`, `UsersList`, `UserForm`, `AccessDenied`

## RBAC behavior

- Common user: sees Books only; no create/edit/delete buttons.
- Admin: sees Books + Users with full CRUD controls.
- Hitting `/users`, `/books/new`, `/books/:id/edit`, etc. as a non-admin renders **Access denied**.
- Backend is the source of truth — all role checks are duplicated server-side.
