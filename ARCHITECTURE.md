# Architecture Decisions

Quick overview of the tech choices and design decisions for this task board app.

## 1. Technology Choices

### Why Next.js App Router?

Went with App Router because it's the newer standard - Pages Router works but feels outdated now. The file-based routing is nice, and having API routes in the same project saves setup time. Also server components are faster out of the box.

### Why PostgreSQL?

Boards and tasks are clearly relational (one board has many tasks), so SQL makes sense. Postgres is solid and free. Considered MongoDB but joins would be messy for this use case.

### Why Prisma?

Mainly for the TypeScript types - it generates them from the schema so you catch errors early. Migrations are also pretty painless compared to writing raw SQL.

### Why Tailwind?

Fast to prototype with. Dark mode is just adding `dark:` prefix which saved time. The utility classes mean less switching between files.

## 2. Data Structure

### Schema

Basic one-to-many: Board -> Tasks

- Board: id, name, description, color, timestamps
- Task: id, boardId, title, description, status (TODO/IN_PROGRESS/DONE), priority, timestamps

### Cascade Delete

When you delete a board, all its tasks get deleted too. Makes sense because tasks don't mean anything without their board. Set this up in Prisma with `onDelete: Cascade`.

### Indexes

Added indexes on boardId and status since those are the main query patterns. Probably overkill for this size but good practice.

## 3. API Design

Kept it simple REST:

```
GET/POST    /api/boards
GET/DELETE  /api/boards/[id]
GET/POST    /api/tasks (uses board_id query param)
PATCH/DELETE /api/tasks/[id]
```

Standard status codes - 200 for success, 400 for validation errors, 404 for not found, 500 for server issues.

All inputs validated on server side before hitting the database.

## 4. Frontend Organization

### Components

Split by feature:
- `components/boards/` - board-related stuff
- `components/tasks/` - task-related stuff  
- `components/ui/` - reusable things like Button, Modal, Input

### State

Using custom hooks (`useBoards`, `useTasks`) instead of Redux. For this size app, Redux would be overkill. The hooks handle fetching, optimistic updates, and error states.

### Routing

Just two main pages:
- `/` - dashboard with all boards
- `/board/[id]` - single board with its tasks

## 5. What I'd Change

### With More Time

- Add drag and drop for moving tasks between columns
- User authentication so boards are private
- Better loading states
- More test coverage

### Known Issues

- No auth - anyone can see everything
- No pagination - would be slow with lots of data
- Could use better caching

### Production Differences

Real production would need:
- Proper auth (probably NextAuth)
- Rate limiting
- Monitoring/logging
- CI/CD pipeline
- Actual tests

---

That covers the main decisions. Happy to explain any of these in more detail.
