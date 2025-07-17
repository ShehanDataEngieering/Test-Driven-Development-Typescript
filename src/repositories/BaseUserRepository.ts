import { User, CreateUserInput, UpdateUserInput } from "../types/User";

export abstract class BaseUserRepository {
  abstract create(input: CreateUserInput): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract update(id: string, input: UpdateUserInput): Promise<User | null>;
  abstract delete(id: string): Promise<boolean>;

  public validateCreateInput(input: CreateUserInput): void {
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
}
