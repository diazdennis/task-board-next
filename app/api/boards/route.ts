import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CreateBoardInput } from '@/types/board';

export async function GET() {
  try {
    const boards = await prisma.board.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(boards, { status: 200 });
  } catch (error) {
    console.error('Error fetching boards:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as CreateBoardInput;
    const { name, description, color } = body;

    // Validation
    const errors: Record<string, string> = {};

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      errors.name = 'Board name is required';
    } else if (name.length > 255) {
      errors.name = 'Board name must be less than 255 characters';
    }

    if (description && description.length > 1000) {
      errors.description = 'Description must be less than 1000 characters';
    }

    if (color && !/^#[0-9A-F]{6}$/i.test(color)) {
      errors.color = 'Color must be a valid hex code';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    // Create board
    const board = await prisma.board.create({
      data: { 
        name: name.trim(), 
        description: description || null, 
        color: color || null 
      },
    });

    return NextResponse.json(board, { status: 201 });
  } catch (error) {
    console.error('Error creating board:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


