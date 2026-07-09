import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// SSL is only enabled when DB_SSL=true is set in .env (used for TiDB Cloud / cloud MySQL).
// Local XAMPP/MySQL setups are unaffected since DB_SSL is left unset there.
const sslConfig = process.env.DB_SSL === 'true'
  ? { rejectUnauthorized: true }
  : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(sslConfig ? { ssl: sslConfig } : {})
});

export default pool;
