<!-- 16d8c35a-121e-4e78-8cb6-cee5816c4896 54d0d642-1846-4477-a04e-b6ac01a677e6 -->
# Task Board System Implementation Plan

## Project Structure

```
task-board/
├── app/
│   ├── api/
│   │   ├── boards/
│   │   │   ├── route.ts          # GET all, POST create
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET one, DELETE
│   │   └── tasks/
│   │       ├── route.ts          # GET by board_id, POST create
│   │       └── [id]/
│   │           └── route.ts      # PATCH update, DELETE
│   ├── board/
│   │   └── [id]/
│   │       └── page.tsx          # Board detail page
│   ├── layout.tsx
│   ├── page.tsx                   # Dashboard
│   ├── error.tsx                  # Error boundary
│   ├── loading.tsx                # Loading UI
│   └── globals.css
├── components/
│   ├── boards/
│   │   ├── BoardCard.tsx         # Individual board card
│   │   ├── BoardList.tsx         # Grid/list of boards
│   │   ├── CreateBoardForm.tsx   # Modal/form for creating board
│   │   ├── DeleteBoardModal.tsx  # Confirmation modal for board deletion
│   │   └── BoardSkeleton.tsx     # Loading skeleton for boards
│   ├── tasks/
│   │   ├── TaskCard.tsx          # Individual task card
│   │   ├── TaskColumn.tsx        # Column for each status
│   │   ├── TaskList.tsx          # List of tasks in a column
│   │   ├── CreateTaskForm.tsx    # Form for creating task
│   │   ├── EditTaskModal.tsx     # Modal for editing task
│   │   └── TaskSkeleton.tsx      # Loading skeleton for tasks
│   ├── ui/
│   │   ├── Button.tsx            # Reusable button component
│   │   ├── Modal.tsx              # Reusable modal component
│   │   ├── Input.tsx              # Reusable input component
│   │   ├── Select.tsx             # Reusable select component
│   │   ├── LoadingSpinner.tsx    # Loading spinner
│   │   ├── ErrorMessage.tsx      # Error message display
│   │   ├── Toast.tsx              # Toast notification (optional)
│   │   └── ThemeToggle.tsx       # Dark/light mode toggle button
│   ├── layout/
│   │   ├── Header.tsx             # App header with navigation
│   │   ├── Container.tsx         # Responsive container wrapper
│   │   └── ThemeProvider.tsx     # Theme context provider
│   └── filters/
│       ├── StatusFilter.tsx       # Filter buttons for task status
│       └── SortDropdown.tsx       # Sort options dropdown
├── lib/
│   ├── prisma.ts                  # Prisma client singleton
│   ├── api-client.ts              # API client with error handling
│   ├── utils.ts                   # Utility functions
│   └── i18n.ts                    # i18n configuration and utilities
├── locales/
│   ├── en/
│   │   ├── common.json            # Common translations (buttons, labels)
│   │   ├── boards.json            # Board-related translations
│   │   ├── tasks.json             # Task-related translations
│   │   ├── forms.json             # Form labels and validation messages
│   │   ├── errors.json            # Error messages
│   │   └── messages.json          # Success/info messages
│   ├── es/
│   │   ├── common.json
│   │   ├── boards.json
│   │   ├── tasks.json
│   │   ├── forms.json
│   │   ├── errors.json
│   │   └── messages.json
│   └── fr/
│       ├── common.json
│       ├── boards.json
│       ├── tasks.json
│       ├── forms.json
│       ├── errors.json
│       └── messages.json
├── types/
│   └── index.ts                   # TypeScript type definitions
├── hooks/
│   ├── useBoards.ts              # Custom hook for boards
│   ├── useTasks.ts               # Custom hook for tasks
│   ├── useToast.ts               # Toast notification hook (optional)
│   └── useTranslation.ts         # Translation hook
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env.example
├── README.md
├── AI_WORKFLOW.md
└── ARCHITECTURE.md
```

## Detailed Component Organization

### Frontend Component Hierarchy

#### Dashboard Page (`app/page.tsx`)

- **Layout**: Header + Container + Main content
- **Components Used**:
  - `Header` - Navigation and title
  - `Container` - Responsive wrapper
  - `BoardList` - Grid of board cards
  - `CreateBoardForm` - Modal for creating boards
  - `BoardSkeleton` - Loading state
  - `ErrorMessage` - Error display
- **State Management**:
  - `useState` for boards array
  - `useState` for loading state
  - `useState` for error state
  - `useState` for modal open/close
- **Data Fetching**: `useEffect` with fetch or custom `useBoards` hook

#### Board Detail Page (`app/board/[id]/page.tsx`)

- **Layout**: Header with back button + Container + Task columns
- **Components Used**:
  - `Header` - Board name and back button
  - `Container` - Responsive wrapper
  - `StatusFilter` - Filter buttons
  - `SortDropdown` - Sort options
  - `TaskColumn` (x3) - One for each status
  - `CreateTaskForm` - Modal/form for creating tasks
  - `EditTaskModal` - Modal for editing tasks
  - `TaskSkeleton` - Loading state
  - `ErrorMessage` - Error display
- **State Management**:
  - `useState` for board data
  - `useState` for tasks array
  - `useState` for filtered/sorted tasks
  - `useState` for active filter
  - `useState` for sort option
  - `useState` for loading states
  - `useState` for error states
  - `useState` for modal states
- **Data Fetching**: `useEffect` with fetch or custom `useTasks` hook

### Component Specifications

#### `components/boards/BoardCard.tsx`

- **Props**: `board: Board`, `onClick: () => void`
- **Features**: Clickable card, hover effects, board name display
- **Responsive**: Full width on mobile, fixed width on desktop
- **Loading**: None (parent handles)

#### `components/boards/BoardList.tsx`

- **Props**: `boards: Board[]`, `loading: boolean`, `error: string | null`
- **Features**: Responsive grid layout, empty state message
- **Responsive**: 
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3-4 columns
- **Loading**: Shows `BoardSkeleton` components

#### `components/boards/CreateBoardForm.tsx`

- **Props**: `isOpen: boolean`, `onClose: () => void`, `onSuccess: () => void`
- **Features**: Modal wrapper, form validation, submit handler
- **Validation**: Name required, max length check
- **Error Handling**: Display validation errors, API errors

#### `components/tasks/TaskCard.tsx`

- **Props**: `task: Task`, `onEdit: () => void`, `onDelete: () => void`, `onStatusChange: (status) => void`
- **Features**: 
  - Display task title, description (if exists)
  - Status badge
  - Edit button
  - Delete button
  - Status change buttons/dropdown
- **Responsive**: Full width in column, proper spacing

#### `components/tasks/TaskColumn.tsx`

- **Props**: `status: TaskStatus`, `tasks: Task[]`, `onTaskUpdate: () => void`
- **Features**: Column header with status name and count, droppable area
- **Responsive**: Full width on mobile, side-by-side on desktop

#### `components/ui/Modal.tsx`

- **Props**: `isOpen: boolean`, `onClose: () => void`, `title: string`, `children: ReactNode`
- **Features**: Backdrop, close button, escape key handling, focus trap
- **Responsive**: Full screen on mobile, centered modal on desktop

#### `components/ui/Button.tsx`

- **Props**: `variant: 'primary' | 'secondary' | 'danger'`, `loading?: boolean`, `disabled?: boolean`
- **Features**: Consistent styling, loading state, disabled state

## Error Handling Strategy

### API Error Handling

#### Backend API Routes

- **Validation Errors** (400):
  - Check required fields
  - Validate data types
  - Validate enum values (status)
  - Return: `{ error: string, details?: object }`
- **Not Found Errors** (404):
  - Board not found
  - Task not found
  - Return: `{ error: string }`
- **Server Errors** (500):
  - Database connection errors
  - Unexpected errors
  - Return: `{ error: 'Internal server error' }`
- **Error Response Format**:
  ```typescript
  {
    error: string;
    details?: Record<string, string>;
  }
  ```


#### Frontend Error Handling

1. **API Client Wrapper** (`lib/api-client.ts`):

   - Centralized fetch wrapper
   - Handles network errors
   - Parses error responses
   - Throws typed errors

2. **Component-Level Error Handling**:

   - Try-catch in async functions
   - Display error messages in UI
   - Retry mechanisms for failed requests
   - Fallback UI for critical errors

3. **Error Display Components**:

   - `ErrorMessage` component for inline errors
   - Toast notifications for action feedback
   - Error boundaries for React errors

4. **Error States**:

   - Network errors: "Failed to connect. Please check your internet."
   - Validation errors: Show field-specific errors
   - Not found: "Board not found" with back button
   - Server errors: "Something went wrong. Please try again."

## Form Validation Strategy

### Client-Side Validation

**Implementation Approach:**

- Real-time validation on input change
- Display error messages below fields
- Disable submit button until form is valid
- Show validation errors before submission

**Validation Rules:**

#### Create Board Form

```typescript
interface CreateBoardInput {
  name: string;
  description?: string;
  color?: string;
}

const boardValidation = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 255,
    message: 'Board name is required (1-255 characters)'
  },
  description: {
    required: false,
    maxLength: 1000,
    message: 'Description must be less than 1000 characters'
  },
  color: {
    required: false,
    pattern: /^#[0-9A-F]{6}$/i,
    message: 'Color must be a valid hex code (e.g., #FF5733)'
  }
};
```

#### Create Task Form

