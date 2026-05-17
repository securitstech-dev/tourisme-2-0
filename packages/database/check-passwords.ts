import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    where: { role: 'OPERATOR' },
    select: { email: true, passwordHash: true }
  });

  console.log('--- OPERATORS IN DB ---');
  for (const user of users) {
    const isMatch = await bcrypt.compare('Congo2026!', user.passwordHash || '');
    console.log(`Email: ${user.email} | Password Match ('Congo2026!'): ${isMatch}`);
  }

  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
    select: { email: true, passwordHash: true }
  });

  if (admin) {
    console.log('--- ADMIN IN DB ---');
    const isMatch = await bcrypt.compare('Congo2026!', admin.passwordHash || '');
    console.log(`Email: ${admin.email} | Password Match ('Congo2026!'): ${isMatch}`);
  }

  await prisma.$disconnect();
}

checkUsers();
