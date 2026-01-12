import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const board = await prisma.board.findUnique({
      where: { id: params.id },
      include: { tasks: true },
    });

    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(board, { status: 200 });
  } catch (error) {
    console.error('Error fetching board:', error);
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
    // Check if board exists first
    const board = await prisma.board.findUnique({
      where: { id: params.id },
      include: { tasks: true },
    });

    if (!board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }

    // Delete board - tasks are automatically deleted due to onDelete: Cascade
    await prisma.board.delete({
      where: { id: params.id },
    });

    // Return success response
    return NextResponse.json(
      {
        message: 'Board and all associated tasks deleted successfully',
        deletedTasksCount: board.tasks.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting board:', error);
    
    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