```typescript
interface CreateTaskInput {
  boardId: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  assignedTo?: string;
}

const taskValidation = {
  boardId: {
    required: true,
    message: 'Board ID is required'
  },
  title: {
    required: true,
    minLength: 1,
    maxLength: 255,
    message: 'Task title is required (1-255 characters)'
  },
  description: {
    required: false,
    maxLength: 2000,
    message: 'Description must be less than 2000 characters'
  },
  status: {
    required: true,
    enum: ['TODO', 'IN_PROGRESS', 'DONE'],
    message: 'Status must be TODO, IN_PROGRESS, or DONE'
  },
  priority: {
    required: false,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    message: 'Priority must be LOW, MEDIUM, or HIGH'
  },
  dueDate: {
    required: false,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    validate: (value: string) => {
      if (!value) return true;
      const date = new Date(value);
      return !isNaN(date.getTime());
    },
    message: 'Due date must be a valid date (YYYY-MM-DD)'
  },
  assignedTo: {
    required: false,
    maxLength: 255,
    message: 'Assigned to must be less than 255 characters'
  }
};
```

#### Update Task Form

```typescript
interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
  assignedTo?: string;
}

// Same validation rules as create, but all fields optional
// At least one field must be provided
```

**Reusable Validation Hook: `hooks/useFormValidation.ts`**

