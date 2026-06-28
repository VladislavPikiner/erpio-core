const { Client } = require('pg');

async function run() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    console.log('Database reset successfully.');
  } catch (err) {
    console.error('Database reset failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}
run();
