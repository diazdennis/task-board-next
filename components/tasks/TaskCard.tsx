'use client';

import React from 'react';
import { Task } from '@/types/task';
import { TaskStatus } from '@/types/common';
import { Button } from '@/components/ui/Button';
import { EditIcon, DeleteIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

const statusColors = {
  TODO: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  DONE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

export function TaskCard({
  task,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const { t: tCommon } = useTranslation('common');
  const { t: tTasks } = useTranslation('tasks');

  const statusLabels: Record<TaskStatus, string> = {
    TODO: tTasks('status.todo'),
    IN_PROGRESS: tTasks('status.inProgress'),
    DONE: tTasks('status.done'),
  };

  return (
    <div className="p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2 gap-2">
        <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 flex-1 break-words">
          {task.title}
        </h4>
        <span
          className={cn(
            'px-2 py-1 text-xs font-medium rounded flex-shrink-0',
            statusColors[task.status]
          )}
        >
          {statusLabels[task.status]}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-col sm:flex-row justify-end sm:items-center mt-3 gap-3">
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onEdit} 
            className="flex items-center gap-1.5 flex-1 sm:flex-initial"
          >
            <EditIcon size={16} className="w-4 h-4" />
            <span className="hidden sm:inline">{tCommon('buttons.edit')}</span>
          </Button>
          <Button 
            size="sm" 
            variant="danger" 
            onClick={onDelete} 
            className="flex items-center gap-1.5 flex-1 sm:flex-initial"
          >
            <DeleteIcon size={16} className="w-4 h-4" />
            <span className="hidden sm:inline">{tCommon('buttons.delete')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

