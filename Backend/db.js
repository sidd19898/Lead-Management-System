const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: process.env.DB_PASSWORD,
  database: "LMS",
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