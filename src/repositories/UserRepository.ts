import { User, CreateUserInput, UpdateUserInput } from "../types/User";
import { BaseUserRepository } from "./BaseUserRepository";

export class UserRepository extends BaseUserRepository {
  // TODO: Implement CRUD methods following TDD approach

  async create(input: CreateUserInput): Promise<User> {
    // Validate input using inherited method
    this.validateCreateInput(input);

    const user: User = {
      id: this.generateId(), // Use inherited method
      name: input.name,
      email: input.email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Simulate saving to a database
    return user;
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
