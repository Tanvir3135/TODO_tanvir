const { Pool } = require('pg');

const openDB = () => {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: process.env.SSL,
  })
  return pool
}

const query = async (text, values = []) => {
  try {
    const res = await pool.query(text, values);
    return res;
  } catch (err) {
    console.error('Error executing query:', err.stack);
    throw err;
  }
};

module.exports = { query };