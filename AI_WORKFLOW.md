# AI Workflow

## Tool Used

**Cursor** with Claude (Opus for planning, Sonnet for implementation).

## My AI Strategy

I treat AI as a pair programmer, not a magic solution. The key is giving clear direction with full context. My approach:

1. **Plan first** - Use AI to generate a comprehensive plan before any code
2. **Review the plan** - Check against requirements, add missing details
3. **Execute with context** - Reference the plan in prompts so AI understands the full picture
4. **Iterate quickly** - Fix issues immediately, don't let them compound

## Prompt Engineering Techniques

### Technique 1: Context-First Planning

Instead of jumping into code, I start with a detailed planning prompt:

```
"Create an implementation plan for a task board system.

Requirements:
- Dashboard showing all boards
- Board detail page with tasks in 3 columns (TODO, IN_PROGRESS, DONE)
- Full CRUD for boards and tasks
- Data persists in PostgreSQL

Tech stack: Next.js 14 App Router, Prisma, Tailwind, TypeScript strict mode

Include:
1. Database schema with indexes and relationships
2. API endpoints with request/response shapes
3. Component hierarchy
4. Error handling strategy
5. Validation rules (client + server)

Focus on: maintainable, extensible, production-ready code."
```

**Why this works:** 
- Lists exact requirements upfront
- Specifies tech stack to avoid wrong assumptions
- Asks for specific deliverables (schema, API, components)
- States quality goals (maintainable, extensible)

**Result:** Got a solid plan that covered edge cases I might have missed.

### Technique 2: Reference Existing Patterns

When generating new code, I point to existing code as a template:

```
"Create a DeleteBoardModal component.

Follow the same pattern as CreateBoardForm.tsx:
- Use Modal from components/ui/Modal
- Use Button from components/ui/Button  
- Use useTranslation hook for all text
- Handle loading and error states
- Call onSuccess callback after API completes

Props needed: isOpen, onClose, onConfirm, boardName, taskCount

Show warning that deleting will remove all tasks."
```

**Why this works:**
- References existing file so AI matches the code style
- Lists exact props to avoid guessing
- Specifies which shared components to use
- Describes the specific behavior needed

**Result:** Generated component matched the codebase style perfectly.

### Technique 3: Structured Component Requests

For UI components, I provide a clear specification:

```
"Create a StatusFilter component for filtering tasks.

Inputs:
- activeFilter: 'ALL' | 'TODO' | 'IN_PROGRESS' | 'DONE'
- onFilterChange: callback when filter changes
- taskCounts: object with count per status

UI:
- Row of pill-shaped buttons
- Active button highlighted with blue background
- Show count badge on each button
- Mobile responsive (wrap on small screens)

Use existing Button styling patterns.
Use useTranslation for labels."
```

**Why this works:**
- Defines the interface (props) explicitly
- Describes visual appearance
- Mentions responsiveness requirement
- Points to existing patterns to follow

### Technique 4: Targeted Debugging

When something breaks, I provide specific context:

```
"The color validation in CreateBoardForm isn't working.

Current behavior: Form submits even with invalid hex like 'abc'
Expected: Should show error for anything not matching #RRGGBB format

The validate function in the schema isn't being called correctly.
Show me a simpler approach using explicit validation before validateForm()."
```

**Why this works:**
- States current vs expected behavior
- Identifies where I think the problem is
- Asks for a specific solution approach

**Result:** Got a simpler fix that I could verify quickly.

## What I Used AI For

| Task | AI Usage | My Input |
|------|----------|----------|
| Project scaffolding | Generated initial structure | Reviewed and adjusted |
| Prisma schema | Generated with relationships | Added indexes, verified cascade |
| API routes | Generated CRUD endpoints | Added validation details |
| UI components | Generated boilerplate | Wired together, fixed styling |
| TypeScript types | Generated from schema | Verified correctness |
| Bug fixes | Suggested solutions | Chose best approach, implemented |

## What I Coded Manually

- Connected all the pieces together
- Fixed validation edge cases
- Tweaked responsive breakpoints
- Removed unnecessary generated code
- Final testing and polish

## Where AI Needed Correction

1. **Color validation** - Over-engineered the solution. Simplified to a direct regex check.
2. **Sort options** - Generated more than needed. Removed unused options.
3. **Some TypeScript** - Occasional type mismatches caught by linter.

## Time Breakdown

| Phase | Time | What I Did |
|-------|------|------------|
| Planning | 25 min | Generated and reviewed implementation plan |
| Database | 5 min | Schema, migrations, seed data |
| API | 25 min | All CRUD endpoints with validation |
| Dashboard | 25 min | Board list, create form, delete modal |
| Board detail | 30 min | Task columns, create/edit forms, status change |
| Polish | 10 min | Toast notifications, filters, error handling |
| **Total** | **2 hours** | |

## What I'd Add With More Time

- Drag-and-drop for moving tasks
- User authentication
- Search across boards and tasks
- Proper test coverage
- Better animations
