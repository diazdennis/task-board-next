import { Task } from './task';

export interface Board {
  id: string;
  name: string;
  description?: string | null;
  color?: string | null;
  createdAt: Date;
  updatedAt: Date;
  tasks?: Task[];
}

export interface CreateBoardInput {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateBoardInput {
  name?: string;
  description?: string;
  color?: string;
}

export interface BoardWithTasks extends Board {
  tasks: Task[];
}


