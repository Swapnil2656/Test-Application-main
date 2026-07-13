# TaskFlow

A full-stack project/task management web application built as a realistic test workload for cloud deployment and carbon footprint measurement.

## Architecture

This project is structured as a monorepo containing two fully decoupled services:

1.  **Backend (Node.js + Express + Prisma + PostgreSQL)**
    *   Acts as a standalone REST API.
    *   Handles all business logic, authentication (JWT), and database operations.
    *   **Deployment:** Designed to be deployed as an independent Node.js service across different cloud regions/providers to measure compute and carbon footprint.

2.  **Frontend (React + Vite + TailwindCSS)**
    *   A completely decoupled Single Page Application (SPA).
    *   Communicates with the backend exclusively via REST API calls.
    *   **Deployment:** Designed to be compiled to static assets (`dist` folder) and served from any static host or CDN.

## Local Development Setup

We have streamlined the local setup to ensure cross-platform compatibility and ease of use. 

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL running locally (or a remote DB connection string)

### 1. Database Setup
Ensure you have a PostgreSQL instance running on your machine. Create a database named `taskflow`, or change the connection string in the `backend/.env` file to match your database credentials.

### 2. Install and Setup
From the root of the project, run the setup script. This will automatically install dependencies for both the frontend and backend, and push the database schema using Prisma:
```bash
npm run setup
```

### 3. Start the Servers
Start both the frontend and backend development servers concurrently with a single command:
```bash
npm run dev
```

- **Frontend** will be available at: `http://localhost:5173`
- **Backend API** will be available at: `http://localhost:4000`

### 4. Database Management (Optional)
To view and manage your database data visually via Prisma Studio, run:
```bash
npm run db:studio
```

## Deployment Instructions

### Backend (Node.js API)
This is the component you will deploy across multiple cloud regions for carbon testing.
**Do not use Docker** as per the requirements.

**Example Platform: Render / Railway**
1. Connect your repository.
2. Root Directory: `backend`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm run start` (which runs `node dist/index.js`)
5. Environment Variables: Add `DATABASE_URL` and `JWT_SECRET`.

**Example Platform: AWS EC2 / VM via PM2**
1. Clone the repository on the instance.
2. Navigate to the `backend` folder.
3. Run `npm install` and `npm run build`.
4. Create your `.env` file.
5. Run migrations: `npx prisma db push`.
6. Start the app: `pm2 start dist/index.js --name taskflow-backend`.

### Frontend (Static Site)
Since the frontend is decoupled, you can deploy it to any static site hosting service (Vercel, Netlify, Cloudflare Pages, S3).
1. Root Directory: `frontend`
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Environment Variables: Set `VITE_API_URL` to the public URL of your deployed backend (e.g., `https://my-backend-region.onrender.com/api`).
