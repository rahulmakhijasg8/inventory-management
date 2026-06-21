# Inventory & Order Management System

A full-stack system for managing products, customers, orders, and inventory tracking.

## Tech Stack
- **Frontend:** React (Vite), Material UI, React Router, Axios
- **Backend:** FastAPI, SQLAlchemy, Pydantic
- **Database:** PostgreSQL
- **Containerization:** Docker + Docker Compose
- **Tooling:** uv (backend deps), npm (frontend deps)

## Features
- Product CRUD with unique SKUs and stock tracking
- Customer CRUD with unique emails
- Multi-product orders with stock validation, automatic stock reduction, and server-calculated totals
- Dashboard with summary metrics and low-stock alerts

## Live URLs
- Frontend: [your-vercel-url]
- Backend API docs: [your-railway-url]/docs
- Docker Hub image: [https://hub.docker.com/r/your-user/inventory-backend]

## Run Locally (Docker)
1. Copy `.env.example` to `.env` and fill in values.
2. `docker compose up --build`
3. Frontend → http://localhost:5173 · Backend docs → http://localhost:8000/docs

## Run Locally (dev servers)
**Backend**

cd backend
uv sync
uv run uvicorn app.main:app --reload

**Frontend**

cd frontend
npm install
npm run dev

## Environment Variables
- **Backend:** `DATABASE_URL`, `FRONTEND_URL`
- **Frontend:** `VITE_API_URL`
- **Compose/DB:** `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`

## API Overview
- `/products` — POST, GET, GET/{id}, PUT/{id}, DELETE/{id}
- `/customers` — POST, GET, GET/{id}, DELETE/{id}
- `/orders` — POST, GET, GET/{id}, DELETE/{id}
- `/dashboard/summary` — GET