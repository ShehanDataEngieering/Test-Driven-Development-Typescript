import dotenv from "dotenv";
import path from "path";

// Load environment-specific .env file
const env = process.env.NODE_ENV || "";
const envPath = env === "test" ? ".env.test" : ".env";

dotenv.config({ path: path.resolve(process.cwd(), envPath) });

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export interface AppConfig {
  nodeEnv: string;
  port: number;
  logLevel: string;
  verbose: boolean;
}

export const databaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST || "",
  port: parseInt(process.env.DB_PORT || "", 10),
  database: process.env.DB_NAME || "",
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
};

export const appConfig: AppConfig = {
  nodeEnv: process.env.NODE_ENV || "",
  port: parseInt(process.env.APP_PORT || "", 10),
  logLevel: process.env.LOG_LEVEL || "",
  verbose: process.env.VERBOSE === "true",
};

// Validation
if (!databaseConfig.host) {
  throw new Error("DB_HOST is required");
}

if (!databaseConfig.database) {
  throw new Error("DB_NAME is required");
}

if (!databaseConfig.user) {
  throw new Error("DB_USER is required");
}

export const isDevelopment = appConfig.nodeEnv === "development";
export const isTest = appConfig.nodeEnv === "test";
