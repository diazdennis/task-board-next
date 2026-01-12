'use client';

import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Board, CreateBoardInput } from '@/types/board';
import { ApiError } from '@/types/api';

export function useBoards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<Board[]>('/boards');
      setBoards(data);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to load boards';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBoard = useCallback(async (input: CreateBoardInput): Promise<Board> => {
    try {
      const newBoard = await apiClient.post<Board>('/boards', input);
      setBoards((prev) => [...prev, newBoard]);
      return newBoard;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to create board';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteBoard = useCallback(async (boardId: string): Promise<void> => {
    try {
      await apiClient.delete(`/boards/${boardId}`);
      setBoards((prev) => prev.filter((board) => board.id !== boardId));
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to delete board';
      setError(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  return {
    boards,
    isLoading,
    error,
    createBoard,
    deleteBoard,
    refetch: fetchBoards,
  };
}


