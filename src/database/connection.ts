import { Pool, PoolClient, QueryResult } from "pg";
import { databaseConfig } from "../config/environment";

// Create the connection pool immediately
export const pool = new Pool({
  host: databaseConfig.host,
  port: databaseConfig.port,
  database: databaseConfig.database,
  user: databaseConfig.user,
  password: databaseConfig.password,
});

pool.on("connect", () => {
  console.log("PostgreSQL pool connected");
});

pool.on("error", (err) => {
  console.error("PostgreSQL pool error:", err);
});

export const getPool = (): Pool => {
  return pool;
};

export const getClient = async (): Promise<PoolClient> => {
  return pool.connect();
};

/**
 * Execute a query using the pool
 */
export const query = async (
  text: string,
  params?: any[]
): Promise<QueryResult> => {
  return pool.query(text, params);
};

export const closePool = async (): Promise<void> => {
  await pool.end();
};

// ...existing code for createTables, clearTables, etc...

// Export the pool directly (like your mongoose.connection export)
export const connection = pool;

/**
 * Create necessary database tables
 */
export const createTables = async (): Promise<void> => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await query(createUsersTable);
};

/**
 * Clear all data from tables (useful for testing)
 */
export const clearTables = async (): Promise<void> => {
  await query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
};

/**
 * Check if database connection is healthy
 */
export const healthCheck = async (): Promise<boolean> => {
  try {
    const result = await query("SELECT 1 as health");
    return result.rows[0].health === 1;
  } catch (error) {
    return false;
  }
};

/**
 * Get database version information
 */
export const getDatabaseInfo = async (): Promise<{
  version: string;
  currentTime: Date;
}> => {
  const versionResult = await query("SELECT version()");
  const timeResult = await query("SELECT NOW() as current_time");

  return {
    version: versionResult.rows[0].version,
    currentTime: timeResult.rows[0].current_time,
  };
};