```typescript
export function useFormValidation<T extends Record<string, any>>(
  schema: ValidationSchema<T>
) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: keyof T, value: any): string | null => {
    const rule = schema[name];
    if (!rule) return null;

    // Required check
    if (rule.required && (!value || value.trim() === '')) {
      return rule.message || `${name} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value && !rule.required) return null;

    // Min length
    if (rule.minLength && value.length < rule.minLength) {
      return rule.message || `${name} must be at least ${rule.minLength} characters`;
    }

    // Max length
    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.message || `${name} must be less than ${rule.maxLength} characters`;
    }

    // Pattern
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || `${name} format is invalid`;
    }

    // Custom validate function
    if (rule.validate && !rule.validate(value)) {
      return rule.message || `${name} is invalid`;
    }

    // Enum check
    if (rule.enum && !rule.enum.includes(value)) {
      return rule.message || `${name} must be one of: ${rule.enum.join(', ')}`;
    }

    return null;
  };

  const validateForm = (data: T): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(schema).forEach((key) => {
      const error = validateField(key as keyof T, data[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleBlur = (name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const getFieldError = (name: keyof T): string | undefined => {
    return touched[name] ? errors[name] : undefined;
  };

  return {
    errors,
    touched,
    validateField,
    validateForm,
    handleBlur,
    getFieldError,
    setErrors
  };
}
```

**Reusable FormField Component: `components/ui/FormField.tsx`**

```typescript
interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'textarea' | 'select' | 'date';
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  required,
  placeholder,
  options
}: FormFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`w-full px-3 py-2 border rounded-md ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select {label}</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border rounded-md ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
      )}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
```

### Server-Side Validation

**API Route Validation:**

#### Create Board API (`app/api/boards/route.ts`)

```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, color } = body;

    // Validation
    const errors: Record<string, string> = {};

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      errors.name = 'Board name is required';
    } else if (name.length > 255) {
      errors.name = 'Board name must be less than 255 characters';
    }

    if (description && description.length > 1000) {
      errors.description = 'Description must be less than 1000 characters';
    }

    if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
      errors.color = 'Color must be a valid hex code';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Create board
    const board = await prisma.board.create({
      data: { name: name.trim(), description, color }
    });

    return NextResponse.json(board, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### Create Task API (`app/api/tasks/route.ts`)

```typescript
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { boardId, title, description, status, priority, dueDate, assignedTo } = body;

    // Validation
    const errors: Record<string, string> = {};

    if (!boardId || typeof boardId !== 'string') {
      errors.boardId = 'Board ID is required';
    } else {
      // Verify board exists
      const board = await prisma.board.findUnique({ where: { id: boardId } });
      if (!board) {
        errors.boardId = 'Board not found';
      }
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.title = 'Task title is required';
    } else if (title.length > 255) {
      errors.title = 'Task title must be less than 255 characters';
    }

    if (description && description.length > 2000) {
      errors.description = 'Description must be less than 2000 characters';
    }

    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
    if (status && !validStatuses.includes(status)) {
      errors.status = `Status must be one of: ${validStatuses.join(', ')}`;
    }

    const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
    if (priority && !validPriorities.includes(priority)) {
      errors.priority = `Priority must be one of: ${validPriorities.join(', ')}`;
    }

    if (dueDate) {
      const date = new Date(dueDate);
      if (isNaN(date.getTime())) {
        errors.dueDate = 'Due date must be a valid date';
      }
    }

    if (assignedTo && assignedTo.length > 255) {
      errors.assignedTo = 'Assigned to must be less than 255 characters';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        boardId,
        title: title.trim(),
        description,
        status: status || 'TODO',
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedTo
      }
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### Update Task API (`app/api/tasks/[id]/route.ts`)

```typescript
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, status, priority, dueDate, assignedTo } = body;

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id }
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Validation
    const errors: Record<string, string> = {};
    const updates: any = {};

    if (title !== undefined) {
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        errors.title = 'Task title is required';
      } else if (title.length > 255) {
        errors.title = 'Task title must be less than 255 characters';
      } else {
        updates.title = title.trim();
      }
    }

    if (description !== undefined) {
      if (description && description.length > 2000) {
        errors.description = 'Description must be less than 2000 characters';
      } else {
        updates.description = description || null;
      }
    }

    if (status !== undefined) {
      const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
      if (!validStatuses.includes(status)) {
        errors.status = `Status must be one of: ${validStatuses.join(', ')}`;
      } else {
        updates.status = status;
      }
    }

    if (priority !== undefined) {
      const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
      if (priority && !validPriorities.includes(priority)) {
        errors.priority = `Priority must be one of: ${validPriorities.join(', ')}`;
      } else {
        updates.priority = priority || null;
      }
    }

    if (dueDate !== undefined) {
      if (dueDate) {
        const date = new Date(dueDate);
        if (isNaN(date.getTime())) {
          errors.dueDate = 'Due date must be a valid date';
        } else {
          updates.dueDate = date;
        }
      } else {
        updates.dueDate = null;
      }
    }

    if (assignedTo !== undefined) {
      if (assignedTo && assignedTo.length > 255) {
        errors.assignedTo = 'Assigned to must be less than 255 characters';
      } else {
        updates.assignedTo = assignedTo || null;
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Check if at least one field is being updated
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Update task
    const task = await prisma.task.update({
      where: { id: params.id },
      data: updates
    });

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Validation Error Display

**Frontend Error Handling:**

- Display field-specific errors below each input
- Show general form errors at the top
- Highlight invalid fields with red border
- Disable submit button when form is invalid
- Show server validation errors after submission

## Board Deletion Confirmation Modal

### Component: `components/boards/DeleteBoardModal.tsx`

**Purpose:** Warn user that deleting a board will delete all tasks, require explicit confirmation.

**Props:**

```typescript
interface DeleteBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  boardName: string;
  taskCount: number; // Number of tasks in the board
}
```

**Implementation:**

```typescript
export function DeleteBoardModal({
  isOpen,
  onClose,
  onConfirm,
  boardName,
  taskCount
}: DeleteBoardModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // Error handling
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Board">
      <div className="p-6">
        <div className="mb-4">
          <p className="text-lg font-semibold mb-2">
            Are you sure you want to delete "{boardName}"?
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 mb-4">
            <p className="text-red-800 dark:text-red-200 font-medium mb-1">
              ⚠️ Warning: This action cannot be undone!
            </p>
            <p className="text-red-700 dark:text-red-300 text-sm">
              All {taskCount} task{taskCount !== 1 ? 's' : ''} in this board will be permanently deleted.
            </p>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            This will permanently delete the board and all its tasks. This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            loading={isDeleting}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Board'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
```

**Usage in BoardCard or BoardList:**

```typescript
const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [boardToDelete, setBoardToDelete] = useState<Board | null>(null);

const handleDeleteClick = (board: Board) => {
  // Fetch task count for the board
  fetch(`/api/boards/${board.id}`)
    .then(r => r.json())
    .then(data => {
      setBoardToDelete({ ...board, taskCount: data.tasks?.length || 0 });
      setDeleteModalOpen(true);
    });
};

const handleDeleteConfirm = async () => {
  if (!boardToDelete) return;
  
  try {
    await fetch(`/api/boards/${boardToDelete.id}`, { method: 'DELETE' });
    // Remove from UI or refetch
    onBoardDeleted?.(boardToDelete.id);
    setDeleteModalOpen(false);
    setBoardToDelete(null);
  } catch (error) {
    // Handle error
  }
};

// In render:
<DeleteBoardModal
  isOpen={deleteModalOpen}
  onClose={() => {
    setDeleteModalOpen(false);
    setBoardToDelete(null);
  }}
  onConfirm={handleDeleteConfirm}
  boardName={boardToDelete?.name || ''}
  taskCount={boardToDelete?.taskCount || 0}
/>
```

## Loading State Management

### Loading States Strategy

1. **Page-Level Loading**:

   - `app/loading.tsx` - Next.js loading UI
   - Shows skeleton or spinner during initial page load

2. **Component-Level Loading**:

   - **Boards**: `BoardSkeleton` - Card-shaped skeletons
   - **Tasks**: `TaskSkeleton` - List item skeletons
   - **Buttons**: Spinner inside button during action

3. **Optimistic Updates**:

   - Update UI immediately on user action
   - Revert on error
   - Show loading indicator during API call

4. **Loading Indicators**:

   - Skeleton loaders for lists
   - Spinner for buttons/actions
   - Progress bar for long operations (optional)

### Loading Component Specifications

#### `components/ui/LoadingSpinner.tsx`

- **Props**: `size?: 'sm' | 'md' | 'lg'`
- **Usage**: Buttons, inline loading states

#### `components/boards/BoardSkeleton.tsx`

- **Props**: `count?: number`
- **Features**: Card-shaped skeleton matching BoardCard layout

#### `components/tasks/TaskSkeleton.tsx`

- **Props**: `count?: number`
- **Features**: List item skeleton matching TaskCard layout

## Mobile Responsive Design

### Breakpoint Strategy (Tailwind)

- **Mobile**: Default (< 640px)
- **Tablet**: `sm:` (640px+)
- **Desktop**: `md:` (768px+)
- **Large Desktop**: `lg:` (1024px+)

### Responsive Layouts

#### Dashboard Page

- **Mobile**:
  - Single column board grid
  - Full-width cards
  - Stacked header elements
  - Full-screen modals
- **Tablet**:
  - 2-column board grid
  - Side-by-side header elements
- **Desktop**:
  - 3-4 column board grid
  - Spacious layout

#### Board Detail Page

- **Mobile**:
  - Stacked task columns (vertical)
  - Full-width task cards
  - Bottom sheet for modals
  - Horizontal scroll for filters (if needed)
- **Tablet**:
  - 2 columns for task status
  - Side-by-side filters
- **Desktop**:
  - 3 columns side-by-side (todo, in_progress, done)
  - Fixed column widths
  - Hover effects

### Touch-Friendly Design

- Minimum touch target: 44x44px
- Adequate spacing between interactive elements
- Swipe gestures for mobile (optional)
- Large, readable fonts

### Responsive Components

#### `components/layout/Container.tsx`

- **Props**: `children: ReactNode`, `maxWidth?: 'sm' | 'md' | 'lg' | 'xl'`
- **Features**: Responsive padding, max-width constraints

#### Modal Responsive Behavior

- Mobile: Full screen with close button
- Desktop: Centered modal with backdrop

## Database Design - Optimized, Scalable & Extensible

### Prisma Schema Design

```prisma
model Board {
  id          String   @id @default(cuid()) // Using cuid() for better scalability than auto-increment
  name        String   @db.VarChar(255)
  description String?  @db.Text
  color       String?  @db.VarChar(7) // Hex color code
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  tasks       Task[]
  
  @@index([createdAt]) // Index for sorting by creation date
  @@index([updatedAt]) // Index for sorting by last update
  @@map("boards")
}

model Task {
  id          String   @id @default(cuid())
  boardId     String   @map("board_id")
  title       String   @db.VarChar(255)
  description String?  @db.Text
  status      TaskStatus @default(TODO)
  priority    TaskPriority? @default(MEDIUM)
  assignedTo  String?  @map("assigned_to") @db.VarChar(255) // Future: foreign key to User
  dueDate     DateTime? @map("due_date") @db.Date
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  
  board       Board    @relation(fields: [boardId], references: [id], onDelete: Cascade)
  
  @@index([boardId]) // Critical for querying tasks by board
  @@index([status]) // Critical for filtering by status
  @@index([boardId, status]) // Composite index for common query pattern
  @@index([dueDate]) // For sorting by due date
  @@index([priority]) // For sorting by priority
  @@index([createdAt]) // For sorting by creation date
  @@map("tasks")
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
  
  @@map("task_status")
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  
  @@map("task_priority")
}
```

### Database Design Decisions

#### 1. Primary Keys

- **Choice**: `cuid()` instead of auto-increment integers
- **Reasons**: 
  - Better for distributed systems and horizontal scaling
  - Non-sequential (security benefit, prevents enumeration attacks)
  - Works seamlessly with Prisma
  - Scalable across multiple database instances
  - URL-safe and sortable

#### 2. Strategic Indexes for Performance

- **Board indexes**:
  - `createdAt`: For sorting boards chronologically (common query)
  - `updatedAt`: For showing recently updated boards
- **Task indexes**:
  - `boardId`: Critical for JOIN operations (most common query - get tasks by board)
  - `status`: Critical for filtering tasks by status
  - `(boardId, status)`: Composite index for the most common query pattern (tasks by board AND status) - dramatically improves performance
  - `dueDate`: For sorting and filtering by due date
  - `priority`: For sorting by priority
  - `createdAt`: For sorting by creation date

**Index Strategy Rationale**:

- Composite index `(boardId, status)` covers queries like: "Get all IN_PROGRESS tasks for board X"
- Single-column indexes support filtering and sorting operations
- Indexes are balanced - not too many (write performance) but cover all common queries

#### 3. Data Types & Constraints

- **VARCHAR lengths**: Appropriate limits (255 for names, TEXT for descriptions)
- **Nullable fields**: Properly marked for optional data (description, assignedTo, dueDate, priority)
- **Enums**: Used for status and priority (type safety, validation, performance, database-level constraint)
- **Dates**: Separate `createdAt` and `updatedAt` for audit trail and sorting
- **Date vs DateTime**: `dueDate` uses `@db.Date` (date only), timestamps use `DateTime`

#### 4. Relationships & Cascading

**Decision: Cascade Delete**

When a Board is deleted, all its Tasks are automatically deleted (CASCADE DELETE).

**Implementation**:

```prisma
board Board @relation(fields: [boardId], references: [id], onDelete: Cascade)
```

**Rationale for Cascade Delete**:

1. **Data Integrity**: Tasks are meaningless without their board context - they belong to a specific board
2. **Prevents Orphaned Data**: Without cascade delete, tasks would be left with invalid `boardId` references
3. **User Experience**: Simpler UX - when a user deletes a board, they expect all related tasks to be removed
4. **Business Logic**: In a task board system, tasks are tightly coupled to their board - they don't make sense independently
5. **Database Cleanliness**: Keeps the database clean without orphaned records

**Alternative Considered (Prevent Deletion)**:

- Could prevent deletion if board has tasks
- **Rejected because**: 
  - Poor UX (user has to manually delete all tasks first)
  - Tasks are board-specific and have no value without the board
  - More complex error handling needed

**Other Relationship Details**:

- **Foreign Key**: `boardId` with proper relation ensures referential integrity
- **Referential Integrity**: Enforced at database level (not just application level)
- **Relation naming**: Clear and consistent (`board` relation name)

#### 5. Scalability Considerations

**Current Design Handles**:

- Thousands of boards per user (if users added later)
- Thousands of tasks per board (with proper indexes, queries remain fast)
- Fast queries with proper indexes (sub-100ms for common queries)
- Efficient filtering and sorting (indexed columns)
- Concurrent access (PostgreSQL handles this well)

**Future Extensibility** (Easy to add without breaking changes):

- **User System**: 
  - Add `userId` to Board model
  - Convert `assignedTo` to FK: `assignedToId` → User
- **Teams/Organizations**: 
  - Add `teamId` or `organizationId` to Board
  - Many-to-many relationship if boards can belong to multiple teams
- **Task Comments**: 
  - New `Comment` model with `taskId` FK
  - Index on `taskId` for fast retrieval
- **Task Attachments**: 
  - New `Attachment` model with `taskId` FK
  - Store file metadata, actual files in S3/storage
- **Task History/Audit Log**: 
  - New `TaskHistory` model tracking all changes
  - Fields: `taskId`, `field`, `oldValue`, `newValue`, `changedBy`, `changedAt`
- **Tags/Labels**: 
  - New `Tag` model
  - Many-to-many relationship with Task (`TaskTag` junction table)
- **Task Dependencies**: 
  - New `TaskDependency` model: `taskId`, `dependsOnTaskId`
  - Self-referential relationship
- **Board Templates**: 
  - Add `templateId` to Board (nullable)
  - New `BoardTemplate` model
- **Archived Boards**: 
  - Add `archivedAt` timestamp (soft delete)
  - Index on `archivedAt` for filtering active boards
- **Task Subtasks**: 
  - Add `parentTaskId` to Task (nullable, self-referential)
  - Index on `parentTaskId` for querying subtasks

#### 6. Query Optimization Strategies

**Common Query Patterns & Their Optimization**:

1. **Get all boards (sorted by creation)**:
   ```prisma
   prisma.board.findMany({ orderBy: { createdAt: 'desc' } })
   ```


   - Uses `createdAt` index
   - Fast even with thousands of boards

2. **Get board with all tasks**:
   ```prisma
   prisma.board.findUnique({ 
     where: { id }, 
     include: { tasks: true } 
   })
   ```


   - Uses `boardId` index on tasks
   - Single query with JOIN (efficient)

3. **Get tasks by board and status** (most common):
   ```prisma
   prisma.task.findMany({ 
     where: { boardId, status: 'IN_PROGRESS' } 
   })
   ```


   - Uses composite index `(boardId, status)` - optimal performance
   - This is the most optimized query pattern

4. **Sort tasks by priority**:
   ```prisma
   prisma.task.findMany({ 
     where: { boardId }, 
     orderBy: { priority: 'desc' } 
   })
   ```


   - Uses `priority` index
   - Fast sorting even with many tasks

5. **Filter tasks by due date**:
   ```prisma
   prisma.task.findMany({ 
     where: { 
       boardId, 
       dueDate: { lte: new Date() } 
     } 
   })
   ```


   - Uses `dueDate` index
   - Efficient date range queries

**N+1 Query Prevention**:

- Always use Prisma's `include` to fetch related data in single query
- Example: `prisma.board.findUnique({ where: { id }, include: { tasks: true } })`
- Avoid: Fetching board, then separately fetching tasks (2 queries)

**Pagination Strategy** (for future scaling):

- Use `skip` and `take` for pagination
- Index on `createdAt` supports efficient pagination
- Consider cursor-based pagination for very large datasets

#### 7. Data Integrity & Validation

**Database-Level Constraints**:

- Foreign key constraints ensure data integrity (can't create task with invalid boardId)
- Enum constraints ensure valid status/priority values (database enforces this)
- NOT NULL constraints on required fields (name, title, status, boardId)
- Cascade delete prevents orphaned tasks
- Unique constraints can be added if needed (e.g., unique board names per user)

**Application-Level Validation** (in addition to DB):

- Name length validation (1-255 characters)
- Title length validation (1-255 characters)
- Status enum validation (client-side for UX, server-side for security)
- Priority enum validation
- Date validation (dueDate must be valid date, can be future or past)
- Business rules (e.g., can't delete board with active tasks - if needed)

#### 8. Migration Strategy

**Initial Migration**:

- Create tables with all indexes from the start
- Set up enums
- Add foreign key constraints
- This ensures optimal performance from day one

**Future Migrations** (Non-breaking):

- Add new optional columns (backward compatible, existing data works)
- Add new indexes (performance improvement, no breaking changes)
- Extend enums (add new values, existing values remain valid)
- Add new tables (no impact on existing schema)

**Migration Best Practices**:

- Always test migrations on staging first
- Use transactions for data migrations
- Add indexes in separate migration if adding to large existing table
- Document breaking changes (though we'll avoid them)

### Database Connection & Performance

**Prisma Client Configuration**:

- Connection pooling for optimal performance (handles concurrent requests)
- Query optimization with proper indexes (Prisma uses indexes automatically)
- Prepared statements for security and performance
- Connection limit configuration based on expected load

**Connection String Example**:

```
DATABASE_URL="postgresql://user:password@localhost:5432/taskboard?connection_limit=10&pool_timeout=20"
```

**Performance Expectations**:

- Get all boards: < 50ms (with index on createdAt)
- Get board with tasks: < 100ms (with proper indexes)
- Create/Update/Delete: < 50ms (simple operations)
- Filter tasks by status: < 50ms (with composite index)

### Database Seeding (Optional)

Create seed script for development/testing:

- Sample boards with different names/colors
- Sample tasks in different statuses
- Useful for testing and development

## Implementation Steps

### Phase 1: Project Setup & Database

1. Initialize Next.js 14 project with TypeScript and App Router
2. Install dependencies: Prisma, PostgreSQL client, Tailwind CSS
3. Configure Tailwind with responsive breakpoints
4. Create optimized Prisma schema with all indexes and constraints
5. Set up PostgreSQL database connection with connection pooling
6. Run initial migration with all indexes from the start
7. Create Prisma client singleton with proper configuration
8. Generate TypeScript types from Prisma schema
9. Create database seed script (optional, for testing)
10. Test database queries and verify index usage

1. Initialize Next.js 14 project with TypeScript and App Router
2. Install dependencies: Prisma, PostgreSQL client, Tailwind CSS
3. Configure Tailwind with responsive breakpoints
4. Configure Prisma schema with Board and Task models
5. Set up database connection and migrations
6. Create Prisma client singleton
7. Create TypeScript types from Prisma schema

## Board Deletion Implementation

### Decision: Cascade Delete

**When a Board is deleted, all its Tasks are automatically deleted.**

### Implementation Approach

#### 1. Database Level (Prisma Schema)

```prisma
model Task {
  // ... other fields
  board   Board    @relation(fields: [boardId], references: [id], onDelete: Cascade)
  //                                                                  ^^^^^^^^^^^^^^
  //                                                                  This enables cascade delete
}
```

**What this does:**

- PostgreSQL automatically deletes all Tasks when their parent Board is deleted
- Happens at database level - atomic and reliable
- No application code needed for the cascade behavior

#### 2. API Route Implementation

**File: `app/api/boards/[id]/route.ts`**

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if board exists first
    const board = await prisma.board.findUnique({
      where: { id: params.id },
      include: { tasks: true } // Optional: get task count for response
    });

    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }

    // Delete board - tasks are automatically deleted due to onDelete: Cascade
    await prisma.board.delete({
      where: { id: params.id }
    });

    // Return success response
    return NextResponse.json(
      { 
        message: 'Board and all associated tasks deleted successfully',
        deletedTasksCount: board.tasks.length 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting board:', error);
    
    // Handle Prisma errors
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Key Points:**

- The `onDelete: Cascade` in Prisma schema handles task deletion automatically
- No need to manually delete tasks before deleting the board
- The deletion is atomic (all or nothing)
- Can optionally include task count in response for user feedback

#### 3. Frontend Implementation

**File: `components/boards/BoardCard.tsx` or similar**

```typescript
const handleDeleteBoard = async (boardId: string) => {
  // Optional: Show confirmation dialog
  const confirmed = window.confirm(
    'Are you sure you want to delete this board? All tasks will be deleted.'
  );
  
  if (!confirmed) return;

  try {
    const response = await fetch(`/api/boards/${boardId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete board');
    }

    // Optimistically remove from UI or refetch boards
    onBoardDeleted?.(boardId);
    
    // Show success message
    toast.success('Board and all tasks deleted successfully');
  } catch (error) {
    toast.error(error.message || 'Failed to delete board');
  }
};
```

### Alternative: Prevent Deletion Approach

If you wanted to **prevent deletion** when tasks exist, here's how:

#### Option A: Application-Level Check

**Prisma Schema:**

```prisma
model Task {
  board   Board    @relation(fields: [boardId], references: [id], onDelete: Restrict)
  //                                                                  ^^^^^^^^^^^^^^^
  //                                                                  Prevents deletion if tasks exist
}
```

**API Route:**

```typescript
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if board has tasks
    const board = await prisma.board.findUnique({
      where: { id: params.id },
      include: { tasks: true }
    });

    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }

    // Prevent deletion if tasks exist
    if (board.tasks.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete board with existing tasks',
          taskCount: board.tasks.length,
          message: `Please delete all ${board.tasks.length} task(s) before deleting this board.`
        },
        { status: 400 }
      );
    }

    // Safe to delete - no tasks exist
    await prisma.board.delete({
      where: { id: params.id }
    });

    return NextResponse.json(
      { message: 'Board deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    // Handle Restrict constraint violation
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Cannot delete board with existing tasks' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### Option B: Database-Level Only (Restrict)

**Prisma Schema:**

```prisma
model Task {
  board   Board    @relation(fields: [boardId], references: [id], onDelete: Restrict)
}
```

**API Route (simpler - database handles it):**

```typescript
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.board.delete({
      where: { id: params.id }
    });

    return NextResponse.json(
      { message: 'Board deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    // Database will throw error if tasks exist
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Cannot delete board with existing tasks. Please delete all tasks first.' },
        { status: 400 }
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Comparison

| Approach | Pros | Cons | Use Case |

|----------|------|------|----------|

| **Cascade Delete** | Simple, clean UX, prevents orphaned data | No recovery option, deletes all tasks | Tasks are meaningless without board |

| **Prevent Deletion** | Protects data, forces intentional deletion | Poor UX, requires manual cleanup | Tasks have independent value |

### Our Choice: Cascade Delete

**Rationale:**

- Tasks are tightly coupled to their board
- Better user experience (one action)
- Prevents orphaned data
- Simpler implementation
- Matches user expectations

### Phase 2: API Routes with Error Handling

1. Create API client wrapper with error handling
2. Create `/api/boards` route (GET all, POST create) with validation
3. Create `/api/boards/[id]` route (GET one, DELETE) with cascade delete implementation
4. Create `/api/tasks` route (GET by board_id, POST create) with validation
5. Create `/api/tasks/[id]` route (PATCH update, DELETE) with error handling
6. Test all endpoints with error cases, including board deletion with tasks

### Phase 3: UI Components & Layout

1. Create base UI components (Button, Input, Modal, Select)
2. Create LoadingSpinner and skeleton components
3. Create ErrorMessage component
4. Create Header and Container layout components
5. Ensure all components are mobile-responsive

### Phase 4: Dashboard Page

1. Create dashboard page with responsive layout
2. Build BoardList component with loading and error states
3. Build BoardCard component (mobile-responsive)
4. Build CreateBoardForm with validation and error handling
5. Implement board creation with optimistic updates
6. Add loading skeletons and error messages

## Board Detail Page - Required Features Implementation

### Required Features Checklist

1. ✅ **Create a new task in this board**
2. ✅ **See all tasks for this board**
3. ✅ **Change a task's status (todo → in_progress → done)**
4. ✅ **Edit a task's title**
5. ✅ **Delete a task**
6. ✅ **Changes appear immediately (no page refresh needed)**

### Feature Implementation Details

#### 1. Create a New Task in This Board

**Component: `components/tasks/CreateTaskForm.tsx`**

```typescript
// Features:
// - Modal/form for creating task
// - Required fields: title, boardId
// - Optional fields: description, priority, dueDate
// - Status defaults to TODO
// - Optimistic update on submit
```

**Implementation Flow:**

1. User clicks "Create Task" button
2. Modal opens with form
3. User fills in task details
4. On submit:

   - Optimistically add task to UI (immediate feedback)
   - POST to `/api/tasks`
   - On success: task already in UI
   - On error: remove optimistic task, show error

**API Call:**

```typescript
POST /api/tasks
Body: { boardId, title, description?, status, priority?, dueDate? }
Response: { id, title, status, ... }
```

#### 2. See All Tasks for This Board

**Component: `app/board/[id]/page.tsx`**

**Implementation:**

- Fetch board with tasks on page load
- Display tasks in three columns by status (TODO, IN_PROGRESS, DONE)
- Each column shows `TaskColumn` component
- Tasks displayed as `TaskCard` components

**Data Fetching:**

```typescript
// Option 1: Fetch board with tasks in one query
const board = await fetch(`/api/boards/${id}`).then(r => r.json());
// Returns: { id, name, tasks: [...] }

// Option 2: Fetch separately
const board = await fetch(`/api/boards/${id}`).then(r => r.json());
const tasks = await fetch(`/api/tasks?board_id=${id}`).then(r => r.json());
```

**Display Logic:**

```typescript
// Group tasks by status
const tasksByStatus = {
  TODO: tasks.filter(t => t.status === 'TODO'),
  IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
  DONE: tasks.filter(t => t.status === 'DONE')
};

// Render columns
<TaskColumn status="TODO" tasks={tasksByStatus.TODO} />
<TaskColumn status="IN_PROGRESS" tasks={tasksByStatus.IN_PROGRESS} />
<TaskColumn status="DONE" tasks={tasksByStatus.DONE} />
```

#### 3. Change a Task's Status (todo → in_progress → done)

**Component: `components/tasks/TaskCard.tsx`**

**Implementation Options:**

**Option A: Status Buttons**

```typescript
// Three buttons: TODO, IN_PROGRESS, DONE
// Current status is highlighted/disabled
<button onClick={() => updateStatus('TODO')}>Todo</button>
<button onClick={() => updateStatus('IN_PROGRESS')}>In Progress</button>
<button onClick={() => updateStatus('DONE')}>Done</button>
```

**Option B: Dropdown Select**

```typescript
<select value={task.status} onChange={(e) => updateStatus(e.target.value)}>
  <option value="TODO">Todo</option>
  <option value="IN_PROGRESS">In Progress</option>
  <option value="DONE">Done</option>
</select>
```

**Option C: Drag and Drop (Advanced)**

- Drag task card between columns
- Update status on drop

**Optimistic Update Flow:**

```typescript
const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
  // 1. Optimistically update UI
  setTasks(prevTasks => 
    prevTasks.map(task => 
      task.id === taskId 
        ? { ...task, status: newStatus }
        : task
    )
  );

  // 2. Move task to correct column visually
  // (Task automatically moves to new column)

  try {
    // 3. Update on server
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });

    // 4. Success - UI already updated
  } catch (error) {
    // 5. Revert on error
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { ...task, status: task.status } // Revert to original
          : task
      )
    );
    showError('Failed to update task status');
  }
};
```

**API Call:**

```typescript
PATCH /api/tasks/[id]
Body: { status: 'IN_PROGRESS' }
Response: { id, status, ... }
```

#### 4. Edit a Task's Title

**Component: `components/tasks/EditTaskModal.tsx` or Inline Edit**

**Implementation Options:**

**Option A: Modal Edit**

```typescript
// Click edit button → Open modal with form
// User edits title → Submit → Optimistic update
```

**Option B: Inline Edit**

```typescript
// Click title → Becomes editable input
// On blur or Enter → Save → Optimistic update
```

**Optimistic Update:**

```typescript
const updateTaskTitle = async (taskId: string, newTitle: string) => {
  // 1. Optimistically update
  setTasks(prevTasks =>
    prevTasks.map(task =>
      task.id === taskId
        ? { ...task, title: newTitle }
        : task
    )
  );

  try {
    // 2. Update on server
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle })
    });
  } catch (error) {
    // 3. Revert on error
    // ... revert logic
    showError('Failed to update task title');
  }
};
```

**API Call:**

```typescript
PATCH /api/tasks/[id]
Body: { title: 'New Title' }
Response: { id, title, ... }
```

#### 5. Delete a Task

**Component: `components/tasks/TaskCard.tsx`**

**Implementation:**

```typescript
const deleteTask = async (taskId: string) => {
  // Optional: Confirmation dialog
  if (!confirm('Are you sure you want to delete this task?')) {
    return;
  }

  // 1. Optimistically remove from UI
  setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

  try {
    // 2. Delete on server
    await fetch(`/api/tasks/${taskId}`, {
      method: 'DELETE'
    });

    // 3. Success - already removed from UI
    showSuccess('Task deleted');
  } catch (error) {
    // 4. Revert on error - re-add task
    // Need to refetch or restore from backup
    refetchTasks();
    showError('Failed to delete task');
  }
};
```

**API Call:**

```typescript
DELETE /api/tasks/[id]
Response: 200 OK
```

#### 6. Changes Appear Immediately (No Page Refresh)

**Implementation Strategy: Optimistic Updates**

**Core Pattern:**

1. Update UI immediately (optimistic)
2. Make API call in background
3. On success: UI already updated
4. On error: Revert UI changes, show error

**State Management:**

```typescript
// In board detail page component
const [tasks, setTasks] = useState<Task[]>([]);
const [isLoading, setIsLoading] = useState(true);

// Fetch tasks on mount
useEffect(() => {
  fetchTasks(boardId).then(setTasks).finally(() => setIsLoading(false));
}, [boardId]);

// Optimistic update helper
const optimisticUpdate = (updater: (tasks: Task[]) => Task[]) => {
  setTasks(prevTasks => {
    const updated = updater([...prevTasks]);
    return updated;
  });
};

// Example: Create task
const createTask = async (taskData: CreateTaskInput) => {
  // Generate temporary ID
  const tempId = `temp-${Date.now()}`;
  const optimisticTask = { ...taskData, id: tempId, status: 'TODO' };

  // Add optimistically
  optimisticUpdate(tasks => [...tasks, optimisticTask]);

  try {
    const newTask = await api.post('/api/tasks', taskData);
    // Replace temp task with real one
    optimisticUpdate(tasks =>
      tasks.map(t => t.id === tempId ? newTask : t)
    );
  } catch (error) {
    // Remove optimistic task
    optimisticUpdate(tasks => tasks.filter(t => t.id !== tempId));
    throw error;
  }
};
```

**Custom Hook: `hooks/useTasks.ts`**

```typescript
export function useTasks(boardId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetch(`/api/tasks?board_id=${boardId}`).then(r => r.json());
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  // Create task with optimistic update
  const createTask = useCallback(async (taskData: CreateTaskInput) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticTask = { ...taskData, id: tempId };
    
    setTasks(prev => [...prev, optimisticTask]);
    
    try {
      const newTask = await api.post('/api/tasks', taskData);
      setTasks(prev => prev.map(t => t.id === tempId ? newTask : t));
      return newTask;
    } catch (err) {
      setTasks(prev => prev.filter(t => t.id !== tempId));
      throw err;
    }
  }, []);

  // Update task with optimistic update
  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    const originalTask = tasks.find(t => t.id === taskId);
    if (!originalTask) return;

    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, ...updates } : t
    ));

    try {
      const updated = await api.patch(`/api/tasks/${taskId}`, updates);
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    } catch (err) {
      setTasks(prev => prev.map(t => t.id === taskId ? originalTask : t));
      throw err;
    }
  }, [tasks]);

  // Delete task with optimistic update
  const deleteTask = useCallback(async (taskId: string) => {
    const originalTasks = [...tasks];
    setTasks(prev => prev.filter(t => t.id !== taskId));

    try {
      await api.delete(`/api/tasks/${taskId}`);
    } catch (err) {
      setTasks(originalTasks);
      throw err;
    }
  }, [tasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks
  };
}
```

**Usage in Component:**

```typescript
const { tasks, createTask, updateTask, deleteTask } = useTasks(boardId);

// All operations update UI immediately
await createTask({ title: 'New Task', boardId });
await updateTask(taskId, { status: 'IN_PROGRESS' });
await deleteTask(taskId);
```

### Phase 5: Board Detail Page

1. Create board detail page with responsive layout
2. Implement `useTasks` hook with optimistic updates
3. Build TaskColumn components (stacked on mobile, side-by-side on desktop)
4. Build TaskCard component with status change, edit, and delete actions
5. Build CreateTaskForm with validation and optimistic create
6. Build EditTaskModal component with optimistic update
7. Implement status change with optimistic update (buttons or dropdown)
8. Implement title edit with optimistic update
9. Implement task deletion with optimistic update
10. Build StatusFilter component (mobile-friendly)
11. Build SortDropdown component
12. Add filtering and sorting logic (client-side)
13. Add loading states (skeletons on initial load)
14. Add error handling with revert on failure

### Phase 6: Polish & Testing

1. Test all responsive breakpoints
2. Test error scenarios
3. Test loading states
4. Add transitions and animations
5. Verify touch targets on mobile
6. Test form validation

### Phase 7: Documentation

1. Write comprehensive README.md with setup instructions
2. Document AI workflow in AI_WORKFLOW.md
3. Document architecture decisions in ARCHITECTURE.md
4. Create .env.example file

## Atomic Design & Scalable Architecture

### Component Architecture: Atomic Design Principles

**Component Hierarchy:**

```
Atoms (components/ui/)
  → Smallest, indivisible components
  → No business logic, pure presentation
  → Examples: Button, Input, Badge, Icon

Molecules (components/ui/ + feature-specific)
  → Composed of atoms
  → Single responsibility
  → Examples: FormField, SearchBar, StatusBadge

Organisms (components/boards/, components/tasks/)
  → Composed of molecules and atoms
  → Complex UI sections
  → Examples: BoardCard, TaskCard, TaskColumn

Templates (components/layout/)
  → Page-level layouts
  → Composed of organisms
  → Examples: PageLayout, DashboardLayout

Pages (app/)
  → Full page implementations
  → Use templates and organisms
  → Examples: app/page.tsx, app/board/[id]/page.tsx
```

### Atomic Component Structure

#### Atoms (`components/ui/atoms/`)

**Button.tsx** - Fully atomic and reusable

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
// - Single responsibility: render button
// - No business logic
// - Fully configurable via props
// - Works in any context
```

**Input.tsx** - Atomic input component

```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'date';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
}
// - Pure presentation
// - Controlled component pattern
// - Reusable everywhere
```

**Badge.tsx** - Status/priority indicator

```typescript
interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}
// - Atomic visual component
// - Used in TaskCard, BoardCard, etc.
```

#### Molecules (`components/ui/molecules/`)

**FormField.tsx** - Composed of Label + Input + Error

```typescript
interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'textarea' | 'select' | 'date';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  options?: Option[];
}
// - Composes: Label (atom) + Input (atom) + ErrorMessage (atom)
// - Single responsibility: form field with validation display
// - Reusable in all forms
```

**StatusBadge.tsx** - Composed of Badge + Status logic

```typescript
interface StatusBadgeProps {
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  size?: 'sm' | 'md' | 'lg';
}
// - Composes: Badge (atom)
// - Maps status to visual variant
// - Reusable across app
```

**ConfirmDialog.tsx** - Composed of Modal + Buttons

```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}
// - Composes: Modal (atom) + Button (atom) x2
// - Reusable for all confirmations
// - Used by DeleteBoardModal, DeleteTaskModal, etc.
```

#### Organisms (`components/boards/`, `components/tasks/`)

**BoardCard.tsx** - Composed of multiple molecules

```typescript
// Composes:
// - Badge (atom) for board color/status
// - Button (atom) for actions
// - Text elements (atoms)
// - Single responsibility: display board info
// - Reusable in BoardList, search results, etc.
```

**TaskCard.tsx** - Composed of molecules

```typescript
// Composes:
// - StatusBadge (molecule)
// - PriorityBadge (molecule)
// - Button (atom) for actions
// - Text elements (atoms)
// - Single responsibility: display task info
// - Reusable in TaskColumn, search results, etc.
```

### Scalable Code Organization

#### 1. Feature-Based Structure (Future-Proof)

```
components/
├── ui/                    # Shared UI components (atoms/molecules)
│   ├── atoms/             # Smallest components
│   ├── molecules/         # Composed components
│   └── organisms/         # Complex shared components
├── boards/                 # Board feature components
│   ├── BoardCard.tsx
│   ├── BoardList.tsx
│   ├── CreateBoardForm.tsx
│   └── DeleteBoardModal.tsx
├── tasks/                  # Task feature components
│   ├── TaskCard.tsx
│   ├── TaskColumn.tsx
│   ├── CreateTaskForm.tsx
│   └── EditTaskModal.tsx
└── layout/                 # Layout components
    ├── Header.tsx
    ├── Container.tsx
    └── ThemeProvider.tsx
```

**Benefits:**

- Easy to add new features (just add new folder)
- Clear separation of concerns
- Easy to find related code
- Scales to large applications

#### 2. Shared Utilities & Hooks

**`lib/` - Pure, reusable utilities**

```
lib/
├── api-client.ts          # API wrapper (reusable for all API calls)
├── validation.ts          # Validation schemas and functions
├── constants.ts           # App-wide constants
├── utils.ts               # Pure utility functions
├── formatters.ts          # Date, number, text formatters
└── types.ts               # Shared TypeScript types
```

**`hooks/` - Reusable custom hooks**

```
hooks/
├── useApi.ts              # Generic API hook (reusable)
├── useForm.ts             # Generic form hook (reusable)
├── useModal.ts             # Modal state management (reusable)
├── useOptimisticUpdate.ts  # Optimistic update pattern (reusable)
├── useBoards.ts            # Board-specific hook
├── useTasks.ts             # Task-specific hook
└── useToast.ts             # Toast notifications (reusable)
```

**Generic Hooks Pattern:**

```typescript
// hooks/useApi.ts - Completely reusable
export function useApi<T>(
  endpoint: string,
  options?: { method?: string; body?: any }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.request<T>(endpoint, options);
      setData(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  return { data, loading, error, execute };
}

// Usage in any feature:
const { data: boards, loading, error, execute: fetchBoards } = useApi<Board[]>('/api/boards');
```

#### 3. Type Safety & Shared Types

**`types/` - Centralized type definitions**

```
types/
├── index.ts                # Re-export all types
├── api.ts                  # API request/response types
├── board.ts                # Board-related types
├── task.ts                 # Task-related types
├── form.ts                 # Form types
└── common.ts                # Common types (Status, Priority, etc.)
```

**Shared Type Pattern:**

```typescript
// types/common.ts
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

// types/task.ts
export interface Task {
  id: string;
  boardId: string;
  title: string;
  status: TaskStatus;
  priority?: TaskPriority;
  // ...
}

export interface CreateTaskInput {
  boardId: string;
  title: string;
  status?: TaskStatus;
  // ...
}

export interface UpdateTaskInput {
  title?: string;
  status?: TaskStatus;
  // ...
}
```

### Component Composition Patterns

#### 1. Compound Components Pattern

**Example: Modal with Header, Body, Footer**

```typescript
// components/ui/Modal.tsx
export function Modal({ children, isOpen, onClose }: ModalProps) {
  return isOpen ? (
    <ModalContext.Provider value={{ onClose }}>
      <div className="modal-overlay">
        <div className="modal-container">
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  ) : null;
}

Modal.Header = function ModalHeader({ children }: { children: ReactNode }) {
  return <div className="modal-header">{children}</div>;
};

Modal.Body = function ModalBody({ children }: { children: ReactNode }) {
  return <div className="modal-body">{children}</div>;
};

Modal.Footer = function ModalFooter({ children }: { children: ReactNode }) {
  return <div className="modal-footer">{children}</div>;
};

// Usage:
<Modal isOpen={true} onClose={handleClose}>
  <Modal.Header>Delete Board</Modal.Header>
  <Modal.Body>Are you sure?</Modal.Body>
  <Modal.Footer>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleConfirm}>Delete</Button>
  </Modal.Footer>
</Modal>
```

#### 2. Render Props Pattern

**Example: Data fetching with render props**

```typescript
// components/shared/DataFetcher.tsx
interface DataFetcherProps<T> {
  endpoint: string;
  children: (data: { data: T | null; loading: boolean; error: string | null }) => ReactNode;
}

export function DataFetcher<T>({ endpoint, children }: DataFetcherProps<T>) {
  const { data, loading, error } = useApi<T>(endpoint);
  return <>{children({ data, loading, error })}</>;
}

// Usage:
<DataFetcher<Board[]> endpoint="/api/boards">
  {({ data, loading, error }) => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;
    return <BoardList boards={data || []} />;
  }}
</DataFetcher>
```

#### 3. Higher-Order Components (HOCs)

**Example: WithLoading HOC**

```typescript
// components/shared/withLoading.tsx
export function withLoading<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WithLoadingComponent(props: P & { loading?: boolean }) {
    const { loading, ...rest } = props;
    if (loading) return <LoadingSpinner />;
    return <Component {...(rest as P)} />;
  };
}

// Usage:
const BoardListWithLoading = withLoading(BoardList);
```

### Reusable Patterns & Utilities

#### 1. API Client - Completely Reusable

```typescript
// lib/api-client.ts
class ApiClient {
  private baseURL = '/api';

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new ApiError(error.error || 'Request failed', response.status);
    }

    return response.json();
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  patch<T>(endpoint: string, data: any) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
```

#### 2. Validation - Reusable Schemas

```typescript
// lib/validation.ts
export interface ValidationRule<T> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validate?: (value: T) => boolean;
  message?: string;
  enum?: T[];
}

export interface ValidationSchema<T> {
  [K in keyof T]?: ValidationRule<T[K]>;
}

export function validateField<T>(
  value: T,
  rule: ValidationRule<T>
): string | null {
  if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return rule.message || 'This field is required';
  }
  // ... other validations
  return null;
}

