'use client';

import React, { useMemo } from 'react';
import { Task } from '@/types/task';
import { TaskStatus } from '@/types/common';
import { TaskCard } from './TaskCard';
import { useTranslation } from '@/hooks/useTranslation';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (task: Task) => void;
  /** If true, tasks are already filtered for this status (skip internal filtering) */
  preFiltered?: boolean;
}

export function TaskColumn({
  status,
  tasks,
  onTaskEdit,
  onTaskDelete,
  preFiltered = false,
}: TaskColumnProps) {
  const { t: tTasks } = useTranslation('tasks');

  // Only filter if not pre-filtered - this preserves sort order from parent
  const displayTasks = useMemo(() => {
    if (preFiltered) {
      return tasks;
    }
    return tasks.filter((task) => task.status === status);
  }, [tasks, status, preFiltered]);

  const statusLabels: Record<TaskStatus, string> = {
    TODO: tTasks('status.todo'),
    IN_PROGRESS: tTasks('status.inProgress'),
    DONE: tTasks('status.done'),
  };

  return (
    <div className="flex flex-col h-full min-h-[400px] sm:min-h-[500px]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {statusLabels[status]}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {displayTasks.length} {tTasks('title').toLowerCase()}{displayTasks.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
        {displayTasks.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
            {tTasks('noTasks')}
          </p>
        ) : (
          displayTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onTaskEdit(task)}
              onDelete={() => onTaskDelete(task)}
            />
          ))
        )}
      </div>
    </div>
  );
}
