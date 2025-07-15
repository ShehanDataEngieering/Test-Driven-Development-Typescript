import { CreateUserInput, UpdateUserInput, User } from '../../src/types/User';

// Interface to define the contract for UserRepository
interface IUserRepository {
  create(input: CreateUserInput): Promise<User>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, input: UpdateUserInput): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Mock implementation of UserRepository for testing
 */
export class MockUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();
  private nextId = 1;

  async create(input: CreateUserInput): Promise<User> {
    // Simulate validation errors
    if (!input.name || input.name.trim() === '') {
      throw new Error('Name cannot be empty');
    }
    if (!input.email || input.email.trim() === '') {
      throw new Error('Email cannot be empty');
    }
    if (!this.isValidEmail(input.email)) {
      throw new Error('Invalid email format');
    }

    const id = `mock-id-${this.nextId++}`;
    const now = new Date();
    
    const user: User = {
      id,
      name: input.name,
      email: input.email,
      createdAt: now,
      updatedAt: now
    };

    this.users.set(id, user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) {
      return null;
    }

    const updatedUser: User = {
      ...user,
      ...input,
      updatedAt: new Date()
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Helper methods for testing
  clear(): void {
    this.users.clear();
    this.nextId = 1;
  }

  getStoredUsers(): User[] {
    return Array.from(this.users.values());
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
