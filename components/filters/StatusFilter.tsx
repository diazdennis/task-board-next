'use client';

import React from 'react';
import { TaskStatus } from '@/types/common';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/hooks/useTranslation';

export type FilterStatus = TaskStatus | 'ALL';

interface StatusFilterProps {
  activeFilter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  taskCounts?: Record<TaskStatus | 'ALL', number>;
}

export function StatusFilter({ activeFilter, onFilterChange, taskCounts }: StatusFilterProps) {
  const { t: tTasks } = useTranslation('tasks');
  const { t: tCommon } = useTranslation('common');

  const filters: { value: FilterStatus; label: string }[] = [
    { value: 'ALL', label: tCommon('buttons.all') || 'All' },
    { value: 'TODO', label: tTasks('status.todo') },
    { value: 'IN_PROGRESS', label: tTasks('status.inProgress') },
    { value: 'DONE', label: tTasks('status.done') },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const count = taskCounts?.[filter.value];
        const isActive = activeFilter === filter.value;

        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
              isActive
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            )}
          >
            {filter.label}
            {count !== undefined && (
              <span
                className={cn(
                  'ml-1.5 px-1.5 py-0.5 text-xs rounded-full',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

