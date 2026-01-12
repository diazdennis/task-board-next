import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateTaskInput } from '@/types/task';
import { TASK_STATUSES, TASK_PRIORITIES } from '@/lib/constants';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const boardId = searchParams.get('board_id');

    if (!boardId) {
      return NextResponse.json(
        { error: 'board_id query parameter is required' },
        { status: 400 }
      );
    }

    const tasks = await prisma.task.findMany({
      where: { boardId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as CreateTaskInput;
    const { boardId, title, description, status, priority, dueDate, assignedTo } = body;

    // Validation
    const errors: Record<string, string> = {};

    if (!boardId || typeof boardId !== 'string') {
      errors.boardId = 'Board ID is required';
    } else {
      // Verify board exists
      const board = await prisma.board.findUnique({ where: { id: boardId } });
      if (!board) {
        errors.boardId = 'Board not found';
      }
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.title = 'Task title is required';
    } else if (title.length > 255) {
      errors.title = 'Task title must be less than 255 characters';
    }

    if (description && description.length > 2000) {
      errors.description = 'Description must be less than 2000 characters';
    }

    if (status && !TASK_STATUSES.includes(status)) {
      errors.status = `Status must be one of: ${TASK_STATUSES.join(', ')}`;
    }

    if (priority && !TASK_PRIORITIES.includes(priority)) {
      errors.priority = `Priority must be one of: ${TASK_PRIORITIES.join(', ')}`;
    }

    if (dueDate) {
      const date = new Date(dueDate);
      if (isNaN(date.getTime())) {
        errors.dueDate = 'Due date must be a valid date';
      }
    }

    if (assignedTo && assignedTo.length > 255) {
      errors.assignedTo = 'Assigned to must be less than 255 characters';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        boardId,
        title: title.trim(),
        description: description || null,
        status: status || 'TODO',
        priority: priority || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedTo: assignedTo || null,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


