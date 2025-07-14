import { User, CreateUserInput, UpdateUserInput } from "../types/User";

export class UserRepository {
  // TODO: Implement CRUD methods following TDD approach

  async create(input: CreateUserInput): Promise<User> {
    // Validate input
    this.validateCreateInput(input);

    const user: User = {
      id: this.generateId(), // Generate unique ID
      name: input.name,
      email: input.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Simulate saving to a database
    return user;
  }

  private validateCreateInput(input: CreateUserInput): void {
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

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  async findById(id: string): Promise<User | null> {
    // TODO: Implement findById method
     

    throw new Error("Method not implemented");
  }

  async findAll(): Promise<User[]> {
    // TODO: Implement findAll method
    throw new Error("Method not implemented");
  }

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    // TODO: Implement update method
    throw new Error("Method not implemented");
  }

  async delete(id: string): Promise<boolean> {
    // TODO: Implement delete method
    throw new Error("Method not implemented");
  }
}
