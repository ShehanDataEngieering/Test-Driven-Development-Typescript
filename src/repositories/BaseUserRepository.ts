import { User, CreateUserInput, UpdateUserInput } from "../types/User";

export abstract class BaseUserRepository {
  abstract create(input: CreateUserInput): Promise<User>;
  abstract findById(id: string): Promise<User>;
  abstract findAll(): Promise<User[]>;
  abstract update(id: string, input: UpdateUserInput): Promise<User>;
  abstract delete(id: string): Promise<boolean>;

  // This is kept as nullable specifically because it's used for checking existence
  abstract findByEmail(email: string): Promise<User | null>;

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

  /**
   * Helper for "not found" errors - preserves the original error if it contains "not found"
   * @param operation The operation description
   * @param error The caught error
   */
  protected handleNotFoundError(operation: string, error: unknown): never {
    this.handleDbError(operation, error, (err) => {
      if (err.message.includes("not found")) {
        return err;
      }
      this.handleDbError(operation, err);
    });
  }

  /**
   * Helper for validating required parameters
   * @param value The value to check
   * @param name Parameter name for the error message
   */
  protected validateRequired(
    value: string | undefined | null,
    name: string
  ): void {
    if (!value) {
      throw new Error(`${name} is required`);
    }
  }
}