export function validateForm<T>(
  data: T,
  schema: ValidationSchema<T>
): Record<string, string> {
  const errors: Record<string, string> = {};
  // ... validation logic
  return errors;
}
```

#### 3. Constants - Centralized Configuration

```typescript
// lib/constants.ts
export const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'] as const;
export const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;

export const API_ENDPOINTS = {
  BOARDS: '/api/boards',
  TASKS: '/api/tasks',
} as const;

export const VALIDATION_RULES = {
  BOARD_NAME: { minLength: 1, maxLength: 255 },
  TASK_TITLE: { minLength: 1, maxLength: 255 },
  DESCRIPTION: { maxLength: 2000 },
} as const;
```

### Future Extensibility Patterns

#### 1. Plugin/Extension System (Future)

```typescript
// lib/plugins.ts - For future extensibility
interface Plugin {
  name: string;
  initialize: () => void;
  hooks?: {
    beforeTaskCreate?: (task: CreateTaskInput) => CreateTaskInput;
    afterTaskCreate?: (task: Task) => void;
  };
}

export class PluginManager {
  private plugins: Plugin[] = [];

  register(plugin: Plugin) {
    this.plugins.push(plugin);
    plugin.initialize();
  }

  executeHook(hookName: string, data: any) {
    this.plugins.forEach(plugin => {
      const hook = plugin.hooks?.[hookName];
      if (hook) return hook(data);
    });
  }
}
```

#### 2. Feature Flags (Future)

```typescript
// lib/feature-flags.ts
export const FEATURES = {
  TASK_COMMENTS: false,
  TASK_ATTACHMENTS: false,
  DRAG_AND_DROP: true,
  REAL_TIME_UPDATES: false,
} as const;

