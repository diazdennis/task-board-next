'use client';

import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Task, CreateTaskInput, UpdateTaskInput } from '@/types/task';
import { ApiError } from '@/types/api';

export function useTasks(boardId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<Task[]>(`/tasks?board_id=${boardId}`);
      setTasks(data);
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to load tasks';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  const createTask = useCallback(async (taskData: CreateTaskInput): Promise<Task> => {
    const tempId = `temp-${Date.now()}`;
    const optimisticTask: Task = {
      id: tempId,
      boardId: taskData.boardId,
      title: taskData.title,
      description: taskData.description || null,
      status: taskData.status || 'TODO',
      priority: taskData.priority || null,
      assignedTo: taskData.assignedTo || null,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks((prev) => [...prev, optimisticTask]);

    try {
      const newTask = await apiClient.post<Task>('/tasks', taskData);
      setTasks((prev) => prev.map((t) => (t.id === tempId ? newTask : t)));
      return newTask;
    } catch (err) {
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to create task';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (taskId: string, updates: UpdateTaskInput): Promise<Task> => {
    const originalTask = tasks.find((t) => t.id === taskId);
    if (!originalTask) {
      throw new Error('Task not found');
    }

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updated: Task = {
          ...t,
          ...(updates.title !== undefined && { title: updates.title }),
          ...(updates.description !== undefined && { description: updates.description || null }),
          ...(updates.status !== undefined && { status: updates.status }),
          ...(updates.priority !== undefined && { priority: updates.priority || null }),
          ...(updates.dueDate !== undefined && { dueDate: updates.dueDate ? new Date(updates.dueDate) : null }),
          ...(updates.assignedTo !== undefined && { assignedTo: updates.assignedTo || null }),
        };
        return updated;
      })
    );

    try {
      const updated = await apiClient.patch<Task>(`/tasks/${taskId}`, updates);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      return updated;
    } catch (err) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? originalTask : t)));
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to update task';
      setError(errorMessage);
      throw err;
    }
  }, [tasks]);

  const deleteTask = useCallback(async (taskId: string): Promise<void> => {
    const originalTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      await apiClient.delete(`/tasks/${taskId}`);
    } catch (err) {
      setTasks(originalTasks);
      const errorMessage = err instanceof ApiError ? err.message : 'Failed to delete task';
      setError(errorMessage);
      throw err;
    }
  }, [tasks]);

  useEffect(() => {
    if (boardId) {
      fetchTasks();
    }
  }, [boardId, fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
}

