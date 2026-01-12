'use client';

import React from 'react';
import { Board } from '@/types/board';
import { BoardCard } from './BoardCard';
import { BoardSkeleton } from './BoardSkeleton';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { useTranslation } from '@/hooks/useTranslation';

interface BoardListProps {
  boards: Board[];
  loading: boolean;
  error: string | null;
  onBoardClick: (board: Board) => void;
  onBoardDelete?: (board: Board) => void;
}

export function BoardList({
  boards,
  loading,
  error,
  onBoardClick,
  onBoardDelete,
}: BoardListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <BoardSkeleton count={6} />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const { t: tBoards } = useTranslation('boards');

  if (boards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {tBoards('empty')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {boards.map((board) => (
        <BoardCard
          key={board.id}
          board={board}
          onClick={() => onBoardClick(board)}
          {...(onBoardDelete && { onDelete: () => onBoardDelete(board) })}
        />
      ))}
    </div>
  );
}

