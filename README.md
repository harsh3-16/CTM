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

## 🚀 Quick Start

### Option 1: Docker (Recommended - No Database Setup Required)

```bash
# 1. Start backend + database
docker-compose up --build

# 2. In a new terminal, start frontend
cd client
npm install
npm run dev
```

**Access the app:** http://localhost:3000

✅ No `.env` file needed - everything pre-configured!

---

### Option 2: Manual Setup

**Prerequisites:** Node.js 18+, PostgreSQL database

#### Backend Setup

```bash
cd server
npm install

# Create .env file with your database credentials
# Example:
# PORT=8000
# DATABASE_URL="postgresql://user:password@localhost:5432/ctm_db"
# JWT_SECRET="your-secret-key"

# Run migrations
npx prisma generate
npx prisma migrate dev --name init

# Optional: Seed test users
npx ts-node src/seed.ts

# Start server
npm run dev
```

#### Frontend Setup

```bash
cd client
npm install
npm run dev
```

**Access the app:** http://localhost:3000

---

## 🧪 Test Credentials

After seeding, you can login with:

- **Email:** `alice@example.com`
- **Password:** `password123`

Or register a new account!

---

## 📊 What's Running?

| Service     | Port | URL                   |
| :---------- | :--- | :-------------------- |
| Frontend    | 3000 | http://localhost:3000 |
| Backend API | 8000 | http://localhost:8000 |
| PostgreSQL  | 5432 | localhost:5432        |

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
| **GET**    | `/users`         | List all users (for assignment).            | **Yes** |

## 🧪 Testing

| Command                 | Description                    |
| :---------------------- | :----------------------------- |
| `npm test`              | Run all unit tests             |
| `npm run test:watch`    | Run tests in watch mode        |
| `npm run test:coverage` | Run tests with coverage report |

**Test Coverage:**

- ✅ 23 tests passing
- Validation schemas (Auth + Task)
- Password hashing (bcrypt)
- JWT token generation/verification

## 📂 Project Structure

| Directory                | Purpose                         |
| :----------------------- | :------------------------------ |
| `client/`                | Next.js Frontend application.   |
| `server/`                | Express Backend application.    |
| `server/src/controllers` | Request handlers (Auth, Tasks). |
| `server/src/__tests__`   | Unit tests (Jest).              |
| `server/prisma`          | Database schema and migrations. |

## 🌐 Environment Variables

**Server (`server/.env`):**

```env
PORT=8000
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
JWT_SECRET="your-secret-key"
```

**Client:** Uses `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`)
