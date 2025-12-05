/**
 * Script to make a user an admin
 * Usage: docker-compose exec backend sh -c "cd packages/backend && npx ts-node scripts/make-admin.ts <email>"
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    // Note: Using type assertion due to TypeScript language server cache - role field exists in DB
    const userRole = (user as any).role || 'user';

    if (userRole === 'admin') {
      console.log(`User ${email} is already an admin`);
      process.exit(0);
    }

    await (prisma.user as any).update({
      where: { email },
      data: { role: 'admin' },
    });

    console.log(`✅ Successfully made ${email} an admin`);
  } catch (error) {
    console.error('Error making user admin:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];

if (!email) {
  console.error('Usage: npx ts-node scripts/make-admin.ts <email>');
  process.exit(1);
}

makeAdmin(email);

