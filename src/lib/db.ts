import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getPool() {
  if (pool) return pool;
  const host = process.env.DB_HOST || "";
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || "";
  const password = process.env.DB_PASSWORD || "";
  const database = process.env.DB_NAME || "";

  pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  return pool;
}
