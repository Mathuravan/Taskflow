# TaskFlow

TaskFlow is a personal task management system built as an internship-ready full-stack project. Its existing Vite starter remains in `task1/`; that directory is the frontend. The backend, database migration history, Docker configuration, and project documentation live beside it.

## Four phases

1. **Foundation and architecture**: React/Vite supplies the browser application, FastAPI supplies an HTTP API, and PostgreSQL persists the data.
2. **Backend and data**: Pydantic validates requests, SQLAlchemy maps Python models to relational tables, Alembic applies schema migrations, and JWT plus Argon2 protect accounts.
3. **Frontend experience**: React Router protects private screens, Axios calls the API, and plain CSS builds a responsive dashboard.
4. **Quality and delivery**: Pytest checks the API contract, Vitest checks a frontend interaction, Docker Compose runs the full stack, and the deployment section describes the production environment.

## Architecture

```text
Browser (React + Vite)
        |
        | HTTPS + JWT Authorization header
        v
FastAPI routes -> Pydantic validation -> SQLAlchemy -> PostgreSQL
        |
        +-> Alembic migration history keeps database schema reproducible
```

A task always has a `user_id`. Every task query filters by the authenticated JWT user's ID, so users cannot read or modify another user's tasks.

## Folder structure

```text
TaskFlow/
├── task1/                       # React + Vite frontend
│   ├── src/
│   │   ├── api/client.js         # Axios API methods and JWT header
│   │   ├── components/           # Reusable UI pieces
│   │   ├── context/AuthContext.jsx
│   │   └── pages/                # Login, register, and dashboard screens
│   ├── Dockerfile
│   └── .env.example
├── backend/
│   ├── app/
│   │   ├── api/routes/           # Authentication, tasks, dashboard endpoints
│   │   ├── core/                 # Environment settings and security helpers
│   │   ├── db/                   # SQLAlchemy session and base class
│   │   ├── models/               # User and task tables
│   │   └── schemas/              # Pydantic request/response validation
│   ├── alembic/versions/         # Database migration files
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
├── docker-compose.yml
├── .env.example
└── .gitignore
```

## Run locally with Docker

Run every command in the project root: `C:\\Users\\Mathuravan\\Desktop\\Industry_Project\\TaskFlow`.

1. Copy `.env.example` to `.env`.
2. Replace `SECRET_KEY` with a long random value. Generate one with:

```powershell
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

3. Start the application:

```powershell
docker compose up --build
```

4. Open the frontend at [http://localhost:8080](http://localhost:8080), FastAPI's interactive Swagger UI at [http://localhost:8000/docs](http://localhost:8000/docs), and the health endpoint at [http://localhost:8000/health](http://localhost:8000/health).

The first backend container startup runs `alembic upgrade head`, which creates the `users` and `tasks` tables.

## Run without Docker

### Backend

Run these commands in `C:\\Users\\Mathuravan\\Desktop\\Industry_Project\\TaskFlow\\backend`.

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
Copy-Item .env.example .env
python -m pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

Use a PostgreSQL database running on `localhost:5432` and update `DATABASE_URL` in `backend/.env` when its credentials differ.

### Frontend

Run these commands in `C:\\Users\\Mathuravan\\Desktop\\Industry_Project\\TaskFlow\\task1`.

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Vite prints the local URL, normally [http://localhost:5173](http://localhost:5173). `VITE_API_BASE_URL` is public browser configuration, so it must only contain the API URL, never a secret.

## Test and inspect

Run backend tests from `backend/`:

```powershell
pytest
```

The Pytest suite registers users, signs in, creates a task, checks dashboard counts, verifies cross-user access fails, completes the task, and deletes it.

Run frontend tests from `task1/`:

```powershell
npm test
```

Run frontend checks from `task1/`:

```powershell
npm run lint
npm run build
```

Swagger at `/docs` provides an interactive API client. In Postman, create an environment variable named `baseUrl` with `http://localhost:8000/api/v1`; send `POST {{baseUrl}}/auth/register`, then `POST {{baseUrl}}/auth/login`, and set the returned token as a Bearer Token before calling `/tasks`.

## Security decisions

- Passwords are stored only as Argon2 hashes via `pwdlib`.
- JWT signing keys and database credentials come from ignored `.env` files.
- Protected routes require a valid Bearer token.
- Backend ownership checks include both the requested task ID and authenticated user ID.
- Pydantic limits title, description, password, search, and email input.
- PostgreSQL enforces unique user emails, required task ownership, and cascading deletion.

## Deployment

Use a static-site platform for `task1/`, a Docker-compatible service for `backend/`, and managed PostgreSQL. Configure these production environment variables on the backend: `DATABASE_URL`, `SECRET_KEY`, `ACCESS_TOKEN_EXPIRE_MINUTES`, and `FRONTEND_ORIGINS`. Configure `VITE_API_BASE_URL` during the frontend build with the public HTTPS backend URL plus `/api/v1`.

Before production, run tests, set a new random `SECRET_KEY`, run the Alembic migration against the production database, set `FRONTEND_ORIGINS` to the deployed frontend URL, and confirm `/health` and `/docs` from the deployed backend.

