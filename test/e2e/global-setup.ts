import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';

async function resetDatabase() {
  const prisma = new PrismaClient();
  try {
    console.log('🚀 Resetting database...');
    // TRUNCATE all tables in correct order or using CASCADE
    // We use CASCADE to handle foreign key constraints automatically
    await prisma.$executeRawUnsafe(`
      TRUNCATE TABLE 
        "SaleItem", 
        "Payment", 
        "Sale", 
        "Invoice", 
        "Transaction", 
        "Inventory", 
        "StockMovement", 
        "StockTransfer", 
        "ProductVariant", 
        "Product", 
        "User", 
        "Branch", 
        "Customer" 
      RESTART IDENTITY CASCADE;
    `);
    console.log('✅ Database truncated successfully.');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function setup() {
  console.log('🛠️ Running Global Setup...');
  
  try {
    // 1. Ensure schema is up to date using migrate deploy (Production approach)
    console.log('📦 Deploying Prisma migrations...');
    execSync('npx prisma migrate deploy --schema=apps/backend/prisma/schema.prisma', {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    // 2. Full reset of the database
    await resetDatabase();

    console.log('✨ Global Setup completed successfully.');
  } catch (error) {
    console.error('❌ Global Setup failed:', error);
    process.exit(1);
  }
}

export async function teardown() {
  // No specific teardown needed for DB
}
