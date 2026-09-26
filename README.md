# Lead Tracker CRM

Lead Tracker CRM is a full-stack sales pipeline app for creating, searching, listing, and updating leads in a simple ledger-style interface.

## Live Deployment URLs

- Frontend: https://frontend-pi-henna-93.vercel.app
- Backend API: https://lead-tracker-k8ha.onrender.com
- Render free-tier note: the backend may cold start and take 30–60 seconds to respond after inactivity, so the first request after idle may feel slower than usual.

## Features

- Create Lead
- Update Lead Status
- Search Leads
- List Leads

## Architecture

The project is split into a React + TypeScript frontend and a Node.js + Express backend. The frontend uses axios to call the REST API, while the backend exposes lead endpoints and persists data in PostgreSQL through Drizzle ORM on a Neon serverless database.

Text-based architecture diagram:

```text
Browser / Vercel Frontend
        |
        | REST API calls via axios
        v
Render Backend (Express + Drizzle)
        |
        | SQL queries through pg + Neon Postgres
        v
PostgreSQL (Neon)
```

## Tech Stack

### Frontend

| Layer | Technology |
| --- | --- |
| UI | React + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| HTTP client | axios |
| Theme | Custom @theme tokens: ink, paper, stone, forest, steel, brass, brick; fonts Zilla Slab + Inter |

### Backend

| Layer | Technology |
| --- | --- |
| Runtime | Node.js |
| Server | Express 5 (ESM modules) |
| ORM | Drizzle ORM |
| Database | PostgreSQL via Neon |
| Driver | pg |
| Validation | Zod |
| Testing | Jest + Supertest |

## Setup Instructions

### 1. Clone the project

```bash
git clone <repo-url>
cd lead-tracker
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create the backend environment file with the following variables:

- DATABASE_URL
- PORT
- FRONTEND_ORIGIN
- .env.test for the separate Neon test branch URL

Run Drizzle migrations manually against each environment's DATABASE_URL:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Start the backend in development mode:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create the frontend environment file with the following variable:

- VITE_API_URL

Then start the frontend:

```bash
npm run dev
```

## Running Tests

The backend uses Jest + Supertest. Run tests from the backend root:

```bash
cd backend
npm test
```

Use a separate Neon test branch for the test database, as required by the project setup. This prevents test runs from mutating the production or development database.

## Deployment Steps

### Render (backend)

Deploy the backend from the Render dashboard with these values:

- Root Directory: backend
- Build Command: npm install
- Start Command: npm start
- Environment variables:
  - DATABASE_URL
  - PORT
  - FRONTEND_ORIGIN

The backend is hosted at:

https://lead-tracker-k8ha.onrender.com

### Vercel (frontend)

Deploy the frontend from the Vercel dashboard with these values:

- Root Directory: frontend
- Environment variable:
  - VITE_API_URL = https://lead-tracker-k8ha.onrender.com

The frontend is hosted at:

https://frontend-pi-henna-93.vercel.app

## API Reference

| Method | Path | Body | Response Shape |
| --- | --- | --- | --- |
| GET | /leads | None | { status, message, data, pagination } |
| POST | /leads | { name, email, phone, status? } | { status, message, data } |
| PATCH | /leads/:id/status | { status } | { status, message, data } |

Notes:

- Query params for list/search: search, page, pageSize
- Response pagination shape: { page, size, totalPages }
- There is no total count field by design
- Search is case-insensitive and matches name and email fields only

## Trade-offs

- There is no authentication or authorization layer, so all endpoints are publicly accessible. The backend restricts browser-based access to the known frontend origin through CORS and the FRONTEND_ORIGIN environment variable, but direct calls from tools like curl or Postman are not blocked.
- The API intentionally does not return a total lead count in pagination; it only returns totalPages as a deliberate simplification.
- Search matches only the name and email fields and uses case-insensitive matching via ilike.
- Render's free tier spins down after inactivity, so the first request after a quiet period may take 30–60 seconds while the app cold starts.

## Future Improvements

- Add authentication (JWT) to protect write endpoints.
- Add rate limiting (express-rate-limit) on public endpoints.
- Return total lead count alongside totalPages for richer UI and analytics.
- Add frontend component tests using React Testing Library alongside the existing backend tests.
- Add soft-delete for leads instead of hard delete if delete is ever introduced.
- Add sorting by created_at, name, or status in addition to search.
- Automate migrations as part of the Render deploy step instead of running them manually for each environment.
