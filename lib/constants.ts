import { TaskStatus, TaskPriority } from '@/types/common';

export const TASK_STATUSES: readonly TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'] as const;
export const TASK_PRIORITIES: readonly TaskPriority[] = ['LOW', 'MEDIUM', 'HIGH'] as const;

export const API_ENDPOINTS = {
  BOARDS: '/api/boards',
  TASKS: '/api/tasks',
} as const;

export const VALIDATION_RULES = {
  BOARD_NAME: { minLength: 1, maxLength: 255 },
  TASK_TITLE: { minLength: 1, maxLength: 255 },
  DESCRIPTION: { maxLength: 2000 },
} as const;


