'use client';

import React from 'react';
import { Board } from '@/types/board';
import { DeleteIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

interface BoardCardProps {
  board: Board;
  onClick: () => void;
  onDelete?: () => void;
}

export function BoardCard({ board, onClick, onDelete }: BoardCardProps) {
  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 sm:p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700',
        'bg-white dark:bg-gray-800',
        'cursor-pointer transition-all hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400',
        'flex flex-col justify-between min-h-[120px] sm:min-h-[150px]'
      )}
    >
      <div>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {board.name}
          </h3>
          {board.color && (
            <div
              className="w-4 h-4 rounded-full ml-2"
              style={{ backgroundColor: board.color }}
            />
          )}
        </div>
        {board.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {board.description}
          </p>
        )}
        {board.tasks && (
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            {board.tasks.length} task{board.tasks.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
      {onDelete && (
        <button
          onClick={handleDelete}
          className="mt-4 flex items-center justify-end gap-1.5 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          aria-label="Delete board"
        >
          <DeleteIcon size={16} className="w-4 h-4" />
          <span>Delete</span>
        </button>
      )}
    </div>
  );
}


