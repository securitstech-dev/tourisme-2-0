import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching users from Supabase...');
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    console.log('--- RECENT USERS ---');
    console.log(JSON.stringify(users, null, 2));

    const operators = await prisma.operator.findMany({
      select: {
        id: true,
        businessName: true,
        phone: true,
      },
      take: 10,
    });

    console.log('--- OPERATORS ---');
    console.log(JSON.stringify(operators, null, 2));

  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
