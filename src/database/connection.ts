import { Pool, PoolClient, QueryResult } from "pg";
import { databaseConfig } from "../config/environment";

export class DatabaseConnection {
  private pool: Pool;
  private connected: boolean = false;

  constructor() {
    this.pool = new Pool({
      host: databaseConfig.host,
      port: databaseConfig.port,
      database: databaseConfig.database,
      user: databaseConfig.user,
      password: databaseConfig.password,
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.pool.on("connect", () => {
      console.log("PostgreSQL pool connected");
      this.connected = true;
    });

    this.pool.on("error", (err) => {
      console.error("PostgreSQL pool error:", err);
      this.connected = false;
    });
  }

  /**
   * Execute a query using the pool
   */
  async query(text: string, params?: any[]): Promise<QueryResult> {
    return this.pool.query(text, params);
  }

  /**
   * Get a client from the pool
   */
  async getClient(): Promise<PoolClient> {
    return this.pool.connect();
  }

  /**
   * Check if database connection is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query("SELECT 1 as health");
      return result.rows[0].health === 1;
    } catch (error) {
      return false;
    }
  }

  /**
   * Create necessary database tables
   */
  async createTables(): Promise<void> {
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await this.query(createUsersTable);
  }

  /**
   * Clear all data from tables (useful for testing)
   */
  async clearTables(): Promise<void> {
    await this.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
  }

  /**
   * Get database version information
   */
  async getDatabaseInfo(): Promise<{
    version: string;
    currentTime: Date;
  }> {
    const versionResult = await this.query("SELECT version()");
    const timeResult = await this.query("SELECT NOW() as current_time");

    return {
      version: versionResult.rows[0].version,
      currentTime: timeResult.rows[0].current_time,
    };
  }

  /**
   * Close the pool connection
   */
  async close(): Promise<void> {
    await this.pool.end();
    this.connected = false;
  }

  /**
   * Check if connection is active
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Get the raw pool instance (for advanced usage)
   */
  getPool(): Pool {
    return this.pool;
  }
}

// Create singleton instance
export const databaseConnection = new DatabaseConnection();

// Export convenience methods for backward compatibility
export const pool = databaseConnection.getPool();
export const query = databaseConnection.query.bind(databaseConnection);
export const getClient = databaseConnection.getClient.bind(databaseConnection);
export const healthCheck = databaseConnection.healthCheck.bind(databaseConnection);
export const createTables = databaseConnection.createTables.bind(databaseConnection);
export const clearTables = databaseConnection.clearTables.bind(databaseConnection);
export const closePool = databaseConnection.close.bind(databaseConnection);
export const getDatabaseInfo = databaseConnection.getDatabaseInfo.bind(databaseConnection);

