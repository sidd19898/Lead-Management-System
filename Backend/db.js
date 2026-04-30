const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testDB() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("DB Connected ", res.rows);
  } catch (err) {
    console.error("DB Error ", err);
  }
}

testDB();

module.exports = pool;