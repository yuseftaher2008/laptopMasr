import pkg from 'pg'
const { Client } = pkg
import 'dotenv/config'

const newDatabaseName = 'ecommerce';

// Connect to the default 'postgres' database first
const client = new Client({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  database: 'postgres',
});
(async () => {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL server.');

    // Check if database already exists
    const checkDb = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [newDatabaseName]
    );

    if (checkDb.rowCount > 0) {
      console.log(`Database "${newDatabaseName}" already exists.`);
    } else {
      // Create the new database
      await client.query(`CREATE DATABASE ${newDatabaseName}`);
      console.log(`Database "${newDatabaseName}" created successfully.`);
    }
  } catch (err) {
    console.error('Error creating database:', err.message);
  } finally {
    await client.end();
    console.log('Connection closed.');
  }
})();