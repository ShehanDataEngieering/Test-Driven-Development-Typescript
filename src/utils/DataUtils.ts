import { User } from "../types/User";

/**
 * Generates a unique ID for database entities
 * @returns A unique string ID combining timestamp and random characters
 */
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

/**
 * Maps database row object to User type
 * @param row Database row result
 * @returns Properly formatted User object
 */
export function mapRowToUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}
