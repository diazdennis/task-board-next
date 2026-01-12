import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (only if tables exist)
  console.log('🧹 Clearing existing data...');
  try {
    await prisma.task.deleteMany();
    await prisma.board.deleteMany();
  } catch (error: any) {
    // P2021 = Table does not exist
    if (error.code === 'P2021') {
      console.log('⚠️  Tables not found - migrations should create them first');
      console.log('⚠️  Skipping clear step (this is normal on first deployment)');
    } else {
      throw error;
    }
  }

  // Create example boards
  console.log('📋 Creating example boards...');
  
  const board1 = await prisma.board.create({
    data: {
      name: 'Project Alpha',
      description: 'Main project board for Alpha development',
      color: '#3B82F6',
    },
  });

  const board2 = await prisma.board.create({
    data: {
      name: 'Marketing Campaign',
      description: 'Tasks for Q1 marketing initiatives',
      color: '#10B981',
    },
  });

  const board3 = await prisma.board.create({
    data: {
      name: 'Bug Fixes',
      description: 'Critical bugs and issues to resolve',
      color: '#EF4444',
    },
  });

  const board4 = await prisma.board.create({
    data: {
      name: 'Feature Requests',
      description: 'New features and enhancements',
      color: '#8B5CF6',
    },
  });

  // Create tasks for Board 1 (Project Alpha)
  console.log('✅ Creating tasks for Project Alpha...');
  await prisma.task.createMany({
    data: [
      {
        boardId: board1.id,
        title: 'Set up development environment',
        description: 'Install dependencies and configure local setup',
        status: 'DONE',
        priority: 'HIGH',
      },
      {
        boardId: board1.id,
        title: 'Design database schema',
        description: 'Create ERD and define table relationships',
        status: 'DONE',
        priority: 'HIGH',
      },
      {
        boardId: board1.id,
        title: 'Implement user authentication',
        description: 'Add login and registration functionality',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
      },
      {
        boardId: board1.id,
        title: 'Write API documentation',
        description: 'Document all endpoints with examples',
        status: 'TODO',
        priority: 'MEDIUM',
      },
      {
        boardId: board1.id,
        title: 'Set up CI/CD pipeline',
        description: 'Configure automated testing and deployment',
        status: 'TODO',
        priority: 'MEDIUM',
      },
      {
        boardId: board1.id,
        title: 'Code review and refactoring',
        description: 'Review codebase and improve code quality',
        status: 'TODO',
        priority: 'LOW',
      },
    ],
  });

  // Create tasks for Board 2 (Marketing Campaign)
  console.log('✅ Creating tasks for Marketing Campaign...');
  await prisma.task.createMany({
    data: [
      {
        boardId: board2.id,
        title: 'Create social media content',
        description: 'Design posts for Instagram, Twitter, and LinkedIn',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
      },
      {
        boardId: board2.id,
        title: 'Schedule email campaign',
        description: 'Prepare and schedule Q1 newsletter',
        status: 'TODO',
        priority: 'HIGH',
      },
      {
        boardId: board2.id,
        title: 'Analyze competitor strategies',
        description: 'Research and document competitor marketing approaches',
        status: 'DONE',
        priority: 'MEDIUM',
      },
      {
        boardId: board2.id,
        title: 'Design landing page',
        description: 'Create new landing page for campaign',
        status: 'TODO',
        priority: 'MEDIUM',
      },
    ],
  });

  // Create tasks for Board 3 (Bug Fixes)
  console.log('✅ Creating tasks for Bug Fixes...');
  await prisma.task.createMany({
    data: [
      {
        boardId: board3.id,
        title: 'Fix login page crash on mobile',
        description: 'Application crashes when logging in from mobile devices',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignedTo: 'John Doe',
      },
      {
        boardId: board3.id,
        title: 'Resolve database connection timeout',
        description: 'Connection times out after 30 seconds of inactivity',
        status: 'TODO',
        priority: 'HIGH',
        assignedTo: 'Jane Smith',
      },
      {
        boardId: board3.id,
        title: 'Fix typo in error message',
        description: 'Correct spelling error in validation message',
        status: 'DONE',
        priority: 'LOW',
      },
      {
        boardId: board3.id,
        title: 'Memory leak in dashboard',
        description: 'Dashboard consumes increasing memory over time',
        status: 'TODO',
        priority: 'MEDIUM',
        assignedTo: 'John Doe',
      },
    ],
  });

  // Create tasks for Board 4 (Feature Requests)
  console.log('✅ Creating tasks for Feature Requests...');
  await prisma.task.createMany({
    data: [
      {
        boardId: board4.id,
        title: 'Add dark mode support',
        description: 'Implement dark/light theme toggle',
        status: 'DONE',
        priority: 'MEDIUM',
      },
      {
        boardId: board4.id,
        title: 'Export data to CSV',
        description: 'Allow users to export board data as CSV file',
        status: 'TODO',
        priority: 'LOW',
      },
      {
        boardId: board4.id,
        title: 'Add task comments',
        description: 'Enable users to add comments to tasks',
        status: 'TODO',
        priority: 'MEDIUM',
      },
      {
        boardId: board4.id,
        title: 'Implement task search',
        description: 'Add search functionality to find tasks across boards',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
      },
      {
        boardId: board4.id,
        title: 'Add due date reminders',
        description: 'Send notifications for tasks approaching due date',
        status: 'TODO',
        priority: 'LOW',
      },
    ],
  });

  console.log('✨ Seeding completed successfully!');
  console.log(`📊 Created:`);
  console.log(`   - ${await prisma.board.count()} boards`);
  console.log(`   - ${await prisma.task.count()} tasks`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

