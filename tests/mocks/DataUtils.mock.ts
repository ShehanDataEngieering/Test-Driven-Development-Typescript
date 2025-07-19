/**
 * Mock implementations for DataUtils
 */

export const generateId = jest.fn().mockReturnValue("test-uuid");

export const mapRowToUser = jest.fn((row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
}));
