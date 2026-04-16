# Full-Stack Task Manager (Backend Primary)

Versioned API with JWT auth, role-based access, and task CRUD. Includes a minimal React frontend for auth and protected operations.

## Stack

- Backend: Node.js, Express, MongoDB (Mongoose)
- Security: bcrypt password hashing, JWT, httpOnly auth cookie, Helmet, mongo-sanitize, Zod validation
- API Docs: Swagger UI + Postman collection
- Frontend: React + Vite
- Optional Ops: Docker + request logging (Morgan)

## Project Structure

- `backend/`
  - `src/config`: environment + database config
  - `src/modules`: feature modules (`auth`, `users`, `tasks`)
  - `src/middlewares`: auth, RBAC, validation, error handling
  - `src/routes`: versioned API routes
  - `src/docs/swagger.js`: OpenAPI spec + Swagger UI
  - `postman/task-manager-v1.postman_collection.json`
- `frontend/`
  - simple auth + dashboard UI

## Backend Features

- Auth APIs:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `GET /api/v1/auth/me`
  - `POST /api/v1/auth/logout`
- RBAC:
  - roles: `user`, `admin`
  - admin endpoints:
    - `GET /api/v1/users`
    - `PATCH /api/v1/users/:userId/role`
- Task CRUD:
  - `GET /api/v1/tasks`
  - `POST /api/v1/tasks`
  - `GET /api/v1/tasks/:taskId`
  - `PATCH /api/v1/tasks/:taskId`
  - `DELETE /api/v1/tasks/:taskId`
- Versioning:
  - `v1` full API (`/api/v1/...`)
  - `v2` placeholder route (`GET /api/v2`)
- Error handling:
  - consistent JSON error responses with status codes

## MongoDB Schema

### User

- `name`: String
- `email`: String (unique)
- `password`: String (hashed via bcrypt)
- `role`: Enum (`user`, `admin`)
- timestamps

### Task

- `title`: String
- `description`: String
- `status`: Enum (`todo`, `in-progress`, `done`)
- `dueDate`: Date | null
- `owner`: ObjectId -> User
- timestamps

## Local Setup

1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

3. URLs

- API: `http://localhost:5000`
- Swagger: `http://localhost:5000/api-docs`
- Frontend: `http://localhost:5173`

## Docker Setup

1. Create `backend/.env` (based on `.env.example`).
2. Run:

```bash
docker compose up --build
```

## Security Notes

- Passwords are hashed with bcrypt (`12` salt rounds)
- JWT is issued at login/register and set as httpOnly cookie
- Auth middleware also supports `Authorization: Bearer <token>`
- Validation with Zod for body/params
- Mongo operator injection mitigation via `express-mongo-sanitize`

## API Documentation

- Swagger UI: `/api-docs`
- Postman collection: `backend/postman/task-manager-v1.postman_collection.json`
"# Backend-assignment1" 
