import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('🚀 Attempting to connect to the database...');
    await prisma.$connect();
    console.log('✅ Connection successful! Prisma Client is able to reach the database.');
  } catch (e) {
    console.error('❌ Connection failed:');
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
