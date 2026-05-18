import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const operators = await prisma.operator.findMany({
    include: { user: true }
  });
  console.log('Operators:', JSON.stringify(operators, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
