import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function resetPassword() {
  const passwordHash = await bcrypt.hash('Congo2026!', 12);
  
  await prisma.user.update({
    where: { email: 'jeanroyalmatoko@gmail.com' },
    data: { passwordHash, isActive: true }
  });

  console.log('✅ Mot de passe réinitialisé pour jeanroyalmatoko@gmail.com : Congo2026!');
  
  await prisma.$disconnect();
}

resetPassword();