export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
  return FEATURES[feature];
}
```

#### 3. Modular Routing (Future)

```typescript
// app/routes.ts - Centralized routing
export const ROUTES = {
  DASHBOARD: '/',
  BOARD: (id: string) => `/board/${id}`,
  SETTINGS: '/settings',
  // Easy to add new routes
} as const;
```

### Best Practices for Scalability

1. **Single Responsibility Principle**

   - Each component has one job
   - Functions do one thing
   - Hooks manage one concern

2. **Composition Over Inheritance**

   - Build complex components from simple ones
   - Use composition patterns
   - Avoid deep inheritance hierarchies

3. **Dependency Injection**

   - Pass dependencies as props
   - Use context for shared dependencies
   - Easy to mock for testing

4. **Immutable Updates**

   - Always create new objects/arrays
   - Use spread operators
   - Prevents bugs and enables time-travel debugging

5. **Type Safety**

   - Strict TypeScript
   - Shared types
   - No `any` types

6. **Error Boundaries**

   - Catch errors at component level
   - Prevent full app crashes
   - Show user-friendly error messages

7. **Lazy Loading**

   - Code splitting by route
   - Lazy load heavy components
   - Improve initial load time

## Code Reusability & Optimization Strategy

### Reusable Component Patterns

1. **Base UI Components** (components/ui/atoms/):

   - All form inputs (Input, Select, Textarea) share common props and styling
   - Button component handles all variants (primary, secondary, danger, ghost)
   - Modal component is fully reusable with configurable sizes and behaviors
   - LoadingSpinner used everywhere (buttons, pages, inline)
   - ErrorMessage component for consistent error display
   - All atoms are pure, no business logic

2. **Molecule Components** (components/ui/molecules/):

   - FormField component with label, input, and error message
   - StatusBadge, PriorityBadge for consistent status display
   - ConfirmDialog for all confirmation modals
   - SearchBar, FilterBar for reusable filtering UI

3. **Shared Form Components**:

   - Reusable FormField component
   - Shared validation logic in `lib/validation.ts`
   - Reusable form hooks: `useForm`, `useFormField` for common form patterns
   - Validation schemas are reusable across features

4. **Shared Layout Components**:

   - `Container` component for consistent page padding and max-width
   - `Header` component with configurable title and actions
   - `PageLayout` wrapper component for consistent page structure
   - All layout components are theme-aware

5. **Shared Data Fetching**:

   - Generic `useApi` hook for all API calls
   - Custom hooks (`useBoards`, `useTasks`) built on top of `useApi`
   - Shared error handling logic in hooks
   - Shared loading state management
   - Reusable API client functions in `lib/api-client.ts`

6. **Shared Utilities**:

   - `lib/utils.ts` for common functions (date formatting, sorting, filtering)
   - `lib/formatters.ts` for text, number, date formatting
   - Shared TypeScript types in `types/index.ts`
   - Shared constants (statuses, priorities) in `lib/constants.ts`
   - All utilities are pure functions (no side effects)

### Code Optimization Patterns

1. **DRY Principles**:

   - Extract common API call patterns into reusable functions
   - Shared validation schemas (Zod or custom validators)
   - Common error handling wrapper functions
   - Shared sorting/filtering logic

2. **Component Composition**:

   - Use composition over duplication
   - Higher-order components or render props for shared logic
   - Shared wrapper components for common patterns

3. **Custom Hooks for Shared Logic**:

   - `useApi` hook for all API calls with loading/error states
   - `useModal` hook for modal open/close state management
   - `useOptimisticUpdate` hook for optimistic UI updates
   - `useDebounce` hook for search/filter inputs

4. **Shared Constants & Types**:

   - Task statuses, priorities as constants
   - API endpoint URLs as constants
   - Shared TypeScript interfaces and types
   - Shared validation rules

5. **Memoization & Performance**:

   - Use `React.memo` for expensive components (TaskCard, BoardCard)
   - Use `useMemo` for computed values (filtered/sorted lists)
   - Use `useCallback` for event handlers passed to children
   - Lazy load modals and heavy components

### Eliminating Code Duplication

1. **API Call Patterns**:

   - Single `apiRequest` function handles all HTTP methods
   - Shared error parsing and handling
   - Shared request/response interceptors

2. **Form Handling**:

   - Reusable form component with validation
   - Shared form field components
   - Common form submission logic

3. **State Management Patterns**:

   - Shared patterns for loading/error/success states
   - Reusable optimistic update logic
   - Common state update helpers

4. **Styling Patterns**:

   - Shared Tailwind class combinations in constants
   - Reusable style variants
   - Common responsive breakpoint utilities

## Internationalization (i18n) Implementation

### i18n Architecture

**Library Choice:** `next-intl` (recommended for Next.js) or `react-i18next`

**Project Structure:**

```
locales/
├── en/
│   ├── common.json            # Common translations (buttons, labels, actions)
│   ├── boards.json            # Board-related translations
│   ├── tasks.json             # Task-related translations
│   ├── forms.json             # Form labels and validation messages
│   ├── errors.json            # Error messages
│   └── messages.json          # Success/info messages
├── es/
│   ├── common.json
│   ├── boards.json
│   ├── tasks.json
│   ├── forms.json
│   ├── errors.json
│   └── messages.json
└── fr/
    ├── common.json
    ├── boards.json
    ├── tasks.json
    ├── forms.json
    ├── errors.json
    └── messages.json
