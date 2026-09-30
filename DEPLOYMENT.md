# Deploying TaskFlow

This guide uses Vercel for the React frontend and Render for both the FastAPI container and managed PostgreSQL. These services fit the project because Vercel supports Vite applications and Render supports Docker-based web services plus managed PostgreSQL.

## 1. Prepare the repository

Run these commands in `C:\Users\Mathuravan\Desktop\Industry_Project\TaskFlow`.

```powershell
git add .
git commit -m "Build TaskFlow"
git branch -M main
```

Create an empty GitHub repository, add it as `origin`, then push the `main` branch. Do not commit any `.env` file.

## 2. Create the managed database

In Render, create a PostgreSQL database in the same region where the backend will run. Copy its internal connection string into the backend service's `DATABASE_URL` environment variable. SQLAlchemy needs the PostgreSQL Psycopg dialect prefix:

```text
postgresql+psycopg://USER:PASSWORD@HOST:PORT/DATABASE
```

Do not expose this value in Vercel or in the browser.

## 3. Deploy the FastAPI backend

In Render, create a **Web Service** from the GitHub repository.

- Runtime: Docker
- Dockerfile path: `backend/Dockerfile`
- Docker build context/root directory: repository root
- Health check path: `/health`
- Environment variables: `DATABASE_URL`, `SECRET_KEY`, `ACCESS_TOKEN_EXPIRE_MINUTES=480`, and `FRONTEND_ORIGINS`

Generate a new production `SECRET_KEY` locally:

```powershell
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

The container command runs `alembic upgrade head` before it starts Uvicorn. After deployment, visit `https://YOUR-BACKEND.onrender.com/health` and `https://YOUR-BACKEND.onrender.com/docs`.

## 4. Deploy the Vite frontend

In Vercel, import the GitHub repository and configure:

- Root Directory: `task1`
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://YOUR-BACKEND.onrender.com/api/v1`

Deploy the site, then copy its HTTPS URL into the Render backend's `FRONTEND_ORIGINS` value. Redeploy the backend so its CORS policy accepts only the real frontend origin.

## 5. Production smoke test

1. Register a new account in the deployed UI.
2. Create, update, complete, search, filter, and delete a task.
3. Open a private browser session, create a second user, and verify it cannot request the first user's task ID.
4. Confirm the Swagger UI authorizes a Bearer token and the health check returns `{"status":"ok"}`.

Render's free web services can spin down after inactivity, so the first request may take longer. Choose an always-on plan when response latency and availability matter.
