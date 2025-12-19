# 🐳 Running with Docker

## Prerequisites

- Docker Desktop installed and running
- Docker Compose installed (comes with Docker Desktop)

## Quick Start

### 1. Start the Application

```bash
# From the CTM root directory
docker-compose up --build
```

This will:

- ✅ Start PostgreSQL database (port 5432)
- ✅ Build and start the backend server (port 8000)
- ✅ Run database migrations automatically

### 2. Start the Frontend (Separate Terminal)

```bash
cd client
npm install
npm run dev
```

Frontend will be available at: **http://localhost:3000**

---

## What's Running?

| Service     | Port | URL                   |
| :---------- | :--- | :-------------------- |
| Frontend    | 3000 | http://localhost:3000 |
| Backend API | 8000 | http://localhost:8000 |
| PostgreSQL  | 5432 | localhost:5432        |

---

## Useful Commands

### Stop All Services

```bash
docker-compose down
```

### Stop and Remove Data

```bash
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Just backend
docker-compose logs -f server

# Just database
docker-compose logs -f postgres
```

### Rebuild After Code Changes

```bash
docker-compose up --build
```

### Access Database

```bash
docker-compose exec postgres psql -U user -d ctm_db
```

---

## Environment Variables

Docker uses these defaults (defined in `docker-compose.yml`):

```yaml
DATABASE_URL: postgres://user:password@postgres:5432/ctm_db
JWT_SECRET: super-secret-key-change-me
PORT: 8000
```

**For production**, change these values!

---

## Troubleshooting

### Port Already in Use

If you get "port already in use" error:

```bash
# Stop existing containers
docker-compose down

# Or change ports in docker-compose.yml
```

### Database Connection Issues

```bash
# Restart just the database
docker-compose restart postgres

# Check database logs
docker-compose logs postgres
```

### Clear Everything and Start Fresh

```bash
docker-compose down -v
docker-compose up --build
```

---

## Notes

- Frontend is **not** containerized (runs locally with `npm run dev`)
- Database data persists in Docker volume `postgres_data`
- Server auto-rebuilds on code changes (volume mounted)