```

### Translation File Structure

**locales/en/common.json:**

```json
{
  "buttons": {
    "create": "Create",
    "edit": "Edit",
    "delete": "Delete",
    "cancel": "Cancel",
    "save": "Save",
    "confirm": "Confirm",
    "close": "Close",
    "back": "Back"
  },
  "labels": {
    "name": "Name",
    "title": "Title",
    "description": "Description",
    "status": "Status",
    "priority": "Priority",
    "dueDate": "Due Date",
    "assignedTo": "Assigned To"
  },
  "actions": {
    "createBoard": "Create Board",
    "createTask": "Create Task",
    "editTask": "Edit Task",
    "deleteBoard": "Delete Board",
    "deleteTask": "Delete Task"
  }
}
```

**locales/en/boards.json:**

```json
{
  "title": "Boards",
  "empty": "No boards yet. Create your first board!",
  "create": {
    "title": "Create New Board",
    "namePlaceholder": "Enter board name",
    "descriptionPlaceholder": "Enter board description (optional)"
  },
  "delete": {
    "title": "Delete Board",
    "confirm": "Are you sure you want to delete \"{{name}}\"?",
    "warning": "⚠️ Warning: This action cannot be undone!",
    "message": "All {{count}} task{{plural}} in this board will be permanently deleted.",
    "description": "This will permanently delete the board and all its tasks. This action cannot be undone."
  }
}
```

**locales/en/tasks.json:**

```json
{
  "title": "Tasks",
  "empty": "No tasks yet. Create your first task!",
  "status": {
    "todo": "Todo",
    "inProgress": "In Progress",
    "done": "Done"
  },
  "priority": {
    "low": "Low",
    "medium": "Medium",
    "high": "High"
  },
  "create": {
    "title": "Create New Task",
    "titlePlaceholder": "Enter task title",
    "descriptionPlaceholder": "Enter task description (optional)"
  },
  "edit": {
    "title": "Edit Task"
  },
  "delete": {
    "confirm": "Are you sure you want to delete this task?",
    "success": "Task deleted successfully"
  }
}
```

**locales/en/forms.json:**

```json
{
  "validation": {
    "required": "{{field}} is required",
    "minLength": "{{field}} must be at least {{min}} characters",
    "maxLength": "{{field}} must be less than {{max}} characters",
    "invalidFormat": "{{field}} format is invalid",
    "invalidDate": "{{field}} must be a valid date"
  },
  "fields": {
    "boardName": "Board name",
    "taskTitle": "Task title",
    "description": "Description",
    "status": "Status",
    "priority": "Priority"
  }
}
```

**locales/en/errors.json:**

```json
{
  "network": "Failed to connect. Please check your internet connection.",
  "notFound": "{{resource}} not found",
  "serverError": "Something went wrong. Please try again.",
  "validationFailed": "Validation failed",
  "boardNotFound": "Board not found",
  "taskNotFound": "Task not found",
  "deleteFailed": "Failed to delete {{resource}}",
  "createFailed": "Failed to create {{resource}}",
  "updateFailed": "Failed to update {{resource}}"
}
```

**locales/en/messages.json:**

```json
{
  "board": {
    "created": "Board created successfully",
    "updated": "Board updated successfully",
    "deleted": "Board and all tasks deleted successfully"
  },
  "task": {
    "created": "Task created successfully",
    "updated": "Task updated successfully",
    "deleted": "Task deleted successfully",
    "statusUpdated": "Task status updated"
  }
}
```

### i18n Implementation

**lib/i18n.ts - i18n Configuration:**

```typescript
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'es', 'fr'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    messages: (await import(`../locales/${locale}/index.json`)).default
  };
});
```

**hooks/useTranslation.ts - Translation Hook:**

```typescript
import { useTranslations } from 'next-intl';

