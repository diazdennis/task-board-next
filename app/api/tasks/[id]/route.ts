import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UpdateTaskInput } from '@/types/task';
import { TASK_STATUSES, TASK_PRIORITIES } from '@/lib/constants';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json() as UpdateTaskInput;
    const { title, description, status, priority, dueDate, assignedTo } = body;

    // Check if task exists
    const existingTask = await prisma.task.findUnique({
      where: { id: params.id },
    });

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    // Validation
    const errors: Record<string, string> = {};
    const updates: Partial<UpdateTaskInput> = {};

    if (title !== undefined) {
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        errors.title = 'Task title is required';
      } else if (title.length > 255) {
        errors.title = 'Task title must be less than 255 characters';
      } else {
        updates.title = title.trim();
      }
    }

    if (description !== undefined) {
      if (description && description.length > 2000) {
        errors.description = 'Description must be less than 2000 characters';
      } else {
        updates.description = description ?? null;
      }
    }

    if (status !== undefined) {
      if (!TASK_STATUSES.includes(status)) {
        errors.status = `Status must be one of: ${TASK_STATUSES.join(', ')}`;
      } else {
        updates.status = status;
      }
    }

    if (priority !== undefined) {
      if (priority && !TASK_PRIORITIES.includes(priority)) {
        errors.priority = `Priority must be one of: ${TASK_PRIORITIES.join(', ')}`;
      } else {
        updates.priority = priority ?? null;
      }
    }

    if (dueDate !== undefined) {
      if (dueDate) {
        const date = new Date(dueDate);
        if (isNaN(date.getTime())) {
          errors.dueDate = 'Due date must be a valid date';
        } else {
          updates.dueDate = date.toISOString();
        }
      } else {
        updates.dueDate = null as unknown as string;
      }
    }

    if (assignedTo !== undefined) {
      if (assignedTo && assignedTo.length > 255) {
        errors.assignedTo = 'Assigned to must be less than 255 characters';
      } else {
        updates.assignedTo = assignedTo ?? null;
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Check if at least one field is being updated
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Update task - build data object with only defined fields
    const updateData: {
      title?: string;
      description?: string | null;
      status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
      priority?: 'LOW' | 'MEDIUM' | 'HIGH' | null;
      dueDate?: Date | null;
      assignedTo?: string | null;
    } = {};

    if (updates.title !== undefined) {
      updateData.title = updates.title;
    }
    if (updates.description !== undefined) {
      updateData.description = updates.description ?? null;
    }
    if (updates.status !== undefined) {
      updateData.status = updates.status;
    }
    if (updates.priority !== undefined) {
      updateData.priority = updates.priority ?? null;
    }
    if (updates.dueDate !== undefined) {
      updateData.dueDate = updates.dueDate ? new Date(updates.dueDate) : null;
    }
    if (updates.assignedTo !== undefined) {
      updateData.assignedTo = updates.assignedTo ?? null;
    }

    const task = await prisma.task.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const task = await prisma.task.findUnique({
      where: { id: params.id },
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    await prisma.task.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Task deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting task:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

