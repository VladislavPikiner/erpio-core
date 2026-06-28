import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import path from 'path';
import fs from 'fs';

function loadEnv() {
  const envPath = path.resolve(process.cwd(), 'apps/backend/.env');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    envFile.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim().replace(/"/g, '');
      }
    });
  }
}

async function resetDatabase() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  
  try {
    console.log('🚀 Resetting database...');
    
    // Dynamically fetch all table names in the public schema to avoid "relation does not exist" errors
    const tables = await prisma.$queryRawUnsafe<{ table_name: string }[]>(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE' 
        AND table_name != '_prisma_migrations';
    `);

    if (tables.length > 0) {
      const tableNames = tables.map(t => `"${t.table_name}"`).join(', ');
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`);
      console.log(`✅ Truncated tables: ${tableNames}`);
    } else {
      console.log('ℹ️ No tables found to truncate.');
    }
    
    console.log('✅ Database truncated successfully.');
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

export async function setup() {
  console.log('🛠️ Running Global Setup...');
  loadEnv();
  
  const dbUrl = "postgresql://postgres:password@localhost:5433/erpio_db?schema=public";
  
  try {
    console.log('📦 Regenerating Prisma client...');
    execSync('npx prisma generate --schema=apps/backend/prisma/schema.prisma', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: dbUrl },
    });

    console.log('📦 Resetting database (db push --force-reset)...');
    execSync('npx prisma db push --force-reset --schema=apps/backend/prisma/schema.prisma', {
      stdio: 'inherit',
      env: { ...process.env, DATABASE_URL: dbUrl },
    });

    console.log('✨ Global Setup completed successfully.');
  } catch (error) {
    console.error('❌ Global Setup failed:', error);
    process.exit(1);
  }
}

export async function teardown() {
  // No specific teardown needed for DB
}
