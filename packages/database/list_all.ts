import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      operator: true
    }
  });
  console.log('ALL USERS:', JSON.stringify(users, null, 2));
}

main();
