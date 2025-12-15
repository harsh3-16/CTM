# Collaborative Task Manager (CTM)

A full-stack, real-time task management application built for the [Company/Assignment Name] assessment.

| Feature        | Description                                                          |
| :------------- | :------------------------------------------------------------------- |
| **Real-time**  | Live updates for task creation, edits, and deletions via Socket.io.  |
| **Auth**       | Secure JWT-based authentication with bcrypt password hashing.        |
| **Task Mgmt**  | Full CRUD capabilities with Filtering (Status/Priority) and Sorting. |
| **Validation** | Robust input validation using Zod ensures data integrity.            |

## 🛠 Tech Stack

| Layer         | Technology                                                      |
| :------------ | :-------------------------------------------------------------- |
| **Frontend**  | Next.js (React), TypeScript, Tailwind CSS, Redux Toolkit, Axios |
| **Backend**   | Node.js, Express, TypeScript                                    |
| **Database**  | PostgreSQL (Supabase/Render compatible)                         |
| **ORM**       | Prisma                                                          |
| **Real-time** | Socket.io                                                       |
| **DevOps**    | Docker, Docker Compose                                          |

## 🚀 Quick Setup (Docker)

The easiest way to run the entire stack (DB + Backend + Frontend\*) is via Docker.

| Step          | Command                              | Description                               |
| :------------ | :----------------------------------- | :---------------------------------------- |
| **1. Env**    | `cp server/.env.example server/.env` | _Ensure environment variables are set._   |
| **2. Run**    | `docker-compose up --build`          | Starts Postgres (5432) and Server (5000). |
| **3. Client** | `cd client && npm run dev`           | Starts frontend on port 3000.             |

_> Note: Currently docker-compose manages DB & Server. Client is best run locally for dev._

## 💻 Manual Setup

If you prefer running without Docker:

| Component    | Commands                                                                | Port   |
| :----------- | :---------------------------------------------------------------------- | :----- |
| **Database** | Ensure Postgres is running locally. Update `.env` with URL.             | `5432` |
| **Backend**  | `cd server`<br>`npm install`<br>`npx prisma migrate dev`<br>`npm start` | `5000` |
| **Frontend** | `cd client`<br>`npm install`<br>`npm run dev`                           | `3000` |

## 🔌 API Endpoints

| Method     | Endpoint         | Description                                 | Auth?   |
| :--------- | :--------------- | :------------------------------------------ | :------ |
| **POST**   | `/auth/register` | Register a new user.                        | No      |
| **POST**   | `/auth/login`    | Login and receive JWT.                      | No      |
| **GET**    | `/auth/me`       | Get current user profile.                   | **Yes** |
| **GET**    | `/tasks`         | List tasks (filters: `status`, `priority`). | **Yes** |
| **POST**   | `/tasks`         | Create a new task.                          | **Yes** |
| **PUT**    | `/tasks/:id`     | Update task details/status.                 | **Yes** |
| **DELETE** | `/tasks/:id`     | Delete a task.                              | **Yes** |

## 📂 Project Structure

| Directory                | Purpose                         |
| :----------------------- | :------------------------------ |
| `client/`                | Next.js Frontend application.   |
| `server/`                | Express Backend application.    |
| `server/src/controllers` | Request handlers (Auth, Tasks). |
| `server/src/services`    | Business logic layer.           |
| `server/prisma`          | Database schema and migrations. |
