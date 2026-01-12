'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTasks } from '@/hooks/useTasks';
import { useToast } from '@/hooks/useToast';
import { TaskColumn } from '@/components/tasks/TaskColumn';
import { CreateTaskForm } from '@/components/tasks/CreateTaskForm';
import { EditTaskModal } from '@/components/tasks/EditTaskModal';
import { TaskSkeleton } from '@/components/tasks/TaskSkeleton';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ToastContainer } from '@/components/ui/Toast';
import { StatusFilter, FilterStatus, SortDropdown, SortOption } from '@/components/filters';
import { Task, UpdateTaskInput } from '@/types/task';
import { TaskStatus } from '@/types/common';
import { apiClient } from '@/lib/api-client';
import { Board } from '@/types/board';
import { useTranslation } from '@/hooks/useTranslation';

export default function BoardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.id as string;
  
  const [board, setBoard] = useState<Board | null>(null);
  const [isLoadingBoard, setIsLoadingBoard] = useState(true);
  const { t: tCommon } = useTranslation('common');
  const { t: tBoards } = useTranslation('boards');
  const { t: tTasks } = useTranslation('tasks');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filter and Sort state
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'title', order: 'asc' });

  // Toast notifications
  const { toasts, removeToast, success, error: showError } = useToast();

  const {
    tasks,
    isLoading: isLoadingTasks,
    error: tasksError,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks(boardId);

  // Calculate task counts for filter badges
  const taskCounts = useMemo(() => {
    const counts: Record<TaskStatus | 'ALL', number> = {
      ALL: tasks.length,
      TODO: 0,
      IN_PROGRESS: 0,
      DONE: 0,
    };
    tasks.forEach((task) => {
      counts[task.status]++;
    });
    return counts;
  }, [tasks]);

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Apply filter
    if (activeFilter !== 'ALL') {
      result = result.filter((task) => task.status === activeFilter);
    }

    // Apply sort
    result.sort((a, b) => {
      const { field, order } = sortOption;
      let comparison = 0;

      switch (field) {
        case 'status': {
          const statusOrder = { TODO: 1, IN_PROGRESS: 2, DONE: 3 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        }
        case 'title':
        default:
          comparison = a.title.localeCompare(b.title);
          break;
      }

      return order === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [tasks, activeFilter, sortOption]);

  // Fetch board data
  React.useEffect(() => {
    const fetchBoard = async () => {
      try {
        const data = await apiClient.get<Board>(`/boards/${boardId}`);
        setBoard(data);
      } catch (err) {
        console.error('Error fetching board:', err);
        showError('Failed to load board');
      } finally {
        setIsLoadingBoard(false);
      }
    };

    if (boardId) {
      fetchBoard();
    }
  }, [boardId, showError]);

  const handleCreateTask = async (input: Parameters<typeof createTask>[0]) => {
    try {
      await createTask(input);
      success(tTasks('create.success'));
    } catch (err) {
      showError('Failed to create task');
    }
  };

  const handleTaskEdit = (task: Task) => {
    setEditTask(task);
    setIsEditModalOpen(true);
  };

  const handleTaskUpdate = async (taskId: string, updates: UpdateTaskInput) => {
    try {
      await updateTask(taskId, updates);
      success(tTasks('update.success'));
      setIsEditModalOpen(false);
      setEditTask(null);
    } catch (err) {
      showError('Failed to update task');
    }
  };

  const [deleteTaskState, setDeleteTaskState] = useState<{
    isOpen: boolean;
    taskId: string | null;
    taskTitle: string;
  }>({
    isOpen: false,
    taskId: null,
    taskTitle: '',
  });

  const handleTaskDeleteClick = (task: Task) => {
    setDeleteTaskState({
      isOpen: true,
      taskId: task.id,
      taskTitle: task.title,
    });
  };

  const handleTaskDeleteConfirm = async () => {
    if (deleteTaskState.taskId) {
      try {
        await deleteTask(deleteTaskState.taskId);
        success(tTasks('delete.success'));
        setDeleteTaskState({ isOpen: false, taskId: null, taskTitle: '' });
      } catch (err) {
        showError('Failed to delete task');
      }
    }
  };

  const boardColor = board?.color || '#3B82F6';
  
  if (isLoadingBoard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  if (!board) {
    return (
      <Container className="py-8">
        <ErrorMessage message={tBoards('notFound')} />
        <Button onClick={() => router.push('/')} className="mt-4">
          {tCommon('buttons.back')}
        </Button>
      </Container>
    );
  }
  
  // Convert hex to rgba for opacity control
  const hexToRgba = (hex: string, alpha: number) => {
    // Handle both #RRGGBB and #RGB formats
    const hexCode = hex.replace('#', '');
    if (hexCode.length === 3) {
      const r = parseInt((hexCode[0] || '0') + (hexCode[0] || '0'), 16);
      const g = parseInt((hexCode[1] || '0') + (hexCode[1] || '0'), 16);
      const b = parseInt((hexCode[2] || '0') + (hexCode[2] || '0'), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    const r = parseInt(hexCode.slice(0, 2) || '00', 16);
    const g = parseInt(hexCode.slice(2, 4) || '00', 16);
    const b = parseInt(hexCode.slice(4, 6) || '00', 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Create visible gradient background - more prominent for better visibility
  const bgColorStyle: React.CSSProperties = {
    backgroundColor: hexToRgba(boardColor, 0.15),
    backgroundImage: `linear-gradient(to bottom, ${hexToRgba(boardColor, 0.3)}, ${hexToRgba(boardColor, 0.15)}, ${hexToRgba(boardColor, 0.08)})`,
  };

  // Check if we're in filtered view (single status) or board view (all statuses)
  const isFilteredView = activeFilter !== 'ALL';

  return (
    <div 
      className="min-h-screen w-full transition-all duration-300 relative"
      style={bgColorStyle}
    >
      <Header
        title={board.name}
        actions={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button onClick={() => router.push('/')} variant="secondary" className="w-full sm:w-auto">
              {tCommon('buttons.back')}
            </Button>
            <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
              {tCommon('buttons.createTask')}
            </Button>
          </div>
        }
      />
      <Container className="py-8">
        {/* Filter and Sort Controls */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <StatusFilter
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              taskCounts={taskCounts}
            />
            <SortDropdown
              value={sortOption}
              onChange={setSortOption}
            />
          </div>
        </div>

        {tasksError && <ErrorMessage message={tasksError} className="mb-4" />}
        
        {isLoadingTasks ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TaskSkeleton count={3} />
            <TaskSkeleton count={3} />
            <TaskSkeleton count={3} />
          </div>
        ) : isFilteredView ? (
          // Filtered view - show single list (tasks already filtered and sorted)
          <div className="max-w-2xl mx-auto">
            <TaskColumn
              status={activeFilter as TaskStatus}
              tasks={filteredAndSortedTasks}
              onTaskEdit={handleTaskEdit}
              onTaskDelete={handleTaskDeleteClick}
              preFiltered
            />
          </div>
        ) : (
          // Board view - show all columns
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            <TaskColumn
              status="TODO"
              tasks={filteredAndSortedTasks}
              onTaskEdit={handleTaskEdit}
              onTaskDelete={handleTaskDeleteClick}
            />
            <TaskColumn
              status="IN_PROGRESS"
              tasks={filteredAndSortedTasks}
              onTaskEdit={handleTaskEdit}
              onTaskDelete={handleTaskDeleteClick}
            />
            <TaskColumn
              status="DONE"
              tasks={filteredAndSortedTasks}
              onTaskEdit={handleTaskEdit}
              onTaskDelete={handleTaskDeleteClick}
            />
          </div>
        )}
      </Container>

      <CreateTaskForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateTask}
        boardId={boardId}
      />

      {editTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditTask(null);
          }}
          onSuccess={handleTaskUpdate}
          task={editTask}
        />
      )}

      <ConfirmDialog
        isOpen={deleteTaskState.isOpen}
        onClose={() => setDeleteTaskState({ isOpen: false, taskId: null, taskTitle: '' })}
        onConfirm={handleTaskDeleteConfirm}
        title={tTasks('delete.title')}
        message={tTasks('delete.confirm') + ` "${deleteTaskState.taskTitle}"?`}
        confirmText={tCommon('buttons.delete')}
        cancelText={tCommon('buttons.cancel')}
        variant="danger"
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
