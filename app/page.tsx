'use client';

import React, { useState } from 'react';
import { useBoards } from '@/hooks/useBoards';
import { useToast } from '@/hooks/useToast';
import { BoardList } from '@/components/boards/BoardList';
import { CreateBoardForm } from '@/components/boards/CreateBoardForm';
import { DeleteBoardModal } from '@/components/boards/DeleteBoardModal';
import { Header } from '@/components/layout/Header';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { ToastContainer } from '@/components/ui/Toast';
import { Board, CreateBoardInput } from '@/types/board';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';

export default function Home() {
  const router = useRouter();
  const { boards, isLoading, error, createBoard, deleteBoard } = useBoards();
  const { toasts, removeToast, success, error: showError } = useToast();
  const { t: tCommon } = useTranslation('common');
  const { t: tBoards } = useTranslation('boards');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    board: Board | null;
    taskCount: number;
  }>({
    isOpen: false,
    board: null,
    taskCount: 0,
  });

  const handleCreateBoard = async (input: CreateBoardInput) => {
    try {
      await createBoard(input);
      success(tBoards('create.success') || 'Board created successfully');
    } catch (err) {
      showError('Failed to create board');
    }
  };

  const handleBoardClick = (board: Board) => {
    router.push(`/board/${board.id}`);
  };

  const handleDeleteClick = async (board: Board) => {
    // Fetch board with tasks to get task count
    try {
      const response = await fetch(`/api/boards/${board.id}`);
      const boardWithTasks = await response.json();
      setDeleteModalState({
        isOpen: true,
        board,
        taskCount: boardWithTasks.tasks?.length || 0,
      });
    } catch (err) {
      console.error('Error fetching board details:', err);
      showError('Failed to load board details');
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteModalState.board) {
      try {
        await deleteBoard(deleteModalState.board.id);
        success(tBoards('delete.success') || 'Board deleted successfully');
        setDeleteModalState({ isOpen: false, board: null, taskCount: 0 });
      } catch (err) {
        showError('Failed to delete board');
      }
    }
  };

  return (
    <>
      <Header
        title={tBoards('title')}
        actions={
          <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
            {tCommon('buttons.createBoard')}
          </Button>
        }
      />
      <Container className="py-8">
        <BoardList
          boards={boards}
          loading={isLoading}
          error={error}
          onBoardClick={handleBoardClick}
          onBoardDelete={handleDeleteClick}
        />
      </Container>

      <CreateBoardForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateBoard}
      />

      {deleteModalState.board && (
        <DeleteBoardModal
          isOpen={deleteModalState.isOpen}
          onClose={() =>
            setDeleteModalState({ isOpen: false, board: null, taskCount: 0 })
          }
          onConfirm={handleDeleteConfirm}
          boardName={deleteModalState.board.name}
          taskCount={deleteModalState.taskCount}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}
