import { CreateUserInput, UpdateUserInput, User } from "../../src/types/User";

/**
 * Test data factory for creating User objects and inputs
 */
export class UserTestData {
  static createValidUserInput(): CreateUserInput {
    return {
      name: "John Doe",
      email: "john.doe@example.com",
    };
  }

  static createValidUserInputWithCustomData(
    overrides: Partial<CreateUserInput>
  ): CreateUserInput {
    return {
      ...this.createValidUserInput(),
      ...overrides,
    };
  }

  static createMultipleUserInputs(count: number): CreateUserInput[] {
    return Array.from({ length: count }, (_, index) => ({
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
    }));
  }

  static createUpdateUserInput(): UpdateUserInput {
    return {
      name: "Jane Doe",
      email: "jane.doe@example.com",
    };
  }

  static createMockUser(): User {
    return {
      id: "test-uuid-123",
      name: "John Doe",
      email: "john.doe@example.com",
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    };
  }

  static createMockUsers(count: number): User[] {
    return Array.from({ length: count }, (_, index) => ({
      id: `test-uuid-${index + 1}`,
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      createdAt: new Date("2024-01-01T00:00:00Z"),
      updatedAt: new Date("2024-01-01T00:00:00Z"),
    }));
  }

  // Edge cases and invalid data
  static createInvalidUserInputs() {
    return {
      emptyName: { name: "", email: "test@example.com" },
      emptyEmail: { name: "Test User", email: "" },
      invalidEmail: { name: "Test User", email: "invalid-email" },
      nullName: { name: null as any, email: "test@example.com" },
      nullEmail: { name: "Test User", email: null as any },
    };
  }
}
