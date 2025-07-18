import { User, CreateUserInput, UpdateUserInput } from "../types/User";

export abstract class BaseUserRepository {
  abstract create(input: CreateUserInput): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract update(id: string, input: UpdateUserInput): Promise<User | null>;
  abstract delete(id: string): Promise<boolean>;

  public validateCreateInput(input: CreateUserInput | UpdateUserInput): void {
    if (!input.name || input.name.trim() === "") {
      throw new Error("Name cannot be empty");
    }

    if (!input.email || input.email.trim() === "") {
      throw new Error("Email cannot be empty");
    }

    if (!this.isValidEmail(input.email)) {
      throw new Error("Invalid email format");
    }
  }

  public isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  public mapRowToUser(row: any): User {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  /**
   * Centralized error handler for database operations
   * @param operation Description of the operation that failed (e.g., "Failed to create user")
   * @param error The caught error object
   * @param customHandler Optional function to handle specific error cases differently
   * @throws Error with formatted error message
   */
  protected handleDbError(
    operation: string,
    error: unknown,
    customHandler?: (err: Error) => Error | undefined
  ): never {
    // If it's a custom error with a specific message pattern that needs special handling
    if (error instanceof Error && customHandler) {
      const customError = customHandler(error);
      if (customError) {
        throw customError;
      }
    }

    // Default error handling
    throw new Error(
      `${operation}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