export function useTranslation(namespace?: string) {
  const t = useTranslations(namespace);
  
  return {
    t: (key: string, values?: Record<string, string | number>) => {
      return t(key, values);
    }
  };
}

// Usage:
// const { t } = useTranslation('boards');
// t('delete.title', { name: boardName, count: taskCount })
```

**Component Usage Example:**

```typescript
// components/boards/DeleteBoardModal.tsx
import { useTranslation } from '@/hooks/useTranslation';

export function DeleteBoardModal({ boardName, taskCount }: Props) {
  const { t } = useTranslation('boards');
  const { t: tCommon } = useTranslation('common');
  const { t: tErrors } = useTranslation('errors');

  return (
    <Modal title={t('delete.title')}>
      <p>{t('delete.confirm', { name: boardName })}</p>
      <p>{t('delete.message', { 
        count: taskCount, 
        plural: taskCount !== 1 ? 's' : '' 
      })}</p>
      <Button onClick={onConfirm}>
        {tCommon('buttons.delete')}
      </Button>
      <Button onClick={onClose}>
        {tCommon('buttons.cancel')}
      </Button>
    </Modal>
  );
}
```

**Language Switcher Component:**

```typescript
// components/ui/LanguageSwitcher.tsx
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n';

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: Locale) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <Select value={locale} onChange={(e) => switchLanguage(e.target.value as Locale)}>
      {locales.map(loc => (
        <option key={loc} value={loc}>
          {loc.toUpperCase()}
        </option>
      ))}
    </Select>
  );
}
```

**All Text Must Be Translated:**

- No hardcoded strings in components
- All user-facing text uses translation keys
- Error messages use translation keys
- Form validation messages use translation keys
- Button labels use translation keys

## Strict TypeScript - No `any` Types

### TypeScript Configuration

**tsconfig.json:**

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Type Safety Guidelines

**1. Never Use `any` Type**

**❌ Bad:**

```typescript
function processData(data: any) {
  return data.value;
}
```

**✅ Good:**

```typescript
interface Data {
  value: string;
}

