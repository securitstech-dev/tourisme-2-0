import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.operator.updateMany({
    where: { isValidated: false },
    data: { isValidated: true, validatedAt: new Date() }
  });
  console.log(`Validated ${result.count} operators!`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
