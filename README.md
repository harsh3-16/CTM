# Collaborative Task Manager (CTM)

A full-stack, real-time task management application built for the assessment.

| Feature           | Description                                                          |
| :---------------- | :------------------------------------------------------------------- |
| **Real-time**     | Live updates for task creation, edits, and deletions via Socket.io.  |
| **Auth**          | Secure JWT-based authentication with bcrypt password hashing.        |
| **Task Mgmt**     | Full CRUD capabilities with Filtering (Status/Priority) and Sorting. |
| **Notifications** | Instant in-app notifications when tasks are assigned to you.         |
| **Dashboard**     | Personal views: Assigned to Me, Created by Me, Overdue tasks.        |
| **Validation**    | Robust input validation using Zod ensures data integrity.            |

---

## 🏗️ Architecture Overview

### Backend Architecture (Service Layer Pattern)

The backend follows a clear **Controller → Service → Repository** pattern:

```
┌─────────────────────────────────────────────────────────────┐
│                        Routes                                │
│  (auth.ts, tasks.ts, users.ts)                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Controllers                               │
│  Handle HTTP requests, validation, response formatting       │
│  (authController.ts, taskController.ts)                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                     Services                                 │
│  Business logic, Socket.io events, data transformations      │
│  (AuthService, TaskService)                                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  Prisma ORM (Repository)                     │
│  Database operations, queries, transactions                  │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture

- **React Query** for server state management and caching
- **Redux Toolkit** for client state (auth, UI state)
- **Custom Hooks** for data fetching (`useTasks`, `useSocket`)
- **Component-based UI** with Tailwind CSS

### Database Choice: PostgreSQL

**Why PostgreSQL?**

- **Relational data**: Tasks have relationships (creator, assignee) - perfect for relational DB
- **ACID compliance**: Ensures data integrity for task operations
- **Prisma support**: Excellent TypeScript integration with type-safe queries
- **Scalability**: Handles complex queries for filtering/sorting efficiently

---

## 🔌 Socket.io Real-Time Integration

### How It Works

1. **Client connects** to Socket.io server on app load
2. **User joins personal room** (`user_${userId}`) for targeted notifications
3. **Server emits events** on task CRUD operations:
   - `task_created` - New task notification
   - `task_updated` - Task modification
   - `task_deleted` - Task removal
   - `notification` - Personal assignment notification

### Event Flow

```
User A assigns task to User B
        │
        ▼
┌───────────────────────────────┐
│  TaskService.updateTask()     │
│  - Updates database           │
│  - Emits 'task_updated' (all) │
│  - Emits 'notification' to    │
│    User B's room only         │
└───────────────────────────────┘
        │
        ▼
User B receives instant notification
```

### Client-Side Handling

```typescript
// useSocket hook automatically:
// 1. Invalidates React Query cache on task events
// 2. Stores notifications in local state
// 3. Shows unread count in NotificationBell
```

---

## 🛠 Tech Stack

| Layer         | Technology                                                    |
| :------------ | :------------------------------------------------------------ |
| **Frontend**  | Next.js (React), TypeScript, Tailwind CSS, React Query, Redux |
| **Backend**   | Node.js, Express, TypeScript                                  |
| **Database**  | PostgreSQL (Supabase/Render compatible)                       |
| **ORM**       | Prisma                                                        |
| **Real-time** | Socket.io                                                     |
| **Forms**     | React Hook Form + Zod validation                              |
| **DevOps**    | Docker, Docker Compose                                        |

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Start backend + database
docker-compose up --build

# In new terminal, start frontend
cd client && npm install && npm run dev
```

### Option 2: Manual Setup

**Prerequisites:** Node.js 18+, PostgreSQL

```bash
# Backend
cd server
npm install
# Configure .env (see Environment Variables section)
npx prisma generate && npx prisma migrate dev
npm run dev

# Frontend (new terminal)
cd client
npm install
npm run dev
```

**Access:** http://localhost:3000

---

## 🧪 Test Credentials

```
Email: alice@example.com
Password: password123
```

---

## 🔌 API Endpoints

| Method | Endpoint         | Description                 | Auth? |
| :----- | :--------------- | :-------------------------- | :---- |
| POST   | `/auth/register` | Register new user           | No    |
| POST   | `/auth/login`    | Login, receive JWT          | No    |
| GET    | `/auth/me`       | Get current user profile    | Yes   |
| GET    | `/tasks`         | List tasks with filters     | Yes   |
| GET    | `/tasks/:id`     | Get single task             | Yes   |
| POST   | `/tasks`         | Create task                 | Yes   |
| PUT    | `/tasks/:id`     | Update task                 | Yes   |
| DELETE | `/tasks/:id`     | Delete task                 | Yes   |
| GET    | `/users`         | List users (for assignment) | Yes   |

### Task Filter Parameters

```
GET /tasks?status=TODO&priority=HIGH&assignedToId=xxx&creatorId=xxx&overdue=true&sortBy=dueDate&sortOrder=asc
```

---

## 🧪 Testing

```bash
cd server
npm test              # Run all tests
npm run test:coverage # With coverage report
```

✅ **23+ tests** covering validation, auth, and business logic.

---

## 📂 Project Structure

```
CTM/
├── client/                 # Next.js Frontend
│   └── src/
│       ├── app/           # Pages (dashboard, login, register)
│       ├── components/    # UI components (TaskCard, NotificationBell)
│       ├── hooks/         # Custom hooks (useTasks, useSocket)
│       └── lib/           # API clients, utilities
│
├── server/                 # Express Backend
│   └── src/
│       ├── controllers/   # HTTP request handlers
│       ├── services/      # Business logic (TaskService, AuthService)
│       ├── routes/        # Route definitions
│       ├── middleware/    # Auth middleware
│       └── utils/         # Validation schemas, Prisma client
│
└── docker-compose.yml      # Docker orchestration
```

---

## 🌐 Environment Variables

**Server (`server/.env`):**

```env
PORT=8000
DATABASE_URL="postgresql://user:pass@host:5432/dbname"
JWT_SECRET="your-secret-key-min-32-chars"
```

**Client:** Uses `NEXT_PUBLIC_API_URL` (defaults to `http://localhost:8000`)

---

## 🎯 Trade-offs & Assumptions

1. **Session storage**: Using JWT in localStorage for simplicity. HttpOnly cookies would be more secure for production.
2. **Notification persistence**: Notifications are in-memory only. For production, would store in database.
3. **Real-time scaling**: Single Socket.io server. For scale, would use Redis adapter.
4. **Optimistic updates**: Not implemented to keep codebase simpler; React Query handles cache invalidation instead.