function processData(data: Data): string {
  return data.value;
}
```

**2. Use `unknown` for Truly Unknown Types**

**❌ Bad:**

```typescript
function parseJSON(json: string): any {
  return JSON.parse(json);
}
```

**✅ Good:**

```typescript
function parseJSON<T>(json: string): T {
  return JSON.parse(json) as T;
}

// Or with validation:
function parseJSON<T>(json: string, validator: (data: unknown) => data is T): T {
  const parsed = JSON.parse(json);
  if (!validator(parsed)) {
    throw new Error('Invalid JSON structure');
  }
  return parsed;
}
```

**3. Proper Error Handling Types**

**❌ Bad:**

```typescript
try {
  await apiCall();
} catch (error: any) {
  console.log(error.message);
}
```

**✅ Good:**

```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: Record<string, string>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

try {
  await apiCall();
} catch (error: unknown) {
  if (error instanceof ApiError) {
    console.log(error.message, error.statusCode);
  } else if (error instanceof Error) {
    console.log(error.message);
  } else {
    console.log('Unknown error occurred');
  }
}
```

**4. API Response Types**

**❌ Bad:**

```typescript
const response = await fetch('/api/boards');
const data: any = await response.json();
```

**✅ Good:**

```typescript
interface ApiResponse<T> {
  data: T;
  error?: never;
}

interface ApiErrorResponse {
  error: string;
  details?: Record<string, string>;
  data?: never;
}

type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

async function fetchBoards(): Promise<ApiResult<Board[]>> {
  const response = await fetch('/api/boards');
  const data = await response.json();
  
  if ('error' in data) {
    return data as ApiErrorResponse;
  }
  return { data } as ApiResponse<Board[]>;
}
```

**5. Event Handler Types**

**❌ Bad:**

```typescript
function handleClick(e: any) {
  e.preventDefault();
}
```

**✅ Good:**

```typescript
function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault();
}

// For form events:
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
}

// For input events:
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  const value = e.target.value;
}
```

**6. Generic Types for Reusability**

**❌ Bad:**

```typescript
function getItem(key: string): any {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}
```

**✅ Good:**

```typescript
function getItem<T>(key: string): T | null {
  const item = localStorage.getItem(key);
  return item ? (JSON.parse(item) as T) : null;
}

// Usage:
const board = getItem<Board>('currentBoard');
```

**7. Prisma Types (No `any`)**

**❌ Bad:**

```typescript
const board: any = await prisma.board.findUnique({ where: { id } });
```

**✅ Good:**

```typescript
import { Board, Prisma } from '@prisma/client';

const board: Board | null = await prisma.board.findUnique({ 
  where: { id } 
});

// For includes:
type BoardWithTasks = Prisma.BoardGetPayload<{
  include: { tasks: true };
}>;

const boardWithTasks: BoardWithTasks | null = await prisma.board.findUnique({
  where: { id },
  include: { tasks: true }
});
```

**8. Function Parameter Types**

**❌ Bad:**

```typescript
function createTask(data: any) {
  // ...
}
```

**✅ Good:**

```typescript
interface CreateTaskInput {
  boardId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assignedTo?: string;
}

function createTask(data: CreateTaskInput): Promise<Task> {
  // ...
}
```

**9. State Types**

**❌ Bad:**

```typescript
const [data, setData] = useState<any>(null);
```

**✅ Good:**

```typescript
const [data, setData] = useState<Board | null>(null);
const [tasks, setTasks] = useState<Task[]>([]);
const [loading, setLoading] = useState<boolean>(false);
```

**10. API Client Types**

**lib/api-client.ts - Fully Typed:**

```typescript
interface ApiError {
  error: string;
  details?: Record<string, string>;
}

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: Record<string, string>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(endpoint, options);
    
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: 'Unknown error'
      }));
      throw new ApiError(
        errorData.error || 'Request failed',
        response.status,
        errorData.details
      );
    }
    
    return response.json() as Promise<T>;
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  patch<T>(endpoint: string, data: Partial<unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
```

### Type Safety Checklist

- [ ] No `any` types anywhere in codebase
- [ ] All function parameters are typed
- [ ] All return types are explicitly defined
- [ ] All state variables are typed
- [ ] All API responses are typed
- [ ] All event handlers use proper React types
- [ ] All Prisma queries use proper types
- [ ] All error handling uses typed errors
- [ ] All form data is typed
- [ ] All props interfaces are defined
- [ ] TypeScript strict mode enabled
- [ ] All `unknown` types are properly narrowed before use

### ESLint Rules for Type Safety

**.eslintrc.json:**

```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-call": "error",
    "@typescript-eslint/no-unsafe-return": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

## Key Technical Decisions

- **Database**: PostgreSQL with Prisma ORM
- **Cascade Delete**: When a board is deleted, all its tasks are deleted (onDelete: Cascade)
- **State Management**: React hooks (useState, useEffect) - no external state library needed for this scope
- **Error Handling**: Centralized API client + component-level error states
- **Loading Strategy**: Skeleton loaders for lists, spinners for actions
- **Responsive Approach**: Mobile-first design with Tailwind breakpoints
- **Form Validation**: Client-side + server-side validation with shared validation logic
- **Optimistic Updates**: Update UI immediately, revert on error - shared hook
- **Code Reusability**: Maximum component reuse, shared utilities, custom hooks for common patterns
- **Performance**: Memoization, lazy loading, optimized re-renders
- **Internationalization**: All user-facing text uses translation keys, support for multiple languages
- **Type Safety**: Strict TypeScript, no `any` types, all code fully typed

## Data Flow

```
Dashboard:
  Load → Fetch boards → Loading skeleton → Display boards or error
  Create → Optimistic update → API call → Success/Error → Update state

Board Detail:
  Load → Fetch board + tasks → Loading skeleton → Display or error
  Create Task → Optimistic update → API call → Success/Error → Update state
  Update Task → Optimistic update → API call → Success/Error → Update state
  Filter/Sort → Client-side manipulation → Re-render
```

## API Endpoints Summary

- `GET /api/boards` - Get all boards (200, 500)
- `POST /api/boards` - Create new board (201, 400, 500)
- `GET /api/boards/[id]` - Get board with tasks (200, 404, 500)
- `DELETE /api/boards/[id]` - Delete board (200, 404, 500)
- `GET /api/tasks?board_id=X` - Get tasks for a board (200, 400, 500)
- `POST /api/tasks` - Create new task (201, 400, 500)
- `PATCH /api/tasks/[id]` - Update task (200, 400, 404, 500)
- `DELETE /api/tasks/[id]` - Delete task (200, 404, 500)