const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: '127.0.0.1',
  database: 'erpio_db',
  password: 'password',
  port: 5433,
});
client.connect()
  .then(() => { 
    console.log('✅ Connection successful!'); 
    process.exit(0); 
  })
  .catch(err => { 
    console.error('❌ Connection failed:', err.message); 
    process.exit(1); 
  });
