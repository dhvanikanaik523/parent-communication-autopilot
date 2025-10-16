// test_db.js
require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

(async () => {
  try {
    await client.connect();
    const dbRes = await client.query('SELECT current_database() AS db;');
    const schemaRes = await client.query("SELECT current_schema() AS schema;");
    const rulesRes = await client.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_name = 'rules';
    `);

    console.log('⤷ Connected database:', dbRes.rows[0].db);
    console.log('⤷ Current schema:', schemaRes.rows[0].schema);
    console.log('⤷ rules table rows found (info_schema):', rulesRes.rows);
  } catch (err) {
    console.error('ERROR connecting to DB:', err.message);
  } finally {
    await client.end();
  }
})();
