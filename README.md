# Task Board System

A full-stack task management application for organizing work into boards and tasks.

## Requirements

- Node.js 18 or higher
- PostgreSQL 12 or higher
- npm or yarn

## Setup

### 1. Install PostgreSQL

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Run installer, remember the password you set for `postgres` user
- Default port is 5432

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE taskboard;

# Exit
\q
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Set Up Environment Variables

```bash
cp .env.example .env
```

Update `DATABASE_URL` in `.env` with your PostgreSQL connection:
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/taskboard"
```

### 5. Run Database Migrations

```bash
npx prisma migrate dev
```

### 6. Seed the Database (Optional)

```bash
npm run db:seed
```

This adds sample boards and tasks for testing.

### 7. Run the Application

```bash
npm run dev
```

### 8. Open in Browser

http://localhost:3000

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL
- Tailwind CSS
- React 18

## Features

- Dashboard showing all boards
- Create, edit, and delete boards
- Board detail page with task columns (Todo, In Progress, Done)
- Create, edit, and delete tasks
- Change task status
- Dark/Light theme
- Mobile responsive
- Form validation
- Toast notifications

## API Endpoints

### Boards
- `GET /api/boards` - List all boards
- `POST /api/boards` - Create board
- `GET /api/boards/[id]` - Get board with tasks
- `DELETE /api/boards/[id]` - Delete board

### Tasks
- `GET /api/tasks?board_id=X` - List tasks for board
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task
