import mysql from "mysql2/promise";

const dbHost = process.env.DB_HOST || "localhost";
const isUnixSocket = dbHost.startsWith("/");

// Connection pool — reused across API route invocations
// Cloud Run connects to Cloud SQL via Unix socket; local dev uses TCP.
const pool = mysql.createPool({
  ...(isUnixSocket
    ? { socketPath: dbHost }
    : { host: dbHost, port: parseInt(process.env.DB_PORT || "3306") }),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cs348_movies",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
